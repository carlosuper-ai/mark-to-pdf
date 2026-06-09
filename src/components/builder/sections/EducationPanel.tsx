import { uid } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function EducationPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Education">
      <div className="space-y-3">
        {resume.data.education.map((e) => (
          <div key={e.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Degree</Label>
                <Input
                  value={e.degree}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, degree: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>School</Label>
                <Input
                  value={e.school}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, school: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Year</Label>
                <Input
                  value={e.startDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, startDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Year</Label>
                <Input
                  value={e.endDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, endDate: ev.target.value } : x,
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
                  update((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }))
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
              education: [
                ...d.education,
                { id: uid(), degree: "", school: "", startDate: "", endDate: "" },
              ],
            }))
          }
        >
          <Plus /> Add Education
        </Button>
      </div>
    </PanelShell>
  );
}
