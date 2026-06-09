import type { Resume } from "@/lib/resume-types";
import { ModernTemplate } from "@/components/builder/templates/Modern";
import { ProfessionalTemplate } from "@/components/builder/templates/Professional";

const PROFESSIONAL_TEMPLATES = new Set(["professional", "ats-classic", "executive", "flowcv"]);

export function ResumeRenderer({
  resume,
  printMode = false,
}: {
  resume: Resume;
  printMode?: boolean;
}) {
  if (PROFESSIONAL_TEMPLATES.has(resume.design.template)) {
    return <ProfessionalTemplate resume={resume} printMode={printMode} />;
  }
  return <ModernTemplate resume={resume} />;
}
