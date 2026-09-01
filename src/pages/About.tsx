import FinalCta from "../components/FinalCta";
import { aboutData } from "../data/siteData";
import founderImage from "../assets/aboutimage/the founder.png";

function About() {
  return (
    <main className="about-page" id="about-page">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero__container">
          <div className="about-hero__content">
            <p className="eyebrow about-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {aboutData.hero.eyebrow}
            </p>
            <h1 id="about-hero-title">
              {aboutData.hero.title} <span>{aboutData.hero.titleAccent}</span>
            </h1>
            <p className="about-hero__description">{aboutData.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="about-founder" aria-labelledby="about-founder-title">
        <div className="about-founder__content">
          <p className="eyebrow about-founder__eyebrow">{aboutData.intro.eyebrow}</p>
          <h2 id="about-founder-title">
            {aboutData.intro.title} <span>{aboutData.intro.titleAccent}</span>
          </h2>
          <p className="about-founder__paragraph">{aboutData.intro.paragraph}</p>
          <p className="about-founder__identity">
            <strong>{aboutData.intro.founder}</strong>
            <span>{aboutData.intro.founderRole}</span>
          </p>
          <div className="about-founder__actions">
            <a className="button button--primary" href={aboutData.intro.linkOne}>
              Talk to Redouane
            </a>
            <a className="button button--secondary" href={aboutData.intro.linkTwo}>
              Know how is Nagriva
            </a>
          </div>
        </div>
        <div className="about-founder__media">
          <img
            className="about-founder__image"
            src={founderImage}
            alt="Redouane Ait El-Hadji, founder of Nagriva"
          />
        </div>
      </section>

      <section className="about-capabilities" aria-labelledby="about-capabilities-title">
        <div className="about-section-heading">
          <p className="eyebrow">{aboutData.sections.capabilities.eyebrow}</p>
          <h2 id="about-capabilities-title">{aboutData.sections.capabilities.title}</h2>
          <p className="about-section-heading__intro">
            {aboutData.sections.capabilities.intro}
          </p>
        </div>
        <div className="about-capabilities__grid">
          {aboutData.capabilities.map((capability, index) => (
            <article className="about-capability" key={capability.title}>
              <span className="about-capability__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-tools" aria-labelledby="about-tools-title">
        <div className="about-section-heading">
          <p className="eyebrow">{aboutData.sections.tools.eyebrow}</p>
          <h2 id="about-tools-title">{aboutData.sections.tools.title}</h2>
        </div>
        <ul className="about-tools__list">
          {aboutData.tools.map((tool) => (
            <li className="about-tool" key={tool.name}>
              <h3>
                <img className="about-tool__logo" src={tool.image} alt={`${tool.name} logo`} />
                {tool.name}
              </h3>
              <p>{tool.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-clients" aria-labelledby="about-clients-title">
        <div className="about-section-heading">
          <p className="eyebrow">{aboutData.sections.clients.eyebrow}</p>
          <h2 id="about-clients-title">{aboutData.sections.clients.title}</h2>
          <p className="about-section-heading__intro">
            {aboutData.sections.clients.intro}
          </p>
        </div>
        <div className="about-clients__grid">
          {aboutData.clients.map((client) => (
            <article className="about-client" key={client.name}>
              <img
                className="about-client__avatar"
                src={client.image}
                alt={`${client.name}, Nagriva client`}
              />
              <h3>{client.name}</h3>
              <p>{client.description}</p>
            </article>
          ))}
        </div>
      </section>

      <FinalCta />
    </main>
  );
}

export default About;