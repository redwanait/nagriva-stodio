import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import {
  startContactMethodValue,
  startContactOptions,
  startNeedValue,
  startSubmitMessages,
  startValidation,
  startVerificationMessages,
} from "../data/startPage";
import {
  findPortfolioProject,
  normalizeProjectId,
  type PortfolioProjectMatch,
} from "../lib/projectReference";
import type { StartFieldErrors, StartFieldTouched, StartFormState } from "../components/start/types";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY;
/** Long enough for a slow mobile connection, short enough that the button never hangs. */
const INQUIRY_TIMEOUT_MS = 30000;

type VerificationIssue = "failed" | "unavailable";

/** Thrown for failures whose message is already written for the visitor. */
class StartSubmitError extends Error {}

const EMPTY_FORM: StartFormState = {
  fullName: "",
  email: "",
  phone: "",
  need: "",
  company: "",
  budget: "",
  timeline: "",
  contactMethod: startContactOptions[0],
  description: "",
  projectId: "",
  website: "",
};

const STEP_ONE_FIELDS: Array<keyof StartFormState> = ["fullName", "email", "phone", "need"];

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

function validateStepOne(form: StartFormState): StartFieldErrors {
  const errors: StartFieldErrors = {};

  if (form.fullName.trim() === "") errors.fullName = startValidation.fullName;
  if (form.email.trim() === "") errors.email = startValidation.emailEmpty;
  else if (!isValidEmail(form.email)) errors.email = startValidation.emailInvalid;
  if (form.phone.trim() === "") errors.phone = startValidation.phoneEmpty;
  else if (!isValidPhone(form.phone)) errors.phone = startValidation.phoneInvalid;
  if (form.need === "") errors.need = startValidation.need;

  return errors;
}

function describeVerification(
  issue: VerificationIssue | null,
  waiting: boolean,
  hasToken: boolean,
): string {
  if (issue === "unavailable") return startVerificationMessages.unavailable;
  if (issue === "failed") return startVerificationMessages.failed;
  if (!waiting) return "";
  return hasToken ? startVerificationMessages.ready : startVerificationMessages.checking;
}

function createTurnstileScript(): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = TURNSTILE_SCRIPT_SRC;
  script.async = true;
  document.head.appendChild(script);
  return script;
}

/** v4 UUID used as the server-side idempotency key, with a fallback for older browsers. */
function createSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type StartFlow = {
  form: StartFormState;
  errors: StartFieldErrors;
  submitting: boolean;
  submitError: string;
  /** Guidance about the verification check. Empty when there is nothing to say. */
  verificationNotice: string;
  turnstileContainerRef: RefObject<HTMLDivElement | null>;
  update: (patch: Partial<StartFormState>) => void;
  markTouched: (fields: Array<keyof StartFormState>) => void;
  /** True once the four Step 01 essentials are all valid. */
  stepOneValid: boolean;
  /** Portfolio project matching the entered Project ID, if any. Never blocks submit. */
  projectMatch: PortfolioProjectMatch | null;
  /** True when a Project ID was entered, blurred, and did not match. Never blocks submit. */
  projectIdNotFound: boolean;
  /**
   * Both steps submit the same request. Step 01 is enough on its own; Step 02
   * only enriches the payload built from the shared form state.
   */
  submit: () => Promise<boolean>;
};

export function useStartFlow(): StartFlow {
  const [form, setForm] = useState<StartFormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<StartFieldTouched>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [waitingForToken, setWaitingForToken] = useState(false);
  const [verificationIssue, setVerificationIssue] = useState<VerificationIssue | null>(() =>
    TURNSTILE_SITE_KEY ? null : "unavailable",
  );

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetRef = useRef<string | null>(null);
  // Blocks a second submit while one is still in flight (double tap, Enter held down).
  const inFlightRef = useRef(false);
  // Idempotency key for the server-side insert. Generated once per visit and reused
  // on every retry, so a retry after a dropped response writes no second row.
  const submissionIdRef = useRef<string | null>(null);

  const update = useCallback((patch: Partial<StartFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const markTouched = useCallback((fields: Array<keyof StartFormState>) => {
    setTouched((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  }, []);

  // The widget is mounted once and kept alive across both steps, so moving forward
  // and back never asks the visitor to solve it twice.
  const mountTurnstile = useCallback(() => {
    const container = turnstileContainerRef.current;
    if (!TURNSTILE_SITE_KEY || !container || turnstileWidgetRef.current || !window.turnstile) return;

    turnstileWidgetRef.current = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        setTurnstileToken(token);
        setVerificationIssue(null);
      },
      "error-callback": () => {
        setTurnstileToken("");
        setVerificationIssue("failed");
      },
      "expired-callback": () => {
        setTurnstileToken("");
      },
      theme: "auto",
    });
  }, []);

  // The script is only needed on this page, so it is requested here instead of
  // from index.html. The widget mounts on the script's load event. There is no
  // timed polling, so a slow connection cannot leave the form permanently blocked.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (window.turnstile) {
      mountTurnstile();
      return;
    }

    const script =
      document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_SRC}"]`) ??
      createTurnstileScript();
    const handleLoad = () => mountTurnstile();
    const handleError = () => setVerificationIssue("unavailable");

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [mountTurnstile]);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    if (turnstileWidgetRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetRef.current);
    }
  }, []);

  // Only errors on fields the visitor has already interacted with are shown, so
  // an untouched form never opens with red text.
  const errors = useMemo((): StartFieldErrors => {
    const found = validateStepOne(form);
    const visible: StartFieldErrors = {};
    STEP_ONE_FIELDS.forEach((field) => {
      if (touched[field] && found[field]) {
        visible[field] = found[field];
      }
    });
    return visible;
  }, [form, touched]);

  const need = startNeedValue[form.need] ?? "";

  const stepOneValid = useMemo(
    () => Object.keys(validateStepOne(form)).length === 0,
    [form],
  );

  // Lookup is read-only against the existing portfolio data. An unknown ID is
  // still sent with the request; only the inline hint depends on the match.
  const projectMatch = useMemo(() => findPortfolioProject(form.projectId), [form.projectId]);
  const projectIdNotFound =
    touched.projectId === true && normalizeProjectId(form.projectId) !== "" && projectMatch === null;

  const persist = useCallback(async (): Promise<boolean> => {
    inFlightRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    setWaitingForToken(false);

    // The existing API requires a non-empty description, so Step 01 alone sends
    // a short placeholder. TEMPORARY: replace once the endpoint accepts an
    // optional projectDescription.
    const projectDescription =
      form.description.trim() !== ""
        ? form.description.trim()
        : "No project details provided — sent from the contact step only.";

    // Sent only when a Project ID was entered, so the no-ID request is unchanged.
    // An unknown ID is kept as entered (normalized); title and link come only from a match.
    const projectReference = normalizeProjectId(form.projectId);
    const projectFields =
      projectReference !== ""
        ? {
            projectReference,
            ...(projectMatch
              ? { projectTitle: projectMatch.title, projectUrl: projectMatch.websiteUrl }
              : {}),
          }
        : {};

    // One set of fields feeds the single server request. Step 01 is the lead.
    // Step 02 only adds qualification to the same request. Nothing is written
    // from the browser: /api/inquiry verifies Turnstile and persists server-side.
    const fields = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      need,
      projectDescription,
      budget: form.budget,
      preferredContact: startContactMethodValue[form.contactMethod] ?? "Email",
      phone: form.phone.trim(),
      ...projectFields,
    };

    // Reused across retries within this visit so the server treats them as the
    // same submission and never stores a second row for it.
    if (!submissionIdRef.current) {
      submissionIdRef.current = createSubmissionId();
    }
    let tokenSent = false;

    try {
      // The server verifies Turnstile first, then stores the row, then sends the
      // emails. Only a 2xx response means every required step completed.
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), INQUIRY_TIMEOUT_MS);
      let response: Response;
      tokenSent = true;
      try {
        response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: submissionIdRef.current,
            ...fields,
            website: form.website,
            turnstileToken,
          }),
          signal: controller.signal,
        });
      } catch {
        throw new StartSubmitError(
          controller.signal.aborted ? startSubmitMessages.timeout : startSubmitMessages.network,
        );
      } finally {
        window.clearTimeout(timeout);
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: unknown;
          errors?: unknown;
        } | null;
        if (typeof data?.error === "string" && data.error !== "") {
          throw new StartSubmitError(data.error);
        }
        throw new StartSubmitError(
          data?.errors ? startSubmitMessages.invalid : startSubmitMessages.failed,
        );
      }

      resetTurnstile();
      return true;
    } catch (err) {
      // A verification token can only be used once, so it is cleared after any attempt
      // that reached the server. A failure before that leaves it valid for the next try.
      if (tokenSent) resetTurnstile();
      setSubmitError(err instanceof StartSubmitError ? err.message : startSubmitMessages.failed);
      return false;
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }, [form, need, projectMatch, resetTurnstile, turnstileToken]);

  const submit = useCallback(async (): Promise<boolean> => {
    if (inFlightRef.current) return false;

    markTouched(STEP_ONE_FIELDS);

    if (Object.keys(validateStepOne(form)).length > 0) return false;

    // Without the widget there is no way to verify the visitor. The notice explains
    // this, so the form does not wait on a check that can never finish.
    if (verificationIssue === "unavailable") return false;

    // An empty token means the check is still running or has failed. Say so and let
    // the visitor press Submit again once it is ready.
    if (turnstileToken === "") {
      if (verificationIssue === "failed" && turnstileWidgetRef.current && window.turnstile) {
        setVerificationIssue(null);
        window.turnstile.reset(turnstileWidgetRef.current);
      }
      setWaitingForToken(true);
      return false;
    }

    return persist();
  }, [form, markTouched, persist, turnstileToken, verificationIssue]);

  return {
    form,
    errors,
    submitting,
    submitError,
    verificationNotice: describeVerification(
      verificationIssue,
      waitingForToken,
      turnstileToken !== "",
    ),
    turnstileContainerRef,
    update,
    markTouched,
    stepOneValid,
    projectMatch,
    projectIdNotFound,
    submit,
  };
}

export type { StartFieldErrors, StartFieldTouched, StartFormState };
