"use client";

import React from "react";
import SplitFlapDigit from "./SplitFlapDigit";

interface TimerDisplayProps {
  timeRemainingMs: number;
  totalDurationMs: number;
  phase: "work" | "shortBreak" | "longBreak";
  timerState: "idle" | "running" | "paused";
}

export default function TimerDisplay({
  timeRemainingMs,
  totalDurationMs,
  phase,
  timerState,
}: TimerDisplayProps) {
  const totalSeconds = Math.max(0, Math.ceil(timeRemainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress = totalDurationMs > 0 ? timeRemainingMs / totalDurationMs : 1;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // SVG circle parameters
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clampedProgress);

  // Phase-based colors
  const ringColor =
    phase === "work"
      ? "var(--pt-tomato-red)"
      : phase === "shortBreak"
        ? "var(--pt-olive-green)"
        : "var(--pt-olive-green-dark)";

  const trackColor =
    phase === "work"
      ? "rgba(192, 57, 43, 0.15)"
      : "rgba(107, 142, 35, 0.15)";

  const textColor = "var(--pt-espresso)";

  const phaseLabel =
    phase === "work"
      ? "Focus Time"
      : phase === "shortBreak"
        ? "Short Break"
        : "Long Break";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] drop-shadow-md"
      >
        {/* Background circle - cream face */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2 - 2}
          fill="var(--pt-cream)"
          opacity={0.6}
        />

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={`transition-[stroke-dashoffset] duration-200 linear ${
            timerState === "running" ? "pt-ring-pulse" : ""
          }`}
          style={{
            filter:
              timerState === "running"
                ? `drop-shadow(0 0 6px ${ringColor})`
                : "none",
          }}
        />

        {/* Outer decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 3}
          fill="none"
          stroke="var(--pt-espresso)"
          strokeWidth={1.5}
          opacity={0.15}
        />
      </svg>

      {/* Timer text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Split-flap digit display */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <SplitFlapDigit digit={String(minutes).padStart(2, "0")[0]} />
          <SplitFlapDigit digit={String(minutes).padStart(2, "0")[1]} />
          {/* Static colon separator */}
          <div
            className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 w-4 sm:w-5 lg:w-6 h-10 sm:h-14 lg:h-16 rounded-md"
            style={{
              backgroundColor: "#2C2C2C",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#F0EDE6] opacity-90" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#F0EDE6] opacity-90" />
          </div>
          <SplitFlapDigit digit={String(seconds).padStart(2, "0")[0]} />
          <SplitFlapDigit digit={String(seconds).padStart(2, "0")[1]} />
        </div>
        <span
          className="text-sm sm:text-base font-serif mt-2 opacity-70"
          style={{ color: textColor }}
        >
          {phaseLabel}
        </span>
        {timerState === "paused" && (
          <span
            className="text-xs mt-1 uppercase tracking-widest opacity-50 pt-blink"
            style={{ color: textColor }}
          >
            Paused
          </span>
        )}
      </div>
    </div>
  );
}
