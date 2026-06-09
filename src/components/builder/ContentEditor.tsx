import { type SectionKey } from "@/lib/sections";
import {
  ImportPanel,
  PersonalPanel,
  SummaryPanel,
  SkillsPanel,
  ExperiencePanel,
  EducationPanel,
  ProjectsPanel,
  CertificationsPanel,
  LanguagesPanel,
} from "./sections";

export function ContentEditor({ section }: { section: SectionKey }) {
  switch (section) {
    case "import":
      return <ImportPanel />;
    case "personal":
      return <PersonalPanel />;
    case "summary":
      return <SummaryPanel />;
    case "skills":
      return <SkillsPanel />;
    case "experience":
      return <ExperiencePanel />;
    case "education":
      return <EducationPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "certifications":
      return <CertificationsPanel />;
    case "languages":
      return <LanguagesPanel />;
  }
}
