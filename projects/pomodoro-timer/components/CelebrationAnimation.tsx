"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { playCheerSound, playBuzzerSound } from "./SoundManager";

type Phase = "work" | "shortBreak" | "longBreak";

const WORK_PHRASES = ["Congratulazioni!", "Evviva!", "Urrà!"];
const BREAK_PHRASE = "Andiamo!";

function pickWorkPhrase(): string {
  return WORK_PHRASES[Math.floor(Math.random() * WORK_PHRASES.length)];
}

/** Attempt to speak an Italian phrase via SpeechSynthesis. */
function speakItalian(text: string): void {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    // Try to find an Italian voice
    const voices = speechSynthesis.getVoices();
    const italianVoice = voices.find((v) => v.lang.startsWith("it"));
    if (italianVoice) utterance.voice = italianVoice;

    speechSynthesis.speak(utterance);
  } catch {
    // Speech not available — fail silently
  }
}

interface CelebrationAnimationProps {
  isActive: boolean;
  phase: Phase;
  onComplete: () => void;
}

export default function CelebrationAnimation({
  isActive,
  phase,
  onComplete,
}: CelebrationAnimationProps) {
  const [phrase, setPhrase] = useState("");
  const hasTriggeredRef = useRef(false);

  // Trigger sounds + speech when celebration becomes active
  useEffect(() => {
    if (!isActive) {
      hasTriggeredRef.current = false;
      return;
    }
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const isWorkEnd = phase === "work";
    const chosenPhrase = isWorkEnd ? pickWorkPhrase() : BREAK_PHRASE;
    setPhrase(chosenPhrase);

    if (isWorkEnd) {
      playCheerSound();
    } else {
      playBuzzerSound();
    }

    // Speech — voices may load async, so try after a short delay
    const speechDelay = setTimeout(() => speakItalian(chosenPhrase), 200);

    const completionTimer = setTimeout(onComplete, 2500);
    return () => {
      clearTimeout(speechDelay);
      clearTimeout(completionTimer);
    };
  }, [isActive, phase, onComplete]);

  // Generate stable random confetti particles (work completion only)
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${10 + ((i * 47) % 80)}%`,
      delay: `${(i * 131) % 600}ms`,
      duration: `${1800 + ((i * 73) % 800)}ms`,
      color:
        i % 4 === 0
          ? "#C0392B"
          : i % 4 === 1
            ? "#E74C3C"
            : i % 4 === 2
              ? "#6B8E23"
              : "#DAA520",
      rotation: `${(i * 97) % 360}deg`,
      xDrift: `${-30 + ((i * 83) % 60)}px`,
    }));
  }, []);

  if (!isActive) return null;

  const isWorkEnd = phase === "work";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {isWorkEnd ? (
        <>
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
                  border: `2px solid #C0392B`,
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
        </>
      ) : (
        /* Break end — subtle pulse background */
        <div
          className="absolute inset-0 pt-break-pulse"
          style={{
            background:
              "radial-gradient(circle at center, rgba(107,142,35,0.18) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Italian phrase overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="pt-phrase-overlay font-serif text-4xl sm:text-6xl font-bold text-white select-none"
          style={{
            textShadow:
              "0 2px 12px rgba(0,0,0,0.6), 0 0 40px rgba(192,57,43,0.4)",
            zIndex: 60,
          }}
        >
          {phrase}
        </div>
      </div>
    </div>
  );
}
