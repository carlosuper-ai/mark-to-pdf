import type { DateFormat } from "./resume-types";

const MONTH_MAP: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

/**
 * Normalize any human-readable date string to the format expected by
 * `<input type="month">` (YYYY-MM) or year-only (YYYY).
 *
 * Handles: "Jan 2022", "January 2022", "2022-01", "2022".
 * Returns "" for unrecognised input.
 */
export function normalizeToMonthValue(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}$/.test(s)) return s; // already YYYY-MM
  if (/^\d{4}$/.test(s)) return s; // year-only (YYYY)
  const m = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const mm = MONTH_MAP[m[1].toLowerCase().slice(0, 3)];
    if (mm) return `${m[2]}-${mm}`;
  }
  return "";
}

/** Parse a stored date string ("YYYY-MM", "YYYY-MM-DD", or "YYYY") into parts. */
function parseDateParts(date: string): { year: number; month?: number; day?: number } | null {
  const full = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (full) return { year: +full[1], month: +full[2], day: +full[3] };
  const ym = date.match(/^(\d{4})-(\d{2})$/);
  if (ym) return { year: +ym[1], month: +ym[2] };
  const y = date.match(/^(\d{4})$/);
  if (y) return { year: +y[1] };
  return null;
}

export function formatResumeDate(date: string, format: DateFormat): string {
  if (!date) return "";
  const parts = parseDateParts(date);
  if (!parts) return date; // already formatted text, pass through

  const { year, month, day } = parts;

  if (!month) return String(year); // year-only — no month to format

  const dt = new Date(year, month - 1, day ?? 1);

  switch (format) {
    case "MMM YYYY":
      return dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    case "MMMM YYYY":
      return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    case "MMM DD, YYYY":
      return dt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    case "MMMM DD, YYYY":
      return dt.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
    case "MM/DD/YYYY":
      return `${String(month).padStart(2, "0")}/${String(day ?? 1).padStart(2, "0")}/${year}`;
    case "DD/MM/YYYY":
      return `${String(day ?? 1).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${String(month).padStart(2, "0")}-${String(day ?? 1).padStart(2, "0")}`;
    default:
      return dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
  format: DateFormat,
  separator = "-",
): string {
  const a = formatResumeDate(start, format);
  const b = current ? "Present" : formatResumeDate(end, format);
  return [a, b].filter(Boolean).join(` ${separator} `);
}
