import { Textarea } from "@/components/ui/textarea";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

export function SummaryPanel() {
  const { resume, update } = useResumeEditor();
  return (
    <PanelShell
      title="Summary"
      subtitle="2–4 sentences. Lead with role, years of experience, and your strongest impact."
    >
      <Textarea
        value={resume.data.summary}
        onChange={(e) => update((d) => ({ ...d, summary: e.target.value }))}
        className="min-h-[200px]"
        placeholder="Senior engineer with 8+ years building..."
      />
      <div className="text-xs text-muted-foreground text-right">
        {resume.data.summary.length} characters
      </div>
    </PanelShell>
  );
}
