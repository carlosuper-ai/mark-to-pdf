import type { Resume, ResumeData, ResumeDesignSettings } from "../resume-types";

export interface ResumeState {
  resumes: Resume[];
  activeId: string;
  setActive: (id: string) => void;
  createResume: (name?: string) => string;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  updateData: (id: string, updater: (d: ResumeData) => ResumeData) => void;
  updateDesign: (id: string, updater: (d: ResumeDesignSettings) => ResumeDesignSettings) => void;
  replaceData: (id: string, data: ResumeData) => void;
}
