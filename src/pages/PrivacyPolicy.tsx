import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs["privacy-policy"];

interface SectionContent {
  id: string;
  title: string;
  body: Array<{ type: "p" | "h3" | "ul"; text?: string; items?: string[] }>;
}

const SECTIONS: SectionContent[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      {
        type: "p",
        text:
          "Welcome to Nagriva, a digital brand providing website design, development, and related digital services. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how Nagriva collects, uses, stores, and protects your information when you visit our website, contact us, request a service, submit feedback, or otherwise interact with our website and services.",
      },
      {
        type: "p",
        text:
          "By using our website, you acknowledge that you have read and understood this Privacy Policy. We may update it from time to time to reflect changes in our services, technology, or legal requirements, and we encourage you to review it periodically.",
      },
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: [
      {
        type: "p",
        text:
          "We may collect information you provide when you contact us or request our services, such as through our contact form. This may include your full name, email address, phone or WhatsApp number, the type of project or service you are interested in, and a description of your project.",
      },
      {
        type: "p",
        text:
          "Feedback submitted by users may be displayed publicly on the Nagriva website, so please do not include sensitive or confidential information in publicly visible feedback.",
      },
      {
        type: "p",
        text:
          "Client, company, or project information may appear in our Portfolio when relevant to the work we have delivered. A client's personal photo is only used with their permission.",
      },
      {
        type: "h3",
        text: "Information Collected Automatically",
      },
      {
        type: "p",
        text:
          "As our website and analytics infrastructure evolve, we may automatically collect technical and usage information, such as your IP address, browser and device type, pages visited, and general website usage, to understand how visitors interact with our website.",
      },
      {
        type: "p",
        text:
          "Our website and services are not directed at children, and we do not knowingly collect personal information from children.",
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    body: [
      {
        type: "p",
        text: "We may use the information we collect to:",
      },
      {
        type: "ul",
        items: [
          "Respond to your messages, questions, and project requests",
          "Understand your requirements and prepare proposals for our services",
          "Communicate about and deliver website design, development, and related services",
          "Maintain appropriate project and communication records",
          "Improve our website by understanding how visitors use it",
          "Detect and prevent abuse, fraud, spam, and unauthorized access",
          "Display approved project information and publicly submitted feedback",
          "Send marketing communications where permitted and with appropriate consent, and measure the effectiveness of our campaigns",
          "Comply with applicable legal obligations",
        ],
      },
      {
        type: "p",
        text:
          "We do not sell your personal information to third parties. Where processing is based on your consent, you may withdraw that consent at any time.",
      },
      {
        type: "p",
        text:
          "We keep personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy. When it is no longer required, we may delete it, anonymize it, or securely dispose of it.",
      },
      {
        type: "p",
        text:
          "Nagriva may introduce email marketing and newsletters in the future. Where required, we will obtain your consent before sending such communications, and you may unsubscribe at any time.",
      },
    ],
  },
  {
    id: "cookies-and-third-party-services",
    title: "Cookies & Third-Party Services",
    body: [
      {
        type: "p",
        text:
          "Nagriva may use cookies, pixels, tags, and similar technologies to operate and improve our website, including for essential functionality, security, remembering preferences, analytics, and measuring marketing campaigns. Where required by applicable law, we will request your consent before using non-essential cookies, and you may control cookies through your browser settings.",
      },
      {
        type: "h3",
        text: "Third-Party Services",
      },
      {
        type: "p",
        text:
          "We may use Supabase to store and manage information submitted through our website, such as contact requests, project inquiries, or feedback.",
      },
      {
        type: "p",
        text:
          "Services such as Google Analytics, Google Tag Manager, Meta Pixel, and email marketing providers may be introduced in the future to help us understand website usage, manage tags and tracking, measure advertising performance, and support communication campaigns. These providers may process information according to their own privacy policies and terms.",
      },
      {
        type: "p",
        text:
          "Our website may contain links to third-party websites. We are not responsible for their privacy practices or content, and we encourage you to review the privacy policies of any third-party website you visit.",
      },
    ],
  },
  {
    id: "your-privacy-and-contact",
    title: "Your Privacy & Contact",
    body: [
      {
        type: "p",
        text:
          "Depending on applicable law, you may have rights regarding your personal information, including the right to access, correct, or delete it, object to or restrict certain processing, and withdraw consent where processing is based on it.",
      },
      {
        type: "p",
        text:
          "To exercise a privacy right or for any privacy-related questions, please contact us using the details below. We will review your request and respond within a reasonable period, and we may need to verify your identity before processing certain requests.",
      },
      {
        type: "ul",
        items: [
          "Email: hello@nagriva.com",
          "Phone / WhatsApp: +212 728 427 278",
          "Website: nagriva.com",
        ],
      },
    ],
  },
];

function renderLink(text: string): ReactNode {
  if (text === "Email: hello@nagriva.com") {
    return (
      <>
        <strong>Email:</strong> <a href="mailto:hello@nagriva.com">hello@nagriva.com</a>
      </>
    );
  }
  if (text === "Phone / WhatsApp: +212 728 427 278") {
    return (
      <>
        <strong>Phone / WhatsApp:</strong>{" "}
        <a href="https://wa.me/212728427278">+212 728 427 278</a>
      </>
    );
  }
  if (text === "Website: nagriva.com") {
    return (
      <>
        <strong>Website:</strong> <a href="/">nagriva.com</a>
      </>
    );
  }
  return text;
}

function PrivacyPolicy() {
  useSeo(SEO);
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
      <section className="pp-hero" aria-labelledby="pp-hero-title">
        <div className="pp-hero__container">
          <div className="pp-hero__content">
            <h1 id="pp-hero-title">Privacy Policy</h1>
            <p className="pp-hero__date">Effective Date: January 1, 2026</p>
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
                        <li key={j}>{renderLink(item)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </section>
          ))}

          <div className="pp-download">
            <a className="pp-download__btn"  href="https://drive.google.com/file/d/18eTV0P1aoaAqq-PdES3DEfy088y1K105/view?usp=sharing">
              Download Full Privacy Policy
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}

export default PrivacyPolicy;