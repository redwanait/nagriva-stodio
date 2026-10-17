import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useSeo, setJsonLd } from "../hooks/useSeo";
import { SITE_URL, type SeoMeta } from "../data/seo";
import {
  fetchPublishedPostBySlug,
  fetchTagsByPostId,
  fetchRelatedPosts,
  getBlogCoverUrl,
} from "../lib/blogService";
import { buildArticleSeo, buildNotFoundSeo } from "../lib/blogSsr";
import { sanitizeArticleHtml } from "../lib/sanitizeHtml";
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

  const coverUrl = post ? getBlogCoverUrl(post.cover_image_path) : null;
  const articleSeo = useMemo(
    () => (post ? buildArticleSeo(post, tags, coverUrl) : null),
    [post, tags, coverUrl],
  );
  const safeContent = useMemo(
    () => (post ? sanitizeArticleHtml(post.content) : ""),
    [post],
  );

  const seo: SeoMeta = post && articleSeo
    ? articleSeo.meta
    : loadState === "not-found"
      ? buildNotFoundSeo("post")
      : loadState === "error"
        ? { ...baseSeo(slug), robots: "noindex, follow" }
        : baseSeo(slug);

  useSeo(seo);

  useEffect(() => {
    if (post && articleSeo) {
      setJsonLd(articleSeo.jsonLd);
    } else if (loadState === "not-found" || loadState === "error") {
      document.getElementById("seo-jsonld")?.remove();
    }
  }, [post, articleSeo, loadState]);

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
              <img
                className="blog-post__image"
                src={coverUrl}
                alt={post.cover_image_alt ?? ""}
                width="1200"
                height="675"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="blog-post__image blog-post__fallback" aria-hidden="true" />
            )}
          </div>

          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: safeContent }}
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

export default BlogPostDetails;
