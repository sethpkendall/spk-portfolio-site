import React from "react";

interface Props {
  className?: string;
}

/** Seahorse — scientific illustration, banner format */
export default function SeahorseIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Seahorse illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — seagrass/kelp fronds */}
      <path d="M20 80 Q16 58 22 38 Q18 28 24 12" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M28 80 Q24 64 30 48 Q26 40 32 26" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M22 38 Q28 34 25 28" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".06" />
      <path d="M30 48 Q36 44 33 38" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* kelp right */}
      <path d="M168 80 Q172 60 166 42 Q172 32 166 16" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M176 80 Q178 66 174 52 Q178 44 174 34" stroke="#1a1a1a" strokeWidth=".65" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M166 42 Q160 38 163 32" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />
      <path d="M174 52 Q180 48 177 42" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".05" />
      {/* bubbles */}
      <circle cx="186" cy="10" r="2.2" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="182" cy="22" r="1.4" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      <circle cx="14" cy="6" r="1.6" fill="none" stroke="#1a1a1a" strokeWidth=".25" opacity=".06" />
      {/* sand suggestion */}
      <path d="M0 78 Q50 76 100 78 Q150 76 200 78" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".05" />

      {/* prehensile tail */}
      <path
        d="M92 72 Q80 78 76 74 Q74 70 80 68 Q86 66 84 62 Q80 58 86 54"
        fill="none" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round"
      />
      {/* tail segments */}
      <path d="M90 58 L86 58" stroke="#1a1a1a" strokeWidth=".5" opacity=".35" />
      <path d="M86 62 L82 62" stroke="#1a1a1a" strokeWidth=".45" opacity=".3" />
      <path d="M82 66 L78 66" stroke="#1a1a1a" strokeWidth=".4" opacity=".3" />
      <path d="M80 70 L76 70" stroke="#1a1a1a" strokeWidth=".4" opacity=".25" />

      {/* torso — curved upright */}
      <path
        d="M86 56 Q80 46 80 36 Q80 24 86 16 Q92 8 100 12 Q108 16 112 26 Q116 36 110 46 Q104 56 94 58 Q90 58 86 56z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* bony plate ridges */}
      <path d="M82 22 Q90 20 104 22" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".35" />
      <path d="M81 28 Q90 26 108 28" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".32" />
      <path d="M80 34 Q90 32 112 34" stroke="#1a1a1a" strokeWidth=".55" fill="none" opacity=".3" />
      <path d="M82 40 Q90 38 110 40" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".28" />
      <path d="M84 46 Q90 44 106 46" stroke="#1a1a1a" strokeWidth=".45" fill="none" opacity=".25" />
      <path d="M88 52 Q92 50 100 52" stroke="#1a1a1a" strokeWidth=".4" fill="none" opacity=".22" />

      {/* head */}
      <path
        d="M94 12 Q98 6 104 6 Q110 6 112 12 Q112 16 108 20 Q102 24 96 20 Q92 18 94 12z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinejoin="round"
      />

      {/* coronet */}
      <path d="M98 6 Q100 -2 104 0 Q108 -2 108 6" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M100 2 L102 -2" stroke="#1a1a1a" strokeWidth=".4" opacity=".35" />
      <path d="M104 1 L106 -2" stroke="#1a1a1a" strokeWidth=".35" opacity=".3" />

      {/* tubular snout */}
      <path d="M112 12 Q122 10 132 12" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M112 16 Q122 14 132 16" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* dorsal fin */}
      <path d="M106 22 Q118 18 116 32" fill="none" stroke="#1a1a1a" strokeWidth=".9" />
      <path d="M108 22 L114 18" stroke="#1a1a1a" strokeWidth=".4" opacity=".35" />
      <path d="M112 26 L118 22" stroke="#1a1a1a" strokeWidth=".35" opacity=".3" />
      <path d="M114 30 L118 27" stroke="#1a1a1a" strokeWidth=".35" opacity=".25" />

      {/* eye — naturalistic */}
      <ellipse cx="108" cy="12" rx="2.4" ry="2" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="108" cy="12" r="1.1" fill="#1a1a1a" />
      <circle cx="108.4" cy="11.5" r=".3" fill="#f8f6f1" />

      {/* stipple */}
      <circle cx="88" cy="32" r=".45" fill="#1a1a1a" opacity=".18" />
      <circle cx="96" cy="40" r=".4" fill="#1a1a1a" opacity=".15" />
      <circle cx="102" cy="30" r=".4" fill="#1a1a1a" opacity=".15" />
      <circle cx="92" cy="48" r=".4" fill="#1a1a1a" opacity=".12" />
    </svg>
  );
}
