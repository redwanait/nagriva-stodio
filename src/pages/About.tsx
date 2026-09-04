import { aboutPage } from "../data/siteData";
import founderImage from "../assets/aboutimage/the founder.png";
import senatorImage from "../assets/aboutimage/Senator.png";
import FinalCta from "../components/FinalCta";
import { useSeo } from "../hooks/useSeo";

const SEO = {
  title: "About \u2014 Nagriva",
  description: "Nagriva is a digital studio based in Morocco. We design and build websites, online stores, and brand identities \u2014 one team, one process.",
  canonical: "https://nagriva.ma/about",
  og: { title: "About \u2014 Nagriva", description: "Nagriva is a digital studio based in Morocco designing and building websites, online stores, and brand identities.", url: "https://nagriva.ma/about" },
  twitter: { title: "About \u2014 Nagriva", description: "Nagriva is a digital studio based in Morocco designing and building websites, online stores, and brand identities.", card: "summary_large_image" as const },
};

function About() {
  useSeo(SEO);
  return (
    <main className="about-page" id="about-page">
      <AboutHero />
      <WhatIsSection />
      <WhySection />
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

function WhatIsSection() {
  const { whatIs } = aboutPage;
  return (
    <section className="about-what-is" aria-labelledby="about-what-is-title">
      <div className="about-what-is__container">
        <h2 id="about-what-is-title">{whatIs.title}</h2>
        <p className="about-what-is__paragraph">{whatIs.paragraph}</p>
        <div className="about-what-is__buttons">
          {whatIs.buttons.map((btn) => (
            <a
              className={`button button--${btn.variant ?? "primary"}`}
              href={btn.href}
              key={btn.label}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { whyNagriva } = aboutPage;
  return (
    <section className="about-why" aria-labelledby="about-why-title">
      <div className="about-why__container">
        <h2 id="about-why-title">{whyNagriva.title}</h2>
        <div className="about-why__list">
          {whyNagriva.principles.map((principle) => (
            <article className="about-why__item" key={principle.number}>
              <span className="about-why__number">{principle.number}</span>
              <div className="about-why__content">
                <h3 className="about-why__label">{principle.title}</h3>
                <p className="about-why__description">{principle.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
