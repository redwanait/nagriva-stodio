import { supabase } from "./supabase";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostPreview,
  BlogTag,
} from "../types/blog";

function requireSupabase() {
  if (!supabase) {
    throw new Error("Blog is unavailable right now.");
  }
  return supabase;
}

const BLOG_COVERS_BUCKET = "blog-covers";
const BLOG_AUTHORS_BUCKET = "blog-authors";

/**
 * Build the public Storage URL for a media object in the given bucket.
 * Treats the stored value as a PATH, not a complete URL, and trims any
 * accidental surrounding whitespace/newlines so the key matches the bucket.
 */
function getStoragePublicUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  if (!supabase) return null;
  const cleanPath = path.trim();
  if (!cleanPath) return null;
  return supabase.storage.from(bucket).getPublicUrl(cleanPath).data.publicUrl;
}

/**
 * Build the public URL for a blog cover image.
 */
export function getBlogCoverUrl(path: string | null): string | null {
  return getStoragePublicUrl(BLOG_COVERS_BUCKET, path);
}

/**
 * Build the public URL for an author avatar.
 */
export function getAuthorAvatarUrl(path: string | null): string | null {
  return getStoragePublicUrl(BLOG_AUTHORS_BUCKET, path);
}

const POST_PREVIEW_SELECT = `
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

// ---------------------------------------------------------------------------
// Listing queries
// ---------------------------------------------------------------------------

export async function fetchPublishedPosts(): Promise<BlogPostPreview[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_posts")
    .select<typeof POST_PREVIEW_SELECT, BlogPostPreview>(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load blog posts:", error);
    throw new Error("Unable to load articles right now.");
  }

  return (data ?? []) as unknown as BlogPostPreview[];
}

export async function fetchPublishedPostsPage(
  limit: number,
  offset: number,
): Promise<{ posts: BlogPostPreview[]; total: number }> {
  const client = requireSupabase();
  const from = offset;
  const to = offset + limit - 1;

  const { count } = await client
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  const { data, error } = await client
    .from("blog_posts")
    .select(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to load blog posts:", error);
    throw new Error("Unable to load articles right now.");
  }

  return { posts: (data ?? []) as unknown as BlogPostPreview[], total: count ?? 0 };
}

// ---------------------------------------------------------------------------
// Single post queries
// ---------------------------------------------------------------------------

export async function fetchPublishedPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_posts")
    .select(`${POST_PREVIEW_SELECT}, content, updated_at, seo_title, seo_description`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to load blog post:", error);
    throw new Error("Unable to load this article right now.");
  }

  return (data ?? null) as BlogPostDetail | null;
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export async function fetchTagsByPostId(postId: string): Promise<BlogTag[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_post_tags")
    .select("tag:blog_tags(id, name, slug)")
    .eq("post_id", postId);

  if (error) {
    console.error("Failed to load tags:", error);
    return [];
  }

  return ((data ?? []) as unknown as { tag: BlogTag }[]).map((r) => r.tag);
}

export async function fetchTagBySlug(slug: string): Promise<BlogTag | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_tags")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load tag:", error);
    return null;
  }

  return (data ?? null) as BlogTag | null;
}

export async function fetchPostsByTag(
  tagId: string,
  limit: number,
  offset: number,
): Promise<{ posts: BlogPostPreview[]; total: number }> {
  const client = requireSupabase();
  const from = offset;
  const to = offset + limit - 1;

  const { count } = await client
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .eq("blog_post_tags.tag_id", tagId);

  const { data, error } = await client
    .from("blog_posts")
    .select(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .eq("blog_post_tags.tag_id", tagId)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to load posts by tag:", error);
    throw new Error("Unable to load articles right now.");
  }

  return { posts: (data ?? []) as unknown as BlogPostPreview[], total: count ?? 0 };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_categories")
    .select("id, name, slug, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to load blog categories:", error);
    throw new Error("Unable to load categories right now.");
  }

  return (data ?? []) as BlogCategory[];
}

export async function fetchCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blog_categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load category:", error);
    return null;
  }

  return (data ?? null) as BlogCategory | null;
}

export async function fetchPostsByCategory(
  categoryId: string,
  limit: number,
  offset: number,
): Promise<{ posts: BlogPostPreview[]; total: number }> {
  const client = requireSupabase();
  const from = offset;
  const to = offset + limit - 1;

  const { count } = await client
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .eq("category_id", categoryId);

  const { data, error } = await client
    .from("blog_posts")
    .select(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to load posts by category:", error);
    throw new Error("Unable to load articles right now.");
  }

  return { posts: (data ?? []) as unknown as BlogPostPreview[], total: count ?? 0 };
}

// ---------------------------------------------------------------------------
// Related posts
// ---------------------------------------------------------------------------

export async function fetchRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
): Promise<BlogPostPreview[]> {
  const client = requireSupabase();
  const base = client
    .from("blog_posts")
    .select(POST_PREVIEW_SELECT)
    .eq("status", "published")
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit);

  const query = categoryId ? base.eq("category_id", categoryId) : base;
  const { data, error } = await query;

  if (error) {
    console.error("Failed to load related posts:", error);
    return [];
  }

  return (data ?? []) as unknown as BlogPostPreview[];
}
