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

const TEST_MODE_SETTINGS = {
  workMinutes: 0.05,
  shortBreakMinutes: 0.033,
  longBreakMinutes: 0.05,
};

function isTestMode(s: PomodoroSettings): boolean {
  return (
    s.workMinutes < 1 ||
    s.shortBreakMinutes < 1 ||
    s.longBreakMinutes < 1
  );
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

  const testModeActive = isTestMode(localSettings);

  function handleTestMode() {
    setLocalSettings((s) => ({ ...s, ...TEST_MODE_SETTINGS }));
  }

  function handleExitTestMode() {
    setLocalSettings((s) => ({
      ...s,
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
    }));
  }

  function handleSave() {
    // Clamp values — allow sub-1 values in test mode
    const minVal = testModeActive ? 0.01 : 1;
    const clamped: PomodoroSettings = {
      ...localSettings,
      workMinutes: Math.max(minVal, Math.min(60, localSettings.workMinutes)),
      shortBreakMinutes: Math.max(minVal, Math.min(30, localSettings.shortBreakMinutes)),
      longBreakMinutes: Math.max(minVal, Math.min(30, localSettings.longBreakMinutes)),
    };
    onSave(clamped);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: "#FAF0E6",
          borderColor: "rgba(62, 39, 35, 0.15)",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-serif text-xl"
            style={{ color: "#3E2723" }}
          >
            Timer Settings
          </DialogTitle>
          <DialogDescription
            className="text-sm"
            style={{ color: "#5D4037" }}
          >
            Customize your Pomodoro session durations.
          </DialogDescription>
        </DialogHeader>

        {/* Test Mode */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={testModeActive ? handleExitTestMode : handleTestMode}
            className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: testModeActive ? "#C0392B" : "#5D4037",
              backgroundColor: testModeActive ? "rgba(192, 57, 43, 0.1)" : "transparent",
              color: testModeActive ? "#C0392B" : "#5D4037",
            }}
          >
            {testModeActive ? "Exit Test Mode" : "\uD83E\uDDEA Test Mode"}
          </button>
          {testModeActive && (
            <span
              className="text-xs font-semibold px-2 py-1 rounded-md"
              style={{
                backgroundColor: "rgba(192, 57, 43, 0.12)",
                color: "#C0392B",
              }}
            >
              \u26A1 Test: 3s / 2s / 3s
            </span>
          )}
        </div>

        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-sm font-medium"
                style={{ color: "#3E2723" }}
              >
                Work Duration
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "#C0392B" }}
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
              className="[&_[role=slider]]:bg-[#C0392B]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "#3E2723" }}
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
                style={{ color: "#3E2723" }}
              >
                Short Break
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "#6B8E23" }}
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
              className="[&_[role=slider]]:bg-[#6B8E23]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "#3E2723" }}
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
                style={{ color: "#3E2723" }}
              >
                Long Break
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "#556B2F" }}
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
              className="[&_[role=slider]]:bg-[#556B2F]"
            />
            <div
              className="flex justify-between text-xs opacity-40"
              style={{ color: "#3E2723" }}
            >
              <span>1 min</span>
              <span>30 min</span>
            </div>
          </div>

          {timerState !== "idle" && (
            <p
              className="text-xs italic text-center opacity-60"
              style={{ color: "#3E2723" }}
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
              backgroundColor: "#C0392B",
              color: "#FFFDD0",
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
