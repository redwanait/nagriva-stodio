import { useEffect, useRef, useState } from "react";

/*
 * CountUpNumber — one value, animated once, when it first becomes visible.
 *
 * The ticking is a single `requestAnimationFrame` loop that stops itself on the
 * final frame, and it only ever exists while the number is on its way to the
 * value it already knows. There is no polling, no `setInterval`, and no state
 * update for a frame that does not change the rendered digit.
 *
 * Trigger: an IntersectionObserver that disconnects as soon as the number has
 * been revealed, so scrolling back and forth never replays the animation and
 * only one observer exists for the whole row.
 *
 * Accessibility: the animated digits are hidden from assistive technology,
 * because a screen reader landing mid-animation would read a partial number.
 * The final value sits next to them as visually hidden text, so the statistic
 * is always announced once, in full. A visitor who prefers reduced motion is
 * never given a loop at all: the final value is the initial render and no
 * observer is created.
 */

const DURATION_MS = 1500;

/* Ease-out cubic: leaves fast, arrives slowly — no bounce, no overshoot. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type CountUpNumberProps = {
  value: number;
};

function CountUpNumber({ value }: CountUpNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  // Reduced motion never animates, so its final value is the initial one and
  // no effect — and no loop — is ever created.
  const [displayed, setDisplayed] = useState(() =>
    prefersReducedMotion() ? value : 0,
  );

  useEffect(() => {
    const node = numberRef.current;

    if (!node || prefersReducedMotion()) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const next = progress === 1 ? value : Math.round(value * easeOut(progress));

      setDisplayed(next);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        // One shot: the animation never replays, and the observer is released
        // as soon as it has done its job.
        observer.disconnect();
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={numberRef} aria-hidden="true">
        {displayed}
      </span>
      <span className="visually-hidden">{value}</span>
    </>
  );
}

export default CountUpNumber;