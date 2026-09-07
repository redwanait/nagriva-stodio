import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getBlogCoverUrl, getAuthorAvatarUrl } from "../lib/blogService";
import type { BlogPostPreview } from "../types/blog";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

interface AuthorChipProps {
  author: BlogPostPreview["author"];
}

export function AuthorChip({ author }: AuthorChipProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const avatarUrl = author ? getAuthorAvatarUrl(author.avatar_path) : null;
  const showFallback = !avatarUrl || imgFailed;
  const initial = author ? author.name.charAt(0).toUpperCase() : "N";
  return (
    <span className="blog-author">
      {showFallback ? (
        <span className="blog-author__avatar blog-author__avatar--fallback" aria-hidden="true">
          {initial}
        </span>
      ) : (
        <img
          className="blog-author__avatar"
          src={avatarUrl ?? ""}
          alt={author?.avatar_alt ?? ""}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}
      <span className="blog-author__name">{author ? author.name : "Nagriva"}</span>
    </span>
  );
}

interface ArticleMetaProps {
  post: BlogPostPreview;
}

export function ArticleMeta({ post }: ArticleMetaProps) {
  const category = post.category;
  return (
    <div className="blog-meta">
      {category && (
        <a className="blog-meta__category" href={`/blog/category/${category.slug}`}>
          {category.name}
        </a>
      )}
      <time className="blog-meta__date" dateTime={post.published_at}>
        {formatDate(post.published_at)}
      </time>
    </div>
  );
}

interface ArticleCardProps {
  post: BlogPostPreview;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const coverUrl = getBlogCoverUrl(post.cover_image_path);
  return (
    <article className="blog-card">
      <a className="blog-card__media" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        {coverUrl ? (
          <img className="blog-card__image" src={coverUrl} alt={post.cover_image_alt ?? ""} loading="lazy" />
        ) : (
          <span className="blog-card__fallback" aria-hidden="true" />
        )}
      </a>
      <div className="blog-card__body">
        <ArticleMeta post={post} />
        <h3 className="blog-card__title">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h3>
        {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
        <div className="blog-card__footer">
          <AuthorChip author={post.author} />
          <a className="blog-card__link" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
