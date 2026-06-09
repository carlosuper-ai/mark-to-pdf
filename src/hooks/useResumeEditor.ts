import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import type { ResumeData } from "@/lib/resume-types";

export function useResumeEditor() {
  const resume = useActiveResume();
  const updateData = useResumeStore((s) => s.updateData);
  const replaceData = useResumeStore((s) => s.replaceData);
  const update = (updater: (d: ResumeData) => ResumeData) => updateData(resume.id, updater);
  return { resume, update, replaceData };
}
