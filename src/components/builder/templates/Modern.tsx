import type { Resume, ColorSettings } from "@/lib/resume-types";
import { formatDateRange } from "@/lib/date-utils";
import { EntryHeader, BulletList } from "./_shared";
import { buildContactFields } from "./_contact";
import { applyCapitalization, resolveAccent } from "./_template-fns";
import { ContactDetails } from "./_template-utils";

// ─── Main template ────────────────────────────────────────────────────────────

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { data, design } = resume;
  const {
    typography: typo,
    spacing,
    colors,
    header: hdr,
    sectionHeadings,
    entryLayout,
    document: doc,
  } = design;

  const accent = resolveAccent(colors);
  const pt = (n: number) => `${n}pt`;
  const px = (n: number) => `${n}px`;

  const nameColor = colors.targets.name ? accent : colors.headerColor;
  const titleColor = colors.targets.jobTitle ? accent : "#475569";
  const iconAccentColor = colors.targets.headerIcons ? accent : "#64748b";
  const dateColor = colors.targets.dates ? accent : "#64748b";
  const subtitleColor = colors.targets.entrySubtitle ? accent : "#475569";

  const contactFields = buildContactFields(data.personal, hdr.contactOrder ?? []);
  const sep = hdr.contactSeparator || "·";

  return (
    <div
      style={{
        fontFamily: `"${typo.fontFamily}", system-ui, sans-serif`,
        fontSize: pt(typo.baseFontSize),
        lineHeight: spacing.lineHeight,
        color: "#1a1f2e",
        padding: `0 ${px(spacing.marginRight)} 0 ${px(spacing.marginLeft)}`,
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          textAlign: hdr.alignment,
          borderBottom: hdr.showDivider ? `2px solid ${accent}` : undefined,
          paddingBottom: hdr.showDivider ? 14 : 0,
          marginBottom: 18,
        }}
      >
        {hdr.titlePosition === "same-line" ? (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: hdr.alignment === "center" ? "center" : "flex-start",
            }}
          >
            <h1
              style={{
                fontSize: pt(typo.nameFontSize),
                fontWeight: hdr.nameStyle === "bold" ? 700 : 500,
                letterSpacing: "-0.02em",
                color: nameColor,
                margin: 0,
              }}
            >
              {data.personal.fullName || "Your Name"}
            </h1>
            {data.personal.title && (
              <>
                <span style={{ color: "#94a3b8", fontSize: pt(typo.titleFontSize) }}>|</span>
                <span
                  style={{
                    color: titleColor,
                    fontWeight: 500,
                    fontSize: pt(typo.titleFontSize),
                    fontStyle: hdr.titleStyle === "italic" ? "italic" : "normal",
                  }}
                >
                  {data.personal.title}
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <h1
              style={{
                fontSize: pt(typo.nameFontSize),
                fontWeight: hdr.nameStyle === "bold" ? 700 : 500,
                letterSpacing: "-0.02em",
                color: nameColor,
                margin: 0,
              }}
            >
              {data.personal.fullName || "Your Name"}
            </h1>
            {data.personal.title && (
              <div
                style={{
                  color: titleColor,
                  fontWeight: 500,
                  marginTop: 3,
                  fontSize: pt(typo.titleFontSize),
                  fontStyle: hdr.titleStyle === "italic" ? "italic" : "normal",
                }}
              >
                {data.personal.title}
              </div>
            )}
          </>
        )}

        {contactFields.length > 0 && (
          <ContactDetails
            fields={contactFields}
            arrangement={hdr.detailsArrangement}
            iconStyle={hdr.iconStyle}
            separator={sep}
            accent={accent}
            iconColor={iconAccentColor}
            alignment={hdr.alignment}
            fontSize={pt(typo.baseFontSize * 0.9)}
            inlineContainerStyle={{ gap: "2px 0" }}
          />
        )}
      </header>

      {/* ── Sections ── */}
      {design.layout.sectionOrder.map((key) => {
        if (design.layout.sectionVisibility[key] === false) return null;
        const gap = spacing.sectionGap;

        if (key === "summary" && data.summary) {
          return (
            <SectionBlock
              key={key}
              title="Summary"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              <p style={{ margin: 0 }}>{data.summary}</p>
            </SectionBlock>
          );
        }

        if (key === "experiences" && data.experiences.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Work Experience"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.experiences.map((e) => (
                <div key={e.id} style={{ marginBottom: Math.max(gap - 4, 8) }}>
                  <div style={{ breakInside: "avoid" }}>
                    <EntryHeader
                      primary={e.jobTitle}
                      secondary={e.employer}
                      location={e.location || undefined}
                      date={formatDateRange(e.startDate, e.endDate, e.current, doc.dateFormat)}
                      entrySize={pt(typo.entryHeaderSize)}
                      subtitleStyle={entryLayout.subtitleStyle}
                      subtitlePlacement={entryLayout.subtitlePlacement}
                      entryTemplate={entryLayout.entryTemplate}
                      dateColor={dateColor}
                      subtitleColor={subtitleColor}
                    />
                  </div>
                  {e.bullets.length > 0 && (
                    <BulletList
                      bullets={e.bullets}
                      listStyle={entryLayout.listStyle}
                      indent={entryLayout.indentBody}
                    />
                  )}
                </div>
              ))}
            </SectionBlock>
          );
        }

        if (key === "skills" && data.skills.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Skills"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              <div style={{ display: "grid", gap: 4 }}>
                {data.skills.map((c) => (
                  <div key={c.id}>
                    <span style={{ fontWeight: 600 }}>{c.name}:</span>{" "}
                    <span style={{ color: "#374151" }}>{c.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            </SectionBlock>
          );
        }

        if (key === "projects" && data.projects.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Projects"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.projects.map((p) => (
                <div
                  key={p.id}
                  style={{ marginBottom: Math.max(gap - 4, 8), breakInside: "avoid" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: pt(typo.entryHeaderSize) }}>
                      {p.name}
                      {p.role && (
                        <span style={{ fontWeight: 400, color: subtitleColor }}> — {p.role}</span>
                      )}
                    </div>
                  </div>
                  {p.technologies.length > 0 && (
                    <div style={{ color: "#64748b", fontSize: "0.9em" }}>
                      {p.technologies.join(", ")}
                    </div>
                  )}
                  {p.description && <div style={{ marginTop: 2 }}>{p.description}</div>}
                  {p.url && <div style={{ color: accent }}>{p.url}</div>}
                </div>
              ))}
            </SectionBlock>
          );
        }

        if (key === "education" && data.education.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Education"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.education.map((e) => (
                <div
                  key={e.id}
                  style={{ marginBottom: Math.max(gap - 4, 8), breakInside: "avoid" }}
                >
                  <EntryHeader
                    primary={e.degree}
                    secondary={e.school}
                    date={formatDateRange(e.startDate, e.endDate, false, doc.dateFormat)}
                    entrySize={pt(typo.entryHeaderSize)}
                    subtitleStyle={entryLayout.subtitleStyle}
                    subtitlePlacement={entryLayout.subtitlePlacement}
                    entryTemplate={entryLayout.entryTemplate}
                    dateColor={dateColor}
                    subtitleColor={subtitleColor}
                  />
                  {e.description && <div style={{ marginTop: 2 }}>{e.description}</div>}
                </div>
              ))}
            </SectionBlock>
          );
        }

        if (key === "certifications" && data.certifications.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Certifications"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.organization && (
                    <span style={{ color: subtitleColor }}> · {c.organization}</span>
                  )}
                  {c.issueDate && <span style={{ color: dateColor }}> ({c.issueDate})</span>}
                </div>
              ))}
            </SectionBlock>
          );
        }

        if (key === "languages" && data.languages.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Languages"
              accent={accent}
              colors={colors}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                {data.languages.map((l) => (
                  <div key={l.id}>
                    <span style={{ fontWeight: 600 }}>{l.language}</span>{" "}
                    <span style={{ color: "#64748b" }}>— {l.proficiency}</span>
                  </div>
                ))}
              </div>
            </SectionBlock>
          );
        }

        return null;
      })}
    </div>
  );
}

// ─── Section block ────────────────────────────────────────────────────────────

type SectionBlockProps = {
  title: string;
  accent: string;
  colors: ColorSettings;
  sectionGap: number;
  typo: Resume["design"]["typography"];
  sectionHeadings: Resume["design"]["sectionHeadings"];
  children: React.ReactNode;
};

function SectionBlock({
  title,
  accent,
  colors,
  sectionGap,
  typo,
  sectionHeadings,
  children,
}: SectionBlockProps) {
  const label = applyCapitalization(title, sectionHeadings.capitalization);
  const headingColor = colors.targets.headings ? accent : colors.borderColor;
  const pt = (n: number) => `${n}pt`;

  const baseStyle: React.CSSProperties = {
    fontSize: pt(typo.sectionHeadingSize),
    fontWeight: 700,
    color: headingColor,
    margin: "0 0 6px 0",
    padding: "2px 0",
    breakAfter: "avoid",
  };

  const style = sectionHeadings.style;
  const isMulti = colors.mode === "multi";
  let headingEl: React.CSSProperties = { ...baseStyle };

  if (style === "underline")
    headingEl = { ...baseStyle, borderBottom: `1.5px solid ${headingColor}`, paddingBottom: 2 };
  else if (style === "left-border")
    headingEl = { ...baseStyle, borderLeft: `3px solid ${headingColor}`, paddingLeft: 8 };
  else if (style === "filled") {
    headingEl = isMulti
      ? {
          ...baseStyle,
          background: colors.multi.secondaryBackground,
          color: headingColor,
          padding: "5px 12px",
          textAlign: "center",
          letterSpacing: "0.05em",
        }
      : {
          ...baseStyle,
          background: headingColor,
          color: "#fff",
          padding: "3px 8px",
          borderRadius: 2,
        };
  }

  return (
    <section style={{ marginBottom: Math.max(sectionGap, 10) }}>
      {style === "divider" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "0 0 6px 0",
            breakAfter: "avoid",
          }}
        >
          <h2 style={{ ...baseStyle, margin: 0, whiteSpace: "nowrap", breakAfter: "auto" }}>
            {label}
          </h2>
          <div style={{ flex: 1, height: 1, background: headingColor, opacity: 0.6 }} />
        </div>
      ) : (
        <h2 style={headingEl}>{label}</h2>
      )}
      {children}
    </section>
  );
}
