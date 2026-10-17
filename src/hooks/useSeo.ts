import { useEffect } from "react";
import { buildMetaTags, ROUTES, seoConfigs, type SeoMeta } from "../data/seo";
import { buildPageGraph } from "../data/schema";

const JSONLD_SCRIPT_ID = "seo-jsonld";

function getOrCreate(id: string, tag: string, attrs: Record<string, string>): HTMLElement {
  let el = document.getElementById(id) as HTMLElement | null;
  if (!el) {
    el = document.createElement(tag);
    el.id = id;
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/** Write a JSON-LD graph into the single shared `seo-jsonld` script tag. */
export function setJsonLd(graph: unknown): void {
  let el = document.getElementById(JSONLD_SCRIPT_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = JSONLD_SCRIPT_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(graph);
}

export function useSeo(meta: SeoMeta): void {
  useEffect(() => {
    const prev = document.title;
    document.title = meta.title;

    for (const item of buildMetaTags(meta)) {
      getOrCreate(item.id, item.tag, item.attrs);
    }

    // Remove a stale robots directive when the current view is indexable.
    if (!meta.robots) {
      document.getElementById("seo-robots")?.remove();
    }

    const route = ROUTES.find((r) => seoConfigs[r.key].canonical === meta.canonical)?.key;
    if (route) {
      setJsonLd(buildPageGraph(route));
    }

    return () => {
      document.title = prev;
    };
  }, [meta]);
}
