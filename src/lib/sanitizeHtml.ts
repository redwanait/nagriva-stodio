import DOMPurify from "dompurify";

/**
 * Allow-list used for article bodies managed in the Supabase Dashboard.
 *
 * Only formatting and structural tags that the blog styles actually target are
 * permitted. Executable content (`script`, `style`, `iframe`, `object`,
 * `embed`, form controls, SVG/MathML) and event-handler attributes are removed
 * by DOMPurify. `javascript:`/`data:` URLs are rejected by DOMPurify's default
 * URI policy.
 */
const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "div",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "ins",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "class",
  "colspan",
  "rowspan",
  "datetime",
];

let hookInstalled = false;

/** Harden outbound links opened in a new tab. */
function installHook(): void {
  if (hookInstalled) return;
  hookInstalled = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node instanceof HTMLElement && node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/**
 * Sanitize a Blog article body before it reaches the DOM. Stored content is
 * never modified; only the rendered output is filtered.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";
  installHook();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "button", "textarea", "select"],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  }) as string;
}
