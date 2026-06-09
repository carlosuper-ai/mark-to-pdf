import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type IconFrameStyle, DEFAULT_CONTACT_ORDER } from "@/lib/resume-types";
import { User } from "lucide-react";
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
import { SectionTitle, OptionGrid, ToggleRow } from "./_controls";
import { SortableContactItem } from "./_sortables";

export function PanelHeader() {
  const { d, setHeader } = useDesignUpdater();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleContactDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const order = d.header.contactOrder?.length
      ? d.header.contactOrder
      : [...DEFAULT_CONTACT_ORDER];
    const oldIdx = order.indexOf(active.id as string);
    const newIdx = order.indexOf(over.id as string);
    if (oldIdx < 0 || newIdx < 0) return;
    setHeader({ contactOrder: arrayMove(order, oldIdx, newIdx) });
  };

  return (
    <AccordionItem value="header" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
        <span className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" /> Header
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <SectionTitle>Alignment</SectionTitle>
          <OptionGrid
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
            ]}
            value={d.header.alignment}
            onChange={(v) => setHeader({ alignment: v as typeof d.header.alignment })}
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Name Style</SectionTitle>
          <OptionGrid
            options={[
              { value: "bold", label: "Bold" },
              { value: "normal", label: "Normal" },
            ]}
            value={d.header.nameStyle}
            onChange={(v) => setHeader({ nameStyle: v as typeof d.header.nameStyle })}
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Title Position</SectionTitle>
          <OptionGrid
            options={[
              { value: "below", label: "Below Name" },
              { value: "same-line", label: "Same Line" },
            ]}
            value={d.header.titlePosition}
            onChange={(v) => setHeader({ titlePosition: v as typeof d.header.titlePosition })}
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Title Style</SectionTitle>
          <OptionGrid
            options={[
              { value: "normal", label: "Normal" },
              { value: "italic", label: "Italic" },
            ]}
            value={d.header.titleStyle}
            onChange={(v) => setHeader({ titleStyle: v as typeof d.header.titleStyle })}
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Contact Layout</SectionTitle>
          <OptionGrid
            options={[
              { value: "bullet", label: "Bullet" },
              { value: "vertical-bar", label: "Vertical Bar" },
              { value: "icons", label: "Icons (list)" },
            ]}
            value={d.header.detailsArrangement}
            onChange={(v) =>
              setHeader({ detailsArrangement: v as typeof d.header.detailsArrangement })
            }
          />
        </div>
        <div className="space-y-2">
          <SectionTitle>Icon Frame Style</SectionTitle>
          <OptionGrid
            cols={2}
            options={[
              { value: "none", label: "None" },
              { value: "circle-filled", label: "● Circle" },
              { value: "rounded-filled", label: "▪ Rounded" },
              { value: "square-filled", label: "■ Square" },
              { value: "circle-outline", label: "○ Circle Out" },
              { value: "rounded-outline", label: "□ Rounded Out" },
            ]}
            value={d.header.iconStyle}
            onChange={(v) => setHeader({ iconStyle: v as IconFrameStyle })}
          />
        </div>
        {d.header.detailsArrangement !== "icons" && (
          <div className="space-y-2">
            <SectionTitle>Contact Separator</SectionTitle>
            <OptionGrid
              cols={3}
              options={[
                { value: "·", label: "·" },
                { value: "|", label: "|" },
                { value: "–", label: "–" },
              ]}
              value={d.header.contactSeparator}
              onChange={(v) => setHeader({ contactSeparator: v })}
            />
          </div>
        )}
        <ToggleRow
          label="Show divider line"
          checked={d.header.showDivider}
          onChange={(v) => setHeader({ showDivider: v })}
        />
        <div className="space-y-2">
          <SectionTitle>Contact Field Order</SectionTitle>
          <p className="text-[10px] text-muted-foreground -mt-1">Drag to reorder contact details</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleContactDragEnd}
          >
            <SortableContext
              items={d.header.contactOrder?.length ? d.header.contactOrder : DEFAULT_CONTACT_ORDER}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {(d.header.contactOrder?.length
                  ? d.header.contactOrder
                  : DEFAULT_CONTACT_ORDER
                ).map((key) => (
                  <SortableContactItem key={key} id={key} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
