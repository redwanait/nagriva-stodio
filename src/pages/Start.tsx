import { useEffect, useState } from "react";

type NeedOption = "New Website" | "Website Redesign" | "E-commerce Website" | "Landing Page";
type BudgetOption = "Under 3000 DH" | "3000 DH – 5000 DH" | "5000 DH – 10000 DH" | "10000 DH+" | "Not sure yet";
type ContactOption = "Email" | "WhatsApp" | "Phone";

const needOptions: NeedOption[] = ["New Website", "Website Redesign", "E-commerce Website", "Landing Page"];
const budgetOptions: BudgetOption[] = ["Under 3000 DH", "3000 DH – 5000 DH", "5000 DH – 10000 DH", "10000 DH+", "Not sure yet"];
const contactOptions: ContactOption[] = ["Email", "WhatsApp", "Phone"];

const PHONE_REQUIRED_METHODS: ContactOption[] = ["WhatsApp", "Phone"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

const SUCCESS_MESSAGES = [
  { text: "We'll review the details and get back to you soon.", dir: "ltr" as const },
  { text: "Nous allons examiner les détails et revenir vers vous bientôt.", dir: "ltr" as const },
  { text: "شكرا اسيدي علا الثقة ديالك ف nagriva دابا نتواصل معاك ان شاء الله  ", dir: "rtl" as const },
];

const MSM_TYPE_MS = 42;
const MSM_DELETE_MS = 26;
const MSM_PAUSE_MS = 2000;
const MSM_BREAK_MS = 60;

function useSuccessTypewriter(active: boolean) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [text, setText] = useState(() => (reduced ? SUCCESS_MESSAGES[0].text : ""));
  const [dir, setDir] = useState<"ltr" | "rtl">(SUCCESS_MESSAGES[0].dir);
  const [fullMessage, setFullMessage] = useState<string | null>(
    reduced ? SUCCESS_MESSAGES[0].text : null,
  );

  useEffect(() => {
    if (!active || reduced) return;

    let messageIndex = 0;
    let current = SUCCESS_MESSAGES[messageIndex];

    let charIndex = 0;
    let mountTimers: number[] = [];

    const activateMessage = (index: number) => {
      current = SUCCESS_MESSAGES[index];
      setDir(current.dir);
      setFullMessage(current.text);
      charIndex = 0;
      setText("");
    };

    const clearTimers = () => {
      mountTimers.forEach((t) => window.clearTimeout(t));
      mountTimers = [];
    };

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        mountTimers = mountTimers.filter((t) => t !== id);
        fn();
      }, delay);
      mountTimers.push(id);
    };

    const typeNext = () => {
      if (charIndex >= current.text.length) {
        schedule(() => {
          schedule(deleteNext, MSM_DELETE_MS);
        }, MSM_PAUSE_MS);
        return;
      }
      setText(current.text.slice(0, charIndex + 1));
      charIndex += 1;
      schedule(typeNext, MSM_TYPE_MS);
    };

    const deleteNext = () => {
      if (charIndex <= 0) {
        messageIndex = (messageIndex + 1) % SUCCESS_MESSAGES.length;
        const nextIndex = messageIndex;
        schedule(() => {
          activateMessage(nextIndex);
          schedule(typeNext, 0);
        }, MSM_BREAK_MS);
        return;
      }
      charIndex -= 1;
      setText(current.text.slice(0, charIndex));
      schedule(deleteNext, MSM_DELETE_MS);
    };

    activateMessage(0);
    schedule(typeNext, 0);

    return clearTimers;
  }, [active, reduced]);

  return { text, dir, fullMessage };
}

function Start() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [need, setNeed] = useState<NeedOption | "">("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<BudgetOption | "">("");
  const [contactMethod, setContactMethod] = useState<ContactOption>("Email");
  const [phone, setPhone] = useState("");

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [needTouched, setNeedTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const showPhoneField = PHONE_REQUIRED_METHODS.includes(contactMethod);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const successMessage = useSuccessTypewriter(submitted);

  const nameError = nameTouched && fullName.trim() === "" ? "Please enter your full name." : "";
  const emailError =
    emailTouched && email.trim() === ""
      ? "Please enter your email address."
      : emailTouched && !isValidEmail(email)
        ? "Please enter a valid email address."
        : "";
  const needError = needTouched && need === "" ? "Please select what you need." : "";
  const descriptionError =
    descriptionTouched && description.trim() === ""
      ? "Please tell us a little about your project."
      : "";
  const phoneError =
    !showPhoneField
      ? ""
      : phoneTouched && phone.trim() === ""
        ? "Please enter your phone number."
        : phoneTouched && !isValidPhone(phone)
          ? "Please enter a valid phone number."
          : "";

  const baseValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    isValidEmail(email) &&
    need !== "" &&
    description.trim() !== "";

  const canSubmit =
    baseValid &&
    (!showPhoneField || (phone.trim() !== "" && isValidPhone(phone))) &&
    !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (fullName.trim() === "") setNameTouched(true);
    if (email.trim() === "" || !isValidEmail(email)) setEmailTouched(true);
    if (need === "") setNeedTouched(true);
    if (description.trim() === "") setDescriptionTouched(true);
    if (showPhoneField && (phone.trim() === "" || !isValidPhone(phone))) setPhoneTouched(true);

    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      !isValidEmail(email) ||
      need === "" ||
      description.trim() === "" ||
      (showPhoneField && (phone.trim() === "" || !isValidPhone(phone)))
    ) {
      setSubmitAttempted(true);
      return;
    }

    setSubmitAttempted(false);
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          company: company.trim(),
          need,
          projectDescription: description.trim(),
          budget,
          preferredContact: contactMethod,
          phone: phone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "Sorry — we couldn't submit your inquiry right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameBlur = () => setNameTouched(true);
  const handleEmailBlur = () => setEmailTouched(true);
  const handleNeedSelect = (option: NeedOption) => {
    setNeed(option);
    setNeedTouched(true);
  };
  const handleDescriptionBlur = () => setDescriptionTouched(true);
  const handlePhoneBlur = () => {
    if (showPhoneField) setPhoneTouched(true);
  };
  const handleContactMethodSelect = (option: ContactOption) => {
    setContactMethod(option);
    setPhoneTouched(false);
  };

  return (
    <main className="start-page" id="start">
      <section className="start-hero" aria-labelledby="start-hero-title">
        <div className="start-hero__container">
          <div className="start-hero__content">
            <p className="eyebrow start-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />Start with Nagriva
            </p>
            <h1 id="start-hero-title">Let&apos;s build something worth talking about.</h1>
            <p className="start-hero__description">
              Tell us a little about your project. No complicated brief needed — just the essentials.
            </p>
          </div>
        </div>
      </section>

      {submitted ? (
        <section className="start-success" aria-live="polite">
          <div className="start-success__panel">
            <div className="start-success__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>Your project inquiry has been received.</h2>
            <div className="start-success__message-wrap">
              <p className="start-success__message" dir={successMessage.dir} aria-hidden="true">
                {successMessage.text}
              </p>
              <span className="visually-hidden" aria-live="polite">
                {successMessage.fullMessage ?? SUCCESS_MESSAGES[0].text}
              </span>
            </div>
            <div className="start-success__details">
              <div className="start-success__item">
                <span className="start-success__label">Name</span>
                <span className="start-success__value">{fullName.trim()}</span>
              </div>
              <div className="start-success__item">
                <span className="start-success__label">Email</span>
                <span className="start-success__value">{email.trim()}</span>
              </div>
              {showPhoneField && (
                <div className="start-success__item">
                  <span className="start-success__label">Contact</span>
                  <span className="start-success__value">{phone.trim()}</span>
                </div>
              )}
            </div>
            <div className="start-success__actions">
              <a className="start-success__button start-success__button--primary" href="#home">
                Back to Home <span aria-hidden="true">↗</span>
              </a>
              <a
                className="start-success__button start-success__button--secondary"
                href="mailto:hello@nagriva.com"
              >
                Contact the founder <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="start-form-wrap" aria-label="Project inquiry form">
          <form className="start-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="start-section">
              <legend className="start-section__head">
                <span className="start-section__index">01</span>
                <span className="start-section__title">About you</span>
              </legend>

              <div className="start-grid start-grid--two">
                <div className="start-field">
                  <label className="start-label" htmlFor="name">
                    Full Name <span className="start-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    className="start-input"
                    type="text"
                    value={fullName}
                    placeholder="Your full name"
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={handleNameBlur}
                    aria-required="true"
                    aria-invalid={nameError ? true : undefined}
                    aria-describedby={nameError ? "name-error" : undefined}
                    autoComplete="name"
                  />
                  {nameError && (
                    <p id="name-error" className="start-error" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                <div className="start-field">
                  <label className="start-label" htmlFor="email">
                    Email Address <span className="start-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    className="start-input"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    aria-required="true"
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? "email-error" : undefined}
                    autoComplete="email"
                  />
                  {emailError && (
                    <p id="email-error" className="start-error" role="alert">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="start-field">
                  <label className="start-label" htmlFor="company">
                    Company / Brand <span className="start-optional" aria-hidden="true">(optional)</span>
                  </label>
                  <input
                    id="company"
                    className="start-input"
                    type="text"
                    value={company}
                    placeholder="Your company or brand"
                    onChange={(e) => setCompany(e.target.value)}
                    autoComplete="organization"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="start-section">
              <legend className="start-section__head">
                <span className="start-section__index">02</span>
                <span className="start-section__title">Your project</span>
              </legend>

              <div className="start-block">
                <span className="start-label" id="need-label">
                  What do you need? <span className="start-required" aria-hidden="true">*</span>
                </span>
                <div className="start-choices start-choices--need" role="group" aria-labelledby="need-label">
                  {needOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`start-choice${need === option ? " start-choice--selected" : ""}`}
                      aria-pressed={need === option}
                      aria-invalid={needError ? true : undefined}
                      onClick={() => handleNeedSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {needError && (
                  <p className="start-error" role="alert">
                    {needError}
                  </p>
                )}
              </div>

              <div className="start-field">
                <label className="start-label" htmlFor="description">
                  Project Description <span className="start-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="description"
                  className="start-input start-input--textarea"
                  value={description}
                  placeholder="Tell us about your idea, goals, and what you need."
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  aria-required="true"
                  aria-invalid={descriptionError ? true : undefined}
                  aria-describedby={descriptionError ? "description-error" : undefined}
                  rows={5}
                />
                <p className="start-help">Tell us about your project, what you need, and what you&apos;d like to achieve.</p>
                {descriptionError && (
                  <p id="description-error" className="start-error" role="alert">
                    {descriptionError}
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="start-section">
              <legend className="start-section__head">
                <span className="start-section__index">03</span>
                <span className="start-section__title">Budget</span>
              </legend>

              <div className="start-block">
                <span className="start-label" id="budget-label">
                  Estimated Budget <span className="start-optional" aria-hidden="true">(optional)</span>
                </span>
                <div className="start-choices start-choices--chips" role="group" aria-labelledby="budget-label">
                  {budgetOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`start-choice start-choice--chip${budget === option ? " start-choice--selected" : ""}`}
                      aria-pressed={budget === option}
                      onClick={() => setBudget(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="start-section">
              <legend className="start-section__head">
                <span className="start-section__index">04</span>
                <span className="start-section__title">Contact</span>
              </legend>

              <div className="start-block">
                <span className="start-label" id="contact-label">How would you prefer we contact you?</span>
                <div className="start-choices start-choices--chips" role="group" aria-labelledby="contact-label">
                  {contactOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`start-choice start-choice--chip${contactMethod === option ? " start-choice--selected" : ""}`}
                      aria-pressed={contactMethod === option}
                      onClick={() => handleContactMethodSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {showPhoneField && (
                <div className="start-field start-field--reveal">
                  <label className="start-label" htmlFor="phone">
                    Phone / WhatsApp Number <span className="start-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    className="start-input"
                    type="tel"
                    value={phone}
                    placeholder="+212 6XX XXX XXX"
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={handlePhoneBlur}
                    aria-required="true"
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={phoneError ? "phone-error" : undefined}
                    autoComplete="tel"
                  />
                  {phoneError && (
                    <p id="phone-error" className="start-error" role="alert">
                      {phoneError}
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            <div className="start-submit">
              <p className="start-submit__note">No pressure. We&apos;ll review your inquiry and get back to you soon.</p>
              <button
                className="start-submit__button"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Sending…" : "Start the conversation"}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
              {submitAttempted &&
                (fullName.trim() === "" ||
                  email.trim() === "" ||
                  !isValidEmail(email) ||
                  need === "" ||
                  description.trim() === "" ||
                  (showPhoneField && (phone.trim() === "" || !isValidPhone(phone)))) && (
                <p className="start-submit__hint">
                  Please fill in the required fields above to send your inquiry.
                </p>
              )}
              {submitError && (
                <p className="start-error" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

export default Start;
