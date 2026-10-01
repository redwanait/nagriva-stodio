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
  /** Honeypot. A real visitor never sees or fills this field. */
  website: string;
};

export type StartFieldErrors = Partial<Record<keyof StartFormState, string>>;

export type StartFieldTouched = Partial<Record<keyof StartFormState, boolean>>;