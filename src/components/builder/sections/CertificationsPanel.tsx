import { uid } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function CertificationsPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Certifications">
      <div className="space-y-3">
        {resume.data.certifications.map((c) => (
          <div key={c.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={c.name}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      certifications: d.certifications.map((x) =>
                        x.id === c.id ? { ...x, name: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Organization</Label>
                <Input
                  value={c.organization}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      certifications: d.certifications.map((x) =>
                        x.id === c.id ? { ...x, organization: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Issue Date</Label>
                <Input
                  value={c.issueDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      certifications: d.certifications.map((x) =>
                        x.id === c.id ? { ...x, issueDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input
                  value={c.url ?? ""}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      certifications: d.certifications.map((x) =>
                        x.id === c.id ? { ...x, url: ev.target.value } : x,
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
                  update((d) => ({
                    ...d,
                    certifications: d.certifications.filter((x) => x.id !== c.id),
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
              certifications: [
                ...d.certifications,
                { id: uid(), name: "", organization: "", issueDate: "" },
              ],
            }))
          }
        >
          <Plus /> Add Certification
        </Button>
      </div>
    </PanelShell>
  );
}
