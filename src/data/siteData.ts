import {faBullseye,faCartShopping,faCode,faWandMagicSparkles,} from "@fortawesome/free-solid-svg-icons";
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

import imgAdKeyProd from "../assets/portfolioimages/imgAdKeyProd.webp";
import imgNorthy from "../assets/portfolioimages/imgNorthy.webp";
import imgEconer from "../assets/portfolioimages/imgEconer.webp";
import imgManafie from "../assets/portfolioimages/imgManafie.webp";
import imgMaroc24 from "../assets/portfolioimages/imgMaroc24.webp";
import imgLivingWisdomNow from "../assets/portfolioimages/imgLivingWisdomNow.webp";
import imgKeysLab from "../assets/portfolioimages/imgKeysLab.webp";
import imgOnlyDigital from "../assets/portfolioimages/imgOnlyDigital.webp";
import imgNateCosmetics from "../assets/portfolioimages/imgNateCosmetics.webp";
import imgMa3ridkom from "../assets/portfolioimages/imgMa3ridkom.webp";
import img24hprint from "../assets/portfolioimages/img24hprint.webp";
import imgChidoLed from "../assets/portfolioimages/imgChidoLed.webp";
import imgAifdspa from "../assets/portfolioimages/imgAifdspa.webp";
import imgGozibra from "../assets/portfolioimages/imgGozibra.webp";
import imgSmartPanel from "../assets/portfolioimages/imgSmartPanel.webp";
import imgNordPremiumGardiennage from "../assets/portfolioimages/imgNordPremiumGardiennage.webp";
import imgEdigitaal from "../assets/portfolioimages/imgEdigitaal.webp";
import imgWakune from "../assets/portfolioimages/imgWakune.webp";

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
];


export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/nagriva", icon: "fa-brands fa-instagram" },
  { label: "facebook", href: "https://www.linkedin.com/company/nagriva", icon: "fa-brands fa-facebook" },
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
  title: "Econer official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Corporate"],
  visual: "Econer",
  image: imgEconer,
  clientName: "Partnership with Econer",
  clientInitial: "E",
  description:
    "A modern corporate website for an energy and engineering company, designed to communicate its expertise, solutions, and commitment to sustainable development.",
  result:
    "A professional digital presence that presents Econer's expertise and solutions with clarity, credibility, and a modern visual direction.",
  linkOne: "#start",
  websiteUrl: "https://www.econer.ma/",
},
  {
  title: "AdKey Prod official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Corporate"],
  visual: "AdKey Prod",
  image: imgAdKeyProd,
  clientName: "Partnership with AdKey Prod",
  clientInitial: "A",
  description:
    "A cinematic corporate website for a Moroccan video production agency, designed to showcase its productions, services, and nationwide expertise.",
  result:
    "A polished digital presence that puts AdKey Prod’s portfolio and production capabilities at the center.",
  linkOne: "#start",
  websiteUrl: "https://www.adkeyprod.ma/",
},
{
  title: "Northy official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Travel"],
  visual: "Northy",
  image: imgNorthy,
  clientName: "Partnership with Northy",
  clientInitial: "N",
  description:
    "A premium travel and transport website designed to showcase Northy's tours, private transfers, chauffeur services, and VIP experiences across northern Morocco.",
  result:
    "A polished travel platform that makes discovering services, destinations, and booking options feel clear and effortless.",
  linkOne: "#start",
  websiteUrl: "https://www.northy.ma/",
},
{
  title: "Manafie official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Corporate"],
  visual: "Manafie",
  image: imgManafie,
  clientName: "Partnership with Manafie",
  clientInitial: "M",
  description:
    "A professional corporate website for Manafie, designed to present its services, expertise, and business offering through a clear and structured digital experience.",
  result:
    "A credible online presence that makes Manafie's services easier to understand while giving the brand a polished and professional identity.",
  linkOne: "#start",
  websiteUrl: "https://www.manafie.ma/",
},
{
  title: "Maroc24 official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites News & Media"],
  visual: "Maroc24",
  image: imgMaroc24,
  clientName: "Partnership with Maroc24",
  clientInitial: "M",
  description:
    "A dynamic digital news platform designed to deliver Moroccan and international news through a clear, fast, and content-focused editorial experience.",
  result:
    "A structured media experience that makes discovering breaking news, stories, and editorial content feel direct and effortless.",
  linkOne: "#start",
  websiteUrl: "https://www.maroc24.com/",
},
{
  title: "Living Wisdom Now official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Wellness"],
  visual: "Living Wisdom Now",
  image: imgLivingWisdomNow,
  clientName: "Partnership with Living Wisdom Now",
  clientInitial: "L",
  description:
    "A thoughtful wellness and personal growth website created to share wisdom, guidance, and transformative resources through a calm and accessible digital experience.",
  result:
    "A warm digital space that makes exploring teachings, resources, and personal development content feel intuitive and engaging.",
  linkOne: "#start",
  websiteUrl: "https://livingwisdomnow.com/",
},
{
  title: "KeysLab official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Technology"],
  visual: "KeysLab",
  image: imgKeysLab,
  clientName: "Partnership with KeysLab",
  clientInitial: "K",
  description:
    "A modern technology-focused website designed to present KeysLab's digital solutions, expertise, and services through a clear and contemporary experience.",
  result:
    "A polished digital presence that communicates KeysLab's capabilities with clarity while creating a strong and credible first impression.",
  linkOne: "#start",
  websiteUrl: "https://keyslab.ma/",
},
{
  title: "Only Digital official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Agency"],
  visual: "Only Digital",
  image: imgOnlyDigital,
  clientName: "Partnership with Only Digital",
  clientInitial: "O",
  description:
    "A modern digital agency website designed to showcase Only Digital's services, expertise, and creative approach through a bold and engaging online experience.",
  result:
    "A distinctive digital presence that communicates the agency's capabilities while making its services and value proposition easy to explore.",
  linkOne: "#start",
  websiteUrl: "https://onlydigital.ma/",
},
{
  title: "Nate Cosmetics official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites E-commerce"],
  visual: "Nate Cosmetics",
  image: imgNateCosmetics,
  clientName: "Partnership with Nate Cosmetics",
  clientInitial: "N",
  description:
    "A beauty-focused e-commerce website showcasing cosmetics, skincare, haircare, and natural wellness products through a clean and accessible shopping experience.",
  result:
    "A complete online storefront that makes discovering products, exploring categories, and placing orders simple and convenient.",
  linkOne: "#start",
  websiteUrl: "https://natecosmetics.ma/",
},
{
  title: "Ma3ridkom official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites E-commerce"],
  visual: "Ma3ridkom",
  image: imgMa3ridkom,
  clientName: "Partnership with Ma3ridkom",
  clientInitial: "M",
  description:
    "A multi-category e-commerce platform offering a wide range of products across electronics, home appliances, fashion, beauty, accessories, and everyday essentials.",
  result:
    "A versatile online marketplace that makes browsing, discovering, and purchasing products across multiple categories simple and convenient.",
  linkOne: "#start",
  websiteUrl: "https://ma3ridkom.com/",
},
{
  title: "24hprint official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites E-commerce"],
  visual: "24hprint",
  image: img24hprint,
  clientName: "Partnership with 24hprint",
  clientInitial: "2",
  description:
    "An online printing e-commerce platform offering custom printing products, packaging, promotional materials, and business solutions with nationwide delivery in Morocco.",
  result:
    "A complete online ordering experience that makes configuring, pricing, and purchasing custom print products simple and efficient.",
  linkOne: "#start",
  websiteUrl: "https://www.24hprint.ma/",
},
{
  title: "Chido LED official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Corporate"],
  visual: "Chido LED",
  image: imgChidoLed,
  clientName: "Partnership with Chido LED",
  clientInitial: "C",
  description:
    "A modern corporate website for a Moroccan LED display specialist, designed to showcase custom indoor, outdoor, mobile, and flexible LED solutions.",
  result:
    "A polished digital presence that presents Chido LED's expertise, solutions, and services while making it easy for businesses to request a tailored quote.",
  linkOne: "#start",
  websiteUrl: "https://chidoled.com/",
},
{
  title: "AIFDSPA official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Education"],
  visual: "AIFDSPA",
  image: imgAifdspa,
  clientName: "Partnership with AIFDSPA",
  clientInitial: "A",
  description:
    "A modern educational website for an international academy offering professional, artisanal, and sports training programs through flexible learning options.",
  result:
    "A structured digital platform that clearly presents the academy's programs, mission, and training opportunities while encouraging students to start their journey.",
  linkOne: "#start",
  websiteUrl: "https://www.aifdspa.com/",
},
{
  title: "Gozibra official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites SaaS"],
  visual: "Gozibra",
  image: imgGozibra,
  clientName: "Partnership with Gozibra",
  clientInitial: "G",
  description:
    "A streamlined SMM platform offering social media marketing services through an accessible dashboard built for individuals, agencies, and resellers.",
  result:
    "A functional digital platform that simplifies accessing, managing, and reselling social media growth services from one centralized interface.",
  linkOne: "#start",
  websiteUrl: "https://gozibra.com/",
},
{
  title: "SmartPanel official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites SaaS"],
  visual: "SmartPanel",
  image: imgSmartPanel,
  clientName: "Partnership with SmartPanel",
  clientInitial: "S",
  description:
    "A comprehensive SMM platform designed to manage social media marketing services across Instagram, TikTok, YouTube, Facebook, and other major networks.",
  result:
    "A streamlined digital platform that makes ordering, managing, and reselling social media services simple through one centralized dashboard.",
  linkOne: "#start",
  websiteUrl: "https://smm.smartpanel.dev/",
},
{
  title: "Nord Premium Gardiennage official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Corporate"],
  visual: "Nord Premium Gardiennage",
  image: imgNordPremiumGardiennage,
  clientName: "Partnership with Nord Premium Gardiennage",
  clientInitial: "N",
  description:
    "A professional corporate website for a Moroccan company providing security, cleaning, gardening, and property maintenance services for individuals and businesses.",
  result:
    "A trustworthy digital presence that clearly presents Nord Premium Gardiennage's services, expertise, and commitment to reliable professional support.",
  linkOne: "#start",
  websiteUrl: "https://www.nordpremiumgardiennage.ma/",
},
{
  title: "Edigitaal official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Agency"],
  visual: "Edigitaal",
  image: imgEdigitaal,
  clientName: "Partnership with Edigitaal",
  clientInitial: "E",
  description:
    "A modern digital agency website designed to showcase Edigitaal's expertise across web development, digital marketing, branding, and mobile app solutions.",
  result:
    "A polished agency presence that brings services, capabilities, case studies, and expertise together in a clear and engaging digital experience.",
  linkOne: "#start",
  websiteUrl: "https://dev254.kodesolution.com/edigitaal/",
},
{
  title: "Wakune official website",
  type: "Website Design · Client Work",
  filterCategories: ["Websites"],
  categories: ["Websites Agency"],
  visual: "Wakune",
  image: imgWakune,
  clientName: "Partnership with Wakune",
  clientInitial: "W",
  description:
    "A modern digital agency website designed to present Wakune's digital services, expertise, and solutions through a clean and engaging online experience.",
  result:
    "A professional digital presence that clearly communicates Wakune's capabilities while making its services easy to discover and explore.",
  linkOne: "#start",
  websiteUrl: "https://www.wakune.com/",
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
