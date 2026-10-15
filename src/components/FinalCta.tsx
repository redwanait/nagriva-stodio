import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import StartWithNagrivaButton from "./StartWithNagrivaButton";

const keyboardVideo = "/videos/nagriva-keyboard.mp4";
const keyboardPoster = "/videos/nagriva-keyboard-poster.jpg";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("final-cta--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("final-cta--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    const play = () => void video.play().catch(() => undefined);
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, [reducedMotion]);

  return (
    <section className="final-cta" ref={sectionRef} aria-labelledby="final-cta-title">
      <div className="final-cta__panel">
        <div className="final-cta__content">
          <p className="final-cta__eyebrow">LET&apos;S WORK TOGETHER</p>
          <h2 id="final-cta-title">Ready to build something that matters?</h2>
          <p className="final-cta__description">
            Tell us what you&apos;re working on. We&apos;ll help turn your idea into a clear,
            purposeful digital experience.
          </p>
          <div className="final-cta__actions">
            <StartWithNagrivaButton className="sw-button--lg final-cta__button final-cta__button--primary" />
            <a className="final-cta__button final-cta__button--secondary" href="https://wa.me/+212728427278">
              Message us on WhatsApp
              <span className="whatsapp-icon">
                <FontAwesomeIcon className="button--primary-2-icon" icon={faWhatsapp} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>

        <div className="final-cta__media" aria-hidden="true">
          <video
            className="final-cta__video"
            ref={videoRef}
            poster={keyboardPoster}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
          >
            <source src={keyboardVideo} type="video/mp4" />
          </video>
          <span className="final-cta__media-scrim" />
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
