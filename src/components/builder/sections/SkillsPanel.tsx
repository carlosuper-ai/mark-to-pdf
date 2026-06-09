import { uid } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function SkillsPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Skills" subtitle="Group skills by category for easy scanning.">
      <div className="space-y-3">
        {resume.data.skills.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-border p-3 space-y-2 bg-card">
            <div className="flex gap-2">
              <Input
                value={cat.name}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    skills: d.skills.map((c) =>
                      c.id === cat.id ? { ...c, name: e.target.value } : c,
                    ),
                  }))
                }
                placeholder="Category"
                className="font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  update((d) => ({ ...d, skills: d.skills.filter((c) => c.id !== cat.id) }))
                }
              >
                <Trash2 />
              </Button>
            </div>
            <Input
              value={cat.skills.join(", ")}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  skills: d.skills.map((c) =>
                    c.id === cat.id
                      ? {
                          ...c,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : c,
                  ),
                }))
              }
              placeholder="Comma-separated skills"
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              skills: [...d.skills, { id: uid(), name: "New Category", skills: [] }],
            }))
          }
        >
          <Plus /> Add Category
        </Button>
      </div>
    </PanelShell>
  );
}
