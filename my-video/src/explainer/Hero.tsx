import React, { useId } from "react";
import { useCurrentFrame } from "remotion";

// Second-generation character (Nov 2026): same geometry and props as Chibi (viewBox 400×520, head (200,190) r150,
// hold-hands at (184/216, 466)), so scenes swap `Chibi` → `Hero` without re-layout. Adds sparkly eyes with lids,
// thick expressive brows, more mouths, mitten hands, outfits and hair styles. Still flat: no outlines.
export type HeroMouth = "smile" | "flat" | "o" | "worried" | "grin" | "open" | "smirk";

// ── Expressions (Nov 2026 upgrade): FACS-style face controls, emotion presets and keyed blending ──
// brow: raise 0…1 (AU1+2) · browIn: inner ends +1 up (worried, AU1) / −1 down (angry, AU4) · browAsym: one brow up (skeptic/smug)
// open: upper lid (<1 droop, >1 wide, AU5) · cheek: cheek raiser pushing the lower lid up (AU6 — makes a smile genuine)
// curve: mouth corners +1 up (AU12) / −1 down (AU15) · jaw: drop (AU26) · wide: mouth width · teeth: 0…1 · smirk: one-sided corner (AU12 unilateral)
// blush / tear / sweat / shock (pop lines) / vein (anger mark): overlays 0…1
export type Face = { brow: number; browIn: number; browAsym: number; open: number; cheek: number; curve: number; jaw: number; wide: number; teeth: number; smirk: number; blush: number; tear: number; sweat: number; shock: number; vein: number };
export type Emotion = "neutral" | "happy" | "laugh" | "sad" | "cry" | "shock" | "scared" | "angry" | "smug" | "cringe" | "thinking" | "sleepy" | "determined" | "love";
const NEUTRAL: Face = { brow: 0, browIn: 0, browAsym: 0, open: 1, cheek: 0, curve: 0.35, jaw: 0, wide: 0.45, teeth: 0, smirk: 0, blush: 0.5, tear: 0, sweat: 0, shock: 0, vein: 0 };
export const PRESETS: Record<Emotion, Partial<Face>> = {
  neutral: {},
  happy: { brow: 0.25, open: 0.92, cheek: 0.55, curve: 1, jaw: 0.18, wide: 0.75, teeth: 0.7, blush: 0.75 },
  laugh: { brow: 0.4, browIn: 0.25, open: 0.3, cheek: 1, curve: 1, jaw: 0.85, wide: 1, teeth: 1, blush: 0.9 },
  sad: { brow: 0.15, browIn: 1, open: 0.82, curve: -0.8, wide: 0.4, tear: 0.35, blush: 0.3 },
  cry: { brow: 0.2, browIn: 1, open: 0.45, cheek: 0.3, curve: -1, jaw: 0.5, wide: 0.7, teeth: 0.4, tear: 1, blush: 0.8 },
  shock: { brow: 1, browIn: 0.15, open: 1.15, curve: -0.1, jaw: 0.75, wide: 0.3, shock: 1 },
  scared: { brow: 0.85, browIn: 1, open: 1.12, curve: -0.6, jaw: 0.3, wide: 0.95, teeth: 0.9, sweat: 1 },
  angry: { browIn: -1, open: 0.88, cheek: 0.25, curve: -0.55, jaw: 0.22, wide: 0.8, teeth: 0.9, vein: 1, blush: 0.8 },
  smug: { brow: 0.1, browAsym: 0.9, open: 0.68, cheek: 0.3, curve: 0.55, smirk: 1, wide: 0.55 },
  cringe: { brow: 0.35, browIn: 0.85, open: 0.5, cheek: 0.55, curve: -0.35, jaw: 0.28, wide: 1, teeth: 1, sweat: 0.8 },
  thinking: { brow: 0.35, browAsym: 0.6, open: 0.88, curve: -0.15, wide: 0.25, smirk: 0.5 },
  sleepy: { brow: -0.15, open: 0.32, curve: 0.05, jaw: 0.08, wide: 0.35 },
  determined: { browIn: -0.65, open: 0.9, cheek: 0.15, curve: -0.15, wide: 0.5 },
  love: { brow: 0.2, browIn: 0.3, open: 0.8, cheek: 0.65, curve: 0.9, jaw: 0.1, wide: 0.6, teeth: 0.3, blush: 1 },
};
export const faceOf = (e?: Emotion, over?: Partial<Face>): Face => ({ ...NEUTRAL, ...(e ? PRESETS[e] : {}), ...over });
const mixFace = (a: Face, b: Face, t: number) => Object.fromEntries((Object.keys(a) as (keyof Face)[]).map((k) => [k, a[k] + (b[k] - a[k]) * t])) as Face;
// Keyed acting: emo(f, [[0, "neutral"], [40, "shock"], [70, { ...PRESETS.sad, tear: 1 }]]). Each change blends over `len` frames
// with a small overshoot so the new expression lands instead of sliding in.
export const emo = (f: number, keys: [number, Emotion | Partial<Face>][], len = 6): Face => {
  const F = (x: Emotion | Partial<Face>) => (typeof x === "string" ? faceOf(x) : faceOf(undefined, x));
  let i = -1;
  keys.forEach(([at], k) => { if (f >= at) i = k; });
  if (i <= 0) return F(keys[0][1]);
  const t = Math.min(1, (f - keys[i][0]) / len);
  const e = t * t * (3 - 2 * t);
  return mixFace(F(keys[i - 1][1]), F(keys[i][1]), t < 1 ? e + 0.08 * Math.sin(Math.PI * e) : 1);
};
const rnd = (s: number) => {
  const x = Math.sin(s * 91.37 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
const BLINK = [0.55, 0.1, 0.06, 0.45, 0.85]; // close fast, open slower

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
  emotion?: Emotion; // preset; `face` and the legacy props (mouth, worried, angry, browUp, eyesOpen) override it
  face?: Partial<Face>; // e.g. emo(f, keys)
  talk?: number; // 0…1 jaw flaps while the character speaks (parametric mouth only)
  blinks?: number[]; // extra blinks (frames) — put one on every head turn / gaze change
  seed?: number; // de-syncs blinks, eye drift and breathing between characters
  children?: React.ReactNode;
}> = ({
  width, shirt = "#16B8A0", shirtShade = "#109583", skin = "#F7D4B5", skinShade = "#E8B795", hair = "#23202B", iris = "#5A3A2A",
  look = { x: 0, y: 0 }, mouth, worried, angry, browUp, pose = "idle", glow, eyesOpen, headTilt = 0,
  headDrop = 0, thumb, lightFrom = "left", pitch = 0, lap, typing = 0, hairStyle = "spiky", outfit = "hoodie", lashes,
  glasses, towel, emotion, face, talk = 0, blinks = [], seed, children,
}) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const sd = seed ?? [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7);
  // resolved face: preset → face → legacy props
  const fc = faceOf(emotion, face);
  if (browUp !== undefined) fc.brow = browUp;
  if (worried) { fc.browIn = 1; fc.sweat = Math.max(fc.sweat, 1); }
  if (angry) { fc.browIn = -1; fc.vein = Math.max(fc.vein, 1); }
  if (eyesOpen !== undefined) fc.open = eyesOpen;
  const legacyMouth = mouth ?? (emotion || face ? undefined : "smile");
  const jaw = Math.min(1, fc.jaw + talk * (0.18 + 0.4 * Math.abs(Math.sin(frame / 2.3 + sd)) * Math.abs(Math.sin(frame / 5.1))));
  const laughing = fc.cheek > 0.85 && jaw > 0.55;
  const bob = Math.sin(frame / 12 + sd) * 4 + headDrop + fc.tear * 6 - fc.shock * 6 - (laughing ? Math.abs(Math.sin(frame / 3)) * 6 : 0);
  // irregular natural blinks (one per ~3.7 s, sometimes double) + forced ones
  const seg = Math.floor(frame / 110);
  const d = frame - seg * 110 - Math.floor(18 + rnd(seg + sd) * 70);
  let blink = d >= 0 && d < 5 ? BLINK[d] : 1;
  if (rnd(seg * 3.3 + sd) > 0.78 && d - 8 >= 0 && d - 8 < 5) blink = BLINK[d - 8];
  blinks.forEach((b) => { if (frame >= b && frame < b + 5) blink = Math.min(blink, BLINK[frame - b]); });
  const open = Math.max(0.06, Math.min(1.15, fc.open) * blink);
  const happyShut = fc.open < 0.45 && fc.cheek > 0.7; // laughing eyes become arcs
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
  // micro-saccades: the eyes never sit perfectly still
  const drift = Math.floor(frame / 26);
  const ix = Math.max(-11, Math.min(11, look.x * 0.45 + (rnd(drift + sd * 1.3) - 0.5) * 3));
  const iy = Math.max(-10, Math.min(12, look.y * 0.45 + (rnd(drift * 1.7 + sd) - 0.5) * 2));
  const lidDrop = 60 * (1 - Math.min(1, open)); // px of upper lid over the eye
  const wide = Math.max(0, open - 1) * 1.6; // >1 = surprised (eyes grow)
  const browY = -fc.brow * 16 - wide * 10;
  const bw = fc.browIn; // inner ends: up (worried) / down (angry)
  const cheekUp = fc.cheek * 16; // lower lid pushed up by the cheek

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
        {[150, 250].map((x) => (
          <clipPath key={`l${x}`} id={`lid${x}-${id}`}>
            <rect x={x - 40} y={188 - wide * 2} width={80} height={lidDrop + 3} />
            {cheekUp > 0 ? <ellipse cx={x} cy={290 - cheekUp} rx={44} ry={36} /> : null}
          </clipPath>
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
          <path d={`M124 ${178 + browY + bw * 8 + fc.browAsym * 4} Q146 ${168 + browY - fc.brow * 8 + fc.browAsym * 4} 172 ${174 + browY - bw * 10 + fc.browAsym * 3}`} stroke={hair} strokeWidth={12} strokeLinecap="round" fill="none" />
          <path d={`M228 ${174 + browY - bw * 10 - fc.browAsym * 12} Q254 ${168 + browY - fc.brow * 8 - fc.browAsym * 16} 276 ${178 + browY + bw * 8 - fc.browAsym * 12}`} stroke={hair} strokeWidth={12} strokeLinecap="round" fill="none" />
          {/* eyes */}
          {[150, 250].map((x) => (happyShut ? (
            <path key={x} d={`M${x - 26} 232 Q${x} 200 ${x + 26} 232`} stroke="#2A2230" strokeWidth={7} strokeLinecap="round" fill="none" />
          ) : (
            <g key={x}>
              <g clipPath={`url(#eye${x}-${id})`}>
                <rect x={x - 40} y={186 - wide * 2 + lidDrop} width={80} height={90} fill="#fff" /> {/* white starts under the lid: no light ring at the clip edge */}
                <circle cx={x + ix} cy={226 + iy} r={19 + wide} fill={iris} />
                <circle cx={x + ix} cy={226 + iy} r={(10 + wide) * (1 - 0.3 * fc.shock)} fill="#15121C" />
                <circle cx={x + ix + 7} cy={217 + iy} r={6.5} fill="#fff" />
                <circle cx={x + ix - 6} cy={234 + iy} r={3} fill="#fff" opacity={0.9} />
                {fc.tear > 0.3 ? <ellipse cx={x} cy={250} rx={26} ry={8} fill="#BFE6FA" opacity={0.45 * fc.tear} /> : null}
                <rect x={x - 40} y={188 - wide * 2} width={80} height={lidDrop + 3} fill={skin} />
                {cheekUp > 0 ? <ellipse cx={x} cy={290 - cheekUp} rx={44} ry={36} fill={skin} /> : null}
                <g clipPath={`url(#lid${x}-${id})`}>
                  <g transform={`translate(0 ${-pitch})`}>
                    <ellipse cx={200 + 96 * lit} cy={300} rx={170} ry={120} fill={skinShade} opacity={0.4} />
                    <path d="M40 180 Q200 140 360 180 L360 120 L40 120 Z" fill={skinShade} opacity={0.35} />
                  </g>
                </g>
              </g>
              <path d={`M${x - 28} ${222 - 22 + lidDrop * 0.9} Q${x} ${190 + lidDrop} ${x + 28} ${222 - 22 + lidDrop * 0.9}`} stroke="#2A2230" strokeWidth={6} strokeLinecap="round" fill="none" />
              {cheekUp > 4 ? <path d={`M${x - 20} ${256 - cheekUp * 0.7} Q${x} ${248 - cheekUp} ${x + 20} ${256 - cheekUp * 0.7}`} stroke={skinShade} strokeWidth={4} strokeLinecap="round" fill="none" /> : null}
              {lashes ? <path d={`M${x + (x < 200 ? -26 : 26)} ${204 + lidDrop * 0.9} l${x < 200 ? -12 : 12} -10`} stroke="#2A2230" strokeWidth={5} strokeLinecap="round" /> : null}
            </g>
          )))}
          {glasses ? (
            <g stroke="#2A2230" strokeWidth={7} fill="#fff" fillOpacity={0.08}>
              <circle cx={150} cy={224} r={42} /><circle cx={250} cy={224} r={42} />
              <path d="M192 220 Q200 212 208 220" fill="none" />
            </g>
          ) : null}
          <ellipse cx={200} cy={256} rx={8} ry={5} fill={skinShade} />
          {[112, 288].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={268 - fc.cheek * 6} rx={26} ry={15} fill="#F59A9A" opacity={Math.min(0.9, 0.25 + 0.5 * fc.blush)} />
              {fc.blush > 0.85 ? [-12, 0, 12].map((o) => <path key={o} d={`M${cx + o - 4} ${274} l8 -12`} stroke="#E46F7E" strokeWidth={3} strokeLinecap="round" opacity={0.7} />) : null}
            </g>
          ))}
          {/* parametric mouth (emotion / face) */}
          {!legacyMouth ? (() => {
            const w = 14 + fc.wide * 26;
            const y0 = 280;
            const ly = y0 - fc.curve * 9 + fc.smirk * 3;
            const ry = y0 - fc.curve * 9 - fc.smirk * 10;
            if (jaw < 0.1) return <path d={`M${200 - w} ${ly} Q200 ${y0 + fc.curve * 12 + jaw * 20} ${200 + w} ${ry}`} stroke="#7A3340" strokeWidth={7} strokeLinecap="round" fill="none" />;
            const up = y0 - fc.curve * 3 - 2;
            const lo = y0 + fc.curve * 12 + jaw * 58;
            const grit = fc.teeth > 0.8 && jaw < 0.35;
            if (grit) {
              // clenched teeth (fear / anger / cringe): a box of teeth, corners pulled by `curve`
              const t = y0 - 12 - fc.curve * 4;
              const b = y0 + 12 + jaw * 20;
              const box = `M${200 - w} ${t + fc.curve * -6} Q200 ${t - 4} ${200 + w} ${t + fc.curve * -6 - fc.smirk * 8} L${200 + w} ${b} Q200 ${b + 6} ${200 - w} ${b} Z`;
              return (
                <g>
                  <path d={box} fill="#fff" stroke="#7A3340" strokeWidth={6} strokeLinejoin="round" />
                  <line x1={200 - w + 4} y1={(t + b) / 2 + 1} x2={200 + w - 4} y2={(t + b) / 2 + 1} stroke="#C9B8BE" strokeWidth={3} />
                  {[-0.5, 0, 0.5].map((k) => <line key={k} x1={200 + k * w} y1={t + 2} x2={200 + k * w} y2={b - 2} stroke="#C9B8BE" strokeWidth={2.5} />)}
                </g>
              );
            }
            if (jaw > 0.45 && fc.wide < 0.45) {
              // dropped jaw with narrow lips = round "O" (surprise AU26+27)
              const ry2 = 10 + jaw * 26;
              const cy = y0 + ry2 * 0.55 - 4;
              return (
                <g>
                  <ellipse cx={200} cy={cy} rx={w} ry={ry2} fill="#7A3340" />
                  <ellipse cx={200} cy={cy + ry2 * 0.55} rx={w * 0.6} ry={ry2 * 0.32} fill="#F07C8C" />
                </g>
              );
            }
            const shape = `M${200 - w} ${ly} Q200 ${up} ${200 + w} ${ry} Q200 ${lo} ${200 - w} ${ly} Z`;
            return (
              <g>
                <clipPath id={`mouth-${id}`}><path d={shape} /></clipPath>
                <path d={shape} fill="#7A3340" stroke="#7A3340" strokeWidth={4} strokeLinejoin="round" />
                <g clipPath={`url(#mouth-${id})`}>
                  {jaw > 0.35 ? <ellipse cx={200} cy={lo - 4} rx={w * 0.55} ry={6 + 8 * jaw} fill="#F07C8C" /> : null}
                  {fc.teeth > 0 ? <rect x={200 - w - 4} y={Math.min(ly, ry, up) - 10} width={2 * w + 8} height={8 + 12 * fc.teeth} fill="#fff" /> : null}
                </g>
              </g>
            );
          })() : null}
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
        {fc.sweat > 0 ? (
          <g transform={`translate(0 ${(frame * 0.6 + sd) % 24}) scale(${0.7 + 0.3 * fc.sweat})`} style={{ transformOrigin: "336px 170px" }} opacity={Math.min(1, fc.sweat * 1.2)}>
            <path d="M330 140 C344 168 356 184 343 199 C330 210 310 197 317 179 Z" fill="#8FD3F5" />
            <ellipse cx={330} cy={186} rx={4} ry={7} fill="#fff" opacity={0.7} />
          </g>
        ) : null}
        {fc.vein > 0 ? (
          <path d="M300 70 l14 14 m0 -14 l-14 14 M318 60 l10 22 m-22 -6 l24 -8" stroke="#E2445C" strokeWidth={7} strokeLinecap="round"
            opacity={fc.vein} transform={`scale(${1 + 0.12 * Math.abs(Math.sin(frame / 3))})`} style={{ transformOrigin: "312px 74px" }} />
        ) : null}
        {fc.tear > 0.5 ? [150, 250].map((x, i) => {
          const s = x < 200 ? -1 : 1;
          const drop = ((frame * 2.4 + i * 37 + sd) % 70) / 70;
          return (
            <g key={x} opacity={fc.tear}>
              <path d={`M${x + s * 18} 248 Q${x + s * 30} 290 ${x + s * 26} ${300 + 30 * fc.tear}`} stroke="#8FD3F5" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85} />
              <ellipse cx={x + s * 26} cy={300 + 30 * fc.tear + drop * 60} rx={6} ry={9} fill="#8FD3F5" opacity={1 - drop} />
            </g>
          );
        }) : null}
        {fc.shock > 0 ? [-1, 1].map((sx) => (
          <g key={sx} stroke="#2A2230" strokeWidth={7} strokeLinecap="round" opacity={fc.shock}>
            {[0, 1, 2].map((k) => {
              const a = ((sx < 0 ? 200 + k * 25 : -20 - k * 25) * Math.PI) / 180; // fan out from the head top corners
              const len = 20 + 8 * Math.abs(Math.sin(frame / 2 + k));
              const [cx, cy, r] = [200, 150, 168];
              return <line key={k} x1={cx + r * Math.cos(a)} y1={cy + r * Math.sin(a)} x2={cx + (r + len) * Math.cos(a)} y2={cy + (r + len) * Math.sin(a)} />;
            })}
          </g>
        )) : null}
      </g>
    </svg>
  );
};
