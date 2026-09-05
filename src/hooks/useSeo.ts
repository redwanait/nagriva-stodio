import { useEffect } from "react";
import { buildMetaTags, ROUTES, seoConfigs, type SeoMeta } from "../data/seo";
import { buildPageGraph, serializeGraph } from "../data/schema";

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

function getOrCreateJsonLdScript(): HTMLScriptElement {
  let el = document.getElementById(JSONLD_SCRIPT_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = JSONLD_SCRIPT_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  return el;
}

export function useSeo(meta: SeoMeta): void {
  useEffect(() => {
    const prev = document.title;
    document.title = meta.title;

    for (const item of buildMetaTags(meta)) {
      getOrCreate(item.id, item.tag, item.attrs);
    }

    const route = ROUTES.find((r) => seoConfigs[r.key].canonical === meta.canonical)?.key;
    if (route) {
      getOrCreateJsonLdScript().textContent = serializeGraph(buildPageGraph(route));
    }

    return () => {
      document.title = prev;
    };
  }, [meta]);
}
