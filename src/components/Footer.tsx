
import logo from "../assets/logos/logo.png";
import { socialLinks } from "../data/siteData";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
];

function Footer() {
  return (
    <>
      <style>{`
        .footer-redesign {
          padding: 4rem 1rem 1.5rem;
          background: var(--color-bg);
        }
        .footer-redesign__content {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: clamp(2.5rem, 5vw, 4.5rem);
        }
        .footer-redesign__main {
          display: grid;
          grid-template-columns: minmax(250px, 1.25fr) minmax(330px, 1fr);
          gap: clamp(3rem, 10vw, 9rem);
        }
        .footer-redesign__brand {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .footer-redesign__logo {
          display: block;
          width: auto;
          height: 36px;
          object-fit: contain;
        }
        .footer-redesign__description {
          max-width: 305px;
          margin: 1.35rem 0 0;
          color: var(--color-muted);
          font-size: .78rem;
          line-height: 1.75;
        }
        .footer-redesign__socials {
          display: flex;
          flex-wrap: wrap;
          gap: .55rem;
          margin-top: 2rem;
        }
        .footer-redesign__social {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(245,245,245,.12);
          border-radius: 50%;
          color: var(--color-muted);
          font-size: .7rem;
          text-decoration: none;
          transition: border-color 160ms ease, color 160ms ease, transform 160ms ease;
        }
        .footer-redesign__social:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }
        .footer-redesign__columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2rem;
        }
        .footer-redesign__column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: .8rem;
        }
        .footer-redesign__label {
          margin-bottom: .45rem;
          color: var(--color-muted);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .15em;
          text-transform: uppercase;
        }
        .footer-redesign__link {
          color: var(--color-text);
          font-size: .76rem;
          text-decoration: none;
          transition: color 160ms ease;
        }
        .footer-redesign__link:hover {
          color: var(--color-accent);
        }
        .footer-redesign__project-link {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          color: var(--color-accent);
          font-family: var(--font-heading);
          font-weight: 600;
        }
        .footer-redesign__project-link svg {
          font-size: .65rem;
          transition: transform 160ms ease;
        }
        .footer-redesign__project-link:hover svg {
          transform: translateX(3px);
        }
        .footer-redesign__contact {
          margin-top: .35rem;
          line-height: 1.55;
        }
        .footer-redesign__divider {
          height: 1px;
          margin: clamp(2.75rem, 6vw, 5rem) 0 1.35rem;
          background: rgba(245,245,245,.1);
        }
        .footer-redesign__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: #5e5e5e;
          font-size: .62rem;
        }
        .footer-redesign__legal {
          display: flex;
          gap: 1.5rem;
        }
        .footer-redesign__legal a {
          color: inherit;
          text-decoration: none;
          transition: color 160ms ease;
        }
        .footer-redesign__legal a:hover {
          color: var(--color-text);
        }
        @media (max-width: 760px) {
          .footer-redesign { padding: 3rem 1rem 1rem; }
          .footer-redesign__main { grid-template-columns: 1fr; gap: 3.25rem; }
          .footer-redesign__columns { gap: 1.5rem; }
        }
        @media (max-width: 480px) {
          .footer-redesign__content { padding: 2.25rem 1.35rem; }
          .footer-redesign__columns { grid-template-columns: 1fr; gap: 2.25rem; }
          .footer-redesign__bottom { align-items: flex-start; flex-direction: column; }
          .footer-redesign__legal { gap: 1rem; }
        }
      `}</style>
      <footer className="footer-redesign">
        <div className="footer-redesign__content">
          <div className="footer-redesign__main">
            <div>
              <a className="footer-redesign__brand" href="/" aria-label="Nagriva home">
                <img className="footer-redesign__logo" src={logo} alt="Nagriva" />
              </a>
              <p className="footer-redesign__description">
                Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online.
              </p>
              <div className="footer-redesign__socials" aria-label="Social links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    className="footer-redesign__social"
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={social.icon} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-redesign__columns">
              <nav className="footer-redesign__column" aria-label="Explore">
                <span className="footer-redesign__label">Explore</span>
                {exploreLinks.map((link) => (
                  <a key={link.href} className="footer-redesign__link" href={link.href}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="footer-redesign__column">
                <span className="footer-redesign__label">Start/Help</span>
                <a className="footer-redesign__link footer-redesign__project-link" href="/start">
                  Start with Nagriva <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
                <a className="footer-redesign__link" href="mailto:contact@nagriva.ma">Hand in hand </a>
                <a className="footer-redesign__link footer-redesign__contact" href="mailto:contact@nagriva.ma">
                  contact@nagriva.ma
                </a>
                <a className="footer-redesign__link footer-redesign__contact" href="https://wa.me/+212728427278">
                  +212728427278
                </a>
              </div>
            </div>
          </div>

          <div className="footer-redesign__divider" />
          <div className="footer-redesign__bottom">
            <span>© 2026 Nagriva / Redouane Ait El-Hadji</span>
            <div className="footer-redesign__legal">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
