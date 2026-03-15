/**
 * SoundManager — Web Audio API sound generation for Pomodoro Timer.
 * Exports pure functions; no React component rendered.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Resume if suspended (browsers require user gesture)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a cheering / celebratory sound (work session complete).
 * Rising major chord (C-E-G) + white-noise crowd burst. ~1.5 s
 */
export function playCheerSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // ── Major chord: C4, E4, G4 ────────────────────────────────
    const frequencies = [261.63, 329.63, 392.0];
    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      // slight rise for excitement
      osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.8);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05); // quick attack
      gain.gain.setValueAtTime(0.15, now + 0.8);
      gain.gain.linearRampToValueAtTime(0, now + 1.5); // fade out

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    });

    // ── White-noise "crowd roar" burst ─────────────────────────
    const bufferSize = ctx.sampleRate * 1.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Bandpass filter to shape the noise
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1200, now);
    bandpass.Q.setValueAtTime(0.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    noiseGain.gain.setValueAtTime(0.08, now + 0.6);
    noiseGain.gain.linearRampToValueAtTime(0, now + 1.5);

    noiseSource.connect(bandpass).connect(noiseGain).connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 1.5);
  } catch {
    // Audio not available — fail silently
  }
}

/**
 * Play a buzzer sound (break complete — time to work!).
 * Three short square-wave buzzes at 220 Hz. ~0.5 s
 */
export function playBuzzerSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 3 short buzzes: 100 ms on, 50 ms off
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(220, now);

      const onTime = now + i * 0.15;
      gain.gain.setValueAtTime(0, onTime);
      gain.gain.linearRampToValueAtTime(0.12, onTime + 0.01);
      gain.gain.setValueAtTime(0.12, onTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, onTime + 0.105);

      osc.connect(gain).connect(ctx.destination);
      osc.start(onTime);
      osc.stop(onTime + 0.15);
    }
  } catch {
    // Audio not available — fail silently
  }
}
