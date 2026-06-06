import type { Resume } from "@/lib/resume-types";

function formatDate(d: string) {
  if (!d) return "";
  const m = d.match(/^(\d{4})-(\d{2})$/);
  if (!m) return d;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function dateRange(s: string, e: string, current?: boolean) {
  const a = formatDate(s);
  const b = current ? "Present" : formatDate(e);
  return [a, b].filter(Boolean).join(" — ");
}

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { data, theme } = resume;
  const accent = theme.accent;

  return (
    <div
      style={{
        fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
        fontSize: `${10.5 * theme.fontScale}pt`,
        lineHeight: theme.lineHeight,
        color: "#1a1f2e",
        padding: "48px 56px",
      }}
    >
      <header style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 14, marginBottom: 18 }}>
        <h1
          style={{
            fontSize: `${24 * theme.fontScale}pt`,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {data.personal.fullName || "Your Name"}
        </h1>
        {data.personal.title && (
          <div
            style={{
              color: accent,
              fontWeight: 500,
              marginTop: 4,
              fontSize: `${12 * theme.fontScale}pt`,
            }}
          >
            {data.personal.title}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 14px",
            marginTop: 10,
            color: "#475569",
            fontSize: `${9.5 * theme.fontScale}pt`,
          }}
        >
          {[
            data.personal.email,
            data.personal.phone,
            data.personal.location,
            data.personal.linkedin,
            data.personal.github,
            data.personal.website,
          ]
            .filter(Boolean)
            .map((v, i) => (
              <span key={i}>{v}</span>
            ))}
        </div>
      </header>

      {data.summary && (
        <Section title="Summary" accent={accent}>
          <p style={{ margin: 0 }}>{data.summary}</p>
        </Section>
      )}

      {data.experiences.length > 0 && (
        <Section title="Experience" accent={accent}>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{e.jobTitle}</div>
                  <div style={{ color: "#475569" }}>
                    {e.employer}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                </div>
                <div style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                  {dateRange(e.startDate, e.endDate, e.current)}
                </div>
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                  {e.bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills" accent={accent}>
          <div style={{ display: "grid", gap: 4 }}>
            {data.skills.map((c) => (
              <div key={c.id}>
                <span style={{ fontWeight: 600 }}>{c.name}:</span>{" "}
                <span>{c.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects" accent={accent}>
          {data.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>
                {p.name}
                {p.role && (
                  <span style={{ fontWeight: 400, color: "#475569" }}>
                    {" "}
                    — {p.role}
                  </span>
                )}
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
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education" accent={accent}>
          {data.education.map((e) => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{e.degree}</div>
                  <div style={{ color: "#475569" }}>{e.school}</div>
                </div>
                <div style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                  {[e.startDate, e.endDate].filter(Boolean).join(" — ")}
                </div>
              </div>
              {e.description && (
                <div style={{ marginTop: 2 }}>{e.description}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications" accent={accent}>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              {c.organization && (
                <span style={{ color: "#475569" }}> · {c.organization}</span>
              )}
              {c.issueDate && (
                <span style={{ color: "#64748b" }}> ({c.issueDate})</span>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Languages" accent={accent}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {data.languages.map((l) => (
              <div key={l.id}>
                <span style={{ fontWeight: 600 }}>{l.language}</span>{" "}
                <span style={{ color: "#64748b" }}>— {l.proficiency}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2
        style={{
          fontSize: "10.5pt",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: accent,
          margin: "0 0 6px 0",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}