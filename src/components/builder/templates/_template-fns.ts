import type { ColorSettings } from "@/lib/resume-types";

export function applyCapitalization(
  text: string,
  cap: "original" | "capitalize" | "uppercase",
): string {
  if (cap === "uppercase") return text.toUpperCase();
  if (cap === "capitalize") return text.replace(/\b\w/g, (c) => c.toUpperCase());
  return text;
}

export function resolveAccent(colors: ColorSettings): string {
  return colors.mode === "multi" ? colors.multi.accent : colors.accent;
}
