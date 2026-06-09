import { defaultDesignSettings } from "../resume-types";
import type { ResumeDesignSettings } from "../resume-types";

export function migrateStore(state: unknown, version: number): unknown {
  const s = state as {
    resumes?: Array<Record<string, unknown>>;
    activeId?: string;
  };
  const base = defaultDesignSettings();

  if (!Array.isArray(s.resumes)) return s;

  s.resumes = s.resumes.map((r) => {
    // v0→v2: no design at all — build from legacy theme
    if (!r.design) {
      const legacy = r.theme as
        | { template?: string; accent?: string; fontFamily?: string; lineHeight?: number }
        | undefined;
      return {
        ...r,
        design: {
          ...base,
          template: (legacy?.template as ResumeDesignSettings["template"]) ?? base.template,
          colors: { ...base.colors, accent: legacy?.accent ?? base.colors.accent },
          typography: {
            ...base.typography,
            fontFamily: legacy?.fontFamily ?? base.typography.fontFamily,
          },
          spacing: {
            ...base.spacing,
            lineHeight: legacy?.lineHeight ?? base.spacing.lineHeight,
          },
        } satisfies ResumeDesignSettings,
      };
    }

    // v2→v3: fill in new fields that didn't exist yet
    if (version < 3) {
      const d = r.design as Record<string, unknown>;
      const oldSpacing = (d.spacing ?? {}) as Record<string, unknown>;
      const oldColors = (d.colors ?? {}) as Record<string, unknown>;
      const oldHeader = (d.header ?? {}) as Record<string, unknown>;

      return {
        ...r,
        design: {
          ...base,
          ...d,
          spacing: {
            ...base.spacing,
            ...oldSpacing,
            sectionGap:
              (oldSpacing.sectionGap as number | undefined) ??
              (oldSpacing.elementSpacing as number | undefined) ??
              base.spacing.sectionGap,
          },
          colors: {
            ...base.colors,
            ...oldColors,
            mode: ((oldColors.mode as string | undefined) ??
              "single") as ResumeDesignSettings["colors"]["mode"],
            multi:
              (oldColors.multi as ResumeDesignSettings["colors"]["multi"] | undefined) ??
              base.colors.multi,
            targets:
              (oldColors.targets as ResumeDesignSettings["colors"]["targets"] | undefined) ??
              base.colors.targets,
          },
          header: {
            ...base.header,
            ...oldHeader,
            nameStyle: ((oldHeader.nameStyle as string | undefined) ??
              "bold") as ResumeDesignSettings["header"]["nameStyle"],
            titlePosition: ((oldHeader.titlePosition as string | undefined) ??
              "below") as ResumeDesignSettings["header"]["titlePosition"],
            titleStyle: ((oldHeader.titleStyle as string | undefined) ??
              "normal") as ResumeDesignSettings["header"]["titleStyle"],
            detailsArrangement: (["icons", "bullet", "vertical-bar"].includes(
              oldHeader.detailsArrangement as string,
            )
              ? oldHeader.detailsArrangement
              : "bullet") as ResumeDesignSettings["header"]["detailsArrangement"],
          },
        } satisfies ResumeDesignSettings,
      };
    }

    // v3→v4: split marginHorizontal/marginVertical into four independent margins
    if (version < 4) {
      const d = r.design as Record<string, unknown>;
      const oldSpacing = (d.spacing ?? {}) as Record<string, unknown>;
      const n = (k: string, fallback: number) => (oldSpacing[k] as number | undefined) ?? fallback;

      return {
        ...r,
        design: {
          ...base,
          ...d,
          spacing: {
            lineHeight: n("lineHeight", base.spacing.lineHeight),
            sectionGap: n("sectionGap", base.spacing.sectionGap),
            marginTop: n("marginTop", n("marginVertical", base.spacing.marginTop)),
            marginBottom: n("marginBottom", n("marginVertical", base.spacing.marginBottom)),
            marginLeft: n("marginLeft", n("marginHorizontal", base.spacing.marginLeft)),
            marginRight: n("marginRight", n("marginHorizontal", base.spacing.marginRight)),
          },
        } satisfies ResumeDesignSettings,
      };
    }

    return r;
  });

  return s;
}
