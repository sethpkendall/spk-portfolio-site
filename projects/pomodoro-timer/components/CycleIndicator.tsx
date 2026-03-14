"use client";

import React from "react";

interface CycleIndicatorProps {
  completedCount: number; // 0–4
  phase: "work" | "shortBreak" | "longBreak";
}

function TomatoIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      className={`transition-all duration-300 ${filled ? "scale-110" : "scale-100"}`}
    >
      {/* Stem */}
      <path
        d="M12 2 C12 2 10 4 12 5 C14 4 12 2 12 2Z"
        fill={filled ? "var(--pt-olive-green)" : "var(--pt-espresso)"}
        opacity={filled ? 1 : 0.25}
      />
      {/* Leaf */}
      <path
        d="M12 5 C9 3.5 7 5 9 6.5 C10 7 11 6 12 5Z"
        fill={filled ? "var(--pt-olive-green)" : "var(--pt-espresso)"}
        opacity={filled ? 0.8 : 0.2}
      />
      {/* Tomato body */}
      <ellipse
        cx="12"
        cy="13.5"
        rx="7"
        ry="7.5"
        fill={filled ? "var(--pt-tomato-red)" : "none"}
        stroke={filled ? "var(--pt-tomato-red)" : "var(--pt-espresso)"}
        strokeWidth={filled ? 0 : 1.5}
        opacity={filled ? 1 : 0.25}
      />
      {/* Highlight */}
      {filled && (
        <ellipse
          cx="9.5"
          cy="11"
          rx="2"
          ry="2.5"
          fill="rgba(255,255,255,0.25)"
        />
      )}
    </svg>
  );
}

export default function CycleIndicator({
  completedCount,
  phase,
}: CycleIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      {[0, 1, 2, 3].map((i) => (
        <TomatoIcon key={i} filled={i < completedCount} />
      ))}
      <span
        className="text-xs font-serif ml-2 opacity-60"
        style={{ color: "var(--pt-espresso)" }}
      >
        {completedCount}/4
      </span>
    </div>
  );
}
