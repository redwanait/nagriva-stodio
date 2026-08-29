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

export const portfolioProjects = [
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
