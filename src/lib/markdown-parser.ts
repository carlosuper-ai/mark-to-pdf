import {
  type ResumeData,
  type SkillCategory,
  type Experience,
  type Education,
  emptyResumeData,
} from "./resume-types";
import { normalizeToMonthValue } from "./date-utils";
import { uid } from "./uid";

const sectionAliases: Record<string, keyof ResumeData | "header"> = {
  header: "header",
  summary: "summary",
  profile: "summary",
  about: "summary",
  skills: "skills",
  "technical skills": "skills",
  experience: "experiences",
  "work experience": "experiences",
  "professional experience": "experiences",
  employment: "experiences",
  education: "education",
  projects: "projects",
  certifications: "certifications",
  certificates: "certifications",
  languages: "languages",
};

// Matches "Month YYYY - Month YYYY", "Month YYYY - Present", "YYYY - YYYY", etc.
const DATE_RANGE_RE = /([A-Za-z]+\s+\d{4}|\d{4})\s*[-–—]\s*(Present|[A-Za-z]+\s+\d{4}|\d{4})/i;

function stripMd(line: string) {
  return line
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

// Classifies and stores one pipe-separated contact segment.
function parseContactSegment(raw: string, data: ResumeData) {
  // Resolve markdown links: [text](url) — use text for mailto:, URL otherwise.
  let seg = raw;
  const mdLink = raw.match(/\[([^\]]*)\]\(([^)]+)\)/);
  if (mdLink) {
    seg = /^mailto:/i.test(mdLink[2]) ? mdLink[1] : mdLink[2];
  }

  // Strip common "Label: " prefixes, e.g. "GitHub: github.com/..."
  seg = seg.replace(/^(github|linkedin|website|portfolio|email|phone|web)\s*:\s*/i, "").trim();

  // Email
  const emailMatch = seg.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch && !data.personal.email) {
    data.personal.email = emailMatch[0];
    return;
  }

  // LinkedIn
  if (/linkedin\.com/i.test(seg) && !data.personal.linkedin) {
    data.personal.linkedin = seg;
    return;
  }

  // GitHub
  if (/github\.com/i.test(seg) && !data.personal.github) {
    data.personal.github = seg;
    return;
  }

  // Generic URL → website
  if (/^https?:\/\//i.test(seg) && !data.personal.website) {
    data.personal.website = seg;
    return;
  }

  // Phone (digits/+/spaces/dashes/parens only)
  if (/^[+\d][\d\s().-]{6,}$/.test(seg) && !data.personal.phone) {
    data.personal.phone = seg.trim();
    return;
  }

  // Location — any remaining segment with letters
  if (!data.personal.location && /[a-zA-Z]/.test(seg) && seg.length > 1) {
    data.personal.location = seg.trim();
  }
}

// Parses all contact fields from the header lines.
// Pipe-separated lines (e.g. "+63 … | email | linkedin.com/…") are split into
// individual segments so every field is identified. Non-pipe lines only have
// email/phone extracted to avoid treating the name or title as location.
function extractContact(lines: string[], data: ResumeData) {
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes("|")) {
      for (const seg of trimmed
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)) {
        parseContactSegment(seg, data);
      }
    } else {
      // Single-value line — only safe to pull email/phone
      if (!data.personal.email) {
        const m = trimmed.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
        if (m) data.personal.email = m[0];
      }
      if (!data.personal.phone) {
        const m = trimmed.match(/(\+?\d[\d\s().-]{7,}\d)/);
        if (m) data.personal.phone = m[0].trim();
      }
    }
  }
}

export function parseMarkdownResume(markdown: string): ResumeData {
  const data = emptyResumeData();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let currentSection: keyof ResumeData | "header" | null = null;
  const buckets: Record<string, string[]> = {};
  // Track whether the name came from an H1 line (vs. header bucket first line)
  let nameFromH1 = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h1 = line.match(/^#\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);

    if (h1 || h2) {
      const headingText = (h1 ?? h2)![1];
      const key = stripMd(headingText).toLowerCase().trim();
      const mapped = sectionAliases[key];

      if (mapped) {
        // Both H1 and H2 are valid section headers
        currentSection = mapped;
        buckets[mapped] = buckets[mapped] || [];
        continue;
      }

      if (h1 && !data.personal.fullName) {
        // H1 heading is the person's name
        data.personal.fullName = stripMd(h1[1]);
        nameFromH1 = true;
        currentSection = "header";
        buckets.header = buckets.header || [];
        continue;
      }

      if (h2 && currentSection === "header" && !data.personal.title && !(key in sectionAliases)) {
        // First unrecognised H2 in header section is the job title (Pattern 3)
        data.personal.title = stripMd(h2[1]);
        continue;
      }

      currentSection = null;
      continue;
    }

    if (currentSection) {
      buckets[currentSection] = buckets[currentSection] || [];
      buckets[currentSection].push(line);
    }
  }

  // --- Header section ---
  const headerLines = (buckets.header ?? []).map((l) => l.trimEnd());

  if (!data.personal.fullName) {
    // New format: first non-empty line is the name
    const nameLine = headerLines.find((l) => l.trim());
    if (nameLine) data.personal.fullName = stripMd(nameLine);
  }

  if (!data.personal.title) {
    const nonEmpty = headerLines.filter((l) => l.trim());
    // When name came from H1, it is NOT in the header bucket, so start at i=0.
    // When name came from the bucket (headerless format), it IS at i=0, so skip it (i=1).
    for (let i = nameFromH1 ? 0 : 1; i < nonEmpty.length; i++) {
      if (!/@|https?:\/\/|\||\+\d/i.test(nonEmpty[i])) {
        data.personal.title = stripMd(nonEmpty[i]);
        break;
      }
    }
  }

  extractContact(headerLines, data);

  // --- Summary ---
  if (buckets.summary) {
    data.summary = buckets.summary
      .map((l) => stripMd(l))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  // --- Skills ---
  if (buckets.skills) {
    const cats: SkillCategory[] = [];
    for (const l of buckets.skills) {
      const bold = l.match(/\*\*(.+?)\*\*:?\s*(.*)/);
      if (bold) {
        cats.push({
          id: uid(),
          name: bold[1].trim().replace(/:+\s*$/, ""),
          skills: bold[2]
            .split(/[,;]/)
            .map((s) => stripMd(s))
            .filter(Boolean),
        });
      } else {
        const colon = l.match(/^([^:]+):\s*(.+)/);
        if (colon) {
          cats.push({
            id: uid(),
            name: stripMd(colon[1]).replace(/:+\s*$/, ""),
            skills: colon[2]
              .split(/[,;]/)
              .map((s) => stripMd(s))
              .filter(Boolean),
          });
        } else if (/^\s*[-*+]/.test(l)) {
          const last = cats[cats.length - 1];
          const items = stripMd(l)
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (last) last.skills.push(...items);
          else cats.push({ id: uid(), name: "Skills", skills: items });
        }
      }
    }
    data.skills = cats.filter((c) => c.skills.length);
  }

  // --- Experiences ---
  if (buckets.experiences) {
    data.experiences = parseExperiences(buckets.experiences);
  }

  // --- Education ---
  if (buckets.education) {
    data.education = parseEducation(buckets.education);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Experience parsing
// ---------------------------------------------------------------------------

function parseExperiences(lines: string[]): Experience[] {
  // H3-based format (old): "### Job Title"
  if (lines.some((l) => /^###\s+/.test(l))) {
    return parseExperiencesH3(lines);
  }
  return parseExperiencesPlainText(lines);
}

function parseExperiencesH3(lines: string[]): Experience[] {
  const exps: Experience[] = [];
  let current: Experience | null = null;
  for (const raw of lines) {
    const h3 = raw.match(/^###\s+(.+)/);
    const bold = raw.match(/^\*\*(.+?)\*\*\s*(.*)/);
    const bullet = raw.match(/^\s*[-*+]\s+(.+)/);
    if (h3) {
      if (current) exps.push(current);
      current = {
        id: uid(),
        jobTitle: stripMd(h3[1]),
        employer: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [],
      };
    } else if (current && bold && !current.employer) {
      current.employer = bold[1].trim();
      const dates = bold[2].trim().match(DATE_RANGE_RE);
      if (dates) {
        current.startDate = normalizeToMonthValue(dates[1]);
        current.endDate = /present/i.test(dates[2]) ? "" : normalizeToMonthValue(dates[2]);
        current.current = /present/i.test(dates[2]);
      }
    } else if (current && bullet) {
      current.bullets.push(stripMd(bullet[1]));
    } else if (current && raw.trim()) {
      current.bullets.push(stripMd(raw));
    }
  }
  if (current) exps.push(current);
  return exps;
}

function parseExperiencesPlainText(lines: string[]): Experience[] {
  const exps: Experience[] = [];

  // Anchor on date lines — each one marks an entry boundary.
  const dateIdxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().match(DATE_RANGE_RE)) dateIdxs.push(i);
  }
  if (!dateIdxs.length) return [];

  for (let e = 0; e < dateIdxs.length; e++) {
    const di = dateIdxs[e];
    const nextDi = e + 1 < dateIdxs.length ? dateIdxs[e + 1] : lines.length;

    // Scan backwards from the date line to collect the entry header block
    // (consecutive non-blank lines immediately before the date).
    const header: string[] = [];
    for (let i = di - 1; i >= 0 && lines[i].trim(); i--) {
      header.unshift(lines[i].trim());
    }
    const employer = header.length >= 1 ? stripMd(header[header.length - 1]) : "";
    const jobTitle = header.length >= 2 ? stripMd(header[header.length - 2]) : employer;

    // Extract dates and optional inline location ("Date | Location")
    const dateLine = lines[di].trim();
    const dateMatch = dateLine.match(DATE_RANGE_RE)!;
    const afterDate = dateLine
      .replace(DATE_RANGE_RE, "")
      .replace(/^\s*[|,]\s*/, "")
      .trim();
    const location = afterDate && !/https?:\/\//i.test(afterDate) ? afterDate : "";

    // Description: lines between this date and the header block of the next entry.
    let descEnd = nextDi;
    if (e + 1 < dateIdxs.length) {
      // Walk backwards from the next date line to find where its header block starts.
      let j = dateIdxs[e + 1] - 1;
      while (j > di && lines[j].trim()) j--;
      descEnd = j + 1;
    }

    const bullets: string[] = [];
    for (let i = di + 1; i < descEnd; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      const bulletMatch = lines[i].match(/^\s*[-*+]\s+(.+)/);
      bullets.push(bulletMatch ? stripMd(bulletMatch[1]) : stripMd(t));
    }

    exps.push({
      id: uid(),
      jobTitle,
      employer,
      location,
      startDate: normalizeToMonthValue(dateMatch[1]),
      endDate: /present/i.test(dateMatch[2]) ? "" : normalizeToMonthValue(dateMatch[2]),
      current: /present/i.test(dateMatch[2]),
      bullets,
    });
  }

  return exps;
}

// ---------------------------------------------------------------------------
// Education parsing
// ---------------------------------------------------------------------------

function parseEducation(lines: string[]): Education[] {
  // H3-based format (old): "### Degree"
  if (lines.some((l) => /^###\s+/.test(l))) {
    return parseEducationH3(lines);
  }
  return parseEducationPlainText(lines);
}

function parseEducationH3(lines: string[]): Education[] {
  const edu: Education[] = [];
  let current: Education | null = null;
  for (const raw of lines) {
    const h3 = raw.match(/^###\s+(.+)/);
    const bold = raw.match(/^\*\*(.+?)\*\*\s*(.*)/);
    if (h3) {
      if (current) edu.push(current);
      current = {
        id: uid(),
        degree: stripMd(h3[1]),
        school: "",
        startDate: "",
        endDate: "",
      };
    } else if (current && bold) {
      current.school = bold[1].trim();
      const dates = bold[2].match(DATE_RANGE_RE);
      if (dates) {
        current.startDate = normalizeToMonthValue(dates[1]);
        current.endDate = /present/i.test(dates[2]) ? "" : normalizeToMonthValue(dates[2]);
      }
    } else if (current && raw.trim()) {
      current.description = (current.description ? current.description + " " : "") + stripMd(raw);
    }
  }
  if (current) edu.push(current);
  return edu;
}

function parseEducationPlainText(lines: string[]): Education[] {
  const edu: Education[] = [];

  // Split into blocks separated by blank lines — each block is one entry.
  const blocks: string[][] = [];
  let block: string[] = [];
  for (const raw of lines) {
    if (!raw.trim()) {
      if (block.length) {
        blocks.push(block);
        block = [];
      }
    } else {
      block.push(raw.trim());
    }
  }
  if (block.length) blocks.push(block);

  for (const blk of blocks) {
    if (!blk.length) continue;
    let degree = "";
    let school = "";
    let startDate = "";
    let endDate = "";
    const descParts: string[] = [];

    for (const line of blk) {
      // Line contains a date range — may also have school name before the date.
      // e.g. "University of Technology Sydney | 2022 - 2024"
      const dateExec = DATE_RANGE_RE.exec(line);
      if (dateExec && !startDate) {
        startDate = normalizeToMonthValue(dateExec[1]);
        endDate = /present/i.test(dateExec[2]) ? "" : normalizeToMonthValue(dateExec[2]);
        // Text before the date (strip trailing pipe/space) is the school name.
        const beforeDate = line
          .slice(0, dateExec.index)
          .replace(/\s*\|\s*$/, "")
          .trim();
        const candidate = stripMd(beforeDate);
        if (candidate && !school) school = candidate;
        continue;
      }

      // Bold line → degree (e.g. "**Graduate Certificate, Technology Management**")
      if (/^\*\*.*\*\*/.test(line) && !degree) {
        degree = stripMd(line);
        continue;
      }

      // Plain line with pipe and no date → "School | extra" (e.g. "School | City")
      if (line.includes("|") && !school) {
        school = stripMd(line.split("|")[0].trim());
        continue;
      }

      // Plain lines: first → school, second → degree (plain-text format fallback)
      if (!school && !degree) {
        school = stripMd(line);
      } else if (school && !degree) {
        degree = stripMd(line);
      } else if (degree && !school) {
        school = stripMd(line);
      } else {
        descParts.push(stripMd(line));
      }
    }

    const entry: Education = { id: uid(), degree, school, startDate, endDate };
    if (descParts.length) entry.description = descParts.join(" ");
    edu.push(entry);
  }

  return edu;
}
