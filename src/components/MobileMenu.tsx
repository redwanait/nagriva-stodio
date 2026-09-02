import { useEffect, useRef, type RefObject } from "react";
import logo from "../assets/logos/logo.png";
import { navLinks, socialLinks } from "../data/siteData";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
};

function MobileMenu({ open, onClose, returnFocusRef }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open) requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      returnFocusRef?.current?.focus();
      wasOpenRef.current = false;
    }
  }, [open, returnFocusRef]);

  const handleClose = () => onClose();

  return (
    <div
      id="mobile-menu"
      className={`mobile-menu${open ? "" : " mobile-menu--closing"}`}
      aria-hidden={!open}
    >
      <button className="mobile-menu__backdrop" type="button" aria-label="Close menu" onClick={handleClose} />
      <aside ref={menuRef} className="mobile-menu__drawer" aria-label="Mobile navigation">
        <div className="mobile-menu__header">
          <a className="mobile-menu__brand" href="/#home" onClick={handleClose}>
            <img src={logo} alt="Nagriva" />
          </a>
          <button
            ref={closeButtonRef}
            className="mobile-menu__close"
            type="button"
            aria-label="Close menu"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-menu__nav" aria-label="Main navigation">
          {navLinks.map((link, index) => {
            const linkHash = link.href.startsWith("/#") ? link.href.slice(1) : link.href;
            const isActive = (window.location.hash || "#home") === linkHash;
            return (
              <a
                key={link.href}
                className={isActive ? "mobile-menu__link mobile-menu__link--active" : "mobile-menu__link"}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={handleClose}
              >
                <span className="mobile-menu__link-index">0{index + 1}</span>
                <span className="mobile-menu__link-title">{link.label}</span>
                {isActive && <span className="mobile-menu__link-indicator" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>

        <div className="mobile-menu__footer">
          <p className="mobile-menu__availability">Available for select projects.</p>
          <a className="mobile-menu__cta" href="/#start" onClick={handleClose}>
            Start with Nagriva
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
          <div className="mobile-menu__socials" aria-label="Social links">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                onClick={handleClose}
              >
                <i className={social.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
