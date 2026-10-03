import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { processJourneyStack, processWorkflow } from "../data/siteData";
import { useProtectedImage } from "../hooks/useProtectedImage";

/*
 * Scroll-driven sticky card stack.
 *
 * A tall container provides the scroll distance; each card is `position: sticky`
 * and occupies the same visual area, so the cards stack over one another.
 * Section-scoped progress (0 -> 1 from "container top reaches viewport top" to
 * "container bottom reaches viewport bottom") drives each card's scale. Only
 * `transform` is written, so the animation stays on the compositor and no
 * layout is recalculated while scrolling.
 *
 * The pile builds front-to-back: image 01 is the primary card at the start,
 * then each following image grows in on top of it while the previous one
 * shrinks back into the pile. Later images sit in front (higher z-index), and
 * every card scales from its top edge, so a shrinking card stays pinned at the
 * top of the stack while its top edge remains visible as a thin sliver.
 */

const STEPS = processWorkflow;
const CARD_COUNT = STEPS.length;

// Each card gets its own equal slice of the scroll, so all eight stages are
// traversed in order and the last card still ends up fully visible.
const STAGE = 1 / CARD_COUNT;

// Depth ramp: a card recedes by one more step for every card stacked on it.
const SCALE_STEP = 0.075;
const MIN_SCALE = 0.5;

// Vertical stagger, so the stack has visible depth. Negative offsets fan the
// receding cards upward; DEPTH_STEP * (CARD_COUNT - 1) must match --stack-fan.
const DEPTH_STEP = 6;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function useStackProgress(
  containerRef: RefObject<HTMLDivElement | null>,
  viewportRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    const cards = viewport ? Array.from(viewport.children) : [];
    // Transform the panel, not the card: the card carries the sticky offset in
    // its padding, so scaling the card would scale that offset too and ride the
    // panel up under the navbar.
    const panels = cards.map(
      (card) => card.firstElementChild as HTMLElement | null,
    );
    if (!container || !viewport || panels.length === 0) return;

    let frame = 0;

    const apply = () => {
      frame = 0;

      const rect = container.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? clamp(-rect.top / distance) : 0;

      for (let i = 0; i < cards.length; i += 1) {
        // How far this card has grown in as it approaches the front, and how
        // far it has receded once the next card has taken over.
        const enter = i === 0 ? 1 : clamp((progress - (i - 1) * STAGE) / STAGE);
        const exit = clamp((progress - (i + 1) * STAGE) / STAGE);

        const targetScale = Math.max(
          MIN_SCALE,
          1 - (CARD_COUNT - 1 - i) * SCALE_STEP,
        );
        // Not yet reached -> hidden; primary -> full size; passed -> receded.
        const scale = exit > 0 ? 1 + (targetScale - 1) * exit : enter;

        // Cards scale from their top edge, so a receding card holds its top
        // position instead of sinking. Offsetting it upward keeps its top edge
        // exposed as a thin sliver above the card now in front of it.
        const offset = -(CARD_COUNT - 1 - i) * DEPTH_STEP;
        const panel = panels[i];
        if (!panel) continue;

        panel.style.transform =
          `translate3d(0, ${offset}px, 0) scale(${scale.toFixed(4)})`;
      }
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [containerRef, viewportRef]);
}

function ProcessJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const protectedImage = useProtectedImage();

  useStackProgress(containerRef, viewportRef);

  const { eyebrow, heading, headingAccent, description, altText } =
    processJourneyStack;

  return (
    <section className="process-stack" aria-labelledby="process-stack-title" {...protectedImage}>
      <header className="process-stack__header" data-process-reveal>
        <p className="eyebrow process-stack__eyebrow">
          {eyebrow}
        </p>
        <h2 id="process-stack-title">
          {heading} <span>{headingAccent}</span>
        </h2>
        <p className="process-stack__description">{description}</p>
      </header>

      <div className="process-stack__container" ref={containerRef}>
        <div className="process-stack__viewport" ref={viewportRef}>
          {STEPS.map((step, i) => (
            <div
              className="process-stack__card"
              key={step.number}
              style={{ "--i": i } as CSSProperties}
            >
              <figure className="process-stack__panel">
                <img
                  className="process-stack__image"
                  src={step.image}
                  alt={altText[step.number]}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessJourney;