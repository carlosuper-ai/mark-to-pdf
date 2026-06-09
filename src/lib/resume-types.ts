// ─── Resume data types ────────────────────────────────────────────────────────

export type ProficiencyLevel = "Native" | "Fluent" | "Professional" | "Intermediate" | "Beginner";

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

// ─── Design system types ──────────────────────────────────────────────────────

export type TemplateId =
  | "modern"
  | "professional"
  | "ats-classic"
  | "minimal-clean"
  | "technical-developer"
  | "executive"
  | "startup-modern"
  | "creative"
  | "flowcv";

// 1. Document Settings
export type PageFormat = "A4" | "Letter" | "B5" | "A5" | "Legal" | "Executive";
export type PageOrientation = "portrait" | "landscape";
export type DateFormat =
  | "MMM YYYY"
  | "MMMM YYYY"
  | "MMM DD, YYYY"
  | "MMMM DD, YYYY"
  | "MM/DD/YYYY"
  | "DD/MM/YYYY"
  | "YYYY-MM-DD";

export interface DocumentSettings {
  language: string;
  dateFormat: DateFormat;
  pageFormat: PageFormat;
  pageOrientation: PageOrientation;
}

// 2. Layout
export type ColumnLayout = "one" | "two" | "mixed";

export interface LayoutSettings {
  columns: ColumnLayout;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
}

// 3. Typography
export const FONT_LIST = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Source Serif Pro",
  "Merriweather",
  "Playfair Display",
  "Georgia",
  "Times New Roman",
] as const;

export type FontFamily = (typeof FONT_LIST)[number] | string;

export interface TypographySettings {
  fontFamily: FontFamily;
  baseFontSize: number; // 9–16 pt
  nameFontSize: number; // 18–40 pt
  titleFontSize: number; // 12–24 pt
  sectionHeadingSize: number; // 12–24 pt
  entryHeaderSize: number; // 12–22 pt
}

// 4. Spacing
export interface SpacingSettings {
  lineHeight: number; // 1.0–2.0
  sectionGap: number; // 0–40 px — vertical gap between sections
  marginTop: number; // 10–80 px
  marginBottom: number; // 10–80 px
  marginLeft: number; // 10–80 px
  marginRight: number; // 10–80 px
}

// 5. Entry Layout
export type SubtitleStyle = "normal" | "bold" | "italic" | "bold-italic";
export type SubtitlePlacement = "same-line" | "next-line" | "compact";
export type ListStyle = "bullet" | "hyphen" | "square" | "arrow";
export type EntryTemplate = "A" | "B" | "C" | "D";

export interface EntryLayoutSettings {
  entryTemplate: EntryTemplate;
  subtitleStyle: SubtitleStyle;
  subtitlePlacement: SubtitlePlacement;
  indentBody: boolean;
  listStyle: ListStyle;
}

// 6. Section Headings
export type HeadingCapitalization = "original" | "capitalize" | "uppercase";
export type HeadingStyle = "text-only" | "underline" | "left-border" | "filled" | "divider";
export type IconDisplay = "none" | "outline" | "filled";

export interface SectionHeadingSettings {
  capitalization: HeadingCapitalization;
  style: HeadingStyle;
  showIcons: IconDisplay;
}

// 7. Colors — FlowCV-style engine

export type ColorMode = "single" | "multi";

export interface AccentTargets {
  name: boolean;
  jobTitle: boolean;
  headings: boolean;
  headerIcons: boolean;
  dates: boolean;
  entrySubtitle: boolean;
  linkIcons: boolean;
}

export interface MultiColorSettings {
  primaryBackground: string; // header / sidebar background
  secondaryBackground: string; // body background
  primaryText: string; // main text
  secondaryText: string; // muted / subtitle text
  accent: string; // accent — overrides top-level accent
}

export interface ColorSettings {
  mode: ColorMode;
  accent: string; // single-mode primary accent
  headerColor: string; // name & title text
  borderColor: string; // lines, dividers
  multi: MultiColorSettings;
  targets: AccentTargets;
}

// 8. Header
export type HeaderAlignment = "left" | "center";
export type ContactLayout = "icons" | "bullet" | "vertical-bar";
export type IconFrameStyle =
  | "none"
  | "circle-filled"
  | "rounded-filled"
  | "square-filled"
  | "circle-outline"
  | "rounded-outline";
export type NameTextStyle = "normal" | "bold";
export type TitlePosition = "same-line" | "below";
export type TitleTextStyle = "normal" | "italic";

export interface HeaderSettings {
  alignment: HeaderAlignment;
  detailsArrangement: ContactLayout;
  iconStyle: IconFrameStyle;
  showDivider: boolean;
  contactSeparator: string;
  nameStyle: NameTextStyle;
  titlePosition: TitlePosition;
  titleStyle: TitleTextStyle;
  contactOrder: string[];
}

export const DEFAULT_CONTACT_ORDER = [
  "email",
  "phone",
  "location",
  "linkedin",
  "github",
  "website",
];

// 9. Photo
export type PhotoShape = "circle" | "rounded-square" | "square";
export type PhotoPosition = "left" | "right" | "center";
export type PhotoBorder = "none" | "thin" | "medium" | "thick";

export interface PhotoSettings {
  show: boolean;
  shape: PhotoShape;
  position: PhotoPosition;
  size: number; // 60–180 px
  border: PhotoBorder;
  url: string;
}

// 10. Links
export interface LinkSettings {
  underline: boolean;
  blueColor: boolean;
  showIcon: boolean;
  clickable: boolean;
}

// 11. Footer
export type FooterAlignment = "left" | "center" | "right";

export interface FooterSettings {
  showPageNumbers: boolean;
  showEmail: boolean;
  showName: boolean;
  alignment: FooterAlignment;
}

// ─── Top-level design settings ───────────────────────────────────────────────

export interface ResumeDesignSettings {
  template: TemplateId;
  document: DocumentSettings;
  layout: LayoutSettings;
  typography: TypographySettings;
  spacing: SpacingSettings;
  entryLayout: EntryLayoutSettings;
  sectionHeadings: SectionHeadingSettings;
  colors: ColorSettings;
  header: HeaderSettings;
  photo: PhotoSettings;
  links: LinkSettings;
  footer: FooterSettings;
}

// ─── Resume root type ─────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  name: string;
  data: ResumeData;
  design: ResumeDesignSettings;
  updatedAt: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_SECTION_ORDER = [
  "summary",
  "experiences",
  "skills",
  "projects",
  "education",
  "certifications",
  "languages",
];

export const defaultDesignSettings = (): ResumeDesignSettings => ({
  template: "modern",
  document: {
    language: "en",
    dateFormat: "MMM YYYY",
    pageFormat: "A4",
    pageOrientation: "portrait",
  },
  layout: {
    columns: "one",
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionVisibility: Object.fromEntries(DEFAULT_SECTION_ORDER.map((k) => [k, true])),
  },
  typography: {
    fontFamily: "Inter",
    baseFontSize: 10.5,
    nameFontSize: 24,
    titleFontSize: 13,
    sectionHeadingSize: 10.5,
    entryHeaderSize: 12,
  },
  spacing: {
    lineHeight: 1.5,
    sectionGap: 12,
    marginTop: 48,
    marginBottom: 48,
    marginLeft: 48,
    marginRight: 48,
  },
  entryLayout: {
    entryTemplate: "A",
    subtitleStyle: "normal",
    subtitlePlacement: "next-line",
    indentBody: false,
    listStyle: "bullet",
  },
  sectionHeadings: {
    capitalization: "uppercase",
    style: "text-only",
    showIcons: "none",
  },
  colors: {
    mode: "single",
    accent: "#2563EB",
    headerColor: "#1a1f2e",
    borderColor: "#1a1f2e",
    multi: {
      primaryBackground: "#1e293b",
      secondaryBackground: "#ffffff",
      primaryText: "#ffffff",
      secondaryText: "#94a3b8",
      accent: "#60a5fa",
    },
    targets: {
      name: false,
      jobTitle: true,
      headings: true,
      headerIcons: true,
      dates: false,
      entrySubtitle: false,
      linkIcons: true,
    },
  },
  header: {
    alignment: "left",
    detailsArrangement: "bullet",
    iconStyle: "none",
    showDivider: true,
    contactSeparator: "·",
    nameStyle: "bold",
    titlePosition: "below",
    titleStyle: "normal",
    contactOrder: [...DEFAULT_CONTACT_ORDER],
  },
  photo: {
    show: false,
    shape: "circle",
    position: "right",
    size: 80,
    border: "none",
    url: "",
  },
  links: {
    underline: false,
    blueColor: false,
    showIcon: false,
    clickable: true,
  },
  footer: {
    showPageNumbers: false,
    showEmail: false,
    showName: false,
    alignment: "center",
  },
});

// ─── Template presets ─────────────────────────────────────────────────────────

export interface TemplatePresetOverrides {
  template?: TemplateId;
  colors?: Partial<ColorSettings>;
  typography?: Partial<TypographySettings>;
  spacing?: Partial<SpacingSettings>;
  sectionHeadings?: Partial<SectionHeadingSettings>;
  header?: Partial<HeaderSettings>;
  entryLayout?: Partial<EntryLayoutSettings>;
}

export const TEMPLATE_PRESETS: Record<
  TemplateId,
  { label: string; description: string; bestFor: string; overrides: TemplatePresetOverrides }
> = {
  modern: {
    label: "Modern Professional",
    description: "Color accent, clean layout, strong visual hierarchy.",
    bestFor: "Software Engineers, Product Managers",
    overrides: {
      template: "modern",
      colors: { accent: "#2563EB", headerColor: "#1a1f2e", borderColor: "#1a1f2e" },
      typography: { fontFamily: "Inter" },
      sectionHeadings: { capitalization: "uppercase", style: "text-only" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  professional: {
    label: "Professional Executive",
    description: "Centered serif header, classic layout, premium feel.",
    bestFor: "Senior Engineers, Managers, Directors",
    overrides: {
      template: "professional",
      colors: { accent: "#111827", headerColor: "#111827", borderColor: "#111827" },
      typography: { fontFamily: "Georgia" },
      sectionHeadings: { capitalization: "uppercase", style: "divider" },
      header: { alignment: "center", titlePosition: "below", titleStyle: "italic" },
    },
  },
  "ats-classic": {
    label: "ATS Classic",
    description: "Black & white, no decoration, maximum ATS compatibility.",
    bestFor: "Corporate roles, ATS systems",
    overrides: {
      template: "professional",
      colors: { accent: "#000000", headerColor: "#000000", borderColor: "#000000" },
      typography: { fontFamily: "Georgia" },
      sectionHeadings: { capitalization: "uppercase", style: "divider" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  "minimal-clean": {
    label: "Minimal Clean",
    description: "Large white space, thin dividers, distraction-free reading.",
    bestFor: "Any industry",
    overrides: {
      template: "modern",
      colors: { accent: "#374151", headerColor: "#111827", borderColor: "#d1d5db" },
      typography: { fontFamily: "Inter" },
      sectionHeadings: { capitalization: "uppercase", style: "divider" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  "technical-developer": {
    label: "Technical Developer",
    description: "Monospace accents, skills-first, technology-focused.",
    bestFor: "Software Engineers, DevOps, AI Engineers",
    overrides: {
      template: "modern",
      colors: { accent: "#0E7490", headerColor: "#1a1f2e", borderColor: "#1a1f2e" },
      typography: { fontFamily: "Source Sans Pro" },
      sectionHeadings: { capitalization: "uppercase", style: "left-border" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  executive: {
    label: "Premium Luxury",
    description: "Sophisticated layout, premium fonts, high-end design.",
    bestFor: "Executive positions, Consulting firms",
    overrides: {
      template: "professional",
      colors: { accent: "#1e293b", headerColor: "#0f172a", borderColor: "#1e293b" },
      typography: { fontFamily: "Merriweather" },
      sectionHeadings: { capitalization: "uppercase", style: "underline" },
      header: { alignment: "center", titlePosition: "below", titleStyle: "italic" },
    },
  },
  "startup-modern": {
    label: "Startup Modern",
    description: "Contemporary layout, strong branding, bold typography.",
    bestFor: "Startup applications, Product companies",
    overrides: {
      template: "modern",
      colors: { accent: "#7C3AED", headerColor: "#1a1f2e", borderColor: "#7C3AED" },
      typography: { fontFamily: "Poppins" },
      sectionHeadings: { capitalization: "capitalize", style: "left-border" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  creative: {
    label: "Creative Portfolio",
    description: "Visual sections, strong colors, modern bold design.",
    bestFor: "Designers, Marketing, Creators",
    overrides: {
      template: "modern",
      colors: { accent: "#15803D", headerColor: "#1a1f2e", borderColor: "#15803D" },
      typography: { fontFamily: "Montserrat" },
      sectionHeadings: { capitalization: "capitalize", style: "filled" },
      header: { alignment: "left", titlePosition: "below", titleStyle: "normal" },
    },
  },
  flowcv: {
    label: "FlowCV Modern",
    description: "Bold colored header band, light section banners, centered professional layout.",
    bestFor: "Any industry — visually rich, modern",
    overrides: {
      template: "flowcv",
      colors: {
        mode: "multi",
        accent: "#7c2d2d",
        headerColor: "#1a1f2e",
        borderColor: "#1a1f2e",
        multi: {
          primaryBackground: "#2d4a5e",
          secondaryBackground: "#ebebeb",
          primaryText: "#ffffff",
          secondaryText: "#94a3b8",
          accent: "#7c2d2d",
        },
        targets: {
          name: false,
          jobTitle: false,
          headings: true,
          headerIcons: false,
          dates: false,
          entrySubtitle: false,
          linkIcons: false,
        },
      },
      typography: { fontFamily: "Georgia" },
      sectionHeadings: { capitalization: "capitalize", style: "filled" },
      header: {
        alignment: "center",
        iconStyle: "none",
        titlePosition: "below",
        titleStyle: "normal",
        showDivider: false,
        detailsArrangement: "bullet",
      },
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// Kept for migration only — do not use in new code.
export interface ResumeTheme {
  template: "modern" | "professional";
  accent: string;
  fontFamily: string;
  fontScale: number;
  lineHeight: number;
}

export const defaultTheme = (): ResumeTheme => ({
  template: "modern",
  accent: "#2563EB",
  fontFamily: "Inter",
  fontScale: 1,
  lineHeight: 1.5,
});
