const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let gtagLoaded = false;
let pendingView: Record<string, string> | null = null;

function sendView(params: Record<string, string>): void {
  window.gtag?.("event", "page_view", params);
}

function flushPendingView(): void {
  if (!pendingView) return;
  const params = pendingView;
  pendingView = null;
  sendView(params);
}

function loadGtagScript(): void {
  if (!GA_MEASUREMENT_ID) return;

  if (document.querySelector('script[data-gtag-loader]')) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtagLoader = "true";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    gtagLoaded = true;
    flushPendingView();
  };
  script.onerror = () => {};
  document.head.appendChild(script);
}

export function initGA(): void {
  if (!GA_MEASUREMENT_ID || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  const dataLayer = window.dataLayer;

  window.gtag = function (...args: unknown[]) {
    dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  loadGtagScript();
}

export function sendPageView(path: string, title: string, locationHref: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  const params = {
    page_path: path,
    page_location: locationHref,
    page_title: title,
  };

  if (gtagLoaded) {
    sendView(params);
  } else {
    pendingView = params;
  }
}
