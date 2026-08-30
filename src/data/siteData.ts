import {faBullseye,faCartShopping,faCode,faWandMagicSparkles,} from "@fortawesome/free-solid-svg-icons";
import post01 from "../assets/postes/post-01.png";
import post02 from "../assets/postes/post-02.png";
import post03 from "../assets/postes/post-03.png";
import step01 from "../assets/steps/step-01.png";
import step02 from "../assets/steps/step-02.png";
import step03 from "../assets/steps/step-03.png";
import figmaLogo from "../assets/aboutimage/barnds/figma.png";
import githubLogo from "../assets/aboutimage/barnds/github.png";
import illustratorLogo from "../assets/aboutimage/barnds/illustrator.png";
import photoshopLogo from "../assets/aboutimage/barnds/photoshop.png";
import vsCodeLogo from "../assets/aboutimage/barnds/Visual Studio Code.png";
import webflowLogo from "../assets/aboutimage/barnds/Webflow.png";
import hichamClient from "../assets/aboutimage/clients/hicham-ait-ali.jpeg";
import saidClient from "../assets/aboutimage/clients/سعيد الخاضيري.jpeg";
import azizClient from "../assets/aboutimage/clients/عزيز لكميري.jpeg";
import mohamedClient from "../assets/aboutimage/clients/محمد ميان.jpeg";
import naimaClient from "../assets/aboutimage/clients/نعيمة الحيان.jpeg";
import conversationImage from "../assets/processimage/messages/Conversation.png";
import directionImage from "../assets/processimage/messages/Direction.png";
import buildImage from "../assets/processimage/messages/Build.png";
import launchImage from "../assets/processimage/messages/Launch.png";
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
];


export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/nagriva", icon: "fa-brands fa-instagram" },
  { label: "facebook", href: "https://www.linkedin.com/company/nagriva", icon: "fa-brands fa-facebook" },
  { label: "youtube", href: "https://github.com/nagriva", icon: "fa-brands fa-youtube" },
  { label: "linkedin", href: "https://github.com/nagriva", icon: "fa-brands fa-linkedin" },
  { label: "GitHub", href: "https://github.com/nagriva", icon: "fa-brands fa-github" },
];

export const services = [
  {
    title: "Website Design & Development",
    description: "Custom websites built with clear structure, strong visuals, and responsive performance.",
    icon: faCode,
    isCore: true,
  },
  {
    title: "E-commerce Websites",
    description: "Online stores designed to present products clearly and make buying simple.",
    icon: faCartShopping,
  },
  {
    title: "Landing Pages",
    description: "Focused pages for campaigns, launches, and offers that need a clear action.",
    icon: faBullseye,
  },
  {
    title: "Brand & Digital Experience",
    description: "Visual direction and digital presentation that make your brand feel consistent online.",
    icon: faWandMagicSparkles,
  },
];

export const featuredProjects = [
  {
    title: "Amare Website",
    type: "Client Work · Website Design",
     filterCategories: ["Websites"],
    categories: ["Websites"],
    visual: "amare",
    image: post02,
    clientName: "Amare",
    clientInitial: "A",
    description:
      "A fast, mobile-responsive website built to help the business engage online.",
    result:
      "Responsive experience aligned with the client requirements.",
    link: "https://www.amare.ma/",
  },

  {
    title: "Association AMNA Website",
    type: "Concept Project · E-commerce",
    categories: ["Websites"],
     filterCategories: ["Websites"],
    visual: "amna",
    image: post02,
    clientName: "Association AMNA",
    clientInitial: "A",
    description:
      "An e-commerce concept designed to present products clearly and create a simple browsing experience.",
    result:
      "A focused digital experience built around clarity and easy navigation.",
    link: "https://www.associationamna.com/",
  },

  {
    title: "BCT AGENCY Website",
    type: "Client Work · Website Design",
    categories: ["Websites"],
     filterCategories: ["Websites"],
    visual: "bct",
    image: post03,
    clientName: "BCT AGENCY",
    clientInitial: "B",
    description:
      "A professional website designed to present the agency clearly and strengthen its online presence.",
    result:
      "A clean responsive experience aligned with the agency's visual direction.",
    link: "https://agence-bct.com/",
  },
];

export const portfolioProjects = [
  {
    title: "Maison Lumiere",
    type: "Website Design · Client Work",
    filterCategories: ["Websites"],
    categories: ["Websites", "E-commerce"],
    visual: "lumiere",
    image: post01,
    clientName: "Maison Lumiere",
    clientInitial: "M",
    description:
      "An editorial e-commerce experience for a contemporary lighting studio, built around product clarity and atmosphere.",
    result:
      "A refined storefront that frames each piece and makes browsing feel considered.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Northwind Brewing Co.",
    type: "Brand & Digital Experience",
    filterCategories: ["Brand"],
    categories: ["Brand", "Digital Experience"],
    visual: "northwind",
    image: post02,
    clientName: "Northwind Brewing",
    clientInitial: "A",
    description:
      "A bold, tactile brand and website for a small craft brewer, with strong typography and an honest voice.",
    result:
      "A distinctive online presence that stands out in a crowded independent scene.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Studio Kinship",
    type: "Website Design",
    filterCategories: ["Websites"],
    categories: ["Websites"],
    visual: "kinship",
    image: post01,
    clientName: "Studio Kinship",
    clientInitial: "K",
    description:
      "A calm, precisely structured site for an architecture studio, letting the work lead without noise.",
    result:
      "A professional portfolio where every project is presented with space and intention.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Field & Form",
    type: "E-commerce · Website Design",
    filterCategories: ["E-commerce"],
    categories: ["E-commerce"],
    visual: "field",
    image: post01,
    clientName: "Field & Form",
    clientInitial: "F",
    description:
      "A simple, product-forward store for a homeware brand, engineered for easy browsing and checkout.",
    result:
      "A responsive buying experience that keeps customers focused on the products.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Atelier Nodia",
    type: "Brand & Digital Experience",
    filterCategories: ["Brand"],
    categories: ["Brand", "Digital Experience"],
    visual: "nodia",
    image: post01,
    clientName: "Atelier Nodia",
    clientInitial: "N",
    description:
      "Naming and digital direction for an independent fashion atelier with a considered, editorial feel.",
    result:
      "A cohesive identity that carries from campaign to website seamlessly.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Harbor & Co.",
    type: "Landing Pages",
    filterCategories: ["Landing"],
    categories: ["Landing Pages"],
    visual: "harbor",
    image: post01,
    clientName: "Harbor & Co.",
    clientInitial: "H",
    description:
      "A high-converting launch page for a coastal real estate group, built around one clear action.",
    result:
      "A focused campaign page that turns attention into enquiries.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Verdant Produce",
    type: "E-commerce · Website Design",
    filterCategories: ["E-commerce"],
    categories: ["E-commerce"],
    visual: "verdant",
    image: post01,
    clientName: "Verdant Produce",
    clientInitial: "V",
    description:
      "A fresh, seasonal store for an organic produce supplier with a clean and appetising layout.",
    result:
      "A friendly shopping experience that reflects the brand's natural character.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Cobalt Finance",
    type: "Website Design · Client Work",
    filterCategories: ["Websites"],
    categories: ["Websites"],
    visual: "cobalt",
    image: post01,
    clientName: "Cobalt Finance",
    clientInitial: "C",
    description:
      "A trustworthy, structured website for a financial consultancy, prioritising credibility and clarity.",
    result:
      "A corporate site that communicates confidence through clean hierarchy.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Paper Trails",
    type: "Landing Pages · Brand",
    filterCategories: ["Landing"],
    categories: ["Landing Pages", "Brand"],
    visual: "tracks",
    image: post01,
    clientName: "Paper Trails",
    clientInitial: "P",
    description:
      "A storytelling landing page for a publishing collective, blending editorial copy with strong imagery.",
    result:
      "An immersive campaign page that keeps readers moving through the story.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Ember Studio",
    type: "Website Design",
    filterCategories: ["Websites"],
    categories: ["Websites"],
    visual: "ember",
    image: post01,
    clientName: "Ember Studio",
    clientInitial: "E",
    description:
      "A warm, minimal website for a ceramic studio, built to showcase craft and process.",
    result:
      "A gentle, image-led experience that mirrors the texture of the work itself.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Lumen Health",
    type: "Digital Experience · Website Design",
    filterCategories: ["Websites"],
    categories: ["Websites", "Digital Experience"],
    visual: "lumen",
    image: post01,
    clientName: "Lumen Health",
    clientInitial: "L",
    description:
      "A calm, reassuring platform for a health clinic, prioritising accessibility and clear information.",
    result:
      "A clear digital experience that puts patient confidence first.",
    linkOne: "#",
    linkTwo: "#",
  },
  {
    title: "Ridge & Board",
    type: "E-commerce · Brand",
    filterCategories: ["E-commerce"],
    categories: ["E-commerce", "Brand"],
    visual: "ridge",
    image: post01,
    clientName: "Ridge & Board",
    clientInitial: "R",
    description:
      "A rugged brand and store for an outdoor gear maker, designed to feel honest and dependable.",
    result:
      "A consistent brand experience across product pages and campaigns.",
    linkOne: "#",
    linkTwo: "#",
  },
];

export const aboutData = {
  hero: {
    eyebrow: "About Nagriva",
    title: "Digital work built with",
    titleAccent: "clarity and intention.",
    description:
      "Nagriva is an independent digital studio designing and building focused websites, e-commerce experiences, and brand identity — for businesses that want to look credible online and perform like it.",
  },
  intro: {
    eyebrow: "Why Nagriva",
    title: "A small studio.",
    titleAccent: "Built around focused work.",
    paragraph:
      "Nagriva started from a simple idea: digital work should be clear, intentional, and human. Design and development should work together in one process, communication should stay direct, and every project should avoid unnecessary complexity. That belief still shapes how the studio works today.",
    founder: "Redouane Ait El-Hadj",
    founderRole: "Founder · Designer & Developer",
    linkOne: "#",
    linkTwo: "#",
  },
  sections: {
    capabilities: {
      eyebrow: "What we do",
      title: "Capabilities",
      intro: "A focused set of skills, delivered to a premium finish every time.",
    },
    tools: {
      eyebrow: "How we work",
      title: "Tools we use",
    },
    clients: {
      eyebrow: "Trusted by",
      title: "Clients & Partners",
      intro: "Brands and businesses Nagriva has built with and helped look serious online.",
    },
  },
  capabilities: [
    {
      title: "Web Design & Development",
      description: "Custom websites with clear structure, strong visuals, and responsive performance.",
    },
    {
      title: "E-commerce",
      description: "Online stores designed to present products clearly and make buying simple.",
    },
    {
      title: "Brand & Digital Experience",
      description: "Visual direction and digital presentation that keep your brand consistent online.",
    },
    {
      title: "Landing Pages",
      description: "Focused pages for campaigns, launches, and offers that need one clear action.",
    },
    {
      title: "UI / UX Design",
      description: "Interfaces built around clarity, hierarchy, and how people move through a page.",
    },
    {
      title: "Webflow & Development",
      description: "Clean builds that stay fast to update and easy to grow with the business.",
    },
  ],
  tools: [
    { name: "Figma", description: "Design, prototyping, and collaboration.", image: figmaLogo },
    { name: "Adobe Illustrator", description: "Identity, logo, and illustration work.", image: illustratorLogo },
    { name: "Adobe Photoshop", description: "Image composition and visual polish.", image: photoshopLogo },
    { name: "GitHub", description: "Version control and clean handovers.", image: githubLogo },
    { name: "VS Code", description: "Our daily environment for the web.", image: vsCodeLogo },
    { name: "Webflow", description: "Visual development for marketing sites.", image: webflowLogo },
  ],
  clients: [
    {
      name: "Hicham Ait Ali",
      image: hichamClient,
      description: "Long-time client who trusted Nagriva with his brand's online presence.",
    },
    {
      name: "Said El Khadir",
      image: saidClient,
      description: "Partnered with us across several focused digital projects.",
    },
    {
      name: "Aziz Lkemiri",
      image: azizClient,
      description: "Arrived through a referral and stayed for the full experience.",
    },
    {
      name: "Mohamed Miyan",
      image: mohamedClient,
      description: "Came with a clear idea and left with a focused, credible site.",
    },
    {
      name: "Naima El Hayan",
      image: naimaClient,
      description: "Trusted Nagriva to bring clarity to her first online store.",
    },
  ],
};

export const processSteps = [
  {
    visual: "direction",
    title: "Share your direction",
    description:
      "Tell us about your business, goals, audience, and the type of website you want to build.",
    image: step01,
  },
  {
    visual: "experience",
    title: "Shape the experience",
    description:
      "We define the structure, visual direction, and content flow before moving into development.",
    image: step02,
  },
  {
    visual: "launch",
    title: "Build and launch",
    description:
      "Your website is built, refined, tested, and prepared for launch with a clean responsive finish.",
    image: step03,
  },
];

export const processWorkflow = [
  {
    number: "01",
    label: "Discover",
    title: "Discover",
    description:
      "Understand the business, goals, audience, and requirements before anything is designed. Every project starts with clarity.",
  },
  {
    number: "02",
    label: "Design & Build",
    title: "Design & Build",
    description:
      "Turn the direction into a clear visual system and a functional digital experience, refined detail by detail.",
  },
  {
    number: "03",
    label: "Launch & Grow",
    title: "Launch & Grow",
    description:
      "Polish, test, and launch a finished experience that is ready to perform and evolve with the business.",
  },
];

export const processApproach = {
  eyebrow: " Our approach",
  statement: "Clear process.",
  statementAccent: "Better digital work.",
  paragraphs: [
    "We believe great digital work comes from a simple process: understand the problem first, stay focused on the scope, and make deliberate decisions at every step. Nothing is designed or built by accident.",
    "Communication stays direct and honest. There are no unnecessary complexities, no inflated roadmaps — just a clear path from the first conversation to a finished experience you can be proud of.",
    "Every project is a direct collaboration. You stay close to the work, and we keep the details moving toward a result that feels intentional and performs like it.",
  ],
};

// Local image assets for each journey stage, wired up when available.
export const processJourneyImages = {
  conversationImage,
  directionImage,
  buildImage,
  launchImage,
};

export const processJourney = [
  {
    number: "01",
    label: "Conversation",
    title: "Start with a conversation",
    description:
      "We start by understanding your business, your goals, and what you actually need.",
    image: processJourneyImages.conversationImage,
  },
  {
    number: "02",
    label: "Direction",
    title: "Find the right direction",
    description:
      "We turn the initial conversation into a clear visual direction before moving into production.",
    image: processJourneyImages.directionImage,
  },
  {
    number: "03",
    label: "Build",
    title: "Design & build",
    description:
      "We bring the direction to life, keeping you involved as the project takes shape.",
    image: processJourneyImages.buildImage,
  },
  {
    number: "04",
    label: "Launch",
    title: "Refine & launch",
    description:
      "We polish the final details, make sure everything works properly, and get your website ready to go live.",
    image: processJourneyImages.launchImage,
  },
];
