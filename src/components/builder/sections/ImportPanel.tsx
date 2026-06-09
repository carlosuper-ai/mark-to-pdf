import { useState } from "react";
import { parseMarkdownResume } from "@/lib/markdown-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { PanelShell } from "./PanelShell";

const SAMPLE_MARKDOWN = [
  "# Jordan Ellis",
  "",
  "**Senior Full Stack Engineer**",
  "",
  "jordan.ellis@example.com | +1 (555) 201-4893 | San Francisco, CA",
  "https://linkedin.com/in/jordanellis | https://github.com/jordanellis",
  "",
  "## Summary",
  "",
  "Full-stack engineer with 9 years of experience building scalable web applications and distributed systems. Passionate about developer experience, platform reliability, and shipping fast.",
  "",
  "## Skills",
  "",
  "**Languages:** TypeScript, Python, Go, SQL",
  "**Frontend:** React, Next.js, Tailwind CSS, GraphQL",
  "**Backend:** Node.js, FastAPI, PostgreSQL, Redis",
  "**Infrastructure:** AWS, Docker, Kubernetes, Terraform",
  "",
  "## Work Experience",
  "",
  "### Senior Full Stack Engineer",
  "",
  "**Horizon Technologies** Apr 2021 - Present",
  "San Francisco, CA",
  "- Led architecture of a real-time collaboration platform serving 500K+ monthly active users.",
  "- Reduced API p95 latency by 60% through query optimization and Redis caching.",
  "- Mentored a team of 5 engineers and established code review standards adopted org-wide.",
  "",
  "### Full Stack Engineer",
  "",
  "**Lumen Studio** Jul 2018 - Mar 2021",
  "Austin, TX",
  "- Built the core billing engine processing $2M+ in monthly transactions.",
  "- Migrated legacy monolith to microservices, cutting deploy time from 45 min to 8 min.",
  "",
  "### Software Engineer",
  "",
  "**CloudBridge Inc** Jun 2015 - Jun 2018",
  "Remote",
  "- Developed REST APIs for a B2B SaaS platform with 3,000+ enterprise customers.",
  "",
  "## Education",
  "",
  "### B.S. Computer Science",
  "",
  "**University of California, Berkeley** 2011 - 2015",
  "",
  "## Certifications",
  "",
  "AWS Certified Solutions Architect – Associate | Amazon Web Services | 2022",
  "",
  "## Languages",
  "",
  "English — Native",
  "Spanish — Professional",
].join("\n");

export function ImportPanel() {
  const { resume, replaceData } = useResumeEditor();
  const [text, setText] = useState("");

  const handleImport = () => {
    if (!text.trim()) return;
    replaceData(resume.id, parseMarkdownResume(text));
  };

  return (
    <PanelShell
      title="Import from Markdown"
      subtitle="Paste a markdown resume to auto-populate every section."
    >
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setText(SAMPLE_MARKDOWN)}>
          Load sample
        </Button>
        <Button size="sm" onClick={handleImport} disabled={!text.trim()}>
          <Wand2 /> Parse &amp; replace
        </Button>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="# Your Name&#10;## Your Title&#10;..."
        className="min-h-[420px] font-mono text-xs"
      />
    </PanelShell>
  );
}
