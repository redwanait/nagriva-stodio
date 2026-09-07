import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faLink, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faXTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useCallback, useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div className="social-share">
      <span className="social-share__label">
        <FontAwesomeIcon icon={faShareNodes} aria-hidden="true" />
        Share
      </span>
      <div className="social-share__links">
        <a
          className="social-share__link"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
        </a>
        <a
          className="social-share__link"
          href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
        </a>
        <a
          className="social-share__link"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} aria-hidden="true" />
        </a>
        <button
          className="social-share__link"
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faLink} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
