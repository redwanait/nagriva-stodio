import { useCallback, useRef, useState } from "react";
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
import CallBookingModal from "./CallBookingModal";

const faqItems = [
  {
    q: "What does nagriva offer?",
    a: "We offer modern website design and development that you won't find anywhere else outside of Nagriva.(Start with Nagriva, my friend.)",
  },
  {
    q: "How does the payment process work?",
    a: "Payment is of two types. The first type is in three installments, meaning that after each completed task on the site, a payment is made towards the agreed-upon amount. The second type is a full payment, and this payment method is characterized by the speed of site completion. (Start with Nagriva, my friend.)",
  },
  {
    q: "How long does it take to complete the website?",
    a: "Between two weeks and a month, depending on the customer's requirements. started with Nagriva, my friend.",
  },
  {
    q: "Cost of creating a website",
    a: "Between 500 dirhams, at Nagriva our concern is not profit, but helping you grow. Start with Nagriva, my friend.",
  },
  {
    q: "Is it possible to request changes after completion?",
    a: "Yes, of course, we've had customers for 3 years and we're still working on improving the website. Start with Nagriva, my friend. ",
  },



];

function FaqCtaSection() {
  const [callModalOpen, setCallModalOpen] = useState(false);
  const bookButtonRef = useRef<HTMLButtonElement | null>(null);

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

          <button
            ref={bookButtonRef}
            className="faq-cta-section__button"
            type="button"
            onClick={() => setCallModalOpen(true)}
          >
            Book a Free Call
          </button>
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

      {callModalOpen && (
        <CallBookingModal
          onClose={() => setCallModalOpen(false)}
          returnFocusRef={bookButtonRef}
        />
      )}
    </section>
  );
}

export default FaqCtaSection;
