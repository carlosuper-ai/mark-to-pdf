import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type EntryTemplate } from "@/lib/resume-types";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, OptionGrid, ToggleRow } from "./_controls";
import { EntryTemplatePreview } from "./_previews";

export function PanelEntryLayout() {
  const { d, setEntry } = useDesignUpdater();
  return (
    <AccordionItem value="entry" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" /> Entry Layout
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <SectionTitle>Entry Template</SectionTitle>
          <p className="text-[10px] text-muted-foreground -mt-1">
            Controls how job title, employer, date &amp; location are arranged
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["A", "B", "C", "D"] as EntryTemplate[]).map((t) => (
              <button
                key={t}
                onClick={() => setEntry({ entryTemplate: t })}
                className={cn(
                  "rounded-lg border-2 p-2 text-left transition-all hover:border-primary/50",
                  (d.entryLayout.entryTemplate ?? "A") === t
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card",
                )}
              >
                <EntryTemplatePreview
                  template={t}
                  active={(d.entryLayout.entryTemplate ?? "A") === t}
                />
                <div className="text-[10px] font-semibold mt-1.5 text-center text-foreground/70">
                  {t === "A"
                    ? "Standard"
                    : t === "B"
                      ? "Date First"
                      : t === "C"
                        ? "3-Column"
                        : "Stacked"}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle>Subtitle Style</SectionTitle>
          <OptionGrid
            options={[
              { value: "normal", label: "Normal" },
              { value: "bold", label: "Bold" },
              { value: "italic", label: "Italic" },
              { value: "bold-italic", label: "Bold Italic" },
            ]}
            value={d.entryLayout.subtitleStyle}
            onChange={(v) => setEntry({ subtitleStyle: v as typeof d.entryLayout.subtitleStyle })}
          />
        </div>
        <ToggleRow
          label="Indent body content"
          checked={d.entryLayout.indentBody}
          onChange={(v) => setEntry({ indentBody: v })}
        />
        <div className="space-y-2">
          <SectionTitle>List Style</SectionTitle>
          <OptionGrid
            options={[
              { value: "bullet", label: "• Bullet" },
              { value: "hyphen", label: "– Hyphen" },
              { value: "square", label: "▪ Square" },
              { value: "arrow", label: "→ Arrow" },
            ]}
            value={d.entryLayout.listStyle}
            onChange={(v) => setEntry({ listStyle: v as typeof d.entryLayout.listStyle })}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
