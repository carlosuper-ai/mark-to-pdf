import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultDesignSettings, emptyResumeData } from "../resume-types";
import type { Resume } from "../resume-types";
import { uid } from "../uid";
import { STORE_KEY, DEFAULT_RESUME_NAME, DEFAULT_UNTITLED_NAME } from "@/constants/store";
import type { ResumeState } from "./types";
import { sampleData } from "./sample-data";
import { migrateStore } from "./migrations";

const firstId = uid();
const initialResume: Resume = {
  id: firstId,
  name: DEFAULT_RESUME_NAME,
  data: sampleData(),
  design: defaultDesignSettings(),
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
          name: name ?? DEFAULT_UNTITLED_NAME,
          data: emptyResumeData(),
          design: defaultDesignSettings(),
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
                name: DEFAULT_RESUME_NAME,
                data: emptyResumeData(),
                design: defaultDesignSettings(),
                updatedAt: Date.now(),
              },
            ],
            activeId: nid,
          });
          return;
        }
        set({
          resumes: remaining,
          activeId: get().activeId === id ? remaining[0].id : get().activeId,
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
            r.id === id ? { ...r, data: updater(r.data), updatedAt: Date.now() } : r,
          ),
        }),

      updateDesign: (id, updater) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id ? { ...r, design: updater(r.design), updatedAt: Date.now() } : r,
          ),
        }),

      replaceData: (id, data) =>
        set({
          resumes: get().resumes.map((r) =>
            r.id === id ? { ...r, data, updatedAt: Date.now() } : r,
          ),
        }),
    }),
    {
      name: STORE_KEY,
      version: 4,
      migrate: migrateStore,
    },
  ),
);

/**
 * Selects the active resume using a Zustand selector so consumers only
 * re-render when their specific resume object changes — not on every store update.
 * `.find()` returns the existing array element reference, so Object.is equality
 * holds as long as the active resume's data is unchanged.
 */
export const useActiveResume = (): Resume =>
  useResumeStore((state) => state.resumes.find((r) => r.id === state.activeId) ?? state.resumes[0]);
