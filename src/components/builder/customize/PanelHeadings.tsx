import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type HeadingStyle } from "@/lib/resume-types";
import { cn } from "@/lib/utils";
import { Heading } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, OptionGrid } from "./_controls";
import { HeadingPreview } from "./_previews";

export function PanelHeadings() {
  const { d, setHeadings } = useDesignUpdater();
  return (
    <AccordionItem value="headings" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Heading className="h-4 w-4 text-muted-foreground" /> Section Headings
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <SectionTitle>Capitalization</SectionTitle>
          <OptionGrid
            options={[
              { value: "original", label: "Original" },
              { value: "capitalize", label: "Capitalize" },
              { value: "uppercase", label: "UPPERCASE" },
            ]}
            value={d.sectionHeadings.capitalization}
            onChange={(v) =>
              setHeadings({ capitalization: v as typeof d.sectionHeadings.capitalization })
            }
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Style</SectionTitle>
          <div className="grid grid-cols-1 gap-1.5">
            {(
              [
                { value: "text-only", label: "Text Only" },
                { value: "underline", label: "Underline" },
                { value: "left-border", label: "Left Border" },
                { value: "filled", label: "Filled Background" },
                { value: "divider", label: "Divider Line" },
              ] as { value: HeadingStyle; label: string }[]
            ).map((s) => (
              <button
                key={s.value}
                onClick={() => setHeadings({ style: s.value })}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors hover:border-primary/60",
                  d.sectionHeadings.style === s.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card",
                )}
              >
                <HeadingPreview style={s.value} accent={d.colors.accent} />
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
