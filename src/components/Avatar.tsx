type AvatarProps = {
  name: string;
  url?: string | null;
  size?: "small" | "medium" | "large";
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ name, url, size = "medium" }: AvatarProps) {
  if (url) {
    return (
      <img
        className={`feedback-avatar feedback-avatar--${size}`}
        src={url}
        alt={`${name}'s photo`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className={`feedback-avatar feedback-avatar--${size} feedback-avatar--fallback`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
