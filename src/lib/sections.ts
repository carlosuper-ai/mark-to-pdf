export type SectionKey =
  | "import"
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languages";

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "import", label: "Import Markdown" },
  { key: "personal", label: "Personal Details" },
  { key: "summary", label: "Summary" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Work Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "languages", label: "Languages" },
];
