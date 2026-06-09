import { createElement } from "react";
import type {
  Resume,
  ResumeDesignSettings,
  PersonalDetails,
  SpacingSettings,
} from "./resume-types";
import { ResumeRenderer } from "@/components/resume/ResumeRenderer";
import { PAGE_SIZES, GOOGLE_FONTS_URL, PROFESSIONAL_TEMPLATE_IDS } from "@/constants";

export interface ExportOptions {
  pageFormat: "A4" | "Letter" | "B5" | "A5" | "Legal";
  includeLinks: boolean;
  showPageNumbers: boolean;
  includePhoto: boolean;
  atsMode: boolean;
}

export function generatePdfFilename(personal: PersonalDetails): string {
  const slug = (s: string) =>
    s
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  const name = slug(personal.fullName) || "Resume";
  const title = slug(personal.title);
  return title ? `${name}-${title}.pdf` : `${name}.pdf`;
}

export function createAtsDesign(design: ResumeDesignSettings): ResumeDesignSettings {
  return {
    ...design,
    colors: {
      ...design.colors,
      mode: "single",
      accent: "#000000",
      headerColor: "#000000",
      borderColor: "#000000",
      targets: {
        name: false,
        jobTitle: false,
        headings: false,
        headerIcons: false,
        dates: false,
        entrySubtitle: false,
        linkIcons: false,
      },
    },
    header: { ...design.header, iconStyle: "none", showDivider: true },
    sectionHeadings: { ...design.sectionHeadings, style: "divider" },
  };
}

export function buildPrintDocument(
  resumeHtml: string,
  options: ExportOptions,
  spacing: SpacingSettings,
  fullBleedHeader = false,
): string {
  const pageSize = PAGE_SIZES[options.pageFormat] ?? PAGE_SIZES.A4;
  const { marginBottom } = spacing;
  // For full-bleed (multi-color) headers, @page margin-top is 0 so the colored
  // header background extends to the physical top edge. The template provides its
  // own top padding via printMode=true.
  const pageMarginTop = fullBleedHeader ? 0 : spacing.marginTop;

  const pageNumCss = options.showPageNumbers
    ? `@page{@bottom-center{content:counter(page);font-size:8pt;color:#888}}`
    : "";

  const linkCss = !options.includeLinks
    ? `a{color:inherit!important;text-decoration:none!important;pointer-events:none}`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${GOOGLE_FONTS_URL}">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;background:white}
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:${pageSize};margin:${pageMarginTop}px 0 ${marginBottom}px 0}
  ${pageNumCss}
  ${linkCss}
  body>div:first-child{padding-top:0!important;padding-bottom:0!important}
  h2{break-after:avoid;page-break-after:avoid}
  section{break-inside:auto;page-break-inside:auto}
</style>
</head>
<body>${resumeHtml}</body>
</html>`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function exportResumePdf(resume: Resume, options: ExportOptions): Promise<void> {
  const exportResume = options.atsMode
    ? { ...resume, design: createAtsDesign(resume.design) }
    : resume;

  const filename = generatePdfFilename(exportResume.data.personal);

  // Primary path: Puppeteer on the server (Node.js environments)
  // Dynamic import breaks the static circular dependency with pdf-server.ts
  try {
    const { generateResumePdf } = await import("./pdf-server");
    const result = await generateResumePdf({ data: { resume: exportResume, options } });
    if (result.pdfBase64) {
      const bytes = Uint8Array.from(atob(result.pdfBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      triggerDownload(blob, filename);
      return;
    }
  } catch {
    // Server function unavailable (Cloudflare Workers, offline) — fall through
  }

  // Fallback: browser print popup using the same ResumeRenderer component
  const { renderToStaticMarkup } = await import("react-dom/server");
  const isFullBleed =
    exportResume.design.colors.mode === "multi" &&
    PROFESSIONAL_TEMPLATE_IDS.has(exportResume.design.template);
  const html = renderToStaticMarkup(
    createElement(ResumeRenderer, { resume: exportResume, printMode: isFullBleed }),
  );
  const fullDoc = buildPrintDocument(html, options, exportResume.design.spacing, isFullBleed);

  const blob = new Blob([fullDoc], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error("Popup blocked. Please allow popups for this site and try again.");
  }

  win.addEventListener("load", () => {
    win.document.fonts.ready.then(() => {
      win.focus();
      win.print();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    });
  });
}
