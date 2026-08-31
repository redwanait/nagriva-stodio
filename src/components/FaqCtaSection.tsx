import { useCallback } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import meetImg from "../assets/faqimages/meet.png";
import messengerImg from "../assets/faqimages/messenger.webp";
import skypeImg from "../assets/faqimages/skype.png";
import whatsappImg from "../assets/faqimages/whatsapp.png";

const faqItems = [
  {
    q: "What services do you offer?",
    a: "Nagriva offers website design and development, brand identity, and digital strategy for businesses that need a professional online presence. Every project is built from scratch with clean code, fast performance, and a focus on converting visitors into customers.",
  },
  {
    q: "How does your process work?",
    a: "We follow a simple three-step process: strategy and discovery, design and development, and launch with ongoing support. You'll be involved at key checkpoints, and everything is transparent — no surprises, no jargon.",
  },
  {
    q: "How long does a project take?",
    a: "Most projects are completed within 3 to 6 weeks, depending on scope and complexity. During our initial call, we'll give you a clear timeline tailored to your specific needs.",
  },
  {
    q: "How much does a website cost?",
    a: "Pricing depends on the type and scope of the project. We offer transparent, upfront pricing after a brief discovery call — no hidden fees or surprise invoices. Most clients invest between $2,000 and $8,000 for a custom website.",
  },
  {
    q: "Can you work with an existing brand?",
    a: "Absolutely. We regularly work with established brands that need a website refresh or a new digital touchpoint. We adapt to your existing identity while improving how it performs online.",
  },



];

function FaqCtaSection() {
  const handleToggle = useCallback(
    (_index: number, e: MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const panel = document.getElementById(
        button.getAttribute("aria-controls") ?? "",
      );
      if (!panel) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        button.setAttribute("aria-expanded", "false");
        panel.style.height = "0px";
        panel.style.opacity = "0";
      } else {
        button.setAttribute("aria-expanded", "true");
        panel.style.height = panel.scrollHeight + "px";
        panel.style.opacity = "1";
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (_index: number, e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLButtonElement).click();
      }
    },
    [],
  );

  return (
    <section
      className="faq-cta-section"
      aria-labelledby="faq-cta-title"
    >
      <div className="faq-cta-section__inner">
        <div className="faq-cta-section__left">
          <p className="faq-cta-pill">LET'S TALK</p>
          <h2 id="faq-cta-title">Have a question? Let's talk.</h2>
          <p className="faq-cta-section__desc">
            Book a free 15-minute call to discuss your project, answer your
            questions, and figure out the best next step.
          </p>

          <a className="faq-cta-section__button" href="#start">
            Book a Free Call <span aria-hidden="true">→</span>
          </a>
          <p className="faq-cta-section__meta">15 min · Free · No commitment</p>

          <div className="faq-cta-section__icons" aria-hidden="true">
            <span className="faq-cta-section__icon-circle faq-cta-section__icon-circle--1">
              <img className="faq-cta-section__icon-img" src={meetImg} alt="" />
            </span>
            <span className="faq-cta-section__icon-circle faq-cta-section__icon-circle--2">
              <img className="faq-cta-section__icon-img" src={messengerImg} alt="" />
            </span>
            <span className="faq-cta-section__icon-circle faq-cta-section__icon-circle--3">
              <img className="faq-cta-section__icon-img" src={skypeImg} alt="" />
            </span>
            <span className="faq-cta-section__icon-circle faq-cta-section__icon-circle--4">
              <img className="faq-cta-section__icon-img" src={whatsappImg} alt="" />
            </span>
          </div>
        </div>

        <div className="faq-cta-section__right">
          <p className="faq-cta-section__right-eyebrow">FAQ</p>
          <h3 className="faq-cta-section__right-heading">
            Frequently Asked Questions
          </h3>

          <div className="faq-accordion" role="list">
            {faqItems.map((item, i) => {
              const id = `faq-panel-${i}`;
              const btnId = `faq-btn-${i}`;
              return (
                <div className="faq-accordion__item" role="listitem" key={id}>
                  <button
                    id={btnId}
                    className="faq-accordion__trigger"
                    type="button"
                    aria-expanded="false"
                    aria-controls={id}
                    onClick={(e) => handleToggle(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  >
                    <span className="faq-accordion__question">{item.q}</span>
                    <span className="faq-accordion__icon" aria-hidden="true">
                      <FontAwesomeIcon icon={faPlus} className="faq-accordion__icon-plus" />
                      <FontAwesomeIcon icon={faMinus} className="faq-accordion__icon-minus" />
                    </span>
                  </button>
                  <div
                    id={id}
                    className="faq-accordion__panel"
                    role="region"
                    aria-labelledby={btnId}
                    style={{ height: 0, opacity: 0 }}
                  >
                    <p className="faq-accordion__answer">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqCtaSection;
