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
    nameTouched && name.trim() === "" ? "Veuillez renseigner votre nom." : "";
  const phoneError =
    phoneTouched && phone.trim() === ""
      ? "Veuillez renseigner votre numéro."
      : phoneTouched && !isValidPhone(phone)
        ? "Veuillez saisir un numéro valide."
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
          : "Impossible d'envoyer votre demande. Merci de réessayer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rappel-card">
      <div className="rappel-card__badge">
        <span className="rappel-card__dot" aria-hidden="true" />
        RAPPEL GRATUIT
      </div>

      {submitted ? (
        <div className="rappel-card__done" role="status" aria-live="polite">
          <span className="rappel-card__done-mark" aria-hidden="true">✓</span>
          <h2 className="rappel-card__title">
            Merci{name.trim() ? `, ${name.trim()}` : ""} !
          </h2>
          <p className="rappel-card__description">
            Votre demande est bien reçue. Un conseiller Nagriva vous rappelle très vite.
          </p>
        </div>
      ) : (
        <>
          <h2 className="rappel-card__title">On vous rappelle</h2>
          <p className="rappel-card__description">
            Laissez vos coordonnées, un conseiller Nagriva vous répond rapidement.
          </p>

          <form className="rappel-card__form" onSubmit={handleSubmit} noValidate>
            <div className="rappel-card__field">
              <label className="rappel-card__label" htmlFor="rappel-name">
                VOTRE NOM
              </label>
              <input
                id="rappel-name"
                type="text"
                className="rappel-card__input"
                placeholder="John D."
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
                TÉLÉPHONE / WHATSAPP
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
              {submitting ? "Envoi…" : "Être rappelé"}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>

            {submitError && (
              <p className="rappel-card__error rappel-card__error--global" role="alert">
                {submitError}
              </p>
            )}
          </form>
        </>
      )}

      <p className="rappel-card__privacy">VOS DONNÉES RESTENT CONFIDENTIELLES</p>
    </div>
  );
}

export default RappelCard;
