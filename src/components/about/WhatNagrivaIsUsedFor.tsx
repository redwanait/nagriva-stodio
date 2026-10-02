import { useEffect, useRef } from "react";

import { aboutPage } from "../../data/siteData";

/*
 * 03 — What Nagriva is used for.
 *
 * The most visual section of the About page: the studio's own footage on the
 * left, a heading and a paragraph on the right, nothing else. The same page
 * measure, type scale and 16px radius as the sections around it, so it reads as
 * the next chapter of the same page.
 *
 * The video is decorative looping footage, so it autoplays muted, inline and
 * without controls, keeps its own 1112x1080 proportions (no `object-fit`, so
 * nothing is cropped) and is only decoded while it is actually on screen.
 *
 * The reveal follows the pattern already used by the final CTA and the Process
 * page: one IntersectionObserver, one class, short staggered transitions. With
 * reduced motion — or without IntersectionObserver — nothing is ever hidden.
 */

function WhatNagrivaIsUsedFor() {
  const { title, paragraph, video } = aboutPage.whatNagrivaIsUsedFor;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          element?.play().catch(() => undefined);
        } else {
          element?.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="about-used-for"
      aria-labelledby="about-used-for-title"
      ref={sectionRef}
    >
      <div className="about-used-for__container">
        <figure className="about-used-for__media" data-used-reveal>
          <video
            className="about-used-for__video"
            ref={videoRef}
            src={video.src}
            width={video.width}
            height={video.height}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            tabIndex={-1}
            aria-label={video.label}
          />
        </figure>

        <div className="about-used-for__content">
          <h2 id="about-used-for-title" data-used-reveal>
            {title}
          </h2>
          <p className="about-used-for__paragraph" data-used-reveal>
            {paragraph}
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatNagrivaIsUsedFor;