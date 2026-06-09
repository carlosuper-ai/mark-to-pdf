import { Accordion } from "@/components/ui/accordion";
import {
  PanelDocument,
  PanelTemplates,
  PanelLayout,
  PanelTypography,
  PanelSpacing,
  PanelEntryLayout,
  PanelHeadings,
  PanelColors,
  PanelHeader,
  PanelPhoto,
  PanelLinks,
  PanelFooter,
} from "./customize";

export function CustomizePanel() {
  return (
    <div className="space-y-1 pb-16">
      <div className="mb-5">
        <h2 className="text-base font-semibold">Customize</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          All changes update the preview instantly.
        </p>
      </div>
      <Accordion
        type="multiple"
        defaultValue={["templates", "colors", "typography"]}
        className="space-y-1"
      >
        <PanelDocument />
        <PanelTemplates />
        <PanelLayout />
        <PanelTypography />
        <PanelSpacing />
        <PanelEntryLayout />
        <PanelHeadings />
        <PanelColors />
        <PanelHeader />
        <PanelPhoto />
        <PanelLinks />
        <PanelFooter />
      </Accordion>
    </div>
  );
}
