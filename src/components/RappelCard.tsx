import { useState, type FormEvent } from "react";

import { submitCallBooking } from "../lib/callBookingService";

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

function RappelCard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
                placeholder="Redouane."
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="+212 6XX XXX XXX"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
