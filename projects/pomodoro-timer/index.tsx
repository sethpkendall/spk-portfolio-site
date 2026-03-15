"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ptDB } from "@/models/db";
import type { PomodoroSession, PomodoroSettings } from "@/models/interfaces";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startOfToday } from "date-fns";

import TimerDisplay from "./components/TimerDisplay";
import TimerControls from "./components/TimerControls";
import CycleIndicator from "./components/CycleIndicator";
import SessionHistory from "./components/SessionHistory";
import SettingsPanel from "./components/SettingsPanel";
import CelebrationAnimation from "./components/CelebrationAnimation";
import TodaySummary from "./components/TodaySummary";

// ── Types ──────────────────────────────────────────────────────

type TimerState = "idle" | "running" | "paused";
type Phase = "work" | "shortBreak" | "longBreak";

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};

function phaseDurationMs(phase: Phase, settings: PomodoroSettings): number {
  switch (phase) {
    case "work":
      return settings.workMinutes * 60 * 1000;
    case "shortBreak":
      return settings.shortBreakMinutes * 60 * 1000;
    case "longBreak":
      return settings.longBreakMinutes * 60 * 1000;
  }
}

// ── Main Component ─────────────────────────────────────────────

export default function PomodoroTimer() {
  // ── DB availability ──────────────────────────────────────────
  const [dbAvailable, setDbAvailable] = useState(true);

  // ── Settings (loaded from DB, fallback to defaults) ──────────
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);

  // Load settings from DB on mount
  const dbSettings = useLiveQuery(async () => {
    try {
      return await ptDB.pomodoroSettings.get(1);
    } catch {
      setDbAvailable(false);
      return undefined;
    }
  }, []);

  // Apply DB settings when loaded
  useEffect(() => {
    if (dbSettings) {
      setSettings({
        workMinutes: dbSettings.workMinutes ?? 25,
        shortBreakMinutes: dbSettings.shortBreakMinutes ?? 5,
        longBreakMinutes: dbSettings.longBreakMinutes ?? 15,
      });
    }
  }, [dbSettings]);

  // ── Core timer state ─────────────────────────────────────────
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [phase, setPhase] = useState<Phase>("work");
  const [timeRemainingMs, setTimeRemainingMs] = useState(
    () => DEFAULT_SETTINGS.workMinutes * 60 * 1000,
  );
  const [completedInCycle, setCompletedInCycle] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [phaseTransition, setPhaseTransition] = useState(false);

  // ── Timer accuracy refs ──────────────────────────────────────
  const timerStartRef = useRef<number>(0);
  const timerDurationRef = useRef<number>(
    DEFAULT_SETTINGS.workMinutes * 60 * 1000,
  );
  const timerElapsedRef = useRef<number>(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep settings in sync with timer duration when idle
  useEffect(() => {
    if (timerState === "idle") {
      const dur = phaseDurationMs(phase, settings);
      setTimeRemainingMs(dur);
      timerDurationRef.current = dur;
    }
  }, [settings, phase, timerState]);

  // ── Session history from DB ──────────────────────────────────
  const sessions = useLiveQuery(
    async () => {
      try {
        return await ptDB.pomodoroSessions
          .orderBy("completedAt")
          .reverse()
          .limit(50)
          .toArray();
      } catch {
        return [];
      }
    },
    [],
    [],
  );

  const todayCount = useLiveQuery(
    async () => {
      try {
        const todayStart = startOfToday();
        return await ptDB.pomodoroSessions
          .where("completedAt")
          .above(todayStart)
          .filter((s) => s.type === "work")
          .count();
      } catch {
        return 0;
      }
    },
    [],
    0,
  );

  // ── Use refs to avoid stale closures in completePhase ────────
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const completedRef = useRef(completedInCycle);
  completedRef.current = completedInCycle;
  const dbAvailableRef = useRef(dbAvailable);
  dbAvailableRef.current = dbAvailable;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // ── Interval tick loop ───────────────────────────────────────
  const completePhaseRef = useRef<() => void>(() => {});

  const clearTickInterval = useCallback(() => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const startTickInterval = useCallback(() => {
    clearTickInterval();
    intervalIdRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = timerElapsedRef.current + (now - timerStartRef.current);
      const remaining = timerDurationRef.current - elapsed;

      if (remaining <= 0) {
        setTimeRemainingMs(0);
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        completePhaseRef.current();
        return;
      }

      setTimeRemainingMs(remaining);
    }, 100);
  }, [clearTickInterval]);

  // ── Phase transition helper ──────────────────────────────────
  const transitionToPhase = useCallback(
    (newPhase: Phase) => {
      const dur = phaseDurationMs(newPhase, settingsRef.current);
      setPhase(newPhase);
      setTimeRemainingMs(dur);
      timerDurationRef.current = dur;
      timerElapsedRef.current = 0;
      timerStartRef.current = Date.now();
      setTimerState("running");
      startTickInterval();
    },
    [startTickInterval],
  );

  // ── Phase completion logic ───────────────────────────────────
  const completePhase = useCallback(() => {
    clearTickInterval();
    setTimerState("idle");

    const currentPhase = phaseRef.current;

    if (currentPhase === "work") {
      // Persist session to DB
      const durationMinutes = settingsRef.current.workMinutes;
      if (dbAvailableRef.current) {
        ptDB.pomodoroSessions
          .add({
            completedAt: new Date(),
            durationMinutes,
            type: "work",
          })
          .catch(() => {
            // DB write failed — timer continues
          });
      }

      const newCount = completedRef.current + 1;
      setCompletedInCycle(newCount);

      // Show celebration
      setShowCelebration(true);

      // Determine next phase after celebration
      if (newCount >= 4) {
        setTimeout(() => {
          transitionToPhase("longBreak");
        }, 2600);
      } else {
        setTimeout(() => {
          transitionToPhase("shortBreak");
        }, 2600);
      }
    } else {
      // Break completed — subtle transition to work
      setPhaseTransition(true);

      if (currentPhase === "longBreak") {
        setCompletedInCycle(0);
      }

      setTimeout(() => {
        transitionToPhase("work");
        setPhaseTransition(false);
      }, 800);
    }
  }, [transitionToPhase, clearTickInterval]);

  // Keep completePhaseRef in sync
  completePhaseRef.current = completePhase;

  // ── Timer controls ───────────────────────────────────────────

  const handleStart = useCallback(() => {
    const dur = phaseDurationMs(phase, settings);
    timerDurationRef.current = dur;
    timerElapsedRef.current = 0;
    timerStartRef.current = Date.now();
    setTimeRemainingMs(dur);
    setTimerState("running");
    startTickInterval();
  }, [phase, settings, startTickInterval]);

  const handlePause = useCallback(() => {
    timerElapsedRef.current += Date.now() - timerStartRef.current;
    clearTickInterval();
    setTimerState("paused");
  }, [clearTickInterval]);

  const handleResume = useCallback(() => {
    timerStartRef.current = Date.now();
    setTimerState("running");
    startTickInterval();
  }, [startTickInterval]);

  const handleReset = useCallback(() => {
    clearTickInterval();
    timerElapsedRef.current = 0;
    timerStartRef.current = 0;
    const dur = phaseDurationMs(phase, settings);
    timerDurationRef.current = dur;
    setTimeRemainingMs(dur);
    setTimerState("idle");
  }, [phase, settings, clearTickInterval]);

  // ── Celebration complete callback ────────────────────────────
  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  // ── Settings save handler ────────────────────────────────────
  const handleSettingsSave = useCallback(
    async (newSettings: PomodoroSettings) => {
      setSettings(newSettings);
      if (dbAvailable) {
        try {
          await ptDB.pomodoroSettings.put({ id: 1, ...newSettings });
        } catch {
          // DB write failed — settings applied in memory only
        }
      }
    },
    [dbAvailable],
  );

  // ── Cleanup interval on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // ── Render ───────────────────────────────────────────────────
  const totalDurationMs = phaseDurationMs(phase, settings);

  return (
    <div
      className="pomodoro-timer relative flex flex-col items-center justify-center px-4 py-8 sm:py-12 min-h-[500px]"
      style={{
        // Italian color custom properties
        // @ts-expect-error custom CSS properties
        "--pt-tomato-red": "#C0392B",
        "--pt-tomato-red-light": "#E74C3C",
        "--pt-olive-green": "#6B8E23",
        "--pt-olive-green-dark": "#556B2F",
        "--pt-parchment": "#FDF5E6",
        "--pt-linen": "#FAF0E6",
        "--pt-espresso": "#3E2723",
        "--pt-espresso-light": "#5D4037",
        "--pt-gold": "#DAA520",
        "--pt-cream": "#FFFDD0",
        backgroundColor: "var(--pt-parchment)",
        borderRadius: "1rem",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <div>
          <h2
            className="text-2xl font-serif font-bold"
            style={{ color: "var(--pt-espresso)" }}
          >
            Pomodoro
          </h2>
          <TodaySummary count={todayCount ?? 0} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="rounded-full"
          style={{ color: "var(--pt-espresso-light)" }}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* DB unavailable warning */}
      {!dbAvailable && (
        <div
          className="text-xs text-center mb-4 px-3 py-1.5 rounded-full opacity-60"
          style={{
            backgroundColor: "rgba(62, 39, 35, 0.08)",
            color: "var(--pt-espresso-light)",
          }}
        >
          Session history unavailable in this browser mode
        </div>
      )}

      {/* Timer display with phase transition animation */}
      <div
        className={`transition-opacity duration-500 ${phaseTransition ? "opacity-40" : "opacity-100"}`}
      >
        <TimerDisplay
          timeRemainingMs={timeRemainingMs}
          totalDurationMs={totalDurationMs}
          phase={phase}
          timerState={timerState}
        />
      </div>

      {/* Cycle indicator */}
      <CycleIndicator completedCount={completedInCycle} phase={phase} />

      {/* Timer controls */}
      <TimerControls
        timerState={timerState}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
      />

      {/* Session history */}
      <SessionHistory sessions={sessions ?? []} />

      {/* Celebration animation overlay */}
      <CelebrationAnimation
        isActive={showCelebration}
        onComplete={handleCelebrationComplete}
      />

      {/* Settings dialog */}
      <SettingsPanel
        settings={settings}
        onSave={handleSettingsSave}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        timerState={timerState}
      />

      {/* CSS animations */}
      <style jsx global>{`
        /* Ring pulse when running */
        .pt-ring-pulse {
          animation: pt-subtle-pulse 2s ease-in-out infinite;
        }
        @keyframes pt-subtle-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        /* Paused blink */
        .pt-blink {
          animation: pt-blink 1.5s ease-in-out infinite;
        }
        @keyframes pt-blink {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0;
          }
        }

        /* Celebration: glow pulse */
        .pt-glow-pulse {
          background: radial-gradient(
            circle at center,
            rgba(192, 57, 43, 0.25) 0%,
            transparent 70%
          );
          animation: pt-glow 2.5s ease-out forwards;
        }
        @keyframes pt-glow {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        /* Celebration: burst rings */
        .pt-burst-ring {
          animation: pt-burst 1.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes pt-burst {
          0% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        /* Celebration: confetti particles */
        .pt-confetti-particle {
          animation: pt-confetti 2s ease-out forwards;
          opacity: 0;
        }
        @keyframes pt-confetti {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-180px) translateX(var(--x-drift, 20px))
              rotate(var(--rotation, 360deg)) scale(0.3);
          }
        }

        /* Celebration: tomato burst */
        .pt-tomato-burst {
          animation: pt-tomato-pop 2.5s ease-out forwards;
        }
        @keyframes pt-tomato-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          20% {
            transform: scale(1.5);
            opacity: 1;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
