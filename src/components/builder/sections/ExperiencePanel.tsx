import { uid } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Copy } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function ExperiencePanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Work Experience">
      <div className="space-y-3">
        {resume.data.experiences.map((e) => (
          <div key={e.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Job Title</Label>
                <Input
                  value={e.jobTitle}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, jobTitle: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Employer</Label>
                <Input
                  value={e.employer}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, employer: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={e.startDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, startDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={e.endDate}
                  disabled={e.current}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, endDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={e.current}
                    onChange={(ev) =>
                      update((d) => ({
                        ...d,
                        experiences: d.experiences.map((x) =>
                          x.id === e.id
                            ? {
                                ...x,
                                current: ev.target.checked,
                                endDate: ev.target.checked ? "" : x.endDate,
                              }
                            : x,
                        ),
                      }))
                    }
                  />
                  Current position
                </label>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Location</Label>
                <Input
                  value={e.location}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, location: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bullet points (one per line)</Label>
              <Textarea
                value={e.bullets.join("\n")}
                onChange={(ev) =>
                  update((d) => ({
                    ...d,
                    experiences: d.experiences.map((x) =>
                      x.id === e.id
                        ? {
                            ...x,
                            bullets: ev.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : x,
                    ),
                  }))
                }
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    experiences: [...d.experiences, { ...e, id: uid() }],
                  }))
                }
              >
                <Copy /> Duplicate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    experiences: d.experiences.filter((x) => x.id !== e.id),
                  }))
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
              experiences: [
                ...d.experiences,
                {
                  id: uid(),
                  jobTitle: "",
                  employer: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  bullets: [],
                },
              ],
            }))
          }
        >
          <Plus /> Add Experience
        </Button>
      </div>
    </PanelShell>
  );
}
