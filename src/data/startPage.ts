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
  description:
    "Websites for startups and established businesses. Four quick details and we'll take it from there. No long brief needed.",
  reassurance: [],
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
  confirmationLabel: "We've sent a confirmation to",
  replyLabel: "We'll reach you",
  whatsappLabel: "Continue on WhatsApp",
  homeLabel: "Back to Nagriva",
};

// Backend contact value -> how the success view names the channel.
export const startReplyChannel: Record<string, string> = {
  WhatsApp: "on WhatsApp",
  Email: "by email",
  Phone: "by phone",
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
  projectId: "Do you have a Project ID?",
  projectIdPlaceholder: "e.g. NAG-PRJ-001",
  projectIdHint: "If a project in our portfolio inspired you, enter its Project ID here.",
  projectIdMatched: "Matched project:",
  projectIdNotFound:
    "We couldn't find a project with that ID. You can still submit your request, and we'll keep the ID with it.",
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

// Guidance shown next to the form while the Cloudflare verification runs.
export const startVerificationMessages = {
  checking: "One quick security check is still running. Press Submit again once it's done.",
  ready: "Security check complete. Press Submit to send your request.",
  failed: "The security check didn't finish. Press Submit to try again, or message us on WhatsApp.",
  unavailable:
    "The security check couldn't load on this page. Turn off content blockers and refresh, or message us on WhatsApp.",
};

export const startSubmitMessages = {
  sending: "Sending your request…",
  failed: "Sorry — we couldn't send your request right now. Please try again in a moment.",
  network: "We couldn't reach our server. Check your connection, then try again.",
  timeout: "This is taking longer than expected. Check your connection, then try again.",
  invalid: "Some details need another look. Please check the form and try again.",
  fallbackLead: "Prefer to talk now?",
  fallbackLink: "Message us on WhatsApp",
};

// Short, human explanations reused by the success panel. Rotating through them
// keeps the confirmation warm without adding reading load.
export const startSuccessMessages = [
  { text: "We'll review the details and get back to you soon.", dir: "ltr" as const },
  { text: "Nous allons examiner les détails et revenir vers vous bientôt.", dir: "ltr" as const },
  { text: "شكرا اسيدي علا الثقة ديالك ف nagriva دابا نتواصل معاك ان شاء الله", dir: "rtl" as const },
];

export const startWhatsappUrl = "https://wa.me/+212728427278";