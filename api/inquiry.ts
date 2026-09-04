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

function makeInfoRow(label: string, value: string, hasBorder: boolean = true): string {
  const border = hasBorder ? "border-bottom:1px solid #e5e5e5;" : "border-bottom:none;";
  return `<tr><td class="email-divider" style="padding:12px 0;${border}"><p class="email-info-label" style="margin:0;font-size:12px;color:#a3a3a3;">${label}</p><p class="email-info-value" style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1a1a1a;">${escapeHtml(value)}</p></td></tr>`;
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
  const hasPhoneRow = input.preferredContact !== "Email" && input.phone;
  const infoRows: string[] = [];
  infoRows.push(makeInfoRow("Project need", input.need));
  if (input.company) infoRows.push(makeInfoRow("Company / Brand", input.company));
  if (input.budget) infoRows.push(makeInfoRow("Budget", input.budget));
  infoRows.push(makeInfoRow("Preferred contact", input.preferredContact, !hasPhoneRow));
  if (hasPhoneRow) infoRows.push(makeInfoRow("Phone / WhatsApp", input.phone, false));

  const descriptionSection = input.projectDescription
    ? `<tr>
        <td style="padding:24px 48px 0;">
          <table class="email-desc-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:8px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;">Project description</p>
                <p class="email-desc-text" style="margin:0;font-size:15px;line-height:1.7;color:#1a1a1a;">${escapeHtml(input.projectDescription)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>We received your project inquiry — Nagriva</title>
  <!--[if mso]><style>table{border-collapse:collapse;}</style><![endif]-->
  <style>
    @media(prefers-color-scheme:dark){
      .email-bg{background-color:#0a0a0a!important}
      .email-container{background-color:#171717!important;border-color:#262626!important}
      .email-heading{color:#f5f5f5!important}
      .email-body{color:#a3a3a3!important}
      .email-info-card{background-color:#1a1a1a!important;border-color:#262626!important}
      .email-info-label{color:#737373!important}
      .email-info-value{color:#f5f5f5!important}
      .email-divider{border-color:#262626!important}
      .email-desc-card{background-color:#1a1a1a!important;border-color:#262626!important}
      .email-desc-text{color:#d4d4d4!important}
      .email-footer{border-color:#262626!important}
      .email-footer-text{color:#737373!important}
      .email-footer-copy{color:#525252!important}
    }
  </style>
</head>
<body class="email-bg" style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;-webkit-font-smoothing:antialiased;">
  <table class="email-bg" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">

          <tr>
            <td align="center" style="padding:40px 48px 0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.03em;color:#1a1a1a;">nagriva<span style="color:#d9f226;">.</span></span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <h1 class="email-heading" style="margin:0;font-size:24px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:#1a1a1a;">We received your project inquiry.</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 48px 0;">
              <p class="email-body" style="margin:0;font-size:15px;line-height:1.7;color:#525252;">Hi ${escapeHtml(input.fullName)},</p>
              <p class="email-body" style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#525252;">Thank you for reaching out to Nagriva. We've received your project details and our team will review your request carefully.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <table class="email-info-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;">Project details</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${infoRows.join("\n                      ")}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${descriptionSection}

          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;">What happens next?</p>
              <p class="email-body" style="margin:0;font-size:15px;line-height:1.7;color:#525252;">Your request is now with our team. We'll review the details and get back to you as soon as possible.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:32px 48px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#171717;border-radius:8px;">
                    <a href="https://nagriva.ma" target="_blank" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">Visit Nagriva</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 0;">
              <table class="email-footer" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:24px 0 0;">
                    <p class="email-footer-text" style="margin:0;font-size:13px;color:#a3a3a3;text-align:center;">Nagriva — Digital work built with clarity and intention.</p>
                    <p class="email-footer-copy" style="margin:8px 0 0;font-size:12px;color:#d4d4d4;text-align:center;">© 2026 Nagriva. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="padding:0 0 40px;"></td></tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
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
