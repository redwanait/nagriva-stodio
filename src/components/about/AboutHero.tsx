import { useState, type PointerEvent } from "react";

import image1 from "../../assets/aboutimageshero/image1.png";
import image1Hover from "../../assets/aboutimageshero/image1-1.png";
import image2 from "../../assets/aboutimageshero/image2.png";
import image2Hover from "../../assets/aboutimageshero/image2-2.png";
import image3 from "../../assets/aboutimageshero/image3.png";
import image3Hover from "../../assets/aboutimageshero/image3-3.png";
import image4 from "../../assets/aboutimageshero/image4.png";
import image4Hover from "../../assets/aboutimageshero/image4-4.png";
import image5 from "../../assets/aboutimageshero/image5.png";
import image5Hover from "../../assets/aboutimageshero/image5-5.png";

import { aboutData } from "../../data/siteData";
import CountUpNumber from "./CountUpNumber";
import TrustpilotReviewCollector from "./TrustpilotReviewCollector";

/*
 * About hero — centred headline over a fanned composition of five image cards.
 *
 * The composition itself is CSS: every card reads its own --x / --y / --r / --z
 * custom properties (see the `.about-hero__card--*` rules in App.css), so the
 * only thing React owns is which card is currently presented. That keeps the
 * whole layout — including the responsive recomposition — tunable in one place,
 * and keeps the hover/focus/tap states free of layout work: only `transform`,
 * `opacity` and `z-index` ever change.
 *
 * Pointer devices get the effect from CSS `:hover`. Touch devices have no
 * hover, so a tap latches the card into the same state and a tap outside the
 * composition releases it; the state is also cleared when a mouse leaves.
 *
 * Both images of a card are always rendered and stacked, so switching views is
 * a crossfade instead of a swap: the outgoing photo stays on screen while the
 * incoming one fades in, and nothing is fetched at interaction time.
 */

type HeroCard = {
  image: string;
  hoverImage: string;
  width: number;
  height: number;
};

const HERO_CARDS: HeroCard[] = [
  { image: image1, hoverImage: image1Hover, width: 320, height: 320 },
  { image: image2, hoverImage: image2Hover, width: 485, height: 485 },
  { image: image3, hoverImage: image3Hover, width: 570, height: 570 },
  { image: image4, hoverImage: image4Hover, width: 570, height: 570 },
  { image: image5, hoverImage: image5Hover, width: 570, height: 570 },
];

const TOTAL = HERO_CARDS.length;

function Stats() {
  return (
    <dl className="about-hero__stats">
      {aboutData.heroStats.map((stat) => (
        <div className="about-hero__stat" key={stat.label}>
          <dt className="about-hero__stat-label">{stat.label}</dt>
          <dd className="about-hero__stat-value">
            <CountUpNumber value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function AboutHero() {
  const { eyebrow, title, titleAccent, description } = aboutData.hero;
  const [presented, setPresented] = useState<number | null>(null);

  function handleToggle(index: number) {
    setPresented((current) => (current === index ? null : index));
  }

  // A mouse leaving a card releases it, so the composition always returns to
  // its resting state even if the card was latched by a click first.
  function handlePointerLeave(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse") setPresented(null);
  }

  // A tap anywhere outside a card dismisses the presented one.
  function handleStagePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!(event.target as Element).closest(".about-hero__card")) {
      setPresented(null);
    }
  }

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__container">
        <div className="about-hero__content">
          <p className="eyebrow about-hero__eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 id="about-hero-title">
            {title} <span>{titleAccent}</span>
          </h1>
          <p className="about-hero__description">{description}</p>
        </div>

        <div
          className="about-hero__stage"
          role="group"
          aria-label="Nagriva work previews"
          onPointerDown={handleStagePointerDown}
        >
          {HERO_CARDS.map((card, index) => (
            <button
              className={`about-hero__card about-hero__card--${index + 1}${
                presented === index ? " is-active" : ""
              }`}
              type="button"
              key={card.image}
              aria-pressed={presented === index}
              aria-label={`Alternate view for preview ${index + 1} of ${TOTAL}`}
              onClick={() => handleToggle(index)}
              onPointerLeave={handlePointerLeave}
            >
              <span className="about-hero__card-media" aria-hidden="true">
                <img
                  className="about-hero__card-image about-hero__card-image--rest"
                  src={card.image}
                  alt=""
                  width={card.width}
                  height={card.height}
                  decoding="async"
                  draggable={false}
                />
                <img
                  className="about-hero__card-image about-hero__card-image--alt"
                  src={card.hoverImage}
                  alt=""
                  width={card.width}
                  height={card.height}
                  decoding="async"
                  draggable={false}
                />
              </span>
            </button>
          ))}
        </div>

        <TrustpilotReviewCollector />
        <Stats />
      </div>
    </section>
  );
}

export default AboutHero;
