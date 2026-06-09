import { uid } from "@/lib/resume-store";
import type { ProficiencyLevel } from "@/lib/resume-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  "Native",
  "Fluent",
  "Professional",
  "Intermediate",
  "Beginner",
];

export function LanguagesPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell title="Languages">
      <div className="space-y-2">
        {resume.data.languages.map((l) => (
          <div key={l.id} className="flex gap-2 items-center">
            <Input
              value={l.language}
              onChange={(ev) =>
                update((d) => ({
                  ...d,
                  languages: d.languages.map((x) =>
                    x.id === l.id ? { ...x, language: ev.target.value } : x,
                  ),
                }))
              }
              placeholder="Language"
              className="flex-1"
            />
            <Select
              value={l.proficiency}
              onValueChange={(v) =>
                update((d) => ({
                  ...d,
                  languages: d.languages.map((x) =>
                    x.id === l.id ? { ...x, proficiency: v as ProficiencyLevel } : x,
                  ),
                }))
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map((lv) => (
                  <SelectItem key={lv} value={lv}>
                    {lv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                update((d) => ({ ...d, languages: d.languages.filter((x) => x.id !== l.id) }))
              }
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              languages: [...d.languages, { id: uid(), language: "", proficiency: "Professional" }],
            }))
          }
        >
          <Plus /> Add Language
        </Button>
      </div>
    </PanelShell>
  );
}
