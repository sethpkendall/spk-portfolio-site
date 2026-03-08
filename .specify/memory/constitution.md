# SPK Portfolio Site — Showcase Project Constitution

## Context

This constitution governs the development of **showcase projects** — self-contained demo applications embedded within a Next.js portfolio site. Each project lives under `projects/<project-id>/` and is rendered within the site's showcase platform at `/showcase/<project-id>`. The portfolio site itself is already built; this constitution governs only the creation of new showcase projects within it.

## Core Principles

### I. Self-Contained Project Architecture

Every showcase project MUST be a self-contained unit under `projects/<project-id>/` following this structure:

```
projects/<project-id>/
  index.tsx          # Default export: the root "use client" React component
  metadata.json      # Project metadata (title, description, tags, techStack, aiTools, category)
  components/        # Child components used only by this project
  exampleData.ts     # (optional) Seed/example data for demo purposes
```

- The root `index.tsx` MUST use the `"use client"` directive and export a default React component.
- Components MUST NOT import from other showcase projects. Shared UI components in `components/ui/` are allowed.
- The project MUST be registered in `projects/registry.ts` following the existing pattern (dynamic import, code file list, metadata import).

### II. Technology Stack Constraints

All showcase projects use the portfolio site's existing dependencies. Do NOT add new npm packages unless absolutely necessary.

- **Framework**: React 18 + TypeScript, rendered within Next.js (but projects are client-only components)
- **Styling**: Tailwind CSS (v3) with `tailwind-merge` and `class-variance-authority`. Custom CSS is acceptable for animations and thematic styling.
- **UI Primitives**: Radix UI components are available (Dialog, Popover, Select, Toggle, Tooltip, Slider, Label). The `components/ui/` directory contains pre-built wrappers.
- **Data Persistence**: Dexie.js over IndexedDB. Each project gets its own Dexie database class in `models/db.ts` and interfaces in `models/interfaces.ts`.
- **Icons**: `lucide-react` for iconography.
- **Charts**: `recharts` is available if data visualization is needed.
- **Utilities**: `date-fns`, `clsx`, `light-date`, and helpers in `lib/utils.ts`.

### III. Data Layer Convention

- Each project that persists data MUST define its own `Dexie` subclass in `models/db.ts` with a unique database name (e.g., `PomodoroTimerDB`).
- TypeScript interfaces for all stored entities MUST be defined in `models/interfaces.ts`.
- Projects SHOULD provide example/seed data (via an `exampleData.ts` file) so the demo is immediately usable on first visit.
- All data is client-side only. No server actions, no API routes, no external services.

### IV. Polish & Visual Quality

This portfolio exists to demonstrate front-end craftsmanship. Every project MUST:

- Be fully responsive (mobile-first, graceful scaling to desktop).
- Include thoughtful transitions and micro-animations where they enhance UX.
- Use consistent spacing, typography, and color within the project's own design language.
- Handle empty states, loading states, and edge cases gracefully with clear visual feedback.
- Feel like a finished product, not a prototype.

### V. Simplicity & Pragmatism

- Start with the simplest implementation that delivers a complete experience. Avoid over-engineering.
- State management via React hooks (`useState`, `useEffect`, `useCallback`, `useRef`). No external state libraries.
- Prefer composition over abstraction. A component used once does not need to be "reusable."
- Code should be readable by a junior developer reviewing the showcase.

## Registry & Metadata

When adding a new project to the showcase, the following MUST be updated:

1. **`projects/registry.ts`**: Add a new entry to the `projects` record with dynamic imports for the module and metadata, plus a `codeFiles` array listing all source files to display in the code viewer.
2. **`metadata.json`**: Must conform to the `ProjectMetadata` interface in `types/project.ts`:
   - `id`: kebab-case project directory name
   - `title`: Human-readable project name
   - `description`: 1–2 sentence summary
   - `tags`: Topical tags for categorization
   - `createdAt` / `updatedAt`: ISO date strings
   - `aiTools`: AI tools used in development (e.g., `"GitHub Copilot"`, `"Spec-Kit"`)
   - `techStack`: Runtime technologies (e.g., `"React"`, `"Tailwind CSS"`, `"Dexie.js"`)
   - `category`: One of `app | game | visualization | tool | experiment`
   - `documentation`: Markdown string describing the project, its features, and technical implementation

## Governance

- This constitution is read by the AI agent at the start of every `/speckit.*` command. It governs all decisions during specification, planning, and implementation.
- If a decision contradicts this constitution, the constitution wins.
- Amendments require updating this file and noting the change in the version line below.

**Version**: 1.0.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
