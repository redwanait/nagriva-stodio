import { useEffect, useRef, useState } from "react";

import { useSeo } from "../hooks/useSeo";
import { useStartFlow } from "../hooks/useStartFlow";
import { seoConfigs } from "../data/seo";
import ContactStep from "../components/start/ContactStep";
import ProjectDetailsStep from "../components/start/ProjectDetailsStep";
import StartHero from "../components/start/StartHero";
import StartProgress, { type StartStep } from "../components/start/StartProgress";
import StartSuccess from "../components/start/StartSuccess";

const SEO = seoConfigs.start;

function Start() {
  useSeo(SEO);

  const [step, setStep] = useState<StartStep>("contact");
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLFormElement>(null);

  const {
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
  } = useStartFlow();

  // The Turnstile script loads asynchronously, so the hook keeps retrying until
  // the widget is available. No page-level mount is needed.

  // Keep the top of the panel in view when the steps change, so the visitor
  // always lands on the new heading rather than mid-form.
  useEffect(() => {
    if (step === "contact" || submitted) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, submitted]);

  // Step 02 is optional, but it still needs the four essentials: they are what
  // the request is keyed on, so a half-filled contact step is sent back to the
  // visitor with the errors visible instead of failing silently on submit.
  const goToDetails = () => {
    if (!stepOneValid) {
      markTouched(["fullName", "email", "phone", "need"]);
      return;
    }
    setStep("details");
  };

  const handleSubmit = async () => {
    if (step !== "contact" && !stepOneValid) {
      setStep("contact");
      markTouched(["fullName", "email", "phone", "need"]);
      return;
    }
    const ok = await submit();
    if (ok) setSubmitted(true);
  };

  return (
    <main className="start-page" id="start">
      <StartHero />

      {submitted ? (
        <StartSuccess name={form.fullName} />
      ) : (
        <section className="start-shell" aria-label="Project request form">
          <form
            className="start-panel"
            ref={panelRef}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              // Honeypot: a filled hidden field means a bot, so the request is
              // dropped without an error message.
              if (form.website !== "") return;
              void handleSubmit();
            }}
          >
            <StartProgress step={step} />

            <div className="visually-hidden" aria-hidden="true">
              <label htmlFor="start-website">Website</label>
              <input
                id="start-website"
                type="text"
                name="website"
                value={form.website}
                onChange={(event) => update({ website: event.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {step === "contact" ? (
              <ContactStep
                values={{
                  fullName: form.fullName,
                  email: form.email,
                  phone: form.phone,
                  need: form.need,
                }}
                errors={errors}
                submitting={submitting}
                onChange={update}
                onBlur={(field) => markTouched([field])}
                onAddDetails={goToDetails}
              />
            ) : (
              <ProjectDetailsStep
                values={{
                  budget: form.budget,
                  timeline: form.timeline,
                  contactMethod: form.contactMethod,
                  company: form.company,
                  description: form.description,
                }}
                contactSummary={{
                  name: form.fullName,
                  email: form.email,
                  phone: form.phone,
                }}
                submitting={submitting}
                onChange={update}
                onBack={() => setStep("contact")}
              />
            )}

            <div className="start-turnstile" ref={turnstileContainerRef} />
            {pendingVerification && (
              <p className="start-verify-note" role="status">
                One quick check from Cloudflare, then your request is on its way.
              </p>
            )}
            {submitError && (
              <p className="start-error start-error--global" role="alert">
                {submitError}
              </p>
            )}
          </form>
        </section>
      )}
    </main>
  );
}

export default Start;