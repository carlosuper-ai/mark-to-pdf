import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { OptionGrid } from "./_controls";

export function PanelDocument() {
  const { d, setDoc } = useDesignUpdater();
  return (
    <AccordionItem value="document" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" /> Document Settings
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Language</Label>
            <Select value={d.document.language} onValueChange={(v) => setDoc({ language: v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  ["en", "English"],
                  ["es", "Spanish"],
                  ["fr", "French"],
                  ["de", "German"],
                  ["pt", "Portuguese"],
                  ["fil", "Filipino"],
                  ["ja", "Japanese"],
                  ["ko", "Korean"],
                  ["zh", "Chinese"],
                ].map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-xs">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date Format</Label>
            <Select
              value={d.document.dateFormat}
              onValueChange={(v) => setDoc({ dateFormat: v as typeof d.document.dateFormat })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "MMM YYYY",
                    "MMMM YYYY",
                    "MMM DD, YYYY",
                    "MMMM DD, YYYY",
                    "MM/DD/YYYY",
                    "DD/MM/YYYY",
                    "YYYY-MM-DD",
                  ] as const
                ).map((f) => (
                  <SelectItem key={f} value={f} className="text-xs">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Page Format</Label>
            <Select
              value={d.document.pageFormat}
              onValueChange={(v) => setDoc({ pageFormat: v as typeof d.document.pageFormat })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["A4", "Letter", "B5", "A5", "Legal", "Executive"] as const).map((f) => (
                  <SelectItem key={f} value={f} className="text-xs">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Orientation</Label>
            <OptionGrid
              options={[
                { value: "portrait", label: "Portrait" },
                { value: "landscape", label: "Landscape" },
              ]}
              value={d.document.pageOrientation}
              onChange={(v) => setDoc({ pageOrientation: v as typeof d.document.pageOrientation })}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
