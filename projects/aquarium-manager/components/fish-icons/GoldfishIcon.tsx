import React from "react";

interface Props {
  className?: string;
}

/** Goldfish — scientific illustration, banner format */
export default function GoldfishIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Goldfish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — bushy plants */}
      <path d="M16 80 Q12 58 18 42 Q14 34 20 20 Q17 14 22 6" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M26 80 Q22 64 28 50 Q24 44 30 34" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M18 42 Q24 38 21 32" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M28 50 Q34 46 31 40" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      <path d="M174 80 Q178 60 172 44 Q178 36 172 22" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M184 80 Q186 66 180 52 Q184 44 180 36" stroke="#1a1a1a" strokeWidth=".65" fill="none" opacity=".06" strokeLinecap="round" />
      <path d="M172 44 Q166 40 170 34" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      {/* bubbles */}
      <circle cx="10" cy="10" r="2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="192" cy="18" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />
      <circle cx="188" cy="10" r="1.2" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".05" />

      {/* double veil caudal fin */}
      <path d="M64 36 Q54 22 56 10" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M64 44 Q54 58 56 70" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M56 10 Q60 26 64 36" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M56 70 Q60 54 64 44" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      {/* tail rays */}
      <path d="M57 16 Q59 26 62 32" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M57 64 Q59 54 62 48" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M55 26 Q58 32 62 36" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />
      <path d="M55 54 Q58 48 62 44" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* rotund body */}
      <path
        d="M64 40 Q72 18 92 18 Q114 18 130 30 Q134 38 134 40 Q134 42 130 50 Q114 62 92 62 Q72 62 64 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* scale arcs */}
      <path d="M78 32 Q82 29 86 32" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".3" />
      <path d="M86 32 Q90 29 94 32" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".3" />
      <path d="M94 32 Q98 29 102 32" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".28" />
      <path d="M102 32 Q106 29 110 32" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".25" />
      <path d="M76 38 Q80 35 84 38" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".25" />
      <path d="M84 38 Q88 35 92 38" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".25" />
      <path d="M92 38 Q96 35 100 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />
      <path d="M100 38 Q104 35 108 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />
      <path d="M80 44 Q84 41 88 44" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />
      <path d="M88 44 Q92 41 96 44" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".2" />
      <path d="M96 44 Q100 41 104 44" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".2" />
      <path d="M82 50 Q86 47 90 50" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".18" />
      <path d="M90 50 Q94 47 98 50" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".18" />

      {/* dorsal fin */}
      <path d="M84 20 Q98 8 118 22" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M88 18 L92 10" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M98 16 L102 9" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M108 18 L112 12" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* anal fin */}
      <path d="M90 60 Q100 70 114 60" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M94 61 L98 68" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />
      <path d="M104 62 L108 68" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* pectoral fin */}
      <path d="M114 44 Q110 52 118 50" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* gill plate */}
      <path d="M118 28 Q116 40 118 52" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".4" />

      {/* lateral line */}
      <path d="M66 40 Q86 36 128 35" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".3" />

      {/* eye — naturalistic */}
      <ellipse cx="126" cy="34" rx="3.2" ry="2.5" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="126" cy="34" r="1.5" fill="#1a1a1a" />
      <circle cx="126.5" cy="33.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M134 40 Q136 42 135 44" stroke="#1a1a1a" strokeWidth=".8" fill="none" />
    </svg>
  );
}
