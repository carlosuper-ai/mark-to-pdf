import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Resume,
  type ResumeData,
  type ResumeTheme,
  defaultTheme,
  emptyResumeData,
} from "./resume-types";

const uid = () => Math.random().toString(36).slice(2, 10);

const sampleData = (): ResumeData => ({
  personal: {
    fullName: "Alex Morgan",
    title: "Senior Product Designer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-1098",
    location: "Brooklyn, NY",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "",
    website: "https://alexmorgan.design",
  },
  summary:
    "Product designer with 8+ years shipping consumer and B2B software. I partner with engineering and research to turn ambiguous problems into focused, testable interfaces.",
  skills: [
    {
      id: uid(),
      name: "Design",
      skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    },
    {
      id: uid(),
      name: "Tools",
      skills: ["Notion", "Linear", "Framer", "Webflow"],
    },
  ],
  experiences: [
    {
      id: uid(),
      jobTitle: "Senior Product Designer",
      employer: "Northwind Labs",
      location: "Remote",
      startDate: "2022-03",
      endDate: "",
      current: true,
      bullets: [
        "Led the redesign of the onboarding flow, lifting activation by 31%.",
        "Built and maintained the cross-platform design system used by 40+ engineers.",
      ],
    },
    {
      id: uid(),
      jobTitle: "Product Designer",
      employer: "Bluepeak",
      location: "New York, NY",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Shipped the analytics dashboard adopted by 12,000+ weekly users.",
        "Ran weekly research sessions and synthesized findings into a public insights repo.",
      ],
    },
  ],
  education: [
    {
      id: uid(),
      degree: "B.F.A., Graphic Design",
      school: "Rhode Island School of Design",
      startDate: "2011",
      endDate: "2015",
    },
  ],
  projects: [],
  certifications: [],
  languages: [
    { id: uid(), language: "English", proficiency: "Native" },
    { id: uid(), language: "Spanish", proficiency: "Professional" },
  ],
});

export interface ResumeState {
  resumes: Resume[];
  activeId: string;
  setActive: (id: string) => void;
  createResume: (name?: string) => string;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  updateData: (id: string, updater: (d: ResumeData) => ResumeData) => void;
  updateTheme: (id: string, updater: (t: ResumeTheme) => ResumeTheme) => void;
  replaceData: (id: string, data: ResumeData) => void;
}

const firstId = uid();
const initialResume: Resume = {
  id: firstId,
  name: "My Resume",
  data: sampleData(),
  theme: defaultTheme(),
  updatedAt: Date.now(),
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [initialResume],
      activeId: firstId,
      setActive: (id) => set({ activeId: id }),
      createResume: (name) => {
        const id = uid();
        const resume: Resume = {
          id,
          name: name ?? "Untitled Resume",
          data: emptyResumeData(),
          theme: defaultTheme(),
          updatedAt: Date.now(),
        };
        set({ resumes: [...get().resumes, resume], activeId: id });
        return id;
      },
      duplicateResume: (id) => {
        const src = get().resumes.find((r) => r.id === id);
        if (!src) return;
        const copy: Resume = {
          ...src,
          id: uid(),
          name: src.name + " (copy)",
          updatedAt: Date.now(),
        };
        set({ resumes: [...get().resumes, copy], activeId: copy.id });
      },
      deleteResume: (id) => {
        const remaining = get().resumes.filter((r) => r.id !== id);
        if (remaining.length === 0) {
          const nid = uid();
          set({
            resumes: [
              {
                id: nid,
                name: "My Resume",
                data: emptyResumeData(),
                theme: defaultTheme(),
                updatedAt: Date.now(),
              },
            ],
            activeId: nid,
          });
          return;
        }
        set({
          resumes: remaining,
          activeId:
            get().activeId === id ? remaining[0].id : get().activeId,
        });
      },
      renameResume: (id, name) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id ? { ...r, name, updatedAt: Date.now() } : r,
          ),
        }),
      updateData: (id, updater) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id
              ? { ...r, data: updater(r.data), updatedAt: Date.now() }
              : r,
          ),
        }),
      updateTheme: (id, updater) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id
              ? { ...r, theme: updater(r.theme), updatedAt: Date.now() }
              : r,
          ),
        }),
      replaceData: (id, data) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id ? { ...r, data, updatedAt: Date.now() } : r,
          ),
        }),
    }),
    { name: "resume-builder-store" },
  ),
);

export const useActiveResume = (): Resume => {
  const { resumes, activeId } = useResumeStore();
  return resumes.find((r) => r.id === activeId) ?? resumes[0];
};

export { uid };