import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import {
  startContactMethodValue,
  startContactOptions,
  startNeedValue,
  startValidation,
} from "../data/startPage";
import { submitStartInquiry } from "../lib/startInquiryService";
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

export type StartFlow = {
  form: StartFormState;
  errors: StartFieldErrors;
  submitting: boolean;
  submitError: string;
  pendingVerification: boolean;
  turnstileContainerRef: RefObject<HTMLDivElement | null>;
  update: (patch: Partial<StartFormState>) => void;
  markTouched: (fields: Array<keyof StartFormState>) => void;
  /** True once the four Step 01 essentials are all valid. */
  stepOneValid: boolean;
  /**
   * Both steps submit the same request. Step 01 is enough on its own; Step 02
   * only enriches the payload built from the shared form state.
   */
  submit: () => Promise<boolean>;
  mountTurnstile: () => void;
};

export function useStartFlow(): StartFlow {
  const [form, setForm] = useState<StartFormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<StartFieldTouched>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetRef = useRef<string | null>(null);

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

  // The widget is mounted once by the page and kept alive across both steps, so
  // moving forward and back never asks the visitor to solve it twice.
  const mountTurnstile = useCallback(() => {
    const container = turnstileContainerRef.current;
    if (!container || turnstileWidgetRef.current || !window.turnstile) return false;

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) return false;

    container.innerHTML = "";
    turnstileWidgetRef.current = window.turnstile.render(container, {
      sitekey: siteKey,
      callback: (token: string) => {
        setTurnstileToken(token);
        setPendingVerification(false);
      },
      "error-callback": () => {
        setTurnstileToken("");
        setPendingVerification(true);
      },
      "expired-callback": () => {
        setTurnstileToken("");
        setPendingVerification(true);
      },
      theme: "auto",
    });
    return true;
  }, []);

  // The Turnstile script is loaded asynchronously, so the first render can run
  // before `window.turnstile` exists. Poll briefly until it is available so the
  // check never silently disappears.
  useEffect(() => {
    if (mountTurnstile()) return;

    const interval = window.setInterval(() => {
      if (mountTurnstile()) {
        window.clearInterval(interval);
      }
    }, 400);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
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

  const persist = useCallback(async () => {
    setSubmitting(true);
    setSubmitError("");
    setPendingVerification(false);

    // The existing API requires a non-empty description, so Step 01 alone sends
    // a short placeholder. TEMPORARY: replace once the endpoint accepts an
    // optional projectDescription.
    const projectDescription =
      form.description.trim() !== ""
        ? form.description.trim()
        : "No project details provided — sent from the contact step only.";

    try {
      // Step 01 is the lead. Step 02 only adds qualification to that same
      // request, so both steps build one payload from the shared form state.
      await submitStartInquiry({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        need,
        projectDescription,
        budget: form.budget,
        preferredContact: startContactMethodValue[form.contactMethod] ?? "Email",
        phone: form.phone.trim(),
      });

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          need,
          projectDescription,
          budget: form.budget,
          preferredContact: startContactMethodValue[form.contactMethod] ?? "Email",
          phone: form.phone.trim(),
          website: form.website,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Submission failed.");
      }

      resetTurnstile();
      return true;
    } catch (err) {
      resetTurnstile();
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Sorry — we couldn't send your request right now. Please try again in a moment.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [form, need, resetTurnstile, turnstileToken]);

  const submit = useCallback(async () => {
    markTouched(STEP_ONE_FIELDS);

    if (Object.keys(validateStepOne(form)).length > 0) return false;

    // An empty token means the widget is still solving. Surface that instead of
    // submitting a request that the server will reject.
    if (turnstileToken === "") {
      setPendingVerification(true);
      return false;
    }

    return persist();
  }, [form, markTouched, persist, turnstileToken]);

  return {
    form,
    errors,
    submitting,
    submitError,
    pendingVerification,
    turnstileContainerRef,
    update,
    markTouched,
    stepOneValid,
    submit,
    mountTurnstile,
  };
}

export type { StartFieldErrors, StartFieldTouched, StartFormState };