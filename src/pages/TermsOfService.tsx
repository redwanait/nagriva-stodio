import { useEffect, useRef, useState, type ReactNode } from "react";

interface SectionContent {
  id: string;
  title: string;
  body: Array<{ type: "p" | "h3" | "ul"; text?: ReactNode; items?: string[] }>;
}

const SECTIONS: SectionContent[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      {
        type: "p",
        text:
          "These Terms of Service govern the use of the Nagriva website and the services provided by Nagriva. By accessing the website or requesting or using Nagriva's services, you agree to these Terms.",
      },
      {
        type: "p",
        text:
          "If you do not agree with these Terms, you should not use the website or services.",
      },
    ],
  },
  {
    id: "our-services",
    title: "Our Services",
    body: [
      {
        type: "p",
        text:
          "Nagriva provides digital and web-related services, which may include website design, website development, landing pages, e-commerce websites, website updates and modifications, and other digital services agreed upon with the client.",
      },
      {
        type: "p",
        text:
          "The exact scope, deliverables, timeline, pricing, and requirements of each project are agreed upon with the client before or during the project.",
      },
    ],
  },
  {
    id: "client-responsibilities",
    title: "Client Responsibilities",
    body: [
      {
        type: "p",
        text:
          "Clients are responsible for providing accurate information, content, materials, access credentials, branding assets, images, text, and other resources required for their project when applicable.",
      },
      {
        type: "p",
        text:
          "Clients must ensure that they have the necessary rights or permissions to use any content or materials they provide to Nagriva.",
      },
      {
        type: "p",
        text:
          "Clients are also responsible for reviewing project work and providing feedback or approvals in a timely manner. Delays in providing required materials, information, feedback, or approvals may affect the project timeline.",
      },
      {
        type: "p",
        text:
          "Any work outside the originally agreed scope may require additional time or fees, subject to agreement with the client.",
      },
    ],
  },
  {
    id: "payments-revisions-delivery",
    title: "Payments, Revisions & Delivery",
    body: [
      {
        type: "p",
        text:
          "Project pricing, payment terms, milestones, revisions, and delivery dates are agreed upon with the client according to the specific project.",
      },
      {
        type: "p",
        text:
          "Delivery timelines may depend on the client's responsiveness and the timely provision of required materials. Additional requests or changes outside the agreed scope may be treated as additional work.",
      },
    ],
  },
  {
    id: "intellectual-property-portfolio",
    title: "Intellectual Property & Portfolio",
    body: [
      {
        type: "p",
        text:
          "Ownership and usage rights for the final project deliverables depend on the agreement between Nagriva and the client.",
      },
      {
        type: "p",
        text:
          "Clients must have the necessary rights to any content, images, logos, trademarks, or materials they provide.",
      },
      {
        type: "p",
        text:
          "Nagriva may showcase completed projects in its portfolio for promotional and professional purposes, including the project name, company or brand name, and a link to the published project where appropriate. Personal photographs or identifiable photos of clients or project owners will only be displayed with their permission.",
      },
      {
        type: "p",
        text: 
        <>For more information about how we collect, use, and protect personal information, please see our <a href="/privacy-policy">Privacy Policy</a>.</>,
      },
    ],
  },
  {
    id: "disclaimer-liability-contact",
    title: "Disclaimer, Liability & Contact",
    body: [
      {
        type: "p",
        text:
          "Nagriva aims to provide professional services according to the agreed project scope, but specific results, third-party services, hosting providers, platforms, external APIs, or other services outside Nagriva's direct control cannot always be guaranteed.",
      },
      {
        type: "p",
        text:
          "Clients remain responsible for the information and materials they provide and for ensuring that their use of the delivered website complies with applicable laws and third-party requirements.",
      },
      {
        type: "p",
        text:
          "Nagriva may update these Terms from time to time, and the updated version will be published on this page.",
      },
      {
        type: "p",
        text:
          "For any questions about these Terms, please contact us:",
      },
      {
        type: "ul",
        items: [
          "Email: hello@nagriva.com",
          "WhatsApp: +212 728 427 278",
        ],
      },
    ],
  },
];

function renderContact(text: string): ReactNode {
  if (text === "Email: hello@nagriva.com") {
    return (
      <>
        <strong>Email:</strong>{" "}
        <a href="mailto:hello@nagriva.com">hello@nagriva.com</a>
      </>
    );
  }
  if (text === "WhatsApp: +212 728 427 278") {
    return (
      <>
        <strong>WhatsApp:</strong>{" "}
        <a href="https://wa.me/212728427278">+212 728 427 278</a>
      </>
    );
  }
  return text;
}

function TermsOfService() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observerRef.current!.observe(h));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="pp-page">
      <section className="pp-hero" aria-labelledby="tos-hero-title">
        <div className="pp-hero__container">
          <div className="pp-hero__content">
            <h1 id="tos-hero-title">Terms of Service</h1>
            <p className="pp-hero__date">Effective Date: September 1, 2026</p>
          </div>
        </div>
        <div className="pp-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <div className="pp-layout">
        <aside className="pp-toc" aria-label="Table of Contents">
          <nav>
            <ul className="pp-toc__list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    className={`pp-toc__link ${
                      activeSection === section.id ? "pp-toc__link--active" : ""
                    }`}
                    onClick={() => scrollTo(section.id)}
                    aria-current={activeSection === section.id ? "true" : undefined}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="pp-content">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="pp-content__section">
              <h2>{section.title}</h2>
              {section.body.map((block, i) => {
                if (block.type === "h3") {
                  return <h3 key={i}>{block.text}</h3>;
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i}>
                      {block.items!.map((item, j) => (
                        <li key={j}>{renderContact(item)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </section>
          ))}

          <div className="pp-download">
            <a className="pp-download__btn" href="https://drive.google.com/file/d/10-nBeBfo012ttKFz2oGtECTFNaSOhoUa/view">
              Download Full Terms of Service
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}

export default TermsOfService;
