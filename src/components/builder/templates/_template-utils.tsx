import type { Resume, IconFrameStyle } from "@/lib/resume-types";
import { CONTACT_ICONS, type ContactField } from "./_contact";

// ─── ContactIconFrame ─────────────────────────────────────────────────────────

export function ContactIconFrame({
  type,
  iconStyle,
  accent,
  iconColor,
}: {
  type: string;
  iconStyle: IconFrameStyle;
  accent: string;
  iconColor: string;
}) {
  const icon = CONTACT_ICONS[type] ?? "•";
  if (iconStyle === "none") return null;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 14,
    height: 14,
    fontSize: 7,
    fontWeight: 700,
    flexShrink: 0,
    marginRight: 4,
    lineHeight: 1,
  };

  if (iconStyle === "circle-filled")
    return (
      <span style={{ ...base, background: accent, color: "#fff", borderRadius: "50%" }}>
        {icon}
      </span>
    );
  if (iconStyle === "rounded-filled")
    return (
      <span style={{ ...base, background: accent, color: "#fff", borderRadius: 3 }}>{icon}</span>
    );
  if (iconStyle === "square-filled")
    return (
      <span style={{ ...base, background: accent, color: "#fff", borderRadius: 0 }}>{icon}</span>
    );
  if (iconStyle === "circle-outline")
    return (
      <span
        style={{ ...base, border: `1px solid ${accent}`, color: iconColor, borderRadius: "50%" }}
      >
        {icon}
      </span>
    );
  if (iconStyle === "rounded-outline")
    return (
      <span style={{ ...base, border: `1px solid ${accent}`, color: iconColor, borderRadius: 3 }}>
        {icon}
      </span>
    );
  return null;
}

// ─── ContactDetails ───────────────────────────────────────────────────────────

export interface ContactDetailsProps {
  fields: ContactField[];
  arrangement: Resume["design"]["header"]["detailsArrangement"];
  iconStyle: IconFrameStyle;
  separator: string;
  accent: string;
  iconColor: string;
  alignment: "left" | "center";
  fontSize: string;
  /** Override text color; defaults to Modern's "#475569". */
  textColor?: string;
  /** Override marginTop; defaults to Modern's 10. */
  marginTop?: number;
  /** Override inline-separator span style; defaults to Modern's `{ color: "#94a3b8", margin: "0 4px" }`. */
  separatorStyle?: React.CSSProperties;
  /** Extra styles merged into the inline flex-wrap container. */
  inlineContainerStyle?: React.CSSProperties;
}

export function ContactDetails({
  fields,
  arrangement,
  iconStyle,
  separator,
  accent,
  iconColor,
  alignment,
  fontSize,
  textColor = "#475569",
  marginTop = 10,
  separatorStyle = { color: "#94a3b8", margin: "0 4px" },
  inlineContainerStyle,
}: ContactDetailsProps) {
  const baseStyle: React.CSSProperties = { marginTop, color: textColor, fontSize };

  if (arrangement === "icons") {
    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: alignment === "center" ? "center" : "flex-start",
          gap: 3,
        }}
      >
        {fields.map((f) => (
          <div key={f.type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {iconStyle !== "none" ? (
              <ContactIconFrame
                type={f.type}
                iconStyle={iconStyle}
                accent={accent}
                iconColor={iconColor}
              />
            ) : (
              <span style={{ color: iconColor, fontSize: "0.85em", marginRight: 2 }}>
                {CONTACT_ICONS[f.type]}
              </span>
            )}
            <span>{f.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: alignment === "center" ? "center" : "flex-start",
        ...inlineContainerStyle,
      }}
    >
      {fields.map((f, i) => (
        <span key={f.type} style={{ display: "inline-flex", alignItems: "center" }}>
          {i > 0 && (
            <span style={separatorStyle}>{arrangement === "vertical-bar" ? "|" : separator}</span>
          )}
          {iconStyle !== "none" && (
            <ContactIconFrame
              type={f.type}
              iconStyle={iconStyle}
              accent={accent}
              iconColor={iconColor}
            />
          )}
          {f.value}
        </span>
      ))}
    </div>
  );
}
