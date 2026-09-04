import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type InquiryBody = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  need?: unknown;
  projectDescription?: unknown;
  budget?: unknown;
  preferredContact?: unknown;
  phone?: unknown;
  website?: unknown;
};

const VALID_NEEDS = ["New Website", "Website Redesign", "E-commerce Website", "Landing Page"];
const VALID_BUDGETS = [
  "Under 3000 DH",
  "3000 DH – 5000 DH",
  "5000 DH – 10000 DH",
  "10000 DH+",
  "Not sure yet",
];
const VALID_CONTACTS = ["Email", "WhatsApp", "Phone"];
const PHONE_REQUIRED_METHODS = ["WhatsApp", "Phone"];
const SENDER = "Nagriva <contact@nagriva.ma>";

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s+\-()]/g, "");
  return /^\+?\d{8,15}$/.test(digits);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  let body: InquiryBody;
  try {
    body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {}) as InquiryBody;
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const fullName = asString(body.fullName);
  const email = asString(body.email).toLowerCase();
  const company = asString(body.company);
  const need = asString(body.need);
  const projectDescription = asString(body.projectDescription);
  const budget = asString(body.budget);
  const preferredContact = asString(body.preferredContact);
  const phone = asString(body.phone);
  const website = asString(body.website);

  if (website) {
    return res.status(200).json({ ok: true });
  }

  const errors: Record<string, string> = {};

  if (!fullName) errors.fullName = "Full name is required.";
  if (!email) errors.email = "Email address is required.";
  else if (!isValidEmail(email)) errors.email = "A valid email address is required.";
  if (!need) errors.need = "Please select what you need.";
  else if (!VALID_NEEDS.includes(need)) errors.need = "Invalid project need selected.";
  if (!projectDescription) errors.projectDescription = "Please tell us a little about your project.";
  if (!preferredContact) errors.preferredContact = "Please select a preferred contact method.";
  else if (!VALID_CONTACTS.includes(preferredContact))
    errors.preferredContact = "Invalid contact method selected.";
  if (budget && !VALID_BUDGETS.includes(budget)) errors.budget = "Invalid budget option selected.";
  if (PHONE_REQUIRED_METHODS.includes(preferredContact) && !phone) {
    errors.phone = "A phone number is required for this contact method.";
  } else if (PHONE_REQUIRED_METHODS.includes(preferredContact) && !isValidPhone(phone)) {
    errors.phone = "A valid phone number is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.NAGRIVA_OWNER_EMAIL;

  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured. Please try again later." });
  }

  const resend = new Resend(apiKey);

  try {
    const [clientResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: SENDER,
        to: [email],
        subject: "We received your project inquiry — Nagriva",
        html: clientEmailHtml({
          fullName,
          need,
          projectDescription,
          company,
          budget,
          preferredContact,
          phone,
        }),
      }),
      ownerEmail
        ? resend.emails.send({
            from: SENDER,
            to: [ownerEmail],
            replyTo: email,
            subject: `New project inquiry — ${fullName}`,
            html: ownerEmailHtml({
              fullName,
              email,
              company,
              need,
              projectDescription,
              budget,
              preferredContact,
              phone,
            }),
          })
        : null,
    ]);

    if (clientResult.error) {
      throw new Error(clientResult.error.message ?? "Failed to send client email.");
    }
    if (ownerResult?.error) {
      throw new Error(ownerResult.error.message ?? "Failed to send owner notification.");
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({
      error: "Something went wrong while sending your inquiry. Please try again.",
    });
  }
}

function clientEmailHtml(input: {
  fullName: string;
  need: string;
  projectDescription: string;
  company: string;
  budget: string;
  preferredContact: string;
  phone: string;
}): string {
  const budgetLine = input.budget
    ? `<div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#8a8a8a;">Budget</span><strong>${escapeHtml(input.budget)}</strong></div>`
    : "";
  const companyLine = input.company
    ? `<div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#8a8a8a;">Company / Brand</span><strong>${escapeHtml(input.company)}</strong></div>`
    : "";
  const phoneLine =
    input.preferredContact !== "Email"
      ? `<div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#8a8a8a;">Contact number</span><strong>${escapeHtml(input.phone)}</strong></div>`
      : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0b;font-family:Helvetica,Arial,sans-serif;color:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;padding:40px 24px;background:#111;border:1px solid rgba(245,245,245,.08);border-radius:16px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:26px;font-weight:700;letter-spacing:-.03em;">nagriva<span style="color:#d9f226;">.</span></span>
      </div>
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 12px;letter-spacing:-.02em;">We received your project inquiry, ${escapeHtml(input.fullName)}.</h1>
      <p style="margin:0 0 20px;color:#b9b9b9;font-size:15px;line-height:1.7;">Thanks for getting in touch. Your inquiry about a <strong style="color:#f5f5f5;">${escapeHtml(input.need)}</strong> is in — we&rsquo;ll review the details and get back to you soon.</p>
      <div style="background:#161616;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#8a8a8a;">Project summary</p>
        <p style="margin:0 0 18px;color:#dddddd;font-size:14px;line-height:1.7;">${escapeHtml(input.projectDescription)}</p>
        <div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#8a8a8a;">What you need</span><strong>${escapeHtml(input.need)}</strong></div>
        ${companyLine}
        ${budgetLine}
        ${phoneLine}
        <div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#8a8a8a;">Preferred contact</span><strong>${escapeHtml(input.preferredContact)}</strong></div>
      </div>
      <p style="margin:0 0 8px;color:#b9b9b9;font-size:14px;line-height:1.7;">If you need anything else in the meantime, just reply to this email.</p>
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(245,245,245,.08);text-align:center;color:#8a8a8a;font-size:12px;">
        Nagriva — digital work built with clarity and intention.
      </div>
    </div>
  </body>
</html>`;
}

function ownerEmailHtml(input: {
  fullName: string;
  email: string;
  company: string;
  need: string;
  projectDescription: string;
  budget: string;
  preferredContact: string;
  phone: string;
}): string {
  const phoneRow =
    input.preferredContact !== "Email"
      ? `<tr><td style="padding:8px 12px;color:#8a8a8a;">Phone / WhatsApp</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.phone)}</td></tr>`
      : "";
  const companyRow = input.company
    ? `<tr><td style="padding:8px 12px;color:#8a8a8a;">Company / Brand</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.company)}</td></tr>`
    : "";
  const budgetRow = input.budget
    ? `<tr><td style="padding:8px 12px;color:#8a8a8a;">Budget</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.budget)}</td></tr>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0b;font-family:Helvetica,Arial,sans-serif;color:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;padding:40px 24px;background:#111;border:1px solid rgba(245,245,245,.08);border-radius:16px;">
      <div style="margin-bottom:24px;">
        <span style="font-size:26px;font-weight:700;letter-spacing:-.03em;">nagriva<span style="color:#d9f226;">.</span></span>
      </div>
      <h1 style="font-size:22px;margin:0 0 20px;letter-spacing:-.02em;">New project inquiry — ${escapeHtml(input.fullName)}</h1>
      <table style="width:100%;border-collapse:collapse;background:#161616;border-radius:12px;font-size:14px;">
        <tr><td style="padding:8px 12px;color:#8a8a8a;">Name</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.fullName)}</td></tr>
        <tr><td style="padding:8px 12px;color:#8a8a8a;">Email</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.email)}</td></tr>
        ${companyRow}
        <tr><td style="padding:8px 12px;color:#8a8a8a;">What you need</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.need)}</td></tr>
        ${budgetRow}
        <tr><td style="padding:8px 12px;color:#8a8a8a;">Preferred contact</td><td style="padding:8px 12px;font-weight:600;">${escapeHtml(input.preferredContact)}</td></tr>
        ${phoneRow}
        <tr>
          <td style="padding:8px 12px;color:#8a8a8a;vertical-align:top;">Project description</td>
          <td style="padding:8px 12px;">${escapeHtml(input.projectDescription)}</td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}
