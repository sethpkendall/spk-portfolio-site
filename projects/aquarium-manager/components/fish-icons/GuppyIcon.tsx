import React from "react";

interface Props {
  className?: string;
}

/** Guppy — scientific illustration, banner format */
export default function GuppyIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Guppy fish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — floating leaves & bubbles */}
      <path d="M24 8 Q30 4 36 8 Q30 6 24 8z" fill="#1a1a1a" opacity=".06" />
      <path d="M30 4 L30 0" stroke="#1a1a1a" strokeWidth=".4" opacity=".05" />
      <path d="M30 8 Q28 16 30 24 Q28 30 30 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      {/* plant bottom-right */}
      <path d="M176 80 Q174 66 180 52 Q176 44 182 32" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M180 52 Q186 48 183 42" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      {/* seaweed left */}
      <path d="M16 80 Q14 68 18 56 Q14 48 20 38" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".07" strokeLinecap="round" />
      {/* bubbles */}
      <circle cx="188" cy="14" r="2.2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="192" cy="24" r="1.3" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      <circle cx="10" cy="50" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* enormous fan caudal */}
      <path d="M78 40 Q54 18 50 4" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M78 40 Q54 62 50 76" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M50 4 Q66 24 78 40 Q66 56 50 76" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      {/* fan rays */}
      <path d="M54 12 Q62 24 72 34" stroke="#1a1a1a" strokeWidth=".4" opacity=".38" />
      <path d="M52 24 Q58 32 68 38" stroke="#1a1a1a" strokeWidth=".35" opacity=".32" />
      <path d="M52 40 Q60 40 68 40" stroke="#1a1a1a" strokeWidth=".35" opacity=".28" />
      <path d="M52 56 Q58 48 68 42" stroke="#1a1a1a" strokeWidth=".35" opacity=".32" />
      <path d="M54 68 Q62 56 72 46" stroke="#1a1a1a" strokeWidth=".4" opacity=".38" />

      {/* compact body */}
      <path
        d="M78 40 Q84 28 100 26 Q118 26 132 34 Q136 38 136 40 Q136 42 132 46 Q118 54 100 54 Q84 52 78 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* lateral line */}
      <path d="M80 40 Q96 38 130 36" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".3" />

      {/* dorsal fin */}
      <path d="M96 27 Q106 16 118 26" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M100 26 L104 18" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M108 24 L112 18" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* anal fin */}
      <path d="M96 52 Q104 62 112 54" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M100 54 L104 60" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* pectoral fin */}
      <path d="M116 44 Q112 50 120 48" fill="none" stroke="#1a1a1a" strokeWidth=".7" />

      {/* gill plate */}
      <path d="M118 30 Q116 40 118 50" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".4" />

      {/* eye — naturalistic */}
      <ellipse cx="128" cy="36" rx="2.8" ry="2.2" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="128" cy="36" r="1.3" fill="#1a1a1a" />
      <circle cx="128.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M136 40 Q137.5 42 136.5 43.5" stroke="#1a1a1a" strokeWidth=".8" fill="none" />

      {/* stipple */}
      <circle cx="90" cy="36" r=".45" fill="#1a1a1a" opacity=".18" />
      <circle cx="96" cy="46" r=".4" fill="#1a1a1a" opacity=".15" />
      <circle cx="108" cy="34" r=".4" fill="#1a1a1a" opacity=".15" />
    </svg>
  );
}
