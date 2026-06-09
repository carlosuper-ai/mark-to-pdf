import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  experiences: "Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  languages: "Languages",
};

const CONTACT_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  location: "Location",
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
};

export function SortableSectionItem({
  id,
  visible,
  onToggle,
}: {
  id: string;
  visible: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5",
        isDragging && "opacity-50 shadow-lg z-10",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <Checkbox id={`sec-${id}`} checked={visible} onCheckedChange={onToggle} />
      <label htmlFor={`sec-${id}`} className="flex-1 text-xs cursor-pointer select-none">
        {SECTION_LABELS[id] ?? id}
      </label>
    </div>
  );
}

export function SortableContactItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5",
        isDragging && "opacity-50 shadow-lg z-10",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="text-xs">{CONTACT_LABELS[id] ?? id}</span>
    </div>
  );
}
