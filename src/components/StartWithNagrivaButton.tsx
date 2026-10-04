import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type StartWithNagrivaButtonProps = {
  /** Extra classes kept only for placement (margin/width) inside a section. */
  className?: string;
  href?: string;
  label?: string;
  onClick?: () => void;
};

/**
 * The single source of truth for every "Start with Nagriva" CTA.
 * The visual design (label, arrow, hover sheen, rotating rainbow ring)
 * lives in App.css under `.sw-button` — keep new call sites on this
 * component instead of hand-rolling another variant.
 */
function StartWithNagrivaButton({
  className = "",
  href = "/start",
  label = "Start with Nagriva",
  onClick,
}: StartWithNagrivaButtonProps) {
  return (
    <a
      className={`sw-button${className ? ` ${className}` : ""}`}
      href={href}
      onClick={onClick}
    >
      <span className="sw-button__ring" aria-hidden="true" />
      <span className="sw-button__label">{label}</span>
      <FontAwesomeIcon className="sw-button__icon" icon={faArrowRight} aria-hidden="true" />
    </a>
  );
}

export default StartWithNagrivaButton;