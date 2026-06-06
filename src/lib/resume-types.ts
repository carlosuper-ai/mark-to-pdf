export type ProficiencyLevel =
  | "Native"
  | "Fluent"
  | "Professional"
  | "Intermediate"
  | "Beginner";

export interface PersonalDetails {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  technologies: string[];
  url: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  url?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: ProficiencyLevel;
}

export interface ResumeData {
  personal: PersonalDetails;
  summary: string;
  skills: SkillCategory[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export type TemplateId = "modern" | "professional";

export interface ResumeTheme {
  template: TemplateId;
  accent: string; // hex
  fontFamily: string;
  fontScale: number; // 0.9 - 1.15
  lineHeight: number; // 1.3 - 1.8
}

export interface Resume {
  id: string;
  name: string;
  data: ResumeData;
  theme: ResumeTheme;
  updatedAt: number;
}

export const emptyResumeData = (): ResumeData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
});

export const defaultTheme = (): ResumeTheme => ({
  template: "modern",
  accent: "#2563EB",
  fontFamily: "Inter",
  fontScale: 1,
  lineHeight: 1.5,
});