/*
 * The Trustpilot Review Collector bootstrap (loaded once from index.html)
 * exposes a single global. Only the two members used here are described:
 * `loadFromElement` renders one widget into an existing
 * `.trustpilot-widget` element and is safe to call repeatedly — it ignores a
 * container that already holds a Trustpilot iframe.
 */
interface TrustpilotApi {
  loadFromElement(element: Element): void;
}

interface Window {
  Trustpilot?: TrustpilotApi;
}