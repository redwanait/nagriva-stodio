import { useRef, useState } from "react";
import { navLinks } from "../data/siteData";
import logo from "../assets/logos/logo.png";
import { faArrowRight, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="navbar" aria-label="Primary navigation">
        <a className="navbar__brand" href="#home">
          <img className="navbar__logo" src={logo} alt="Nagriva" />
        </a>

        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map((link, index) => (
            <a key={link.href} href={link.href}>
              <span className="navbar__index">0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="navbar__cta" href="#start">
          Start with Nagriva
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </a>
        <button
          ref={menuButtonRef}
          className="navbar__menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <FontAwesomeIcon
            className="navbar__menu-icon"
            icon={menuOpen ? faXmark : faBars}
            aria-hidden="true"
          />
        </button>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={menuButtonRef} />
    </>
  );
}

export default Navbar;
