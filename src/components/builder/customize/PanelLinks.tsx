import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { ToggleRow } from "./_controls";

export function PanelLinks() {
  const { d, setLinks } = useDesignUpdater();
  return (
    <AccordionItem value="links" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Link className="h-4 w-4 text-muted-foreground" /> Link Styling
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pb-4">
        <ToggleRow
          label="Underline links"
          checked={d.links.underline}
          onChange={(v) => setLinks({ underline: v })}
        />
        <ToggleRow
          label="Blue link color"
          checked={d.links.blueColor}
          onChange={(v) => setLinks({ blueColor: v })}
        />
        <ToggleRow
          label="Show link icon"
          checked={d.links.showIcon}
          onChange={(v) => setLinks({ showIcon: v })}
        />
        <ToggleRow
          label="Clickable PDF links"
          checked={d.links.clickable}
          onChange={(v) => setLinks({ clickable: v })}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
