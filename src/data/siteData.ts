import {faBullseye,faCartShopping,faCode,faWandMagicSparkles,} from "@fortawesome/free-solid-svg-icons";
import post01 from "../assets/postes/post-01.png";
import post02 from "../assets/postes/post-02.png";
import post03 from "../assets/postes/post-03.png";
import step01 from "../assets/steps/step-01.png";
import step02 from "../assets/steps/step-02.png";
import step03 from "../assets/steps/step-03.png";
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
    image: post01,
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
    image: post01,
    clientName: "Northwind Brewing",
    clientInitial: "N",
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
