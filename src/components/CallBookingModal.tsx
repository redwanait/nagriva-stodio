import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import meetImg from "../assets/faqimages/meet.png";
import skypeImg from "../assets/faqimages/skype.png";
import whatsappImg from "../assets/faqimages/whatsapp.png";

type CallMethod = "whatsapp" | "google-meet" | "skype";

const CALL_METHODS: Array<{ id: CallMethod; label: string; icon: string }> = [
  { id: "whatsapp", label: "WhatsApp", icon: whatsappImg },
  { id: "google-meet", label: "Google Meet", icon: meetImg },
  { id: "skype", label: "Skype", icon: skypeImg },
];

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

type CallBookingModalProps = {
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
};

function CallBookingModal({ onClose, returnFocusRef }: CallBookingModalProps) {
  const [step, setStep] = useState<"method" | "details" | "done">("method");
  const [method, setMethod] = useState<CallMethod | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    const trigger = returnFocusRef?.current;
    return () => trigger?.focus();
  }, [returnFocusRef]);

  const nameError = nameTouched && name.trim() === "" ? "Please enter your name." : "";
  const phoneError =
    phoneTouched && phone.trim() === ""
      ? "Please enter your phone number."
      : phoneTouched && !isValidPhone(phone)
        ? "Please enter a valid phone number."
        : "";

  const canSubmit =
    !submitting && name.trim() !== "" && phone.trim() !== "" && isValidPhone(phone);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (name.trim() === "") setNameTouched(true);
    if (phone.trim() === "" || !isValidPhone(phone)) setPhoneTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStep("done");
    }, 800);
  };

  const selectedMethod = CALL_METHODS.find((option) => option.id === method) ?? null;

  return (
    <div className="call-modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="call-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="call-modal__head">
          <div>
            <p className="call-modal__eyebrow">Book a Free Call</p>
            <h3 id="call-modal-title">
              {step === "method" && "How would you like to talk?"}
              {step === "details" && "Where can we reach you?"}
              {step === "done" && "Request received"}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            className="call-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="call-modal__body">
          {step === "method" && (
            <>
              <p className="call-modal__note">
                Pick the method that suits you best. 15 min · Free · No commitment.
              </p>
              <div className="call-modal__methods" role="group" aria-label="Preferred call method">
                {CALL_METHODS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="call-modal__method"
                    onClick={() => {
                      setMethod(option.id);
                      setStep("details");
                    }}
                  >
                    <span className="call-modal__method-icon">
                      <img src={option.icon} alt="" />
                    </span>
                    <span className="call-modal__method-label">{option.label}</span>
                    <span className="call-modal__method-arrow" aria-hidden="true"></span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "details" && (
            <form className="call-modal__form" onSubmit={handleSubmit} noValidate>
              {selectedMethod && (
                <p className="call-modal__chosen">
                  <img src={selectedMethod.icon} alt="" />
                  {selectedMethod.label}
                </p>
              )}
              <div className="call-modal__field">
                <label className="call-modal__label" htmlFor="call-name">
                  Your name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="call-name"
                  className="call-modal__input"
                  type="text"
                  value={name}
                  placeholder="Your full name"
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  aria-required="true"
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={nameError ? "call-name-error" : undefined}
                  disabled={submitting}
                />
                {nameError && (
                  <p id="call-name-error" className="call-modal__error" role="alert">
                    {nameError}
                  </p>
                )}
              </div>
              <div className="call-modal__field">
                <label className="call-modal__label" htmlFor="call-phone">
                  Phone number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="call-phone"
                  className="call-modal__input"
                  type="tel"
                  value={phone}
                  placeholder="+212 6XX XXX XXX"
                  autoComplete="tel"
                  inputMode="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  aria-required="true"
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? "call-phone-error" : undefined}
                  disabled={submitting}
                />
                {phoneError && (
                  <p id="call-phone-error" className="call-modal__error" role="alert">
                    {phoneError}
                  </p>
                )}
              </div>
              <div className="call-modal__actions">
                <button className="call-modal__submit" type="submit" disabled={!canSubmit}>
                  {submitting ? "Sending…" : "Request the call"}
                </button>
              </div>
              <p className="call-modal__disclaimer">
                No cold calls. Redouane will reach out as soon as possible.
              </p>
            </form>
          )}

          {step === "done" && (
            <div className="call-modal__done">
              <span className="call-modal__done-mark" aria-hidden="true">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <h3>All set{name.trim() ? `, ${name.trim()}` : ""}!</h3>
              <p>Redouane will call you as soon as possible.</p>
              <button className="call-modal__submit" type="button" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallBookingModal;