/**
 * Copies plain text to the clipboard.
 *
 * Uses the async Clipboard API when it is available. If it is missing or
 * rejects (insecure context, permission denied, document not focused), falls
 * back to a hidden textarea with `document.execCommand("copy")`.
 *
 * Resolves to `true` only when the copy actually succeeded.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }
  return copyWithTextarea(text);
}

function copyWithTextarea(text: string): boolean {
  if (typeof document === "undefined" || !document.body) return false;

  const previouslyFocused = document.activeElement as HTMLElement | null;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  let copied: boolean;
  try {
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    document.body.removeChild(textarea);
    previouslyFocused?.focus?.();
  }
  return copied;
}
