import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlignLeft } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, SliderRow } from "./_controls";
import { MarginDiagram } from "./_previews";

export function PanelSpacing() {
  const { d, setSpacing } = useDesignUpdater();
  return (
    <AccordionItem value="spacing" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4 text-muted-foreground" /> Spacing
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-4 space-y-3">
        <SliderRow
          label="Line height"
          value={d.spacing.lineHeight}
          min={1.0}
          max={2.0}
          step={0.05}
          display={d.spacing.lineHeight.toFixed(2)}
          onChange={(v) => setSpacing({ lineHeight: v })}
        />
        <SliderRow
          label="Section gap"
          value={d.spacing.sectionGap}
          min={0}
          max={40}
          step={2}
          display={`${d.spacing.sectionGap}px`}
          onChange={(v) => setSpacing({ sectionGap: v })}
        />
        <div className="h-px bg-border" />
        <SectionTitle>Page Margins</SectionTitle>
        <MarginDiagram
          top={d.spacing.marginTop}
          bottom={d.spacing.marginBottom}
          left={d.spacing.marginLeft}
          right={d.spacing.marginRight}
        />
        <SliderRow
          label="Top"
          value={d.spacing.marginTop}
          min={0}
          max={80}
          step={2}
          display={`${d.spacing.marginTop}px`}
          onChange={(v) => setSpacing({ marginTop: v })}
        />
        <SliderRow
          label="Bottom"
          value={d.spacing.marginBottom}
          min={0}
          max={80}
          step={2}
          display={`${d.spacing.marginBottom}px`}
          onChange={(v) => setSpacing({ marginBottom: v })}
        />
        <SliderRow
          label="Left"
          value={d.spacing.marginLeft}
          min={0}
          max={80}
          step={2}
          display={`${d.spacing.marginLeft}px`}
          onChange={(v) => setSpacing({ marginLeft: v })}
        />
        <SliderRow
          label="Right"
          value={d.spacing.marginRight}
          min={0}
          max={80}
          step={2}
          display={`${d.spacing.marginRight}px`}
          onChange={(v) => setSpacing({ marginRight: v })}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
