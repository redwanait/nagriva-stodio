import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { submitProjectInquiry } from "../lib/projectInquiryService";

type FinderStatus = "form" | "success";

/** Matches the exit animation in App.css so the modal unmounts after it finishes. */
const CLOSE_ANIMATION_MS = 180;

function isPhoneValid(value: string): boolean {
  return value.replace(/\D/g, "").length >= 9;
}

type ProjectFinderModalProps = {
  onClose: () => void;
  /** Focused when the modal closes, when the element is still in the document. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * The "Find your project" experience as a premium dialog. Opened by the portfolio
 * page once the final project is revealed. The form reuses the existing
 * `submitProjectInquiry` request path and its anti-abuse protections.
 */
function ProjectFinderModal({ onClose, returnFocusRef }: ProjectFinderModalProps) {
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<FinderStatus>("form");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);

  const descriptionError =
    triedSubmit && description.trim() === "" ? "Tell us a little about the project." : "";
  const whatsappError =
    triedSubmit && !isPhoneValid(whatsapp) ? "Enter a phone or WhatsApp number we can reach you on." : "";
  const canSubmit = description.trim() !== "" && isPhoneValid(whatsapp);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimerRef.current = setTimeout(onClose, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    const raf = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lock background scrolling while open, and restore the previous value on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Return focus when the dialog closes. The target is resolved by the parent
  // after this modal mounts, so it is read at cleanup time instead of captured.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const target = returnFocusRef?.current ?? null;
      if (target && document.contains(target)) target.focus();
    };
  }, [returnFocusRef]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Escape closes the dialog; Tab is trapped inside it.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [requestClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setTriedSubmit(true);
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitProjectInquiry({
        description: description.trim(),
        whatsapp: whatsapp.trim(),
      });
      setStatus("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to send your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeIcon = <FontAwesomeIcon icon={faXmark} aria-hidden="true" />;

  return createPortal(
    <div
      className={`finder-modal-backdrop${closing ? " finder-modal-backdrop--closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className={`finder-modal${closing ? " finder-modal--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finder-modal-title"
        aria-describedby="finder-modal-description"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          className="finder-modal__close"
          type="button"
          aria-label="Close dialog"
          onClick={requestClose}
        >
          {closeIcon}
        </button>

        <div className="finder-modal__scroll">
          {status === "form" ? (
            <>
              <header className="finder-modal__hero">
                <p className="finder-modal__eyebrow">Your next project starts here</p>
                <h2 className="finder-modal__title" id="finder-modal-title">
                  <span className="finder-modal__title-seg">Haven&apos;t found what you&apos;re</span>{" "}
                  <span className="finder-modal__title-seg">looking for?</span>
                </h2>
                <p className="finder-modal__lead" id="finder-modal-description">
                  Tell us what you have in mind. We&apos;ll help you find the right direction.
                </p>
                <span className="finder-modal__accent" aria-hidden="true" />
              </header>

              <form className="finder-modal__form" onSubmit={handleSubmit} noValidate>
                <div className="finder-modal__field">
                  <label className="finder-modal__label" htmlFor="finder-description">
                    What do you want to build? <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="finder-description"
                    className="finder-modal__textarea"
                    rows={3}
                    value={description}
                    placeholder="A website, an online store, a redesign…"
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={descriptionError ? true : undefined}
                    aria-describedby={descriptionError ? "finder-description-error" : undefined}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  {descriptionError && (
                    <p className="finder-modal__error" id="finder-description-error" role="alert">
                      {descriptionError}
                    </p>
                  )}
                </div>

                <div className="finder-modal__field">
                  <label className="finder-modal__label" htmlFor="finder-whatsapp">
                    Your phone / WhatsApp <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="finder-whatsapp"
                    className="finder-modal__input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    placeholder="+212 6XX XXX XXX"
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={whatsappError ? true : undefined}
                    aria-describedby={whatsappError ? "finder-whatsapp-error" : undefined}
                    onChange={(event) => setWhatsapp(event.target.value)}
                  />
                  {whatsappError && (
                    <p className="finder-modal__error" id="finder-whatsapp-error" role="alert">
                      {whatsappError}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="finder-modal__error finder-modal__error--global" role="alert">
                    {submitError}
                  </p>
                )}

                <button
                  className="finder-modal__cta"
                  type="submit"
                  disabled={submitting}
                >
                  <span className="finder-modal__cta-label">{submitting ? "Sending…" : "Find My Project"}</span>
                  <FontAwesomeIcon className="finder-modal__cta-icon" icon={faArrowRight} aria-hidden="true" />
                </button>

                <p className="finder-modal__reassurance">
                  Our team reviews every request personally and will get back to you shortly.
                </p>
              </form>
            </>
          ) : (
            <div className="finder-modal__success" aria-live="polite">
              <span className="finder-modal__success-mark" aria-hidden="true">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <h3>You&apos;re all set.</h3>
              <p>We&apos;ve received your request. Our team will review it and get back to you shortly.</p>
              <button className="finder-modal__cta" type="button" onClick={requestClose}>
                <span className="finder-modal__cta-label">Done</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ProjectFinderModal;
