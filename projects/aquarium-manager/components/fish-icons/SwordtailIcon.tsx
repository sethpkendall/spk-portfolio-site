import React from "react";

interface Props {
  className?: string;
}

/** Swordtail — scientific illustration, banner format */
export default function SwordtailIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Swordtail fish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — fine-leafed plants & current lines */}
      <path d="M22 80 Q18 62 24 46 Q20 38 26 24 Q22 16 28 6" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M24 46 Q30 42 27 36" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M26 24 Q32 20 29 14" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* current flow lines */}
      <path d="M0 18 Q40 14 80 18 Q120 22 160 18 Q180 16 200 18" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      <path d="M0 68 Q50 64 100 68 Q150 72 200 68" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".04" />
      {/* plant right */}
      <path d="M178 80 Q180 66 174 54 Q178 46 174 36" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M174 54 Q168 50 171 44" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* bubbles */}
      <circle cx="186" cy="20" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="12" cy="8" r="1.5" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* sword — lower caudal ray extension */}
      <path d="M62 48 Q44 54 32 58" stroke="#1a1a1a" strokeWidth="1.2" fill="none" />
      <path d="M62 46 Q48 52 32 58 Q48 54 62 48" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* caudal fin */}
      <path d="M64 36 Q54 24 56 14" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M64 44 Q58 48 62 46" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M56 14 Q60 26 64 36" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M57 20 Q60 28 62 32" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />

      {/* streamlined body */}
      <path
        d="M64 40 Q72 26 94 24 Q116 24 134 32 Q138 38 138 40 Q138 42 134 48 Q116 56 94 56 Q72 54 64 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* lateral line */}
      <path d="M66 40 Q88 38 132 36" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".35" />

      {/* scale hints */}
      <path d="M82 32 Q86 29 90 32" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".28" />
      <path d="M90 32 Q94 29 98 32" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".28" />
      <path d="M98 32 Q102 29 106 32" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".25" />
      <path d="M80 38 Q84 35 88 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />
      <path d="M88 38 Q92 35 96 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />
      <path d="M84 44 Q88 41 92 44" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".2" />

      {/* dorsal fin */}
      <path d="M88 25 Q100 14 118 25" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M92 24 L96 16" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M100 20 L104 14" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M108 22 L112 16" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* anal fin */}
      <path d="M86 54 Q94 64 104 56" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M90 55 L94 62" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />
      <path d="M96 56 L100 62" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* pectoral fin */}
      <path d="M118 44 Q114 52 122 50" fill="none" stroke="#1a1a1a" strokeWidth=".7" />

      {/* gill plate */}
      <path d="M120 30 Q118 40 120 50" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".4" />

      {/* eye — naturalistic */}
      <ellipse cx="130" cy="36" rx="2.8" ry="2.2" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="130" cy="36" r="1.3" fill="#1a1a1a" />
      <circle cx="130.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M138 42 Q140 43.5 139 45" stroke="#1a1a1a" strokeWidth=".8" fill="none" />
    </svg>
  );
}
