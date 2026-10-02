import { useEffect, useRef } from "react";

/*
 * Trustpilot Review Collector.
 *
 * The markup below is the snippet Trustpilot generates for this business unit,
 * reproduced verbatim — the stars, score, review count and logo are rendered by
 * Trustpilot inside its own iframe, never by us.
 *
 * The bootstrap script is loaded once from `index.html`, so this component only
 * has to hand the element over:
 *
 *   - Trustpilot's own MutationObserver already picks up `.trustpilot-widget`
 *     elements that React adds after page load (an SPA route change), so the
 *     common case needs nothing from us.
 *   - `window.Trustpilot.loadFromElement` covers the cases where that observer
 *     has not started yet, e.g. the script is still downloading when the About
 *     page mounts. It is idempotent by design: it refuses a container that
 *     already has a Trustpilot iframe or is already registered, so React Strict
 *     Mode's double mount, or any later re-render, cannot create a duplicate.
 *
 * Children are injected with `dangerouslySetInnerHTML` on purpose: Trustpilot
 * replaces the container's children with its iframe, and a React-managed child
 * tree would then try to reconcile over markup it no longer owns. This way React
 * writes the container once and never touches its contents again.
 */

const FALLBACK_LINK =
  '<a href="https://www.trustpilot.com/review/nagriva.ma" target="_blank" rel="noopener">Trustpilot</a>';

function TrustpilotReviewCollector() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = widgetRef.current;

    // No-op until the bootstrap script has parsed; Trustpilot then renders the
    // widget itself via its DOM observer.
    if (element && window.Trustpilot) window.Trustpilot.loadFromElement(element);
  }, []);

  return (
    <div className="about-hero__trust">
      <div
        className="trustpilot-widget about-hero__trust-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="6abfb06548306353296cbeba"
        data-style-height="52px"
        data-style-width="100%"
        data-token="0312fceC-927-4955-b32b-658e969cb2f7"
        ref={widgetRef}
        dangerouslySetInnerHTML={{ __html: FALLBACK_LINK }}
      />
    </div>
  );
}

export default TrustpilotReviewCollector;