import { useActiveResume, useResumeStore } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Copy, FilePlus2, Trash2 } from "lucide-react";

export function ResumeSelector() {
  const resume = useActiveResume();
  const { resumes, setActive, createResume, duplicateResume, deleteResume } = useResumeStore();

  return (
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
  );
}
