import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type InquiryBody = {
  /** Client-generated idempotency key. Retries reuse it so the row is not duplicated. */
  submissionId?: unknown;
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  need?: unknown;
  projectDescription?: unknown;
  budget?: unknown;
  preferredContact?: unknown;
  phone?: unknown;
  website?: unknown;
  turnstileToken?: unknown;
  projectReference?: unknown;
  projectTitle?: unknown;
  projectUrl?: unknown;
};

const MAX_PROJECT_REFERENCE_LENGTH = 32;
const MAX_PROJECT_TITLE_LENGTH = 200;
const MAX_PROJECT_URL_LENGTH = 500;

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
/**
 * Absolute URL of the logo for emails. The file lives at public/logo.webp in this
 * repository, so Vite copies it to the stable path /logo.webp in the production
 * build — a local filesystem path can never work inside an email client.
 */
const LOGO_URL = "https://nagriva.ma/logo.webp";

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

function getRemoteIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/** A v4 UUID the browser generated for this submission attempt. */
function isValidSubmissionId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Server-only Supabase client. Inserts run under the service-role key so they
 * no longer depend on the public anon INSERT policy. The key never ships to the
 * browser and must not be placed in any VITE_* variable.
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Submissions are never cached by the browser, the CDN, or any proxy in front of them.
  res.setHeader("Cache-Control", "no-store");

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
  const submissionId = asString(body.submissionId);
  // Optional portfolio reference. An unknown but well-formed ID is accepted;
  // only length and URL scheme are checked, so it never blocks a request.
  const projectReference = asString(body.projectReference).toUpperCase();
  const projectTitle = asString(body.projectTitle);
  const projectUrl = asString(body.projectUrl);

  if (website) {
    return res.status(200).json({ ok: true });
  }

  const turnstileToken = asString(body.turnstileToken);

  if (!turnstileToken) {
    return res.status(400).json({ error: "Verification failed. Please try again." });
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, getRemoteIp(req));
  if (!turnstileOk) {
    return res.status(400).json({ error: "Verification failed. Please try again." });
  }

  // The idempotency key is mandatory: it is how a retry after a dropped response
  // reuses the same row instead of writing a duplicate.
  if (!isValidSubmissionId(submissionId)) {
    return res.status(400).json({ error: "Invalid submission ID." });
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
  if (projectReference.length > MAX_PROJECT_REFERENCE_LENGTH) {
    errors.projectReference = "Project ID is too long.";
  }
  if (projectTitle.length > MAX_PROJECT_TITLE_LENGTH) {
    errors.projectTitle = "Project title is too long.";
  }
  if (projectUrl && (!/^https?:\/\//.test(projectUrl) || projectUrl.length > MAX_PROJECT_URL_LENGTH)) {
    errors.projectUrl = "A valid project link is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.NAGRIVA_OWNER_EMAIL;

  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured. Please try again later." });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Inquiry storage is not configured. Please try again later." });
  }

  // Only now is anything persisted: Turnstile verification and field validation
  // both passed. The row keeps status "pending" and the same columns the
  // dashboard reads; only the insert path changed (service role instead of anon).
  const projectColumns = projectReference
    ? {
        project_reference: projectReference,
        project_title: projectTitle || null,
        project_url: projectUrl || null,
      }
    : {};
  const { error: insertError } = await supabaseAdmin.from("inquiries").insert({
    id: submissionId,
    full_name: fullName,
    email,
    company: company || null,
    need,
    project_description: projectDescription,
    budget: budget || null,
    preferred_contact: preferredContact,
    phone: phone || null,
    status: "pending",
    ...projectColumns,
  });

  // 23505 = the submissionId already exists. That is the retry path: the row from
  // the first attempt is kept untouched (status included) and we continue to the
  // email step instead of duplicating the lead.
  if (insertError && insertError.code !== "23505") {
    // Code and message only; the full error object can echo submitted values.
    console.error("Failed to save inquiry:", { code: insertError.code, message: insertError.message });
    return res.status(500).json({ error: "Unable to save your inquiry. Please try again." });
  }

  const resend = new Resend(apiKey);

  try {
    const [clientResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: SENDER,
        to: [email],
        subject: "We received your project inquiry — Nagriva",
        text: clientEmailText({ fullName, email }),
        html: clientEmailHtml({ fullName, email }),
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
              projectReference,
              projectTitle,
              projectUrl,
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
  return `<tr><td class="email-divider" style="padding:12px 0;${border}"><p class="email-info-label" style="margin:0;font-size:12px;color:#666666;">${label}</p><p class="email-info-value" style="margin:4px 0 0;font-size:14px;font-weight:600;color:#000000;">${escapeHtml(value)}</p></td></tr>`;
}

/** The name shown in the greeting, falling back to the email address. */
function clientGreeting(fullName: string, email: string): string {
  return fullName || email;
}

/**
 * Minimal customer confirmation email. No card, no tables, no CSS: Gmail and
 * mobile clients render the plain document flow, which is what makes this
 * version robust everywhere. The logo is the production file served at
 * /logo.webp (public/logo.webp in the repo).
 */
function clientEmailHtml(input: { fullName: string; email: string }): string {
  const greeting = escapeHtml(clientGreeting(input.fullName, input.email));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your project inquiry — Nagriva</title>
</head>
<body>
  <p><img src="${LOGO_URL}" width="192" height="64" alt="Nagriva"></p>
  <p>Hi ${greeting},</p>
  <p>Thank you for contacting Nagriva. We've received your project request.</p>
  <p>We review every request personally and will get back to you within one business day.</p>
  <p>— Start with Nagriva</p>
  <footer>
    <p><a href="https://nagriva.ma">Visit Nagriva</a></p>
  </footer>
</body>
</html>`;
}

/** Plain-text fallback for clients that cannot render HTML. */
function clientEmailText(input: { fullName: string; email: string }): string {
  const greeting = clientGreeting(input.fullName, input.email);
  return `Hi ${greeting},

Thank you for contacting Nagriva. We've received your project request.

We review every request personally and will get back to you within one business day.

— Nagriva

Visit Nagriva: https://nagriva.ma`;
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
  projectReference: string;
  projectTitle: string;
  projectUrl: string;
}): string {
  const hasPhoneRow = input.preferredContact !== "Email" && input.phone;
  const infoRows: string[] = [];
  infoRows.push(makeInfoRow("Name", input.fullName));
  infoRows.push(`<tr><td class="email-divider" style="padding:12px 0;border-bottom:1px solid #e5e5e5;"><p class="email-info-label" style="margin:0;font-size:12px;color:#666666;">Email</p><p class="email-info-value" style="margin:4px 0 0;font-size:14px;font-weight:600;"><a href="mailto:${escapeHtml(input.email)}" style="color:#000000;text-decoration:none;">${escapeHtml(input.email)}</a></p></td></tr>`);
  if (input.company) infoRows.push(makeInfoRow("Company / Brand", input.company));
  infoRows.push(makeInfoRow("Project need", input.need));
  if (input.projectReference) infoRows.push(makeInfoRow("Portfolio Project ID", input.projectReference));
  if (input.projectTitle) infoRows.push(makeInfoRow("Referenced project", input.projectTitle));
  if (input.projectUrl) infoRows.push(makeInfoRow("Referenced project website", input.projectUrl));
  if (input.budget) infoRows.push(makeInfoRow("Budget", input.budget));
  infoRows.push(makeInfoRow("Preferred contact", input.preferredContact, !hasPhoneRow));
  if (hasPhoneRow) infoRows.push(makeInfoRow("Phone / WhatsApp", input.phone, false));

  const descriptionSection = input.projectDescription
    ? `<tr>
        <td style="padding:24px 48px 0;">
          <table class="email-desc-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:8px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#666666;">Project description</p>
                <p class="email-desc-text" style="margin:0;font-size:15px;line-height:1.7;color:#000000;">${escapeHtml(input.projectDescription)}</p>
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
  <title>New project inquiry — Nagriva</title>
  <!--[if mso]><style>table{border-collapse:collapse;}</style><![endif]-->
  <style>
    @media(prefers-color-scheme:dark){
      .email-bg{background-color:#0a0a0a!important}
      .email-container{background-color:#171717!important;border-color:#262626!important}
      .email-heading{color:#f5f5f5!important}
      .email-body{color:#666666!important}
      .email-info-card{background-color:#000000!important;border-color:#262626!important}
      .email-info-label{color:#737373!important}
      .email-info-value{color:#f5f5f5!important}
      .email-info-value a{color:#4D7CFF!important}
      .email-divider{border-color:#262626!important}
      .email-desc-card{background-color:#000000!important;border-color:#262626!important}
      .email-desc-text{color:#666666!important}
      .email-footer{border-color:#262626!important}
      .email-footer-text{color:#737373!important}
      .email-footer-copy{color:#666666!important}
    }
  </style>
</head>
<body class="email-bg" style="margin:0;padding:0;background-color:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#000000;-webkit-font-smoothing:antialiased;">
  <table class="email-bg" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F7F7;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">

          <tr>
            <td align="center" style="padding:40px 48px 0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.03em;color:#000000;">nagriva<span style="color:#0047FF;">.</span></span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <h1 class="email-heading" style="margin:0;font-size:24px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:#000000;">New project inquiry — ${escapeHtml(input.fullName)}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 48px 0;">
              <p class="email-body" style="margin:0;font-size:15px;line-height:1.7;color:#666666;">A new project inquiry was submitted through the Nagriva website. Below are the details.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <table class="email-info-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#666666;">Inquiry details</p>
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
            <td align="center" style="padding:32px 48px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#000000;border-radius:8px;">
                    <a href="mailto:${escapeHtml(input.email)}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">Reply to inquiry</a>
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
                    <p class="email-footer-text" style="margin:0;font-size:13px;color:#666666;text-align:center;">Nagriva — Digital work built with clarity and intention.</p>
                    <p class="email-footer-copy" style="margin:8px 0 0;font-size:12px;color:#666666;text-align:center;">© 2026 Nagriva. All rights reserved.</p>
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
