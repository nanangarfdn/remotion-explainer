// Small physics helpers for believable motion at 30 fps (see explainer-2d SKILL.md → "Physics").
export const FPS30 = 30;

// Gravity in px/frame² for a shot whose scale is `pxPerM` (measure a known object: head ≈ 0.23 m, table ≈ 0.75 m high).
export const gPx = (pxPerM: number, fps = FPS30) => (9.81 * pxPerM) / (fps * fps);

// Frames a drop of `h` metres takes (1 m ≈ 13.5 f, a table edge 0.75 m ≈ 11.7 f).
export const fallFrames = (h: number, fps = FPS30) => Math.sqrt((2 * h) / 9.81) * fps;

// Projectile position `t` frames after launch (v in px/frame, g in px/frame², +y down).
export const ballistic = (t: number, p0: [number, number], v0: [number, number], g: number): [number, number] => [
  p0[0] + v0[0] * t,
  p0[1] + v0[1] * t + 0.5 * g * t * t,
];

// A strike that lands exactly on frame `at`: wind-up (anticipation, goes negative), accelerating swing (t²),
// abrupt stop on contact (no ease-in to a surface), short hold, then a damped recoil back to rest.
export const strike = (f: number, at: number, wind = 6, swing = 4, hold = 2, recoil = 10) => {
  const t0 = at - swing - wind;
  if (f < t0) return 0;
  if (f < at - swing) {
    const u = (f - t0) / wind;
    return -0.18 * Math.sin((u * Math.PI) / 2); // pull back
  }
  if (f < at) {
    const u = (f - (at - swing)) / swing;
    return -0.18 + 1.18 * u * u; // accelerate into the target
  }
  if (f < at + hold) return 1;
  const u = (f - at - hold) / recoil;
  return u >= 1 ? 0 : 1 - u + 0.08 * Math.sin(u * Math.PI * 2) * (1 - u); // lift off with a small wobble
};

// Damped oscillation after an impact at `at` (glasses, plates, camera shake, landing bounce).
export const damped = (f: number, at: number, amp: number, period = 6, decay = 6) =>
  f < at ? 0 : amp * Math.exp(-(f - at) / decay) * Math.cos(((f - at) / period) * 2 * Math.PI);

const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Insect flight: straight legs between waypoints with ~1–2 frame turns (saccades) and a fine jitter,
// instead of a smooth circle. Returns position and heading sign (+1 moving right).
export const saccadeFlight = (f: number, way: [number, number][], legFrames = 7, jitter = 4, seed = 1): [number, number, number] => {
  const n = way.length;
  const i = Math.floor(f / legFrames);
  const u = (f % legFrames) / legFrames;
  const a = way[i % n];
  const b = way[(i + 1) % n];
  const e = Math.min(1, u * 1.25); // most of the leg at cruise speed, then a quick turn
  return [
    a[0] + (b[0] - a[0]) * e + (rnd(f + seed) - 0.5) * jitter,
    a[1] + (b[1] - a[1]) * e + (rnd(f * 1.7 + seed) - 0.5) * jitter,
    b[0] >= a[0] ? 1 : -1,
  ];
};

// self-check: `npx tsx src/explainer/phys.ts`
if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("phys.ts")) {
  const ok = (c: boolean, m: string) => { if (!c) throw new Error(m); };
  ok(Math.abs(fallFrames(1) - 13.55) < 0.05, "fallFrames(1 m)");
  ok(strike(100, 100) === 1 && strike(0, 100) === 0 && strike(94, 100) < 0, "strike lands on `at` after a wind-up");
  ok(ballistic(10, [0, 0], [1, -5], 1)[1] === 0, "ballistic returns to launch height");
  ok(Math.abs(damped(100, 100, 10)) === 10 && Math.abs(damped(160, 100, 10)) < 0.01, "damped decays");
  console.log("phys ok");
}
