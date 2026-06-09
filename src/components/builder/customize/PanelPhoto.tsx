import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { SectionTitle, OptionGrid, ToggleRow, SliderRow } from "./_controls";

export function PanelPhoto() {
  const { d, setPhoto } = useDesignUpdater();
  return (
    <AccordionItem value="photo" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" /> Photo
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <ToggleRow
          label="Show profile photo"
          checked={d.photo.show}
          onChange={(v) => setPhoto({ show: v })}
        />
        {d.photo.show && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Photo URL</Label>
              <input
                type="url"
                placeholder="https://..."
                value={d.photo.url}
                onChange={(e) => setPhoto({ url: e.target.value })}
                className="w-full h-8 rounded-md border border-border bg-card px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <SectionTitle>Shape</SectionTitle>
              <OptionGrid
                options={[
                  { value: "circle", label: "Circle" },
                  { value: "rounded-square", label: "Rounded" },
                  { value: "square", label: "Square" },
                ]}
                value={d.photo.shape}
                onChange={(v) => setPhoto({ shape: v as typeof d.photo.shape })}
              />
            </div>
            <div className="space-y-2">
              <SectionTitle>Position</SectionTitle>
              <OptionGrid
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                value={d.photo.position}
                onChange={(v) => setPhoto({ position: v as typeof d.photo.position })}
              />
            </div>
            <SliderRow
              label="Size"
              value={d.photo.size}
              min={60}
              max={180}
              step={4}
              display={`${d.photo.size}px`}
              onChange={(v) => setPhoto({ size: v })}
            />
            <div className="space-y-2">
              <SectionTitle>Border</SectionTitle>
              <OptionGrid
                options={[
                  { value: "none", label: "None" },
                  { value: "thin", label: "Thin" },
                  { value: "medium", label: "Medium" },
                  { value: "thick", label: "Thick" },
                ]}
                value={d.photo.border}
                onChange={(v) => setPhoto({ border: v as typeof d.photo.border })}
              />
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
