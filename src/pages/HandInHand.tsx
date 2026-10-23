import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBullseye,
  faCircleInfo,
  faEnvelope,
  faHandshake,
  faImages,
  faLink,
  faMobileScreen,
  faPlay,
  faQuoteLeft,
  faVideo,
  faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";
import FinalCta from "../components/FinalCta";
import StartWithNagrivaButton from "../components/StartWithNagrivaButton";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs["hand-in-hand"];

const benefits = [
  {
    icon: faWindowMaximize,
    title: "A dedicated project landing page",
    description:
      "A page of your own, designed around your project rather than a generic template.",
  },
  {
    icon: faBullseye,
    title: "A clear presentation of your mission",
    description:
      "Your purpose, values, and goals explained in language people can understand and remember.",
  },
  {
    icon: faImages,
    title: "Room for your activities and impact",
    description:
      "Space to show what you do, who you serve, and the difference your work makes.",
  },
  {
    icon: faLink,
    title: "Links to your social media",
    description:
      "A simple way for visitors to follow your work, stay close, and keep the conversation going.",
  },
  {
    icon: faEnvelope,
    title: "Contact details and clear actions",
    description:
      "Straightforward paths for people to reach you, support you, or get involved.",
  },
  {
    icon: faMobileScreen,
    title: "A responsive experience",
    description:
      "A layout that stays readable, usable, and considered on phones, tablets, and desktop screens.",
  },
];

const steps = [
  {
    number: "01",
    title: "Submit your project details",
    description:
      "Tell us who you are, what your project does, and why a stronger online presence would help. A short application is enough to start.",
  },
  {
    number: "02",
    title: "We review your application",
    description:
      "We read every application carefully and look for projects where Hand in Hand can make a real, lasting difference.",
  },
  {
    number: "03",
    title: "We contact you",
    description:
      "If your project is a good fit, we will get in touch to talk about your goals, your story, and the next steps.",
  },
  {
    number: "04",
    title: "We build it together",
    description:
      "We agree on the content and direction, then design and build your project landing page from the first draft to launch.",
  },
];

const collaborationPoints = [
  {
    number: "01",
    title: "A short script, agreed together",
    description:
      "We shape a simple script in your own words, so the video sounds like you — not like an advertisement.",
  },
  {
    number: "02",
    title: "Clear recording guidelines",
    description:
      "We share straightforward guidance on framing, sound, and lighting. A phone camera and a quiet space are enough.",
  },
  {
    number: "03",
    title: "A respectful, shared process",
    description:
      "You stay involved from the first idea to the final cut, with time to ask questions and feel comfortable with the result.",
  },
];

const showcaseSlots = [
  {
    tone: "a",
    number: "01",
    title: "A community initiative",
    description:
      "A place for the mission, the people involved, and the many ways to take part.",
  },
  {
    tone: "b",
    number: "02",
    title: "A small local business",
    description:
      "A clear home for services, the story behind the work, and a simple way to get in touch.",
  },
  {
    tone: "c",
    number: "03",
    title: "An association with a cause",
    description:
      "Space for the impact, the voices behind it, and a direct call to support the work.",
  },
];

function useReveal() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-hand-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("hand-reveal--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hand-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}

function Hero() {
  return (
    <section className="hand-hero" aria-labelledby="hand-hero-title">
      <div className="hand-hero__container">
        <div className="hand-hero__content">
          <p className="hand-hero__eyebrow">Hand in Hand · A Nagriva initiative</p>
          <h1 id="hand-hero-title">
            Your mission deserves <span>to be seen.</span>
          </h1>
          <p className="hand-hero__description">
            We help small businesses, associations, and community initiatives build a stronger
            online presence through a professional website that tells their story.
          </p>
          <div className="hand-hero__actions">
            <StartWithNagrivaButton
              className="sw-button--lg hand-hero__primary"
              href="#apply"
              label="Apply for Hand in Hand"
            />
            <a className="button button--secondary hand-hero__secondary" href="#how-it-works">
              See how it works
              <span className="hand-hero__secondary-arrow" aria-hidden="true">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </a>
          </div>
          <p className="hand-hero__note">
            <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
            Submitting an application does not guarantee acceptance. Applications are reviewed
            with care.
          </p>
        </div>

        <div className="hand-hero__visual">
          <div className="hand-hero__stage">
            <div className="hand-hero__frame" aria-hidden="true">
              <div className="hand-hero__frame-bar">
                <span className="hand-hero__frame-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Hand in Hand / project page</span>
                <span>001</span>
              </div>
              <div className="hand-hero__frame-body">
                <div className="hand-hero__canvas">
                  <span className="hand-hero__canvas-kicker">A digital home</span>
                  <p className="hand-hero__canvas-title">A clearer way to be seen.</p>
                  <span className="hand-hero__canvas-lines">
                    <span />
                    <span />
                  </span>
                  <span className="hand-hero__canvas-tags">
                    <span>Mission</span>
                    <span>Activities</span>
                    <span>Contact</span>
                  </span>
                </div>
                <div className="hand-hero__frame-footer">
                  <div>
                    <span>01</span>
                    <strong>Story</strong>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Work</strong>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Reach</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="hand-hero__badge">
              <span className="hand-hero__badge-icon">
                <FontAwesomeIcon icon={faHandshake} aria-hidden="true" />
              </span>
              <span className="hand-hero__badge-copy">
                <strong>Made together</strong>
                with Nagriva
              </span>
            </div>
          </div>
          <p className="hand-hero__visual-caption">
            A sample layout — your story shapes the real thing.
          </p>
        </div>
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="hand-intro" aria-labelledby="hand-intro-title">
      <div className="hand-intro__container">
        <div className="hand-intro__heading" data-hand-reveal>
          <p className="hand-intro__eyebrow">The initiative</p>
          <h2 id="hand-intro-title">Good work should not stay invisible.</h2>
        </div>

        <div className="hand-intro__body" data-hand-reveal>
          <p>
            Hand in Hand is a Nagriva initiative created to help small projects look as serious
            online as they are in real life. Many people build something meaningful without ever
            having a place to explain it clearly, share it with confidence, or invite others in.
          </p>
          <p>
            We work with small businesses, associations, and community initiatives that have a
            clear purpose but not the time, budget, or confidence to build a professional web
            presence on their own. Selected projects receive a focused landing page — designed,
            written, and built with the same care we bring to every Nagriva project.
          </p>
          <p className="hand-intro__quote">
            <FontAwesomeIcon icon={faQuoteLeft} aria-hidden="true" />
            The goal is not simply to be online. It is to be understood.
          </p>
          <ul className="hand-intro__tags" aria-label="Projects we work with">
            <li>Small businesses</li>
            <li>Associations</li>
            <li>Community initiatives</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="hand-receive" aria-labelledby="hand-receive-title">
      <div className="hand-receive__container">
        <div className="hand-receive__header" data-hand-reveal>
          <div>
            <p className="hand-receive__eyebrow">What participants receive</p>
            <h2 id="hand-receive-title">A digital home for the work that matters.</h2>
          </div>
          <p className="hand-receive__intro">
            Every Hand in Hand project is built around the same essentials — clear, useful, and
            ready to grow with the project.
          </p>
        </div>

        <ul className="hand-benefits">
          {benefits.map((benefit, index) => (
            <li
              className="hand-benefit"
              key={benefit.title}
              data-hand-reveal
              style={{ transitionDelay: `${Math.min(index, 5) * 60}ms` }}
            >
              <div className="hand-benefit__top">
                <span className="hand-benefit__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={benefit.icon} />
                </span>
                <span className="hand-benefit__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="hand-how" id="how-it-works" aria-labelledby="hand-how-title">
      <div className="hand-how__header" data-hand-reveal>
        <p className="hand-how__eyebrow">How it works</p>
        <h2 id="hand-how-title">A simple path from idea to online.</h2>
        <p className="hand-how__intro">
          Four clear steps, with room for conversation along the way. You do not need a finished
          brief or a technical background to apply.
        </p>
      </div>

      <ol className="hand-how__steps">
        {steps.map((step, index) => (
          <li
            className="hand-step"
            key={step.number}
            data-hand-reveal
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <span className="hand-step__marker">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="hand-how__note" data-hand-reveal>
        <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
        <p>
          <strong>Submitting an application does not guarantee acceptance.</strong> We select a
          limited number of projects each cycle based on fit, readiness, and the capacity of our
          small team.
        </p>
      </div>
    </section>
  );
}

function Collaboration() {
  return (
    <section className="hand-collab" id="collaboration" aria-labelledby="hand-collab-title">
      <div className="hand-collab__container">
        <div className="hand-collab__content" data-hand-reveal>
          <p className="hand-collab__eyebrow">The collaboration</p>
          <h2 id="hand-collab-title">Built together, in good faith.</h2>
          <div className="hand-collab__body">
            <p>
              Hand in Hand is a collaboration, not a giveaway. Selected participants contribute a
              short, UGC-style video that introduces their project in their own voice.
            </p>
            <p>
              We agree on a simple script and clear recording guidelines together, so the process
              feels natural and respectful. The video helps more people discover the initiative
              and keeps Hand in Hand open for the projects that come next.
            </p>
          </div>
          <p className="hand-collab__note">
            <FontAwesomeIcon icon={faVideo} aria-hidden="true" />
            No filming experience required.
          </p>
        </div>

        <div className="hand-collab__card" data-hand-reveal>
          <div className="hand-collab__card-top">
            <span className="hand-collab__play" aria-hidden="true">
              <FontAwesomeIcon icon={faPlay} />
            </span>
            <div>
              <p className="hand-collab__card-kicker">A short video, in your voice</p>
              <p className="hand-collab__card-sub">What we agree on together</p>
            </div>
          </div>

          <ul className="hand-collab__list">
            {collaborationPoints.map((point) => (
              <li key={point.number}>
                <span className="hand-collab__list-number">{point.number}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="hand-collab__card-foot">
            A phone camera is enough. We share the guidelines before anything is recorded.
          </p>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="hand-showcase" aria-labelledby="hand-showcase-title">
      <div className="hand-showcase__container">
        <div className="hand-showcase__header" data-hand-reveal>
          <div className="hand-showcase__header-copy">
            <p className="hand-showcase__eyebrow">Project showcase</p>
            <h2 id="hand-showcase-title">The first projects are on their way.</h2>
            <p className="hand-showcase__intro">
              This space is reserved for the projects selected through Hand in Hand. As each
              project is completed, its page will appear here.
            </p>
          </div>
          <span className="hand-showcase__flag">Sample layouts</span>
        </div>

        <div className="hand-showcase__grid">
          {showcaseSlots.map((slot, index) => (
            <article
              className="hand-sample"
              key={slot.number}
              data-hand-reveal
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div
                className={`hand-sample__visual hand-sample__visual--${slot.tone}`}
                aria-hidden="true"
              >
                <span className="hand-sample__orb" />
                <span className="hand-sample__badge">Sample</span>
                <div className="hand-sample__chrome">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hand-sample__page">
                  <span className="hand-sample__page-kicker" />
                  <span className="hand-sample__page-title" />
                  <span className="hand-sample__page-line" />
                  <span className="hand-sample__page-line hand-sample__page-line--short" />
                  <span className="hand-sample__page-blocks">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className="hand-sample__body">
                <p className="hand-sample__meta">Sample layout · {slot.number}</p>
                <h3>{slot.title}</h3>
                <p>{slot.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="hand-showcase__footnote" data-hand-reveal>
          These are visual placeholders. No real beneficiaries, testimonials, or statistics are
          shown here.
        </p>
      </div>
    </section>
  );
}

function HandInHand() {
  useSeo(SEO);
  const pageRef = useReveal();

  return (
    <main className="hand-page" id="hand-in-hand" ref={pageRef}>
      <Hero />
      <Introduction />
      <Benefits />
      <HowItWorks />
      <Collaboration />
      <Showcase />
      <FinalCta />
    </main>
  );
}

export default HandInHand;
