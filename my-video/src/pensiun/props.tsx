import React from "react";
import { THEME } from "../explainer/kit";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0 };
const GOLD = "#D8A93B";

// Stately office seen from the front: navy wall, tall windows with gold drapes, panelled wainscot, green carpet.
export const StateRoom: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <defs>
      <linearGradient id="srwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34417A" /><stop offset="1" stopColor="#252F5C" /></linearGradient>
      <linearGradient id="srsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE0F5" /><stop offset="1" stopColor="#EAF5FC" /></linearGradient>
      <linearGradient id="srfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2F5D50" /><stop offset="1" stopColor="#23473D" /></linearGradient>
    </defs>
    <rect width={1080} height={1200} fill="url(#srwall)" />
    {[60, 720].map((x) => (
      <g key={x}>
        <rect x={x + 30} y={240} width={240} height={600} rx={120} fill="url(#srsky)" />
        <path d={`M${x + 150} 240 V840 M${x + 30} 520 H${x + 270}`} stroke="#fff" strokeWidth={10} opacity={0.8} />
        <ellipse cx={x + 110} cy={700} rx={60} ry={30} fill="#fff" opacity={0.6} />
        {/* drapes */}
        <path d={`M${x} 200 Q${x + 40} 520 ${x + 10} 880 L${x + 70} 880 Q${x + 90} 520 ${x + 60} 200 Z`} fill={GOLD} />
        <path d={`M${x + 300} 200 Q${x + 260} 520 ${x + 290} 880 L${x + 230} 880 Q${x + 210} 520 ${x + 240} 200 Z`} fill={GOLD} />
        <rect x={x - 10} y={186} width={320} height={22} rx={11} fill="#8C6420" />
      </g>
    ))}
    <rect y={930} width={1080} height={270} fill="#1D2650" />
    <rect y={926} width={1080} height={8} fill={GOLD} opacity={0.8} />
    {[40, 300, 560, 820].map((x) => <rect key={x} x={x} y={960} width={220} height={200} rx={10} fill="none" stroke={GOLD} strokeOpacity={0.35} strokeWidth={4} />)}
    <rect y={1200} width={1080} height={720} fill="url(#srfloor)" />
    <rect x={40} y={1240} width={1000} height={680} fill="none" stroke={GOLD} strokeOpacity={0.4} strokeWidth={8} />
  </svg>
);

// High-backed official chair, front view, drawn around its back's centre. `turn` (deg) fakes a swivel.
export const VpChair: React.FC<{ x: number; y: number; w?: number; turn?: number }> = ({ x, y, w = 420, turn = 0 }) => {
  const k = w / 420;
  const sx = Math.cos((turn * Math.PI) / 180);
  return (
    <svg width={500 * k} height={720 * k} viewBox="0 0 500 720" style={{ position: "absolute", left: x - 250 * k, top: y - 300 * k, transform: `scaleX(${Math.max(0.15, Math.abs(sx))})`, overflow: "visible" }}>
      <ellipse cx={250} cy={700} rx={200} ry={18} fill="#000" opacity={0.18} />
      <rect x={30} y={0} width={440} height={600} rx={90} fill="#6B3F22" stroke={GOLD} strokeWidth={8} />
      <rect x={58} y={28} width={384} height={560} rx={70} fill={sx < 0 ? "#3A2414" : "#F1E2C4"} />
      {sx >= 0 ? [0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={150 + c * 100} cy={150 + r * 110} r={9} fill="#C2A878" />)) : null}
      <path d="M58 98 Q250 40 442 98" stroke="#fff" strokeOpacity={0.5} strokeWidth={14} fill="none" />
      {sx >= 0 ? (
        <g transform="translate(250 -6)">
          <circle r={46} fill={GOLD} stroke="#8C6420" strokeWidth={6} />
          <path d="M0 -26 L7.6 -8 L27 -8 L11.5 4 L17 23 L0 12 L-17 23 L-11.5 4 L-27 -8 L-7.6 -8 Z" fill="#fff" />
        </g>
      ) : null}
      <rect x={10} y={420} width={60} height={200} rx={26} fill="#5A3319" />
      <rect x={430} y={420} width={60} height={200} rx={26} fill="#5A3319" />
      <rect x={40} y={560} width={420} height={70} rx={30} fill="#E0CBA2" />
      <rect x={235} y={630} width={30} height={60} fill="#3A3A44" />
    </svg>
  );
};

// Desk front with a nameplate; its top edge sits at `top`.
export const Desk: React.FC<{ top?: number; plate?: string; plateX?: number }> = ({ top = 1180, plate = "WAKIL PRESIDEN", plateX = 540 }) => (
  <svg width={1080} height={1920} style={full}>
    <rect x={-20} y={top} width={1120} height={360} fill="#6B3F22" />
    <rect x={-20} y={top - 14} width={1120} height={26} rx={6} fill="#8A5530" />
    <rect x={-20} y={top + 12} width={1120} height={10} fill="#000" opacity={0.15} />
    {[60, 580].map((x) => <rect key={x} x={x} y={top + 60} width={440} height={240} rx={14} fill="none" stroke={GOLD} strokeOpacity={0.5} strokeWidth={5} />)}
    {plate ? <g transform={`translate(${plateX} ${top - 46})`}>
      <path d="M-200 46 L-180 -10 L180 -10 L200 46 Z" fill="#14161C" />
      <text y={26} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={36} fill={GOLD} letterSpacing={3}>{plate}</text>
    </g> : null}
  </svg>
);

// Generic pink banknote (not a real design), drawn centred.
export const Note: React.FC<{ x: number; y: number; rot?: number; w?: number }> = ({ x, y, rot = 0, w = 220 }) => (
  <svg width={w} height={w * 0.48} viewBox="0 0 220 106" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.24, transform: `rotate(${rot}deg)` }}>
    <rect width={220} height={106} rx={8} fill="#F4A8C6" stroke="#C9688F" strokeWidth={4} />
    <rect x={12} y={12} width={196} height={82} rx={6} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
    <circle cx={160} cy={53} r={28} fill="#fff" opacity={0.45} />
    <text x={22} y={50} fontFamily={THEME.font} fontWeight={900} fontSize={34} fill="#8E3A61">100</text>
    <text x={22} y={80} fontFamily={THEME.font} fontWeight={800} fontSize={18} fill="#8E3A61">RIBU</text>
  </svg>
);

// Brown envelope; `front` draws only the front pocket (put it above the notes so they slip inside).
export const Envelope: React.FC<{ x: number; y: number; front?: boolean; fat?: number }> = ({ x, y, front, fat = 0 }) => (
  <svg width={380} height={300} viewBox="0 0 380 300" style={{ position: "absolute", left: x - 190, top: y - 150, overflow: "visible" }}>
    {!front ? (
      <>
        <ellipse cx={190} cy={290} rx={190} ry={14} fill="#000" opacity={0.2} />
        <rect x={0} y={60 - fat * 20} width={380} height={230 + fat * 20} rx={12} fill="#B9803F" />
        <path d={`M0 ${70 - fat * 20} L190 ${-20 - fat * 20} L380 ${70 - fat * 20} Z`} fill="#A86F33" />
      </>
    ) : (
      <>
        <path d="M0 120 L190 220 L380 120 L380 280 Q380 290 370 290 L10 290 Q0 290 0 280 Z" fill="#D9A066" />
        <path d="M0 120 L190 220 L380 120" stroke="#B9803F" strokeWidth={6} fill="none" />
      </>
    )}
  </svg>
);

// Thick old law book, front cover facing the camera.
export const LawBook: React.FC<{ x: number; y: number; w?: number; rot?: number }> = ({ x, y, w = 520, rot = 0 }) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 520 600" style={{ position: "absolute", left: x - w / 2, top: y - w * 1.15, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", overflow: "visible" }}>
    <rect x={30} y={40} width={470} height={560} rx={14} fill="#EFE6D2" />
    {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={40} x2={490} y1={560 + i * 6} y2={560 + i * 6} stroke="#CDBF9F" strokeWidth={2} />)}
    <rect x={0} y={20} width={470} height={560} rx={14} fill="#5B3A22" />
    <rect x={0} y={20} width={60} height={560} rx={14} fill="#4A2E1A" />
    <rect x={90} y={90} width={340} height={400} rx={10} fill="none" stroke={GOLD} strokeWidth={6} />
    <text x={260} y={190} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={44} fill={GOLD}>UNDANG-</text>
    <text x={260} y={240} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={44} fill={GOLD}>UNDANG</text>
    <text x={260} y={330} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={56} fill="#fff">No. 7</text>
    <text x={260} y={420} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={80} fill={GOLD}>1978</text>
    {/* dust + cobweb */}
    <path d="M0 40 Q40 50 50 90 M0 60 Q25 65 30 90 M0 40 L60 110" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.5} fill="none" />
    <rect x={0} y={20} width={470} height={560} rx={14} fill="#fff" opacity={0.1} />
  </svg>
);

// Calculator with a two-line display.
export const Calc: React.FC<{ x: number; y: number; top: string; main: string }> = ({ x, y, top, main }) => (
  <div style={{ position: "absolute", left: x - 300, top: y, width: 600, height: 300, borderRadius: 40, background: "#2B2F3A", boxShadow: "0 14px 0 rgba(0,0,0,0.3)", padding: 30, boxSizing: "border-box" }}>
    <div style={{ background: "#CFE8C9", borderRadius: 18, height: 240, padding: "16px 26px", boxSizing: "border-box", fontFamily: THEME.font, color: "#1E2A1C", textAlign: "right" }}>
      <div style={{ fontSize: 46, fontWeight: 800, opacity: 0.7, height: 60 }}>{top}</div>
      <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.4, whiteSpace: "nowrap" }}>{main}</div>
    </div>
  </div>
);

// A4 letter seen from above at a slight angle.
export const Letter: React.FC<{ x: number; y: number; title: string; rot?: number }> = ({ x, y, title, rot = -4 }) => (
  <div style={{ position: "absolute", left: x - 330, top: y, width: 660, height: 860, background: "#FBFAF6", borderRadius: 10, transform: `rotate(${rot}deg)`, boxShadow: "0 18px 30px rgba(0,0,0,0.25)", padding: "70px 60px", boxSizing: "border-box", fontFamily: THEME.font }}>
    <div style={{ fontSize: 40, fontWeight: 900, color: THEME.ink, textAlign: "center", lineHeight: 1.2 }}>{title}</div>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 14, borderRadius: 7, background: "#DADCE3", marginTop: i ? 34 : 70, width: `${[100, 92, 96, 80, 100, 88, 94, 60, 40][i]}%` }} />)}
  </div>
);

// Rubber stamp (handle + base) drawn by its contact point.
export const RubberStamp: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: x - 150, top: y - 420 }}>
    <ellipse cx={150} cy={70} rx={70} ry={66} fill="#7A4A2A" />
    <rect x={128} y={110} width={44} height={170} rx={14} fill="#8A5530" />
    <rect x={30} y={270} width={240} height={110} rx={16} fill="#5A3319" />
    <rect x={20} y={372} width={260} height={48} rx={8} fill={THEME.primaryDark} />
  </svg>
);

// Judge's gavel, rotating around the far end of its handle (pivot at x,y).
export const Gavel: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <svg width={600} height={600} viewBox="-300 -300 600 600" style={{ position: "absolute", left: x - 40, top: y - 300, transform: `rotate(${rot}deg)`, transformOrigin: "40px 300px", overflow: "visible" }}>
    <rect x={-260} y={-14} width={300} height={28} rx={14} fill="#8A5530" />
    <rect x={10} y={-70} width={90} height={140} rx={20} fill="#6B3F22" />
    <rect x={10} y={-70} width={18} height={140} fill={GOLD} />
    <rect x={82} y={-70} width={18} height={140} fill={GOLD} />
  </svg>
);

export const House: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 560 }) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 560 500" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.9 }}>
    <ellipse cx={280} cy={492} rx={270} ry={14} fill="#000" opacity={0.2} />
    <rect x={60} y={210} width={440} height={280} fill="#F3EBDD" />
    <path d="M20 230 L280 40 L540 230 Z" fill={THEME.primary} />
    <rect x={380} y={70} width={50} height={110} fill={THEME.primaryDark} />
    <rect x={230} y={330} width={100} height={160} rx={8} fill="#8A5530" />
    {[110, 390].map((wx) => <rect key={wx} x={wx} y={280} width={70} height={70} rx={6} fill="#BFE0F5" stroke="#fff" strokeWidth={8} />)}
  </svg>
);

// Round utility icon: bolt / drop / phone.
export const Utility: React.FC<{ kind: "bolt" | "drop" | "phone"; x: number; y: number; s?: number }> = ({ kind, x, y, s = 1 }) => {
  const bg = { bolt: THEME.amber, drop: "#3BA7E6", phone: THEME.teal }[kind];
  const d = {
    bolt: "M8 -40 L-22 6 L0 6 L-8 40 L24 -8 L2 -8 Z",
    drop: "M0 -40 C16 -16 28 0 28 14 A28 28 0 0 1 -28 14 C-28 0 -16 -16 0 -40 Z",
    phone: "M-22 -34 Q-30 -34 -30 -26 Q-24 14 22 32 Q30 34 32 26 L34 14 L16 4 L8 14 Q-10 4 -16 -10 L-6 -18 L-14 -36 Z",
  }[kind];
  return (
    <svg width={140} height={140} viewBox="-70 -70 140 140" style={{ position: "absolute", left: x - 70, top: y - 70, transform: `scale(${s})` }}>
      <circle r={62} fill={bg} />
      <circle r={62} fill="none" stroke="#fff" strokeWidth={6} />
      <path d={d} fill="#fff" />
    </svg>
  );
};

export const Tomb: React.FC = () => (
  <svg width={260} height={280} viewBox="0 0 260 280">
    <ellipse cx={130} cy={262} rx={120} ry={14} fill="#000" opacity={0.15} />
    <path d="M40 260 V100 A90 90 0 0 1 220 100 V260 Z" fill="#9AA2B1" />
    <path d="M60 260 V104 A70 70 0 0 1 200 104 V260" fill="#B5BCC9" />
    <rect x={124} y={80} width={12} height={90} rx={4} fill="#7C8494" />
    <rect x={98} y={104} width={64} height={12} rx={4} fill="#7C8494" />
    <path d="M10 262 Q60 240 130 252 T250 262" fill="#7BC47F" />
  </svg>
);
