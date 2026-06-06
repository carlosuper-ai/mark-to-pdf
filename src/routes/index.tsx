import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import { ContentEditor, SECTIONS } from "@/components/builder/ContentEditor";
import { CustomizePanel } from "@/components/builder/CustomizePanel";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FilePlus2, ChevronDown, Copy, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crafted — Resume Builder" },
      { name: "description", content: "Paste markdown or edit visually. Live preview, polished templates, ATS-friendly PDF export." },
      { property: "og:title", content: "Crafted — Resume Builder" },
      { property: "og:description", content: "Paste markdown or edit visually. Live preview, polished templates, ATS-friendly PDF export." },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<"content" | "customize">("content");
  const [section, setSection] = useState<(typeof SECTIONS)[number]["key"]>("import");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar tab={tab} setTab={setTab} />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1.1fr)] min-h-0">
        {tab === "content" ? (
          <>
            <aside className="border-r border-border bg-surface p-3 overflow-y-auto">
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSection(s.key)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      section === s.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground/80",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>
            <main className="overflow-y-auto p-8 max-w-3xl w-full">
              <ContentEditor section={section} />
            </main>
          </>
        ) : (
          <>
            <aside className="border-r border-border bg-surface p-3 overflow-y-auto hidden lg:block" />
            <main className="overflow-y-auto p-8 max-w-2xl w-full">
              <CustomizePanel />
            </main>
          </>
        )}
        <section className="bg-secondary/40 border-l border-border overflow-y-auto">
          <ResumePreview />
        </section>
      </div>
    </div>
  );
}

function TopBar({
  tab,
  setTab,
}: {
  tab: "content" | "customize";
  setTab: (t: "content" | "customize") => void;
}) {
  const resume = useActiveResume();
  const { resumes, setActive, createResume, duplicateResume, deleteResume, renameResume } =
    useResumeStore();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur flex items-center px-4 gap-3 sticky top-0 z-30">
      <div className="flex items-center gap-2 mr-2">
        <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
          <FileText className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">Crafted</span>
      </div>

      <div className="flex items-center rounded-md border border-border bg-card p-0.5">
        {(["content", "customize"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1.5 rounded text-sm capitalize transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Input
          value={resume.name}
          onChange={(e) => renameResume(resume.id, e.target.value)}
          className="h-9 w-48 hidden sm:block"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              My Resumes <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch resume</DropdownMenuLabel>
            {resumes.map((r) => (
              <DropdownMenuItem
                key={r.id}
                onSelect={() => setActive(r.id)}
                className={cn(r.id === resume.id && "font-medium")}
              >
                {r.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => createResume()}>
              <FilePlus2 /> New resume
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => duplicateResume(resume.id)}>
              <Copy /> Duplicate current
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => deleteResume(resume.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 /> Delete current
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={() => window.print()}>
          <Download /> Download PDF
        </Button>
      </div>
    </header>
  );
}
