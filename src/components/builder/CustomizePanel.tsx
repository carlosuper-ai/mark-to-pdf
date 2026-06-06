import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import type { TemplateId } from "@/lib/resume-types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "modern", name: "Modern", description: "Accent rule, sans-serif, two-tone sections." },
  { id: "professional", name: "Professional", description: "Centered serif heading, classic layout." },
];

const COLORS = ["#2563EB", "#0F172A", "#0E7490", "#15803D", "#B91C1C", "#7C3AED"];
const FONTS = ["Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Georgia"];

export function CustomizePanel() {
  const resume = useActiveResume();
  const updateTheme = useResumeStore((s) => s.updateTheme);
  const t = resume.theme;
  const set = (patch: Partial<typeof t>) => updateTheme(resume.id, (cur) => ({ ...cur, ...patch }));

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => set({ template: tpl.id })}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-colors hover:border-primary/60 bg-card",
                t.template === tpl.id ? "border-primary" : "border-border",
              )}
            >
              <div className="aspect-[3/4] rounded bg-surface mb-2 overflow-hidden relative">
                <div className="absolute inset-2 bg-white shadow-sm rounded-sm flex flex-col gap-1 p-2">
                  <div className="h-2 w-2/3 rounded-sm" style={{ background: t.accent }} />
                  <div className="h-1 w-1/2 bg-muted rounded-sm" />
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-muted rounded-sm" />
                    <div className="h-1 w-5/6 bg-muted rounded-sm" />
                    <div className="h-1 w-4/6 bg-muted rounded-sm" />
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium">{tpl.name}</div>
              <div className="text-xs text-muted-foreground">{tpl.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Accent color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set({ accent: c })}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                t.accent === c ? "border-foreground" : "border-transparent",
              )}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
          <label className="h-9 w-9 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden">
            <input
              type="color"
              value={t.accent}
              onChange={(e) => set({ accent: e.target.value })}
              className="w-12 h-12 cursor-pointer"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Typography</h3>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => set({ fontFamily: f })}
              className={cn(
                "rounded-md border px-3 py-2 text-sm text-left transition-colors hover:border-primary/60 bg-card",
                t.fontFamily === f ? "border-primary" : "border-border",
              )}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs"><Label>Font size</Label><span className="text-muted-foreground">{t.fontScale.toFixed(2)}×</span></div>
          <Slider
            min={0.9}
            max={1.15}
            step={0.01}
            value={[t.fontScale]}
            onValueChange={([v]) => set({ fontScale: v })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs"><Label>Line height</Label><span className="text-muted-foreground">{t.lineHeight.toFixed(2)}</span></div>
          <Slider
            min={1.3}
            max={1.8}
            step={0.05}
            value={[t.lineHeight]}
            onValueChange={([v]) => set({ lineHeight: v })}
          />
        </div>
      </section>
    </div>
  );
}