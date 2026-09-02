import { useEffect, useRef } from "react";
import { aboutPage } from "../data/siteData";
import founderImage from "../assets/aboutimage/the founder.png";

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
            <p className="eyebrow about-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <h1 id="about-hero-title">{hero.title}</h1>
            <p className="about-hero__statement">{hero.statement}</p>
            <p className="about-hero__paragraph">{hero.paragraph}</p>
            <p className="about-hero__signature" aria-hidden="true">
              Redouane
            </p>
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
      <div className="about-section__inner">
        <p className="eyebrow about-section__eyebrow">
          <span className="about-section__index">02</span>
          {problem.eyebrow}
        </p>
        <h2 id="about-problem-title">{problem.title}</h2>
        <p className="about-section__statement">{problem.statement}</p>

        <ul className="about-problem__list">
          {problem.points.map((point) => (
            <li className="about-problem__item" key={point.number}>
              <span className="about-problem__number" aria-hidden="true">
                {point.number}
              </span>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
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

        <ol className="about-why__list">
          {why.reasons.map((reason) => (
            <li className="about-why__item" key={reason.number}>
              <span className="about-why__number" aria-hidden="true">
                {reason.number}
              </span>
              <h3>{reason.question}</h3>
              <p>{reason.answer}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
