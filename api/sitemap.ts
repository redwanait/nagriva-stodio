import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  queryCategoriesWithPublishedPosts,
  queryPublishedPostSlugs,
  queryTagsWithPublishedPosts,
  type BlogClient,
} from "../src/lib/blogData";
import { ROUTES } from "../src/data/seo";
import type { BlogCategory, BlogTag } from "../src/types/blog";

const SITE_URL = "https://nagriva.ma";

function createServerClient(): SupabaseClient | null {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

interface UrlEntry {
  loc: string;
  lastmod?: string | null;
}

function staticEntries(): UrlEntry[] {
  return ROUTES.map((route) => ({ loc: `${SITE_URL}${route.path === "/" ? "/" : route.path}` }));
}

function xmlDocument(entries: UrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = toLastmod(entry.lastmod ?? null);
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = createServerClient();
  let entries = staticEntries();

  if (client) {
    const blog: BlogClient = client;
    try {
      const [posts, categories, tags] = await Promise.all([
        queryPublishedPostSlugs(blog),
        queryCategoriesWithPublishedPosts(blog),
        queryTagsWithPublishedPosts(blog),
      ]);

      entries = entries.concat(
        posts.map((post) => ({
          loc: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
          lastmod: post.updated_at,
        })),
        (categories as BlogCategory[]).map((category) => ({
          loc: `${SITE_URL}/blog/category/${encodeURIComponent(category.slug)}`,
        })),
        (tags as BlogTag[]).map((tag) => ({
          loc: `${SITE_URL}/blog/tag/${encodeURIComponent(tag.slug)}`,
        })),
      );
    } catch (error) {
      console.error("Sitemap generation failed:", error);
      entries = staticEntries();
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(xmlDocument(entries));
}
