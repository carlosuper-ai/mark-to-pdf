# Resume Builder

A browser-based resume builder that lets you write in Markdown or edit field-by-field, preview your resume live, and export a print-quality PDF.

## Features

- **Markdown import** — paste a Markdown resume and every section populates automatically
- **Visual editor** — structured forms for personal details, experience, education, projects, certifications, skills, and languages
- **Live preview** — see changes reflected instantly as you type
- **Design templates** — multiple presets (Modern, Professional, ATS Classic, Executive, FlowCV, and more)
- **Deep customization** — typography, font sizes, colors (single/multi-color modes), page margins, spacing, section heading styles, entry layout templates, header alignment, photo, link styling, and footer
- **Section management** — drag to reorder sections, toggle visibility per section
- **ATS-friendly export** — standard PDF mode plus a stripped-down ATS mode optimized for resume parsers
- **Multiple resumes** — create, duplicate, rename, and switch between resumes; state persists in localStorage
- **Page formats** — A4, Letter, B5, A5, Legal

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | TanStack Router |
| State | Zustand (with localStorage persistence) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Drag & drop | dnd-kit |
| PDF export | Puppeteer |
| Build | Vite |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── components/
│   ├── builder/
│   │   ├── sections/        # 9 content editor panels (one per resume section)
│   │   ├── customize/       # 12 design accordion panels
│   │   ├── templates/       # Resume render templates (Modern, Professional)
│   │   ├── ContentEditor    # Section router
│   │   ├── CustomizePanel   # Accordion container
│   │   └── ResumePreview    # Scaled live preview
│   ├── layout/              # TopBar, ResumeSelector
│   ├── resume/              # ResumeRenderer (template switcher)
│   └── ui/                  # shadcn/ui components
├── constants/               # PDF dimensions, font URLs, template IDs
├── hooks/                   # useResumeEditor, useDesignUpdater
├── lib/
│   ├── store/               # Zustand store slices and migrations
│   ├── resume-types.ts      # All TypeScript types
│   ├── markdown-parser.ts   # Markdown → ResumeData parser
│   ├── pdf-export.ts        # Puppeteer PDF generation
│   └── ui-store.ts          # UI state (active tab)
└── routes/
    └── index.tsx            # Main layout
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
