import React from "react";

interface Props {
  className?: string;
}

/** Clownfish — scientific illustration, banner format */
export default function ClownfishIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Clownfish illustration"
      style={{ display: "block" }}
    >
      <rect width="200" height="80" fill="#f8f6f1" />

      {/* background — anemone tendrils */}
      <path d="M18 80 Q14 60 20 45 Q16 35 22 20" stroke="#1a1a1a" strokeWidth=".9" fill="none" opacity=".08" strokeLinecap="round" />
      <path d="M28 80 Q24 65 30 50 Q26 42 32 30" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M12 80 Q10 68 16 55" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".06" strokeLinecap="round" />
      <path d="M172 80 Q176 62 170 48 Q175 38 168 24" stroke="#1a1a1a" strokeWidth=".8" fill="none" opacity=".07" strokeLinecap="round" />
      <path d="M182 80 Q184 66 178 52" stroke="#1a1a1a" strokeWidth=".6" fill="none" opacity=".06" strokeLinecap="round" />
      {/* bubbles */}
      <circle cx="186" cy="16" r="2.5" fill="none" stroke="#1a1a1a" strokeWidth=".35" opacity=".08" />
      <circle cx="190" cy="26" r="1.5" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".07" />
      <circle cx="14" cy="12" r="1.8" fill="none" stroke="#1a1a1a" strokeWidth=".3" opacity=".06" />

      {/* body */}
      <path
        d="M68 40 Q74 26 92 22 Q112 20 128 30 Q134 36 134 40 Q134 44 128 50 Q112 58 92 56 Q74 54 68 40z"
        fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* diagnostic bands */}
      <path d="M82 24 Q80 40 82 56" stroke="#1a1a1a" strokeWidth="2.2" fill="none" />
      <path d="M100 21 Q98 40 100 57" stroke="#1a1a1a" strokeWidth="2.2" fill="none" />
      <path d="M116 28 Q114 40 116 52" stroke="#1a1a1a" strokeWidth="1.8" fill="none" />

      {/* caudal fin */}
      <path d="M68 40 Q58 28 60 18" fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M68 40 Q58 52 60 62" fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M60 18 Q65 30 68 40 Q65 50 60 62" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M62 24 Q64 32 66 36" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".5" />
      <path d="M62 56 Q64 48 66 44" stroke="#1a1a1a" strokeWidth=".5" fill="none" opacity=".5" />

      {/* dorsal fin */}
      <path d="M86 24 Q98 12 118 24" fill="none" stroke="#1a1a1a" strokeWidth="1.1" />
      <path d="M90 22 L94 14" stroke="#1a1a1a" strokeWidth=".45" opacity=".5" />
      <path d="M100 19 L104 13" stroke="#1a1a1a" strokeWidth=".45" opacity=".5" />
      <path d="M108 20 L112 14" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />

      {/* anal fin */}
      <path d="M90 55 Q100 64 112 56" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M94 56 L98 62" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />
      <path d="M104 57 L108 62" stroke="#1a1a1a" strokeWidth=".4" opacity=".45" />

      {/* pectoral fin */}
      <path d="M114 44 Q110 52 118 50" fill="none" stroke="#1a1a1a" strokeWidth=".8" />

      {/* gill plate */}
      <path d="M118 30 Q116 40 118 50" stroke="#1a1a1a" strokeWidth=".7" fill="none" opacity=".45" />

      {/* eye — naturalistic */}
      <ellipse cx="126" cy="36" rx="3" ry="2.4" fill="#f8f6f1" stroke="#1a1a1a" strokeWidth=".7" />
      <circle cx="126" cy="36" r="1.4" fill="#1a1a1a" />
      <circle cx="126.5" cy="35.5" r=".35" fill="#f8f6f1" />

      {/* mouth */}
      <path d="M134 42 Q136 44 135 46" stroke="#1a1a1a" strokeWidth=".8" fill="none" />

      {/* stipple */}
      <circle cx="90" cy="36" r=".5" fill="#1a1a1a" opacity=".2" />
      <circle cx="86" cy="44" r=".5" fill="#1a1a1a" opacity=".18" />
      <circle cx="96" cy="48" r=".5" fill="#1a1a1a" opacity=".18" />
      <circle cx="112" cy="46" r=".4" fill="#1a1a1a" opacity=".15" />
    </svg>
  );
}
