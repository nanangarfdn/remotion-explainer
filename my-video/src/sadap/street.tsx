import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Daytime street drawn straight in portrait px (no World camera): sky → skyline → pavement, and a hedge
// that goes IN FRONT of the characters so their torsos end behind it. Sun top-right → lightFrom="right".
const CLOUDS: [number, number, number][] = [[80, 330, 1.1], [620, 230, 0.8], [1150, 420, 1], [1500, 300, 0.7]];
const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.92}>
    <ellipse cx={0} cy={0} rx={90} ry={42} />
    <ellipse cx={-60} cy={14} rx={60} ry={30} />
    <ellipse cx={70} cy={16} rx={70} ry={30} />
    <ellipse cx={10} cy={-30} rx={56} ry={40} />
  </g>
);

// Back layer: sky, sun, drifting clouds, skyline. `w` = world width (pans wider than 1080).
export const StreetBack: React.FC<{ w?: number }> = ({ w = 1080 }) => {
  const f = useCurrentFrame();
  const B: [number, number, number, string][] = [];
  for (let x = -40, i = 0; x < w + 40; i++) {
    const bw = 110 + ((i * 53) % 90);
    B.push([x, bw, 220 + ((i * 97) % 260), i % 2 ? "#A9A3F0" : "#9890E6"]);
    x += bw + 14;
  }
  return (
    <svg width={w} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="daysky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA8F5" />
          <stop offset="1" stopColor="#DCE7FF" />
        </linearGradient>
      </defs>
      <rect width={w} height={1920} fill="url(#daysky)" />
      <circle cx={w - 230} cy={200} r={110} fill="#FFF2B8" opacity={0.6} />
      <circle cx={w - 230} cy={200} r={80} fill="#FFE07A" />
      {CLOUDS.map(([x, y, s], i) => (
        <Cloud key={i} x={((x + f * (0.5 + i * 0.2)) % (w + 400)) - 200} y={y} s={s} />
      ))}
      {B.map(([x, bw, h, c]) => (
        <g key={x}>
          <rect x={x} y={1050 - h} width={bw} height={h} rx={6} fill={c} />
          {Array.from({ length: Math.floor((h - 30) / 46) }).flatMap((_, r) =>
            Array.from({ length: Math.floor((bw - 20) / 34) }).map((__, c2) => (
              <rect key={`${r}-${c2}`} x={x + 16 + c2 * 34} y={1050 - h + 22 + r * 46} width={18} height={24} rx={3}
                fill="#E6ECFF" opacity={(r + c2 + x) % 3 ? 0.55 : 0.9} />
            )),
          )}
        </g>
      ))}
      {/* pavement */}
      <rect x={0} y={1040} width={w} height={880} fill="#CFCBE3" />
      <rect x={0} y={1040} width={w} height={16} fill="#B5B0D2" />
      {Array.from({ length: Math.ceil(w / 160) }).map((_, i) => (
        <rect key={i} x={i * 160} y={1056} width={4} height={864} fill="#B9B4D6" />
      ))}
    </svg>
  );
};

// Front layer: a row of bushes (tops ≈ y `top`) that hides the characters' waists.
export const Hedge: React.FC<{ w?: number; top?: number }> = ({ w = 1080, top = 1050 }) => {
  const f = useCurrentFrame();
  const n = Math.ceil(w / 150) + 2;
  return (
    <svg width={w} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={-100} y={top + 70} width={w + 200} height={1920} fill="#2F8F5A" />
      {Array.from({ length: n }).map((_, i) => {
        const sway = Math.sin(f / 18 + i) * 3;
        const x = -60 + i * 150;
        return (
          <g key={i} transform={`translate(${sway} 0)`}>
            <ellipse cx={x} cy={top + 80 + (i % 2) * 14} rx={110} ry={90} fill={i % 2 ? "#3FA66B" : "#379A62"} />
            <ellipse cx={x - 30} cy={top + 50 + (i % 2) * 14} rx={36} ry={22} fill="#fff" opacity={0.12} />
          </g>
        );
      })}
      <rect x={-100} y={top + 150} width={w + 200} height={30} fill="#000" opacity={0.08} />
    </svg>
  );
};

// Props drawn inside a Chibi with pose="hold" (hands meet at viewBox ≈ 200,466).
export const Mic: React.FC = () => (
  <g>
    <rect x={191} y={392} width={18} height={96} rx={8} fill="#2B2F3A" />
    <rect x={180} y={420} width={40} height={30} rx={6} fill={THEME.teal} />
    <circle cx={200} cy={380} r={28} fill="#5A5F73" />
    {[-12, 0, 12].map((d) => <path key={d} d={`M${186} ${380 + d} L${214} ${380 + d}`} stroke="#3A3F52" strokeWidth={3} />)}
  </g>
);
export const Megaphone: React.FC<{ shout?: number }> = ({ shout = 0 }) => (
  <g>
    <rect x={204} y={456} width={16} height={40} rx={6} fill="#2B2F3A" />
    <path d="M196 428 L320 384 L320 506 L196 470 Z" fill={THEME.amber} />
    <path d="M196 428 L320 384 L320 410 L196 440 Z" fill="#fff" opacity={0.25} />
    <ellipse cx={320} cy={445} rx={14} ry={61} fill="#E09A12" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${350 + i * 26} ${410 - i * 10} Q${372 + i * 30} 445 ${350 + i * 26} ${480 + i * 10}`}
        stroke={THEME.amber} strokeWidth={8} strokeLinecap="round" fill="none" opacity={shout * (0.9 - i * 0.25)} />
    ))}
  </g>
);
