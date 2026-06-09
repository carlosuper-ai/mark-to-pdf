import { useRef, useEffect, useState, memo } from "react";
import { useActiveResume } from "@/lib/resume-store";
import { ResumeRenderer } from "@/components/resume/ResumeRenderer";
import type { Resume } from "@/lib/resume-types";
import { PAGE_W, PAGE_H, PAGE_GAP, PROFESSIONAL_TEMPLATE_IDS } from "@/constants";

const Content = memo(function Content({ resume }: { resume: Resume }) {
  return <ResumeRenderer resume={resume} />;
});

export function ResumePreview() {
  const resume = useActiveResume();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.82);
  const [contentH, setContentH] = useState(PAGE_H);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setZoom(Math.min(0.92, Math.max(0.45, (w - 40) / PAGE_W)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContentH(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { marginTop, marginBottom } = resume.design.spacing;
  // Usable content area per page (between the top and bottom page margins)
  const contentAreaH = Math.max(1, PAGE_H - marginTop - marginBottom);
  const pageCount = Math.max(1, Math.ceil(contentH / contentAreaH));
  const scaledW = PAGE_W * zoom;

  // For multi-color professional templates, color the top margin area so the
  // header background appears to start from the physical top of the page.
  const isFullBleed =
    resume.design.colors.mode === "multi" && PROFESSIONAL_TEMPLATE_IDS.has(resume.design.template);
  const topMarginBg = isFullBleed ? resume.design.colors.multi.primaryBackground : undefined;

  return (
    <div
      ref={containerRef}
      style={{
        background: "#c8ccd4",
        minHeight: "100%",
        padding: "28px 20px 40px",
        overflowX: "auto",
        position: "relative",
      }}
    >
      {/* Off-screen measurement div — same 794px width, unscaled */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          width: PAGE_W,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <Content resume={resume} />
      </div>

      <div style={{ width: scaledW, margin: "0 auto" }}>
        {Array.from({ length: pageCount }).map((_, i) => (
          <div
            key={i}
            style={{
              width: scaledW,
              height: PAGE_H * zoom,
              marginBottom: i < pageCount - 1 ? PAGE_GAP : 0,
              background: "#ffffff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top page margin — colored for full-bleed header templates */}
            <div style={{ height: marginTop * zoom, flexShrink: 0, background: topMarginBg }} />

            {/* Content slice — clips to one page's worth of content */}
            <div
              style={{
                height: contentAreaH * zoom,
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/*
                scale(s) translateY(-t) maps content y → s*(y-t).
                t = contentAreaH*i makes page i's top land at screen y=0.
              */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: PAGE_W,
                  transform: `scale(${zoom}) translateY(-${contentAreaH * i}px)`,
                  transformOrigin: "top left",
                }}
              >
                <Content resume={resume} />
              </div>
            </div>

            {/* Bottom page margin */}
            <div style={{ height: marginBottom * zoom, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
