import { createServerFn } from "@tanstack/react-start";
import { createElement } from "react";
import type { PaperFormat } from "puppeteer";
import type { Resume } from "./resume-types";
import { buildPrintDocument, createAtsDesign } from "./pdf-export";
import type { ExportOptions } from "./pdf-export";
import { ResumeRenderer } from "@/components/resume/ResumeRenderer";

type PdfInput = { resume: Resume; options: ExportOptions };
type PdfResult = { pdfBase64: string | null };

export const generateResumePdf = createServerFn({ method: "POST" })
  .validator((d: PdfInput) => d)
  .handler(async ({ data }): Promise<PdfResult> => {
    let { resume } = data;
    const { options } = data;

    if (options.atsMode) {
      resume = { ...resume, design: createAtsDesign(resume.design) };
    }

    // renderToStaticMarkup — same output as the browser React render
    const { renderToStaticMarkup } = await import("react-dom/server");
    const resumeHtml = renderToStaticMarkup(createElement(ResumeRenderer, { resume }));
    const fullHtml = buildPrintDocument(resumeHtml, options, resume.design.spacing);

    // Puppeteer is only available in Node.js environments (not Cloudflare Workers)
    let pup: typeof import("puppeteer") | null;
    try {
      pup = await import("puppeteer");
    } catch {
      return { pdfBase64: null };
    }

    const browser = await pup.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    try {
      const page = await browser.newPage();
      // Match the preview's 794px A4 viewport
      await page.setViewport({ width: 794, height: 1, deviceScaleFactor: 1 });
      // "load" is the correct waitUntil for setContent; fonts are handled below
      await page.setContent(fullHtml, { waitUntil: "load" });
      // Wait for Google Fonts to finish — mirrors document.fonts.ready in preview
      await page.evaluate(() => document.fonts.ready);

      const pdf = await page.pdf({
        format: options.pageFormat as PaperFormat,
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });

      return { pdfBase64: Buffer.from(pdf).toString("base64") };
    } finally {
      await browser.close();
    }
  });
