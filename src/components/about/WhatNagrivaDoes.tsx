import { useEffect, useRef } from "react";

import { aboutPage } from "../../data/siteData";

/*
 * 02 — What Nagriva does.
 *
 * The section that follows the hero statistics: copy on the left, the studio's
 * own work on the right, and a single call to action. It deliberately reuses
 * the page's existing pieces — the `eyebrow` label with its blue dot, the
 * primary `button`, the 16px card radius and the same type scale as every other
 * About heading — so it reads as the next chapter of the same page rather than a
 * new layout language.
 *
 * The reveal follows the pattern already used by the final CTA and the Process
 * page: an IntersectionObserver adds one class, CSS transitions the children in
 * with small staggered delays, and the observer disconnects on the first view.
 * Without IntersectionObserver (or with reduced motion) nothing is hidden at
 * all, so the section is never left invisible.
 */

function WhatNagrivaDoes() {
  const { eyebrow, title, paragraph, cta, image } = aboutPage.whatNagrivaDoes;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("about-what-nagriva-does--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        section.classList.add("about-what-nagriva-does--visible");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="about-what-nagriva-does"
      aria-labelledby="about-what-nagriva-does-title"
      ref={sectionRef}
    >
      <div className="about-what-nagriva-does__container">
        <div className="about-what-nagriva-does__content">
          <p className="eyebrow about-what-nagriva-does__eyebrow" data-what-reveal>
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="about-what-nagriva-does-title" data-what-reveal>
            {title}
          </h2>
          <p className="about-what-nagriva-does__paragraph" data-what-reveal>
            {paragraph}
          </p>
          <div className="about-what-nagriva-does__actions" data-what-reveal>
            <a className="button button--primary" href={cta.href}>
              {cta.label}
            </a>
          </div>
        </div>

        <figure className="about-what-nagriva-does__media" data-what-reveal>
          <img
            className="about-what-nagriva-does__image"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}

export default WhatNagrivaDoes;