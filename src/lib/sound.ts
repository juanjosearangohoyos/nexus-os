/**
 * Diseño sonoro original de NEXUS OS.
 * - El sonido está desactivado por defecto y solo se reproduce tras un gesto del visitante.
 * - Los efectos de interfaz se sintetizan en tiempo real con Web Audio (sin muestras de terceros).
 * - El sonido de arranque es un archivo original generado para el proyecto (public/media/audio).
 */

let enabled = false;
let ctx: AudioContext | null = null;
let ambient: { stop: () => void } | null = null;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) stopAmbient();
}

export function isSoundEnabled() {
  return enabled;
}

function audio(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; gain?: number; delay?: number; glideTo?: number } = {}) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + (opts.delay ?? 0);
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, t0 + dur);
  const peak = opts.gain ?? 0.06;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  click: () => tone(1250, 0.05, { type: 'triangle', gain: 0.03 }),
  open: () => {
    tone(520, 0.16, { gain: 0.045, glideTo: 780 });
    tone(1040, 0.12, { gain: 0.02, delay: 0.05 });
  },
  close: () => tone(700, 0.14, { gain: 0.035, glideTo: 420 }),
  minimize: () => tone(620, 0.18, { gain: 0.03, glideTo: 310 }),
  toggleOn: () => {
    tone(880, 0.07, { type: 'triangle', gain: 0.035 });
    tone(1320, 0.08, { type: 'triangle', gain: 0.03, delay: 0.06 });
  },
  toggleOff: () => {
    tone(1100, 0.07, { type: 'triangle', gain: 0.03 });
    tone(660, 0.09, { type: 'triangle', gain: 0.03, delay: 0.06 });
  },
  alert: () => {
    tone(660, 0.12, { gain: 0.04 });
    tone(660, 0.12, { gain: 0.04, delay: 0.16 });
  },
  success: () => {
    tone(523.25, 0.16, { gain: 0.04 });
    tone(659.25, 0.16, { gain: 0.04, delay: 0.09 });
    tone(783.99, 0.26, { gain: 0.04, delay: 0.18 });
  },
  message: () => tone(990, 0.09, { type: 'sine', gain: 0.035, glideTo: 1180 }),
  pulse: () => tone(240, 0.22, { type: 'sine', gain: 0.05, glideTo: 180 }),
};

export function playBootChime(src: string) {
  if (!enabled) return;
  try {
    const el = new Audio(src);
    el.volume = 0.55;
    void el.play().catch(() => sfx.success());
  } catch {
    sfx.success();
  }
}

/** Ambiente opcional: acorde suave y lento sintetizado. Solo tras activación explícita. */
export function startAmbient() {
  const ac = audio();
  if (!ac || ambient) return;
  const master = ac.createGain();
  master.gain.setValueAtTime(0.0001, ac.currentTime);
  master.gain.exponentialRampToValueAtTime(0.018, ac.currentTime + 2.5);
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  master.connect(filter).connect(ac.destination);
  const oscs = [130.81, 196, 261.63, 329.63].map((f, i) => {
    const o = ac.createOscillator();
    o.type = i % 2 ? 'triangle' : 'sine';
    o.frequency.value = f;
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.05 + i * 0.03;
    lfoGain.gain.value = 1.5;
    lfo.connect(lfoGain).connect(o.frequency);
    o.connect(master);
    o.start();
    lfo.start();
    return [o, lfo];
  });
  ambient = {
    stop: () => {
      const t = ac.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      oscs.flat().forEach((o) => o.stop(t + 0.9));
    },
  };
}

export function stopAmbient() {
  ambient?.stop();
  ambient = null;
}
