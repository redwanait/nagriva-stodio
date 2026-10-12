import { useEffect, useRef, useState, type FormEvent } from "react";

import { submitCallBooking } from "../lib/callBookingService";

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

const NAME_BASE = "Redouane";
const NAME_SUFFIX = " Ait EL-Hadj";
const NAME_PLACEHOLDER = "Redouane.";
const PHONE_PLACEHOLDER = "+212 6XX XXX XXX";
const PHONE_ACTUAL = "+212 628427278";

const NAME_START_PAUSE = 1100;
const NAME_HOLD = 3000;
const PHONE_HOLD = 2200;
const CYCLE_GAP = 700;
const TYPE_MS = 95;
const DELETE_MS = 55;

function RappelCard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [shouldReduceMotion, setShouldReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [namePreview, setNamePreview] = useState<string | null>(
    shouldReduceMotion ? null : NAME_BASE,
  );
  const [phonePreview, setPhonePreview] = useState<string | null>(
    shouldReduceMotion ? null : PHONE_PLACEHOLDER,
  );

  const nameInteractedRef = useRef(false);
  const phoneInteractedRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) =>
      setShouldReduceMotion(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || submitted) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const typeName = async () => {
      for (let i = 1; i <= NAME_SUFFIX.length; i += 1) {
        if (cancelled || nameInteractedRef.current) return;
        setNamePreview(NAME_BASE + NAME_SUFFIX.slice(0, i));
        await sleep(TYPE_MS);
      }
    };

    const eraseName = async () => {
      for (let i = NAME_SUFFIX.length - 1; i >= 0; i -= 1) {
        if (cancelled || nameInteractedRef.current) return;
        setNamePreview(NAME_BASE + NAME_SUFFIX.slice(0, i));
        await sleep(DELETE_MS);
      }
    };

    const morphPhone = async (from: string, to: string) => {
      let prefix = 0;
      while (
        prefix < from.length &&
        prefix < to.length &&
        from[prefix] === to[prefix]
      ) {
        prefix += 1;
      }
      for (let i = from.length; i > prefix; i -= 1) {
        if (cancelled || phoneInteractedRef.current) return;
        setPhonePreview(from.slice(0, i - 1));
        await sleep(DELETE_MS);
      }
      for (let i = prefix + 1; i <= to.length; i += 1) {
        if (cancelled || phoneInteractedRef.current) return;
        setPhonePreview(to.slice(0, i));
        await sleep(TYPE_MS);
      }
    };

    const run = async () => {
      while (!cancelled) {
        if (!nameInteractedRef.current) {
          setNamePreview(NAME_BASE);
          await sleep(NAME_START_PAUSE);
          if (cancelled) return;
          await typeName();
          if (cancelled) return;
          if (nameInteractedRef.current) {
            setNamePreview(null);
          } else {
            await sleep(NAME_HOLD);
            if (cancelled) return;
            await eraseName();
            if (cancelled) return;
            setNamePreview(NAME_BASE);
          }
        }

        if (!phoneInteractedRef.current) {
          await sleep(CYCLE_GAP);
          if (cancelled) return;
          await morphPhone(PHONE_PLACEHOLDER, PHONE_ACTUAL);
          if (cancelled) return;
          if (!phoneInteractedRef.current) {
            await sleep(PHONE_HOLD);
            if (cancelled) return;
            await morphPhone(PHONE_ACTUAL, PHONE_PLACEHOLDER);
            if (cancelled) return;
          }
        }

        if (nameInteractedRef.current && phoneInteractedRef.current) return;
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timer !== null) clearTimeout(timer);
    };
  }, [shouldReduceMotion, submitted]);

  const stopNameAnimation = () => {
    if (nameInteractedRef.current) return;
    nameInteractedRef.current = true;
    setNamePreview(null);
  };

  const stopPhoneAnimation = () => {
    if (phoneInteractedRef.current) return;
    phoneInteractedRef.current = true;
    setPhonePreview(null);
  };

  const nameError =
    nameTouched && name.trim() === "" ? "Please enter your name." : "";
  const phoneError =
    phoneTouched && phone.trim() === ""
      ? "Please enter your number."
      : phoneTouched && !isValidPhone(phone)
        ? "Please enter a valid number."
        : "";

  const canSubmit =
    !submitting && name.trim() !== "" && isValidPhone(phone);

  const showPreview = !shouldReduceMotion && !submitted;
  const namePlaceholder = showPreview
    ? namePreview ?? NAME_PLACEHOLDER
    : NAME_PLACEHOLDER;
  const phonePlaceholder = showPreview
    ? phonePreview ?? PHONE_PLACEHOLDER
    : PHONE_PLACEHOLDER;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (name.trim() === "") setNameTouched(true);
    if (phone.trim() === "" || !isValidPhone(phone)) setPhoneTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitCallBooking({
        name: name.trim(),
        phone: phone.trim(),
        callMethod: "whatsapp",
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : "Unable to send your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rappel-card">
      <div className="rappel-card__badge">
        <span className="rappel-card__dot" aria-hidden="true" />
        Free call
      </div>

      {submitted ? (
        <div className="rappel-card__done" role="status" aria-live="polite">
          <h2 className="rappel-card__title">
            Thanks {name.trim() ? ` ${name.trim()}` : ""} 
          </h2>
          <p className="rappel-card__description">
            We have received your request. A Nagriva advisor will call you back shortly.
          </p>
        </div>
      ) : (
        <>
          <h2 className="rappel-card__title">We will call you back.</h2>
          <p className="rappel-card__description">
            Leave your contact details, and a Nagriva advisor will get back to you quickly.
          </p>

          <form className="rappel-card__form" onSubmit={handleSubmit} noValidate>
            <div className="rappel-card__field">
              <label className="rappel-card__label" htmlFor="rappel-name">
                YOUR NAME
              </label>
              <input
                id="rappel-name"
                type="text"
                className="rappel-card__input"
                placeholder={namePlaceholder}
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  stopNameAnimation();
                  setName(e.target.value);
                }}
                onFocus={stopNameAnimation}
                onBlur={() => setNameTouched(true)}
                aria-required="true"
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? "rappel-name-error" : undefined}
                disabled={submitting}
              />
              {nameError && (
                <p id="rappel-name-error" className="rappel-card__error" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <div className="rappel-card__field">
              <label className="rappel-card__label" htmlFor="rappel-phone">
                PHONE / WHATSAPP
              </label>
              <input
                id="rappel-phone"
                type="tel"
                className="rappel-card__input"
                placeholder={phonePlaceholder}
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  stopPhoneAnimation();
                  setPhone(e.target.value);
                }}
                onFocus={stopPhoneAnimation}
                onBlur={() => setPhoneTouched(true)}
                aria-required="true"
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? "rappel-phone-error" : undefined}
                disabled={submitting}
              />
              {phoneError && (
                <p id="rappel-phone-error" className="rappel-card__error" role="alert">
                  {phoneError}
                </p>
              )}
            </div>

            <button className="rappel-card__button" type="submit" disabled={!canSubmit}>
              {submitting ? "Sending…" : "Request a call"}
            </button>

            {submitError && (
              <p className="rappel-card__error rappel-card__error--global" role="alert">
                {submitError}
              </p>
            )}
          </form>
        </>
      )}

      <p className="rappel-card__privacy">Your data remains confidential.</p>
    </div>
  );
}

export default RappelCard;
