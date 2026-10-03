import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import { startHero, startWhatsappUrl } from "../../data/startPage";

function StartHero() {
  const headlineId = "start-hero-title";

  return (
    <section className="start-hero" aria-labelledby={headlineId}>
      <div className="start-hero__container">
        <div className="start-hero__content">
          <p className="eyebrow start-hero__eyebrow">
            {startHero.eyebrow}
          </p>
          <h1 id={headlineId} className="start-hero__headline-text" dir="ltr" lang="en">
            {startHero.headlineBaseEn}
            <span>{startHero.headlineAccentEn}</span>
          </h1>
          <p className="start-hero__description">{startHero.description}</p>

          <ul className="start-hero__reassurance">
            {startHero.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="start-hero__alt">
            <p className="start-hero__alt-note">{startHero.contactNote}</p>
            <a className="start-hero__alt-link" href={startWhatsappUrl}>
              <FontAwesomeIcon className="start-hero__alt-icon" icon={faWhatsapp} aria-hidden="true" />
              <span>{startHero.contactWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartHero;
