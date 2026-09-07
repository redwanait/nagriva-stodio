import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useSeo } from "../hooks/useSeo";
import { SITE_URL, type SeoMeta } from "../data/seo";
import {
  fetchPublishedPostBySlug,
  fetchTagsByPostId,
  fetchRelatedPosts,
  getBlogCoverUrl,
} from "../lib/blogService";
import type { BlogPostDetail, BlogPostPreview, BlogTag } from "../types/blog";
import { ArticleCard, AuthorChip } from "../components/BlogShared";
import Breadcrumb from "../components/Breadcrumb";
import SocialShare from "../components/SocialShare";

type LoadState = "loading" | "ready" | "error" | "not-found";

function formatDateLong(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function buildSeo(post: BlogPostDetail): SeoMeta {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? post.title;
  const image = post.cover_image_path ? getBlogCoverUrl(post.cover_image_path) ?? undefined : undefined;
  return {
    title: `${title} \u2014 Nagriva`,
    description,
    canonical: url,
    og: {
      title,
      description,
      url,
      type: "article",
      image,
      imageAlt: post.cover_image_alt ?? undefined,
    },
    twitter: {
      title,
      description,
      card: image ? "summary_large_image" : "summary",
      image,
      imageAlt: post.cover_image_alt ?? undefined,
    },
  };
}

function injectArticleJsonLd(post: BlogPostDetail, tags: BlogTag[]): void {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.cover_image_path ? getBlogCoverUrl(post.cover_image_path) ?? undefined : undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "Nagriva" },
  };

  if (image) schema.image = image;
  if (tags.length > 0) schema.keywords = tags.map((t) => t.name).join(", ");

  let el = document.getElementById("seo-blogpost-jsonld") as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = "seo-blogpost-jsonld";
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

interface BlogPostDetailsProps {
  slug: string;
}

function BlogPostDetails({ slug }: BlogPostDetailsProps) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [related, setRelated] = useState<BlogPostPreview[]>([]);

  useEffect(() => {
    let active = true;

    fetchPublishedPostBySlug(slug)
      .then(async (data) => {
        if (!active) return;
        if (!data) {
          setLoadState("not-found");
          return;
        }
        setPost(data);
        setLoadState("ready");

        const [tagsData, relatedData] = await Promise.all([
          fetchTagsByPostId(data.id),
          fetchRelatedPosts(data.id, data.category?.id ?? null),
        ]);
        if (active) {
          setTags(tagsData);
          setRelated(relatedData);
        }
      })
      .catch(() => {
        if (active) setLoadState("error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useSeo(post ? buildSeo(post) : baseSeo(slug));

  useEffect(() => {
    if (post && tags.length > 0) {
      injectArticleJsonLd(post, tags);
    } else if (post) {
      injectArticleJsonLd(post, []);
    }
    return () => {
      const el = document.getElementById("seo-blogpost-jsonld");
      if (el) el.remove();
    };
  }, [post, tags]);

  if (loadState === "loading") {
    return (
      <main className="blog-post-page">
        <div className="blog-post__container">
          <div className="blog-post blog-post--skeleton" aria-hidden="true">
            <div className="blog-skeleton blog-skeleton--chip" />
            <div className="blog-skeleton blog-skeleton--title" />
            <div className="blog-skeleton blog-skeleton--title" />
            <div className="blog-skeleton blog-skeleton--text" />
            <div className="blog-skeleton blog-skeleton--text" />
          </div>
        </div>
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main className="blog-post-page">
        <div className="blog-post__container">
          <section className="blog-state" role="alert">
            <div className="blog-state__panel">
              <p className="blog-state__title">We couldn&apos;t load this article.</p>
              <p className="blog-state__message">Something went wrong on our side. Please try again in a moment.</p>
              <button className="blog-state__button" type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (loadState === "not-found" || !post) {
    return (
      <main className="blog-post-page">
        <div className="blog-post__container">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />
          <section className="blog-state">
            <div className="blog-state__panel">
              <p className="blog-state__title">Article not found.</p>
              <p className="blog-state__message">This article may have been removed or the link is incorrect.</p>
              <a className="blog-state__button" href="/blog">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                Back to blog
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const coverUrl = getBlogCoverUrl(post.cover_image_path);
  const author = post.author;
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <main className="blog-post-page">
      <div className="blog-post__container">
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <a className="blog-post__back" href="/blog">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          Blog
        </a>

        <article className="blog-post">
          <header className="blog-post__header">
            {post.category && (
              <a className="blog-meta__category" href={`/blog/category/${post.category.slug}`}>
                {post.category.name}
              </a>
            )}
            <h1 className="blog-post__title">{post.title}</h1>
            {post.excerpt && <p className="blog-post__excerpt">{post.excerpt}</p>}

            <div className="blog-post__meta">
              {author && <AuthorChip author={author} />}
              <time className="blog-post__date" dateTime={post.published_at}>
                {formatDateLong(post.published_at)}
              </time>
            </div>

            {tags.length > 0 && (
              <div className="blog-tags">
                {tags.map((tag) => (
                  <a key={tag.id} className="blog-tag" href={`/blog/tag/${tag.slug}`}>
                    {tag.name}
                  </a>
                ))}
              </div>
            )}
          </header>

          <div className="blog-post__media">
            {coverUrl ? (
              <img className="blog-post__image" src={coverUrl} alt={post.cover_image_alt ?? ""} loading="eager" />
            ) : (
              <div className="blog-post__image blog-post__fallback" aria-hidden="true" />
            )}
          </div>

          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <SocialShare url={articleUrl} title={post.title} />
        </article>

        {related.length > 0 && (
          <section className="blog-related" aria-labelledby="blog-related-heading">
            <h2 id="blog-related-heading" className="blog-related__title">
              Related articles
            </h2>
            <div className="blog-grid">
              {related.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function baseSeo(slug: string): SeoMeta {
  return {
    title: "Article \u2014 Nagriva",
    description: "A Nagriva blog article.",
    canonical: `${SITE_URL}/blog/${slug}`,
    og: {
      title: "Article \u2014 Nagriva",
      description: "A Nagriva blog article.",
      url: `${SITE_URL}/blog/${slug}`,
    },
    twitter: {
      title: "Article \u2014 Nagriva",
      description: "A Nagriva blog article.",
      card: "summary",
    },
  };
}

export default BlogPostDetails;
