"use client";

import React, { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import type { PomodoroSession } from "@/models/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SessionHistoryProps {
  sessions: PomodoroSession[];
  isDesktop?: boolean;
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
      text: "#C0392B",
      label: "Lavoro",
    },
    shortBreak: {
      bg: "rgba(107, 142, 35, 0.12)",
      text: "#6B8E23",
      label: "Pausa Breve",
    },
    longBreak: {
      bg: "rgba(85, 107, 47, 0.12)",
      text: "#556B2F",
      label: "Pausa Lunga",
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

export default function SessionHistory({ sessions, isDesktop = false }: SessionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // On desktop, always expanded
  const showList = isDesktop || isExpanded;

  if (sessions.length === 0) {
    return (
      <div className={isDesktop ? "mt-2" : "mt-8"} style={{ textAlign: "center" }}>
        <p
          className="text-sm opacity-70 font-serif italic"
          style={{ color: "#5D4037" }}
        >
          Nessuna sessione — inizia il tuo primo pomodoro! 🍅
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
    <div className={`${isDesktop ? "mt-0 w-full" : "mt-8 w-full max-w-md mx-auto"}`}>
      {/* Italian flag tricolor accent bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-3 rounded-sm overflow-hidden">
          <div className="w-1" style={{ backgroundColor: "#009246" }} />
          <div className="w-1" style={{ backgroundColor: "#FFFFFF" }} />
          <div className="w-1" style={{ backgroundColor: "#CE2B37" }} />
        </div>
        <span
          className="text-sm font-serif font-semibold"
          style={{ color: "#3E2723" }}
        >
          La Storia delle Sessioni
        </span>
        <span className="text-xs opacity-50 font-serif" style={{ color: "#5D4037" }}>
          ({sessions.length})
        </span>

        {/* Collapse toggle — mobile only */}
        {!isDesktop && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
            style={{ color: "#3E2723" }}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 opacity-50" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-50" />
            )}
          </button>
        )}
      </div>

      {showList && (
        <div
          className={`overflow-y-auto rounded-lg border ${
            isDesktop ? "max-h-[calc(100vh-200px)]" : "max-h-64"
          }`}
          style={{
            borderColor: "rgba(62, 39, 35, 0.12)",
            backgroundColor: "#F5E6D3",
            borderLeft: "4px solid transparent",
            borderImage: "linear-gradient(to bottom, #009246 33%, #FFFFFF 33%, #FFFFFF 66%, #CE2B37 66%) 1",
          }}
        >
          {groups.map((group, groupIdx) => (
            <div key={group.label}>
              <div
                className="px-4 py-2 text-sm font-serif italic font-semibold sticky top-0 flex items-center gap-2"
                style={{
                  backgroundColor: "rgb(255, 255, 255)",
                  color: "#5D4037",
                  borderBottom: "2px solid rgba(192, 57, 43, 0.2)",
                }}
              >
                <span>🍅</span>
                <span>{group.label}</span>
              </div>
              {group.items.map((session, idx) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0 transition-colors"
                  style={{
                    borderColor: "rgba(62, 39, 35, 0.06)",
                    backgroundColor: idx % 2 === 0 ? "#FFFDF5" : "#F5E6D3",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "rgba(192, 57, 43, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      idx % 2 === 0 ? "#FFFDF5" : "#F5E6D3";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs tabular-nums opacity-60 font-serif"
                      style={{ color: "#3E2723" }}
                    >
                      {format(new Date(session.completedAt), "h:mm a")}
                    </span>
                    <SessionTypeBadge type={session.type} />
                  </div>
                  <span
                    className="text-xs tabular-nums opacity-50 font-serif"
                    style={{ color: "#3E2723" }}
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
