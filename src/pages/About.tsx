import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { aboutPage } from "../data/siteData";
import nagrivaLogo from "../assets/logos/logo.png";
import founderImage from "../assets/aboutimage/the founder.png";
import senatorImage from "../assets/aboutimage/Senator.png";

const NAGRIVA_LOGO = nagrivaLogo;

function About() {
  return (
    <main className="about-page" id="about-page">
      <AboutHero />
      <ProblemSection />
      <WhySection />
      <ResultsSection />
      <GallerySection />
      <FinalCta />
    </main>
  );
}

function AboutHero() {
  const { hero } = aboutPage;
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__container">
        <div className="about-hero__inner">
          <div className="about-hero__content">
            <h1 id="about-hero-title">{hero.title}</h1>
            <p className="about-hero__statement">{hero.statement}</p>
            <p className="about-hero__paragraph">{hero.paragraph}</p>
            <img
              className="about-hero__signature"
              src={senatorImage}
              alt="Handwritten signature of Redouane, founder of Nagriva"
            />
          </div>
          <div className="about-hero__media">
            <img
              className="about-hero__image"
              src={founderImage}
              alt="Redouane, founder of Nagriva"
            />
            <span className="about-hero__tag">
              <strong>{hero.founderName}</strong>
              <span>{hero.founderRole}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { problem } = aboutPage;
  return (
    <section className="about-section about-problem" aria-labelledby="about-problem-title">
      <div className="about-problem__heading">
        <h2 id="about-problem-title">{problem.title}</h2>
      </div>

      <ProblemAnimation words={problem.animation} />

      <div className="about-problem__editorial">
        <p className="about-problem__statement">{problem.statement}</p>
        <p className="about-problem__paragraph">{problem.paragraph}</p>
      </div>

      <p className="about-problem__transition">{problem.transition}</p>
    </section>
  );
}

type ProblemWords = {
  single: string[];
  punchline: string;
  needs: string[];
  final: string;
};

function ProblemAnimation({ words }: { words: ProblemWords }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const phaseTimer = useRef<number | null>(null);

  const phases = [
    ...words.single.map((w) => ({ kind: "single" as const, label: w, duration: 2000 })),
    { kind: "stack" as const, label: "", duration: 2100 },
    { kind: "punch" as const, label: words.punchline, duration: 2500 },
    ...words.needs.map((w) => ({ kind: "need" as const, label: w, duration: 1500 })),
    { kind: "final" as const, label: words.final, duration: 2300 },
  ];

  const singleIndex = phase < words.single.length ? phase : -1;
  const stackActive = phase === words.single.length;
  const punchActive = phase === words.single.length + 1;
  const needIndex =
    phase >= words.single.length + 2 && phase < words.single.length + 2 + words.needs.length
      ? phase - (words.single.length + 2)
      : -1;
  const finalActive = phase === phases.length - 1;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const reset = window.setTimeout(() => setPhase(0), 0);
    return () => window.clearTimeout(reset);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const duration = phases[phase].duration;
    phaseTimer.current = window.setTimeout(() => {
      setPhase((p) => (p >= phases.length - 1 ? 0 : p + 1));
    }, duration);
    return () => {
      if (phaseTimer.current !== null) window.clearTimeout(phaseTimer.current);
    };
  }, [phase, running]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`about-problem__stage${running ? " about-problem__stage--running" : ""}`}
      ref={stageRef}
      role="presentation"
    >
      <div className="about-problem__single-wrap">
        {words.single.map((w, i) => (
          <span
            className={`about-problem__single${
              singleIndex === i ? " about-problem__single--active" : ""
            }`}
            key={w}
          >
            {w}
          </span>
        ))}
      </div>

      <div
        className={`about-problem__stack${stackActive ? " about-problem__stack--active" : ""}`}
        aria-hidden="true"
      >
        {words.single.map((w) => (
          <span className="about-problem__stack-word" key={w}>
            {w}
          </span>
        ))}
      </div>

      <span
        className={`about-problem__punch${punchActive ? " about-problem__punch--active" : ""}`}
        aria-hidden="true"
      >
        {words.punchline}
      </span>

      <div className="about-problem__needs-wrap" aria-hidden="true">
        {words.needs.map((w, i) => (
          <span
            className={`about-problem__need${needIndex === i ? " about-problem__need--active" : ""}`}
            key={w}
          >
            {w}
          </span>
        ))}
      </div>

      <span
        className={`about-problem__final${finalActive ? " about-problem__final--active" : ""}`}
        aria-hidden="true"
      >
        {words.final}
      </span>
    </div>
  );
}

function WhySection() {
  const { why } = aboutPage;
  return (
    <section className="about-section about-why" aria-labelledby="about-why-title">
      <div className="about-section__inner">
        <p className="eyebrow about-section__eyebrow">
          <span className="about-section__index">03</span>
          {why.eyebrow}
        </p>
        <div className="about-why__header">
          <h2 id="about-why-title">{why.title}</h2>
          <p className="about-section__statement">{why.intro}</p>
        </div>

        <WhyAnimation talent={why.talent} opportunity={why.opportunity} final={why.final} />

      </div>
    </section>
  );
}

function WhyAnimation({
  talent,
  opportunity,
  final,
}: {
  talent: string;
  opportunity: string;
  final: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const [step, setStep] = useState(0);
  const stepTimer = useRef<number | null>(null);

  const stepDurations = [2000, 2400, 1100, 1500, 2200, 2200];

  const shifting = step >= 1 && step < 3;
  const logoActive = step >= 3;
  const finalActive = step >= 4;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const reset = window.setTimeout(() => setStep(0), 0);
    return () => window.clearTimeout(reset);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    stepTimer.current = window.setTimeout(() => {
      setStep((s) => (s >= stepDurations.length - 1 ? 0 : s + 1));
    }, stepDurations[step]);
    return () => {
      if (stepTimer.current !== null) window.clearTimeout(stepTimer.current);
    };
  }, [step, running]); // eslint-disable-line react-hooks/exhaustive-deps

  const stageClass = [
    "about-why__stage",
    running ? "about-why__stage--running" : "",
    shifting ? "about-why__stage--shift" : "",
    logoActive ? "about-why__stage--logo" : "",
    finalActive ? "about-why__stage--final" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stageClass} ref={stageRef}>
      <span className="about-why__talent">{talent}</span>

      <span className="about-why__arrow" aria-hidden="true">
        <FontAwesomeIcon icon={faArrowRight} />
      </span>

      <span className="about-why__opportunity">{opportunity}</span>

      <img
        className="about-why__mark"
        src={NAGRIVA_LOGO}
        alt="Nagriva"
        width={240}
        height={240}
      />

      <span className="about-why__finalline">{final}</span>
    </div>
  );
}

function ResultsSection() {
  const { results } = aboutPage;
  return (
    <section className="about-section about-results" aria-labelledby="about-results-title">
      <div className="about-section__inner">
        <p className="eyebrow about-section__eyebrow about-results__eyebrow">
          <span className="about-section__index">04</span>
          {results.eyebrow}
        </p>
        <h2 id="about-results-title">{results.title}</h2>
        <p className="about-section__statement">{results.intro}</p>

        <div className="about-results__list">
          {results.items.map((item, index) => (
            <article className="about-result" key={index}>
              <h3 className="about-result__label">{item.label}</h3>
              <div className="about-result__row">
                <div className="about-result__side">
                  <span className="about-result__side-label">Before</span>
                  <p>{item.before}</p>
                </div>
                <span className="about-result__arrow" aria-hidden="true">
                  →
                </span>
                <div className="about-result__side about-result__side--after">
                  <span className="about-result__side-label">After</span>
                  <p>{item.after}</p>
                </div>
              </div>
              <p className="about-result__note">
                <span aria-hidden="true" />
                {item.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const { gallery } = aboutPage;
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-gallery__item--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    list.querySelectorAll(".about-gallery__item").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section about-gallery" aria-labelledby="about-gallery-title">
      <div className="about-section__inner">
        <p className="eyebrow about-section__eyebrow">
          <span className="about-section__index">05</span>
          {gallery.eyebrow}
        </p>
        <h2 id="about-gallery-title">{gallery.title}</h2>
        <p className="about-section__statement">{gallery.intro}</p>

        <ul className="about-gallery__grid" ref={listRef}>
          {gallery.items.map((item, index) => (
            <li className={`about-gallery__item about-gallery__item--${index + 1}`} key={index}>
              <figure className="about-gallery__figure">
                <img src={item.image} alt={item.alt} loading="lazy" />
                <figcaption>{item.tag}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      section.classList.add("about-cta--visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("about-cta--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-cta" ref={sectionRef} aria-labelledby="about-cta-title">
      <div className="about-cta__panel">
        <p className="eyebrow about-cta__eyebrow">Take the next step</p>
        <h2 id="about-cta-title">
          You&apos;ve seen the story.
          <br />
          <span>Let&apos;s start yours.</span>
        </h2>
        <p className="about-cta__description">
          Tell us what you&apos;re working on. If we can help, we&apos;ll tell you honestly —
          and if we can&apos;t, we&apos;ll tell you that too.
        </p>
        <a className="about-cta__button" href="#start">
          Start with Nagriva
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

export default About;
