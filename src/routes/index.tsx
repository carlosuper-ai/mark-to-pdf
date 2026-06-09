import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContentEditor } from "@/components/builder/ContentEditor";
import { CustomizePanel } from "@/components/builder/CustomizePanel";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { TopBar } from "@/components/layout/TopBar";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { useUIStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resume Builder" },
      {
        name: "description",
        content:
          "Paste markdown or edit visually. Live preview, polished templates, ATS-friendly PDF export.",
      },
      { property: "og:title", content: "Resume Builder" },
      {
        property: "og:description",
        content:
          "Paste markdown or edit visually. Live preview, polished templates, ATS-friendly PDF export.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const tab = useUIStore((s) => s.tab);
  const [section, setSection] = useState<SectionKey>("import");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
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
