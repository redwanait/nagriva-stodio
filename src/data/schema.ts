import { ROUTES, SITE_URL, type RouteKey } from "./seo.ts";

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue = JsonLdPrimitive | JsonLdObject | JsonLdValue[];
export interface JsonLdObject {
  "@type"?: string | string[];
  "@id"?: string;
  [key: string]: JsonLdValue | undefined;
}
export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdObject[];
}

export const NAGRIVA_NAME = "Nagriva";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;
export const LOCATION_ID = `${SITE_URL}/#location`;

export const NAGRIVA_ORGANIZATION: JsonLdObject = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: NAGRIVA_NAME,
  url: `${SITE_URL}/`,
  description:
    "Nagriva is a digital studio based in Morocco that designs and builds professional websites, e-commerce experiences, landing pages, and digital brand experiences for businesses that want to look credible and perform better online.",
  slogan: "Digital Studio made human",
  telephone: "+212 728427278",
  email: "contact@nagriva.ma",
  location: { "@id": LOCATION_ID },
  founder: { "@id": FOUNDER_ID },
  sameAs: ["https://www.instagram.com/nagriva.co/", "https://www.facebook.com/profile.php?id=61575750526639"],
};

export const NAGRIVA_FOUNDER: JsonLdObject = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Redouane Ait El Hadj",
  jobTitle: "Founder",
  worksFor: { "@id": ORGANIZATION_ID },
  sameAs: [
    "https://www.linkedin.com/in/redouane-ait-el-hadj-167910315/",
    "https://github.com/redwanait",
  ],
};

export const NAGRIVA_WEBSITE: JsonLdObject = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: NAGRIVA_NAME,
  publisher: { "@id": ORGANIZATION_ID },
};

export const NAGRIVA_LOCATION: JsonLdObject = {
  "@type": "Place",
  "@id": LOCATION_ID,
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.9409,
    longitude: -6.7111,
  },
};

export const NAGRIVA_SERVICES: JsonLdObject[] = [
  {
    "@type": "Service",
    name: "Website Design & Development",
    provider: { "@id": ORGANIZATION_ID },
  },
  {
    "@type": "Service",
    name: "E-commerce",
    provider: { "@id": ORGANIZATION_ID },
  },
  {
    "@type": "Service",
    name: "Landing Pages",
    provider: { "@id": ORGANIZATION_ID },
  },
  {
    "@type": "Service",
    name: "Brand & Digital Experience",
    provider: { "@id": ORGANIZATION_ID },
  },
];

const PAGE_TYPES: Record<RouteKey, string> = {
  home: "WebPage",
  services: "CollectionPage",
  portfolio: "CollectionPage",
  about: "AboutPage",
  process: "WebPage",
  start: "ContactPage",
  "privacy-policy": "WebPage",
  "terms-of-service": "WebPage",
};

const ABOUT_PAGE_ROUTES: ReadonlySet<RouteKey> = new Set([
  "home",
  "services",
  "portfolio",
  "about",
  "process",
  "start",
]);

const SERVICES_PAGE_ROUTES: ReadonlySet<RouteKey> = new Set(["services"]);

export function buildWebPage(route: RouteKey): JsonLdObject {
  const info = ROUTES.find((r) => r.key === route);
  const url = `${SITE_URL}${info?.path ?? "/"}`;
  const page: JsonLdObject = {
    "@type": PAGE_TYPES[route],
    "@id": `${url}#webpage`,
    url,
    isPartOf: { "@id": WEBSITE_ID },
  };
  if (ABOUT_PAGE_ROUTES.has(route)) {
    page.about = { "@id": ORGANIZATION_ID };
  }
  return page;
}

export function buildPageGraph(route: RouteKey): JsonLdGraph {
  const graph: JsonLdObject[] = [
    NAGRIVA_ORGANIZATION,
    NAGRIVA_FOUNDER,
    NAGRIVA_WEBSITE,
    NAGRIVA_LOCATION,
    buildWebPage(route),
  ];
  if (SERVICES_PAGE_ROUTES.has(route)) {
    graph.push(...NAGRIVA_SERVICES);
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeGraph(graph: JsonLdGraph): string {
  return JSON.stringify(graph);
}