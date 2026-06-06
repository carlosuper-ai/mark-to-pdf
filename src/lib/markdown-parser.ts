import {
  type ResumeData,
  type SkillCategory,
  type Experience,
  type Education,
  emptyResumeData,
} from "./resume-types";

const uid = () => Math.random().toString(36).slice(2, 10);

const sectionAliases: Record<string, keyof ResumeData | "header"> = {
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

function stripMd(line: string) {
  return line
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function extractContact(lines: string[], data: ResumeData) {
  const text = lines.join(" ");
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (email) data.personal.email = email[0];
  const phone = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  if (phone) data.personal.phone = phone[0].trim();
  const linkedin = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s|)]+/i);
  if (linkedin) data.personal.linkedin = linkedin[0];
  const github = text.match(/https?:\/\/(www\.)?github\.com\/[^\s|)]+/i);
  if (github) data.personal.github = github[0];
}

export function parseMarkdownResume(markdown: string): ResumeData {
  const data = emptyResumeData();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let currentSection: keyof ResumeData | "header" | null = "header";
  const buckets: Record<string, string[]> = { header: [] };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h1 = line.match(/^#\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    if (h1) {
      if (!data.personal.fullName) {
        data.personal.fullName = stripMd(h1[1]);
        currentSection = "header";
        buckets.header = buckets.header || [];
        continue;
      }
    }
    if (h2) {
      const key = stripMd(h2[1]).toLowerCase().trim();
      // First H2 after name with no recognized section name -> title
      if (
        currentSection === "header" &&
        !data.personal.title &&
        !(key in sectionAliases)
      ) {
        data.personal.title = stripMd(h2[1]);
        continue;
      }
      const mapped = sectionAliases[key];
      if (mapped) {
        currentSection = mapped;
        buckets[mapped] = buckets[mapped] || [];
        continue;
      }
      // unknown section - skip but keep collecting under header
      currentSection = null;
      continue;
    }
    if (currentSection) {
      buckets[currentSection] = buckets[currentSection] || [];
      buckets[currentSection].push(line);
    }
  }

  extractContact(buckets.header ?? [], data);
  // Try to detect location in header lines (line without @, http, digits-heavy)
  for (const l of buckets.header ?? []) {
    const t = stripMd(l);
    if (
      t &&
      !/@|http|linkedin|github/i.test(t) &&
      !/\d{3,}/.test(t) &&
      t.split(/\s+/).length <= 6 &&
      t !== data.personal.fullName &&
      t !== data.personal.title
    ) {
      if (!data.personal.location) data.personal.location = t;
    }
  }

  if (buckets.summary) {
    data.summary = buckets.summary
      .map((l) => stripMd(l))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  if (buckets.skills) {
    const cats: SkillCategory[] = [];
    for (const l of buckets.skills) {
      const m = l.match(/\*\*(.+?)\*\*:?\s*(.*)/);
      if (m) {
        cats.push({
          id: uid(),
          name: m[1].trim(),
          skills: m[2]
            .split(/[,;]/)
            .map((s) => stripMd(s))
            .filter(Boolean),
        });
      } else {
        const colon = l.match(/^([^:]+):\s*(.+)/);
        if (colon) {
          cats.push({
            id: uid(),
            name: stripMd(colon[1]),
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
          else
            cats.push({ id: uid(), name: "Skills", skills: items });
        }
      }
    }
    data.skills = cats.filter((c) => c.skills.length);
  }

  if (buckets.experiences) {
    const exps: Experience[] = [];
    let current: Experience | null = null;
    for (const raw of buckets.experiences) {
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
        const rest = bold[2].trim();
        const dates = rest.match(
          /([A-Za-z]+\s*\d{4}|\d{4})\s*[-–—]\s*(Present|[A-Za-z]+\s*\d{4}|\d{4})/i,
        );
        if (dates) {
          current.startDate = dates[1];
          current.endDate = /present/i.test(dates[2]) ? "" : dates[2];
          current.current = /present/i.test(dates[2]);
        }
      } else if (current && bullet) {
        current.bullets.push(stripMd(bullet[1]));
      } else if (current && raw.trim()) {
        current.bullets.push(stripMd(raw));
      }
    }
    if (current) exps.push(current);
    data.experiences = exps;
  }

  if (buckets.education) {
    const edu: Education[] = [];
    let current: Education | null = null;
    for (const raw of buckets.education) {
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
        const dates = bold[2].match(/(\d{4})\s*[-–—]\s*(\d{4}|Present)/i);
        if (dates) {
          current.startDate = dates[1];
          current.endDate = dates[2];
        }
      } else if (current && raw.trim()) {
        current.description =
          (current.description ? current.description + " " : "") + stripMd(raw);
      }
    }
    if (current) edu.push(current);
    data.education = edu;
  }

  return data;
}