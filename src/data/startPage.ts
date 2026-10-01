// Copy and option sets for the /start lead-capture page.
//
// The page is a two-step flow: Step 01 captures only contact essentials so a
// cold visitor can submit in seconds, Step 02 is optional qualification.
// Everything here is display-level data so the page copy can be edited without
// touching the flow logic in src/pages/Start.tsx.

export const startHero = {
  eyebrow: "Start with Nagriva",
  headline: "Let's build something worth",
  headlineAccent: "talking about.",
  // Base + accent so only the final phrase uses the Nagriva blue.
  headlineBaseEn: "Let's build something worth ",
  headlineAccentEn: "talking about.",
  // Arabic headline (RTL) — only the final phrase is blue.
  headlineBaseAr: "لِنَبْنِ شيئاً يستحق ",
  headlineAccentAr: "الحديث عنه.",
  description: "Four quick details and we'll take it from there. No long brief needed.",
  reassurance: [
    "No obligation, no pressure.",
    "Free first conversation.",
  ],
  contactNote: "Prefer to talk first?",
  contactWhatsapp: "Message us on WhatsApp",
};

// Only the active step is rendered, so the visitor never sees two steps at once.
export const startProgress = {
  total: "02",
  steps: [
    { index: "01", label: "Contact" },
    { index: "02", label: "Project details" },
  ],
};

export type NeedOption = {
  // Unique front-end id. Used as the radio value and as the React key, so it
  // must stay unique even when two options share the same payload.
  id: string;
  label: string;
};

export const startNeedOptions: NeedOption[] = [
  { id: "website", label: "Website" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "landing", label: "Landing Page" },
  { id: "redesign", label: "Website Redesign" },
  { id: "other", label: "Other" },
];

export const startBudgetOptions = [
  "Under 3000 DH",
  "3000 DH – 5000 DH",
  "5000 DH – 10000 DH",
  "10000 DH+",
  "Not sure yet",
];

export const startTimelineOptions = ["ASAP", "Within 2 weeks", "This month", "Just exploring"];

// Display labels here; startContactMethodValue maps them onto the existing
// backend enumeration ("Email" | "WhatsApp" | "Phone").
export const startContactOptions = ["WhatsApp", "Email", "Call"];

export const startContactMethodValue: Record<string, string> = {
  WhatsApp: "WhatsApp",
  Email: "Email",
  Call: "Phone",
};

// Front-end need ids -> existing backend enumeration.
// TEMPORARY: "Other" has no backend equivalent yet and falls back to
// "New Website" so the submission still succeeds. Once the backend enumeration
// is widened, this map is the only thing that needs to change.
export const startNeedValue: Record<string, string> = {
  website: "New Website",
  ecommerce: "E-commerce Website",
  landing: "Landing Page",
  redesign: "Website Redesign",
  other: "New Website",
};

export const startContactStep = {
  title: "First, how can we reach you?",
  description: "Four quick details. That's all we need to get back to you.",
  submitLabel: "Submit Request",
  // The optional nature of Step 02 is stated once, here.
  moreLabel: "Add project details",
  moreNote: "Optional",
  reassurance: "We review every request personally and reply within one business day.",
};

export const startDetailsStep = {
  title: "Tell us a little more about the project.",
  optionalBadge: "This step is optional.",
  backLabel: "Back",
  submitLabel: "Submit Request",
  carryoverLabel: "We\u2019ll reply to",
};

export const startSuccess = {
  title: "Thanks, we got it.",
  description: "We'll get back to you shortly.",
  whatsappLabel: "Continue on WhatsApp",
  homeLabel: "Back to Nagriva",
};

export const startFieldLabels = {
  fullName: "Full name",
  email: "Email address",
  phone: "Phone / WhatsApp",
  need: "What do you need?",
  needPlaceholder: "Select an option",
  company: "Company / brand",
  budget: "Estimated budget",
  timeline: "Timeline",
  contactMethod: "How should we contact you?",
  description: "About your project",
  descriptionPlaceholder: "A sentence or two is plenty.",
  descriptionHint: "Optional — a sentence or two is plenty.",
};

export const startValidation = {
  fullName: "Please add your name.",
  emailEmpty: "Please add your email.",
  emailInvalid: "That email address looks incomplete.",
  phoneEmpty: "Please add your phone number.",
  phoneInvalid: "That phone number looks incomplete.",
  need: "Please choose what you need.",
  submitHint: "Fill in the highlighted fields to continue.",
};

// Short, human explanations reused by the success panel. Rotating through them
// keeps the confirmation warm without adding reading load.
export const startSuccessMessages = [
  { text: "We'll review the details and get back to you soon.", dir: "ltr" as const },
  { text: "Nous allons examiner les détails et revenir vers vous bientôt.", dir: "ltr" as const },
  { text: "شكرا اسيدي علا الثقة ديالك ف nagriva دابا نتواصل معاك ان شاء الله", dir: "rtl" as const },
];

export const startWhatsappUrl = "https://wa.me/+212728427278";