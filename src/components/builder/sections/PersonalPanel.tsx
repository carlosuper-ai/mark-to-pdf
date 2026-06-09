import type { PersonalDetails } from "@/lib/resume-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

const PERSONAL_FIELDS: {
  key: keyof PersonalDetails;
  label: string;
  type?: string;
  placeholder?: string;
}[] = [
  { key: "fullName", label: "Full Name", placeholder: "Alex Morgan" },
  { key: "title", label: "Professional Title", placeholder: "Senior Product Designer" },
  { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567" },
  { key: "location", label: "Location", placeholder: "City, Country" },
  { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/..." },
  { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/..." },
  { key: "website", label: "Website", type: "url", placeholder: "https://..." },
];

export function PersonalPanel() {
  const { resume, update } = useResumeEditor();
  const p = resume.data.personal;
  const set = (key: keyof PersonalDetails, value: string) =>
    update((d) => ({ ...d, personal: { ...d.personal, [key]: value } }));

  return (
    <PanelShell title="Personal Details">
      <div className="grid sm:grid-cols-2 gap-4">
        {PERSONAL_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type={f.type ?? "text"}
              value={p[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
