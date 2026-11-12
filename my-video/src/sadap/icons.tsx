import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Flat icons for the "sadap" short. All generic: no real app, operator or agency logos.

const CASE = "#272C46";

// Jagged "kresek" waveform; jitters every 2 frames.
export const Crackle: React.FC<{ w?: number; color?: string }> = ({ w = 220, color = THEME.amber }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const pts = Array.from({ length: 13 }, (_, i) => {
    const r = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    const y = 50 + (r - Math.floor(r) - 0.5) * (i % 2 ? 80 : 30);
    return `${(i * 200) / 12},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={w / 2} viewBox="0 0 200 100" style={{ overflow: "visible" }}>
      <polyline points={pts} stroke="#000" strokeOpacity={0.2} strokeWidth={14} fill="none" strokeLinejoin="round" transform="translate(3 5)" />
      <polyline points={pts} stroke={color} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

// Phone seen from the front (only for diagram / close-up shots, never in a character's hand).
export const PhoneFront: React.FC<{ w: number; h: number; children?: React.ReactNode; screen?: string }> = ({ w, h, children, screen = "#F4F6FB" }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.14, background: CASE, boxShadow: "0 18px 0 rgba(0,0,0,0.22)" }}>
    <div style={{
      position: "absolute", left: w * 0.05, top: w * 0.05, right: w * 0.05, bottom: w * 0.05,
      borderRadius: w * 0.1, background: screen, overflow: "hidden",
    }}>
      {children}
    </div>
    <div style={{ position: "absolute", left: w / 2 - w * 0.04, top: w * 0.075, width: w * 0.08, height: w * 0.08, borderRadius: 99, background: CASE }} />
  </div>
);

// Cell tower with radiating signal arcs (operator, generic).
export const Tower: React.FC<{ w?: number; pulse?: number }> = ({ w = 220, pulse = 0 }) => (
  <svg width={w} height={w * 1.4} viewBox="0 0 200 280" style={{ overflow: "visible" }}>
    <ellipse cx={100} cy={272} rx={70} ry={9} fill="#000" opacity={0.2} />
    <path d="M100 40 L46 270 M100 40 L154 270 M70 170 L130 170 M60 215 L140 215 M80 110 L120 110 M70 170 L140 215 M130 170 L60 215 M80 110 L130 170 M120 110 L70 170"
      stroke={THEME.mint} strokeWidth={9} strokeLinecap="round" fill="none" />
    <rect x={84} y={52} width={14} height={44} rx={4} fill={THEME.paper} />
    <rect x={102} y={52} width={14} height={44} rx={4} fill={THEME.paper} />
    <circle cx={100} cy={34} r={12} fill={THEME.amber} />
    {[0, 1, 2].map((i) => {
      const r = 34 + i * 24 + pulse * 10;
      return (
        <g key={i} opacity={(1 - i * 0.28) * (0.5 + 0.5 * Math.cos(pulse * Math.PI * 2 + i))}>
          <path d={`M${100 - r} 34 A${r} ${r} 0 0 1 ${100 - r * 0.55} ${34 - r * 0.83}`} stroke={THEME.amber} strokeWidth={7} strokeLinecap="round" fill="none" />
          <path d={`M${100 + r} 34 A${r} ${r} 0 0 0 ${100 + r * 0.55} ${34 - r * 0.83}`} stroke={THEME.amber} strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      );
    })}
  </svg>
);

// Court-style building with a scales emblem (generic, no institution).
export const CourtHouse: React.FC<{ w?: number }> = ({ w = 240 }) => (
  <svg width={w} height={w} viewBox="0 0 240 240" style={{ overflow: "visible" }}>
    <ellipse cx={120} cy={232} rx={112} ry={9} fill="#000" opacity={0.2} />
    <path d="M10 82 L120 18 L230 82 Z" fill={THEME.paper} />
    <path d="M120 18 L230 82 L120 82 Z" fill="#000" opacity={0.08} />
    <rect x={18} y={82} width={204} height={16} fill={THEME.mint} />
    {[34, 76, 118, 160, 202].map((x) => <rect key={x} x={x - 10} y={98} width={20} height={106} fill={THEME.paper} />)}
    <rect x={10} y={204} width={220} height={22} rx={4} fill={THEME.mint} />
    {/* scales */}
    <path d="M120 36 L120 70 M100 46 L140 46" stroke={THEME.primaryDark} strokeWidth={5} strokeLinecap="round" />
    <path d="M92 47 L86 62 L98 62 Z M148 47 L142 62 L154 62 Z" fill={THEME.amber} />
  </svg>
);

// Sheet of paper with text lines and an "IZIN" stamp once `stamp` > 0.
export const Paper: React.FC<{ w?: number; stamp?: number }> = ({ w = 150, stamp = 0 }) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 120 150" style={{ overflow: "visible" }}>
    <rect x={4} y={6} width={112} height={142} rx={10} fill="#000" opacity={0.2} />
    <rect x={0} y={0} width={112} height={142} rx={10} fill={THEME.paper} />
    {[24, 40, 56, 72].map((y, i) => <rect key={y} x={16} y={y} width={i === 3 ? 50 : 80} height={7} rx={3.5} fill="#C9CFDB" />)}
    <g transform={`translate(70 112) rotate(-14) scale(${stamp})`} opacity={Math.min(1, stamp)}>
      <rect x={-38} y={-16} width={76} height={32} rx={6} fill="none" stroke={THEME.primary} strokeWidth={5} />
      <text x={0} y={9} textAnchor="middle" fontSize={22} fontWeight={900} fontFamily={THEME.font} fill={THEME.primary}>IZIN</text>
    </g>
  </svg>
);

// Spy eye inside a dark disc.
export const SpyEye: React.FC<{ w?: number; look?: number }> = ({ w = 120, look = 0 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={48} fill={THEME.navy} />
    <path d="M12 50 Q50 14 88 50 Q50 86 12 50 Z" fill={THEME.paper} />
    <circle cx={50 + look * 12} cy={50} r={17} fill={THEME.amber} />
    <circle cx={50 + look * 12} cy={50} r={8} fill={THEME.ink} />
    <circle cx={45 + look * 12} cy={45} r={4} fill={THEME.paper} />
  </svg>
);

// Pointing hand (tap) with a "no" ring over it.
export const NoTap: React.FC<{ w?: number; ring?: number }> = ({ w = 150, ring = 1 }) => (
  <svg width={w} height={w} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
    <g transform="translate(36 22)">
      <rect x={14} y={0} width={18} height={56} rx={9} fill="#F6D2B0" />
      <rect x={0} y={40} width={56} height={52} rx={22} fill="#F6D2B0" />
      <rect x={30} y={40} width={26} height={52} rx={13} fill="#E3B48E" opacity={0.6} />
    </g>
    <circle cx={60} cy={60} r={54} fill="none" stroke={THEME.amber} strokeWidth={10} strokeDasharray={`${340 * ring} 400`} transform="rotate(-90 60 60)" />
    <path d="M22 98 L98 22" stroke={THEME.amber} strokeWidth={10} strokeLinecap="round" opacity={ring > 0.95 ? 1 : 0} />
  </svg>
);

// Round avatar: "mic" = journalist, "mega" = activist. Generic people, not real persons.
export const Avatar: React.FC<{ w?: number; kind: "mic" | "mega"; shirt: string }> = ({ w = 240, kind, shirt }) => (
  <svg width={w} height={w} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <circle cx={100} cy={100} r={96} fill={THEME.paper} />
    <clipPath id={`av-${kind}`}><circle cx={100} cy={100} r={96} /></clipPath>
    <g clipPath={`url(#av-${kind})`}>
      <rect x={40} y={150} width={120} height={80} rx={50} fill={shirt} />
      <circle cx={100} cy={100} r={52} fill="#F6D2B0" />
      {kind === "mic" ? (
        <path d="M48 104 C40 30 160 30 152 100 L140 80 L120 92 L100 70 L80 92 L60 80 Z" fill="#23202B" />
      ) : (
        <path d="M46 110 C30 26 170 26 154 110 C150 80 130 60 100 62 C70 60 50 80 46 110 Z" fill="#5B3A29" />
      )}
      {[82, 118].map((x) => <circle key={x} cx={x} cy={106} r={6} fill={THEME.ink} />)}
      <path d="M90 128 Q100 136 110 128" stroke="#7A3B3B" strokeWidth={5} strokeLinecap="round" fill="none" />
    </g>
    {kind === "mic" ? (
      <g transform="translate(150 120) rotate(20)">
        <rect x={-6} y={0} width={12} height={56} rx={6} fill={THEME.ink} />
        <circle cx={0} cy={-6} r={18} fill="#9AA6B8" />
        <rect x={-14} y={14} width={28} height={14} rx={4} fill={THEME.amber} />
      </g>
    ) : (
      <g transform="translate(140 118) rotate(-18)">
        <path d="M0 0 L60 -26 L60 34 L0 12 Z" fill={THEME.amber} />
        <rect x={-14} y={-4} width={18} height={22} rx={5} fill={THEME.orangeDark} />
        <rect x={-4} y={14} width={10} height={26} rx={5} fill={THEME.ink} />
      </g>
    )}
  </svg>
);

// Crosshair ring that rotates in and locks.
export const Crosshair: React.FC<{ w?: number; spin?: number; color?: string }> = ({ w = 300, spin = 0, color = THEME.amber }) => (
  <svg width={w} height={w} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <g transform={`rotate(${spin} 100 100)`}>
      <circle cx={100} cy={100} r={92} fill="none" stroke={color} strokeWidth={8} strokeDasharray="110 34" />
      {[0, 90, 180, 270].map((r) => (
        <rect key={r} x={96} y={-4} width={8} height={30} rx={4} fill={color} transform={`rotate(${r} 100 100)`} />
      ))}
    </g>
  </svg>
);

export const Battery: React.FC<{ w?: number; level?: number }> = ({ w = 120, level = 0.12 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <rect x={14} y={28} width={64} height={44} rx={10} fill="none" stroke={THEME.ink} strokeWidth={7} />
    <rect x={80} y={42} width={8} height={16} rx={3} fill={THEME.ink} />
    <rect x={22} y={36} width={48 * level} height={28} rx={5} fill={THEME.amber} />
  </svg>
);

export const Thermo: React.FC<{ w?: number }> = ({ w = 120 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <rect x={40} y={10} width={20} height={58} rx={10} fill="none" stroke={THEME.ink} strokeWidth={7} />
    <circle cx={50} cy={74} r={16} fill={THEME.orange} stroke={THEME.ink} strokeWidth={7} />
    <rect x={46} y={30} width={8} height={40} rx={4} fill={THEME.orange} />
    {[-1, 1].map((d) => (
      <path key={d} d={`M${50 + d * 30} 26 q${d * 6} 8 0 16 q${-d * 6} 8 0 16`} stroke={THEME.orange} strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
  </svg>
);

export const WaveIcon: React.FC<{ w?: number }> = ({ w = 120 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <path d="M8 50 L22 50 L30 30 L40 72 L50 22 L60 70 L68 38 L76 50 L92 50" stroke={THEME.ink} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" fill="none" />
  </svg>
);

// Malware bug.
export const Bug: React.FC<{ w?: number }> = ({ w = 160 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    {[30, 50, 70].map((y) => (
      <g key={y} stroke={THEME.ink} strokeWidth={6} strokeLinecap="round">
        <path d={`M30 ${y} L12 ${y - 8}`} />
        <path d={`M70 ${y} L88 ${y - 8}`} />
      </g>
    ))}
    <path d="M40 18 L32 6 M60 18 L68 6" stroke={THEME.ink} strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={50} cy={56} rx={26} ry={34} fill={THEME.amber} stroke={THEME.ink} strokeWidth={6} />
    <path d="M50 26 L50 88" stroke={THEME.ink} strokeWidth={5} />
    <circle cx={50} cy={24} r={14} fill={THEME.ink} />
  </svg>
);

// "Shield 2" = two-step verification.
export const Shield: React.FC<{ w?: number }> = ({ w = 120 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <path d="M50 8 L86 22 L84 52 C82 74 66 88 50 94 C34 88 18 74 16 52 L14 22 Z" fill={THEME.teal} />
    <path d="M50 8 L86 22 L84 52 C82 74 66 88 50 94 Z" fill="#000" opacity={0.12} />
    <text x={50} y={66} textAnchor="middle" fontSize={44} fontWeight={900} fontFamily={THEME.font} fill={THEME.paper}>2</text>
  </svg>
);

export const ApkFile: React.FC<{ w?: number; no?: boolean }> = ({ w = 120, no }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path d="M24 8 L62 8 L80 26 L80 92 L24 92 Z" fill={THEME.paper} stroke={THEME.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M62 8 L62 26 L80 26" fill="none" stroke={THEME.ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={30} y={52} width={44} height={24} rx={6} fill={THEME.teal} />
    <text x={52} y={70} textAnchor="middle" fontSize={16} fontWeight={900} fontFamily={THEME.font} fill={THEME.paper}>APK</text>
    {no ? (
      <g>
        <circle cx={52} cy={50} r={46} fill="none" stroke={THEME.amber} strokeWidth={8} />
        <path d="M20 82 L84 18" stroke={THEME.amber} strokeWidth={8} strokeLinecap="round" />
      </g>
    ) : null}
  </svg>
);

export const OtpLock: React.FC<{ w?: number }> = ({ w = 120 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <rect x={8} y={30} width={84} height={44} rx={12} fill={THEME.navy} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={26 + i * 16} cy={52} r={5} fill={THEME.paper} />)}
    <path d="M64 30 L64 20 C64 8 86 8 86 20 L86 30" stroke={THEME.amber} strokeWidth={7} fill="none" />
    <rect x={58} y={28} width={34} height={28} rx={6} fill={THEME.amber} />
  </svg>
);
