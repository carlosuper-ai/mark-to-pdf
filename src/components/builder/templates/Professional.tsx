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
  return [a, b].filter(Boolean).join(" – ");
}

export function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const { data, theme } = resume;

  return (
    <div
      style={{
        fontFamily: `"${theme.fontFamily}", Georgia, serif`,
        fontSize: `${10.5 * theme.fontScale}pt`,
        lineHeight: theme.lineHeight,
        color: "#111827",
        padding: "56px 64px",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <h1
          style={{
            fontSize: `${22 * theme.fontScale}pt`,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          {data.personal.fullName || "Your Name"}
        </h1>
        {data.personal.title && (
          <div
            style={{
              marginTop: 4,
              fontStyle: "italic",
              color: "#374151",
              fontSize: `${11.5 * theme.fontScale}pt`,
            }}
          >
            {data.personal.title}
          </div>
        )}
        <div
          style={{
            marginTop: 8,
            color: "#4b5563",
            fontSize: `${9.5 * theme.fontScale}pt`,
          }}
        >
          {[
            data.personal.location,
            data.personal.email,
            data.personal.phone,
            data.personal.linkedin,
            data.personal.github,
            data.personal.website,
          ]
            .filter(Boolean)
            .join("  ·  ")}
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #111827",
            marginTop: 14,
          }}
        />
      </header>

      {data.summary && (
        <Section title="Professional Summary">
          <p style={{ margin: 0, textAlign: "justify" }}>{data.summary}</p>
        </Section>
      )}

      {data.experiences.length > 0 && (
        <Section title="Professional Experience">
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "baseline",
                }}
              >
                <div style={{ fontWeight: 700 }}>{e.employer}</div>
                <div style={{ color: "#4b5563", whiteSpace: "nowrap" }}>
                  {dateRange(e.startDate, e.endDate, e.current)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontStyle: "italic",
                  color: "#374151",
                }}
              >
                <span>{e.jobTitle}</span>
                <span>{e.location}</span>
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

      {data.education.length > 0 && (
        <Section title="Education">
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
                  <div style={{ fontWeight: 700 }}>{e.school}</div>
                  <div style={{ fontStyle: "italic", color: "#374151" }}>
                    {e.degree}
                  </div>
                </div>
                <div style={{ color: "#4b5563", whiteSpace: "nowrap" }}>
                  {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                </div>
              </div>
              {e.description && (
                <div style={{ marginTop: 2 }}>{e.description}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          {data.skills.map((c) => (
            <div key={c.id} style={{ marginBottom: 2 }}>
              <span style={{ fontWeight: 700 }}>{c.name}: </span>
              <span>{c.skills.join(", ")}</span>
            </div>
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              {p.role && <div style={{ fontStyle: "italic" }}>{p.role}</div>}
              {p.description && <div>{p.description}</div>}
              {p.technologies.length > 0 && (
                <div style={{ color: "#4b5563" }}>{p.technologies.join(", ")}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((c) => (
            <div key={c.id}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.organization && <span> — {c.organization}</span>}
              {c.issueDate && (
                <span style={{ color: "#4b5563" }}> ({c.issueDate})</span>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Languages">
          {data.languages
            .map((l) => `${l.language} (${l.proficiency})`)
            .join(", ")}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 14 }}>
      <h2
        style={{
          fontSize: "11pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          borderBottom: "1px solid #111827",
          paddingBottom: 2,
          margin: "0 0 6px 0",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}