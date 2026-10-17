import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  queryCategoryBySlug,
  queryPublishedPostBySlug,
  queryPublishedPosts,
  queryTagBySlug,
  queryTagsByPostId,
  type BlogClient,
} from "../src/lib/blogData";
import {
  buildArchiveSeo,
  buildArticleSeo,
  buildNotFoundSeo,
  renderArchiveDocumentContent,
  renderArticleDocumentContent,
  renderHeadHtml,
  renderNotFoundDocumentContent,
  type ArchiveKind,
} from "../src/lib/blogSsr";
import type { BlogPostPreview } from "../src/types/blog";

const PREVIEW_LIMIT = 30;

type RouteType = "post" | "category" | "tag";

function firstString(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

function resolveRoute(req: VercelRequest): { type: RouteType; slug: string } | null {
  const rawType = firstString(req.query.type);
  const fromQuery: RouteType | null =
    rawType === "post" || rawType === "category" || rawType === "tag" ? rawType : null;
  const querySlug = firstString(req.query.slug).trim();
  if (fromQuery && querySlug) return { type: fromQuery, slug: safeDecode(querySlug) };

  // Fallback: derive the route from the request path.
  const path = safeDecode((req.url || "").split("?")[0]).replace(/\/+$/, "");
  const archive = /^\/blog\/(category|tag)\/(.+)$/.exec(path);
  if (archive) {
    return { type: archive[1] as RouteType, slug: archive[2] };
  }
  const post = /^\/blog\/(.+)$/.exec(path);
  if (post) return { type: "post", slug: post[1] };
  return null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function createServerClient(): SupabaseClient | null {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function storagePublicUrl(path: string | null, bucket: string): string | null {
  const base = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!base || !path) return null;
  const clean = path.trim();
  if (!clean) return null;
  const encoded = clean.split("/").map(encodeURIComponent).join("/");
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${encoded}`;
}

// ---------------------------------------------------------------------------
// HTML shell loading
// ---------------------------------------------------------------------------

let shellCache: string | null = null;

function requestOrigin(req: VercelRequest): string {
  const proto =
    firstString(req.headers["x-forwarded-proto"]) || (process.env.VERCEL ? "https" : "http");
  const host = firstString(req.headers.host) || process.env.VERCEL_URL || "localhost";
  return `${proto}://${host}`;
}

async function loadShell(req: VercelRequest): Promise<string> {
  if (shellCache) return shellCache;

  const candidates = [
    join(process.cwd(), "dist", "index.html"),
    join(process.cwd(), "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const html = readFileSync(candidate, "utf8");
      if (html.includes("</head>")) {
        shellCache = html;
        return html;
      }
    } catch {
      // try next source
    }
  }

  try {
    const res = await fetch(`${requestOrigin(req)}/index.html`);
    if (res.ok) {
      const html = await res.text();
      if (html.includes("</head>")) {
        shellCache = html;
        return html;
      }
    }
  } catch {
    // fall through to minimal shell
  }

  shellCache = MINIMAL_SHELL;
  return shellCache;
}

const MINIMAL_SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nagriva</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

function inject(shell: string, headHtml: string, bodyHtml: string): string {
  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(/[ \t]*<(?:meta|link)\b[^>]*\bid="seo-[^"]*"[^>]*>\s*/gi, "");
  html = html.replace(/[ \t]*<script\b[^>]*\bid="seo-jsonld"[^>]*>[\s\S]*?<\/script>\s*/gi, "");
  html = html.replace("</head>", `${headHtml}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  return html;
}

function sendHtml(res: VercelResponse, status: number, html: string, cache: boolean): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    cache
      ? "public, s-maxage=300, stale-while-revalidate=86400"
      : "no-store, max-age=0",
  );
  res.end(html);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = resolveRoute(req);
  if (!route) {
    return res.status(400).json({ error: "Invalid blog route." });
  }

  const client = createServerClient();
  if (!client) {
    return res.status(503).json({ error: "Blog is temporarily unavailable." });
  }

  const blog: BlogClient = client;

  try {
    const shell = await loadShell(req);

    if (route.type === "post") {
      const post = await queryPublishedPostBySlug(blog, route.slug);
      if (!post) {
        const html = inject(
          shell,
          renderHeadHtml(buildNotFoundSeo("post")),
          renderNotFoundDocumentContent("post"),
        );
        return sendHtml(res, 404, html, false);
      }
      const tags = await queryTagsByPostId(blog, post.id);
      const coverUrl = storagePublicUrl(post.cover_image_path, "blog-covers");
      const { meta, jsonLd } = buildArticleSeo(post, tags, coverUrl);
      const html = inject(shell, renderHeadHtml(meta, jsonLd), renderArticleDocumentContent(post, coverUrl));
      return sendHtml(res, 200, html, true);
    }

    // category | tag
    const kind = route.type as ArchiveKind;
    const entity =
      kind === "category"
        ? await queryCategoryBySlug(blog, route.slug)
        : await queryTagBySlug(blog, route.slug);

    if (!entity) {
      const html = inject(
        shell,
        renderHeadHtml(buildNotFoundSeo(kind)),
        renderNotFoundDocumentContent(kind),
      );
      return sendHtml(res, 404, html, false);
    }

    const { posts } = await queryPublishedPosts(blog, {
      categoryId: kind === "category" ? entity.id : null,
      tagId: kind === "tag" ? entity.id : null,
      limit: PREVIEW_LIMIT,
      offset: 0,
    });
    const { meta, jsonLd } = buildArchiveSeo(kind, entity, posts as BlogPostPreview[]);
    const html = inject(shell, renderHeadHtml(meta, jsonLd), renderArchiveDocumentContent(kind, entity, posts as BlogPostPreview[]));
    return sendHtml(res, 200, html, true);
  } catch (error) {
    console.error("Blog render failed:", error);
    return res.status(500).json({ error: "We couldn't build this page right now." });
  }
}
