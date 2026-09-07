export type BlogPostStatus = "draft" | "published";

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_path: string | null;
  avatar_alt: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  published_at: string;
  author: Pick<BlogAuthor, "id" | "name" | "slug" | "avatar_path" | "avatar_alt"> | null;
  category: Pick<BlogCategory, "id" | "name" | "slug"> | null;
}

export interface BlogPostDetail extends BlogPostPreview {
  content: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
}
