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

export interface HeadMeta {
  id: string;
  tag: "meta" | "link";
  attrs: Record<string, string>;
}

export type RouteKey =
  | "home"
  | "services"
  | "portfolio"
  | "about"
  | "process"
  | "start"
  | "privacy-policy"
  | "terms-of-service";

export interface RouteInfo {
  key: RouteKey;
  path: string;
  dir: string;
}

export const ROUTES: RouteInfo[] = [
  { key: "home", path: "/", dir: "" },
  { key: "services", path: "/services", dir: "services" },
  { key: "portfolio", path: "/portfolio", dir: "portfolio" },
  { key: "about", path: "/about", dir: "about" },
  { key: "process", path: "/process", dir: "process" },
  { key: "start", path: "/start", dir: "start" },
  { key: "privacy-policy", path: "/privacy-policy", dir: "privacy-policy" },
  { key: "terms-of-service", path: "/terms-of-service", dir: "terms-of-service" },
];

export const seoConfigs: Record<RouteKey, SeoMeta> = {
  home: {
    title: "Nagriva \u2014 Website Design & Development Studio",
    description: "Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online. Based in Morocco.",
    canonical: "https://nagriva.ma/",
    og: {
      title: "Nagriva \u2014 Website Design & Development Studio",
      description: "Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online.",
      url: "https://nagriva.ma/",
    },
    twitter: {
      title: "Nagriva \u2014 Website Design & Development Studio",
      description: "Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online.",
      card: "summary_large_image",
    },
  },
  services: {
    title: "Services \u2014 Nagriva",
    description: "Website design, e-commerce, landing pages, and brand digital experience \u2014 focused digital work delivered with clarity and a premium finish.",
    canonical: "https://nagriva.ma/services",
    og: {
      title: "Services \u2014 Nagriva",
      description: "Website design, e-commerce, landing pages, and brand digital experience delivered with clarity and a premium finish.",
      url: "https://nagriva.ma/services",
    },
    twitter: {
      title: "Services \u2014 Nagriva",
      description: "Website design, e-commerce, landing pages, and brand digital experience delivered with clarity and a premium finish.",
      card: "summary_large_image",
    },
  },
  portfolio: {
    title: "Portfolio \u2014 Nagriva",
    description: "A selection of websites, digital experiences, and brand work Nagriva has created for businesses that care about how they show up online.",
    canonical: "https://nagriva.ma/portfolio",
    og: {
      title: "Portfolio \u2014 Nagriva",
      description: "A selection of websites, digital experiences, and brand work created for businesses that care about how they show up online.",
      url: "https://nagriva.ma/portfolio",
    },
    twitter: {
      title: "Portfolio \u2014 Nagriva",
      description: "A selection of websites, digital experiences, and brand work created for businesses that care about how they show up online.",
      card: "summary_large_image",
    },
  },
  about: {
    title: "About \u2014 Nagriva",
    description: "Nagriva is a digital studio based in Morocco. We design and build websites, online stores, and brand identities \u2014 one team, one process.",
    canonical: "https://nagriva.ma/about",
    og: {
      title: "About \u2014 Nagriva",
      description: "Nagriva is a digital studio based in Morocco designing and building websites, online stores, and brand identities.",
      url: "https://nagriva.ma/about",
    },
    twitter: {
      title: "About \u2014 Nagriva",
      description: "Nagriva is a digital studio based in Morocco designing and building websites, online stores, and brand identities.",
      card: "summary_large_image",
    },
  },
  process: {
    title: "Process \u2014 Nagriva",
    description: "From the first conversation to the final launch \u2014 a clear, focused process that takes your project from idea to a finished digital experience.",
    canonical: "https://nagriva.ma/process",
    og: {
      title: "Process \u2014 Nagriva",
      description: "From the first conversation to the final launch \u2014 a clear, focused process that takes your project from idea to a finished digital experience.",
      url: "https://nagriva.ma/process",
    },
    twitter: {
      title: "Process \u2014 Nagriva",
      description: "From the first conversation to the final launch \u2014 a clear, focused process that takes your project from idea to a finished digital experience.",
      card: "summary_large_image",
    },
  },
  start: {
    title: "Start Your Project \u2014 Nagriva",
    description: "Tell us about your project. No complicated brief needed \u2014 just the essentials. Nagriva will review your inquiry and get back to you soon.",
    canonical: "https://nagriva.ma/start",
    og: {
      title: "Start Your Project \u2014 Nagriva",
      description: "Tell us about your project. No complicated brief needed \u2014 just the essentials. Nagriva will review your inquiry and get back to you soon.",
      url: "https://nagriva.ma/start",
    },
    twitter: {
      title: "Start Your Project \u2014 Nagriva",
      description: "Tell us about your project. Nagriva will review your inquiry and get back to you soon.",
      card: "summary_large_image",
    },
  },
  "privacy-policy": {
    title: "Privacy Policy \u2014 Nagriva",
    description: "How Nagriva collects, uses, stores, and protects your information when you visit our website or use our services.",
    canonical: "https://nagriva.ma/privacy-policy",
    og: {
      title: "Privacy Policy \u2014 Nagriva",
      description: "How Nagriva collects, uses, stores, and protects your information.",
      url: "https://nagriva.ma/privacy-policy",
    },
    twitter: {
      title: "Privacy Policy \u2014 Nagriva",
      description: "How Nagriva collects, uses, stores, and protects your information.",
      card: "summary",
    },
  },
  "terms-of-service": {
    title: "Terms of Service \u2014 Nagriva",
    description: "Terms governing the use of the Nagriva website and the services provided by Nagriva.",
    canonical: "https://nagriva.ma/terms-of-service",
    og: {
      title: "Terms of Service \u2014 Nagriva",
      description: "Terms governing the use of the Nagriva website and services.",
      url: "https://nagriva.ma/terms-of-service",
    },
    twitter: {
      title: "Terms of Service \u2014 Nagriva",
      description: "Terms governing the use of the Nagriva website and services.",
      card: "summary",
    },
  },
};

export function buildMetaTags(meta: SeoMeta): HeadMeta[] {
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