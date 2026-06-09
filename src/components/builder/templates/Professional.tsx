import type { Resume, ColorSettings } from "@/lib/resume-types";
import { formatDateRange } from "@/lib/date-utils";
import { EntryHeader, BulletList } from "./_shared";
import { buildContactFields } from "./_contact";
import { applyCapitalization, resolveAccent } from "./_template-fns";
import { ContactDetails } from "./_template-utils";

// ─── Main template ────────────────────────────────────────────────────────────

export function ProfessionalTemplate({
  resume,
  printMode = false,
}: {
  resume: Resume;
  printMode?: boolean;
}) {
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

  const isMulti = colors.mode === "multi";
  const headerBg = isMulti ? colors.multi.primaryBackground : "transparent";

  const hdrNameColor = isMulti
    ? colors.multi.primaryText
    : colors.targets.name
      ? accent
      : colors.headerColor;
  const hdrTitleColor = isMulti
    ? colors.multi.primaryText
    : colors.targets.jobTitle
      ? accent
      : "#374151";
  const hdrIconColor = isMulti
    ? colors.multi.primaryText
    : colors.targets.headerIcons
      ? accent
      : "#64748b";

  const dateColor = colors.targets.dates ? accent : "#4b5563";
  const subtitleColor = colors.targets.entrySubtitle ? accent : "#374151";

  const contactFields = buildContactFields(data.personal, hdr.contactOrder ?? []);
  const sep = hdr.contactSeparator || "·";

  // In printMode the @page margin is 0, so the header needs paddingTop = marginTop.
  // In preview mode the ResumePreview provides a colored top margin div, so no extra paddingTop.
  const headerTopPadding = isMulti ? (printMode ? spacing.marginTop : 0) : 0;

  const headerStyle: React.CSSProperties = isMulti
    ? {
        textAlign: hdr.alignment === "center" ? "center" : "left",
        background: headerBg,
        margin: `0 -${px(spacing.marginRight)} ${px(Math.max(spacing.sectionGap, 18))} -${px(spacing.marginLeft)}`,
        padding: `${px(headerTopPadding)} ${px(spacing.marginRight)} ${px(Math.max(spacing.marginTop - 4, 12))} ${px(spacing.marginLeft)}`,
      }
    : {
        textAlign: hdr.alignment === "center" ? "center" : "left",
        marginBottom: 18,
      };

  return (
    <div
      style={{
        fontFamily: `"${typo.fontFamily}", Georgia, serif`,
        fontSize: pt(typo.baseFontSize),
        lineHeight: spacing.lineHeight,
        color: "#111827",
        padding: `0 ${px(spacing.marginRight)} 0 ${px(spacing.marginLeft)}`,
      }}
    >
      {/* ── Header ── */}
      <header style={headerStyle}>
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
                margin: 0,
                letterSpacing: "0.02em",
                color: hdrNameColor,
              }}
            >
              {data.personal.fullName || "Your Name"}
            </h1>
            {data.personal.title && (
              <>
                <span
                  style={{
                    color: isMulti ? "rgba(255,255,255,0.4)" : "#94a3b8",
                    fontSize: pt(typo.titleFontSize),
                  }}
                >
                  |
                </span>
                <span
                  style={{
                    color: hdrTitleColor,
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
                margin: 0,
                letterSpacing: "0.02em",
                color: hdrNameColor,
              }}
            >
              {data.personal.fullName || "Your Name"}
            </h1>
            {data.personal.title && (
              <div
                style={{
                  marginTop: 4,
                  color: hdrTitleColor,
                  fontSize: pt(typo.titleFontSize),
                  fontStyle: hdr.titleStyle === "italic" ? "italic" : "normal",
                  opacity: isMulti ? 0.85 : 1,
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
            accent={isMulti ? "rgba(255,255,255,0.25)" : accent}
            iconColor={hdrIconColor}
            alignment={hdr.alignment}
            fontSize={pt(typo.baseFontSize * 0.9)}
            textColor={isMulti ? colors.multi.primaryText : "#4b5563"}
            marginTop={8}
            separatorStyle={{ color: hdrIconColor, opacity: 0.5, margin: "0 5px" }}
          />
        )}

        {hdr.showDivider && !isMulti && (
          <hr
            style={{ border: "none", borderTop: `1px solid ${colors.borderColor}`, marginTop: 14 }}
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
              colors={colors}
              accent={accent}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              <p style={{ margin: 0, textAlign: "justify" }}>{data.summary}</p>
            </SectionBlock>
          );
        }

        if (key === "experiences" && data.experiences.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Work Experience"
              colors={colors}
              accent={accent}
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
                      date={formatDateRange(e.startDate, e.endDate, e.current, doc.dateFormat, "-")}
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

        if (key === "education" && data.education.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Education"
              colors={colors}
              accent={accent}
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
                    date={[e.startDate, e.endDate].filter(Boolean).join(" – ")}
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

        if (key === "skills" && data.skills.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Skills"
              colors={colors}
              accent={accent}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.skills.map((c) => (
                <div key={c.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 700 }}>{c.name}: </span>
                  <span>{c.skills.join(", ")}</span>
                </div>
              ))}
            </SectionBlock>
          );
        }

        if (key === "projects" && data.projects.length > 0) {
          return (
            <SectionBlock
              key={key}
              title="Projects"
              colors={colors}
              accent={accent}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.projects.map((p) => (
                <div
                  key={p.id}
                  style={{ marginBottom: Math.max(gap - 4, 8), breakInside: "avoid" }}
                >
                  <div style={{ fontWeight: 700, fontSize: pt(typo.entryHeaderSize) }}>
                    {p.name}
                  </div>
                  {p.role && (
                    <div style={{ fontStyle: "italic", color: subtitleColor }}>{p.role}</div>
                  )}
                  {p.description && <div>{p.description}</div>}
                  {p.technologies.length > 0 && (
                    <div style={{ color: "#4b5563" }}>{p.technologies.join(", ")}</div>
                  )}
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
              colors={colors}
              accent={accent}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <span style={{ fontWeight: 700 }}>{c.name}</span>
                  {c.organization && (
                    <span style={{ color: subtitleColor }}> — {c.organization}</span>
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
              colors={colors}
              accent={accent}
              sectionGap={gap}
              typo={typo}
              sectionHeadings={sectionHeadings}
            >
              {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
            </SectionBlock>
          );
        }

        return null;
      })}
    </div>
  );
}

// ─── Section block ────────────────────────────────────────────────────────────

function SectionBlock({
  title,
  colors,
  accent,
  sectionGap,
  typo,
  sectionHeadings,
  children,
}: {
  title: string;
  colors: ColorSettings;
  accent: string;
  sectionGap: number;
  typo: Resume["design"]["typography"];
  sectionHeadings: Resume["design"]["sectionHeadings"];
  children: React.ReactNode;
}) {
  const label = applyCapitalization(title, sectionHeadings.capitalization);
  const headingColor = colors.targets.headings ? accent : colors.borderColor;
  const pt = (n: number) => `${n}pt`;
  const style = sectionHeadings.style;
  const isMulti = colors.mode === "multi";

  const base: React.CSSProperties = {
    fontSize: pt(typo.sectionHeadingSize),
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: headingColor,
    margin: "0 0 6px 0",
    padding: "2px 0",
    display: "block",
    breakAfter: "avoid",
  };

  let headingEl: React.CSSProperties = {
    ...base,
    borderBottom: `1px solid ${headingColor}`,
    paddingBottom: 2,
  };
  if (style === "text-only") headingEl = { ...base };
  if (style === "left-border")
    headingEl = { ...base, borderLeft: `3px solid ${headingColor}`, paddingLeft: 8 };
  if (style === "underline")
    headingEl = { ...base, borderBottom: `1.5px solid ${headingColor}`, paddingBottom: 2 };
  if (style === "filled") {
    headingEl = isMulti
      ? {
          ...base,
          background: colors.multi.secondaryBackground,
          color: headingColor,
          padding: "5px 12px",
          textAlign: "center",
          letterSpacing: "0.05em",
        }
      : { ...base, background: headingColor, color: "#fff", padding: "3px 8px", borderRadius: 2 };
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
          <h2 style={{ ...base, margin: 0, whiteSpace: "nowrap", breakAfter: "auto" }}>{label}</h2>
          <div style={{ flex: 1, height: 1, background: headingColor }} />
        </div>
      ) : (
        <h2 style={headingEl}>{label}</h2>
      )}
      {children}
    </section>
  );
}
