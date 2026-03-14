"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { PomodoroSettings } from "@/models/interfaces";

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  timerState: "idle" | "running" | "paused";
}

export default function SettingsPanel({
  settings,
  onSave,
  isOpen,
  onClose,
  timerState,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);

  // Sync local state when external settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  function handleSave() {
    // Clamp values to valid ranges
    const clamped: PomodoroSettings = {
      ...localSettings,
      workMinutes: Math.max(1, Math.min(60, localSettings.workMinutes)),
      shortBreakMinutes: Math.max(1, Math.min(30, localSettings.shortBreakMinutes)),
      longBreakMinutes: Math.max(1, Math.min(30, localSettings.longBreakMinutes)),
    };
    onSave(clamped);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: "var(--pt-linen)",
          borderColor: "rgba(62, 39, 35, 0.15)",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-serif text-xl"
            style={{ color: "var(--pt-espresso)" }}
          >
            Timer Settings
          </DialogTitle>
          <DialogDescription
            className="text-sm"
            style={{ color: "var(--pt-espresso-light)" }}
          >
            Customize your Pomodoro session durations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--pt-espresso)" }}
              >
                Work Duration
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "var(--pt-tomato-red)" }}
              >
                {localSettings.workMinutes} min
              </span>
            </div>
            <Slider
              value={[localSettings.workMinutes]}
              onValueChange={([v]) =>
                setLocalSettings((s) => ({ ...s, workMinutes: v }))
              }
              min={1}
              max={60}
              step={1}
              className="[&_[role=slider]]:bg-[var(--pt-tomato-red)]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "var(--pt-espresso)" }}
            >
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Short Break Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--pt-espresso)" }}
              >
                Short Break
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "var(--pt-olive-green)" }}
              >
                {localSettings.shortBreakMinutes} min
              </span>
            </div>
            <Slider
              value={[localSettings.shortBreakMinutes]}
              onValueChange={([v]) =>
                setLocalSettings((s) => ({ ...s, shortBreakMinutes: v }))
              }
              min={1}
              max={30}
              step={1}
              className="[&_[role=slider]]:bg-[var(--pt-olive-green)]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "var(--pt-espresso)" }}
            >
              <span>1 min</span>
              <span>30 min</span>
            </div>
          </div>

          {/* Long Break Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--pt-espresso)" }}
              >
                Long Break
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "var(--pt-olive-green-dark)" }}
              >
                {localSettings.longBreakMinutes} min
              </span>
            </div>
            <Slider
              value={[localSettings.longBreakMinutes]}
              onValueChange={([v]) =>
                setLocalSettings((s) => ({ ...s, longBreakMinutes: v }))
              }
              min={1}
              max={30}
              step={1}
              className="[&_[role=slider]]:bg-[var(--pt-olive-green-dark)]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "var(--pt-espresso)" }}
            >
              <span>1 min</span>
              <span>30 min</span>
            </div>
          </div>

          {timerState !== "idle" && (
            <p
              className="text-xs italic text-center opacity-60"
              style={{ color: "var(--pt-espresso)" }}
            >
              Changes will apply to the next session.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              backgroundColor: "var(--pt-tomato-red)",
              color: "var(--pt-cream)",
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
