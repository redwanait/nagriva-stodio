import { useEffect, useRef } from "react";
import Avatar from "../components/Avatar";
import FinalCta from "../components/FinalCta";
import ProcessJourney from "../components/ProcessJourney";
import {
  processHero,
  processSummary,
  processHowWeWork,
  aboutData,
} from "../data/siteData";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs.process;

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

function Hero() {
  const { character } = processHero;

  return (
    <section className="process-hero" aria-labelledby="process-hero-title">
      <div className="process-hero__container">
        <div className="process-hero__content">
          <p className="eyebrow process-hero__eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />{processHero.eyebrow}
          </p>
          <h1 id="process-hero-title">
            {processHero.headline} <span>{processHero.headlineAccent}</span>
          </h1>
          <p className="process-hero__description">{processHero.description}</p>
          <div className="process-hero__actions">
            <a className="button button--primary" href={processHero.primaryAction.href}>
              {processHero.primaryAction.label}
            </a>
            <a className="button button--secondary" href={processHero.secondaryAction.href}>
              {processHero.secondaryAction.label}
            </a>
          </div>
        </div>
        <div
          className="process-hero__media"
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        >
          <span className="process-hero__glow" aria-hidden="true" />
          <img
            className="process-hero__character"
            src={character.image}
            alt={character.alt}
            width={character.width}
            height={character.height}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}

function ProcessSummary() {
  const { graphic, stages } = processSummary;

  return (
    <section className="process-summary" aria-labelledby="process-summary-title">
      <div className="process-summary__intro" data-process-reveal>
        <p className="eyebrow process-summary__eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />{processSummary.eyebrow}
        </p>
        <h2 id="process-summary-title">
          {processSummary.heading} <span>{processSummary.headingAccent}</span>
        </h2>
        <p className="process-summary__description">{processSummary.description}</p>
      </div>

      <figure className="process-summary__graphic" data-process-reveal>
        <img
          src={graphic.desktop.src}
          alt={graphic.alt}
          width={graphic.desktop.width}
          height={graphic.desktop.height}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <ol className="process-summary__stages">
        {stages.map((stage) => (
          <li className="process-summary__stage" key={stage.number} data-process-reveal>
            <h3 className="process-summary__stage-title">
              <span className="process-summary__number">{stage.number}</span>
              {stage.title}
            </h3>
            <p className="process-summary__copy">{stage.description}</p>
            <p className="process-summary__scope">{stage.scope}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HowWeWork() {
  const { steps, cta } = processHowWeWork;
  const clients = aboutData.clients.slice(0, 5);

  return (
    <section className="process-guide" aria-labelledby="process-guide-title">
      <div className="process-guide__panel">
        <header className="process-guide__header" data-process-reveal>
          <p className="eyebrow process-guide__eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />{processHowWeWork.eyebrow}
          </p>
          <h2 id="process-guide-title">{processHowWeWork.heading}</h2>
          <p className="process-guide__description">{processHowWeWork.description}</p>
          <hr className="process-guide__divider" />
        </header>

        <ol className="process-guide__cards">
          {steps.map((step) => (
            <li className="process-guide__card" key={step.number} data-process-reveal>
              <span className="process-guide__number">{step.number}</span>
              <h3 className="process-guide__title">{step.title}</h3>
              <p className="process-guide__copy">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="process-guide__cta" data-process-reveal>
          <div className="process-guide__proof">
            <ul className="process-guide__avatars">
              {clients.map((client) => (
                <li key={client.name}>
                  <Avatar name={client.name} url={client.image} size="small" />
                </li>
              ))}
            </ul>
            <p className="process-guide__note">{cta.note}</p>
          </div>
          <a className="button button--primary process-guide__button" href={cta.action.href}>
            {cta.action.label}

          </a>
        </div>
      </div>
    </section>
  );
}



function Process() {
  useSeo(SEO);
  const rootRef = useReveal();

  return (
    <main className="process-page" id="process" ref={rootRef}>
      <Hero />
      <ProcessSummary />
      <HowWeWork />
      <ProcessJourney />
      <FinalCta />
    </main>
  );
}

export default Process;
