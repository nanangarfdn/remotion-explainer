import React from "react";
import { Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { THEME } from "../explainer/kit";
import { clamp } from "../shorts/common";

// Real recorded CC0 sounds (public/sfx/bsb, BigSoundBank) — natural foley instead of synthetic pops.
export const BSB = {
  vibrate: "sfx/bsb/0022-phone-vibrate.mp3",
  vibratePocket: "sfx/bsb/1036-phone-vibrate-pocket.mp3",
  notif: "sfx/bsb/2059-notification.mp3",
  tick: "sfx/bsb/2816-clock-tick.mp3",
  room: "sfx/bsb/2458-room-tone-house.mp3",
  street: "sfx/bsb/2372-street-ambience.mp3",
  birds: "sfx/bsb/0999-birds-morning.mp3",
  steps: "sfx/bsb/0514-footsteps-concrete.mp3",
  run: "sfx/bsb/1318-steps-fast.mp3",
  chatter: "sfx/bsb/3542-restaurant-chatter.mp3",
  cloth: "sfx/bsb/1104-cloth-rub.mp3",
  heart: "sfx/bsb/0218-heartbeat.mp3",
  air: "sfx/bsb/1796-whoosh-air.mp3",
};

// One sound: starts at `at` (local frame), optional source offset/length (frames), fades in/out, loops if asked.
export const Snd: React.FC<{ at: number; src: string; vol?: number; from?: number; len?: number; fade?: number; loop?: boolean; rate?: number }> = ({ at, src, vol = 0.5, from = 0, len, fade = 0, loop, rate }) => {
  const { durationInFrames } = useVideoConfig();
  const L = Math.max(1, Math.min(len ?? durationInFrames - at, durationInFrames - at));
  return (
    <Sequence from={at} durationInFrames={L} layout="none">
      <Audio src={staticFile(src)} trimBefore={from || undefined} loop={loop} playbackRate={rate}
        volume={(f) => vol * (fade ? Math.min(1, f / fade, (L - f) / fade) : 1)} />
    </Sequence>
  );
};
// Location ambience for the whole shot (fades in and out with the cut).
export const Amb: React.FC<{ src: string; vol?: number; from?: number }> = ({ src, vol = 0.15, from = 0 }) => <Snd at={0} src={src} vol={vol} from={from} fade={12} loop />;

// ── question tracker: two open loops pinned at the top, ticked when answered ──
export const Tracker: React.FC<{ panikIn: number; otakIn: number; fly: number; panikDone: number; otakDone: number; pulseP: number; pulseO: number }> = ({ panikIn, otakIn, fly, panikDone, otakDone, pulseP, pulseO }) => {
  const f = useCurrentFrame();
  const chip = (n: string, text: string, inAt: number, done: number, pulse: number, x: number, y0: number) => {
    if (f < inAt) return null;
    // pops big mid-screen while asked, then flies up into its slot at `fly`
    const t = interpolate(f, [fly, fly + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const big = spring({ frame: f - inAt, fps: 30, config: { damping: 10 } });
    const ok = f >= done;
    const okPop = spring({ frame: f - done, fps: 30, config: { damping: 9 } });
    const p = f >= pulse && f < pulse + 40 ? 1 + 0.08 * Math.sin(((f - pulse) / 40) * Math.PI * 4) : 1;
    const left = interpolate(t, [0, 1], [540 - 200, x]);
    const top = interpolate(t, [0, 1], [y0, 150]);
    const s = interpolate(t, [0, 1], [1.7, 1]) * Math.min(1, big) * p;
    return (
      <div key={n} style={{ position: "absolute", left, top, width: 400, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 999, fontFamily: THEME.font, fontWeight: 900, fontSize: 40,
          background: ok ? THEME.teal : THEME.navy, color: THEME.paper, boxShadow: "0 6px 0 rgba(0,0,0,0.2)", border: `4px solid ${ok ? "#0E8B78" : THEME.amber}`,
        }}>
          <span style={{ width: 52, height: 52, borderRadius: 99, background: ok ? THEME.paper : THEME.amber, color: THEME.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
            {ok ? (
              <svg width={34} height={34} viewBox="0 0 100 100" style={{ transform: `scale(${okPop})` }}>
                <path d="M18 54 L42 76 L84 26" stroke={THEME.teal} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            ) : n}
          </span>
          {text}
        </div>
      </div>
    );
  };
  return (
    <>
      {chip("1", "Kapan panik?", panikIn, panikDone, pulseP, 90, 420)}
      {chip("2", "Otak kenapa?", otakIn, otakDone, pulseO, 590, 270)}
    </>
  );
};

// ── classroom (portrait px): wall, whiteboard, wall clock, basket shelf; desks in a front layer ──
export const KelasBack: React.FC<{ clockMin: number; meter: number }> = ({ clockMin, meter }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <rect width={1080} height={1180} fill="#F1E9DA" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 96} y={0} width={4} height={1180} fill="#000" opacity={0.03} />)}
    <rect y={1180} width={1080} height={740} fill="#C9A27A" />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} y={1180 + i * 96} width={1080} height={4} fill="#000" opacity={0.06} />)}
    {/* whiteboard with the anxiety meter drawn on it */}
    <rect x={300} y={300} width={720} height={400} rx={14} fill="#8D9AB3" />
    <rect x={316} y={316} width={688} height={368} rx={8} fill="#FBFCFF" />
    <text x={350} y={380} fontFamily={THEME.font} fontWeight={900} fontSize={44} fill={THEME.primary}>TINGKAT CEMAS</text>
    <rect x={350} y={420} width={620} height={70} rx={35} fill="#E6E9F2" />
    <rect x={350} y={420} width={620 * meter} height={70} rx={35} fill={meter > 0.66 ? THEME.orange : meter > 0.33 ? THEME.amber : THEME.teal} />
    {[0.33, 0.66].map((m) => <rect key={m} x={350 + 620 * m} y={410} width={4} height={90} fill="#B9C2D3" />)}
    <path d="M360 560 q60 -30 120 0 t120 0 M360 620 q40 -20 90 0" stroke="#C9CFDB" strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={320} y={694} width={680} height={16} rx={6} fill="#8D9AB3" />
    {/* wall clock, real time: minute hand steps */}
    <g transform="translate(150 420)">
      <circle r={96} fill="#000" opacity={0.12} cx={6} cy={8} />
      <circle r={96} fill={THEME.paper} stroke={THEME.primaryDark} strokeWidth={12} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-3} y={-84} width={6} height={i % 3 ? 10 : 18} fill={THEME.ink} transform={`rotate(${i * 30})`} />)}
      <rect x={-5} y={-50} width={10} height={56} rx={5} fill={THEME.ink} transform={`rotate(${300 + clockMin / 2})`} />
      <rect x={-3} y={-74} width={6} height={80} rx={3} fill={THEME.primary} transform={`rotate(${clockMin * 6})`} />
      <circle r={9} fill={THEME.amber} />
    </g>
    {/* shelf + basket for the phones */}
    <rect x={30} y={720} width={240} height={16} rx={6} fill="#8D6440" />
    <path d="M60 640 L240 640 L222 720 L78 720 Z" fill="#C99A62" />
    {[90, 130, 170, 210].map((x) => <rect key={x} x={x} y={648} width={6} height={66} fill="#A87D4B" />)}
  </svg>
);
export const KelasDesks: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    {/* front row desks (cover the front students' bodies) */}
    {[20, 560].map((x) => (
      <g key={x}>
        <rect x={x} y={1236} width={500} height={44} rx={10} fill="#A8794A" />
        <rect x={x} y={1276} width={500} height={14} fill="#000" opacity={0.12} />
        <rect x={x + 30} y={1290} width={26} height={260} fill="#7A5634" />
        <rect x={x + 444} y={1290} width={26} height={260} fill="#7A5634" />
        <rect x={x + 60} y={1290} width={380} height={120} fill="#93683F" />
      </g>
    ))}
  </svg>
);

// ── 24 h ring: sleep, phone, the rest ───────────────────────────────────────
export const DayRing: React.FC<{ p: number; hiPhone: number }> = ({ p, hiPhone }) => {
  const R = 150;
  const arc = (a0: number, a1: number) => {
    const P = (a: number) => [200 + R * Math.sin(a * 2 * Math.PI), 200 - R * Math.cos(a * 2 * Math.PI)];
    const [x0, y0] = P(a0), [x1, y1] = P(a1);
    return `M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const seg = (a0: number, a1: number, c: string, w = 60) => p > a0 ? <path d={arc(a0, Math.min(a1, p) - 0.0001)} stroke={c} strokeWidth={w} fill="none" /> : null;
  return (
    <svg width={400} height={400} viewBox="0 0 400 400">
      <circle cx={200} cy={200} r={R} stroke="#E6E9F2" strokeWidth={60} fill={THEME.paper} />
      {seg(0, 8 / 24, THEME.navy)}
      {seg(8 / 24, 14 / 24, THEME.amber, 60 + 14 * hiPhone)}
      {seg(14 / 24, 1, THEME.mint)}
      <text x={200} y={196} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={62} fill={THEME.ink}>24</text>
      <text x={200} y={240} textAnchor="middle" fontFamily={THEME.font} fontWeight={800} fontSize={34} fill="#7C8597">jam</text>
    </svg>
  );
};

// ── 467 people grid; `n` = how many are drawn so far, `off` = wifi-off marks ──
export const PeopleGrid: React.FC<{ n: number; off: number; w?: number }> = ({ n, off, w = 940 }) => {
  const cols = 27;
  const cell = w / cols;
  return (
    <svg width={w} height={cell * 18} viewBox={`0 0 ${w} ${cell * 18}`}>
      {Array.from({ length: Math.min(467, Math.round(n)) }).map((_, i) => {
        const x = (i % cols) * cell + cell / 2;
        const y = Math.floor(i / cols) * cell + cell / 2;
        const c = i === 200 ? THEME.amber : i % 3 ? THEME.primary : THEME.teal;
        return (
          <g key={i} opacity={off > 0 && i !== 200 ? 1 - 0.35 * off : 1}>
            <circle cx={x} cy={y - cell * 0.18} r={cell * 0.16} fill={c} />
            <rect x={x - cell * 0.2} y={y} width={cell * 0.4} height={cell * 0.3} rx={cell * 0.15} fill={c} />
          </g>
        );
      })}
    </svg>
  );
};

// ── anxiety over time: spikes, then settles below where it started ──────────
export const MoodChart: React.FC<{ p: number; calm: number }> = ({ p, calm }) => {
  const pts = Array.from({ length: 41 }).map((_, i) => {
    const t = i / 40;
    const y = 0.45 + 0.42 * Math.exp(-((t - 0.12) ** 2) / 0.006) - 0.25 * Math.min(1, Math.max(0, (t - 0.25) / 0.5));
    return [40 + t * 820, 330 - y * 300] as const;
  });
  const shown = pts.slice(0, Math.max(2, Math.round(p * 41)));
  return (
    <svg width={900} height={400} viewBox="0 0 900 400">
      <rect width={900} height={400} rx={30} fill={THEME.paper} />
      <line x1={40} y1={330 - 0.45 * 300} x2={860} y2={330 - 0.45 * 300} stroke="#C9CFDB" strokeWidth={4} strokeDasharray="12 12" />
      <text x={50} y={330 - 0.45 * 300 - 14} fontFamily={THEME.font} fontWeight={800} fontSize={28} fill="#7C8597">biasanya</text>
      <polyline points={shown.map((q) => q.join(",")).join(" ")} stroke={THEME.orange} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {p > 0.15 ? <text x={100} y={60} fontFamily={THEME.font} fontWeight={900} fontSize={36} fill={THEME.orange}>panik di awal</text> : null}
      <text x={560} y={300} fontFamily={THEME.font} fontWeight={900} fontSize={36} fill={THEME.teal} opacity={calm}>lebih tenang</text>
      <text x={40} y={386} fontFamily={THEME.font} fontWeight={800} fontSize={26} fill="#7C8597">hari 1</text>
      <text x={760} y={386} fontFamily={THEME.font} fontWeight={800} fontSize={26} fill="#7C8597">hari 14</text>
    </svg>
  );
};

// iOS-like toggle row inside a phone screen
export const Toggle: React.FC<{ label: string; on: number }> = ({ label, on }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: THEME.paper, borderRadius: 26, padding: "22px 24px", fontFamily: THEME.font, fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", color: THEME.ink, boxShadow: "0 4px 0 rgba(0,0,0,0.06)" }}>
    {label}
    <div style={{ width: 130, height: 74, borderRadius: 40, background: on > 0.5 ? THEME.teal : "#C9CFDB", position: "relative" }}>
      <div style={{ position: "absolute", top: 7, left: 7 + 56 * on, width: 60, height: 60, borderRadius: 30, background: THEME.paper, boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }} />
    </div>
  </div>
);

// Wi-Fi glyph with an optional strike
export const WifiIcon: React.FC<{ w?: number; off?: number; color?: string }> = ({ w = 120, off = 0, color = THEME.primary }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    {[40, 27, 14].map((r, i) => <path key={r} d={`M${50 - r} ${70 - r * 0.5} Q50 ${70 - r * 1.5} ${50 + r} ${70 - r * 0.5}`} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none" opacity={1 - 0.5 * off} />)}
    <circle cx={50} cy={74} r={7} fill={color} opacity={1 - 0.5 * off} />
    {off > 0 ? <path d={`M16 16 L${16 + 68 * off} ${16 + 68 * off}`} stroke={THEME.orange} strokeWidth={11} strokeLinecap="round" /> : null}
  </svg>
);
