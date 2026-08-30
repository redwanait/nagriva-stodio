import { useEffect, useRef } from "react";
import FinalCta from "../components/FinalCta";
import { processWorkflow, processApproach, processJourney } from "../data/siteData";
import step01 from "../assets/processimage/steps/step01.png";
import step02 from "../assets/processimage/steps/step02.png";
import step03 from "../assets/processimage/steps/step03.png";

const processImages = [step01, step02, step03];

function useReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-process-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("process-reveal--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("process-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}

function Approach() {
  return (
    <section className="process-approach" aria-labelledby="process-approach-title" data-process-reveal>
      <div className="process-approach__statement">
        <p className="eyebrow process-approach__eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />{processApproach.eyebrow}
        </p>
        <h2 id="process-approach-title">
          {processApproach.statement} <span>{processApproach.statementAccent}</span>
        </h2>
      </div>
      <div className="process-approach__copy">
        {processApproach.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="process-journey" aria-labelledby="process-journey-title">
      <div className="process-journey__header" data-process-reveal>
        <p className="eyebrow process-journey__eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />Working together
        </p>
        <h2 id="process-journey-title">
          What working with Nagriva <span>actually looks like.</span>
        </h2>
        <p className="process-journey__intro">
          From the first message to the final launch, every project follows a clear and
          collaborative process.
        </p>
      </div>

      <div className="process-journey__track" data-process-reveal>
        {processJourney.map((stage) => (
          <article className="process-journey-card" key={stage.number}>
            <div className="process-journey-card__media">
              {stage.image ? (
                <img
                  className="process-journey-card__image"
                  src={stage.image}
                  alt={`${stage.label} screenshot placeholder`}
                />
              ) : (
                <div className="process-journey-card__placeholder" aria-hidden="true">
                  <span className="process-journey-card__placeholder-mark">+</span>
                  <span className="process-journey-card__placeholder-label">
                    {stage.label} screenshot
                  </span>
                </div>
              )}
            </div>
            <div className="process-journey-card__body">
              <div className="process-journey-card__meta">
                <span className="process-journey-card__number">{stage.number}</span>
                <span className="process-journey-card__label">{stage.label}</span>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const rootRef = useReveal();

  return (
    <main className="process-page" id="process" ref={rootRef}>
      <section className="process-hero" aria-labelledby="process-hero-title">
        <div className="process-hero__container">
          <div className="process-hero__content">
            <p className="eyebrow process-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />How we work
            </p>
            <h1 id="process-hero-title">
              From idea to a finished <span>digital experience.</span>
            </h1>
            <p className="process-hero__description">
              Every project starts with clarity. We define what matters, build with purpose, and
              refine every detail until the final experience feels right.
            </p>
          </div>
        </div>
      </section>

      <section className="process-workflow" aria-labelledby="process-workflow-title">
        <div className="process-workflow__header" data-process-reveal>
          <div>
            <p className="eyebrow process-workflow__eyebrow">The process</p>
            <h2 id="process-workflow-title">Three focused stages.</h2>
          </div>
          <p className="process-workflow__intro">
            Discovery through launch — a clear, connected path from first conversation to a
            finished result.
          </p>
        </div>

        <div className="process-workflow__grid">
          {processWorkflow.map((step, index) => (
            <article
              className="process-flow"
              key={step.number}
              data-process-reveal
            >
              <div className="process-flow__visual-wrap">
                <img
                  className="process-flow__image"
                  src={processImages[index]}
                  alt={`${step.title} visual`}
                />
              </div>
              <div className="process-flow__body">
                <div className="process-flow__meta">
                  <span className="process-flow__number">{step.number}</span>
                  <span className="process-flow__label">{step.label}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="process-workflow__connector" aria-hidden="true">
        <span className="process-workflow__connector-line" />
        <span className="process-workflow__connector-dot" />
        <span className="process-workflow__connector-line" />
      </div>

      <Journey />
      <Approach />
      <FinalCta />
    </main>
  );
}

export default Process;