import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import type { ResumeDesignSettings, TemplateId } from "@/lib/resume-types";
import { TEMPLATE_PRESETS } from "@/lib/resume-types";

export function useDesignUpdater() {
  const resume = useActiveResume();
  const updateDesign = useResumeStore((s) => s.updateDesign);
  const d = resume.design;

  const set = (patch: Partial<ResumeDesignSettings>) =>
    updateDesign(resume.id, (cur) => ({ ...cur, ...patch }));

  const setDoc = (p: Partial<typeof d.document>) => set({ document: { ...d.document, ...p } });
  const setLayout = (p: Partial<typeof d.layout>) => set({ layout: { ...d.layout, ...p } });
  const setTypo = (p: Partial<typeof d.typography>) =>
    set({ typography: { ...d.typography, ...p } });
  const setSpacing = (p: Partial<typeof d.spacing>) => set({ spacing: { ...d.spacing, ...p } });
  const setEntry = (p: Partial<typeof d.entryLayout>) =>
    set({ entryLayout: { ...d.entryLayout, ...p } });
  const setHeadings = (p: Partial<typeof d.sectionHeadings>) =>
    set({ sectionHeadings: { ...d.sectionHeadings, ...p } });
  const setColors = (p: Partial<typeof d.colors>) => set({ colors: { ...d.colors, ...p } });
  const setMulti = (p: Partial<typeof d.colors.multi>) =>
    setColors({ multi: { ...d.colors.multi, ...p } });
  const setTargets = (p: Partial<typeof d.colors.targets>) =>
    setColors({ targets: { ...d.colors.targets, ...p } });
  const setHeader = (p: Partial<typeof d.header>) => set({ header: { ...d.header, ...p } });
  const setPhoto = (p: Partial<typeof d.photo>) => set({ photo: { ...d.photo, ...p } });
  const setLinks = (p: Partial<typeof d.links>) => set({ links: { ...d.links, ...p } });
  const setFooter = (p: Partial<typeof d.footer>) => set({ footer: { ...d.footer, ...p } });

  const applyPreset = (id: TemplateId) => {
    const ov = TEMPLATE_PRESETS[id]?.overrides;
    if (!ov) return;
    updateDesign(resume.id, (cur) => ({
      ...cur,
      ...(ov.template ? { template: ov.template } : {}),
      colors: ov.colors ? { ...cur.colors, ...ov.colors } : cur.colors,
      typography: ov.typography ? { ...cur.typography, ...ov.typography } : cur.typography,
      spacing: ov.spacing ? { ...cur.spacing, ...ov.spacing } : cur.spacing,
      sectionHeadings: ov.sectionHeadings
        ? { ...cur.sectionHeadings, ...ov.sectionHeadings }
        : cur.sectionHeadings,
      header: ov.header ? { ...cur.header, ...ov.header } : cur.header,
      entryLayout: ov.entryLayout ? { ...cur.entryLayout, ...ov.entryLayout } : cur.entryLayout,
    }));
  };

  return {
    d,
    resume,
    setDoc,
    setLayout,
    setTypo,
    setSpacing,
    setEntry,
    setHeadings,
    setColors,
    setMulti,
    setTargets,
    setHeader,
    setPhoto,
    setLinks,
    setFooter,
    applyPreset,
  };
}
