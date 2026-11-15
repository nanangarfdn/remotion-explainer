import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Portrait (1080×1920) sets + foregrounds for Jujur. Floor line y 1250 (same as kucing9 Room).
const full = { position: "absolute", left: 0, top: 0 } as const;

// ── space + earth (hook) ──
const LAND = [
  "M40 120 q60 -70 140 -30 q50 40 10 90 q-60 30 -80 90 q-50 20 -70 -40 q-30 -60 0 -110 Z",
  "M260 60 q70 -30 120 20 q20 60 -40 80 q-30 60 -90 30 q-40 -70 10 -130 Z",
  "M200 260 q50 -10 70 40 q10 70 -40 110 q-40 -20 -50 -80 q0 -50 20 -70 Z",
  "M420 220 q60 -20 90 30 q0 50 -60 60 q-50 -30 -30 -90 Z",
];
export const Space: React.FC<{ spin: number }> = ({ spin }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={full}>
      <defs>
        <radialGradient id="jsp" cx="50%" cy="40%" r="75%"><stop offset="0" stopColor="#2C3570" /><stop offset="1" stopColor="#0E1230" /></radialGradient>
        <radialGradient id="jsea" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#5FC3F5" /><stop offset="1" stopColor="#1C6FB8" /></radialGradient>
        <radialGradient id="jatm" cx="50%" cy="50%" r="50%"><stop offset="0.82" stopColor="#8FD8FF" stopOpacity={0} /><stop offset="1" stopColor="#8FD8FF" stopOpacity={0.45} /></radialGradient>
        <clipPath id="jglobe"><circle cx={540} cy={800} r={250} /></clipPath>
      </defs>
      <rect width={1080} height={1920} fill="url(#jsp)" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 197) % 1080;
        const y = (i * 331) % 1920;
        return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 15 + i))} />;
      })}
      <circle cx={540} cy={800} r={300} fill="url(#jatm)" />
      <circle cx={540} cy={800} r={250} fill="url(#jsea)" />
      <g clipPath="url(#jglobe)">
        {[-1, 0, 1].map((k) => (
          <g key={k} transform={`translate(${290 + ((spin % 600) + k * 600) - 300} 560)`}>
            {LAND.map((d, i) => <path key={i} d={d} fill={i % 2 ? "#4FAE62" : "#5DBE6D"} />)}
          </g>
        ))}
        <ellipse cx={460} cy={700} rx={190} ry={150} fill="#fff" opacity={0.12} />
        <circle cx={640} cy={900} r={250} fill="#0B2A55" opacity={0.25} />
      </g>
      {[0, 1, 2].map((k) => <ellipse key={k} cx={420 + k * 160 + ((f * 1.5) % 200)} cy={640 + k * 130} rx={70} ry={14} fill="#fff" opacity={0.55} />)}
    </svg>
  );
};

// ── sofa seen from behind: characters stand behind it, it hides the bust's cut-off ──
export const SofaBack: React.FC<{ top?: number; color?: string; dark?: string }> = ({ top = 1140, color = "#2FA393", dark = "#1F7F72" }) => (
  <svg width={1080} height={1920} style={full}>
    <ellipse cx={540} cy={top + 360} rx={540} ry={40} fill="#000" opacity={0.2} />
    <rect x={30} y={top} width={1020} height={340} rx={70} fill={color} />
    <rect x={30} y={top + 250} width={1020} height={90} rx={30} fill={dark} />
    <path d={`M90 ${top + 26} Q540 ${top - 6} 990 ${top + 26}`} stroke="#fff" strokeWidth={10} opacity={0.18} fill="none" strokeLinecap="round" />
    {[360, 720].map((x) => <rect key={x} x={x - 3} y={top + 30} width={6} height={210} rx={3} fill={dark} opacity={0.5} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={120 + i * 168} cy={top + 140} r={6} fill={dark} opacity={0.6} />)}
  </svg>
);

// ── open front door on the left wall, daylight garden outside ──
export const Door: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <rect x={90} y={500} width={420} height={716} fill="#7D5638" />
    <rect x={112} y={522} width={376} height={694} fill="#A9DDF7" />
    <rect x={112} y={980} width={376} height={236} fill="#6FBF6A" />
    <ellipse cx={200} cy={980} rx={110} ry={70} fill="#4E9E5A" />
    <ellipse cx={420} cy={990} rx={90} ry={60} fill="#5DB168" />
    <path d="M250 1216 L350 1216 L420 980 L300 980 Z" fill="#E9D8B4" />
    <ellipse cx={360} cy={620} rx={60} ry={20} fill="#fff" opacity={0.9} />
    {/* door leaf swung inward */}
    <path d="M488 522 L560 560 L560 1180 L488 1216 Z" fill="#9A6B45" />
    <circle cx={548} cy={880} r={8} fill="#E3B341" />
    <rect x={60} y={1216} width={480} height={20} fill="#5E4029" />
  </svg>
);

// ── office: blinds, wall screen, plant; the meeting table is a separate foreground ──
export const Office: React.FC<{ email: number }> = ({ email }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={full}>
      <defs>
        <linearGradient id="jow" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stopColor="#E3E8F2" /><stop offset="1" stopColor="#C9D1E3" /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#jow)" />
      {/* window with blinds (right) */}
      <rect x={760} y={260} width={290} height={620} fill="#9FD3F2" />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={760} y={262 + i * 28} width={290} height={16} fill="#F4F6FA" opacity={0.92} />)}
      <rect x={750} y={250} width={310} height={640} fill="none" stroke="#F8F9FC" strokeWidth={16} />
      {/* wall screen */}
      <rect x={110} y={300} width={600} height={360} rx={18} fill="#22283F" />
      <rect x={126} y={316} width={568} height={328} rx={8} fill={THEME.paper} />
      <g opacity={1 - email}>
        <rect x={150} y={340} width={520} height={60} rx={10} fill={THEME.primary} />
        <text x={410} y={382} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={36} fill="#fff">MEETING PENTING!</text>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={190 + i * 90} y={600 - (60 + ((i * 47) % 110))} width={56} height={60 + ((i * 47) % 110)} fill={[THEME.teal, THEME.amber, THEME.primary, THEME.orange, THEME.teal][i]} />)}
        <rect x={170} y={600} width={480} height={5} fill="#22283F" />
      </g>
      <g opacity={email} transform={`translate(410 470) scale(${0.6 + 0.4 * email}) translate(-410 -470)`}>
        <rect x={300} y={370} width={220} height={150} rx={14} fill={THEME.amber} />
        <path d="M300 384 L410 460 L520 384" stroke="#fff" strokeWidth={14} fill="none" strokeLinejoin="round" />
        <text x={410} y={590} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={38} fill={THEME.ink}>cukup lewat email</text>
      </g>
      {/* clock + plant */}
      <circle cx={900} cy={1000} r={0} />
      <path d="M40 1150 l14 -70 h80 l14 70 Z" fill="#C9744A" />
      {[-40, -14, 12, 36, -26, 24].map((dx, i) => <ellipse key={i} cx={94 + dx} cy={1010 - (i % 3) * 40} rx={18} ry={52} fill={i % 2 ? "#3E8E4E" : "#57A862"} transform={`rotate(${dx + Math.sin(f / 40 + i) * 3} ${94 + dx} ${1060})`} />)}
      <rect x={0} y={1180} width={1080} height={740} fill="#9AA4BC" />
    </svg>
  );
};

// meeting table (foreground): top edge + front panel, backs of laptops, mugs
export const Table: React.FC<{ top?: number }> = ({ top = 1160 }) => (
  <svg width={1080} height={1920} style={full}>
    <path d={`M-20 ${top} L1100 ${top} L1100 ${top + 70} L-20 ${top + 70} Z`} fill="#8A5A3A" />
    <rect x={-20} y={top} width={1120} height={12} fill="#fff" opacity={0.18} />
    <rect x={-20} y={top + 70} width={1120} height={700} fill="#6E4428" />
    <rect x={-20} y={top + 70} width={1120} height={20} fill="#000" opacity={0.2} />
    {[230, 790].map((x) => (
      <g key={x}>
        <path d={`M${x - 110} ${top + 10} L${x + 110} ${top + 10} L${x + 100} ${top - 140} L${x - 100} ${top - 140} Z`} fill="#3A4060" />
        <circle cx={x} cy={top - 70} r={14} fill="#fff" opacity={0.25} />
      </g>
    ))}
    <rect x={500} y={top - 70} width={70} height={80} rx={10} fill="#F7F3EA" />
    <path d={`M570 ${top - 50} q30 0 30 25 q0 25 -30 25`} stroke="#F7F3EA" strokeWidth={10} fill="none" />
  </svg>
);

// study desk (foreground) with a lamp on it
export const Desk: React.FC<{ top?: number }> = ({ top = 1180 }) => (
  <svg width={1080} height={1920} style={full}>
    <defs>
      <radialGradient id="jlamp" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFD58A" stopOpacity={0.5} /><stop offset="1" stopColor="#FFD58A" stopOpacity={0} /></radialGradient>
    </defs>
    <circle cx={880} cy={top - 80} r={300} fill="url(#jlamp)" />
    <rect x={-20} y={top} width={1120} height={60} fill="#7D5638" />
    <rect x={-20} y={top} width={1120} height={10} fill="#fff" opacity={0.15} />
    <rect x={-20} y={top + 60} width={1120} height={700} fill="#5E4029" />
    <rect x={840} y={top - 20} width={90} height={24} rx={8} fill="#2E3350" />
    <path d={`M880 ${top - 20} L840 ${top - 180} L900 ${top - 240}`} stroke="#2E3350" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d={`M870 ${top - 270} L960 ${top - 260} L940 ${top - 200} Z`} fill={THEME.amber} />
    {[0, 1, 2].map((i) => <rect key={i} x={80 + i * 14} y={top - 120 + i * 40} width={180} height={36} rx={4} fill={[THEME.primary, THEME.teal, THEME.orange][i]} />)}
  </svg>
);

// bed: headboard behind the sitter, duvet in front
export const BedBack: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <rect x={160} y={740} width={760} height={520} rx={60} fill="#6B4A32" />
    <rect x={190} y={770} width={700} height={460} rx={40} fill="#7E5A3E" />
    <rect x={220} y={820} width={250} height={170} rx={60} fill="#EDEFF7" transform="rotate(-6 345 905)" />
    <rect x={610} y={820} width={250} height={170} rx={60} fill="#E2E5F0" transform="rotate(6 735 905)" />
  </svg>
);
export const Duvet: React.FC<{ top?: number }> = ({ top = 1170 }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 22) * 4;
  return (
    <svg width={1080} height={1920} style={full}>
      <path d={`M100 ${top + 40 + b} Q300 ${top - 20 + b} 540 ${top + 10 + b} Q780 ${top + 40} 980 ${top - 10} L1040 1920 L40 1920 Z`} fill="#7C6BD6" />
      <path d={`M100 ${top + 40 + b} Q300 ${top - 20 + b} 540 ${top + 10 + b} Q780 ${top + 40} 980 ${top - 10}`} stroke="#fff" strokeWidth={12} opacity={0.25} fill="none" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={200 + i * 220} cy={top + 200 + (i % 2) * 60} r={16} fill="#FFE3A3" opacity={0.7} />)}
      <path d={`M300 ${top + 120} q120 40 240 0 q120 -40 240 0`} stroke="#5E4C8F" strokeWidth={8} fill="none" opacity={0.5} />
    </svg>
  );
};

// police-style line-up wall with height marks (CTA)
export const Lineup: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <rect width={1080} height={1920} fill="#D9DEEA" />
    {Array.from({ length: 13 }).map((_, i) => {
      const y = 260 + i * 60;
      return (
        <g key={i}>
          <rect x={0} y={y} width={1080} height={i % 2 ? 2 : 5} fill="#7A8399" />
          {i % 2 ? null : <text x={20} y={y - 10} fontFamily={THEME.font} fontWeight={900} fontSize={30} fill="#7A8399">{200 - i * 10}</text>}
        </g>
      );
    })}
    <rect x={0} y={1040} width={1080} height={880} fill="#3B4260" />
    <rect x={0} y={1040} width={1080} height={14} fill="#000" opacity={0.2} />
  </svg>
);
