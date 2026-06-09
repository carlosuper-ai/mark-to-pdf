import type { Resume } from "@/lib/resume-types";
import { DEFAULT_CONTACT_ORDER } from "@/lib/resume-types";

export const CONTACT_ICONS: Record<string, string> = {
  email: "✉",
  phone: "☎",
  location: "◎",
  linkedin: "in",
  github: "GH",
  website: "⊕",
};

export interface ContactField {
  type: "email" | "phone" | "location" | "linkedin" | "github" | "website";
  value: string;
}

export function buildContactFields(
  personal: Resume["data"]["personal"],
  contactOrder: string[] = DEFAULT_CONTACT_ORDER,
): ContactField[] {
  const all: Record<string, ContactField | null> = {
    email: personal.email ? { type: "email", value: personal.email } : null,
    phone: personal.phone ? { type: "phone", value: personal.phone } : null,
    location: personal.location ? { type: "location", value: personal.location } : null,
    linkedin: personal.linkedin ? { type: "linkedin", value: personal.linkedin } : null,
    github: personal.github ? { type: "github", value: personal.github } : null,
    website: personal.website ? { type: "website", value: personal.website } : null,
  };
  const order = contactOrder.length ? contactOrder : DEFAULT_CONTACT_ORDER;
  return order.map((k) => all[k]).filter((f): f is ContactField => f !== null);
}
