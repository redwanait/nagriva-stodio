const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

function loadGtagScript(): void {
  if (!GA_MEASUREMENT_ID) return;

  if (document.querySelector('script[data-gtag-loader]')) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtagLoader = "true";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
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

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: locationHref,
    page_title: title,
  });
}
