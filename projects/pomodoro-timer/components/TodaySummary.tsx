"use client";

import React from "react";

interface TodaySummaryProps {
  count: number;
}

export default function TodaySummary({ count }: TodaySummaryProps) {
  return (
    <div
      className="text-sm font-medium"
      style={{ color: "var(--pt-espresso-light)" }}
    >
      {count > 0 ? (
        <span>
          {count} 🍅 today
        </span>
      ) : (
        <span className="opacity-60">No pomodoros yet today</span>
      )}
    </div>
  );
}
