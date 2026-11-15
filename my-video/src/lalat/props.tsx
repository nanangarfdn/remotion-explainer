import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Lalat props: a semi-realistic house fly (side + top views), a slapping arm, a palm seen from the front,
// a mosquito racket, a macro compound eye, a stopwatch and film strips.

const SKIN = "#F7D4B5";
const SKIN_D = "#E8B795";

// ── house fly, side view, facing right. Box 200×140, feet at y 128. ──
export const Fly: React.FC<{ w: number; flying?: number; rub?: number; crouch?: number; flip?: boolean; shadow?: boolean; seed?: number }> = ({ w, flying = 0, rub = 0, crouch = 0, flip, shadow = true, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 7;
  const id = `fly${seed}`;
  const lift = crouch * 10;
  // grooming: front legs rub each other in front of the head
  const rb = rub * Math.sin(f / 1.6);
  const wingA = -12;
  const wingB = -6;
  const leg = (d: string, k: number) => <path key={k} d={d} stroke="#1D1A1A" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  const tuck = flying ? 1 : 0;
  return (
    <svg width={w} height={(w * 140) / 200} viewBox="0 0 200 140" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id={`${id}ab`} cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#8B8478" /><stop offset="0.6" stopColor="#4A4540" /><stop offset="1" stopColor="#24211F" /></radialGradient>
        <radialGradient id={`${id}th`} cx="0.45" cy="0.3" r="0.75"><stop offset="0" stopColor="#7A746C" /><stop offset="1" stopColor="#2A2724" /></radialGradient>
        <radialGradient id={`${id}ey`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#E0733F" /><stop offset="0.55" stopColor="#A63A22" /><stop offset="1" stopColor="#5E1C12" /></radialGradient>
        <pattern id={`${id}hx`} width={5} height={4.3} patternUnits="userSpaceOnUse"><path d="M1.25 0 L3.75 0 L5 2.15 L3.75 4.3 L1.25 4.3 L0 2.15 Z" fill="none" stroke="#000" strokeWidth={0.5} opacity={0.35} /></pattern>
        <linearGradient id={`${id}wg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E8F4FF" stopOpacity={0.75} /><stop offset="1" stopColor="#B8D4EA" stopOpacity={0.35} /></linearGradient>
      </defs>
      {shadow ? <ellipse cx={105} cy={131} rx={70} ry={7} fill="#000" opacity={flying ? 0.08 : 0.22} /> : null}
      <g transform={`translate(0 ${lift})`}>
        {/* far legs (darker, behind the body) */}
        <g opacity={0.75}>
          {[
            `M100 95 L${84 - tuck * 6} ${112 - tuck * 12} L${76 - tuck * 4} ${128 - lift - tuck * 20}`,
            `M114 96 L${118} ${114 - tuck * 12} L${124 + tuck * 4} ${128 - lift - tuck * 22}`,
          ].map((d, i) => leg(d, i))}
        </g>
        {/* abdomen */}
        <ellipse cx={70} cy={84} rx={46} ry={30} fill={`url(#${id}ab)`} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${52 + i * 16} 56 Q${46 + i * 16} 84 ${52 + i * 16} 112`} stroke="#1A1716" strokeWidth={3} fill="none" opacity={0.45} />)}
        <ellipse cx={60} cy={70} rx={22} ry={8} fill="#fff" opacity={0.18} transform="rotate(-12 60 70)" />
        {/* thorax with the 4 dark stripes */}
        <ellipse cx={114} cy={72} rx={32} ry={28} fill={`url(#${id}th)`} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${94 + i * 4} ${54 + i * 6} Q114 ${50 + i * 6} ${136 - i * 2} ${58 + i * 6}`} stroke="#1A1716" strokeWidth={4} fill="none" opacity={0.55} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${98 + i * 7} ${46 + (i % 2) * 3} l${-2 + (i % 3)} -7`} stroke="#151312" strokeWidth={1.6} strokeLinecap="round" />)}
        {/* near legs */}
        {leg(`M98 96 L${86 - tuck * 4} ${114 - tuck * 14} L${82 - tuck * 2} ${128 - lift - tuck * 22}`, 10)}
        {leg(`M112 98 L${114} ${116 - tuck * 14} L${118 + tuck * 2} ${128 - lift - tuck * 24}`, 11)}
        {/* front legs: stand, or rub in front of the head */}
        {rub > 0.05
          ? [leg(`M128 92 L${150 + rb * 3} ${104} L${170 + rb * 6} ${96 - rb * 3}`, 12), leg(`M130 94 L${152 - rb * 3} ${108} L${170 - rb * 6} ${98 + rb * 3}`, 13)]
          : [leg(`M126 94 L${138 + tuck * 2} ${112 - tuck * 14} L${146 + tuck * 4} ${128 - lift - tuck * 22}`, 12)]}
        {/* wings (translucent, veined); buzzing when flying */}
        {flying ? (
          // ~200 wingbeats/s: at 30 fps the wings read as a translucent blur fan, never as visible flaps
          <g opacity={0.5 + 0.12 * Math.sin(f * 1.7)}>
            <path d="M104 52 L22 8 A90 90 0 0 0 30 92 Z" fill={`url(#${id}wg)`} opacity={0.55} />
            {[-48, 18].map((a) => (
              <path key={a} transform={`rotate(${a} 104 52)`} d="M104 52 Q60 30 26 42 Q16 52 34 60 Q70 66 104 56 Z" fill="none" stroke="#9DB6CC" strokeWidth={1.2} opacity={0.6} />
            ))}
          </g>
        ) : null}
        <g opacity={flying ? 0 : 1}>
          {[wingB, wingA].map((a, i) => (
            <g key={i} transform={`rotate(${a} 104 52)`}>
              <path d="M104 52 Q60 30 26 42 Q16 52 34 60 Q70 66 104 56 Z" fill={`url(#${id}wg)`} stroke="#9DB6CC" strokeWidth={1.4} />
              <path d="M100 54 Q66 44 32 48 M96 56 Q70 56 40 58 M80 52 L74 60" stroke="#7F98AE" strokeWidth={1} fill="none" opacity={0.8} />
            </g>
          ))}
        </g>
        {/* head + compound eye */}
        <circle cx={150} cy={74} r={22} fill="#3A3633" />
        <ellipse cx={156} cy={66} rx={19} ry={23} fill={`url(#${id}ey)`} />
        <ellipse cx={156} cy={66} rx={19} ry={23} fill={`url(#${id}hx)`} />
        <ellipse cx={150} cy={56} rx={6} ry={4} fill="#fff" opacity={0.55} transform="rotate(-25 150 56)" />
        <path d="M164 84 q6 8 4 18" stroke="#2A2624" strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={168} cy={103} rx={5} ry={3} fill="#2A2624" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${142 + i * 6} 52 l${-1 + i} -8`} stroke="#151312" strokeWidth={1.4} strokeLinecap="round" />)}
      </g>
    </svg>
  );
};

// ── fly seen from above (radar / tips diagrams). Box 100×120, head up. ──
export const FlyTop: React.FC<{ w: number; flying?: number }> = ({ w, flying = 0 }) => {
  const f = useCurrentFrame();
  const fl = flying ? 14 * Math.sin(f * 2.9) : 0;
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible" }}>
      {[[-1, 0], [1, 0]].map(([s]) => (
        <g key={s}>
          {[34, 52, 66].map((y, i) => <path key={i} d={`M${50 + s * 8} ${y} L${50 + s * (26 + i * 2)} ${y + (i - 1) * 12} L${50 + s * 34} ${y + (i - 1) * 22}`} stroke="#1D1A1A" strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
          <path d={`M${50 + s * 4} 46 Q${50 + s * 40} ${70 + fl} ${50 + s * 22} 104 Q${50 + s * 8} 88 ${50 + s * 4} 52 Z`} fill="#DCEBFA" opacity={flying ? 0.4 : 0.7} stroke="#9DB6CC" strokeWidth={1} />
        </g>
      ))}
      <ellipse cx={50} cy={84} rx={15} ry={22} fill="#4A4540" />
      <ellipse cx={50} cy={52} rx={14} ry={14} fill="#3A3633" />
      {[-5, 0, 5].map((x) => <path key={x} d={`M${50 + x} 42 L${50 + x} 62`} stroke="#1A1716" strokeWidth={2.4} opacity={0.6} />)}
      <circle cx={50} cy={30} r={11} fill="#2E2A28" />
      <ellipse cx={42} cy={26} rx={8} ry={10} fill="#A63A22" />
      <ellipse cx={58} cy={26} rx={8} ry={10} fill="#A63A22" />
      <ellipse cx={40} cy={22} rx={2.5} ry={2} fill="#fff" opacity={0.6} />
      <ellipse cx={56} cy={22} rx={2.5} ry={2} fill="#fff" opacity={0.6} />
    </svg>
  );
};

// ── arm + hand slapping down: shoulder `from` → palm centre `to` (scene px). Back of the hand faces the camera. ──
export const ArmHand: React.FC<{ from: [number, number]; to: [number, number]; w?: number; sleeve?: string; sleeveShade?: string; blur?: number }> = ({ from, to, w = 260, sleeve = THEME.orange, sleeveShade = THEME.orangeDark, blur = 0 }) => {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI - 90; // fingers point along the arm
  const len = Math.hypot(x1 - x0, y1 - y0);
  const k = w / 200;
  const wrist = len - 120 * k;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: blur ? `blur(${blur}px)` : undefined }}>
      <g transform={`translate(${x0} ${y0}) rotate(${ang})`}>
        {/* forearm in the sleeve, tapering to the wrist */}
        <path d={`M${-70 * k} 0 L${70 * k} 0 L${52 * k} ${wrist - 30 * k} L${-52 * k} ${wrist - 30 * k} Z`} fill={sleeve} />
        <path d={`M${40 * k} 0 L${70 * k} 0 L${52 * k} ${wrist - 30 * k} L${30 * k} ${wrist - 30 * k} Z`} fill={sleeveShade} />
        <rect x={-56 * k} y={wrist - 44 * k} width={112 * k} height={26 * k} rx={10 * k} fill={sleeveShade} />
        <rect x={-40 * k} y={wrist - 22 * k} width={80 * k} height={40 * k} fill={SKIN} />
        <g transform={`translate(0 ${wrist}) scale(${k})`}>
          {/* back of the hand: palm, four fingers, thumb */}
          <path d="M-62 0 Q-70 70 -54 100 L54 100 Q70 70 62 0 Z" fill={SKIN} />
          {[-45, -15, 15, 45].map((x, i) => {
            const h = [62, 78, 74, 56][i];
            return (
              <g key={x} transform={`rotate(${(i - 1.5) * 5} ${x} 96)`}>
                <rect x={x - 14} y={92} width={28} height={h} rx={14} fill={SKIN} />
                <rect x={x - 9} y={92 + h - 22} width={18} height={16} rx={7} fill="#FBE7D6" stroke={SKIN_D} strokeWidth={1.5} />
                <path d={`M${x - 8} ${120} q8 4 16 0`} stroke={SKIN_D} strokeWidth={2.4} fill="none" />
              </g>
            );
          })}
          <path d="M-60 18 Q-104 36 -100 86 Q-96 100 -82 92 Q-78 60 -54 52 Z" fill={SKIN} stroke={SKIN_D} strokeWidth={2} />
          <path d="M-40 30 Q0 20 40 30" stroke={SKIN_D} strokeWidth={3} fill="none" opacity={0.6} />
          <path d="M30 4 Q58 40 54 96" stroke={SKIN_D} strokeWidth={10} fill="none" opacity={0.5} />
        </g>
      </g>
    </svg>
  );
};

// ── palm facing the camera (fly POV), fingers up. Box 300×380. ──
export const PalmFront: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={(w * 380) / 300} viewBox="0 0 300 380">
    <path d="M70 380 L70 300 Q50 230 60 170 L240 170 Q252 230 232 300 L232 380 Z" fill={SKIN} />
    {[78, 128, 178, 226].map((x, i) => {
      const h = [120, 150, 144, 110][i];
      return (
        <g key={x} transform={`rotate(${(i - 1.5) * 6} ${x} 180)`}>
          <rect x={x - 22} y={180 - h} width={44} height={h + 20} rx={22} fill={SKIN} />
          <path d={`M${x - 14} ${180 - h * 0.45} q14 6 28 0 M${x - 14} ${180 - h * 0.75} q14 5 28 0`} stroke={SKIN_D} strokeWidth={3} fill="none" />
        </g>
      );
    })}
    <path d="M60 230 Q10 210 6 160 Q8 140 26 146 Q40 190 72 200 Z" fill={SKIN} stroke={SKIN_D} strokeWidth={2} />
    <path d="M100 230 Q150 270 210 220 M96 270 Q150 300 200 280 M120 200 Q130 260 110 330" stroke={SKIN_D} strokeWidth={4} fill="none" opacity={0.8} />
    <ellipse cx={150} cy={260} rx={70} ry={60} fill="#fff" opacity={0.12} />
  </svg>
);

// ── mosquito racket (raket nyamuk): yellow handle, metal mesh head. Box 160×420, handle bottom. ──
export const Racket: React.FC<{ w: number; zap?: number }> = ({ w, zap = 0 }) => {
  const f = useCurrentFrame();
  const sparks = zap > 0 ? [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const a = (i / 7) * Math.PI * 2 + f * 0.7;
    const r = 70 + 30 * Math.abs(Math.sin(f * 1.3 + i));
    return `M80 120 L${80 + Math.cos(a) * r * 0.6} ${120 + Math.sin(a) * r * 0.5} L${80 + Math.cos(a + 0.2) * r} ${120 + Math.sin(a + 0.2) * r}`;
  }) : [];
  return (
    <svg width={w} height={(w * 420) / 160} viewBox="0 0 160 420" style={{ overflow: "visible" }}>
      <ellipse cx={80} cy={120} rx={76} ry={110} fill="#33384A" />
      <ellipse cx={80} cy={120} rx={64} ry={98} fill={zap > 0 ? `rgba(160,220,255,${0.25 + 0.35 * zap})` : "#DDE6F2"} opacity={zap > 0 ? 1 : 0.35} />
      <clipPath id="rkmesh"><ellipse cx={80} cy={120} rx={64} ry={98} /></clipPath>
      <g clipPath="url(#rkmesh)" stroke="#5B6378" strokeWidth={1.6}>
        {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={14 + i * 9} y1={10} x2={14 + i * 9} y2={230} />)}
        {Array.from({ length: 24 }, (_, i) => <line key={`h${i}`} x1={0} y1={18 + i * 9} x2={160} y2={18 + i * 9} />)}
      </g>
      <rect x={66} y={226} width={28} height={40} fill="#33384A" />
      <rect x={58} y={262} width={44} height={150} rx={20} fill={THEME.amber} />
      <rect x={58} y={262} width={14} height={150} rx={7} fill="#fff" opacity={0.25} />
      <circle cx={80} cy={300} r={10} fill={zap > 0 ? "#FF5A5A" : "#C2462E"} />
      {zap > 0 ? <circle cx={80} cy={300} r={16} fill="#FF5A5A" opacity={0.35} /> : null}
      {sparks.map((d, i) => <path key={i} d={d} stroke="#BFF4FF" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9 * zap} />)}
    </svg>
  );
};

// ── macro compound eye: hex lenses, curvature shading, an optional scanning band. Box 600×700. ──
export const EyeMacro: React.FC<{ w: number; scan?: number }> = ({ w, scan = -1 }) => {
  const hexes: React.ReactNode[] = [];
  const R = 15;
  const dx = R * 1.5;
  const dy = R * Math.sqrt(3);
  for (let c = 0; c < 600 / dx + 2; c++) {
    for (let r = 0; r < 700 / dy + 2; r++) {
      const x = c * dx;
      const y = r * dy + (c % 2 ? dy / 2 : 0);
      const lit = scan >= 0 ? Math.max(0, 1 - Math.abs(y - scan) / 70) : 0;
      const pts = [0, 1, 2, 3, 4, 5].map((k) => `${x + R * 0.94 * Math.cos((k * Math.PI) / 3)},${y + R * 0.94 * Math.sin((k * Math.PI) / 3)}`).join(" ");
      hexes.push(<polygon key={`${c}-${r}`} points={pts} fill="url(#emlens)" opacity={1} />);
      if (lit > 0) hexes.push(<polygon key={`l${c}-${r}`} points={pts} fill="#FFE08A" opacity={0.55 * lit} />);
    }
  }
  return (
    <svg width={w} height={(w * 700) / 600} viewBox="0 0 600 700">
      <defs>
        <radialGradient id="emlens" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#E98352" /><stop offset="0.7" stopColor="#A63A22" /><stop offset="1" stopColor="#6A2014" /></radialGradient>
        <radialGradient id="emshade" cx="0.4" cy="0.35" r="0.65"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.75} /></radialGradient>
        <clipPath id="emclip"><ellipse cx={300} cy={350} rx={290} ry={340} /></clipPath>
      </defs>
      <ellipse cx={300} cy={350} rx={296} ry={346} fill="#2A1410" />
      <g clipPath="url(#emclip)">
        <rect width={600} height={700} fill="#3A120C" />
        {hexes}
        <ellipse cx={300} cy={350} rx={290} ry={340} fill="url(#emshade)" />
      </g>
      <ellipse cx={210} cy={190} rx={90} ry={50} fill="#fff" opacity={0.28} transform="rotate(-30 210 190)" />
      <ellipse cx={190} cy={175} rx={30} ry={16} fill="#fff" opacity={0.5} transform="rotate(-30 190 175)" />
    </svg>
  );
};

// ── stopwatch: hand sweeps to `t` (0…1 of a turn), box 260×300 ──
export const Stopwatch: React.FC<{ w: number; t: number }> = ({ w, t }) => (
  <svg width={w} height={(w * 300) / 260} viewBox="0 0 260 300">
    <rect x={110} y={0} width={40} height={30} rx={8} fill="#5B6378" />
    <rect x={190} y={36} width={30} height={22} rx={6} fill="#5B6378" transform="rotate(40 205 47)" />
    <circle cx={130} cy={170} r={124} fill="#5B6378" />
    <circle cx={130} cy={170} r={108} fill={THEME.paper} />
    <path d={`M130 170 L130 62 A108 108 0 ${t > 0.5 ? 1 : 0} 1 ${130 + 108 * Math.sin(t * 2 * Math.PI)} ${170 - 108 * Math.cos(t * 2 * Math.PI)} Z`} fill={THEME.amber} opacity={0.5} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={130} y1={70} x2={130} y2={i % 3 ? 82 : 92} stroke={THEME.ink} strokeWidth={i % 3 ? 4 : 7} transform={`rotate(${i * 30} 130 170)`} />)}
    <line x1={130} y1={170} x2={130} y2={78} stroke={THEME.orange} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 360} 130 170)`} />
    <circle cx={130} cy={170} r={12} fill={THEME.ink} />
  </svg>
);

// ── film strip: frames scroll up; each frame shows a palm icon that advances by `step` per frame ──
export const FilmStrip: React.FC<{ w: number; h: number; perFrame: number; step: number; speed: number; color: string }> = ({ w, h, perFrame, step, speed, color }) => {
  const f = useCurrentFrame();
  const fh = h / perFrame;
  const off = (f * speed) % fh;
  const n = perFrame + 2;
  const first = Math.floor((f * speed) / fh);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ borderRadius: 18 }}>
      <rect width={w} height={h} fill="#1A1C28" />
      {Array.from({ length: Math.ceil(h / 26) + 2 }, (_, i) => (
        <g key={i}>
          <rect x={8} y={i * 26 - ((f * speed) % 26)} width={14} height={14} rx={3} fill="#3A3E52" />
          <rect x={w - 22} y={i * 26 - ((f * speed) % 26)} width={14} height={14} rx={3} fill="#3A3E52" />
        </g>
      ))}
      {Array.from({ length: n }, (_, i) => {
        const idx = first + i;
        const y = i * fh - off;
        const px = 40 + (((idx * step) % (w - 120)) + (w - 120)) % (w - 120);
        return (
          <g key={i}>
            <rect x={32} y={y + 4} width={w - 64} height={fh - 8} rx={6} fill={color} />
            <circle cx={px + 20} cy={y + fh / 2} r={Math.min(16, fh / 4)} fill={SKIN} stroke={SKIN_D} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
};
