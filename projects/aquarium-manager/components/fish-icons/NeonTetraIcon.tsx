import React from "react";

interface Props {
  className?: string;
}

/** Neon Tetra — scientific illustration, banner format */
export default function NeonTetraIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Neon tetra fish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — dense fine-leafed plants & dappled light */}
      <path d="M14 80 Q12 62 18 46 Q14 36 20 22 Q16 14 22 4" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M22 80 Q20 68 26 54 Q22 46 28 36" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M18 46 Q24 42 21 36" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      <path d="M26 54 Q32 50 29 44" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      {/* fine plants right */}
      <path d="M178 80 Q176 64 182 48 Q178 40 184 28" stroke="#1a1a1a" strokeWidth=".65" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M186 80 Q184 70 188 58 Q184 50 190 40" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" strokeLinecap="round" />
      <path d="M182 48 Q188 44 185 38" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      {/* dappled light ripples */}
      <path d="M40 6 Q60 3 80 6 Q100 9 120 6 Q140 3 160 6" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".05" />
      <path d="M60 12 Q80 9 100 12 Q120 15 140 12" stroke="#1a1a1a" strokeWidth=".35" fill="none" opacity=".04" />
      {/* bubbles */}
      <circle cx="10" cy="10" r="1.5" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      <circle cx="192" cy="18" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* forked caudal fin */}
      <path d="M60 36 Q52 24 54 14" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M60 44 Q52 56 54 66" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M54 14 Q58 26 60 36" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M54 66 Q58 54 60 44" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M55 20 Q57 28 59 33" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />
      <path d="M55 60 Q57 52 59 47" stroke="#1a1a1a" strokeWidth=".35" opacity=".4" />

      {/* torpedo body */}
      <path
        d="M60 40 Q70 24 94 24 Q120 24 138 34 Q142 38 142 40 Q142 42 138 46 Q120 56 94 56 Q70 56 60 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* diagnostic lateral stripes */}
      <path d="M62 36 Q80 32 106 33 Q124 34 140 36" stroke="#1a1a1a" strokeWidth="1.8" fill="none" opacity=".5" />
      <path d="M62 44 Q80 48 106 47 Q124 46 140 44" stroke="#1a1a1a" strokeWidth="1.2" fill="none" opacity=".35" />

      {/* adipose fin */}
      <path d="M68 28 Q72 24 76 28" fill="none" stroke="#1a1a1a" strokeWidth=".7" />

      {/* dorsal fin */}
      <path d="M92 25 Q102 14 116 25" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M96 24 L100 16" stroke="#1a1a1a" strokeWidth=".4" opacity=".4" />
      <path d="M104 22 L108 15" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* anal fin */}
      <path d="M88 54 Q96 64 108 56" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M92 55 L96 62" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />
      <path d="M100 56 L104 62" stroke="#1a1a1a" strokeWidth=".35" opacity=".35" />

      {/* pectoral fin */}
      <path d="M118 44 Q114 50 122 48" fill="none" stroke="#1a1a1a" strokeWidth=".7" />

      {/* gill plate */}
      <path d="M120 30 Q118 40 120 50" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".4" />

      {/* eye — naturalistic */}
      <ellipse cx="132" cy="36" rx="2.6" ry="2" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="132" cy="36" r="1.2" fill="#1a1a1a" />
      <circle cx="132.5" cy="35.5" r=".3" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M142 40 Q143.5 42 142.5 43.5" stroke="#1a1a1a" strokeWidth=".8" fill="none" />
    </svg>
  );
}
