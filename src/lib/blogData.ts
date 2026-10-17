import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostPreview,
  BlogTag,
} from "../types/blog";

/**
 * Client-agnostic Blog queries.
 *
 * Every function takes a Supabase client so the exact same query logic can run
 * in the browser (`src/lib/supabase.ts`) and inside the serverless renderer
 * (`api/blog.ts`) without duplicating filters. Public reads are always limited
 * to `status = 'published'`; Row Level Security enforces the same rule.
 */

export type BlogClient = SupabaseClient;

export const POST_PREVIEW_SELECT = `
  id,
  title,
  slug,
  excerpt,
  cover_image_path,
  cover_image_alt,
  published_at,
  author:blog_authors (id, name, slug, avatar_path, avatar_alt),
  category:blog_categories (id, name, slug)
`;

/**
 * PostgREST `or` filter values are comma/parenthesis delimited, so user input
 * is stripped of the characters that would break the filter grammar. `%`/`_`
 * are kept as `ilike` wildcards, which is acceptable for a search box.
 */
function normalizeSearchTerm(term: string): string {
  return term.replace(/[,()\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

export interface PublishedPostsQuery {
  categoryId?: string | null;
  tagId?: string | null;
  search?: string | null;
  limit: number;
  offset: number;
  /**
   * When false, the exact total is not requested (used by "load more", which
   * already knows the total). Defaults to true.
   */
  withCount?: boolean;
}

export interface PagedPosts {
  posts: BlogPostPreview[];
  /** null when `withCount` is false or the server returned no count. */
  total: number | null;
}

/**
 * Unified listing query used by the blog index, category pages and tag pages.
 *
 * The exact count is requested in the same response as the rows
 * (`select(..., { count: "exact" })`), so a page load costs a single round-trip
 * instead of a sequential count request followed by the data request. Callers
 * that already know the total (pagination / "load more") pass `withCount:false`
 * to skip the count entirely. Tag filtering embeds `blog_post_tags!inner` so
 * PostgREST filters the parent rows instead of raising PGRST108 (embedded
 * resource not in select).
 */
export async function queryPublishedPosts(
  client: BlogClient,
  { categoryId, tagId, search, limit, offset, withCount = true }: PublishedPostsQuery,
): Promise<PagedPosts> {
  const term = search ? normalizeSearchTerm(search) : "";
  const select = tagId
    ? `${POST_PREVIEW_SELECT}, blog_post_tags!inner(tag_id)`
    : POST_PREVIEW_SELECT;

  let dataQuery = client
    .from("blog_posts")
    .select(select, withCount ? { count: "exact" } : {})
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (categoryId) dataQuery = dataQuery.eq("category_id", categoryId);
  if (tagId) dataQuery = dataQuery.eq("blog_post_tags.tag_id", tagId);
  if (term) dataQuery = dataQuery.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);

  const { data, count, error } = await dataQuery.range(offset, offset + limit - 1);
  if (error) throw error;

  return {
    posts: (data ?? []) as unknown as BlogPostPreview[],
    total: withCount ? count ?? 0 : null,
  };
}

export async function queryPublishedPostBySlug(
  client: BlogClient,
  slug: string,
): Promise<BlogPostDetail | null> {
  const { data, error } = await client
    .from("blog_posts")
    .select(`${POST_PREVIEW_SELECT}, content, updated_at, seo_title, seo_description`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as BlogPostDetail | null;
}

export async function queryTagsByPostId(
  client: BlogClient,
  postId: string,
): Promise<BlogTag[]> {
  const { data, error } = await client
    .from("blog_post_tags")
    .select("tag:blog_tags(id, name, slug)")
    .eq("post_id", postId);

  if (error) throw error;
  return ((data ?? []) as unknown as { tag: BlogTag }[])
    .map((row) => row.tag)
    .filter((tag): tag is BlogTag => Boolean(tag));
}

export async function queryTagBySlug(
  client: BlogClient,
  slug: string,
): Promise<BlogTag | null> {
  const { data, error } = await client
    .from("blog_tags")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as BlogTag | null;
}

export async function queryCategoryBySlug(
  client: BlogClient,
  slug: string,
): Promise<BlogCategory | null> {
  const { data, error } = await client
    .from("blog_categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as BlogCategory | null;
}

/**
 * Categories that actually have at least one published post. Empty categories
 * are excluded from navigation, category pages and the sitemap.
 */
export async function queryCategoriesWithPublishedPosts(
  client: BlogClient,
): Promise<BlogCategory[]> {
  const { data, error } = await client
    .from("blog_categories")
    .select("id, name, slug, description, blog_posts!inner(id)")
    .eq("blog_posts.status", "published")
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as unknown as BlogCategory[]).map(
    ({ id, name, slug, description }) => ({ id, name, slug, description }),
  );
}

/** Tags that actually have at least one published post. */
export async function queryTagsWithPublishedPosts(
  client: BlogClient,
): Promise<BlogTag[]> {
  const { data, error } = await client
    .from("blog_tags")
    .select("id, name, slug, description, blog_post_tags!inner(post:blog_posts!inner(status))")
    .eq("blog_post_tags.post.status", "published")
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as unknown as BlogTag[]).map(
    ({ id, name, slug, description }) => ({ id, name, slug, description }),
  );
}

export async function queryRelatedPosts(
  client: BlogClient,
  postId: string,
  categoryId: string | null,
  limit = 3,
): Promise<BlogPostPreview[]> {
  const base = client
    .from("blog_posts")
    .select(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit);

  const query = categoryId ? base.eq("category_id", categoryId) : base;
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as BlogPostPreview[];
}

export async function queryPublishedPostSlugs(
  client: BlogClient,
): Promise<{ slug: string; updated_at: string | null }[]> {
  const { data, error } = await client
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as { slug: string; updated_at: string | null }[];
}
