import React, { useId } from "react";
import { useCurrentFrame } from "remotion";

type Mouth = "smile" | "flat" | "o" | "worried";

// Original flat chibi: big round head, dot eyes, no outlines. viewBox 400×520.
export const Chibi: React.FC<{
  width: number;
  shirt?: string;
  shirtShade?: string;
  skin?: string;
  skinShade?: string;
  hair?: string;
  look?: { x: number; y: number }; // eye offset, viewBox units
  mouth?: Mouth;
  worried?: boolean; // brows tilt + sweat drop
  pose?: "idle" | "hold" | "call"; // hold = both hands in front (phone, book); call = right hand holds a phone to the ear
  glow?: string; // coloured light on the lower face (screen glow)
  eyesOpen?: number; // 1 open … 0 shut (sleepy)
  headTilt?: number; // degrees, pivots at the neck
  headDrop?: number; // px down (nodding off)
  thumb?: boolean; // right thumb scrolls (with pose="hold")
  lightFrom?: "left" | "right"; // side the key light comes from; shading goes on the other side
  pitch?: number; // viewBox units the face (brows, eyes, cheeks, mouth) slides down = head tipped down
  lap?: string; // trouser colour: draws knees in front of the body (seated, seen from the front)
  typing?: number; // 0…1: forearms jiggle as if typing
  hat?: string; // plain cap colour (no insignia)
  towel?: string; // towel wrapped over the hair (just showered)
  children?: React.ReactNode; // prop drawn between arms and hands
}> = ({
  width,
  shirt = "#16B8A0",
  shirtShade = "#109583",
  skin = "#F6D2B0",
  skinShade = "#E3B48E",
  hair = "#23202B",
  look = { x: 0, y: 0 },
  mouth = "flat",
  worried,
  pose = "idle",
  glow,
  eyesOpen = 1,
  headTilt = 0,
  headDrop = 0,
  thumb,
  lightFrom = "left",
  pitch = 0,
  lap,
  typing = 0,
  hat,
  towel,
  children,
}) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const bob = Math.sin(frame / 12) * 4 + headDrop;
  const blink = (frame % 96 < 4 ? 0.1 : 1) * Math.max(0.1, eyesOpen);
  const thumbY = thumb ? Math.abs(Math.sin(frame / 4)) * -10 : 0;
  const hold = pose === "hold";
  const call = pose === "call";
  const arms = call
    ? [
        // forearm raised behind the cheek to the ear; the hand + phone are drawn over the head
        { x: 105, rot: 152, ox: 130, hand: [-999, -999] },
        { x: 255, rot: -12, ox: 280, hand: [305, 477] },
      ]
    : hold
    ? [
        { x: 105, rot: -28, ox: 130, hand: [184, 466] },
        { x: 245, rot: 28, ox: 270, hand: [216, 466] },
      ]
    : [
        { x: 95, rot: 12, ox: 120, hand: [95, 477] },
        { x: 255, rot: -12, ox: 280, hand: [305, 477] },
      ];
  const ex = look.x;
  const ey = look.y;
  const brow = worried ? 10 : 0;
  const lit = lightFrom === "left" ? 1 : -1; // mirrors shade positions around x=200
  const jiggle = (i: number) => Math.sin(frame / 2.3 + i * 2) * 2.5 * typing;

  return (
    <svg width={width} viewBox="0 0 400 520" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`head-${id}`}>
          <circle cx={200} cy={190} r={150} />
        </clipPath>
        <clipPath id={`body-${id}`}>
          <rect x={115} y={320} width={170} height={200} rx={70} />
        </clipPath>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0%" stopColor={glow ?? "#fff"} stopOpacity={0.3} />
          <stop offset="100%" stopColor={glow ?? "#fff"} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* body + shading + collar */}
      <rect x={115} y={320} width={170} height={200} rx={70} fill={shirt} />
      <g clipPath={`url(#body-${id})`}>
        <rect x={lit > 0 ? 232 : 88} y={300} width={80} height={240} fill={shirtShade} />
        <path d="M168 318 L200 362 L232 318 Z" fill={skin} />
        <path d="M158 318 L200 372 L242 318 L232 318 L200 360 L168 318 Z" fill="#fff" opacity={0.85} />
      </g>
      {lap ? (
        <g>
          {[100, 204].map((x) => (
            <g key={x}>
              <rect x={x} y={428} width={96} height={100} rx={44} fill={lap} />
              <ellipse cx={x + 48} cy={446} rx={30} ry={10} fill="#fff" opacity={0.12} />
            </g>
          ))}
        </g>
      ) : null}
      {arms.map((a, i) => (
        <rect key={a.x} x={a.x} y={350} width={50} height={124} rx={25} fill={shirt}
          transform={`rotate(${a.rot + jiggle(i)} ${a.ox} 360)`} />
      ))}
      {children}
      {arms.filter((a) => a.hand[0] > 0).map((a, i) => (
        <circle key={`h${a.x}`} cx={a.hand[0]} cy={a.hand[1] + (i === 1 ? thumbY : 0)} r={22} fill={skin} />
      ))}

      <g transform={`translate(0 ${bob}) rotate(${headTilt} 200 330)`}>
        <ellipse cx={200} cy={332} rx={110} ry={22} fill="#000" opacity={0.12} clipPath={`url(#body-${id})`} />
        {/* ears */}
        {[52, 348].map((x) => (
          <g key={x}>
            <circle cx={x} cy={214} r={28} fill={skin} />
            <circle cx={x} cy={214} r={13} fill={skinShade} />
          </g>
        ))}
        <circle cx={200} cy={190} r={150} fill={skin} />
        <g clipPath={`url(#head-${id})`}>
          <ellipse cx={200 + 90 * lit} cy={300} rx={170} ry={120} fill={skinShade} opacity={0.45} />
          {/* screen light: "screen" blend brightens the skin (normal alpha greyed it like stubble) */}
          {glow ? <ellipse cx={200} cy={345} rx={120} ry={50} fill={`url(#glow-${id})`} style={{ mixBlendMode: "screen" }} /> : null}
          {/* hair shadow on forehead */}
          <path d="M40 190 L110 176 L138 126 L176 166 L212 130 L240 174 L276 142 L300 192 L330 168 L360 200 L360 150 L40 150 Z"
            fill={skinShade} opacity={0.5} />
        </g>
        {/* hair */}
        <path d="M52 200 C36 -24 366 -34 350 190 L322 150 L300 178 L276 128 L240 160 L212 116 L176 152 L138 112 L110 162 L78 140 Z"
          fill={hair} />
        <path d="M220 52 L300 -6 L268 70 Z" fill={hair} />
        <path d="M104 74 C146 44 208 36 252 48" stroke="#fff" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.16} />
        {hat ? (
          <g>
            <path d="M58 150 C46 0 354 0 342 150 Z" fill={hat} />
            <path d="M40 150 L360 150 L380 178 L20 178 Z" fill={hat} />
            <rect x={40} y={150} width={320} height={10} fill="#000" opacity={0.2} />
            <circle cx={200} cy={92} r={20} fill="#FFB020" />
          </g>
        ) : null}
        {towel ? (
          <g>
            <path d="M44 176 C22 -30 378 -30 356 176 Q300 120 200 124 Q100 120 44 176 Z" fill={towel} />
            <path d="M60 150 Q200 96 340 150" stroke="#000" strokeWidth={8} opacity={0.08} fill="none" />
            <path d="M200 30 Q250 -40 300 0 Q290 50 220 60 Z" fill={towel} />
            <path d="M226 40 Q262 0 290 8" stroke="#fff" strokeWidth={8} opacity={0.35} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        <g transform={`translate(0 ${pitch})`}>
        {/* brows */}
        {/* worried = inner ends raised */}
        <path d={`M128 ${186 + brow} L170 ${184 - brow}`} stroke={hair} strokeWidth={8} strokeLinecap="round" />
        <path d={`M230 ${184 - brow} L272 ${186 + brow}`} stroke={hair} strokeWidth={8} strokeLinecap="round" />
        {/* eyes */}
        {/* eyesOpen < 0.95 (looking down, tired) adds a heavy upper-lid stroke */}
        {[150, 250].map((x) => (
          <g key={x}>
            <ellipse cx={x + ex} cy={224 + ey} rx={11} ry={14 * blink} fill="#1E1E24" />
            {blink > 0.5 ? <circle cx={x + ex + 4} cy={219 + ey + (eyesOpen < 0.95 ? 3 : 0)} r={3.5} fill="#fff" /> : null}
            {eyesOpen < 0.95 && blink > 0.5 ? (
              <path d={`M${x + ex - 15} ${227 + ey - 14 * blink} Q${x + ex} ${221 + ey - 14 * blink} ${x + ex + 15} ${227 + ey - 14 * blink}`}
                stroke="#1E1E24" strokeWidth={5} strokeLinecap="round" fill="none" />
            ) : null}
          </g>
        ))}
        <circle cx={116} cy={266} r={19} fill="#F29C9C" opacity={0.45} />
        <circle cx={284} cy={266} r={19} fill="#F29C9C" opacity={0.45} />
        {/* mouth */}
        {mouth === "smile" ? <path d="M182 268 Q200 286 218 268" stroke="#7A3B3B" strokeWidth={6} strokeLinecap="round" fill="none" /> : null}
        {mouth === "flat" ? <path d="M188 274 L212 274" stroke="#7A3B3B" strokeWidth={6} strokeLinecap="round" /> : null}
        {mouth === "o" ? <ellipse cx={200} cy={276} rx={9} ry={12} fill="#7A3B3B" /> : null}
        {mouth === "worried" ? <path d="M182 278 Q191 268 200 276 Q209 284 218 274" stroke="#7A3B3B" strokeWidth={6} strokeLinecap="round" fill="none" /> : null}
        </g>
        {call ? (
          <g>
            {/* phone seen from the side, pressed to the ear (screen faces the cheek) */}
            <rect x={34} y={150} width={30} height={126} rx={10} fill="#272C46" transform="rotate(-12 49 213)" />
            <rect x={38} y={160} width={5} height={100} rx={2.5} fill="#fff" opacity={0.18} transform="rotate(-12 49 213)" />
            {[204, 222].map((fy) => <rect key={fy} x={30} y={fy} width={34} height={15} rx={7.5} fill={skin} />)}
            <circle cx={66} cy={252} r={24} fill={skin} />
            <circle cx={74} cy={258} r={12} fill={skinShade} opacity={0.5} />
          </g>
        ) : null}
        {worried ? <path d="M330 140 C344 168 356 184 343 199 C330 210 310 197 317 179 Z" fill="#8FD3F5" /> : null}
      </g>
    </svg>
  );
};
