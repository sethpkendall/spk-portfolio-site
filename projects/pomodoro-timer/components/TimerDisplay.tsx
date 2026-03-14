"use client";

import React from "react";

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
          className={`transition-[stroke-dashoffset] duration-1000 linear ${
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
        <span
          className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tight"
          style={{ color: textColor }}
        >
          {timeString}
        </span>
        <span
          className="text-sm sm:text-base font-serif mt-1 opacity-70"
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
