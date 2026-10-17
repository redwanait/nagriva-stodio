import { supabase } from "./supabase";
import {
  isAbsoluteMediaUrl,
  queryCategoriesWithPublishedPosts,
  queryCategoryBySlug,
  queryPublishedPostBySlug,
  queryPublishedPosts,
  queryRelatedPosts,
  queryTagBySlug,
  queryTagsByPostId,
  type BlogClient,
} from "./blogData";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostPreview,
  BlogTag,
} from "../types/blog";

function requireSupabase(): BlogClient {
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
  const cleanPath = path.trim();
  if (!cleanPath) return null;
  // A value that is already a full URL (external image host, data URI) is used
  // as-is. Only bare object keys belong to Supabase Storage.
  if (isAbsoluteMediaUrl(cleanPath)) return cleanPath;
  if (!supabase) return null;
  return supabase.storage.from(bucket).getPublicUrl(cleanPath).data.publicUrl;
}

/** Build the public URL for a blog cover image. */
export function getBlogCoverUrl(path: string | null): string | null {
  return getStoragePublicUrl(BLOG_COVERS_BUCKET, path);
}

/** Build the public URL for an author avatar. */
export function getAuthorAvatarUrl(path: string | null): string | null {
  return getStoragePublicUrl(BLOG_AUTHORS_BUCKET, path);
}

// ---------------------------------------------------------------------------
// Listing queries
// ---------------------------------------------------------------------------

/** Published posts with optional server-side category / search filtering. */
export async function fetchBlogPosts(params: {
  categoryId?: string | null;
  search?: string | null;
  limit: number;
  offset: number;
  withCount?: boolean;
}): Promise<{ posts: BlogPostPreview[]; total: number | null }> {
  const client = requireSupabase();
  try {
    return await queryPublishedPosts(client, params);
  } catch (error) {
    console.error("Failed to load blog posts:", error);
    throw new Error("Unable to load articles right now.", { cause: error });
  }
}

export async function fetchPostsByCategory(
  categoryId: string,
  limit: number,
  offset: number,
  withCount = true,
): Promise<{ posts: BlogPostPreview[]; total: number | null }> {
  return fetchBlogPosts({ categoryId, limit, offset, withCount });
}

export async function fetchPostsByTag(
  tagId: string,
  limit: number,
  offset: number,
  withCount = true,
): Promise<{ posts: BlogPostPreview[]; total: number | null }> {
  const client = requireSupabase();
  try {
    return await queryPublishedPosts(client, { tagId, limit, offset, withCount });
  } catch (error) {
    console.error("Failed to load posts by tag:", error);
    throw new Error("Unable to load articles right now.", { cause: error });
  }
}

// ---------------------------------------------------------------------------
// Single post queries
// ---------------------------------------------------------------------------

export async function fetchPublishedPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  const client = requireSupabase();
  try {
    return await queryPublishedPostBySlug(client, slug);
  } catch (error) {
    console.error("Failed to load blog post:", error);
    throw new Error("Unable to load this article right now.", { cause: error });
  }
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export async function fetchTagsByPostId(postId: string): Promise<BlogTag[]> {
  const client = requireSupabase();
  try {
    return await queryTagsByPostId(client, postId);
  } catch (error) {
    console.error("Failed to load tags:", error);
    return [];
  }
}

export async function fetchTagBySlug(slug: string): Promise<BlogTag | null> {
  const client = requireSupabase();
  try {
    return await queryTagBySlug(client, slug);
  } catch (error) {
    console.error("Failed to load tag:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/** Categories that have at least one published post. */
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const client = requireSupabase();
  try {
    return await queryCategoriesWithPublishedPosts(client);
  } catch (error) {
    console.error("Failed to load blog categories:", error);
    throw new Error("Unable to load categories right now.", { cause: error });
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const client = requireSupabase();
  try {
    return await queryCategoryBySlug(client, slug);
  } catch (error) {
    console.error("Failed to load category:", error);
    return null;
  }
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
  try {
    return await queryRelatedPosts(client, postId, categoryId, limit);
  } catch (error) {
    console.error("Failed to load related posts:", error);
    return [];
  }
}
