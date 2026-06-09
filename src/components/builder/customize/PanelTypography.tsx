import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FONT_LIST } from "@/lib/resume-types";
import { cn } from "@/lib/utils";
import { Type } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, SliderRow } from "./_controls";

export function PanelTypography() {
  const { d, setTypo } = useDesignUpdater();
  return (
    <AccordionItem value="typography" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Type className="h-4 w-4 text-muted-foreground" /> Typography
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <SectionTitle>Font Family</SectionTitle>
          <div className="grid grid-cols-2 gap-1.5">
            {FONT_LIST.map((f) => (
              <button
                key={f}
                onClick={() => setTypo({ fontFamily: f })}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 text-xs text-left truncate transition-colors hover:border-primary/60",
                  d.typography.fontFamily === f
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : "border-border bg-card",
                )}
                style={{ fontFamily: f }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <SectionTitle>Font Sizes</SectionTitle>
          <SliderRow
            label="Base size"
            value={d.typography.baseFontSize}
            min={9}
            max={16}
            step={0.5}
            display={`${d.typography.baseFontSize}pt`}
            onChange={(v) => setTypo({ baseFontSize: v })}
          />
          <SliderRow
            label="Full name"
            value={d.typography.nameFontSize}
            min={18}
            max={40}
            step={1}
            display={`${d.typography.nameFontSize}pt`}
            onChange={(v) => setTypo({ nameFontSize: v })}
          />
          <SliderRow
            label="Professional title"
            value={d.typography.titleFontSize}
            min={12}
            max={24}
            step={0.5}
            display={`${d.typography.titleFontSize}pt`}
            onChange={(v) => setTypo({ titleFontSize: v })}
          />
          <SliderRow
            label="Section headings"
            value={d.typography.sectionHeadingSize}
            min={12}
            max={24}
            step={0.5}
            display={`${d.typography.sectionHeadingSize}pt`}
            onChange={(v) => setTypo({ sectionHeadingSize: v })}
          />
          <SliderRow
            label="Entry header"
            value={d.typography.entryHeaderSize}
            min={9}
            max={24}
            step={0.5}
            display={`${d.typography.entryHeaderSize}pt`}
            onChange={(v) => setTypo({ entryHeaderSize: v })}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
