"use client";

import React, { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import type { PomodoroSession } from "@/models/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SessionHistoryProps {
  sessions: PomodoroSession[];
}

function getDateGroup(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

function SessionTypeBadge({ type }: { type: PomodoroSession["type"] }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    work: {
      bg: "rgba(192, 57, 43, 0.12)",
      text: "var(--pt-tomato-red)",
      label: "Work",
    },
    shortBreak: {
      bg: "rgba(107, 142, 35, 0.12)",
      text: "var(--pt-olive-green)",
      label: "Short Break",
    },
    longBreak: {
      bg: "rgba(85, 107, 47, 0.12)",
      text: "var(--pt-olive-green-dark)",
      label: "Long Break",
    },
  };

  const s = styles[type];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p
          className="text-sm opacity-60 font-serif"
          style={{ color: "var(--pt-espresso-light)" }}
        >
          No sessions yet — start your first pomodoro! 🍅
        </p>
      </div>
    );
  }

  // Group sessions by date
  const groups: { label: string; items: PomodoroSession[] }[] = [];
  for (const session of sessions) {
    const label = getDateGroup(new Date(session.completedAt));
    const existingGroup = groups.find((g) => g.label === label);
    if (existingGroup) {
      existingGroup.items.push(session);
    } else {
      groups.push({ label, items: [session] });
    }
  }

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors hover:bg-black/5"
        style={{ color: "var(--pt-espresso)" }}
      >
        <span className="text-sm font-serif font-semibold">
          Session History ({sessions.length})
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 opacity-50" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-50" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border"
          style={{ borderColor: "rgba(62, 39, 35, 0.12)" }}
        >
          {groups.map((group) => (
            <div key={group.label}>
              <div
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider sticky top-0"
                style={{
                  backgroundColor: "var(--pt-linen)",
                  color: "var(--pt-espresso-light)",
                }}
              >
                {group.label}
              </div>
              {group.items.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-4 py-2 border-b last:border-b-0"
                  style={{ borderColor: "rgba(62, 39, 35, 0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs tabular-nums opacity-60"
                      style={{ color: "var(--pt-espresso)" }}
                    >
                      {format(new Date(session.completedAt), "h:mm a")}
                    </span>
                    <SessionTypeBadge type={session.type} />
                  </div>
                  <span
                    className="text-xs tabular-nums opacity-50"
                    style={{ color: "var(--pt-espresso)" }}
                  >
                    {session.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
