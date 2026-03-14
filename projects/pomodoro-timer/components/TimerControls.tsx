"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerControlsProps {
  timerState: "idle" | "running" | "paused";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export default function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {timerState === "idle" && (
        <Button
          onClick={onStart}
          className="h-12 px-8 text-base font-semibold rounded-full shadow-md"
          style={{
            backgroundColor: "var(--pt-tomato-red)",
            color: "var(--pt-cream)",
          }}
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Start
        </Button>
      )}

      {timerState === "running" && (
        <Button
          onClick={onPause}
          className="h-12 px-8 text-base font-semibold rounded-full shadow-md"
          style={{
            backgroundColor: "var(--pt-espresso-light)",
            color: "var(--pt-cream)",
          }}
        >
          <Pause className="w-5 h-5 mr-2 fill-current" />
          Pause
        </Button>
      )}

      {timerState === "paused" && (
        <Button
          onClick={onResume}
          className="h-12 px-8 text-base font-semibold rounded-full shadow-md"
          style={{
            backgroundColor: "var(--pt-tomato-red)",
            color: "var(--pt-cream)",
          }}
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Resume
        </Button>
      )}

      <Button
        onClick={onReset}
        variant="outline"
        size="icon"
        disabled={timerState === "idle"}
        className="h-12 w-12 rounded-full border-2"
        style={{
          borderColor: "var(--pt-espresso)",
          color: "var(--pt-espresso)",
          opacity: timerState === "idle" ? 0.3 : 1,
        }}
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>
  );
}
