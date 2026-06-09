import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type TemplateId, TEMPLATE_PRESETS } from "@/lib/resume-types";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";

export function PanelTemplates() {
  const { d, applyPreset } = useDesignUpdater();
  return (
    <AccordionItem value="templates" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" /> Design Templates
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="grid grid-cols-2 gap-2">
          {(
            Object.entries(TEMPLATE_PRESETS) as [
              TemplateId,
              (typeof TEMPLATE_PRESETS)[TemplateId],
            ][]
          ).map(([id, preset]) => {
            const isActive = d.template === (preset.overrides.template ?? id);
            const previewAccent = preset.overrides.colors?.accent ?? d.colors.accent;
            return (
              <button
                key={id}
                onClick={() => applyPreset(id)}
                className={cn(
                  "rounded-lg border-2 p-2.5 text-left transition-all hover:border-primary/50",
                  isActive ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <div className="aspect-[3/4] rounded bg-muted/50 mb-2 overflow-hidden relative">
                  <div className="absolute inset-1.5 bg-white shadow-sm rounded flex flex-col gap-1 p-1.5">
                    <div className="h-1.5 w-3/5 rounded-sm" style={{ background: previewAccent }} />
                    <div className="h-1 w-2/5 bg-muted/60 rounded-sm" />
                    <div className="mt-1 space-y-0.5">
                      {[1, 0.8, 0.6].map((_, i) => (
                        <div
                          key={i}
                          className="h-0.5 bg-muted/50 rounded-sm"
                          style={{ width: `${[100, 80, 60][i]}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold leading-tight">{preset.label}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
