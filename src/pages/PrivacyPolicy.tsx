import { useEffect, useRef, useState, type ReactNode } from "react";

type Lang = "en" | "fr" | "ar";

const LANG_KEY = "nagriva-privacy-policy-language";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

interface SectionContent {
  id: string;
  title: string;
  body: Array<{ type: "p" | "h3" | "ul"; text?: string; items?: string[] }>;
}

type PrivacyCopy = {
  hero: { title: string; date: string };
  tocLabel: string;
  sections: SectionContent[];
};

const privacyContent: Record<Lang, PrivacyCopy> = {
  en: {
    hero: { title: "Privacy Policy", date: "Effective Date: September 1, 2026" },
    tocLabel: "Table of Contents",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        body: [
          {
            type: "p",
            text:
              "Welcome to Nagriva. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how Nagriva collects, uses, stores, and protects your information when you visit our website, contact us, request a service, submit feedback, or otherwise interact with our website and services.",
          },
          {
            type: "p",
            text:
              "By using our website, you acknowledge that you have read and understood this Privacy Policy.",
          },
        ],
      },
      {
        id: "who-we-are",
        title: "Who We Are",
        body: [
          {
            type: "p",
            text:
              "Nagriva is a digital brand providing website design, development, and related digital services.",
          },
          {
            type: "p",
            text:
              "Nagriva is currently used as a brand name. Where applicable, the legal entity responsible for processing personal data may be identified separately in our legal or contractual documentation.",
          },
          {
            type: "p",
            text:
              "For privacy-related questions or requests, you can contact us using the contact details provided at the end of this Privacy Policy.",
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
              "We may collect different types of information depending on how you interact with Nagriva.",
          },
          {
            type: "h3",
            text: "Information You Provide Directly",
          },
          {
            type: "p",
            text:
              "When you contact us or request to work with Nagriva, we may collect information such as:",
          },
          {
            type: "ul",
            items: [
              "Full name",
              "Email address",
              "Phone number or WhatsApp number",
              "Type of service you are interested in",
              "Description of the website or digital project you would like us to create or modify",
              "Messages, requirements, questions, or other information you choose to provide",
            ],
          },
          {
            type: "p",
            text:
              "For example, when you use our Contact or Start with Nagriva forms, we may ask for information necessary to understand your project and respond to your request.",
          },
          {
            type: "h3",
            text: "Feedback Information",
          },
          {
            type: "p",
            text:
              "Nagriva may allow visitors and clients to leave feedback about their experience. Because feedback submitted through our website may be displayed publicly, information that you voluntarily include in your feedback may become publicly accessible.",
          },
          {
            type: "p",
            text:
              "This may include your name, role or company name, your feedback or testimonial, and other information you voluntarily choose to publish.",
          },
          {
            type: "p",
            text:
              "Please do not include sensitive, confidential, or unnecessary personal information in publicly visible feedback.",
          },
          {
            type: "h3",
            text: "Portfolio and Client Information",
          },
          {
            type: "p",
            text:
              "As part of our portfolio, Nagriva may showcase projects completed for clients. Depending on the project and our agreement with the client, a portfolio entry may include:",
          },
          {
            type: "ul",
            items: [
              "Client or company name",
              "Brand name",
              "Project description",
              "Website or project URL",
              "Screenshots or visual representations of the completed project",
              "Other project-related information appropriate for showcasing our work",
            ],
          },
          {
            type: "h3",
            text: "Personal Images",
          },
          {
            type: "p",
            text:
              "If we would like to display a personal photograph of a client, founder, team member, or other identifiable individual as part of a portfolio project, we will request appropriate permission before publishing the image.",
          },
          {
            type: "h3",
            text: "Information Collected Automatically",
          },
          {
            type: "p",
            text:
              "As our website and analytics infrastructure evolve, we may automatically collect certain technical and usage information, such as:",
          },
          {
            type: "ul",
            items: [
              "IP address or approximate location",
              "Browser type and version",
              "Device type and operating system",
              "Pages visited and general website usage",
              "Referring website or source",
              "Date and time of visits",
            ],
          },
        ],
      },
      {
        id: "how-we-use-your-information",
        title: "How We Use Your Information",
        body: [
          {
            type: "p",
            text: "We may use the information we collect for purposes including:",
          },
          {
            type: "ul",
            items: [
              "Responding to inquiries: To respond to your messages, questions, and project requests.",
              "Understanding your project: To understand your requirements and determine how we can assist you.",
              "Providing our services: To prepare proposals, communicate about projects, and deliver our website design, development, and related services.",
              "Managing client relationships: To maintain appropriate project and communication records.",
              "Improving our website: To understand how visitors use our website and improve its structure, content, and performance.",
              "Security: To detect and prevent abuse, fraud, spam, unauthorized access, and other security threats.",
              "Portfolio and testimonials: To display approved project information and publicly submitted feedback.",
              "Marketing: Where permitted and where appropriate consent or another lawful basis is required, to send marketing communications and measure the effectiveness of our campaigns.",
              "Legal compliance: To comply with applicable legal obligations and protect our legitimate interests.",
            ],
          },
          { type: "p", text: "We do not sell your personal information to third parties." },
        ],
      },
      {
        id: "legal-basis-for-processing",
        title: "Legal Basis for Processing",
        body: [
          {
            type: "p",
            text:
              "Where applicable, Nagriva processes personal information on the basis of one or more of the following:",
          },
          {
            type: "ul",
            items: [
              "Your consent",
              "The need to respond to a request you have made",
              "The performance or preparation of a contractual relationship",
              "Our legitimate business interests, where permitted by applicable law",
              "Compliance with legal obligations",
            ],
          },
          {
            type: "p",
            text:
              "Where processing is based on your consent, you may withdraw that consent where applicable.",
          },
        ],
      },
      {
        id: "how-we-store-and-protect-your-information",
        title: "How We Store and Protect Your Information",
        body: [
          {
            type: "p",
            text:
              "We take reasonable technical and organizational measures to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.",
          },
          {
            type: "p",
            text:
              "Information submitted through our website may be stored using third-party infrastructure and service providers, including Supabase, depending on the functionality being used.",
          },
          {
            type: "p",
            text:
              "No method of transmission or electronic storage is completely secure. While we take reasonable steps to protect your information, we cannot guarantee absolute security.",
          },
        ],
      },
      {
        id: "third-party-services",
        title: "Third-Party Services",
        body: [
          {
            type: "p",
            text:
              "Nagriva may use third-party services to operate, secure, analyze, and improve our website and communications. The services we use may change over time as our technology infrastructure evolves.",
          },
          { type: "h3", text: "Supabase" },
          {
            type: "p",
            text:
              "We may use Supabase to store and manage information submitted through our website, such as contact requests, project inquiries, feedback, or other application data.",
          },
          { type: "h3", text: "Google Analytics" },
          {
            type: "p",
            text:
              "We may use Google Analytics to understand how visitors interact with our website, including website traffic, pages viewed, general usage patterns, and website performance.",
          },
          { type: "h3", text: "Google Tag Manager" },
          {
            type: "p",
            text:
              "We may use Google Tag Manager to manage website tags and tracking technologies.",
          },
          { type: "h3", text: "Meta Pixel" },
          {
            type: "p",
            text:
              "We may use Meta Pixel or similar technologies to measure advertising performance, understand interactions with our website, and support advertising and remarketing activities.",
          },
          { type: "h3", text: "Email Service Providers" },
          {
            type: "p",
            text:
              "We may use third-party email service providers to send transactional emails, contact responses, project-related communications, newsletters, or marketing emails.",
          },
          {
            type: "p",
            text:
              "Third-party providers may process information according to their own privacy policies and terms.",
          },
        ],
      },
      {
        id: "cookies-and-tracking-technologies",
        title: "Cookies and Tracking Technologies",
        body: [
          {
            type: "p",
            text:
              "Nagriva may use cookies, pixels, tags, scripts, and similar technologies to operate and improve the website.",
          },
          { type: "h3", text: "How We May Use These Technologies" },
          {
            type: "ul",
            items: [
              "Essential website functionality",
              "Security",
              "Remembering preferences",
              "Website analytics",
              "Understanding visitor behavior",
              "Measuring marketing campaigns",
              "Advertising and remarketing",
            ],
          },
          { type: "h3", text: "Managing Cookies" },
          {
            type: "p",
            text:
              "You may be able to control cookies through your browser settings or through privacy controls provided on our website.",
          },
          {
            type: "p",
            text:
              "Where required by applicable law, we will request your consent before using non-essential cookies or tracking technologies.",
          },
        ],
      },
      {
        id: "marketing-communications",
        title: "Marketing Communications",
        body: [
          {
            type: "p",
            text:
              "Nagriva may offer newsletters, promotional emails, updates, or other marketing communications.",
          },
          {
            type: "p",
            text:
              "Where required, we will obtain the appropriate consent before sending marketing communications.",
          },
          {
            type: "p",
            text:
              "You may unsubscribe from marketing emails at any time by using the unsubscribe mechanism included in the communication or by contacting us directly.",
          },
          {
            type: "p",
            text:
              "Unsubscribing from marketing communications will not necessarily prevent us from sending important service-related or transactional communications.",
          },
        ],
      },
      {
        id: "data-retention",
        title: "How Long We Keep Your Information",
        body: [
          {
            type: "p",
            text:
              "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including:",
          },
          {
            type: "ul",
            items: [
              "Responding to and managing inquiries",
              "Providing our services",
              "Maintaining business and project records",
              "Handling disputes",
              "Complying with legal obligations",
              "Protecting our legitimate interests",
            ],
          },
          {
            type: "p",
            text:
              "The exact retention period may vary depending on the type of information and the purpose for which it was collected.",
          },
          {
            type: "p",
            text:
              "When information is no longer reasonably required, we may delete it, anonymize it, or securely dispose of it, subject to applicable legal or contractual requirements.",
          },
        ],
      },
      {
        id: "your-privacy-rights",
        title: "Your Privacy Rights",
        body: [
          {
            type: "p",
            text:
              "Depending on applicable law, you may have rights regarding your personal information, including the right to:",
          },
          {
            type: "ul",
            items: [
              "Access: Request access to personal information we hold about you.",
              "Correction: Request correction of inaccurate or incomplete information.",
              "Deletion: Request deletion of your personal information where applicable.",
              "Objection: Object to certain processing activities.",
              "Restriction: Request restriction of certain processing activities where applicable.",
              "Withdraw consent: Withdraw consent where processing is based on your consent.",
            ],
          },
          {
            type: "p",
            text:
              "To exercise a privacy right, please contact us using the information provided in the Contact Us section below.",
          },
          {
            type: "p",
            text:
              "We may need to verify your identity before processing certain requests in order to protect your information from unauthorized access.",
          },
        ],
      },
      {
        id: "publicly-available-information",
        title: "Publicly Available Information",
        body: [
          {
            type: "p",
            text:
              "Some information submitted through certain features of our website may be intentionally made public.",
          },
          {
            type: "p",
            text:
              "This particularly applies to feedback, testimonials, or portfolio-related information.",
          },
          {
            type: "p",
            text:
              "Before submitting information through a public feedback feature, please consider whether you are comfortable with that information being accessible to other website visitors.",
          },
          {
            type: "p",
            text:
              "If you submit information for public display, you understand that other people may be able to view, copy, or share that information.",
          },
        ],
      },
      {
        id: "data-transfers",
        title: "Data Transfers",
        body: [
          {
            type: "p",
            text:
              "Some of our third-party service providers may process or store information on servers located outside Morocco or outside your country of residence.",
          },
          {
            type: "p",
            text:
              "Where personal information is transferred internationally, Nagriva will seek to use appropriate safeguards and comply with applicable data protection requirements.",
          },
          {
            type: "p",
            text:
              "The location and providers used to process information may change as our technology infrastructure evolves.",
          },
        ],
      },
      {
        id: "childrens-privacy",
        title: "Children's Privacy",
        body: [
          {
            type: "p",
            text:
              "Our website and services are not intentionally directed at children.",
          },
          {
            type: "p",
            text:
              "We do not knowingly collect personal information from children through our website.",
          },
          {
            type: "p",
            text:
              "If you believe that a child has provided personal information to us without appropriate authorization, please contact us so that we can review and take appropriate action.",
          },
        ],
      },
      {
        id: "third-party-websites",
        title: "Third-Party Websites",
        body: [
          {
            type: "p",
            text:
              "Our website may contain links to websites, platforms, or services operated by third parties.",
          },
          {
            type: "p",
            text:
              "We are not responsible for the privacy practices, content, security, or policies of third-party websites. We encourage you to review the privacy policies of any third-party website you visit through a link on our website.",
          },
        ],
      },
      {
        id: "changes-to-this-privacy-policy",
        title: "Changes to This Privacy Policy",
        body: [
          {
            type: "p",
            text:
              "We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or privacy practices.",
          },
          {
            type: "p",
            text:
              "When we make changes, we will update the Last Updated date at the top of this page.",
          },
          {
            type: "p",
            text:
              "We encourage you to review this Privacy Policy periodically to stay informed about how we handle personal information.",
          },
        ],
      },
      {
        id: "contact-us",
        title: "Contact Us",
        body: [
          {
            type: "p",
            text:
              "If you have questions about this Privacy Policy, want to exercise a privacy right, or believe that your personal information has been handled inappropriately, please contact us:",
          },
          {
            type: "ul",
            items: [
              "Email: hello@nagriva.com",
              "Phone / WhatsApp: +212 728 427 278",
              "Website: nagriva.com",
            ],
          },
          {
            type: "p",
            text:
              "We will review your request and respond within a reasonable period, subject to applicable legal requirements.",
          },
        ],
      },
      {
        id: "applicable-privacy-law",
        title: "Applicable Privacy Law",
        body: [
          {
            type: "p",
            text:
              "Nagriva aims to handle personal information in accordance with applicable data protection and privacy laws.",
          },
          {
            type: "p",
            text:
              "For users and processing activities subject to Moroccan data protection requirements, this may include Moroccan Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data and the applicable requirements of the Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP).",
          },
          {
            type: "p",
            text:
              "Where other privacy laws apply based on the location of a user or the nature of a particular processing activity, additional rights or requirements may apply.",
          },
        ],
      },
    ],
  },
  fr: {
    hero: { title: "Politique de Confidentialité", date: "Date d'entrée en vigueur : 1 septembre 2026" },
    tocLabel: "Table des matières",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        body: [
          {
            type: "p",
            text:
              "Bienvenue chez Nagriva. Nous respectons votre vie privée et nous nous engageons à protéger les informations personnelles que vous partagez avec nous. La présente Politique de Confidentialité explique comment Nagriva collecte, utilise, stocke et protège vos informations lorsque vous visitez notre site web, nous contactez, demandez un service, soumettez un avis, ou interagissez de toute autre manière avec notre site web et nos services.",
          },
          {
            type: "p",
            text:
              "En utilisant notre site web, vous reconnaissez avoir lu et compris la présente Politique de Confidentialité.",
          },
        ],
      },
      {
        id: "who-we-are",
        title: "Qui sommes-nous",
        body: [
          {
            type: "p",
            text:
              "Nagriva est une marque numérique proposant la conception et le développement de sites web ainsi que des services numériques associés.",
          },
          {
            type: "p",
            text:
              "Nagriva est actuellement utilisée comme nom de marque. Le cas échéant, l'entité juridique responsable du traitement des données personnelles peut être identifiée séparément dans notre documentation juridique ou contractuelle.",
          },
          {
            type: "p",
            text:
              "Pour toute question ou demande relative à la confidentialité, vous pouvez nous contacter aux coordonnées indiquées à la fin de la présente Politique de Confidentialité.",
          },
        ],
      },
      {
        id: "information-we-collect",
        title: "Informations que nous collectons",
        body: [
          {
            type: "p",
            text:
              "Nous pouvons collecter différents types d'informations selon la manière dont vous interagissez avec Nagriva.",
          },
          { type: "h3", text: "Informations que vous fournissez directement" },
          {
            type: "p",
            text:
              "Lorsque vous nous contactez ou demandez à travailler avec Nagriva, nous pouvons collecter des informations telles que :",
          },
          {
            type: "ul",
            items: [
              "Nom complet",
              "Adresse e-mail",
              "Numéro de téléphone ou numéro WhatsApp",
              "Type de service qui vous intéresse",
              "Description du site web ou du projet numérique que vous souhaiteriez que nous créions ou modifiions",
              "Messages, exigences, questions ou autres informations que vous choisissez de fournir",
            ],
          },
          {
            type: "p",
            text:
              "Par exemple, lorsque vous utilisez nos formulaires Contact ou Start with Nagriva, nous pouvons vous demander les informations nécessaires pour comprendre votre projet et répondre à votre demande.",
          },
          { type: "h3", text: "Informations relatives aux avis" },
          {
            type: "p",
            text:
              "Nagriva peut permettre aux visiteurs et aux clients de laisser un avis sur leur expérience. Étant donné que les avis soumis via notre site web peuvent être affichés publiquement, les informations que vous incluez volontairement dans votre avis peuvent devenir accessibles au public.",
          },
          {
            type: "p",
            text:
              "Cela peut inclure votre nom, votre fonction ou le nom de votre entreprise, votre avis ou témoignage, ainsi que toute autre information que vous choisissez volontairement de publier.",
          },
          {
            type: "p",
            text:
              "Veuillez ne pas inclure d'informations sensibles, confidentielles ou personnelles inutiles dans les avis visibles publiquement.",
          },
          { type: "h3", text: "Informations sur le portfolio et les clients" },
          {
            type: "p",
            text:
              "Dans le cadre de notre portfolio, Nagriva peut présenter des projets réalisés pour des clients. Selon le projet et notre accord avec le client, une entrée de portfolio peut inclure :",
          },
          {
            type: "ul",
            items: [
              "Nom du client ou de l'entreprise",
              "Nom de la marque",
              "Description du projet",
              "URL du site web ou du projet",
              "Captures d'écran ou représentations visuelles du projet réalisé",
              "Autres informations liées au projet et appropriées pour présenter notre travail",
            ],
          },
          { type: "h3", text: "Images personnelles" },
          {
            type: "p",
            text:
              "Si nous souhaitons afficher une photographie personnelle d'un client, d'un fondateur, d'un membre de l'équipe ou de toute autre personne identifiable dans le cadre d'un projet de portfolio, nous demanderons une autorisation appropriée avant de publier l'image.",
          },
          { type: "h3", text: "Informations collectées automatiquement" },
          {
            type: "p",
            text:
              "À mesure que notre site web et notre infrastructure d'analyse évoluent, nous pouvons collecter automatiquement certaines informations techniques et d'utilisation, telles que :",
          },
          {
            type: "ul",
            items: [
              "Adresse IP ou localisation approximative",
              "Type et version du navigateur",
              "Type d'appareil et système d'exploitation",
              "Pages visitées et utilisation générale du site web",
              "Site web ou source de référence",
              "Date et heure des visites",
            ],
          },
        ],
      },
      {
        id: "how-we-use-your-information",
        title: "Comment nous utilisons vos informations",
        body: [
          {
            type: "p",
            text:
              "Nous pouvons utiliser les informations que nous collectons à des fins notamment :",
          },
          {
            type: "ul",
            items: [
              "Répondre aux demandes : pour répondre à vos messages, questions et demandes de projet.",
              "Comprendre votre projet : pour comprendre vos besoins et déterminer comment nous pouvons vous aider.",
              "Fournir nos services : pour préparer des propositions, communiquer sur les projets et livrer nos services de conception, de développement et services associés.",
              "Gérer les relations clients : pour conserver des dossiers appropriés de projet et de communication.",
              "Améliorer notre site web : pour comprendre comment les visiteurs utilisent notre site web et améliorer sa structure, son contenu et ses performances.",
              "Sécurité : pour détecter et prévenir les abus, la fraude, le spam, les accès non autorisés et autres menaces de sécurité.",
              "Portfolio et témoignages : pour afficher les informations de projet approuvées et les avis soumis publiquement.",
              "Marketing : lorsque cela est autorisé et lorsqu'un consentement approprié ou une autre base légale est requis, pour envoyer des communications marketing et mesurer l'efficacité de nos campagnes.",
              "Conformité légale : pour respecter les obligations légales applicables et protéger nos intérêts légitimes.",
            ],
          },
          {
            type: "p",
            text:
              "Nous ne vendons pas vos informations personnelles à des tiers.",
          },
        ],
      },
      {
        id: "legal-basis-for-processing",
        title: "Base légale du traitement",
        body: [
          {
            type: "p",
            text:
              "Lorsque cela est applicable, Nagriva traite les informations personnelles sur la base d'un ou plusieurs des motifs suivants :",
          },
          {
            type: "ul",
            items: [
              "Votre consentement",
              "La nécessité de répondre à une demande que vous avez faite",
              "L'exécution ou la préparation d'une relation contractuelle",
              "Nos intérêts commerciaux légitimes, lorsque la loi applicable le permet",
              "Le respect des obligations légales",
            ],
          },
          {
            type: "p",
            text:
              "Lorsque le traitement repose sur votre consentement, vous pouvez le retirer le cas échéant.",
          },
        ],
      },
      {
        id: "how-we-store-and-protect-your-information",
        title: "Comment nous stockons et protégeons vos informations",
        body: [
          {
            type: "p",
            text:
              "Nous prenons des mesures techniques et organisationnelles raisonnables pour protéger les informations personnelles contre tout accès non autorisé, perte, utilisation abusive, altération ou divulgation.",
          },
          {
            type: "p",
            text:
              "Les informations soumises via notre site web peuvent être stockées à l'aide d'infrastructures et de prestataires de services tiers, notamment Supabase, selon la fonctionnalité utilisée.",
          },
          {
            type: "p",
            text:
              "Aucune méthode de transmission ou de stockage électronique n'est totalement sécurisée. Bien que nous prenions des mesures raisonnables pour protéger vos informations, nous ne pouvons pas garantir une sécurité absolue.",
          },
        ],
      },
      {
        id: "third-party-services",
        title: "Services tiers",
        body: [
          {
            type: "p",
            text:
              "Nagriva peut utiliser des services tiers pour exploiter, sécuriser, analyser et améliorer notre site web et nos communications. Les services que nous utilisons peuvent évoluer au fil du temps en fonction de l'évolution de notre infrastructure technologique.",
          },
          { type: "h3", text: "Supabase" },
          {
            type: "p",
            text:
              "Nous pouvons utiliser Supabase pour stocker et gérer les informations soumises via notre site web, telles que les demandes de contact, les demandes de projet, les avis ou autres données d'application.",
          },
          { type: "h3", text: "Google Analytics" },
          {
            type: "p",
            text:
              "Nous pouvons utiliser Google Analytics pour comprendre comment les visiteurs interagissent avec notre site web, notamment le trafic, les pages consultées, les modèles d'utilisation généraux et les performances du site web.",
          },
          { type: "h3", text: "Google Tag Manager" },
          {
            type: "p",
            text:
              "Nous pouvons utiliser Google Tag Manager pour gérer les balises et les technologies de suivi de notre site web.",
          },
          { type: "h3", text: "Meta Pixel" },
          {
            type: "p",
            text:
              "Nous pouvons utiliser Meta Pixel ou des technologies similaires pour mesurer les performances publicitaires, comprendre les interactions avec notre site web et soutenir les activités de publicité et de reciblage.",
          },
          { type: "h3", text: "Prestataires de services e-mail" },
          {
            type: "p",
            text:
              "Nous pouvons utiliser des prestataires de services e-mail tiers pour envoyer des e-mails transactionnels, des réponses aux demandes de contact, des communications liées aux projets, des newsletters ou des e-mails marketing.",
          },
          {
            type: "p",
            text:
              "Les prestataires tiers peuvent traiter les informations conformément à leurs propres politiques de confidentialité et conditions.",
          },
        ],
      },
      {
        id: "cookies-and-tracking-technologies",
        title: "Cookies et technologies de suivi",
        body: [
          {
            type: "p",
            text:
              "Nagriva peut utiliser des cookies, des pixels, des balises, des scripts et des technologies similaires pour exploiter et améliorer le site web.",
          },
          { type: "h3", text: "Comment nous pouvons utiliser ces technologies" },
          {
            type: "ul",
            items: [
              "Fonctionnalités essentielles du site web",
              "Sécurité",
              "Mémorisation des préférences",
              "Analyse du site web",
              "Compréhension du comportement des visiteurs",
              "Mesure des campagnes marketing",
              "Publicité et reciblage",
            ],
          },
          { type: "h3", text: "Gestion des cookies" },
          {
            type: "p",
            text:
              "Vous pouvez contrôler les cookies via les paramètres de votre navigateur ou via les contrôles de confidentialité fournis sur notre site web.",
          },
          {
            type: "p",
            text:
              "Lorsque la loi applicable l'exige, nous demanderons votre consentement avant d'utiliser des cookies non essentiels ou des technologies de suivi.",
          },
        ],
      },
      {
        id: "marketing-communications",
        title: "Communications marketing",
        body: [
          {
            type: "p",
            text:
              "Nagriva peut proposer des newsletters, des e-mails promotionnels, des mises à jour ou d'autres communications marketing.",
          },
          {
            type: "p",
            text:
              "Lorsque cela est requis, nous obtiendrons le consentement approprié avant d'envoyer des communications marketing.",
          },
          {
            type: "p",
            text:
              "Vous pouvez vous désabonner des e-mails marketing à tout moment en utilisant le mécanisme de désabonnement inclus dans la communication ou en nous contactant directement.",
          },
          {
            type: "p",
            text:
              "Le désabonnement des communications marketing ne nous empêchera pas nécessairement de vous envoyer des communications importantes liées aux services ou des communications transactionnelles.",
          },
        ],
      },
      {
        id: "data-retention",
        title: "Combien de temps nous conservons vos informations",
        body: [
          {
            type: "p",
            text:
              "Nous ne conservons les informations personnelles que pendant la durée raisonnablement nécessaire aux fins décrites dans la présente Politique de Confidentialité, notamment :",
          },
          {
            type: "ul",
            items: [
              "Répondre aux demandes et les gérer",
              "Fournir nos services",
              "Conserver les dossiers commerciaux et de projet",
              "Gérer les litiges",
              "Respecter les obligations légales",
              "Protéger nos intérêts légitimes",
            ],
          },
          {
            type: "p",
            text:
              "La durée de conservation exacte peut varier selon le type d'informations et la finalité pour laquelle elles ont été collectées.",
          },
          {
            type: "p",
            text:
              "Lorsque les informations ne sont plus raisonnablement nécessaires, nous pouvons les supprimer, les anonymiser ou les éliminer de manière sécurisée, sous réserve des exigences légales ou contractuelles applicables.",
          },
        ],
      },
      {
        id: "your-privacy-rights",
        title: "Vos droits en matière de confidentialité",
        body: [
          {
            type: "p",
            text:
              "Selon la loi applicable, vous pouvez disposer de droits concernant vos informations personnelles, notamment le droit de :",
          },
          {
            type: "ul",
            items: [
              "Accès : demander l'accès aux informations personnelles que nous détenons sur vous.",
              "Rectification : demander la correction d'informations inexactes ou incomplètes.",
              "Suppression : demander la suppression de vos informations personnelles lorsque cela est applicable.",
              "Opposition : vous opposer à certaines activités de traitement.",
              "Limitation : demander la limitation de certaines activités de traitement lorsque cela est applicable.",
              "Retrait du consentement : retirer votre consentement lorsque le traitement repose sur celui-ci.",
            ],
          },
          {
            type: "p",
            text:
              "Pour exercer un droit en matière de confidentialité, veuillez nous contacter en utilisant les informations fournies dans la section Contactez-nous ci-dessous.",
          },
          {
            type: "p",
            text:
              "Nous pouvons avoir besoin de vérifier votre identité avant de traiter certaines demandes afin de protéger vos informations contre tout accès non autorisé.",
          },
        ],
      },
      {
        id: "publicly-available-information",
        title: "Informations accessibles publiquement",
        body: [
          {
            type: "p",
            text:
              "Certaines informations soumises via certaines fonctionnalités de notre site web peuvent être volontairement rendues publiques.",
          },
          {
            type: "p",
            text:
              "Cela s'applique particulièrement aux avis, témoignages ou informations relatives au portfolio.",
          },
          {
            type: "p",
            text:
              "Avant de soumettre des informations via une fonctionnalité d'avis public, veuillez vous demander si vous êtes à l'aise avec le fait que ces informations soient accessibles à d'autres visiteurs du site web.",
          },
          {
            type: "p",
            text:
              "Si vous soumettez des informations pour un affichage public, vous comprenez que d'autres personnes peuvent être en mesure de les consulter, de les copier ou de les partager.",
          },
        ],
      },
      {
        id: "data-transfers",
        title: "Transferts de données",
        body: [
          {
            type: "p",
            text:
              "Certains de nos prestataires de services tiers peuvent traiter ou stocker des informations sur des serveurs situés en dehors du Maroc ou en dehors de votre pays de résidence.",
          },
          {
            type: "p",
            text:
              "Lorsque des informations personnelles sont transférées à l'international, Nagriva s'efforcera d'utiliser des garanties appropriées et de se conformer aux exigences applicables en matière de protection des données.",
          },
          {
            type: "p",
            text:
              "L'emplacement et les prestataires utilisés pour traiter les informations peuvent évoluer à mesure que notre infrastructure technologique se développe.",
          },
        ],
      },
      {
        id: "childrens-privacy",
        title: "Confidentialité des enfants",
        body: [
          {
            type: "p",
            text:
              "Notre site web et nos services ne sont pas intentionnellement destinés aux enfants.",
          },
          {
            type: "p",
            text:
              "Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants via notre site web.",
          },
          {
            type: "p",
            text:
              "Si vous pensez qu'un enfant nous a fourni des informations personnelles sans autorisation appropriée, veuillez nous contacter afin que nous puissions examiner la situation et prendre les mesures appropriées.",
          },
        ],
      },
      {
        id: "third-party-websites",
        title: "Sites web tiers",
        body: [
          {
            type: "p",
            text:
              "Notre site web peut contenir des liens vers des sites web, des plateformes ou des services exploités par des tiers.",
          },
          {
            type: "p",
            text:
              "Nous ne sommes pas responsables des pratiques, contenus, sécurité ou politiques de confidentialité des sites web tiers. Nous vous encourageons à consulter les politiques de confidentialité de tout site web tiers que vous visitez via un lien sur notre site web.",
          },
        ],
      },
      {
        id: "changes-to-this-privacy-policy",
        title: "Modification de la présente Politique de Confidentialité",
        body: [
          {
            type: "p",
            text:
              "Nous pouvons mettre à jour la présente Politique de Confidentialité de temps à autre pour refléter les changements apportés à nos services, à notre technologie, aux exigences légales ou à nos pratiques en matière de confidentialité.",
          },
          {
            type: "p",
            text:
              "Lorsque nous apportons des modifications, nous mettrons à jour la date de dernière mise à jour en haut de cette page.",
          },
          {
            type: "p",
            text:
              "Nous vous encourageons à consulter périodiquement la présente Politique de Confidentialité pour rester informé de la manière dont nous traitons les informations personnelles.",
          },
        ],
      },
      {
        id: "contact-us",
        title: "Contactez-nous",
        body: [
          {
            type: "p",
            text:
              "Si vous avez des questions concernant la présente Politique de Confidentialité, souhaitez exercer un droit en matière de confidentialité ou pensez que vos informations personnelles ont été traitées de manière inappropriée, veuillez nous contacter :",
          },
          {
            type: "ul",
            items: [
              "E-mail : hello@nagriva.com",
              "Téléphone / WhatsApp : +212 728 427 278",
              "Site web : nagriva.com",
            ],
          },
          {
            type: "p",
            text:
              "Nous examinerons votre demande et y répondrons dans un délai raisonnable, sous réserve des exigences légales applicables.",
          },
        ],
      },
      {
        id: "applicable-privacy-law",
        title: "Loi applicable en matière de confidentialité",
        body: [
          {
            type: "p",
            text:
              "Nagriva vise à traiter les informations personnelles conformément aux lois applicables en matière de protection des données et de confidentialité.",
          },
          {
            type: "p",
            text:
              "Pour les utilisateurs et les activités de traitement soumis aux exigences marocaines en matière de protection des données, cela peut inclure la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et les exigences applicables de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP).",
          },
          {
            type: "p",
            text:
              "Lorsque d'autres lois relatives à la confidentialité s'appliquent en fonction de la localisation d'un utilisateur ou de la nature d'une activité de traitement particulière, des droits ou exigences supplémentaires peuvent s'appliquer.",
          },
        ],
      },
    ],
  },
  ar: {
    hero: { title: "سياسة الخصوصية", date: "تاريخ السريان: 1 سبتمبر 2026" },
    tocLabel: "محتويات الصفحة",
    sections: [
      {
        id: "introduction",
        title: "مقدمة",
        body: [
          {
            type: "p",
            text:
              "مرحباً بكم في ناغريفا (Nagriva). نحترم خصوصيتكم ونلتزم بحماية المعلومات الشخصية التي تشاركونها معنا. توضح سياسة الخصوصية هذه كيف تقوم ناغريفا بجمع معلوماتكم واستخدامها وتخزينها وحمايتها عند زيارتكم لموقعنا الإلكتروني أو التواصل معنا أو طلب خدمة أو تقديم ملاحظات أو التفاعل بأي طريقة أخرى مع موقعنا وخدماتنا.",
          },
          {
            type: "p",
            text:
              "باستخدامكم موقعنا الإلكتروني، فإنكم تقرّون بأنكم قد قرأتم وفهمتم سياسة الخصوصية هذه.",
          },
        ],
      },
      {
        id: "who-we-are",
        title: "من نحن",
        body: [
          {
            type: "p",
            text:
              "ناغريفا علامة رقمية تقدم خدمات تصميم وتطوير المواقع الإلكترونية والخدمات الرقمية المرتبطة بها.",
          },
          {
            type: "p",
            text:
              "تُستخدم ناغريفا حالياً كاسم تجاري. وحيثما ينطبق ذلك، قد يتم تحديد الكيان القانوني المسؤول عن معالجة البيانات الشخصية بشكل منفصل في وثائقنا القانونية أو التعاقدية.",
          },
          {
            type: "p",
            text:
              "لأي أسئلة أو طلبات تتعلق بالخصوصية، يمكنكم التواصل معنا باستخدام بيانات الاتصال الواردة في نهاية سياسة الخصوصية هذه.",
          },
        ],
      },
      {
        id: "information-we-collect",
        title: "المعلومات التي نجمعها",
        body: [
          {
            type: "p",
            text:
              "قد نجمع أنواعاً مختلفة من المعلومات اعتماداً على طريقة تفاعلكم مع ناغريفا.",
          },
          { type: "h3", text: "المعلومات التي تقدمونها مباشرة" },
          {
            type: "p",
            text:
              "عندما تتواصلون معنا أو تطلبون العمل مع ناغريفا، قد نجمع معلومات مثل:",
          },
          {
            type: "ul",
            items: [
              "الاسم الكامل",
              "البريد الإلكتروني",
              "رقم الهاتف أو رقم واتساب",
              "نوع الخدمة التي تهتمون بها",
              "وصف الموقع الإلكتروني أو المشروع الرقمي الذي ترغبون في أن ننشئه أو نعدّله",
              "الرسائل والمتطلبات والأسئلة أو أي معلومات أخرى تختارون تقديمها",
            ],
          },
          {
            type: "p",
            text:
              "على سبيل المثال، عند استخدامكم لنماذج التواصل أو نموذج البدء مع ناغريفا، قد نطلب معلومات ضرورية لفهم مشروعكم والرد على طلبكم.",
          },
          { type: "h3", text: "معلومات الملاحظات" },
          {
            type: "p",
            text:
              "قد تسمح ناغريفا للزوار والعملاء بترك ملاحظات حول تجربتهم. ونظراً لأن الملاحظات المقدمة عبر موقعنا قد يتم عرضها علناً، فإن المعلومات التي تتضمنونها طوعاً في ملاحظاتكم قد تصبح متاحة للجمهور.",
          },
          {
            type: "p",
            text:
              "قد يشمل ذلك اسمكم أو منصبكم أو اسم شركتكم أو ملاحظاتكم أو شهادتكم وأي معلومات أخرى تختارون نشرها طوعاً.",
          },
          {
            type: "p",
            text:
              "يُرجى عدم تضمين معلومات شخصية حساسة أو سرية أو غير ضرورية في الملاحظات الظاهرة علناً.",
          },
          { type: "h3", text: "معلومات الأعمال والعملاء" },
          {
            type: "p",
            text:
              "كجزء من أعمالنا، قد تعرض ناغريفا مشاريع أُنجزت للعملاء. اعتماداً على المشروع واتفاقنا مع العميل، قد يتضمن العرض ما يلي:",
          },
          {
            type: "ul",
            items: [
              "اسم العميل أو الشركة",
              "اسم العلامة التجارية",
              "وصف المشروع",
              "عنوان الموقع الإلكتروني أو المشروع",
              "لقطات شاشة أو تمثيلات مرئية للمشروع المُنجز",
              "معلومات أخرى مرتبطة بالمشروع ومناسبة لعرض أعمالنا",
            ],
          },
          { type: "h3", text: "الصور الشخصية" },
          {
            type: "p",
            text:
              "إذا كنا نرغب في عرض صورة شخصية لعميل أو مؤسس أو عضو فريق أو أي فرد آخر يمكن التعرف عليه كجزء من مشروع من أعمالنا، فسنطلب الإذن المناسب قبل نشر الصورة.",
          },
          { type: "h3", text: "المعلومات التي تُجمع تلقائياً" },
          {
            type: "p",
            text:
              "مع تطور موقعنا الإلكتروني وبنيتنا التحتية للتحليلات، قد نجمع تلقائياً بعض المعلومات التقنية ومعلومات الاستخدام، مثل:",
          },
          {
            type: "ul",
            items: [
              "عنوان IP أو الموقع التقريبي",
              "نوع المتصفح وإصداره",
              "نوع الجهاز ونظام التشغيل",
              "الصفحات التي تمت زيارتها واستخدام الموقع الإلكتروني العام",
              "الموقع الإلكتروني أو المصدر المُحيل",
              "تاريخ ووقت الزيارات",
            ],
          },
        ],
      },
      {
        id: "how-we-use-your-information",
        title: "كيف نستخدم معلوماتكم",
        body: [
          {
            type: "p",
            text: "قد نستخدم المعلومات التي نجمعها لأغراض تشمل:",
          },
          {
            type: "ul",
            items: [
              "الرد على الاستفسارات: للرد على رسائلكم وأسئلتكم وطلبات المشاريع.",
              "فهم مشروعكم: لفهم متطلباتكم وتحديد كيفية مساعدتكم.",
              "تقديم خدماتنا: لإعداد المقترحات والتواصل بشأن المشاريع وتقديم خدمات تصميم وتطوير المواقع والخدمات المرتبطة بها.",
              "إدارة علاقات العملاء: للاحتفاظ بسجلات مناسبة للمشاريع والاتصالات.",
              "تحسين موقعنا الإلكتروني: لفهم كيفية استخدام الزوار لموقعنا وتحسين بنيته ومحتواه وأدائه.",
              "الأمان: لكشف ومنع إساءة الاستخدام والاحتيال والبريد المزعج والوصول غير المصرح به وغيره من التهديدات الأمنية.",
              "الأعمال والشهادات: لعرض معلومات المشاريع المعتمدة والملاحظات المقدمة علناً.",
              "التسويق: حيثما يُسمح بذلك وحيثما يكون الموافقة المناسبة أو أساس قانوني آخر مطلوباً، لإرسال اتصالات تسويقية وقياس فعالية حملاتنا.",
              "الامتثال القانوني: للامتثال للالتزامات القانونية المطبقة وحماية مصالحنا المشروعة.",
            ],
          },
          {
            type: "p",
            text: "نحن لا نبيع معلوماتكم الشخصية لأطراف ثالثة.",
          },
        ],
      },
      {
        id: "legal-basis-for-processing",
        title: "الأساس القانوني للمعالجة",
        body: [
          {
            type: "p",
            text:
              "حيثما ينطبق ذلك، تعالج ناغريفا المعلومات الشخصية على أساس واحد أو أكثر مما يلي:",
          },
          {
            type: "ul",
            items: [
              "موافقتكم",
              "الحاجة إلى الرد على طلب قدمتموه",
              "تنفيذ أو التحضير لعلاقة تعاقدية",
              "مصالحنا التجارية المشروعة، حيثما تسمح القوانين المطبقة",
              "الامتثال للالتزامات القانونية",
            ],
          },
          {
            type: "p",
            text: "إذا كانت المعالجة تستند إلى موافقتكم، فيمكنكم سحب هذه الموافقة حيثما ينطبق ذلك.",
          },
        ],
      },
      {
        id: "how-we-store-and-protect-your-information",
        title: "كيف نخزن معلوماتكم ونحميها",
        body: [
          {
            type: "p",
            text:
              "نتخذ تدابير تقنية وتنظيمية معقولة لحماية المعلومات الشخصية من الوصول غير المصرح به والفقدان وسوء الاستخدام والتغيير أو الإفصاح.",
          },
          {
            type: "p",
            text:
              "قد يتم تخزين المعلومات المقدمة عبر موقعنا الإلكتروني باستخدام بنية تحتية ومزودي خدمات تابعين لجهات خارجية، بما في ذلك سوبابيس (Supabase)، اعتماداً على الوظيفة المستخدمة.",
          },
          {
            type: "p",
            text:
              "لا توجد طريقة نقل أو تخزين إلكتروني آمنة تماماً. وعلى الرغم من أننا نتخذ خطوات معقولة لحماية معلوماتكم، فإننا لا نستطيع ضمان أمان مطلق.",
          },
        ],
      },
      {
        id: "third-party-services",
        title: "خدمات الأطراف الثالثة",
        body: [
          {
            type: "p",
            text:
              "قد تستخدم ناغريفا خدمات تابعة لأطراف ثالثة لتشغيل موقعنا الإلكتروني واتصالاتنا وتأمينها وتحليلها وتحسينها. وقد تتغير الخدمات التي نستخدمها بمرور الوقت مع تطور بنيتنا التحتية التقنية.",
          },
          { type: "h3", text: "سوبابيس (Supabase)" },
          {
            type: "p",
            text:
              "قد نستخدم سوبابيس لتخزين وإدارة المعلومات المقدمة عبر موقعنا الإلكتروني، مثل طلبات التواصل واستفسارات المشاريع والملاحظات أو بيانات التطبيقات الأخرى.",
          },
          { type: "h3", text: "جوجل أناليتكس (Google Analytics)" },
          {
            type: "p",
            text:
              "قد نستخدم جوجل أناليتكس لفهم كيفية تفاعل الزوار مع موقعنا الإلكتروني، بما في ذلك حركة المرور والصفحات المعروضة وأنماط الاستخدام العامة وأداء الموقع.",
          },
          { type: "h3", text: "جوجل تاغ مانجر (Google Tag Manager)" },
          {
            type: "p",
            text:
              "قد نستخدم جوجل تاغ مانجر لإدارة العلامات وتقنيات التتبع في موقعنا الإلكتروني.",
          },
          { type: "h3", text: "ميتا بيكسل (Meta Pixel)" },
          {
            type: "p",
            text:
              "قد نستخدم ميتا بيكسل أو تقنيات مشابهة لقياس أداء الإعلانات وفهم التفاعلات مع موقعنا الإلكتروني ودعم أنشطة الإعلان وإعادة الاستهداف.",
          },
          { type: "h3", text: "مزودو خدمات البريد الإلكتروني" },
          {
            type: "p",
            text:
              "قد نستخدم مزودي خدمات بريد إلكتروني تابعين لأطراف ثالثة لإرسال رسائل المعاملات والردود على التواصل والاتصالات المتعلقة بالمشاريع والنشرات الإخبارية أو رسائل التسويق.",
          },
          {
            type: "p",
            text:
              "قد يعالج المزودون الأطراف الثالثة المعلومات وفقاً لسياسات الخصوصية والشروط الخاصة بهم.",
          },
        ],
      },
      {
        id: "cookies-and-tracking-technologies",
        title: "ملفات تعريف الارتباط وتقنيات التتبع",
        body: [
          {
            type: "p",
            text:
              "قد تستخدم ناغريفا ملفات تعريف الارتباط والبكسلات والعلامات والنصوص البرمجية والتقنيات المشابهة لتشغيل الموقع الإلكتروني وتحسينه.",
          },
          { type: "h3", text: "كيف قد نستخدم هذه التقنيات" },
          {
            type: "ul",
            items: [
              "الوظائف الأساسية للموقع الإلكتروني",
              "الأمان",
              "تذكر التفضيلات",
              "تحليلات الموقع الإلكتروني",
              "فهم سلوك الزوار",
              "قياس الحملات التسويقية",
              "الإعلان وإعادة الاستهداف",
            ],
          },
          { type: "h3", text: "إدارة ملفات تعريف الارتباط" },
          {
            type: "p",
            text:
              "قد تتمكنون من التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح أو من خلال أدوات التحكم في الخصوصية المتوفرة على موقعنا الإلكتروني.",
          },
          {
            type: "p",
            text:
              "حيثما تتطلب القوانين المطبقة ذلك، سنطلب موافقتكم قبل استخدام ملفات تعريف الارتباط غير الأساسية أو تقنيات التتبع.",
          },
        ],
      },
      {
        id: "marketing-communications",
        title: "الاتصالات التسويقية",
        body: [
          {
            type: "p",
            text:
              "قد تقدم ناغريفا النشرات الإخبارية أو رسائل البريد الإلكتروني الترويجية أو التحديثات أو غيرها من الاتصالات التسويقية.",
          },
          {
            type: "p",
            text:
              "حيثما يلزم ذلك، سنحصل على الموافقة المناسبة قبل إرسال الاتصالات التسويقية.",
          },
          {
            type: "p",
            text:
              "يمكنكم إلغاء الاشتراك في رسائل البريد الإلكتروني التسويقية في أي وقت باستخدام آلية إلغاء الاشتراك المرفقة في الاتصال أو بالتواصل معنا مباشرة.",
          },
          {
            type: "p",
            text:
              "إلغاء الاشتراك في الاتصالات التسويقية لن يمنعنا بالضرورة من إرسال اتصالات مهمة متعلقة بالخدمات أو اتصالات تتعلق بالمعاملات.",
          },
        ],
      },
      {
        id: "data-retention",
        title: "كم من الوقت نحتفظ بمعلوماتكم",
        body: [
          {
            type: "p",
            text:
              "نحتفظ بالمعلومات الشخصية فقط للمدة الضرورية بشكل معقول للأغراض الموضحة في سياسة الخصوصية هذه، بما في ذلك:",
          },
          {
            type: "ul",
            items: [
              "الرد على الاستفسارات وإدارتها",
              "تقديم خدماتنا",
              "الاحتفاظ بسجلات الأعمال والمشاريع",
              "معالجة النزاعات",
              "الامتثال للالتزامات القانونية",
              "حماية مصالحنا المشروعة",
            ],
          },
          {
            type: "p",
            text:
              "قد تختلف فترة الاحتفاظ الدقيقة حسب نوع المعلومات والغرض الذي جُمعت من أجله.",
          },
          {
            type: "p",
            text:
              "عندما لا تكون المعلومات ضرورية بشكل معقول بعد الآن، قد نقوم بحذفها أو إخفاء هويتها أو التخلص منها بشكل آمن، مع مراعاة المتطلبات القانونية أو التعاقدية المطبقة.",
          },
        ],
      },
      {
        id: "your-privacy-rights",
        title: "حقوقكم في الخصوصية",
        body: [
          {
            type: "p",
            text:
              "اعتماداً على القانون المطبق، قد تكون لديكم حقوق تتعلق بمعلوماتكم الشخصية، بما في ذلك الحق في:",
          },
          {
            type: "ul",
            items: [
              "الوصول: طلب الوصول إلى المعلومات الشخصية التي نحتفظ بها عنكم.",
              "التصحيح: طلب تصحيح المعلومات غير الدقيقة أو غير الكاملة.",
              "الحذف: طلب حذف معلوماتكم الشخصية حيثما ينطبق ذلك.",
              "الاعتراض: الاعتراض على بعض أنشطة المعالجة.",
              "التقييد: طلب تقييد بعض أنشطة المعالجة حيثما ينطبق ذلك.",
              "سحب الموافقة: سحب الموافقة عندما تستند المعالجة إلى موافقتكم.",
            ],
          },
          {
            type: "p",
            text:
              "لممارسة حق من حقوق الخصوصية، يرجى التواصل معنا باستخدام المعلومات الواردة في قسم تواصل معنا أدناه.",
          },
          {
            type: "p",
            text:
              "قد نحتاج إلى التحقق من هويتكم قبل معالجة بعض الطلبات من أجل حماية معلوماتكم من الوصول غير المصرح به.",
          },
        ],
      },
      {
        id: "publicly-available-information",
        title: "المعلومات المتاحة للجمهور",
        body: [
          {
            type: "p",
            text:
              "بعض المعلومات المقدمة من خلال ميزات معينة في موقعنا الإلكتروني قد تكون متاحة للجمهور عمداً.",
          },
          {
            type: "p",
            text:
              "وينطبق هذا بشكل خاص على الملاحظات أو الشهادات أو المعلومات المتعلقة بالأعمال.",
          },
          {
            type: "p",
            text:
              "قبل تقديم المعلومات من خلال ميزة ملاحظات عامة، يرجى التفكير فيما إذا كنتم مرتاحين لإمكانية وصول زوار آخرين للموقع إلى هذه المعلومات.",
          },
          {
            type: "p",
            text:
              "إذا قمتم بتقديم معلومات للعرض العام، فأنتم تتفهمون أن أشخاصاً آخرين قد يتمكنون من الاطلاع عليها أو نسخها أو مشاركتها.",
          },
        ],
      },
      {
        id: "data-transfers",
        title: "نقل البيانات",
        body: [
          {
            type: "p",
            text:
              "قد يقوم بعض مزودي الخدمات التابعين لنا بمعالجة أو تخزين المعلومات على خوادم تقع خارج المغرب أو خارج بلد إقامتكم.",
          },
          {
            type: "p",
            text:
              "عندما يتم نقل المعلومات الشخصية دولياً، ستسعى ناغريفا إلى استخدام ضمانات مناسبة والامتثال لمتطلبات حماية البيانات المطبقة.",
          },
          {
            type: "p",
            text:
              "قد يتغير الموقع والمزودون المستخدمون لمعالجة المعلومات مع تطور بنيتنا التحتية التقنية.",
          },
        ],
      },
      {
        id: "childrens-privacy",
        title: "خصوصية الأطفال",
        body: [
          {
            type: "p",
            text: "موقعنا الإلكتروني وخدماتنا ليست موجهة عمداً إلى الأطفال.",
          },
          {
            type: "p",
            text:
              "نحن لا نجمع عن علم معلومات شخصية من الأطفال عبر موقعنا الإلكتروني.",
          },
          {
            type: "p",
            text:
              "إذا كنتم تعتقدون أن طفلاً قد قدم لنا معلومات شخصية دون إذن مناسب، فيرجى التواصل معنا حتى نتمكن من مراجعة الموقف واتخاذ الإجراء المناسب.",
          },
        ],
      },
      {
        id: "third-party-websites",
        title: "مواقع الأطراف الثالثة",
        body: [
          {
            type: "p",
            text:
              "قد يحتوي موقعنا الإلكتروني على روابط لمواقع أو منصات أو خدمات يديرها أطراف ثالثة.",
          },
          {
            type: "p",
            text:
              "نحن لسنا مسؤولين عن ممارسات الخصوصية أو المحتوى أو الأمان أو سياسات مواقع الأطراف الثالثة. نشجعكم على مراجعة سياسات الخصوصية لأي موقع تابع لطرف ثالث تزورونه عبر رابط على موقعنا الإلكتروني.",
          },
        ],
      },
      {
        id: "changes-to-this-privacy-policy",
        title: "التغييرات على سياسة الخصوصية هذه",
        body: [
          {
            type: "p",
            text:
              "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في خدماتنا أو تقنيتنا أو المتطلبات القانونية أو ممارسات الخصوصية لدينا.",
          },
          {
            type: "p",
            text:
              "عندما نجري تغييرات، سنقوم بتحديث تاريخ آخر تحديث في أعلى هذه الصفحة.",
          },
          {
            type: "p",
            text:
              "نشجعكم على مراجعة سياسة الخصوصية هذه بشكل دوري للبقاء على اطلاع حول كيفية تعاملنا مع المعلومات الشخصية.",
          },
        ],
      },
      {
        id: "contact-us",
        title: "تواصل معنا",
        body: [
          {
            type: "p",
            text:
              "إذا كانت لديكم أسئلة حول سياسة الخصوصية هذه، أو ترغبون في ممارسة حق من حقوق الخصوصية، أو تعتقدون أن معلوماتكم الشخصية قد عولجت بشكل غير مناسب، فيرجى التواصل معنا:",
          },
          {
            type: "ul",
            items: [
              "البريد الإلكتروني: hello@nagriva.com",
              "الهاتف / واتساب: +212 728 427 278",
              "الموقع الإلكتروني: nagriva.com",
            ],
          },
          {
            type: "p",
            text:
              "سنقوم بمراجعة طلبكم والرد عليه خلال فترة زمنية معقولة، مع مراعاة المتطلبات القانونية المطبقة.",
          },
        ],
      },
      {
        id: "applicable-privacy-law",
        title: "قانون الخصوصية المطبق",
        body: [
          {
            type: "p",
            text:
              "تهدف ناغريفا إلى التعامل مع المعلومات الشخصية وفقاً لقوانين حماية البيانات والخصوصية المطبقة.",
          },
          {
            type: "p",
            text:
              "بالنسبة للمستخدمين وأنشطة المعالجة الخاضعة لمتطلبات حماية البيانات المغربية، قد يشمل ذلك القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الطبيعيين فيما يتعلق بمعالجة البيانات ذات الطابع الشخصي والمتطلبات المطبقة للجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).",
          },
          {
            type: "p",
            text:
              "حيثما تنطبق قوانين خصوصية أخرى بناءً على موقع المستخدم أو طبيعة نشاط معالجة معين، فقد تنطبق حقوق أو متطلبات إضافية.",
          },
        ],
      },
    ],
  },
};

const SECTION_IDS = [
  "introduction",
  "who-we-are",
  "information-we-collect",
  "how-we-use-your-information",
  "legal-basis-for-processing",
  "how-we-store-and-protect-your-information",
  "third-party-services",
  "cookies-and-tracking-technologies",
  "marketing-communications",
  "data-retention",
  "your-privacy-rights",
  "publicly-available-information",
  "data-transfers",
  "childrens-privacy",
  "third-party-websites",
  "changes-to-this-privacy-policy",
  "contact-us",
  "applicable-privacy-law",
];

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANG_KEY);
  if (stored === "en" || stored === "fr" || stored === "ar") return stored;
  return "en";
}

function renderLink(text: string, lang: Lang): ReactNode {
  if (lang === "en") {
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
          <strong>Website:</strong> <a href="#home">nagriva.com</a>
        </>
      );
    }
  }
  if (lang === "fr") {
    if (text === "E-mail : hello@nagriva.com") {
      return (
        <>
          <strong>E-mail :</strong> <a href="mailto:hello@nagriva.com">hello@nagriva.com</a>
        </>
      );
    }
    if (text === "Téléphone / WhatsApp : +212 728 427 278") {
      return (
        <>
          <strong>Téléphone / WhatsApp :</strong>{" "}
          <a href="https://wa.me/212728427278">+212 728 427 278</a>
        </>
      );
    }
    if (text === "Site web : nagriva.com") {
      return (
        <>
          <strong>Site web :</strong> <a href="#home">nagriva.com</a>
        </>
      );
    }
  }
  if (lang === "ar") {
    if (text === "البريد الإلكتروني: hello@nagriva.com") {
      return (
        <>
          <strong>البريد الإلكتروني:</strong>{" "}
          <a href="mailto:hello@nagriva.com">hello@nagriva.com</a>
        </>
      );
    }
    if (text === "الهاتف / واتساب: +212 728 427 278") {
      return (
        <>
          <strong>الهاتف / واتساب:</strong>{" "}
          <a href="https://wa.me/212728427278">+212 728 427 278</a>
        </>
      );
    }
    if (text === "الموقع الإلكتروني: nagriva.com") {
      return (
        <>
          <strong>الموقع الإلكتروني:</strong> <a href="#home">nagriva.com</a>
        </>
      );
    }
  }
  return text;
}

function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const copy = privacyContent[lang];
  const isRtl = lang === "ar";

  const handleLangChange = (next: Lang) => {
    setLang(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    const headings = SECTION_IDS.map((id) => document.getElementById(id)).filter(
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
    <main className="pp-page" dir={isRtl ? "rtl" : "ltr"}>
      <section className="pp-hero" aria-labelledby="pp-hero-title">
        <div className="pp-hero__container">
          <div className="pp-hero__content">
            <h1 id="pp-hero-title">{copy.hero.title}</h1>
            <p className="pp-hero__date">{copy.hero.date}</p>
          </div>
        </div>
        <div className="pp-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <div className="pp-layout">
        <aside className="pp-toc" aria-label={copy.tocLabel}>
          <select
            className="pp-lang"
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as Lang)}
            aria-label="Language"
          >
            {LANGS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>

          <nav>
            <ul className="pp-toc__list">
              {copy.sections.map((section) => (
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
          {copy.sections.map((section) => (
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
                        <li key={j}>{renderLink(item, lang)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
