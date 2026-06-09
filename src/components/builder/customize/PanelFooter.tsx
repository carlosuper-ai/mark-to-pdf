import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Hash } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, OptionGrid, ToggleRow } from "./_controls";

export function PanelFooter() {
  const { d, setFooter } = useDesignUpdater();
  return (
    <AccordionItem value="footer" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" /> Footer
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pb-4">
        <ToggleRow
          label="Show page numbers"
          checked={d.footer.showPageNumbers}
          onChange={(v) => setFooter({ showPageNumbers: v })}
        />
        <ToggleRow
          label="Show email"
          checked={d.footer.showEmail}
          onChange={(v) => setFooter({ showEmail: v })}
        />
        <ToggleRow
          label="Show name"
          checked={d.footer.showName}
          onChange={(v) => setFooter({ showName: v })}
        />
        <div className="space-y-2 pt-1">
          <SectionTitle>Alignment</SectionTitle>
          <OptionGrid
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            value={d.footer.alignment}
            onChange={(v) => setFooter({ alignment: v as typeof d.footer.alignment })}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
