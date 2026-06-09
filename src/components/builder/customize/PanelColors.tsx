import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplets } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, OptionGrid, ColorPicker, ToggleRow } from "./_controls";

const COLOR_PRESETS = [
  { label: "Blue Professional", accent: "#2563EB", header: "#1a1f2e", border: "#1a1f2e" },
  { label: "Emerald", accent: "#15803D", header: "#1a1f2e", border: "#1a1f2e" },
  { label: "Purple Modern", accent: "#7C3AED", header: "#1a1f2e", border: "#7C3AED" },
  { label: "Slate Gray", accent: "#475569", header: "#1e293b", border: "#475569" },
  { label: "Charcoal", accent: "#374151", header: "#111827", border: "#374151" },
  { label: "Navy Executive", accent: "#1e40af", header: "#0f172a", border: "#1e40af" },
  { label: "Black ATS", accent: "#000000", header: "#000000", border: "#000000" },
];

export function PanelColors() {
  const { d, setColors, setMulti, setTargets } = useDesignUpdater();
  return (
    <AccordionItem value="colors" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" /> Colors
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <SectionTitle>Color Mode</SectionTitle>
          <OptionGrid
            options={[
              { value: "single", label: "Single" },
              { value: "multi", label: "Multi" },
            ]}
            value={d.colors.mode}
            onChange={(v) => setColors({ mode: v as typeof d.colors.mode })}
          />
        </div>

        {d.colors.mode === "single" ? (
          <div className="space-y-3">
            <ColorPicker
              label="Accent (headings, icons)"
              value={d.colors.accent}
              onChange={(v) => setColors({ accent: v })}
            />
            <ColorPicker
              label="Header (name, title)"
              value={d.colors.headerColor}
              onChange={(v) => setColors({ headerColor: v })}
            />
            <ColorPicker
              label="Border / dividers"
              value={d.colors.borderColor}
              onChange={(v) => setColors({ borderColor: v })}
            />
            <div className="space-y-2 pt-1">
              <SectionTitle>Presets</SectionTitle>
              <div className="grid grid-cols-1 gap-1.5">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() =>
                      setColors({
                        accent: p.accent,
                        headerColor: p.header,
                        borderColor: p.border,
                      })
                    }
                    className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-1.5 hover:border-primary/60 transition-colors text-left"
                  >
                    <div className="flex gap-1">
                      <div
                        className="h-4 w-4 rounded-full border border-white shadow-sm"
                        style={{ background: p.accent }}
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-white shadow-sm"
                        style={{ background: p.header }}
                      />
                    </div>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <ColorPicker
              label="Primary background"
              value={d.colors.multi.primaryBackground}
              onChange={(v) => setMulti({ primaryBackground: v })}
            />
            <ColorPicker
              label="Secondary background"
              value={d.colors.multi.secondaryBackground}
              onChange={(v) => setMulti({ secondaryBackground: v })}
            />
            <ColorPicker
              label="Primary text"
              value={d.colors.multi.primaryText}
              onChange={(v) => setMulti({ primaryText: v })}
            />
            <ColorPicker
              label="Secondary text"
              value={d.colors.multi.secondaryText}
              onChange={(v) => setMulti({ secondaryText: v })}
            />
            <ColorPicker
              label="Accent"
              value={d.colors.multi.accent}
              onChange={(v) => setMulti({ accent: v })}
            />
          </div>
        )}

        <div className="space-y-2 pt-1">
          <SectionTitle>Accent Color Targets</SectionTitle>
          {(
            [
              { key: "name", label: "Full name" },
              { key: "jobTitle", label: "Job title" },
              { key: "headings", label: "Section headings" },
              { key: "headerIcons", label: "Contact icons" },
              { key: "dates", label: "Dates" },
              { key: "entrySubtitle", label: "Employer / school" },
              { key: "linkIcons", label: "Link icons" },
            ] as { key: keyof typeof d.colors.targets; label: string }[]
          ).map(({ key, label }) => (
            <ToggleRow
              key={key}
              label={label}
              checked={d.colors.targets[key]}
              onChange={(v) => setTargets({ [key]: v })}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
