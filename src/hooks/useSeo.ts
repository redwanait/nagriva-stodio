import { useEffect } from "react";
import { buildMetaTags, type SeoMeta } from "../data/seo";

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

export function useSeo(meta: SeoMeta): void {
  useEffect(() => {
    const prev = document.title;
    document.title = meta.title;

    for (const item of buildMetaTags(meta)) {
      getOrCreate(item.id, item.tag, item.attrs);
    }

    return () => {
      document.title = prev;
    };
  }, [meta]);
}
