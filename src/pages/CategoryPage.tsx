import { useCallback, useEffect, useState } from "react";
import { useSeo } from "../hooks/useSeo";
import { SITE_URL, type SeoMeta } from "../data/seo";
import {
  fetchCategoryBySlug,
  fetchPostsByCategory,
} from "../lib/blogService";
import type { BlogCategory, BlogPostPreview } from "../types/blog";
import { ArticleCard } from "../components/BlogShared";
import Breadcrumb from "../components/Breadcrumb";
import LoadMore from "../components/LoadMore";

const PAGE_SIZE = 9;

type LoadState = "loading" | "ready" | "error" | "not-found";

function CategoryPage({ slug }: { slug: string }) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [category, setCategory] = useState<BlogCategory | null>(null);
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
        const cat = await fetchCategoryBySlug(slug);

        if (!active) return;

        if (!cat) {
          setLoadState("not-found");
          return;
        }

        setCategory(cat);
        const { posts: catPosts, total: t } = await fetchPostsByCategory(cat.id, PAGE_SIZE, 0);
        if (!active) return;

        setPosts(catPosts);
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
    async (catId: string, pageNum: number) => {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const { posts: morePosts, total: t } = await fetchPostsByCategory(catId, PAGE_SIZE, offset);
      setTotal(t);
      setPosts((prev) => [...prev, ...morePosts]);
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (!category) return;
    const next = page + 1;
    setLoadingMore(true);
    setPage(next);
    void loadPage(category.id, next).finally(() => setLoadingMore(false));
  }, [category, page, loadPage]);

  useSeo(buildCategorySeo(category, slug));

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
              <p className="blog-state__title">We couldn&apos;t load this category.</p>
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

  if (loadState === "not-found" || !category) {
    return (
      <main className="blog-listing-page">
        <div className="blog-listing__container">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />
          <section className="blog-state">
            <div className="blog-state__panel">
              <p className="blog-state__title">Category not found.</p>
              <p className="blog-state__message">This category doesn&apos;t exist or may have been removed.</p>
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
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: category.name }]} />

        <div className="blog-listing__header">
          <h1 className="blog-listing__title">{category.name}</h1>
          {category.description && (
            <p className="blog-listing__description">{category.description}</p>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="blog-grid">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <p className="blog-empty__title">No articles in this category yet.</p>
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

function buildCategorySeo(category: BlogCategory | null, slug: string): SeoMeta {
  const title = category ? `${category.name} — Nagriva Blog` : "Category — Nagriva";
  const description = category?.description ?? `Articles about ${slug.replace(/-/g, " ")}.`;
  const canonical = `${SITE_URL}/blog/category/${slug}`;
  return {
    title,
    description,
    canonical,
    og: { title, description, url: canonical },
    twitter: { title, description, card: "summary" },
  };
}

export default CategoryPage;
