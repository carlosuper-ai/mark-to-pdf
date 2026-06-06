import { useState } from "react";
import { useActiveResume, useResumeStore, uid } from "@/lib/resume-store";
import { parseMarkdownResume } from "@/lib/markdown-parser";
import type {
  PersonalDetails,
  ProficiencyLevel,
  ResumeData,
} from "@/lib/resume-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Wand2, Copy } from "lucide-react";

type SectionKey =
  | "import"
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languages";

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "import", label: "Import Markdown" },
  { key: "personal", label: "Personal Details" },
  { key: "summary", label: "Summary" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Work Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "languages", label: "Languages" },
];

export function ContentEditor({ section }: { section: SectionKey }) {
  switch (section) {
    case "import":
      return <ImportPanel />;
    case "personal":
      return <PersonalPanel />;
    case "summary":
      return <SummaryPanel />;
    case "skills":
      return <SkillsPanel />;
    case "experience":
      return <ExperiencePanel />;
    case "education":
      return <EducationPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "certifications":
      return <CertificationsPanel />;
    case "languages":
      return <LanguagesPanel />;
  }
}

function PanelShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </header>
      {children}
    </div>
  );
}

function useActive() {
  const resume = useActiveResume();
  const updateData = useResumeStore((s) => s.updateData);
  const replaceData = useResumeStore((s) => s.replaceData);
  const update = (updater: (d: ResumeData) => ResumeData) => updateData(resume.id, updater);
  return { resume, update, replaceData };
}

/* ---------------- Import ---------------- */
function ImportPanel() {
  const { resume, replaceData } = useActive();
  const [text, setText] = useState("");

  const sample = `# Carlo Supil\n\n## Senior Software Development Engineer in Test (SDET)\n\n+63 965 839 3095 | carlosuperdev@gmail.com\nManila, Philippines\nhttps://linkedin.com/in/carlosupil\n\n## SUMMARY\n\nSenior Software Engineer with 10+ years building reliable test automation across web, mobile, and API platforms.\n\n## SKILLS\n\n**Languages:** Python, TypeScript, JavaScript, Java\n**Tools:** Selenium, Playwright, Cypress, Postman\n**Cloud:** AWS, Docker, Kubernetes\n\n## PROFESSIONAL EXPERIENCE\n\n### Senior SDET\n\n**Acme Corp** Jan 2022 - Present\n- Designed end-to-end test framework adopted by 6 squads.\n- Cut nightly suite time by 42% via parallel sharding.\n\n### QA Engineer\n\n**Initech** Jun 2018 - Dec 2021\n- Built API contract tests covering 120+ endpoints.\n\n## EDUCATION\n\n### B.S. Computer Science\n\n**University of the Philippines** 2012 - 2016`;

  const handleImport = () => {
    if (!text.trim()) return;
    const parsed = parseMarkdownResume(text);
    replaceData(resume.id, parsed);
  };

  return (
    <PanelShell title="Import from Markdown" subtitle="Paste a markdown resume to auto-populate every section.">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setText(sample)}>
          Load sample
        </Button>
        <Button size="sm" onClick={handleImport} disabled={!text.trim()}>
          <Wand2 /> Parse &amp; replace
        </Button>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="# Your Name&#10;## Your Title&#10;..."
        className="min-h-[420px] font-mono text-xs"
      />
    </PanelShell>
  );
}

/* ---------------- Personal ---------------- */
function PersonalPanel() {
  const { resume, update } = useActive();
  const p = resume.data.personal;
  const set = (key: keyof PersonalDetails, value: string) =>
    update((d) => ({ ...d, personal: { ...d.personal, [key]: value } }));

  const fields: { key: keyof PersonalDetails; label: string; type?: string; placeholder?: string }[] = [
    { key: "fullName", label: "Full Name", placeholder: "Alex Morgan" },
    { key: "title", label: "Professional Title", placeholder: "Senior Product Designer" },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567" },
    { key: "location", label: "Location", placeholder: "City, Country" },
    { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/..." },
    { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/..." },
    { key: "website", label: "Website", type: "url", placeholder: "https://..." },
  ];

  return (
    <PanelShell title="Personal Details">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type={f.type ?? "text"}
              value={p[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/* ---------------- Summary ---------------- */
function SummaryPanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Summary" subtitle="2–4 sentences. Lead with role, years of experience, and your strongest impact.">
      <Textarea
        value={resume.data.summary}
        onChange={(e) => update((d) => ({ ...d, summary: e.target.value }))}
        className="min-h-[200px]"
        placeholder="Senior engineer with 8+ years building..."
      />
      <div className="text-xs text-muted-foreground text-right">
        {resume.data.summary.length} characters
      </div>
    </PanelShell>
  );
}

/* ---------------- Skills ---------------- */
function SkillsPanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Skills" subtitle="Group skills by category for easy scanning.">
      <div className="space-y-3">
        {resume.data.skills.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-border p-3 space-y-2 bg-card">
            <div className="flex gap-2">
              <Input
                value={cat.name}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    skills: d.skills.map((c) => (c.id === cat.id ? { ...c, name: e.target.value } : c)),
                  }))
                }
                placeholder="Category"
                className="font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => update((d) => ({ ...d, skills: d.skills.filter((c) => c.id !== cat.id) }))}
              >
                <Trash2 />
              </Button>
            </div>
            <Input
              value={cat.skills.join(", ")}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  skills: d.skills.map((c) =>
                    c.id === cat.id
                      ? { ...c, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }
                      : c,
                  ),
                }))
              }
              placeholder="Comma-separated skills"
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({ ...d, skills: [...d.skills, { id: uid(), name: "New Category", skills: [] }] }))
          }
        >
          <Plus /> Add Category
        </Button>
      </div>
    </PanelShell>
  );
}

/* ---------------- Experience ---------------- */
function ExperiencePanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Work Experience">
      <div className="space-y-3">
        {resume.data.experiences.map((e) => (
          <div key={e.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Job Title</Label>
                <Input
                  value={e.jobTitle}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, jobTitle: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Employer</Label>
                <Input
                  value={e.employer}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, employer: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={e.startDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, startDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={e.endDate}
                  disabled={e.current}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, endDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={e.current}
                    onChange={(ev) =>
                      update((d) => ({
                        ...d,
                        experiences: d.experiences.map((x) =>
                          x.id === e.id ? { ...x, current: ev.target.checked, endDate: ev.target.checked ? "" : x.endDate } : x,
                        ),
                      }))
                    }
                  />
                  Current position
                </label>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Location</Label>
                <Input
                  value={e.location}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, location: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bullet points (one per line)</Label>
              <Textarea
                value={e.bullets.join("\n")}
                onChange={(ev) =>
                  update((d) => ({
                    ...d,
                    experiences: d.experiences.map((x) =>
                      x.id === e.id
                        ? { ...x, bullets: ev.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }
                        : x,
                    ),
                  }))
                }
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    experiences: [...d.experiences, { ...e, id: uid() }],
                  }))
                }
              >
                <Copy /> Duplicate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({ ...d, experiences: d.experiences.filter((x) => x.id !== e.id) }))
                }
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              experiences: [
                ...d.experiences,
                {
                  id: uid(),
                  jobTitle: "",
                  employer: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  bullets: [],
                },
              ],
            }))
          }
        >
          <Plus /> Add Experience
        </Button>
      </div>
    </PanelShell>
  );
}

/* ---------------- Education ---------------- */
function EducationPanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Education">
      <div className="space-y-3">
        {resume.data.education.map((e) => (
          <div key={e.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Degree</Label>
                <Input
                  value={e.degree}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, degree: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>School</Label>
                <Input
                  value={e.school}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, school: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Year</Label>
                <Input
                  value={e.startDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, startDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Year</Label>
                <Input
                  value={e.endDate}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      education: d.education.map((x) =>
                        x.id === e.id ? { ...x, endDate: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }))
                }
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              education: [
                ...d.education,
                { id: uid(), degree: "", school: "", startDate: "", endDate: "" },
              ],
            }))
          }
        >
          <Plus /> Add Education
        </Button>
      </div>
    </PanelShell>
  );
}

/* ---------------- Projects ---------------- */
function ProjectsPanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Projects">
      <div className="space-y-3">
        {resume.data.projects.map((p) => (
          <div key={p.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={p.name} onChange={(ev) => update((d) => ({ ...d, projects: d.projects.map((x) => x.id === p.id ? { ...x, name: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={p.role} onChange={(ev) => update((d) => ({ ...d, projects: d.projects.map((x) => x.id === p.id ? { ...x, role: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>URL</Label>
                <Input type="url" value={p.url} onChange={(ev) => update((d) => ({ ...d, projects: d.projects.map((x) => x.id === p.id ? { ...x, url: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={p.technologies.join(", ")}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id
                          ? { ...x, technologies: ev.target.value.split(",").map((s) => s.trim()).filter(Boolean) }
                          : x,
                      ),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={p.description}
                  onChange={(ev) =>
                    update((d) => ({
                      ...d,
                      projects: d.projects.map((x) =>
                        x.id === p.id ? { ...x, description: ev.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== p.id) }))
                }
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              projects: [
                ...d.projects,
                { id: uid(), name: "", role: "", technologies: [], url: "", description: "" },
              ],
            }))
          }
        >
          <Plus /> Add Project
        </Button>
      </div>
    </PanelShell>
  );
}

/* ---------------- Certifications ---------------- */
function CertificationsPanel() {
  const { resume, update } = useActive();
  return (
    <PanelShell title="Certifications">
      <div className="space-y-3">
        {resume.data.certifications.map((c) => (
          <div key={c.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={c.name} onChange={(ev) => update((d) => ({ ...d, certifications: d.certifications.map((x) => x.id === c.id ? { ...x, name: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Organization</Label>
                <Input value={c.organization} onChange={(ev) => update((d) => ({ ...d, certifications: d.certifications.map((x) => x.id === c.id ? { ...x, organization: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Issue Date</Label>
                <Input value={c.issueDate} onChange={(ev) => update((d) => ({ ...d, certifications: d.certifications.map((x) => x.id === c.id ? { ...x, issueDate: ev.target.value } : x) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input value={c.url ?? ""} onChange={(ev) => update((d) => ({ ...d, certifications: d.certifications.map((x) => x.id === c.id ? { ...x, url: ev.target.value } : x) }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => ({ ...d, certifications: d.certifications.filter((x) => x.id !== c.id) }))
                }
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              certifications: [
                ...d.certifications,
                { id: uid(), name: "", organization: "", issueDate: "" },
              ],
            }))
          }
        >
          <Plus /> Add Certification
        </Button>
      </div>
    </PanelShell>
  );
}

/* ---------------- Languages ---------------- */
function LanguagesPanel() {
  const { resume, update } = useActive();
  const levels: ProficiencyLevel[] = ["Native", "Fluent", "Professional", "Intermediate", "Beginner"];
  return (
    <PanelShell title="Languages">
      <div className="space-y-2">
        {resume.data.languages.map((l) => (
          <div key={l.id} className="flex gap-2 items-center">
            <Input
              value={l.language}
              onChange={(ev) =>
                update((d) => ({
                  ...d,
                  languages: d.languages.map((x) =>
                    x.id === l.id ? { ...x, language: ev.target.value } : x,
                  ),
                }))
              }
              placeholder="Language"
              className="flex-1"
            />
            <Select
              value={l.proficiency}
              onValueChange={(v) =>
                update((d) => ({
                  ...d,
                  languages: d.languages.map((x) =>
                    x.id === l.id ? { ...x, proficiency: v as ProficiencyLevel } : x,
                  ),
                }))
              }
            >
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map((lv) => (
                  <SelectItem key={lv} value={lv}>{lv}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                update((d) => ({ ...d, languages: d.languages.filter((x) => x.id !== l.id) }))
              }
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            update((d) => ({
              ...d,
              languages: [...d.languages, { id: uid(), language: "", proficiency: "Professional" }],
            }))
          }
        >
          <Plus /> Add Language
        </Button>
      </div>
    </PanelShell>
  );
}