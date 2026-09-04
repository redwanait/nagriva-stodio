import { useEffect } from "react";

export const SITE_NAME = "Nagriva";
export const SITE_URL = "https://nagriva.ma";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_ALT = "Nagriva";

export interface OgMeta {
  title: string;
  description: string;
  url: string;
  type?: string;
  site_name?: string;
  image?: string;
  imageAlt?: string;
}

export interface TwitterMeta {
  title: string;
  description: string;
  card: "summary_large_image" | "summary";
  image?: string;
  imageAlt?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  og: OgMeta;
  twitter: TwitterMeta;
}

interface HeadMeta {
  id: string;
  tag: "meta" | "link";
  attrs: Record<string, string>;
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

function buildHeadMeta(meta: SeoMeta): HeadMeta[] {
  const og = meta.og;
  const twitter = meta.twitter;
  const list: HeadMeta[] = [
    { id: "seo-description", tag: "meta", attrs: { name: "description", content: meta.description } },
    { id: "seo-canonical", tag: "link", attrs: { rel: "canonical", href: meta.canonical } },
    { id: "seo-og-type", tag: "meta", attrs: { property: "og:type", content: og.type ?? "website" } },
    { id: "seo-og-site-name", tag: "meta", attrs: { property: "og:site_name", content: og.site_name ?? SITE_NAME } },
    { id: "seo-og-title", tag: "meta", attrs: { property: "og:title", content: og.title } },
    { id: "seo-og-description", tag: "meta", attrs: { property: "og:description", content: og.description } },
    { id: "seo-og-url", tag: "meta", attrs: { property: "og:url", content: og.url } },
    { id: "seo-twitter-card", tag: "meta", attrs: { name: "twitter:card", content: twitter.card } },
    { id: "seo-twitter-title", tag: "meta", attrs: { name: "twitter:title", content: twitter.title } },
    { id: "seo-twitter-description", tag: "meta", attrs: { name: "twitter:description", content: twitter.description } },
  ];

  const ogImage = og.image ?? OG_IMAGE;
  const ogImageAlt = og.imageAlt ?? OG_IMAGE_ALT;
  const twitterImage = twitter.image ?? ogImage;
  const twitterImageAlt = twitter.imageAlt ?? ogImageAlt;

  list.push(
    { id: "seo-og-image", tag: "meta", attrs: { property: "og:image", content: ogImage } },
    { id: "seo-og-image-alt", tag: "meta", attrs: { property: "og:image:alt", content: ogImageAlt } },
    { id: "seo-twitter-image", tag: "meta", attrs: { name: "twitter:image", content: twitterImage } },
    { id: "seo-twitter-image-alt", tag: "meta", attrs: { name: "twitter:image:alt", content: twitterImageAlt } },
  );

  return list;
}

export function useSeo(meta: SeoMeta): void {
  useEffect(() => {
    const prev = document.title;
    document.title = meta.title;

    const toApply = buildHeadMeta(meta);

    for (const item of toApply) {
      getOrCreate(item.id, item.tag, item.attrs);
    }

    return () => {
      document.title = prev;
    };
  }, [meta]);
}
