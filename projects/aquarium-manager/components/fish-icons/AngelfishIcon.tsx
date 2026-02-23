import React from "react";

interface Props {
  className?: string;
}

/** Angelfish — scientific illustration, banner format */
export default function AngelfishIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Angelfish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — tall aquatic grass & driftwood hint */}
      <path d="M20 80 Q18 55 24 35 Q20 25 26 8" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M28 80 Q26 62 32 48 Q28 38 34 24" stroke="#1a1a1a" strokeWidth=".65" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M14 80 Q12 70 16 60" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" strokeLinecap="round" />
      {/* driftwood-like shape right */}
      <path d="M168 72 Q178 68 186 60 Q190 55 188 52" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M178 68 Q176 62 180 58" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      {/* bubbles */}
      <circle cx="190" cy="16" r="2.2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="184" cy="24" r="1.3" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      <circle cx="12" cy="14" r="1.6" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* tall diamond body */}
      <path
        d="M68 40 Q78 8 102 6 Q126 8 132 40 Q126 72 102 74 Q78 72 68 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* vertical bars */}
      <path d="M84 10 Q82 40 84 70" stroke="#1a1a1a" strokeWidth="1.6" fill="none" opacity=".45" />
      <path d="M94 8 Q92 40 94 72" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity=".5" />
      <path d="M104 9 Q102 40 104 71" stroke="#1a1a1a" strokeWidth="1.4" fill="none" opacity=".4" />
      <path d="M114 14 Q112 40 114 66" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity=".3" />

      {/* caudal fin */}
      <path d="M68 40 Q58 28 60 18" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M68 40 Q58 52 60 62" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M60 18 Q65 30 68 40 Q65 50 60 62" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M61 24 Q63 32 66 36" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M61 56 Q63 48 66 44" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />

      {/* elongated dorsal fin */}
      <path d="M82 10 Q94 -2 108 8" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M86 8 L90 0" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M94 4 L98 -2" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M102 5 L106 0" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* elongated anal fin */}
      <path d="M82 70 Q94 82 108 72" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M86 72 L90 80" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M94 76 L98 82" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M102 75 L106 80" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* pectoral fin */}
      <path d="M116 44 Q112 52 120 50" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* gill plate */}
      <path d="M120 22 Q118 40 120 58" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".4" />

      {/* eye — naturalistic */}
      <ellipse cx="124" cy="36" rx="3" ry="2.4" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="124" cy="36" r="1.4" fill="#1a1a1a" />
      <circle cx="124.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M132 42 Q134 44 133 46" stroke="#1a1a1a" strokeWidth=".8" fill="none" />
    </svg>
  );
}
