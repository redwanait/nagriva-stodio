import { useEffect, useRef, useState } from "react";
import { faArrowRight, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { aboutPage } from "../../data/siteData";
import { useProtectedImage } from "../../hooks/useProtectedImage";

/*
 * 03 — What Nagriva is used for.
 *
 * The most visual section of the About page: the studio's own footage on the
 * left, a heading, a paragraph and the page's bare "Learn more" link on the right,
 * nothing else. The same page measure, type scale and 16px radius as the sections
 * around it, so it reads as the next chapter of the same page.
 *
 * The video is decorative looping footage, so it plays muted, inline and
 * without controls, keeps its own 1112x1080 proportions (no `object-fit`, so
 * nothing is cropped) and is only decoded — and only downloaded — while it is
 * actually on screen.
 *
 * A single overlay button owns play and pause for visitors who do not want the
 * motion. Two pieces of state make that work: `playing` mirrors the element
 * itself (the video's own play/pause events own it, so a rejected autoplay shows
 * the right icon), while `pausedByUser` remembers the visitor's choice so the
 * scroll observer below never resumes a video they deliberately stopped.
 *
 * The reveal follows the pattern already used by the final CTA and the Process
 * page: one IntersectionObserver, one class, short staggered transitions. With
 * reduced motion — or without IntersectionObserver — nothing is ever hidden.
 */

function WhatNagrivaIsUsedFor() {
  const { title, paragraph, cta, video } = aboutPage.whatNagrivaIsUsedFor;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const protectedImage = useProtectedImage();
  // Whether playback was stopped on purpose, as opposed to by the scroll
  // observer parking an off-screen video.
  const pausedByUser = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const element = videoRef.current;

    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("about-used-for--visible");
      element?.play().catch(() => undefined);
      return;
    }

    let revealed = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Reveal once, then only manage playback: a looping video that is off
        // screen keeps neither the decoder nor the compositor busy.
        if (entry.isIntersecting) {
          if (!revealed) {
            revealed = true;
            section.classList.add("about-used-for--visible");
          }
          if (!pausedByUser.current) element?.play().catch(() => undefined);
        } else {
          element?.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  function togglePlayback() {
    const element = videoRef.current;

    if (!element) return;

    if (element.paused) {
      pausedByUser.current = false;
      element.play().catch(() => undefined);
    } else {
      pausedByUser.current = true;
      element.pause();
    }
  }

  return (
    <section
      className="about-used-for"
      aria-labelledby="about-used-for-title"
      ref={sectionRef}
    >
      <div className="about-used-for__container">
        <figure className="about-used-for__media" data-used-reveal {...protectedImage}>
          {/*
           * WebM first, MP4 behind it for browsers without VP9 — the same five
           * seconds either way. `preload="none"` plus no `autoPlay` attribute is
           * what actually saves the bytes: the observer above starts the download
           * with `play()` only once the section is on screen, so the clip never
           * competes with the hero on first load.
           */}
          <video
            className="about-used-for__video"
            ref={videoRef}
            width={video.width}
            height={video.height}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            tabIndex={-1}
            aria-label={video.label}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={video.src} type="video/webm" />
            <source src={video.fallbackSrc} type="video/mp4" />
          </video>
          <button
            className="about-used-for__toggle"
            type="button"
            aria-label={playing ? "Pause the video" : "Play the video"}
            aria-pressed={playing}
            onClick={togglePlayback}
          >
            <FontAwesomeIcon icon={playing ? faPause : faPlay} aria-hidden="true" />
          </button>
        </figure>

        <div className="about-used-for__content">
          <h2 id="about-used-for-title" data-used-reveal>
            {title}
          </h2>
          <p className="about-used-for__paragraph" data-used-reveal>
            {paragraph}
          </p>
          <p className="about-used-for__actions" data-used-reveal>
            <a className="about-cta-link" href={cta.href}>
              {cta.label}
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatNagrivaIsUsedFor;