import { useEffect, useState, type FormEvent } from "react";

type Step = "request" | "whatsapp" | "success";

const PROJECT_PLACEHOLDERS = [
  "Tell me, sir, what exactly do you want ?",
  "قول لينا اسيدي شنو بغيتي بضبط ؟",
  "Dites-moi, monsieur, que voulez-vous exactement ?",
];

const TYPING_SPEED = 45;
const DELETE_SPEED = 24;
const PAUSE_TYPED = 1600;
const PAUSE_BETWEEN = 500;
const INITIAL_DELAY = 600;

function isPhoneValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9;
}

function ProjectFinder() {
  const [step, setStep] = useState<Step>("request");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [placeholder, setPlaceholder] = useState(PROJECT_PLACEHOLDERS[0]);
  const [isFocused, setIsFocused] = useState(false);
  const [triedSend, setTriedSend] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
  );

  const canContinue = description.trim().length > 0;
  const whatsappValid = isPhoneValid(whatsapp);
  const running = step === "request" && !isFocused && description === "" && !reduceMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!running) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = PROJECT_PLACEHOLDERS[phraseIndex];
      if (!deleting) {
        charIndex++;
        setPlaceholder(phrase.slice(0, charIndex));
        if (charIndex === phrase.length) {
          deleting = true;
          timer = setTimeout(tick, PAUSE_TYPED);
          return;
        }
      } else {
        charIndex--;
        setPlaceholder(phrase.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % PROJECT_PLACEHOLDERS.length;
          timer = setTimeout(tick, PAUSE_BETWEEN);
          return;
        }
      }
      timer = setTimeout(tick, deleting ? DELETE_SPEED : TYPING_SPEED);
    };

    timer = setTimeout(tick, INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, [running]);

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    setStep("whatsapp");
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    setTriedSend(true);
    if (!whatsappValid) return;
    setStep("success");
  };

  const handleBack = () => {
    setStep("request");
    setTriedSend(false);
  };

  return (
    <section className="project-finder" id="project-finder" aria-labelledby="project-finder-title">
      <div className="project-finder__panel">
        <p className="project-finder__pill">Find your project</p>

        <div className="project-finder__step-animate" key={step}>
          {step === "request" && (
            <div className="project-finder__step" aria-live="polite">
              <h2 id="project-finder-title">Find something closer to your project.</h2>
              <p className="project-finder__intro">Tell us what you&apos;re looking to build.</p>

              <form className="project-finder__form" onSubmit={handleContinue}>
                <label className="visually-hidden" htmlFor="pf-description">
                  Describe the project you want to build
                </label>
                <div className="project-finder__field">
                  <input
                    id="pf-description"
                    className="project-finder__input"
                    type="text"
                    value={description}
                    placeholder={placeholder}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
                <div className="project-finder__actions">
                  <button
                    className="project-finder__button project-finder__button--primary"
                    type="submit"
                    disabled={!canContinue}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "whatsapp" && (
            <div className="project-finder__step" aria-live="polite">
              <h2 id="project-finder-title">Great. We know what you&apos;re looking for.</h2>
              <p className="project-finder__intro">
                Give us your WhatsApp number and we&apos;ll send you a few projects close to what
                you&apos;re looking for, along with the information you need to get started.
              </p>

              <form className="project-finder__form" onSubmit={handleSend} noValidate>
                <label className="visually-hidden" htmlFor="pf-whatsapp">
                  Your WhatsApp number
                </label>
                <div className="project-finder__field">
                  <input
                    id="pf-whatsapp"
                    className="project-finder__input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    placeholder="+212 6 XX XX XX XX"
                    aria-invalid={triedSend && !whatsappValid}
                    aria-describedby={triedSend && !whatsappValid ? "pf-whatsapp-error" : undefined}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                {triedSend && !whatsappValid && (
                  <p className="project-finder__error" id="pf-whatsapp-error">
                    Please enter a valid WhatsApp number.
                  </p>
                )}
                <div className="project-finder__actions">
                  <button
                    className="project-finder__button project-finder__button--primary"
                    type="submit"
                  >
                    Send me the examples
                  </button>
                </div>
                <button className="project-finder__back" type="button" onClick={handleBack}>
                Change my request
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="project-finder__step project-finder__step--success" aria-live="polite">
              <h2 id="project-finder-title">You&apos;re all set.</h2>
              <p className="project-finder__intro">
                We&apos;ll send you a few projects close to what you&apos;re looking to build, along
                with the next steps.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectFinder;
