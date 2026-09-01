import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { services } from "../data/siteData";

function Services() {
  return (
    <main className="services-page" id="services">
      <section className="services-hero" aria-labelledby="services-hero-title">
        <div className="services-hero__container">
          <div className="services-hero__content">
            <p className="eyebrow services-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              Services
            </p>
            <h1 id="services-hero-title">
              Digital work that makes your business <span>look credible.</span>
            </h1>
            <p className="services-hero__description">
              Nagriva designs and builds focused digital experiences for businesses that want to
              look professional online — and perform like it.
            </p>
          </div>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-list-title">
        <div className="section-heading">
          <div className="section-heading__copy">
            <h2 id="services-list-title">
              What  <span className="services-title__accent">we do</span>
            </h2>
            <p className="section-intro">
              Design and development, delivered with clarity and a premium finish.
            </p>
          </div>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article
              className={`service-card${service.isCore ? " service-card--core" : ""}`}
              key={service.title}
            >
              <div className="service-card__topline">
                <span className="service-card__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={service.icon} />
                </span>
                {service.isCore && <span className="service-card__core-label">Core Service</span>}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-value" aria-labelledby="services-value-title">
        <div>
          <p className="eyebrow services-value__eyebrow">How we work</p>
          <h2 id="services-value-title">
            Built around clarity, <span className="services-value__accent">not complexity.</span>
          </h2>
        </div>
        <div>
          <p className="services-value__copy">
            Every Nagriva project stays focused on clear structure, intentional design, responsive performance, and business results.
          </p>
          <ul className="services-value__list">
            <li>Clear structure</li>
            <li>Intentional design</li>
            <li>Responsive performance</li>
            <li>Business results</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Services;