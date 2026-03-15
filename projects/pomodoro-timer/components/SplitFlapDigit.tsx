"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface SplitFlapDigitProps {
  digit: string; // single character: "0"-"9"
}

export default function SplitFlapDigit({ digit }: SplitFlapDigitProps) {
  const prevDigitRef = useRef(digit);
  const [flipState, setFlipState] = useState<{
    isFlipping: boolean;
    oldDigit: string;
    flipKey: number;
  }>({ isFlipping: false, oldDigit: digit, flipKey: 0 });

  // Detect digit change in useLayoutEffect — fires synchronously after DOM
  // mutation but before browser paint, preventing any flash of the new digit.
  useLayoutEffect(() => {
    if (digit !== prevDigitRef.current) {
      const old = prevDigitRef.current;
      prevDigitRef.current = digit;
      setFlipState((prev) => ({
        isFlipping: true,
        oldDigit: old,
        flipKey: prev.flipKey + 1,
      }));
    }
  }, [digit]);

  // Clear flipping state after the animation completes.
  // Keyed on flipKey so each new flip gets its own timeout.
  useEffect(() => {
    if (flipState.isFlipping) {
      const timer = setTimeout(
        () => setFlipState((prev) => ({ ...prev, isFlipping: false })),
        450,
      );
      return () => clearTimeout(timer);
    }
  }, [flipState.flipKey]);

  const { isFlipping, oldDigit, flipKey } = flipState;

  // Renders a digit inside a half-height container.  The inner span is 200%
  // tall (= full digit box) and absolutely positioned so that overflow-hidden
  // on the parent clips to show only the top or bottom half of the character.
  const digitHalf = (value: string, isTop: boolean) => (
    <span
      className="absolute left-0 right-0 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-[#F0EDE6] leading-none select-none"
      style={{
        height: "200%",
        ...(isTop ? { top: 0 } : { bottom: 0 }),
      }}
    >
      {value}
    </span>
  );

  return (
    <div
      className="relative w-8 h-10 sm:w-10 sm:h-14 lg:w-12 lg:h-16 rounded-md overflow-hidden select-none"
      style={{
        perspective: "300px",
        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* ── Static top half (shows new digit) ── */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden"
        style={{ backgroundColor: "#2C2C2C" }}
      >
        {digitHalf(digit, true)}
      </div>

      {/* ── Static bottom half (shows old digit while flipping, new digit otherwise) ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden"
        style={{ backgroundColor: "#2A2A2A" }}
      >
        {digitHalf(isFlipping ? oldDigit : digit, false)}
      </div>

      {/* ── Animated flaps (keyed to force fresh DOM + CSS animation restart) ── */}
      {isFlipping && (
        <React.Fragment key={flipKey}>
          {/* Old top flap — folds down to reveal new top */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 overflow-hidden pt-flap-old-top"
            style={{
              backgroundColor: "#2C2C2C",
              transformOrigin: "bottom center",
              backfaceVisibility: "hidden",
              zIndex: 3,
            }}
          >
            {digitHalf(oldDigit, true)}
          </div>

          {/* New bottom flap — swings up into place */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden pt-flap-new-bottom"
            style={{
              backgroundColor: "#2A2A2A",
              transformOrigin: "top center",
              backfaceVisibility: "hidden",
              zIndex: 2,
            }}
          >
            {digitHalf(digit, false)}
          </div>
        </React.Fragment>
      )}

      {/* ── Split line (horizontal divider) ── */}
      <div
        className="absolute inset-x-0 top-1/2 h-px z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
          boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}
