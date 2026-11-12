import React, { useId } from "react";
import { useCurrentFrame } from "remotion";

// Second-generation character (Nov 2026): same geometry and props as Chibi (viewBox 400×520, head (200,190) r150,
// hold-hands at (184/216, 466)), so scenes swap `Chibi` → `Hero` without re-layout. Adds sparkly eyes with lids,
// thick expressive brows, more mouths, mitten hands, outfits and hair styles. Still flat: no outlines.
export type HeroMouth = "smile" | "flat" | "o" | "worried" | "grin" | "open" | "smirk";

export const Hero: React.FC<{
  width: number;
  shirt?: string;
  shirtShade?: string;
  skin?: string;
  skinShade?: string;
  hair?: string;
  iris?: string;
  look?: { x: number; y: number };
  mouth?: HeroMouth;
  worried?: boolean;
  angry?: boolean;
  browUp?: number; // 0…1 raised brows (surprise)
  pose?: "idle" | "hold" | "call";
  glow?: string;
  eyesOpen?: number;
  headTilt?: number;
  headDrop?: number;
  thumb?: boolean;
  lightFrom?: "left" | "right";
  pitch?: number;
  lap?: string;
  typing?: number;
  hairStyle?: "spiky" | "fluffy" | "bob";
  outfit?: "hoodie" | "tee";
  lashes?: boolean;
  glasses?: boolean;
  towel?: string;
  children?: React.ReactNode;
}> = ({
  width, shirt = "#16B8A0", shirtShade = "#109583", skin = "#F7D4B5", skinShade = "#E8B795", hair = "#23202B", iris = "#5A3A2A",
  look = { x: 0, y: 0 }, mouth = "smile", worried, angry, browUp = 0, pose = "idle", glow, eyesOpen = 1, headTilt = 0,
  headDrop = 0, thumb, lightFrom = "left", pitch = 0, lap, typing = 0, hairStyle = "spiky", outfit = "hoodie", lashes,
  glasses, towel, children,
}) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const bob = Math.sin(frame / 12) * 4 + headDrop;
  const blink = frame % 96 < 4 ? 0.08 : 1;
  const open = Math.max(0.06, Math.min(1.15, eyesOpen) * blink);
  const thumbY = thumb ? Math.abs(Math.sin(frame / 4)) * -10 : 0;
  const hold = pose === "hold";
  const call = pose === "call";
  const arms = call
    ? [{ x: 105, rot: 152, ox: 130, hand: [-999, -999], dir: 1 }, { x: 255, rot: -12, ox: 280, hand: [305, 477], dir: -1 }]
    : hold
    ? [{ x: 105, rot: -28, ox: 130, hand: [184, 466], dir: 1 }, { x: 245, rot: 28, ox: 270, hand: [216, 466], dir: -1 }]
    : [{ x: 95, rot: 12, ox: 120, hand: [95, 477], dir: 1 }, { x: 255, rot: -12, ox: 280, hand: [305, 477], dir: -1 }];
  const lit = lightFrom === "left" ? 1 : -1;
  const jiggle = (i: number) => Math.sin(frame / 2.3 + i * 2) * 2.5 * typing;
  // eyes: the iris travels inside the white, so clamp the gaze
  const ix = Math.max(-11, Math.min(11, look.x * 0.45));
  const iy = Math.max(-10, Math.min(12, look.y * 0.45));
  const lidDrop = 60 * (1 - Math.min(1, open)); // px of upper lid over the eye
  const wide = Math.max(0, open - 1) * 1.6; // >1 = surprised (eyes grow)
  const browY = -browUp * 16 - wide * 10;
  const bw = worried ? 1 : angry ? -1 : 0; // inner ends: up (worried) / down (angry)

  const HairBack = () =>
    hairStyle === "bob" ? (
      <path d="M44 210 C10 30 390 30 356 210 L366 330 Q330 352 300 320 L300 220 L100 220 L100 320 Q70 352 34 330 Z" fill={hair} />
    ) : null;
  const HairFront = () => {
    if (hairStyle === "fluffy")
      return (
        <g fill={hair}>
          {[[70, 130, 58], [120, 82, 62], [190, 60, 66], [262, 76, 62], [322, 120, 58], [350, 176, 40], [52, 180, 40]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}
          <path d="M60 170 Q120 150 150 112 Q200 150 250 112 Q290 150 342 170 L342 120 L60 120 Z" />
          <ellipse cx={170} cy={58} rx={46} ry={14} fill="#fff" opacity={0.16} transform="rotate(-12 170 58)" />
        </g>
      );
    if (hairStyle === "bob")
      return (
        <g fill={hair}>
          <path d="M50 200 C30 -10 370 -10 350 200 Q330 150 300 132 Q250 170 180 150 Q120 168 80 140 Q60 160 50 200 Z" />
          <path d="M110 70 C160 40 230 36 280 54" stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.16} />
        </g>
      );
    return (
      <g>
        <path d="M52 200 C36 -24 366 -34 350 190 L322 150 L300 178 L276 128 L240 160 L212 116 L176 152 L138 112 L110 162 L78 140 Z" fill={hair} />
        <path d="M220 52 L300 -6 L268 70 Z" fill={hair} />
        <path d="M150 30 L176 -16 L196 44 Z" fill={hair} />
        <path d="M100 76 C146 40 214 30 262 46" stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.18} />
      </g>
    );
  };

  return (
    <svg width={width} viewBox="0 0 400 520" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`head-${id}`}><circle cx={200} cy={190} r={150} /></clipPath>
        <clipPath id={`body-${id}`}><rect x={112} y={318} width={176} height={202} rx={72} /></clipPath>
        {[150, 250].map((x) => (
          <clipPath key={x} id={`eye${x}-${id}`}><ellipse cx={x} cy={222} rx={27 + wide} ry={31 + wide * 2} /></clipPath>
        ))}
        <radialGradient id={`glow-${id}`}>
          <stop offset="0%" stopColor={glow ?? "#fff"} stopOpacity={0.3} />
          <stop offset="100%" stopColor={glow ?? "#fff"} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* body */}
      <rect x={112} y={318} width={176} height={202} rx={72} fill={shirt} />
      <g clipPath={`url(#body-${id})`}>
        <rect x={lit > 0 ? 234 : 86} y={300} width={80} height={240} fill={shirtShade} />
        {outfit === "hoodie" ? (
          <g>
            <ellipse cx={200} cy={322} rx={96} ry={36} fill={shirtShade} />
            <path d="M160 330 L200 372 L240 330 Z" fill={skin} />
            {[178, 222].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 346 Q${x + (i ? 4 : -4)} 380 ${x} 410`} stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.9} />
                <rect x={x - 5} y={406} width={10} height={16} rx={4} fill="#fff" />
              </g>
            ))}
            <path d="M140 452 Q200 440 260 452 L268 520 L132 520 Z" fill={shirtShade} opacity={0.6} />
          </g>
        ) : (
          <g>
            <path d="M162 318 Q200 360 238 318" stroke={shirtShade} strokeWidth={14} fill={skin} />
            <path d="M200 408 L208 424 L226 426 L212 438 L216 456 L200 446 L184 456 L188 438 L174 426 L192 424 Z" fill="#FFB020" />
          </g>
        )}
      </g>
      {lap ? [100, 204].map((x) => (
        <g key={x}>
          <rect x={x} y={428} width={96} height={100} rx={44} fill={lap} />
          <ellipse cx={x + 48} cy={446} rx={30} ry={10} fill="#fff" opacity={0.12} />
        </g>
      )) : null}
      {arms.map((a, i) => (
        <g key={a.x} transform={`rotate(${a.rot + jiggle(i)} ${a.ox} 360)`}>
          <rect x={a.x} y={350} width={50} height={124} rx={25} fill={shirt} />
          <rect x={a.x} y={452} width={50} height={14} rx={7} fill={shirtShade} />
        </g>
      ))}
      {children}
      {arms.filter((a) => a.hand[0] > 0).map((a, i) => {
        const [hx, hy] = [a.hand[0], a.hand[1] + (i === 1 ? thumbY : 0)];
        return (
          <g key={`h${a.x}`}>
            <ellipse cx={hx} cy={hy} rx={24} ry={22} fill={skin} />
            <ellipse cx={hx + 15 * a.dir} cy={hy - 12} rx={9} ry={12} fill={skin} transform={`rotate(${-30 * a.dir} ${hx + 15 * a.dir} ${hy - 12})`} />
            <path d={`M${hx - 12} ${hy + 8} Q${hx} ${hy + 14} ${hx + 12} ${hy + 8}`} stroke={skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        );
      })}

      <g transform={`translate(0 ${bob}) rotate(${headTilt} 200 330)`}>
        <ellipse cx={200} cy={334} rx={110} ry={22} fill="#000" opacity={0.12} clipPath={`url(#body-${id})`} />
        <HairBack />
        {[52, 348].map((x) => (
          <g key={x}>
            <circle cx={x} cy={214} r={28} fill={skin} />
            <circle cx={x} cy={214} r={13} fill={skinShade} />
          </g>
        ))}
        <circle cx={200} cy={190} r={150} fill={skin} />
        <g clipPath={`url(#head-${id})`}>
          <ellipse cx={200 + 96 * lit} cy={300} rx={170} ry={120} fill={skinShade} opacity={0.4} />
          {glow ? <ellipse cx={200} cy={345} rx={120} ry={50} fill={`url(#glow-${id})`} style={{ mixBlendMode: "screen" }} /> : null}
          <path d="M40 180 Q200 140 360 180 L360 120 L40 120 Z" fill={skinShade} opacity={0.35} />
        </g>
        {towel ? (
          <g>
            <path d="M44 176 C22 -30 378 -30 356 176 Q300 120 200 124 Q100 120 44 176 Z" fill={towel} />
            <path d="M200 30 Q250 -40 300 0 Q290 50 220 60 Z" fill={towel} />
          </g>
        ) : <HairFront />}
        <g transform={`translate(0 ${pitch})`}>
          {/* brows: thick, rounded; inner ends up = worried, down = angry */}
          <path d={`M124 ${178 + browY + bw * 8} Q146 ${168 + browY} 172 ${174 + browY - bw * 10}`} stroke={hair} strokeWidth={12} strokeLinecap="round" fill="none" />
          <path d={`M228 ${174 + browY - bw * 10} Q254 ${168 + browY} 276 ${178 + browY + bw * 8}`} stroke={hair} strokeWidth={12} strokeLinecap="round" fill="none" />
          {/* eyes */}
          {[150, 250].map((x) => (
            <g key={x}>
              <g clipPath={`url(#eye${x}-${id})`}>
                <rect x={x - 40} y={180} width={80} height={90} fill="#fff" />
                <circle cx={x + ix} cy={226 + iy} r={19 + wide} fill={iris} />
                <circle cx={x + ix} cy={226 + iy} r={10 + wide} fill="#15121C" />
                <circle cx={x + ix + 7} cy={217 + iy} r={6.5} fill="#fff" />
                <circle cx={x + ix - 6} cy={234 + iy} r={3} fill="#fff" opacity={0.9} />
                <rect x={x - 40} y={188 - wide * 2} width={80} height={lidDrop + 3} fill={skin} />
              </g>
              <path d={`M${x - 28} ${222 - 22 + lidDrop * 0.9} Q${x} ${190 + lidDrop} ${x + 28} ${222 - 22 + lidDrop * 0.9}`} stroke="#2A2230" strokeWidth={6} strokeLinecap="round" fill="none" />
              {lashes ? <path d={`M${x + (x < 200 ? -26 : 26)} ${204 + lidDrop * 0.9} l${x < 200 ? -12 : 12} -10`} stroke="#2A2230" strokeWidth={5} strokeLinecap="round" /> : null}
            </g>
          ))}
          {glasses ? (
            <g stroke="#2A2230" strokeWidth={7} fill="#fff" fillOpacity={0.08}>
              <circle cx={150} cy={224} r={42} /><circle cx={250} cy={224} r={42} />
              <path d="M192 220 Q200 212 208 220" fill="none" />
            </g>
          ) : null}
          <ellipse cx={200} cy={256} rx={8} ry={5} fill={skinShade} />
          <ellipse cx={112} cy={268} rx={26} ry={15} fill="#F59A9A" opacity={0.5} />
          <ellipse cx={288} cy={268} rx={26} ry={15} fill="#F59A9A" opacity={0.5} />
          {/* mouth */}
          {mouth === "smile" ? <path d="M180 276 Q200 294 220 276" stroke="#7A3340" strokeWidth={7} strokeLinecap="round" fill="none" /> : null}
          {mouth === "smirk" ? <path d="M182 282 Q206 290 224 272" stroke="#7A3340" strokeWidth={7} strokeLinecap="round" fill="none" /> : null}
          {mouth === "flat" ? <path d="M186 282 L214 282" stroke="#7A3340" strokeWidth={7} strokeLinecap="round" /> : null}
          {mouth === "worried" ? <path d="M180 288 Q190 276 200 284 Q210 292 220 280" stroke="#7A3340" strokeWidth={7} strokeLinecap="round" fill="none" /> : null}
          {mouth === "grin" ? (
            <g>
              <path d="M170 272 Q200 274 230 272 Q228 312 200 312 Q172 312 170 272 Z" fill="#7A3340" />
              <path d="M174 273 Q200 275 226 273 L224 283 Q200 286 176 283 Z" fill="#fff" />
              <ellipse cx={200} cy={302} rx={14} ry={7} fill="#F07C8C" />
            </g>
          ) : null}
          {mouth === "open" ? (
            <g>
              <ellipse cx={200} cy={286} rx={16} ry={13} fill="#7A3340" />
              <ellipse cx={200} cy={293} rx={10} ry={5} fill="#F07C8C" />
            </g>
          ) : null}
          {mouth === "o" ? <ellipse cx={200} cy={288} rx={11} ry={15} fill="#7A3340" /> : null}
        </g>
        {call ? (
          <g>
            <rect x={34} y={150} width={30} height={126} rx={10} fill="#272C46" transform="rotate(-12 49 213)" />
            {[204, 222].map((fy) => <rect key={fy} x={30} y={fy} width={34} height={15} rx={7.5} fill={skin} />)}
            <circle cx={66} cy={252} r={24} fill={skin} />
          </g>
        ) : null}
        {worried ? <path d="M330 140 C344 168 356 184 343 199 C330 210 310 197 317 179 Z" fill="#8FD3F5" /> : null}
        {angry ? <path d="M300 70 l14 14 m0 -14 l-14 14 M318 60 l10 22 m-22 -6 l24 -8" stroke="#E2445C" strokeWidth={7} strokeLinecap="round" /> : null}
      </g>
    </svg>
  );
};
