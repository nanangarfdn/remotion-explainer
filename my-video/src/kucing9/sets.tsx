import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Portrait (1080×1920) sets for Kucing9, floor line at y 1250. Layered, shaded, own drawings.
const FLOOR = 1250;
const full = { position: "absolute", left: 0, top: 0 } as const;

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.95 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={20} rx={110} ry={34} fill="#fff" />
    <circle cx={-50} cy={6} r={42} fill="#fff" />
    <circle cx={10} cy={-14} r={56} fill="#fff" />
    <circle cx={64} cy={8} r={38} fill="#fff" />
    <ellipse cx={0} cy={40} rx={100} ry={14} fill="#DCEBF7" />
  </g>
);
const Skyline: React.FC<{ y: number; c: string; seed: number; lit?: string; h?: number }> = ({ y, c, seed, lit, h = 1 }) => (
  <g>
    {Array.from({ length: 12 }).map((_, i) => {
      const bw = 70 + ((i * 37 + seed) % 60);
      const bh = (120 + ((i * 53 + seed * 7) % 220)) * h;
      const x = i * 95 - 20;
      return (
        <g key={i}>
          <rect x={x} y={y - bh} width={bw} height={bh + 400} fill={c} />
          {lit ? Array.from({ length: Math.floor(bh / 34) }).map((_, r) => [0, 1, 2].map((k) => ((r + k + i + seed) % 3 ? <rect key={`${r}${k}`} x={x + 12 + k * 20} y={y - bh + 16 + r * 34} width={10} height={14} fill={lit} /> : null))) : null}
        </g>
      );
    })}
  </g>
);

// ── living room: wallpaper, window with curtains, plank floor, rug, plant ──
export const Room: React.FC<{ night?: boolean; picture?: boolean }> = ({ night, picture = true }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 30) * 6;
  return (
    <svg width={1080} height={1920} style={full}>
      <defs>
        <linearGradient id="rwall" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor={night ? "#3A3F6E" : "#F6E9D6"} /><stop offset="1" stopColor={night ? "#2A2E55" : "#E6D2B6"} /></linearGradient>
        <pattern id="rpap" width={60} height={60} patternUnits="userSpaceOnUse"><rect width={60} height={60} fill="none" /><rect x={28} width={4} height={60} fill={night ? "#fff" : "#C8A983"} opacity={0.12} /><circle cx={0} cy={30} r={4} fill={night ? "#fff" : "#C8A983"} opacity={0.14} /></pattern>
        <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? "#141A40" : "#7CC4F2"} /><stop offset="1" stopColor={night ? "#3B3F7C" : "#D8F0FF"} /></linearGradient>
        <linearGradient id="rfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8E5A35" /><stop offset="1" stopColor="#B57D4F" /></linearGradient>
        <linearGradient id="rcurt" x1="0" y1="0" x2="1" y2="0">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((o, i) => <stop key={o} offset={o} stopColor={i % 2 ? "#3F9C8E" : "#58B8A9"} />)}
        </linearGradient>
        <radialGradient id="rlamp" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFD58A" stopOpacity={night ? 0.55 : 0.25} /><stop offset="1" stopColor="#FFD58A" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1080} height={FLOOR} fill="url(#rwall)" />
      <rect width={1080} height={FLOOR} fill="url(#rpap)" />
      {/* window */}
      <g>
        <rect x={590} y={250} width={380} height={560} rx={10} fill="#FDFBF7" />
        <rect x={612} y={272} width={336} height={516} fill="url(#rsky)" />
        <g>
          <svg x={612} y={272} width={336} height={516}>
            {night ? <><circle cx={250} cy={90} r={34} fill="#FFF6D6" />{[[40, 60], [120, 140], [300, 220], [70, 230], [190, 40]].map(([sx, sy]) => <circle key={sx} cx={sx} cy={sy} r={3} fill="#fff" />)}</> : <Cloud x={120 + sway * 3} y={110} s={0.7} />}
            <Skyline y={470} c={night ? "#252A58" : "#A7C3DD"} seed={3} lit={night ? "#FFD27A" : undefined} h={0.8} />
            <ellipse cx={40} cy={480} rx={120} ry={110} fill={night ? "#1D3B3A" : "#4E9E5A"} />
            <ellipse cx={300} cy={500} rx={90} ry={80} fill={night ? "#22433F" : "#5DB168"} />
          </svg>
        </g>
        <rect x={772} y={272} width={16} height={516} fill="#FDFBF7" />
        <rect x={612} y={520} width={336} height={14} fill="#FDFBF7" />
        <path d="M630 290 L700 290 L640 380 Z" fill="#fff" opacity={0.25} />
        <rect x={570} y={800} width={420} height={26} rx={6} fill="#EFE7DA" />
        <rect x={570} y={822} width={420} height={8} fill="#000" opacity={0.08} />
        {/* sill plant */}
        <path d="M880 800 l10 -46 h50 l10 46 Z" fill="#C9744A" />
        {[[-30, -50], [0, -70], [28, -48], [-12, -84], [16, -88]].map(([dx, dy], i) => <ellipse key={i} cx={915 + dx} cy={756 + dy * 0.6} rx={14} ry={30} fill={i % 2 ? "#3E8E4E" : "#57A862"} transform={`rotate(${dx} ${915 + dx} ${756 + dy * 0.6})`} />)}
      </g>
      {/* curtains */}
      <rect x={550} y={226} width={460} height={14} rx={7} fill="#6B4A32" />
      <path d={`M556 236 L660 236 Q${640 + sway} 560 ${600 + sway} 900 L540 900 Q560 560 556 236 Z`} fill="url(#rcurt)" />
      <path d={`M1004 236 L900 236 Q${920 - sway} 560 ${960 - sway} 900 L1020 900 Q1000 560 1004 236 Z`} fill="url(#rcurt)" />
      {/* light from the window on the wall + floor */}
      {!night ? <path d="M612 788 L948 788 L1080 1250 L560 1250 Z" fill="#FFF7DE" opacity={0.18} /> : null}
      {picture ? (
        <g>
          <rect x={150} y={360} width={240} height={190} rx={6} fill="#6B4A32" />
          <rect x={166} y={376} width={208} height={158} fill="#FDF3E0" />
          <path d="M176 520 l60 -70 l40 40 l30 -30 l58 60 Z" fill="#8CC7A1" />
          <circle cx={330} cy={410} r={18} fill={THEME.amber} />
          <rect x={150} y={550} width={240} height={10} fill="#000" opacity={0.08} />
        </g>
      ) : null}
      <circle cx={270} cy={260} r={260} fill="url(#rlamp)" />
      {/* baseboard + floor */}
      <rect x={0} y={FLOOR - 34} width={1080} height={34} fill={night ? "#4A4F80" : "#FBF6EE"} />
      <rect x={0} y={FLOOR - 6} width={1080} height={6} fill="#000" opacity={0.1} />
      <rect x={0} y={FLOOR} width={1080} height={670} fill="url(#rfloor)" />
      {Array.from({ length: 15 }).map((_, i) => {
        const x0 = -600 + i * 160;
        return <path key={i} d={`M${540 + (x0 - 540) * 0.36} ${FLOOR} L${x0} 1920`} stroke="#6E4325" strokeWidth={3} opacity={0.5} />;
      })}
      {[1310, 1400, 1520, 1680, 1880].map((y, r) => <path key={y} d={`M0 ${y} H1080`} stroke="#6E4325" strokeWidth={2} opacity={0.25 + r * 0.04} />)}
      {/* rug */}
      <ellipse cx={540} cy={1420} rx={460} ry={115} fill={night ? "#5E4C8F" : "#7C6BD6"} />
      <ellipse cx={540} cy={1420} rx={410} ry={92} fill="none" stroke="#FFE3A3" strokeWidth={8} strokeDasharray="22 14" />
      <ellipse cx={540} cy={1420} rx={330} ry={66} fill={night ? "#6A58A0" : "#8E7EE0"} />
      {night ? <rect width={1080} height={1920} fill="#0B0F2A" opacity={0.25} /> : null}
    </svg>
  );
};

// ── wardrobe (left, 90…470, top 560) ──
export const Wardrobe: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <defs>
      <linearGradient id="wwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9C6640" /><stop offset="0.7" stopColor="#8A5734" /><stop offset="1" stopColor="#6E4326" /></linearGradient>
      <linearGradient id="wpanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B07650" /><stop offset="1" stopColor="#93603C" /></linearGradient>
    </defs>
    <ellipse cx={280} cy={FLOOR + 8} rx={230} ry={18} fill="#000" opacity={0.22} />
    {/* box on top */}
    <rect x={110} y={478} width={130} height={82} fill="#D2A26A" />
    <rect x={110} y={478} width={130} height={16} fill="#B8874F" />
    <rect x={166} y={478} width={18} height={82} fill="#E9C48E" opacity={0.6} />
    <rect x={78} y={548} width={404} height={26} rx={4} fill="#6E4326" />
    <rect x={90} y={572} width={380} height={650} fill="url(#wwood)" />
    {[0, 1].map((k) => (
      <g key={k}>
        <rect x={104 + k * 184} y={588} width={170} height={618} rx={6} fill="url(#wpanel)" />
        <rect x={124 + k * 184} y={610} width={130} height={250} rx={6} fill="none" stroke="#6E4326" strokeWidth={5} opacity={0.6} />
        <rect x={124 + k * 184} y={900} width={130} height={280} rx={6} fill="none" stroke="#6E4326" strokeWidth={5} opacity={0.6} />
        {[0, 1, 2, 3].map((g) => <path key={g} d={`M${132 + k * 184 + g * 30} 620 q8 120 -4 240`} stroke="#7A4C2C" strokeWidth={2} fill="none" opacity={0.35} />)}
      </g>
    ))}
    {[262, 298].map((x) => <g key={x}><rect x={x - 6} y={860} width={12} height={58} rx={6} fill="#E3B341" /><rect x={x - 3} y={864} width={4} height={50} rx={2} fill="#FFF0B5" opacity={0.7} /></g>)}
    <rect x={90} y={1222} width={380} height={14} fill="#6E4326" />
    <rect x={100} y={1236} width={22} height={16} fill="#5A361F" />
    <rect x={438} y={1236} width={22} height={16} fill="#5A361F" />
  </svg>
);

// ── city street with a 5-floor apartment (building 90…470) ──
export const City: React.FC<{ rise: number; lit: number }> = ({ rise, lit }) => {
  const f = useCurrentFrame();
  const top = FLOOR - 730 * rise;
  return (
    <svg width={1080} height={1920} style={full}>
      <defs>
        <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5DA9E9" /><stop offset="1" stopColor="#CBE8FB" /></linearGradient>
        <linearGradient id="cwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#EDE6DA" /><stop offset="0.8" stopColor="#DCD2C2" /><stop offset="1" stopColor="#BFB3A0" /></linearGradient>
        <linearGradient id="cglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#BFE3FA" /><stop offset="1" stopColor="#7DB4DA" /></linearGradient>
      </defs>
      <rect width={1080} height={FLOOR} fill="url(#csky)" />
      <circle cx={900} cy={300} r={70} fill="#FFF3B8" opacity={0.9} />
      <Cloud x={200 + f * 0.3} y={330} s={0.8} />
      <Cloud x={760 - f * 0.2} y={420} s={0.6} o={0.8} />
      <Skyline y={1000} c="#B6CCE0" seed={1} h={1.3} />
      <Skyline y={1100} c="#93AECA" seed={5} />
      {/* apartment */}
      <g transform={`translate(0 ${top - 520})`}>
        <rect x={70} y={490} width={420} height={34} fill="#9A8E7C" />
        <rect x={340} y={420} width={90} height={70} rx={8} fill="#7E8EA0" />
        <rect x={350} y={406} width={70} height={18} rx={6} fill="#6A7A8C" />
        <rect x={90} y={520} width={380} height={730} fill="url(#cwall)" />
        {[4, 3, 2, 1, 0].map((k, row) => {
          const y = 540 + row * 140;
          const on = k < lit;
          return (
            <g key={k}>
              {[110, 280].map((x) => (
                <g key={x}>
                  <rect x={x} y={y + 12} width={150} height={90} rx={4} fill="#8B7F6D" />
                  <rect x={x + 6} y={y + 18} width={138} height={78} fill={on ? "#FFD36B" : "url(#cglass)"} />
                  <path d={`M${x + 6} ${y + 18} h40 l-30 78 h-10 Z`} fill="#fff" opacity={on ? 0.15 : 0.35} />
                  <path d={`M${x + 75} ${y + 18} v78`} stroke="#8B7F6D" strokeWidth={4} />
                  <path d={`M${x + 8} ${y + 20} q20 40 6 74 h-6 Z`} fill={k % 2 ? "#E58F7A" : "#7CC4B4"} opacity={0.85} />
                </g>
              ))}
              {/* balcony */}
              <rect x={100} y={y + 102} width={360} height={10} fill="#A79A86" />
              {Array.from({ length: 13 }).map((_, b) => <rect key={b} x={104 + b * 28} y={y + 76} width={4} height={28} fill="#5E6672" />)}
              <rect x={100} y={y + 72} width={360} height={6} rx={3} fill="#5E6672" />
              {k % 2 ? <g><rect x={398} y={y + 50} width={46} height={30} rx={3} fill="#F3F4F6" /><circle cx={414} cy={y + 65} r={10} fill="#C9CDD3" /></g> : <g><rect x={120} y={y + 62} width={24} height={16} fill="#C9744A" /><ellipse cx={132} cy={y + 52} rx={20} ry={16} fill="#57A862" /></g>}
              <rect x={90} y={y + 128} width={380} height={12} fill="#CFC4B2" />
              <text x={46} y={y + 82} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={46} fill={on ? THEME.amber : "#fff"} stroke={THEME.navy} strokeWidth={6} paintOrder="stroke">{k + 1}</text>
            </g>
          );
        })}
      </g>
      {/* street */}
      <rect x={0} y={FLOOR} width={1080} height={70} fill="#C9C4BA" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 100} ${FLOOR} v70`} stroke="#A9A398" strokeWidth={3} />)}
      <rect x={0} y={FLOOR + 70} width={1080} height={600} fill="#4F5563" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={i * 200 + 40} y={FLOOR + 300} width={110} height={14} rx={6} fill="#E8E2D2" />)}
      <rect x={510} y={FLOOR - 220} width={10} height={220} fill="#5E6672" />
      <path d="M515 1032 q40 -10 60 10" stroke="#5E6672" strokeWidth={8} fill="none" />
      <ellipse cx={578} cy={1046} rx={16} ry={8} fill="#FFE9A8" />
    </svg>
  );
};

// ── open sky while falling: clouds rush upward, rooftops far below ──
export const Sky: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={full}>
      <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4F9BE0" /><stop offset="1" stopColor="#BFE3FA" /></linearGradient></defs>
      <rect width={1080} height={1920} fill="url(#ssky)" />
      {[[160, 0.9], [820, 0.7], [480, 1.1], [980, 0.6], [60, 0.8]].map(([x, s], i) => (
        <Cloud key={i} x={x} y={2100 - ((f * (5 + i) + i * 420) % 2400)} s={s} o={0.85} />
      ))}
      <Skyline y={1960} c="#8FA9C4" seed={2} lit="#E9F2FA" h={1.6} />
    </svg>
  );
};

// ── vet clinic front: sign, awning, big window (190…890 × 660…1100), sidewalk ──
export const ClinicFront: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <defs>
      <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C2F66" /><stop offset="1" stopColor="#5A5FA8" /></linearGradient>
      <linearGradient id="vwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F4F1EA" /><stop offset="1" stopColor="#D9D3C6" /></linearGradient>
      <linearGradient id="vroom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D9" /><stop offset="1" stopColor="#F2DDB0" /></linearGradient>
    </defs>
    <rect width={1080} height={FLOOR} fill="url(#vsky)" />
    <Skyline y={760} c="#3B3F7C" seed={4} lit="#FFD27A" h={1.2} />
    <rect x={140} y={430} width={800} height={820} fill="url(#vwall)" />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M140 ${470 + i * 50} H940`} stroke="#CFC7B8" strokeWidth={2} />)}
    {/* sign */}
    <rect x={250} y={470} width={580} height={86} rx={16} fill="#fff" stroke={THEME.teal} strokeWidth={8} />
    <rect x={290} y={492} width={42} height={42} rx={6} fill={THEME.teal} />
    <path d="M311 498 v30 M296 513 h30" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
    <text x={580} y={530} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={46} fill={THEME.teal}>DOKTER HEWAN</text>
    {/* awning */}
    <rect x={160} y={580} width={760} height={30} fill="#0F8F7D" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${160 + i * 76} 610 h76 v24 a38 22 0 0 1 -76 0 Z`} fill={i % 2 ? "#fff" : THEME.teal} />
    ))}
    {/* window with waiting room */}
    <rect x={180} y={650} width={720} height={460} rx={10} fill="#8B7F6D" />
    <rect x={190} y={660} width={700} height={440} fill="url(#vroom)" />
    <rect x={190} y={960} width={700} height={140} fill="#E8CB93" />
    <rect x={210} y={1000} width={660} height={22} rx={8} fill="#A8744A" />
    <rect x={640} y={690} width={150} height={110} rx={8} fill="#fff" />
    <path d="M650 780 l40 -40 l30 25 l20 -15 l40 30" stroke="#7CC4B4" strokeWidth={6} fill="none" />
    <rect x={240} y={690} width={90} height={60} rx={6} fill={THEME.teal} />
    <text x={285} y={730} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={30} fill="#fff">BUKA</text>
    <path d="M200 670 L320 670 L230 1090 L200 1090 Z" fill="#fff" opacity={0.18} />
    <path d="M520 670 L560 670 L470 1090 L430 1090 Z" fill="#fff" opacity={0.12} />
    <rect x={180} y={1106} width={720} height={14} fill="#A79A86" />
    {/* plants by the wall */}
    {[110, 970].map((x) => (
      <g key={x}>
        <path d={`M${x - 32} 1250 l8 -70 h48 l8 70 Z`} fill="#C9744A" />
        {[-24, -8, 8, 24].map((dx, i) => <ellipse key={dx} cx={x + dx} cy={1150 - (i % 2) * 30} rx={16} ry={44} fill={i % 2 ? "#3E8E4E" : "#57A862"} transform={`rotate(${dx} ${x + dx} ${1150 - (i % 2) * 30})`} />)}
      </g>
    ))}
    {/* sidewalk + road */}
    <rect x={0} y={FLOOR} width={1080} height={90} fill="#B9B3A8" />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 100} ${FLOOR} v90`} stroke="#9C968B" strokeWidth={3} />)}
    <rect x={0} y={FLOOR + 90} width={1080} height={580} fill="#3E4352" />
    <ellipse cx={540} cy={FLOOR + 40} rx={600} ry={70} fill="#FFE9A8" opacity={0.08} />
  </svg>
);

// ── night bedroom corner: window with moon, lamp glow, round cat bed ──
export const Bedroom: React.FC = () => (
  <>
    <Room night picture={false} />
    <svg width={1080} height={1920} style={full}>
      <defs>
        <radialGradient id="bglow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFCF7A" stopOpacity={0.55} /><stop offset="1" stopColor="#FFCF7A" stopOpacity={0} /></radialGradient>
        <linearGradient id="bbask" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C98A55" /><stop offset="1" stopColor="#8A5734" /></linearGradient>
      </defs>
      <circle cx={190} cy={760} r={340} fill="url(#bglow)" />
      {/* side table + lamp */}
      <rect x={90} y={940} width={210} height={30} rx={6} fill="#6B4A32" />
      <rect x={110} y={970} width={170} height={250} fill="#7D5638" />
      <rect x={130} y={1000} width={130} height={80} rx={6} fill="#8E6544" />
      <rect x={185} y={1030} width={20} height={8} rx={4} fill="#E3B341" />
      <rect x={185} y={820} width={16} height={120} fill="#C9B9A0" />
      <path d="M130 830 L256 830 L232 730 L154 730 Z" fill="#FFE2A8" />
      <path d="M170 920 h50 v20 h-50 Z" fill="#C9B9A0" />
      {/* cat bed */}
      <ellipse cx={600} cy={1090} rx={360} ry={70} fill="#000" opacity={0.25} />
      <ellipse cx={600} cy={1010} rx={350} ry={110} fill="url(#bbask)" />
      <ellipse cx={600} cy={990} rx={300} ry={82} fill="#F2A7B8" />
      <ellipse cx={600} cy={1000} rx={250} ry={58} fill="#F7C4D0" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${270 + i * 48} 1050 q10 20 0 50`} stroke="#7A4C2C" strokeWidth={4} fill="none" opacity={0.5} />)}
    </svg>
  </>
);
