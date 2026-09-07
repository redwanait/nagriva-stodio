import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";
import {
  fetchPublishedPostsPage,
  fetchBlogCategories,
  getBlogCoverUrl,
} from "../lib/blogService";
import type { BlogCategory, BlogPostPreview } from "../types/blog";
import LoadMore from "../components/LoadMore";
import { ArticleCard, AuthorChip, ArticleMeta } from "../components/BlogShared";

const SEO = seoConfigs.blog;
const PAGE_SIZE = 9;

type LoadState = "loading" | "ready" | "error";

interface FeaturedArticleProps {
  post: BlogPostPreview;
}

function FeaturedArticle({ post }: FeaturedArticleProps) {
  const coverUrl = getBlogCoverUrl(post.cover_image_path);
  return (
    <article className="blog-featured">
      <a className="blog-featured__media" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        {coverUrl ? (
          <img className="blog-featured__image" src={coverUrl} alt={post.cover_image_alt ?? ""} loading="eager" />
        ) : (
          <span className="blog-featured__fallback" aria-hidden="true" />
        )}
      </a>
      <div className="blog-featured__body">
        <ArticleMeta post={post} />
        <h2 className="blog-featured__title">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        {post.excerpt && <p className="blog-featured__excerpt">{post.excerpt}</p>}
        <div className="blog-featured__footer">
          <AuthorChip author={post.author} />
          <a className="blog-featured__link" href={`/blog/${post.slug}`}>
            Read article
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="blog-featured blog-featured--skeleton" aria-hidden="true">
      <div className="blog-featured__media">
        <div className="blog-skeleton blog-skeleton--block" />
      </div>
      <div className="blog-featured__body">
        <div className="blog-skeleton blog-skeleton--chip" />
        <div className="blog-skeleton blog-skeleton--title" />
        <div className="blog-skeleton blog-skeleton--title" />
        <div className="blog-skeleton blog-skeleton--text" />
        <div className="blog-skeleton blog-skeleton--text" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="blog-card" aria-hidden="true">
      <div className="blog-card__media">
        <div className="blog-skeleton blog-skeleton--block" />
      </div>
      <div className="blog-card__body">
        <div className="blog-skeleton blog-skeleton--chip" />
        <div className="blog-skeleton blog-skeleton--title" />
        <div className="blog-skeleton blog-skeleton--text" />
        <div className="blog-skeleton blog-skeleton--text" />
      </div>
    </div>
  );
}

function Blog() {
  useSeo(SEO);

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasMore = posts.length < total;

  const loadPage = useCallback(
    async (pageNum: number, replace: boolean) => {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const { posts: pagePosts, total: t } = await fetchPublishedPostsPage(PAGE_SIZE, offset);
      setTotal(t);
      setPosts((prev) => (replace ? pagePosts : [...prev, ...pagePosts]));
    },
    [],
  );

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    let active = true;

    fetchBlogCategories()
      .then((cats) => {
        if (!active) return null;
        setCategories(cats);
        return fetchPublishedPostsPage(PAGE_SIZE, 0);
      })
      .then((result) => {
        if (!active || !result) return;
        setTotal(result.total);
        setPosts(result.posts);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("error");
      });

    return () => { active = false; };
  }, []);

  const handleLoadMore = useCallback(() => {
    const next = page + 1;
    setLoadingMore(true);
    setPage(next);
    void loadPage(next, false).finally(() => setLoadingMore(false));
  }, [page, loadPage]);

  const handleCategory = useCallback((id: string | null) => {
    setActiveCategory(id);
    setQuery("");
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveCategory(null);
    setQuery("");
    searchInputRef.current?.focus();
  }, []);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === null ||
        (post.category && post.category.id === activeCategory);
      const matchesQuery =
        q === "" ||
        (post.title && post.title.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [posts, activeCategory, query]);

  const featured = posts[0];

  const isFiltering = activeCategory !== null || query.trim() !== "";

  const showNoPosts =
    loadState === "ready" && !isFiltering && posts.length === 0;

  return (
    <main className="blog-page">
      <section className="blog-hero" aria-labelledby="blog-hero-title">
        <div className="blog-hero__container">
          <div className="blog-hero__content">
            <p className="eyebrow blog-hero__eyebrow">
              <span className="eyebrow__dot" />
              Nagriva Blog
            </p>
            <h1 id="blog-hero-title">
              Ideas, notes <span>&amp;</span> work from the studio.
            </h1>
            <p className="blog-hero__description">
              Thoughts on design, development, and building digital products that feel clear, intentional, and human.
            </p>
          </div>
        </div>
      </section>

      <div className="blog-layout">
        {loadState === "loading" && (
          <section aria-label="Loading articles">
            <FeaturedSkeleton />
            <div className="blog-grid blog-grid--skeleton" aria-hidden="true">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </section>
        )}

        {loadState === "error" && (
          <section className="blog-state" role="alert">
            <div className="blog-state__panel">
              <p className="blog-state__title">We couldn&apos;t load articles.</p>
              <p className="blog-state__message">Something went wrong on our side. Please try again in a moment.</p>
              <button className="blog-state__button" type="button" onClick={reload}>
                Try again
              </button>
            </div>
          </section>
        )}

        {showNoPosts && (
          <section className="blog-state">
            <div className="blog-state__panel">
              <p className="blog-state__title">No articles yet.</p>
              <p className="blog-state__message">We haven&apos;t published any articles yet. Check back soon.</p>
            </div>
          </section>
        )}

        {loadState === "ready" && posts.length > 0 && !isFiltering && (
          <section className="blog-featured-section" aria-labelledby="blog-featured-heading">
            <h2 id="blog-featured-heading" className="visually-hidden">
              Featured article
            </h2>
            <FeaturedArticle post={featured} />
          </section>
        )}

        {loadState === "ready" && (
          <>
            <section className="blog-toolbar" aria-label="Browse articles">
              <div className="blog-categories" role="navigation" aria-label="Article categories">
                <a
                  className={`blog-category${activeCategory === null ? " blog-category--active" : ""}`}
                  href="/blog/"
                  aria-current={activeCategory === null ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategory(null);
                  }}
                >
                  All
                </a>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    className={`blog-category${activeCategory === category.id ? " blog-category--active" : ""}`}
                    href={`/blog/category/${category.slug}`}
                    aria-current={activeCategory === category.id ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategory(category.id);
                    }}
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              <div className="blog-search">
                <FontAwesomeIcon className="blog-search__icon" icon={faSearch} aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  className="blog-search__input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  aria-label="Search articles"
                />
              </div>
            </section>

            <section className="blog-latest" aria-labelledby="blog-latest-heading">
              <div className="blog-latest__heading">
                <h2 id="blog-latest-heading">Latest articles</h2>
                {isFiltering && (
                  <span className="blog-latest__count">
                    {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                  </span>
                )}
              </div>

              {filteredPosts.length > 0 ? (
                <div className="blog-grid">
                  {filteredPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="blog-empty">
                  <p className="blog-empty__title">No articles found</p>
                  <p className="blog-empty__message">
                    {query.trim() !== ""
                      ? `Nothing matched \u201c${query.trim()}\u201d. Try a different search.`
                      : "No articles in this category yet."}
                  </p>
                  {isFiltering && (
                    <button className="blog-empty__button" type="button" onClick={handleClearAll}>
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {!isFiltering && hasMore && (
                <LoadMore onClick={handleLoadMore} loading={loadingMore} />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Blog;
