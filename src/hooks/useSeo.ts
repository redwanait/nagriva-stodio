import { useEffect } from "react";

interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  og: { title: string; description: string; url: string };
  twitter: { title: string; description: string; card: "summary_large_image" | "summary" };
}

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

    getOrCreate("seo-description", "meta", { name: "description", content: meta.description });
    getOrCreate("seo-canonical", "link", { rel: "canonical", href: meta.canonical });
    getOrCreate("seo-og-title", "meta", { property: "og:title", content: meta.og.title });
    getOrCreate("seo-og-description", "meta", { property: "og:description", content: meta.og.description });
    getOrCreate("seo-og-url", "meta", { property: "og:url", content: meta.og.url });
    getOrCreate("seo-og-type", "meta", { property: "og:type", content: "website" });
    getOrCreate("seo-og-site-name", "meta", { property: "og:site_name", content: "Nagriva" });
    getOrCreate("seo-twitter-card", "meta", { name: "twitter:card", content: meta.twitter.card });
    getOrCreate("seo-twitter-title", "meta", { name: "twitter:title", content: meta.twitter.title });
    getOrCreate("seo-twitter-description", "meta", { name: "twitter:description", content: meta.twitter.description });

    return () => {
      document.title = prev;
    };
  }, [meta.title, meta.description, meta.canonical, meta.og.title, meta.og.description, meta.og.url, meta.twitter.card, meta.twitter.title, meta.twitter.description]);
}
