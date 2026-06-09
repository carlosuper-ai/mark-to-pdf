import { createServerFn } from "@tanstack/react-start";
import { createElement } from "react";
import type { PaperFormat } from "puppeteer-core";
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

    let browser: import("puppeteer-core").Browser;
    try {
      const puppeteer = await import("puppeteer-core");
      let executablePath: string;
      let args: string[];

      try {
        // Serverless environment (Netlify, AWS Lambda, etc.)
        const chromium = await import("@sparticuz/chromium");
        executablePath = await chromium.default.executablePath();
        args = chromium.default.args;
      } catch {
        // Local dev: fall back to system Chrome
        executablePath =
          process.platform === "win32"
            ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "darwin"
              ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
              : "/usr/bin/google-chrome";
        args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];
      }

      browser = await puppeteer.default.launch({
        executablePath,
        args,
        headless: true,
      });
    } catch {
      return { pdfBase64: null };
    }

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
