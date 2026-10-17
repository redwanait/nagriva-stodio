import {
  SITE_NAME,
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_ALT,
  buildMetaTags,
  type SeoMeta,
} from "../data/seo";
import { NAGRIVA_ORGANIZATION, NAGRIVA_WEBSITE, ORGANIZATION_ID, WEBSITE_ID } from "../data/schema";
import type { BlogPostDetail, BlogPostPreview, BlogTag } from "../types/blog";

/**
 * Pure SEO + server-rendering helpers shared by the Vercel blog renderer
 * (`api/blog.ts`) and the client pages. Everything here is string/DOM-free so
 * it runs in both environments and keeps server-rendered metadata identical to
 * the metadata React writes after hydration.
 */

export interface JsonLdNode {
  "@type"?: string | string[];
  "@id"?: string;
  [key: string]: unknown;
}

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

export interface SeoBundle {
  meta: SeoMeta;
  jsonLd: JsonLdGraph;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(input: string): string {
  return escapeHtml(input);
}

/** Serialize JSON-LD for safe embedding inside a <script> element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`;
}
export function blogPostUrl(slug: string): string {
  return `${SITE_URL}${blogPostPath(slug)}`;
}
export function blogCategoryUrl(slug: string): string {
  return `${SITE_URL}/blog/category/${slug}`;
}
export function blogTagUrl(slug: string): string {
  return `${SITE_URL}/blog/tag/${slug}`;
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}\u2026`;
}

function authorNode(author: BlogPostDetail["author"]): JsonLdNode {
  if (author) {
    return { "@type": "Person", name: author.name };
  }
  return { "@type": "Organization", name: SITE_NAME };
}

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

export function buildArticleSeo(
  post: BlogPostDetail,
  tags: BlogTag[],
  coverUrl: string | null,
): SeoBundle {
  const url = blogPostUrl(post.slug);
  const title = post.seo_title ?? post.title;
  const description = truncate(post.seo_description ?? post.excerpt ?? post.title, 300);
  const image = coverUrl ?? OG_IMAGE;
  const pageTitle = /\bNagriva\b/.test(title) ? title : `${title} \u2014 ${SITE_NAME}`;

  const meta: SeoMeta = {
    title: pageTitle,
    description,
    canonical: url,
    og: {
      title,
      description,
      url,
      type: "article",
      image,
      imageAlt: post.cover_image_alt?.trim() || undefined,
    },
    twitter: {
      title,
      description,
      card: coverUrl ? "summary_large_image" : "summary",
      image,
      imageAlt: post.cover_image_alt?.trim() || undefined,
    },
  };

  const breadcrumb: JsonLdNode[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ];
  if (post.category) {
    breadcrumb.push({
      "@type": "ListItem",
      position: 3,
      name: post.category.name,
      item: blogCategoryUrl(post.category.slug),
    });
  }
  breadcrumb.push({ "@type": "ListItem", position: breadcrumb.length + 1, name: post.title, item: url });

  const article: JsonLdNode = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    author: authorNode(post.author),
    publisher: { "@id": ORGANIZATION_ID },
  };
  if (coverUrl) article.image = coverUrl;
  if (tags.length > 0) article.keywords = tags.map((t) => t.name).join(", ");

  const jsonLd: JsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      NAGRIVA_ORGANIZATION as JsonLdNode,
      NAGRIVA_WEBSITE as JsonLdNode,
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": `${url}#article` },
      },
      article,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumb,
      },
    ],
  };

  return { meta, jsonLd };
}

// ---------------------------------------------------------------------------
// Archive (category / tag)
// ---------------------------------------------------------------------------

export type ArchiveKind = "category" | "tag";

export function buildArchiveSeo(
  kind: ArchiveKind,
  entity: { name: string; slug: string; description: string | null },
  posts: BlogPostPreview[],
): SeoBundle {
  const isCategory = kind === "category";
  const url = isCategory ? blogCategoryUrl(entity.slug) : blogTagUrl(entity.slug);
  const title = isCategory
    ? `${entity.name} \u2014 ${SITE_NAME} Blog`
    : `#${entity.name} \u2014 ${SITE_NAME} Blog`;
  const description = truncate(
    entity.description ??
      (isCategory
        ? `Articles about ${entity.name} from the ${SITE_NAME} blog.`
        : `Articles tagged with ${entity.name}.`),
    300,
  );
  const empty = posts.length === 0;

  const meta: SeoMeta = {
    title,
    description,
    canonical: url,
    robots: empty ? "noindex, follow" : undefined,
    og: { title, description, url },
    twitter: { title, description, card: "summary" },
  };

  const graph: JsonLdNode[] = [
    NAGRIVA_ORGANIZATION as JsonLdNode,
    NAGRIVA_WEBSITE as JsonLdNode,
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      isPartOf: { "@id": WEBSITE_ID },
      name: title,
      description,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: entity.name, item: url },
      ],
    },
  ];

  if (!empty) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#itemlist`,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: blogPostUrl(post.slug),
        name: post.title,
      })),
    });
  }

  return { meta, jsonLd: { "@context": "https://schema.org", "@graph": graph } };
}

// ---------------------------------------------------------------------------
// Not found (HTTP 404)
// ---------------------------------------------------------------------------

export function buildNotFoundSeo(kind: ArchiveKind | "post"): SeoMeta {
  const label = kind === "post" ? "Article" : kind === "category" ? "Category" : "Tag";
  const title = `${label} not found \u2014 ${SITE_NAME}`;
  const description = "This page may have been removed or the link is incorrect.";
  return {
    title,
    description,
    canonical: `${SITE_URL}/blog`,
    robots: "noindex, follow",
    og: { title, description, url: `${SITE_URL}/blog` },
    twitter: { title, description, card: "summary" },
  };
}

// ---------------------------------------------------------------------------
// Server-rendered body (safe: escaped text inside fixed tags only)
// ---------------------------------------------------------------------------

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

/**
 * Convert a stored article body into a clean heading/paragraph/list outline.
 * Every piece of text is HTML-escaped and only fixed block tags are emitted,
 * so the result is safe by construction (no dependency on a DOM parser in the
 * serverless runtime).
 */
export function renderContentOutline(html: string): string {
  const out: string[] = [];
  let listBuffer: string[] = [];
  const flush = () => {
    if (listBuffer.length > 0) {
      out.push(`<ul>${listBuffer.join("")}</ul>`);
      listBuffer = [];
    }
  };

  const blockRe = /<(h2|h3|h4|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const text = escapeHtml(stripTags(match[2]).replace(/\s+/g, " ").trim());
    if (!text) continue;
    if (tag === "li") {
      listBuffer.push(`<li>${text}</li>`);
      continue;
    }
    flush();
    out.push(`<${tag}>${text}</${tag}>`);
  }
  flush();
  return out.join("\n");
}

function breadcrumbHtml(parts: { name: string; url?: string }[]): string {
  const items = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    ...parts,
  ];
  const li = items
    .map((item) =>
      item.url
        ? `<li><a href="${escapeAttr(item.url)}">${escapeHtml(item.name)}</a></li>`
        : `<li aria-current="page">${escapeHtml(item.name)}</li>`,
    )
    .join("");
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol class="breadcrumb__list">${li}</ol></nav>`;
}

export function renderArticleDocumentContent(
  post: BlogPostDetail,
  coverUrl: string | null,
): string {
  const category = post.category;
  const parts: { name: string; url?: string }[] = [];
  if (category) parts.push({ name: category.name, url: blogCategoryUrl(category.slug) });
  parts.push({ name: post.title });

  const author = post.author?.name ?? SITE_NAME;
  const outline = renderContentOutline(post.content);
  const excerpt = post.excerpt
    ? `<p class="blog-post__excerpt">${escapeHtml(post.excerpt)}</p>`
    : "";
  const media = coverUrl
    ? `<div class="blog-post__media"><img class="blog-post__image" src="${escapeAttr(coverUrl)}" alt="${escapeAttr((post.cover_image_alt ?? "").trim())}" width="1200" height="675" loading="eager" fetchpriority="high" /></div>`
    : "";

  return [
    breadcrumbHtml(parts),
    `<article class="blog-post">`,
    `<header class="blog-post__header">`,
    category
      ? `<a class="blog-meta__category" href="${escapeAttr(blogCategoryUrl(category.slug))}">${escapeHtml(category.name)}</a>`
      : "",
    `<h1 class="blog-post__title">${escapeHtml(post.title)}</h1>`,
    excerpt,
    `<div class="blog-post__meta"><span class="blog-author__name">${escapeHtml(author)}</span></div>`,
    `</header>`,
    media,
    `<div class="blog-post__content">${outline}</div>`,
    `</article>`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function renderArchiveDocumentContent(
  kind: ArchiveKind,
  entity: { name: string; description: string | null },
  posts: BlogPostPreview[],
): string {
  const isCategory = kind === "category";
  const heading = isCategory ? entity.name : `Tagged: ${entity.name}`;
  const description = entity.description
    ? `<p class="blog-listing__description">${escapeHtml(entity.description)}</p>`
    : "";
  const list =
    posts.length > 0
      ? `<ul class="blog-grid">${posts
          .map(
            (post) =>
              `<li><a href="${escapeAttr(blogPostPath(post.slug))}">${escapeHtml(post.title)}</a>${
                post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""
              }</li>`,
          )
          .join("")}</ul>`
      : `<p class="blog-empty__title">No articles yet.</p>`;

  return [
    breadcrumbHtml([{ name: isCategory ? "Categories" : "Tags", url: `${SITE_URL}/blog` }, { name: entity.name }]),
    `<div class="blog-listing__header"><h1 class="blog-listing__title">${escapeHtml(heading)}</h1>${description}</div>`,
    list,
  ].join("\n");
}

export function renderNotFoundDocumentContent(kind: ArchiveKind | "post"): string {
  const label = kind === "post" ? "Article" : kind === "category" ? "Category" : "Tag";
  return [
    breadcrumbHtml([{ name: `${label} not found` }]),
    `<section class="blog-state"><div class="blog-state__panel">`,
    `<p class="blog-state__title">${label} not found.</p>`,
    `<p class="blog-state__message">This ${label.toLowerCase()} may have been removed or the link is incorrect.</p>`,
    `<a class="blog-state__button" href="/blog">Back to blog</a>`,
    `</div></section>`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Head serialization
// ---------------------------------------------------------------------------

function renderHeadTag(item: { tag: string; attrs: Record<string, string>; id: string }): string {
  const attrs = Object.entries(item.attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(" ");
  const tagName = item.tag === "link" ? "link" : "meta";
  return `<${tagName} id="${escapeAttr(item.id)}" ${attrs}>`;
}

export function renderHeadHtml(meta: SeoMeta, jsonLd?: JsonLdGraph): string {
  const tags = buildMetaTags(meta).map(renderHeadTag).join("\n");
  const parts = [`<title>${escapeHtml(meta.title)}</title>`, tags];
  if (jsonLd) {
    parts.push(
      `<script type="application/ld+json" id="seo-jsonld">${serializeJsonLd(jsonLd)}</script>`,
    );
  }
  return parts.join("\n");
}

export { OG_IMAGE, OG_IMAGE_ALT };
