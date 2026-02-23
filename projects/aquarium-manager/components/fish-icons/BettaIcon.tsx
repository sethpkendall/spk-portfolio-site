import React from "react";

interface Props {
  className?: string;
}

/** Betta / Siamese fighting fish — scientific illustration, banner format */
export default function BettaIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Betta fish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — surface ripples & floating leaf */}
      <path d="M0 6 Q25 3 50 6 Q75 9 100 6 Q125 3 150 6 Q175 9 200 6" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M0 12 Q30 9 60 12 Q90 15 120 12 Q150 9 180 12 Q195 14 200 12" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      {/* floating broad leaf */}
      <path d="M170 70 Q175 62 182 66 Q176 64 170 70z" fill="#1a1a1a" opacity=".06" />
      <path d="M175 62 L176 58" stroke="#1a1a1a" strokeWidth=".4" opacity=".06" />
      {/* small plant bottom-left */}
      <path d="M22 80 Q20 68 26 58 Q22 52 28 42" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M26 58 Q32 54 29 48" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      {/* bubbles */}
      <circle cx="16" cy="20" r="2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="188" cy="40" r="1.5" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* elaborate caudal fin */}
      <path d="M72 40 Q52 22 44 8" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M72 40 Q52 58 44 72" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M44 8 Q60 28 72 40 Q60 52 44 72" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      {/* fin membrane rays */}
      <path d="M48 14 Q56 26 66 34" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".4" />
      <path d="M46 24 Q54 32 62 36" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".35" />
      <path d="M46 56 Q54 48 62 44" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".35" />
      <path d="M48 66 Q56 54 66 46" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".4" />
      <path d="M46 40 Q54 40 62 40" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".3" />

      {/* compact body */}
      <path
        d="M72 40 Q78 28 94 26 Q112 26 124 34 Q128 38 128 40 Q128 42 124 46 Q112 54 94 54 Q78 52 72 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* tall dorsal fin */}
      <path d="M88 27 Q100 8 116 26" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M92 25 L96 12" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M100 22 L104 10" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M108 23 L112 14" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* flowing ventral fins */}
      <path d="M92 53 Q86 72 96 66" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M102 53 Q100 72 112 66" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M94 55 L88 66" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />
      <path d="M104 55 L104 66" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* pectoral fin */}
      <path d="M112 44 Q108 52 116 50" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* gill plate */}
      <path d="M116 32 Q114 40 116 48" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".4" />

      {/* lateral line */}
      <path d="M74 40 Q90 38 122 36" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".3" />

      {/* eye — naturalistic */}
      <ellipse cx="122" cy="36" rx="2.8" ry="2.2" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="122" cy="36" r="1.3" fill="#1a1a1a" />
      <circle cx="122.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M128 42 Q130 43.5 129 45" stroke="#1a1a1a" strokeWidth=".8" fill="none" />

      {/* stipple */}
      <circle cx="88" cy="38" r=".45" fill="#1a1a1a" opacity=".18" />
      <circle cx="96" cy="46" r=".45" fill="#1a1a1a" opacity=".16" />
      <circle cx="104" cy="34" r=".4" fill="#1a1a1a" opacity=".16" />
    </svg>
  );
}
