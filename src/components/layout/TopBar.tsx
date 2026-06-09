import { useState } from "react";
import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import { useUIStore } from "@/lib/ui-store";
import { ExportModal } from "@/components/builder/ExportModal";
import { ResumeSelector } from "./ResumeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Download, FileCheck, FileText } from "lucide-react";

export function TopBar() {
  const resume = useActiveResume();
  const renameResume = useResumeStore((s) => s.renameResume);
  const { tab, setTab } = useUIStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [exportAts, setExportAts] = useState(false);

  const openExport = (ats: boolean) => {
    setExportAts(ats);
    setExportOpen(true);
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur flex items-center px-4 gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-2 mr-2">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Resume Builder</span>
        </div>

        <div className="flex items-center rounded-md border border-border bg-card p-0.5">
          {(["content", "customize"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded text-sm capitalize transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground",
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
          <ResumeSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="h-4 w-4" />
                Download
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Export</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => openExport(false)}>
                <Download className="h-4 w-4" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openExport(true)}>
                <FileCheck className="h-4 w-4" /> Download ATS PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        resume={resume}
        defaultAtsMode={exportAts}
      />
    </>
  );
}
