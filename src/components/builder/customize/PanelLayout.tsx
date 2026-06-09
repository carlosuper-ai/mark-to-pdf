import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useDesignUpdater } from "@/hooks/useDesignUpdater";
import { OptionGrid, SectionTitle } from "./_controls";
import { SortableSectionItem } from "./_sortables";

export function PanelLayout() {
  const { d, setLayout } = useDesignUpdater();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const order = d.layout.sectionOrder;
    const oldIdx = order.indexOf(active.id as string);
    const newIdx = order.indexOf(over.id as string);
    if (oldIdx < 0 || newIdx < 0) return;
    setLayout({ sectionOrder: arrayMove(order, oldIdx, newIdx) });
  };

  return (
    <AccordionItem value="layout" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <Layout className="h-4 w-4 text-muted-foreground" /> Layout
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-5 pb-4">
        <div className="space-y-2">
          <SectionTitle>Column Layout</SectionTitle>
          <OptionGrid
            options={[
              { value: "one", label: "One Column" },
              { value: "two", label: "Two Column" },
              { value: "mixed", label: "Mixed" },
            ]}
            value={d.layout.columns}
            onChange={(v) => setLayout({ columns: v as typeof d.layout.columns })}
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Section Order &amp; Visibility</SectionTitle>
          <p className="text-[10px] text-muted-foreground -mt-1">
            Drag to reorder · toggle to hide
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={d.layout.sectionOrder} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {d.layout.sectionOrder.map((key) => (
                  <SortableSectionItem
                    key={key}
                    id={key}
                    visible={d.layout.sectionVisibility[key] ?? true}
                    onToggle={() =>
                      setLayout({
                        sectionVisibility: {
                          ...d.layout.sectionVisibility,
                          [key]: !(d.layout.sectionVisibility[key] ?? true),
                        },
                      })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
