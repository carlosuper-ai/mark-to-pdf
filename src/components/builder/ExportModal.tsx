import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { exportResumePdf, generatePdfFilename, type ExportOptions } from "@/lib/pdf-export";
import type { Resume } from "@/lib/resume-types";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume;
  defaultAtsMode?: boolean;
}

const PAGE_FORMATS = ["A4", "Letter", "B5", "A5", "Legal"] as const;

const CHECKBOXES: { key: keyof ExportOptions; label: string }[] = [
  { key: "includeLinks", label: "Include clickable links" },
  { key: "showPageNumbers", label: "Show page numbers" },
  { key: "includePhoto", label: "Include photo (if set)" },
  { key: "atsMode", label: "ATS mode — black & white, no icons" },
];

export function ExportModal({
  open,
  onOpenChange,
  resume,
  defaultAtsMode = false,
}: ExportModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    pageFormat: (resume.design.document.pageFormat as ExportOptions["pageFormat"]) ?? "A4",
    includeLinks: true,
    showPageNumbers: false,
    includePhoto: true,
    atsMode: defaultAtsMode,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setOptions((prev) => ({
        ...prev,
        pageFormat: (resume.design.document.pageFormat as ExportOptions["pageFormat"]) ?? "A4",
        atsMode: defaultAtsMode,
      }));
      setError(null);
      setLoading(false);
    }
  }, [open, defaultAtsMode, resume.design.document.pageFormat]);

  const set = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) =>
    setOptions((prev) => ({ ...prev, [key]: value }));

  const filename = generatePdfFilename(resume.data.personal);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      await exportResumePdf(resume, options);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">File: </span>
            {filename}
          </div>

          <div className="space-y-1.5">
            <Label>Page format</Label>
            <Select
              value={options.pageFormat}
              onValueChange={(v) => set("pageFormat", v as ExportOptions["pageFormat"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            {CHECKBOXES.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2.5">
                <Checkbox
                  id={key}
                  checked={!!options[key]}
                  onCheckedChange={(checked) => set(key, !!checked as ExportOptions[typeof key])}
                />
                <Label htmlFor={key} className="font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
