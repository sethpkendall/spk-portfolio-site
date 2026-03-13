# Implementation Plan: Pomodoro Timer

**Branch**: `pomodoro` | **Date**: 2026-03-13 | **Spec**: `.specify/memory/001-pomodoro-timer/spec.md`
**Input**: Feature specification from `/speckit.specify` — "An Italian-inspired Pomodoro productivity timer with rich visual polish, session tracking, and delightful completion celebrations."

---

## Summary

Build a fully self-contained Pomodoro Timer showcase project under `projects/pomodoro-timer/`. The timer implements the classic Pomodoro technique (25 min work → 5 min short break → repeat; 15 min long break after 4 pomodoros) with an Italian-inspired visual design, CSS-driven celebration animations, Dexie.js session persistence, configurable durations, and a session history view. All state management uses React hooks (`useState`, `useRef`, `useCallback`); data reactivity uses `useLiveQuery` from `dexie-react-hooks`. Timer accuracy is ensured via `Date.now()` anchoring to survive browser tab backgrounding.

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 18  
**Primary Dependencies**: React, Tailwind CSS 3, Dexie.js 4, dexie-react-hooks, lucide-react, date-fns, tailwindcss-animate  
**Storage**: IndexedDB via Dexie.js (client-side only)  
**Testing**: Manual acceptance testing per spec scenarios (no test framework in project)  
**Target Platform**: Web — responsive 320px to 1440px+  
**Project Type**: Client-side SPA component (embedded in Next.js portfolio)  
**Performance Goals**: 60fps animations, ±1s timer accuracy when backgrounded  
**Constraints**: No new npm dependencies, no server-side code, no external animation libraries  
**Scale/Scope**: Single-page component with ~8–10 child components

---

## Constitution Check

*GATE: Must pass before implementation. Verified against `.specify/memory/constitution.md` v1.0.0.*

| Rule | Status | Notes |
|------|--------|-------|
| I. Self-Contained Architecture | ✅ PASS | All code under `projects/pomodoro-timer/`, `"use client"` root, no cross-project imports |
| II. Technology Stack Constraints | ✅ PASS | Uses only existing deps: React, Tailwind, Dexie, lucide-react, date-fns |
| III. Data Layer Convention | ✅ PASS | Own Dexie subclass `PomodoroTimerDB` in `models/db.ts`, interfaces in `models/interfaces.ts` |
| IV. Polish & Visual Quality | ✅ PASS — by design | Italian theme, celebration animations, responsive, empty/edge states handled |
| V. Simplicity & Pragmatism | ✅ PASS | `useState`/`useRef` only, no external state libraries, composition over abstraction |
| Registry & Metadata | ✅ PASS | `metadata.json` already exists; `registry.ts` entry exists, will update `codeFiles` |

No constitution violations. No complexity justification needed.

---

## Project Structure

### Documentation (this feature)

```text
.specify/memory/001-pomodoro-timer/
├── spec.md              # Feature specification (/speckit.specify output)
├── plan.md              # This file (/speckit.plan output)
└── tasks.md             # Task breakdown (/speckit.tasks output — future)
```

### Source Code

```text
projects/pomodoro-timer/
├── index.tsx                          # Root component — orchestrates state, layout, timer logic
├── metadata.json                      # Project metadata (already exists)
├── components/
│   ├── TimerDisplay.tsx               # Circular timer ring + MM:SS countdown display
│   ├── TimerControls.tsx              # Start/Pause/Resume/Reset buttons
│   ├── CycleIndicator.tsx             # Visual 0–4 pomodoro progress (tomato dots)
│   ├── SessionHistory.tsx             # List of completed sessions from IndexedDB
│   ├── SettingsPanel.tsx              # Configurable durations (gear icon trigger)
│   ├── CelebrationAnimation.tsx       # CSS/SVG celebration overlay (confetti, tomato burst)
│   └── TodaySummary.tsx               # "N 🍅 today" display

models/
├── db.ts                              # Add PomodoroTimerDB class + ptDB singleton
├── interfaces.ts                      # Add PomodoroSession + PomodoroSettings interfaces

projects/registry.ts                   # Update codeFiles array for pomodoro-timer
```

**Structure Decision**: Single showcase project following existing patterns. All components live under `projects/pomodoro-timer/components/`. Data layer additions go into existing shared `models/` files. No new directories outside the established conventions.

---

## Data Model

### Entities

```typescript
// models/interfaces.ts — additions

interface PomodoroSession {
  id?: number;                         // Auto-increment PK
  completedAt: Date;                   // Timestamp when session finished
  durationMinutes: number;             // Actual duration of the session
  type: 'work' | 'shortBreak' | 'longBreak';  // Session type
}

interface PomodoroSettings {
  id?: number;                         // Auto-increment PK (single row, id=1)
  workMinutes: number;                 // Default: 25, range: 1–60
  shortBreakMinutes: number;           // Default: 5, range: 1–30
  longBreakMinutes: number;            // Default: 15, range: 1–30
}
```

### Dexie Schema

```typescript
// models/db.ts — addition

class PomodoroTimerDB extends Dexie {
  pomodoroSessions!: Table<PomodoroSession, number>;
  pomodoroSettings!: Table<PomodoroSettings, number>;

  constructor() {
    super('PomodoroTimerDB');
    this.version(1).stores({
      pomodoroSessions: '++id, completedAt, type',
      pomodoroSettings: '++id',
    });
  }
}

export const ptDB = new PomodoroTimerDB();
```

### Data Access Patterns

| Operation | Method | Trigger |
|-----------|--------|---------|
| Load settings | `ptDB.pomodoroSettings.get(1)` | App mount via `useLiveQuery` |
| Save settings | `ptDB.pomodoroSettings.put({ id: 1, ...settings })` | Settings panel change |
| Record completion | `ptDB.pomodoroSessions.add({ completedAt, durationMinutes, type })` | Timer reaches 0:00 |
| Load history | `ptDB.pomodoroSessions.orderBy('completedAt').reverse().toArray()` | History panel via `useLiveQuery` |
| Today count | `ptDB.pomodoroSessions.where('completedAt').above(startOfToday).filter(s => s.type === 'work').count()` | Today summary via `useLiveQuery` |

### Graceful Degradation

If Dexie fails to initialize (e.g., private browsing / IndexedDB unavailable):
- Wrap all DB calls in try/catch
- Set a `dbAvailable` state flag on mount
- Timer functions fully without persistence — history simply won't display
- Show a subtle muted warning: "Session history unavailable in this browser mode"

---

## Component Architecture

### Component Tree

```
PomodoroTimer (index.tsx)
├── Header (inline — title + today summary)
│   └── TodaySummary
├── TimerDisplay
│   └── CycleIndicator
├── TimerControls
├── CelebrationAnimation (conditional overlay)
├── SettingsPanel (collapsible/dialog)
└── SessionHistory
```

### State Management

All state lives in `index.tsx` and flows down via props. No Context, no useReducer.

```typescript
// Core timer state
const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused'>('idle');
const [phase, setPhase] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
const [timeRemainingMs, setTimeRemainingMs] = useState(25 * 60 * 1000);
const [completedInCycle, setCompletedInCycle] = useState(0);  // 0–4
const [showCelebration, setShowCelebration] = useState(false);
const [showSettings, setShowSettings] = useState(false);

// Timer accuracy refs
const timerStartRef = useRef<number>(0);      // Date.now() when started/resumed
const timerDurationRef = useRef<number>(0);   // Total ms for this phase
const timerElapsedRef = useRef<number>(0);    // Accumulated ms before pause

// Settings (loaded from DB, fallback to defaults)
const [settings, setSettings] = useState<PomodoroSettings>({
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
});
```

### Timer Engine (core logic in `index.tsx`)

1. **Start**: Record `timerStartRef = Date.now()`, set state to `running`, start `requestAnimationFrame` loop.
2. **Tick (rAF loop)**: Calculate `elapsed = timerElapsedRef + (Date.now() - timerStartRef)`. Derive `remaining = timerDurationRef - elapsed`. Update `timeRemainingMs`. If `remaining <= 0`, trigger completion.
3. **Pause**: Record `timerElapsedRef += Date.now() - timerStartRef`. Cancel rAF. Set state to `paused`.
4. **Resume**: Same as Start but keeps accumulated `timerElapsedRef`.
5. **Reset**: Cancel rAF, reset all refs, set time to phase duration, set state to `idle`.
6. **Complete**: Cancel rAF. If work phase: save session to DB, increment `completedInCycle`, show celebration, then auto-transition to break. If break phase: subdued transition, advance to next work phase (or reset cycle after long break).

> **Why `requestAnimationFrame` over `setInterval`**: Combined with `Date.now()` anchoring, rAF gives smooth visual updates when the tab is active and automatically throttles when backgrounded. The elapsed time calculation ensures accuracy regardless of frame rate.

### Phase Transition Logic

```
completePhase():
  if phase === 'work':
    newCount = completedInCycle + 1
    save PomodoroSession to DB
    show celebration animation
    if newCount >= 4:
      → longBreak, completedInCycle = 0  (reset after long break starts)
    else:
      → shortBreak, completedInCycle = newCount
  
  if phase === 'shortBreak' or 'longBreak':
    if phase === 'longBreak':
      completedInCycle = 0    (cycle resets after long break)
    → work
  
  set timeRemainingMs to new phase duration
  auto-start after celebration/transition delay
```

---

## Component Specifications

### TimerDisplay.tsx

**Purpose**: Renders the circular countdown ring and MM:SS time.

**Props**: `timeRemainingMs: number`, `totalDurationMs: number`, `phase: 'work' | 'shortBreak' | 'longBreak'`, `timerState: 'idle' | 'running' | 'paused'`

**Implementation**:
- SVG circle with `stroke-dashoffset` driven by `timeRemainingMs / totalDurationMs`
- Circle diameter responsive (clamp between 220px–320px via CSS)
- Colors shift by phase: warm reds for work, soft greens for break
- MM:SS text centered inside the SVG via `<text>` or absolutely positioned div
- Subtle pulse animation on the ring when running (CSS `@keyframes`)
- `stroke-dashoffset` transitions smoothly (CSS `transition: stroke-dashoffset 1s linear`)

### TimerControls.tsx

**Purpose**: Start, Pause, Resume, Reset buttons.

**Props**: `timerState`, `onStart`, `onPause`, `onResume`, `onReset`

**Implementation**:
- Use `Button` from `components/ui/button` with Italian-themed variants
- Icons from lucide-react: `Play`, `Pause`, `RotateCcw`
- Button visibility logic: idle → Start + Reset(disabled); running → Pause + Reset; paused → Resume + Reset
- Warm tomato-red primary button, muted brown secondary buttons

### CycleIndicator.tsx

**Purpose**: Shows 0–4 completed pomodoros in current cycle.

**Props**: `completedCount: number` (0–4), `phase: string`

**Implementation**:
- 4 tomato icons (SVG or emoji 🍅) in a row
- Filled/colored for completed, outline/muted for pending
- Subtle scale animation when a new one fills in
- Positioned below or integrated into the timer display

### CelebrationAnimation.tsx

**Purpose**: 2–3 second overlay animation on work session completion.

**Props**: `isActive: boolean`, `onComplete: () => void`

**Implementation**:
- Absolutely positioned overlay (pointer-events-none except during animation)
- **Radial burst**: CSS `@keyframes` scale + opacity on SVG circles radiating outward
- **Confetti particles**: 15–20 `<div>` elements with randomized CSS `@keyframes` for position, rotation, color (tomato reds, olive greens, gold)
- **Warm glow pulse**: Background radial-gradient opacity pulse
- Auto-dismiss after ~2.5s via `setTimeout` → call `onComplete`
- All animations CSS-only — no JS animation libraries
- For break completion: no celebration, just a gentle fade transition (handled in parent)

### SettingsPanel.tsx

**Purpose**: Configure work/break durations.

**Props**: `settings: PomodoroSettings`, `onSave: (settings: PomodoroSettings) => void`, `isOpen: boolean`, `onClose: () => void`, `timerState: string`

**Implementation**:
- Use `Dialog` from `components/ui/dialog` triggered by a gear icon button
- Three `Slider` components from `components/ui/slider` for work (1–60), short break (1–30), long break (1–30)
- Current values displayed as labels next to sliders
- Changes saved on slider release (debounced or on-close)
- Settings persisted to `ptDB.pomodoroSettings.put()`
- If timer is running, show note: "Changes apply to next session"

### SessionHistory.tsx

**Purpose**: Scrollable list of completed pomodoro sessions.

**Props**: `sessions: PomodoroSession[]` (from `useLiveQuery` in parent)

**Implementation**:
- Collapsible section below the timer (or side panel on desktop)
- Each entry shows: date/time (formatted via `date-fns`), duration, type badge
- Use `Card` styling for list items
- Empty state: "No sessions yet — start your first pomodoro! 🍅"
- Limited to last 50 sessions with "show more" if needed
- Grouped by date (today, yesterday, earlier)

### TodaySummary.tsx

**Purpose**: Shows count of pomodoros completed today.

**Props**: `count: number`

**Implementation**:
- Simple inline display: "3 🍅 today" or "No pomodoros yet today"
- Positioned in the header area
- Subtle count-up animation when a new pomodoro completes

---

## Visual Design: Italian Theme

### Color Palette (applied via Tailwind arbitrary values)

| Token | Hex | Usage |
|-------|-----|-------|
| Tomato Red (primary) | `#C0392B` | Active work state, primary buttons, progress ring |
| Tomato Red (light) | `#E74C3C` | Hover states, celebration accents |
| Olive Green (primary) | `#6B8E23` | Break state, completed indicators |
| Olive Green (dark) | `#556B2F` | Break ring, secondary accents |
| Parchment | `#FDF5E6` | Background (light mode) |
| Linen | `#FAF0E6` | Card backgrounds |
| Espresso Brown | `#3E2723` | Text, headings, borders |
| Espresso Brown (light) | `#5D4037` | Secondary text |
| Gold Accent | `#DAA520` | Celebration confetti, highlights |
| Cream White | `#FFFDD0` | Timer face background |

### Typography

- Headings: `font-serif` (Georgia/system serif fallback) — warm, slightly decorative
- Body/timer digits: `font-sans` (Inter — from site config) with `font-medium` weight
- Timer MM:SS: `text-5xl sm:text-6xl font-bold tabular-nums` for fixed-width digits

### Responsive Breakpoints

| Viewport | Layout |
|----------|--------|
| 320px–639px (mobile) | Single column, timer centered, session history collapsed by default |
| 640px–1023px (tablet) | Single column with wider timer, history visible |
| 1024px+ (desktop) | Timer centered with optional side panel for history |

---

## Implementation Phases

### Phase 1: Data Layer + Core Timer (P1 — Stories 1 & 2)

**Goal**: Working timer with full Pomodoro cycle, no persistence, no visual polish.

1. Add `PomodoroSession` and `PomodoroSettings` interfaces to `models/interfaces.ts`
2. Add `PomodoroTimerDB` class and `ptDB` singleton to `models/db.ts`
3. Implement `index.tsx` with full timer engine (start/pause/resume/reset, phase transitions, cycle tracking)
4. Create `TimerDisplay.tsx` — basic SVG ring + MM:SS display
5. Create `TimerControls.tsx` — Start/Pause/Resume/Reset buttons
6. Create `CycleIndicator.tsx` — 4 tomato dots showing cycle progress

**Validates**: User Stories 1 & 2 (all acceptance scenarios)

### Phase 2: Persistence + History (P2 — Stories 3 & 4)

**Goal**: Sessions saved to IndexedDB, history displayed, settings configurable.

7. Wire up `useLiveQuery` for settings loading on mount; apply to timer defaults
8. Save completed sessions to `ptDB.pomodoroSessions.add()` on timer completion
9. Create `SessionHistory.tsx` — display past sessions from DB
10. Create `TodaySummary.tsx` — today's pomodoro count
11. Create `SettingsPanel.tsx` — duration configuration with Slider components
12. Implement graceful degradation (try/catch around DB ops, `dbAvailable` flag)

**Validates**: User Stories 3 & 4 (all acceptance scenarios)

### Phase 3: Visual Polish + Celebration (P3 — Stories 5 & 6)

**Goal**: Italian theme applied, celebration animations, responsive perfection.

13. Apply Italian color palette across all components (Tailwind arbitrary values)
14. Refine `TimerDisplay.tsx` — tactile ring styling, phase-specific colors, warm aesthetics
15. Create `CelebrationAnimation.tsx` — CSS confetti, tomato burst, glow pulse
16. Add subtle transitions between phases (fade/slide for break transitions)
17. Responsive polish — test and fix all breakpoints 320px to 1440px
18. Typography and spacing refinement — serif headings, consistent Italian feel

**Validates**: User Stories 5 & 6 (all acceptance scenarios)

### Phase 4: Integration + Edge Cases

**Goal**: Registry updated, edge cases handled, production-ready.

19. Update `projects/registry.ts` — add all component files to `codeFiles` array
20. Handle edge cases: rapid start/pause, tab backgrounding accuracy, zero-duration prevention
21. Empty state polish, loading states, error boundaries for DB failures
22. Final responsive QA pass across all breakpoints

**Validates**: All edge cases from spec, SC-001 through SC-007

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Timer drift when backgrounded | Medium | High | `Date.now()` anchoring already in design; rAF naturally handles this |
| CSS celebration animation jank | Low | Medium | Keep particle count low (15–20 divs), use `transform`/`opacity` only (GPU-composited) |
| IndexedDB blocked in private browsing | Medium | Low | Graceful degradation: timer works without persistence, warning shown |
| SVG ring rendering inconsistencies across browsers | Low | Low | Use standard SVG `stroke-dasharray`/`stroke-dashoffset` — widely supported |
| Tailwind arbitrary value bloat | Low | Low | Define Italian palette as CSS custom properties scoped to `.pomodoro-timer` wrapper |

---

## Open Questions

None — the spec, constitution, and existing codebase patterns provide sufficient clarity for implementation. All technical decisions align with established project conventions.
