export type StartFormState = {
  fullName: string;
  email: string;
  phone: string;
  need: string;
  company: string;
  budget: string;
  timeline: string;
  contactMethod: string;
  description: string;
  /** Optional portfolio Project ID, e.g. NAG-PRJ-001. Never required to submit. */
  projectId: string;
  /** Honeypot. A real visitor never sees or fills this field. */
  website: string;
};

export type StartFieldErrors = Partial<Record<keyof StartFormState, string>>;

export type StartFieldTouched = Partial<Record<keyof StartFormState, boolean>>;