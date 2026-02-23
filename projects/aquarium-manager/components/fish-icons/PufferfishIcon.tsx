import React from "react";

interface Props {
  className?: string;
}

/** Pufferfish — scientific illustration, banner format */
export default function PufferfishIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Pufferfish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — coral shapes & bubbles */}
      <path d="M18 80 Q16 68 22 58 Q18 52 24 42 Q22 36 26 28" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M22 58 Q28 54 26 48" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      {/* branching coral right */}
      <path d="M174 80 Q176 68 172 58" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M172 58 Q168 52 172 46 Q168 40 174 32" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M172 58 Q178 54 176 48" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M172 46 Q166 42 168 36" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* bubbles */}
      <circle cx="186" cy="14" r="2.5" fill="none" stroke="#1a1a1a" strokeWidth=".35" opacity=".08" />
      <circle cx="182" cy="24" r="1.5" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="190" cy="32" r="1" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      <circle cx="14" cy="10" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />
      <circle cx="10" cy="20" r="1.2" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".05" />

      {/* small caudal fin */}
      <path d="M60 36 Q52 26 54 16" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M60 44 Q52 54 54 64" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M54 16 Q58 28 60 36" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M54 64 Q58 52 60 44" fill="none" stroke="#1a1a1a" strokeWidth=".9" />

      {/* inflated round body */}
      <circle cx="92" cy="40" r="22" fill="none" stroke="#1a1a1a" strokeWidth="1.4" />

      {/* spines */}
      <line x1="92" y1="18" x2="92" y2="12" stroke="#1a1a1a" strokeWidth=".8" />
      <line x1="80" y1="22" x2="76" y2="16" stroke="#1a1a1a" strokeWidth=".8" />
      <line x1="104" y1="22" x2="108" y2="16" stroke="#1a1a1a" strokeWidth=".8" />
      <line x1="72" y1="30" x2="66" y2="26" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="112" y1="30" x2="118" y2="26" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="70" y1="40" x2="64" y2="40" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="72" y1="50" x2="66" y2="54" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="112" y1="50" x2="118" y2="54" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="80" y1="58" x2="76" y2="64" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="104" y1="58" x2="108" y2="64" stroke="#1a1a1a" strokeWidth=".7" />
      <line x1="92" y1="62" x2="92" y2="68" stroke="#1a1a1a" strokeWidth=".8" />

      {/* belly demarcation */}
      <path d="M72 46 Q82 56 104 56 Q112 52 114 46" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".3" />

      {/* dorsal fin */}
      <path d="M102 20 Q112 14 114 22" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M106 18 L110 14" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* pectoral fin */}
      <path d="M106 44 Q102 52 110 50" fill="none" stroke="#1a1a1a" strokeWidth=".7" />

      {/* eye — naturalistic, large */}
      <ellipse cx="108" cy="34" rx="3.5" ry="2.8" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="108" cy="34" r="1.6" fill="#1a1a1a" />
      <circle cx="108.6" cy="33.4" r=".4" fill="#f8f6f1" />

      {/* beak mouth */}
      <path d="M112 42 Q118 42 118 44 Q118 46 112 46" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M112 44 L118 44" stroke="#1a1a1a" strokeWidth=".5" />

      {/* stipple */}
      <circle cx="82" cy="34" r=".5" fill="#1a1a1a" opacity=".18" />
      <circle cx="86" cy="28" r=".45" fill="#1a1a1a" opacity=".15" />
      <circle cx="78" cy="40" r=".5" fill="#1a1a1a" opacity=".15" />
      <circle cx="88" cy="48" r=".45" fill="#1a1a1a" opacity=".15" />
      <circle cx="98" cy="52" r=".4" fill="#1a1a1a" opacity=".12" />
      <circle cx="96" cy="26" r=".4" fill="#1a1a1a" opacity=".12" />
    </svg>
  );
}
