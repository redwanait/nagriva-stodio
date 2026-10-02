import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { aboutPage } from "../../data/siteData";

/*
 * 04 — History and evolution.
 *
 * A horizontally scrollable row of year cards. The carousel is native CSS
 * scrolling — `scroll-snap` plus `scrollBy` — so there is no dependency, touch
 * gestures, trackpad and keyboard all behave exactly as the platform intends,
 * and the arrows are a thin enhancement on top rather than the only way through.
 *
 * The two controls are real buttons: their `disabled` state is derived from the
 * track's scroll position, so they grey out at each end of the row and keyboard
 * users get the same affordance as everyone else. Each press advances by one
 * card, which keeps the movement small and predictable instead of jumping.
 *
 * The entrance reveal is the same one-line IntersectionObserver pattern used by
 * the neighbouring sections; with reduced motion the cards are simply there.
 */

const SCROLL_TOLERANCE = 2;

function HistoryTimeline() {
  const { title, entries } = aboutPage.history;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncControls = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;

    setAtStart(track.scrollLeft <= SCROLL_TOLERANCE);
    setAtEnd(maxScroll <= SCROLL_TOLERANCE || track.scrollLeft >= maxScroll - SCROLL_TOLERANCE);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    syncControls();

    if (!("IntersectionObserver" in window)) {
      section.classList.add("about-history--visible");
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          section.classList.add("about-history--visible");
          observer.disconnect();
        },
        { threshold: 0.15 },
      );

      observer.observe(section);
    }

    // Passive: we only read the scroll position, we never animate it here.
    track.addEventListener("scroll", syncControls, { passive: true });
    window.addEventListener("resize", syncControls);

    /*
     * The first measurement can land before the stylesheet has laid the cards
     * out, which would read as "nothing to scroll" and pin both arrows to
     * disabled. Watching the cards and re-measuring once the fonts settle keeps
     * the arrows honest whenever the row's length actually changes.
     */
    const frame = window.requestAnimationFrame(syncControls);
    void document.fonts?.ready.then(syncControls);
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(syncControls);

    resizeObserver?.observe(track);
    track.querySelectorAll<HTMLElement>(".about-history__card").forEach((card) => {
      resizeObserver?.observe(card);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      track.removeEventListener("scroll", syncControls);
      window.removeEventListener("resize", syncControls);
    };
  }, [syncControls]);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".about-history__card");

    if (!track || !card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <section
      className="about-history"
      aria-labelledby="about-history-title"
      ref={sectionRef}
    >
      <div className="about-history__container">
        <div className="about-history__header">
          <h2 id="about-history-title" data-history-reveal>
            {title}
          </h2>
          <div className="about-history__controls">
            <button
              className="about-history__arrow"
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous years"
            >
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            </button>
            <button
              className="about-history__arrow"
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next years"
            >
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </button>
          </div>
        </div>

        <ol
          className="about-history__track"
          ref={trackRef}
          tabIndex={0}
          aria-label={`${title}: ${entries.length} years`}
        >
          {entries.map((entry) => (
            <li
              className="about-history__card"
              key={entry.year}
              data-history-reveal
            >
              <span className="about-history__year">{entry.year}</span>
              <p className="about-history__description">{entry.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HistoryTimeline;