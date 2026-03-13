# Tasks: Pomodoro Timer

**Input**: Design documents from `.specify/memory/001-pomodoro-timer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: No test framework in project — manual acceptance testing per spec scenarios.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Data layer and project scaffolding that all user stories depend on

- [ ] T001 [P] [US1] Add `PomodoroSession` and `PomodoroSettings` interfaces to `models/interfaces.ts`
- [ ] T002 [P] [US1] Add `PomodoroTimerDB` class and `ptDB` singleton to `models/db.ts` (schema: `pomodoroSessions: '++id, completedAt, type'`, `pomodoroSettings: '++id'`)
- [ ] T003 Create component directory structure under `projects/pomodoro-timer/components/` (empty files for TimerDisplay, TimerControls, CycleIndicator, SessionHistory, SettingsPanel, CelebrationAnimation, TodaySummary)

**Checkpoint**: Data layer ready — component implementation can begin

---

## Phase 2: User Stories 1 & 2 — Core Timer + Full Pomodoro Cycle (Priority: P1) 🎯 MVP

**Goal**: A fully working Pomodoro timer with start/pause/resume/reset, countdown display, phase transitions (work → short break → long break), and cycle tracking (0–4 pomodoros). No persistence, no visual polish yet.

**Independent Test**: Open the app, press Start, observe countdown. Pause/resume/reset. Complete 4 work sessions and verify breaks alternate correctly (short ×3, then long). Cycle indicator tracks progress.

### Implementation for User Stories 1 & 2

- [ ] T004 [US1] Implement core timer engine in `projects/pomodoro-timer/index.tsx` — state declarations (`timerState`, `phase`, `timeRemainingMs`, `completedInCycle`, `showCelebration`, `showSettings`), `Date.now()` refs (`timerStartRef`, `timerDurationRef`, `timerElapsedRef`), settings state with defaults (25/5/15)
- [ ] T005 [US1] Implement timer control callbacks in `projects/pomodoro-timer/index.tsx` — `handleStart` (record start time, launch rAF), `handlePause` (accumulate elapsed, cancel rAF), `handleResume` (re-anchor start time, relaunch rAF), `handleReset` (cancel rAF, reset refs, restore phase duration, set idle)
- [ ] T006 [US1] Implement rAF tick loop in `projects/pomodoro-timer/index.tsx` — calculate `elapsed = timerElapsedRef + (Date.now() - timerStartRef)`, derive `remaining = timerDurationRef - elapsed`, update `timeRemainingMs`, trigger completion when `remaining <= 0`
- [ ] T007 [P] [US1] Create `projects/pomodoro-timer/components/TimerDisplay.tsx` — SVG circle with `stroke-dashoffset` driven by `timeRemainingMs / totalDurationMs`, MM:SS text centered inside, responsive diameter (clamp 220px–320px), phase-based color props
- [ ] T008 [P] [US1] Create `projects/pomodoro-timer/components/TimerControls.tsx` — Start/Pause/Resume/Reset buttons using `components/ui/button`, icons from lucide-react (`Play`, `Pause`, `RotateCcw`), visibility logic per `timerState`
- [ ] T009 [P] [US2] Create `projects/pomodoro-timer/components/CycleIndicator.tsx` — 4 tomato icons in a row, filled/colored for completed, outline/muted for pending, accepts `completedCount` (0–4) and `phase` props
- [ ] T010 [US2] Implement `completePhase()` logic in `projects/pomodoro-timer/index.tsx` — if work: increment `completedInCycle`, if count ≥ 4 → longBreak (reset cycle), else → shortBreak; if break: → work (reset cycle counter after longBreak); set `timeRemainingMs` to new phase duration; auto-start after transition delay
- [ ] T011 [US1] Wire all components into `projects/pomodoro-timer/index.tsx` layout — header, TimerDisplay, CycleIndicator, TimerControls; verify full render and interaction flow

**Checkpoint**: User Stories 1 & 2 fully functional — timer runs, pauses, resets, transitions through work/break phases, and completes full 4-pomodoro cycles. Manually verify all US1 and US2 acceptance scenarios.

---

## Phase 3: User Story 3 — Session History & Persistence (Priority: P2)

**Goal**: Completed pomodoro sessions are saved to IndexedDB via Dexie.js. Users see a session history list and a daily summary count. History survives page refresh. Timer degrades gracefully if IndexedDB is unavailable.

**Independent Test**: Complete 2–3 pomodoros, refresh the page, verify session history is intact with correct timestamps and today's count is accurate.

### Implementation for User Story 3

- [ ] T012 [US3] Wire `useLiveQuery` for settings loading in `projects/pomodoro-timer/index.tsx` — load `ptDB.pomodoroSettings.get(1)` on mount, apply to timer defaults; wrap in try/catch and set `dbAvailable` state flag
- [ ] T013 [US3] Add session persistence to `completePhase()` in `projects/pomodoro-timer/index.tsx` — call `ptDB.pomodoroSessions.add({ completedAt: new Date(), durationMinutes, type })` on work session completion; wrap in try/catch
- [ ] T014 [US3] Add `useLiveQuery` for session history and today's count in `projects/pomodoro-timer/index.tsx` — sessions ordered by `completedAt` desc (limit 50), today count filtered by `startOfToday()`
- [ ] T015 [P] [US3] Create `projects/pomodoro-timer/components/SessionHistory.tsx` — scrollable list of completed sessions, each entry shows date/time (via `date-fns` format), duration, type badge; grouped by date (today, yesterday, earlier); empty state: "No sessions yet — start your first pomodoro! 🍅"; collapsible section
- [ ] T016 [P] [US3] Create `projects/pomodoro-timer/components/TodaySummary.tsx` — inline display "N 🍅 today" or "No pomodoros yet today", accepts `count` prop, positioned in header area
- [ ] T017 [US3] Implement graceful degradation in `projects/pomodoro-timer/index.tsx` — `dbAvailable` flag checked before all DB writes, subtle muted warning when DB unavailable: "Session history unavailable in this browser mode"
- [ ] T018 [US3] Wire SessionHistory and TodaySummary into `projects/pomodoro-timer/index.tsx` layout

**Checkpoint**: User Story 3 fully functional — sessions persist across refresh, history displays correctly, today summary is accurate, and timer works without DB. Manually verify all US3 acceptance scenarios.

---

## Phase 4: User Story 4 — Configurable Durations (Priority: P2)

**Goal**: Users can configure work/break durations via a settings panel. Settings persist to IndexedDB and apply to subsequent sessions.

**Independent Test**: Open settings, change work duration to 30 min, close settings, verify timer shows 30:00. Refresh and confirm the setting persists. Verify changes don't affect a running timer.

### Implementation for User Story 4

- [ ] T019 [US4] Create `projects/pomodoro-timer/components/SettingsPanel.tsx` — `Dialog` from `components/ui/dialog` triggered by gear icon button; three `Slider` components from `components/ui/slider` for work (1–60), short break (1–30), long break (1–30); current values as labels; "Changes apply to next session" note when timer is running; save via `onSave` callback
- [ ] T020 [US4] Wire settings persistence in `projects/pomodoro-timer/index.tsx` — `onSave` handler calls `ptDB.pomodoroSettings.put({ id: 1, ...settings })`, updates local settings state; when timer is idle, recalculate `timeRemainingMs` for current phase
- [ ] T021 [US4] Add SettingsPanel to `projects/pomodoro-timer/index.tsx` layout — gear icon button in header, connect `showSettings` state, pass `timerState` for conditional messaging

**Checkpoint**: User Story 4 fully functional — settings panel opens, durations are configurable with min/max clamping, persist across refresh, and don't disrupt a running timer. Manually verify all US4 acceptance scenarios.

---

## Phase 5: User Story 5 — Celebration Animations (Priority: P3)

**Goal**: A 2–3 second CSS/SVG celebration animation plays when a work session completes. Break completions get a subdued transition. All animations are CSS-only, smooth at 60fps.

**Independent Test**: Complete a pomodoro and observe the celebration (confetti, tomato burst, glow pulse) plays for ~2–3 seconds, then the break timer is visible. Complete a break and observe a gentle transition with no full celebration.

### Implementation for User Story 5

- [ ] T022 [US5] Create `projects/pomodoro-timer/components/CelebrationAnimation.tsx` — absolutely positioned overlay (`pointer-events-none`); radial burst (CSS `@keyframes` scale + opacity on SVG circles); confetti particles (15–20 divs with randomized `@keyframes` for position, rotation, color: tomato reds, olive greens, gold); warm glow pulse (radial-gradient opacity); auto-dismiss after ~2.5s via `setTimeout` → `onComplete` callback; responsive (no overflow/clipping)
- [ ] T023 [US5] Wire CelebrationAnimation into `projects/pomodoro-timer/index.tsx` — show on work session completion (`showCelebration` state), hide on `onComplete` callback, then transition to break; add subtle CSS fade/slide transition for break → work transitions
- [ ] T024 [US5] Add subdued break-completion transition in `projects/pomodoro-timer/index.tsx` — gentle fade or slide when break ends (no celebration), distinct from work completion

**Checkpoint**: User Story 5 fully functional — celebration plays on work completion, subdued transition on break completion, no jank, renders correctly at all viewport widths. Manually verify all US5 acceptance scenarios.

---

## Phase 6: User Story 6 — Italian-Inspired Visual Design (Priority: P3)

**Goal**: The full Italian design language applied — tomato reds, olive greens, parchment backgrounds, espresso browns, serif headings, tactile timer ring, and responsive polish from 320px to 1440px+.

**Independent Test**: Open on mobile and desktop, verify Italian theme is consistent, colors match spec palette, layout is polished at all breakpoints with no horizontal scrolling.

### Implementation for User Story 6

- [ ] T025 [P] [US6] Apply Italian color palette across all components — define CSS custom properties scoped to `.pomodoro-timer` wrapper (`--tomato-red: #C0392B`, `--tomato-red-light: #E74C3C`, `--olive-green: #6B8E23`, `--olive-green-dark: #556B2F`, `--parchment: #FDF5E6`, `--linen: #FAF0E6`, `--espresso: #3E2723`, `--espresso-light: #5D4037`, `--gold: #DAA520`, `--cream: #FFFDD0`); apply via Tailwind arbitrary values
- [ ] T026 [P] [US6] Refine `projects/pomodoro-timer/components/TimerDisplay.tsx` — tactile ring styling (subtle shadow, slightly textured stroke), phase-specific colors (warm reds for work, soft greens for break), subtle pulse animation when running (`@keyframes`), smooth `stroke-dashoffset` transition
- [ ] T027 [US6] Typography and spacing refinement across all components — `font-serif` for headings (Georgia/system serif fallback), `tabular-nums` for timer digits, `text-5xl sm:text-6xl font-bold` for MM:SS, consistent padding/margins per Italian warm aesthetic
- [ ] T028 [US6] Responsive polish — verify and fix layout at 320px, 640px, 1024px, 1440px breakpoints; single column on mobile (history collapsed), wider timer on tablet, optional side panel on desktop; no horizontal scroll anywhere

**Checkpoint**: User Story 6 fully functional — Italian theme is visually cohesive, colors match spec, responsive at all breakpoints. Manually verify all US6 acceptance scenarios.

---

## Phase 7: Integration & Edge Cases

**Purpose**: Registry update, edge case handling, and final production-readiness pass

- [ ] T029 [P] Update `projects/registry.ts` — add all new component files to `codeFiles` array for pomodoro-timer entry
- [ ] T030 Handle edge cases in `projects/pomodoro-timer/index.tsx` — rapid start/pause (debounce or guard against negative values), tab backgrounding accuracy (verify `Date.now()` anchoring), zero-duration prevention (enforce `≥ 1` minute in settings)
- [ ] T031 Empty state and error polish — loading states while DB initializes, error boundaries for DB failures, consistent fallback UI
- [ ] T032 Final responsive QA pass across all breakpoints (320px, 375px, 640px, 768px, 1024px, 1440px) — verify no regressions from earlier phases

**Checkpoint**: All edge cases handled, registry updated, production-ready. Manually verify SC-001 through SC-007 from spec.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Core Timer (Phase 2)**: Depends on Phase 1 (data interfaces and DB class)
- **Persistence (Phase 3)**: Depends on Phase 2 (timer engine must exist to add persistence)
- **Settings (Phase 4)**: Depends on Phase 3 (settings loading via `useLiveQuery` established in Phase 3)
- **Celebration (Phase 5)**: Depends on Phase 2 (needs working timer completion flow)
- **Visual Design (Phase 6)**: Depends on Phase 2 (needs components to exist); can run in parallel with Phases 3–5
- **Integration (Phase 7)**: Depends on all prior phases

### Within Each Phase

- Tasks marked [P] within a phase can run in parallel
- Non-[P] tasks must be completed sequentially in listed order
- Component creation tasks ([P]) can run in parallel with each other but depend on the parent index.tsx scaffolding

### Parallel Opportunities

```
Phase 1: T001 ──┐
                 ├──► Phase 2 starts
         T002 ──┘

Phase 2: T004 → T005 → T006 ──┐
                                ├──► T010 → T011
         T007 ─────────────────┤
         T008 ─────────────────┤
         T009 ─────────────────┘

Phase 3: T012 → T013 → T014 ──┐
                                ├──► T017 → T018
         T015 ─────────────────┤
         T016 ─────────────────┘

Phase 5 can start after Phase 2 (parallel with Phases 3–4)
Phase 6 can start after Phase 2 (parallel with Phases 3–5)
Phase 7 waits for all prior phases
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included — manual acceptance testing per spec scenarios
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US1 & US2 are combined in Phase 2 because the timer engine in `index.tsx` naturally implements both — they share state and the rAF loop
