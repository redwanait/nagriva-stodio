export function formatFeedbackDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getFeedbackHash(feedbackId: string): string {
  return `#feedback-${feedbackId}`;
}
