import type { Resume, EntryTemplate, SubtitleStyle, SubtitlePlacement } from "@/lib/resume-types";

// ─── Entry header ─────────────────────────────────────────────────────────────

interface EntryHeaderProps {
  primary: string;
  secondary: string;
  location?: string;
  date: string;
  entrySize: string;
  subtitleStyle: SubtitleStyle;
  subtitlePlacement: SubtitlePlacement;
  entryTemplate?: EntryTemplate;
  dateColor: string;
  subtitleColor: string;
}

export function EntryHeader({
  primary,
  secondary,
  location,
  date,
  entrySize,
  subtitleStyle,
  subtitlePlacement,
  entryTemplate,
  dateColor,
  subtitleColor,
}: EntryHeaderProps) {
  const subStyle: React.CSSProperties = {
    fontWeight: subtitleStyle.includes("bold") ? 600 : 400,
    fontStyle: subtitleStyle.includes("italic") ? "italic" : "normal",
    color: subtitleColor,
  };

  const dateEl = date ? (
    <span style={{ color: dateColor, whiteSpace: "nowrap", fontSize: "0.9em" }}>{date}</span>
  ) : null;

  const locEl = location ? (
    <span style={{ color: dateColor, whiteSpace: "nowrap", fontSize: "0.9em" }}>{location}</span>
  ) : null;

  const template = entryTemplate ?? "A";

  // ── Layout A: Title + Date (row 1) / Employer + Location (row 2) ───────────
  if (template === "A") {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</span>
          {dateEl}
        </div>
        {(secondary || location) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            {secondary && <span style={subStyle}>{secondary}</span>}
            {locEl}
          </div>
        )}
      </>
    );
  }

  // ── Layout B: Date · Location (row 1) / Title (row 2) / Employer (row 3) ──
  if (template === "B") {
    return (
      <>
        {(date || location) && (
          <div style={{ display: "flex", gap: 8, marginBottom: 2 }}>
            {dateEl}
            {date && location && <span style={{ color: dateColor, fontSize: "0.9em" }}>·</span>}
            {locEl}
          </div>
        )}
        <div style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</div>
        {secondary && <div style={subStyle}>{secondary}</div>}
      </>
    );
  }

  // ── Layout C: Date (left) | Title (center) | Location (right) ─────────────
  if (template === "C") {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span style={{ color: dateColor, fontSize: "0.9em", whiteSpace: "nowrap", minWidth: 0 }}>
            {date}
          </span>
          <span style={{ fontWeight: 600, fontSize: entrySize, flex: 1, textAlign: "center" }}>
            {primary}
          </span>
          <span style={{ color: dateColor, fontSize: "0.9em", whiteSpace: "nowrap", minWidth: 0 }}>
            {location ?? ""}
          </span>
        </div>
        {secondary && <div style={{ ...subStyle, textAlign: "center" }}>{secondary}</div>}
      </>
    );
  }

  // ── Layout D: All stacked ──────────────────────────────────────────────────
  if (template === "D") {
    return (
      <>
        <div style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</div>
        {secondary && <div style={subStyle}>{secondary}</div>}
        {dateEl && <div>{dateEl}</div>}
        {locEl && <div>{locEl}</div>}
      </>
    );
  }

  // ── Fallback: legacy subtitlePlacement ────────────────────────────────────
  const legacyDateEl = (
    <div style={{ color: dateColor, whiteSpace: "nowrap", fontSize: "0.9em" }}>{date}</div>
  );

  if (subtitlePlacement === "same-line") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <div>
          <span style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</span>
          {secondary && <span style={{ ...subStyle, marginLeft: 6 }}>· {secondary}</span>}
        </div>
        {legacyDateEl}
      </div>
    );
  }

  if (subtitlePlacement === "compact") {
    return (
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
      >
        <div>
          <span style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</span>
          {secondary && <span style={{ ...subStyle, marginLeft: 8 }}>— {secondary}</span>}
        </div>
        {legacyDateEl}
      </div>
    );
  }

  // next-line (default)
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: entrySize }}>{primary}</div>
        {secondary && <div style={subStyle}>{secondary}</div>}
      </div>
      {legacyDateEl}
    </div>
  );
}

// ─── Bullet list ──────────────────────────────────────────────────────────────

const LIST_MARKERS: Record<string, string> = {
  bullet: "•",
  hyphen: "–",
  square: "▪",
  arrow: "→",
};

export function BulletList({
  bullets,
  listStyle,
  indent,
}: {
  bullets: string[];
  listStyle: Resume["design"]["entryLayout"]["listStyle"];
  indent: boolean;
}) {
  const marker = LIST_MARKERS[listStyle] ?? "•";
  return (
    <div style={{ marginTop: 4, paddingLeft: indent ? 16 : 0 }}>
      {bullets.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 2 }}>
          <span style={{ flexShrink: 0, opacity: 0.7 }}>{marker}</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}
