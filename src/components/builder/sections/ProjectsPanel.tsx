import { uid } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function ProjectsPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Projects">
      <div className="space-y-3">
        {resume.data.projects.map((p) => (
          <div key={p.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={p.name}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id ? { ...x, name: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={p.role}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id ? { ...x, role: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={p.url}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id ? { ...x, url: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={p.technologies.join(", ")}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id
                          ? {
                              ...x,
                              technologies: ev.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }
                          : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={p.description}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id ? { ...x, description: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== p.id) }))
                }
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              projects: [
                ...d.projects,
                { id: uid(), name: "", role: "", technologies: [], url: "", description: "" },
              ],
            }))
          }
        >
          <Plus /> Add Project
        </Button>
      </div>
    </PanelShell>
  );
}
