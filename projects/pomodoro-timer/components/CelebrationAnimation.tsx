"use client";

import React, { useEffect, useMemo } from "react";

interface CelebrationAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function CelebrationAnimation({
  isActive,
  onComplete,
}: CelebrationAnimationProps) {
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  // Generate stable random confetti particles
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${10 + (i * 47) % 80}%`,
      delay: `${(i * 131) % 600}ms`,
      duration: `${1800 + (i * 73) % 800}ms`,
      color:
        i % 4 === 0
          ? "var(--pt-tomato-red)"
          : i % 4 === 1
            ? "var(--pt-tomato-red-light)"
            : i % 4 === 2
              ? "var(--pt-olive-green)"
              : "var(--pt-gold)",
      rotation: `${(i * 97) % 360}deg`,
      xDrift: `${-30 + (i * 83) % 60}px`,
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* Warm glow pulse */}
      <div className="absolute inset-0 pt-glow-pulse" />

      {/* Radial burst rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={`burst-${i}`}
            className="absolute rounded-full pt-burst-ring"
            style={{
              width: 100 + i * 80,
              height: 100 + i * 80,
              border: `2px solid var(--pt-tomato-red)`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>

      {/* Confetti particles */}
      {confettiParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pt-confetti-particle"
          style={{
            left: particle.left,
            top: "50%",
            width: 8,
            height: 8,
            backgroundColor: particle.color,
            borderRadius: particle.id % 3 === 0 ? "50%" : "2px",
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            // @ts-expect-error custom CSS properties for animation
            "--rotation": particle.rotation,
            "--x-drift": particle.xDrift,
          }}
        />
      ))}

      {/* Center tomato burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-5xl pt-tomato-burst">🍅</div>
      </div>
    </div>
  );
}
