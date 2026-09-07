import { useCallback, useEffect, useState } from "react";
import { useSeo } from "../hooks/useSeo";
import { SITE_URL, type SeoMeta } from "../data/seo";
import {
  fetchTagBySlug,
  fetchPostsByTag,
} from "../lib/blogService";
import type { BlogPostPreview, BlogTag } from "../types/blog";
import { ArticleCard } from "../components/BlogShared";
import Breadcrumb from "../components/Breadcrumb";
import LoadMore from "../components/LoadMore";

const PAGE_SIZE = 9;

type LoadState = "loading" | "ready" | "error" | "not-found";

function TagPage({ slug }: { slug: string }) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [tag, setTag] = useState<BlogTag | null>(null);
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasMore = posts.length < total;

  useEffect(() => {
    let active = true;

    async function load() {
      setLoadState("loading");
      try {
        const tagData = await fetchTagBySlug(slug);

        if (!active) return;

        if (!tagData) {
          setLoadState("not-found");
          return;
        }

        setTag(tagData);
        const { posts: firstPosts, total: t } = await fetchPostsByTag(tagData.id, PAGE_SIZE, 0);
        if (!active) return;

        setPosts(firstPosts);
        setTotal(t);
        setLoadState("ready");
      } catch {
        if (active) setLoadState("error");
      }
    }

    void load();
    return () => { active = false; };
  }, [slug]);

  const loadPage = useCallback(
    async (tagId: string, pageNum: number) => {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const { posts: morePosts, total: t } = await fetchPostsByTag(tagId, PAGE_SIZE, offset);
      setTotal(t);
      setPosts((prev) => [...prev, ...morePosts]);
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (!tag) return;
    const next = page + 1;
    setLoadingMore(true);
    setPage(next);
    void loadPage(tag.id, next).finally(() => setLoadingMore(false));
  }, [tag, page, loadPage]);

  useSeo(buildTagSeo(tag, slug));

  if (loadState === "loading") {
    return (
      <main className="blog-listing-page">
        <div className="blog-listing__container">
          <div className="blog-post blog-post--skeleton" aria-hidden="true">
            <div className="blog-skeleton blog-skeleton--chip" />
            <div className="blog-skeleton blog-skeleton--title" />
            <div className="blog-skeleton blog-skeleton--title" />
          </div>
        </div>
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main className="blog-listing-page">
        <div className="blog-listing__container">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />
          <section className="blog-state" role="alert">
            <div className="blog-state__panel">
              <p className="blog-state__title">We couldn&apos;t load this tag.</p>
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

  if (loadState === "not-found" || !tag) {
    return (
      <main className="blog-listing-page">
        <div className="blog-listing__container">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />
          <section className="blog-state">
            <div className="blog-state__panel">
              <p className="blog-state__title">Tag not found.</p>
              <p className="blog-state__message">This tag doesn&apos;t exist or may have been removed.</p>
              <a className="blog-state__button" href="/blog">
                Back to blog
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-listing-page">
      <div className="blog-listing__container">
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: tag.name }]} />

        <div className="blog-listing__header">
          <h1 className="blog-listing__title">Tagged: {tag.name}</h1>
        </div>

        {posts.length > 0 ? (
          <div className="blog-grid">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <p className="blog-empty__title">No articles with this tag yet.</p>
            <a className="blog-empty__button" href="/blog">
              Back to blog
            </a>
          </div>
        )}

        {hasMore && (
          <LoadMore onClick={handleLoadMore} loading={loadingMore} />
        )}
      </div>
    </main>
  );
}

function buildTagSeo(tag: BlogTag | null, slug: string): SeoMeta {
  const title = tag ? `#${tag.name} — Nagriva Blog` : "Tag — Nagriva";
  const description = `Articles tagged with ${tag?.name ?? slug.replace(/-/g, " ")}.`;
  const canonical = `${SITE_URL}/blog/tag/${slug}`;
  return {
    title,
    description,
    canonical,
    og: { title, description, url: canonical },
    twitter: { title, description, card: "summary" },
  };
}

export default TagPage;
