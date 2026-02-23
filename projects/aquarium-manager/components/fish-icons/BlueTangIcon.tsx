import React from "react";

interface Props {
  className?: string;
}

/** Blue Tang — scientific illustration, banner format */
export default function BlueTangIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Blue tang fish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — branching coral & anemone hint */}
      <path d="M16 80 Q14 66 20 54 Q16 46 22 34 Q18 28 24 18" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M20 54 Q26 50 23 44" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M22 34 Q28 30 25 24" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* coral branch right */}
      <path d="M176 80 Q178 70 174 62 Q180 54 174 44" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M174 62 Q168 58 171 52" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      <path d="M174 44 Q180 40 177 34" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* anemone suggestion bottom-left */}
      <path d="M30 80 Q32 74 28 70" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" strokeLinecap="round" />
      <path d="M34 80 Q36 72 32 68" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" strokeLinecap="round" />
      <path d="M38 80 Q40 76 36 72" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" strokeLinecap="round" />
      {/* bubbles */}
      <circle cx="188" cy="16" r="2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="184" cy="26" r="1.2" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />

      {/* caudal fin */}
      <path d="M60 36 Q52 24 54 12" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M60 44 Q52 56 54 68" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M54 12 Q58 26 60 36" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M54 68 Q58 54 60 44" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M55 20 Q57 28 59 34" stroke="#1a1a1a" strokeWidth=".4" opacity=".35" />
      <path d="M55 60 Q57 52 59 46" stroke="#1a1a1a" strokeWidth=".4" opacity=".35" />

      {/* oval body */}
      <ellipse cx="92" cy="40" rx="30" ry="18" fill="none" stroke="#1a1a1a" strokeWidth="1.4" />

      {/* palette-surgeon mark */}
      <path
        d="M76 34 Q82 26 98 30 Q106 34 106 40 Q104 48 92 46 Q82 44 76 48 Q72 44 76 34z"
        fill="none" stroke="#1a1a1a" strokeWidth="1" opacity=".45"
      />
      {/* hatching */}
      <path d="M80 36 L86 33" stroke="#1a1a1a" strokeWidth=".4" opacity=".25" />
      <path d="M82 42 L88 39" stroke="#1a1a1a" strokeWidth=".4" opacity=".25" />
      <path d="M90 44 L96 41" stroke="#1a1a1a" strokeWidth=".35" opacity=".2" />
      <path d="M92 32 L98 35" stroke="#1a1a1a" strokeWidth=".35" opacity=".2" />

      {/* caudal peduncle scalpel */}
      <path d="M64 42 Q65 44 64 46" stroke="#1a1a1a" strokeWidth="1.2" fill="none" />

      {/* lateral line */}
      <path d="M64 40 Q80 36 120 36" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".3" />

      {/* dorsal fin */}
      <path d="M74 24 Q92 10 114 24" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M78 22 L82 13" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M86 18 L90 11" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M94 16 L98 10" stroke="#1a1a1a" strokeWidth=".4" opacity=".35" />
      <path d="M102 18 L106 13" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* anal fin */}
      <path d="M74 56 Q92 70 114 56" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M78 58 L82 66" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M86 62 L90 68" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M94 64 L98 69" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />
      <path d="M102 62 L106 66" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* pectoral fin */}
      <path d="M106 44 Q102 52 110 50" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* gill plate */}
      <path d="M108 28 Q106 40 108 52" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".4" />

      {/* eye — naturalistic */}
      <ellipse cx="116" cy="36" rx="3" ry="2.4" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="116" cy="36" r="1.4" fill="#1a1a1a" />
      <circle cx="116.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M122 40 Q124 42 123 44" stroke="#1a1a1a" strokeWidth=".8" fill="none" />
    </svg>
  );
}
