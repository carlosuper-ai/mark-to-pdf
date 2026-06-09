import type { HeadingStyle, EntryTemplate } from "@/lib/resume-types";

export function HeadingPreview({ style, accent }: { style: HeadingStyle; accent: string }) {
  const base: React.CSSProperties = {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: accent,
    padding: "1px 3px",
    width: 64,
    flexShrink: 0,
  };
  if (style === "underline")
    return <div style={{ ...base, borderBottom: `1px solid ${accent}` }}>WORK</div>;
  if (style === "left-border")
    return <div style={{ ...base, borderLeft: `2px solid ${accent}`, paddingLeft: 4 }}>WORK</div>;
  if (style === "filled")
    return <div style={{ ...base, background: accent, color: "#fff", borderRadius: 2 }}>WORK</div>;
  if (style === "divider")
    return (
      <div style={{ ...base, display: "flex", alignItems: "center", gap: 3, width: 64 }}>
        <span>WORK</span>
        <div style={{ flex: 1, height: 1, background: accent }} />
      </div>
    );
  return <div style={base}>WORK</div>;
}

export function MarginDiagram({
  top,
  bottom,
  left,
  right,
}: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}) {
  const W = 176;
  const H = Math.round(W * (297 / 210));
  const scale = W / 794;
  const mT = Math.round(top * scale);
  const mB = Math.round(bottom * scale);
  const mL = Math.round(left * scale);
  const mR = Math.round(right * scale);
  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: "#64748b" };
  const guide: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    background: "rgba(59,130,246,0.55)",
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}
    >
      <div style={{ ...lbl, marginBottom: 3 }}>↕ {top}px</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div
          style={{
            ...lbl,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            textAlign: "center",
          }}
        >
          {left}px ←
        </div>
        <div
          style={{
            width: W,
            height: H,
            background: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: 2,
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: mT,
              left: mL,
              right: mR,
              bottom: mB,
              background: "white",
            }}
          >
            <div style={{ padding: "3px 4px", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  height: 5,
                  width: "60%",
                  alignSelf: "center",
                  background: "#475569",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
              />
              <div
                style={{
                  height: 2,
                  width: "42%",
                  alignSelf: "center",
                  background: "#94a3b8",
                  borderRadius: 1,
                  marginBottom: 5,
                }}
              />
              <div style={{ height: 1, background: "#e2e8f0", marginBottom: 4 }} />
              <div
                style={{
                  height: 2.5,
                  width: "38%",
                  background: "#475569",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
              />
              {[95, 88, 90, 82].map((w, i) => (
                <div
                  key={`a${i}`}
                  style={{
                    height: 1.5,
                    width: `${w}%`,
                    background: "#cbd5e1",
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                />
              ))}
              <div style={{ height: 1, background: "#e2e8f0", marginTop: 3, marginBottom: 4 }} />
              <div
                style={{
                  height: 2.5,
                  width: "32%",
                  background: "#475569",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
              />
              {[90, 86, 80, 88, 75].map((w, i) => (
                <div
                  key={`b${i}`}
                  style={{
                    height: 1.5,
                    width: `${w}%`,
                    background: "#cbd5e1",
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ ...guide, top: mT, left: 0, right: 0, height: 1 }} />
          <div style={{ ...guide, bottom: mB, left: 0, right: 0, height: 1 }} />
          <div style={{ ...guide, top: 0, bottom: 0, left: mL, width: 1 }} />
          <div style={{ ...guide, top: 0, bottom: 0, right: mR, width: 1 }} />
        </div>
        <div style={{ ...lbl, writingMode: "vertical-rl", textAlign: "center" }}>→ {right}px</div>
      </div>
      <div style={{ ...lbl, marginTop: 3 }}>↕ {bottom}px</div>
    </div>
  );
}

export function EntryTemplatePreview({
  template,
  active,
}: {
  template: EntryTemplate;
  active: boolean;
}) {
  const txt = active ? "var(--primary)" : "#94a3b8";
  const dim = active ? "#93c5fd" : "#cbd5e1";
  const row = (cols: React.CSSProperties[]) => (
    <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
      {cols.map((s, i) => (
        <div key={i} style={{ height: 3, borderRadius: 1, ...s }} />
      ))}
    </div>
  );

  if (template === "A")
    return (
      <div style={{ padding: "4px 2px" }}>
        {row([
          { flex: 1, background: txt },
          { width: 20, background: dim },
        ])}
        {row([
          { width: 28, background: dim },
          { width: 18, background: dim, marginLeft: "auto" },
        ])}
        {row([
          { width: 4, background: dim },
          { flex: 1, background: "#e2e8f0" },
        ])}
      </div>
    );

  if (template === "B")
    return (
      <div style={{ padding: "4px 2px" }}>
        {row([
          { width: 18, background: dim },
          { width: 3, background: "#e2e8f0" },
          { width: 14, background: dim },
        ])}
        {row([{ flex: 1, background: txt }])}
        {row([{ width: 28, background: dim }])}
        {row([
          { width: 4, background: dim },
          { flex: 1, background: "#e2e8f0" },
        ])}
      </div>
    );

  if (template === "C")
    return (
      <div style={{ padding: "4px 2px" }}>
        {row([
          { width: 16, background: dim },
          { flex: 1, background: txt },
          { width: 16, background: dim },
        ])}
        {row([
          { flex: "0 0 16px", background: "transparent" },
          { width: 28, background: dim },
        ])}
        {row([
          { width: 4, background: dim },
          { flex: 1, background: "#e2e8f0" },
        ])}
      </div>
    );

  return (
    <div style={{ padding: "4px 2px" }}>
      {row([{ flex: 1, background: txt }])}
      {row([{ width: 28, background: dim }])}
      {row([{ width: 18, background: dim }])}
      {row([
        { width: 4, background: dim },
        { flex: 1, background: "#e2e8f0" },
      ])}
    </div>
  );
}
