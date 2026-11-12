import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { TransitionPresentation } from "@remotion/transitions";
import { Captions, type Cap } from "../explainer/Captions";
import { LabelPill, PopIn, Sfx, THEME, TRANSITION_FRAMES as T } from "../explainer/kit";

// Shared plumbing for the hook shorts (1080×1920, one ElevenLabs take each, cut mid-silence by scripts/align.py).
export const FPS = 30;
export const HOLD = 75; // frames after the take ends: the comment card stays readable
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ramp = (f: number, a: number, len = 8) => interpolate(f, [a, a + len], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
export const rnd = (s: number) => {
  const x = Math.sin(s * 12.9898 + 4.1) * 43758.5453;
  return x - Math.floor(x);
};

type TL = { duration: number; audio: string; scenes: { id: string; start: number; end: number }[]; captions: Cap[] };
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, "");

// Scene starts/lengths (transition centred on each cut) and W(scene, word, nth) = local frame of a spoken word.
export const timing = (tl: TL) => {
  const N = tl.scenes.length;
  const TOTAL = Math.ceil(tl.duration * FPS) + HOLD;
  const START = tl.scenes.map((s, i) => (i ? Math.round(s.start * FPS) - T / 2 : 0));
  const DUR = tl.scenes.map((s, i) => (i < N - 1 ? Math.round(s.end * FPS) + T / 2 : TOTAL) - START[i]);
  const W = (i: number, word: string, nth = 0) => {
    const c = tl.captions.filter((x) => x.scene === i && norm(x.w) === word)[nth];
    if (!c) throw new Error(`word "${word}" #${nth} not in scene ${i}`);
    return Math.round(c.s * FPS) - START[i];
  };
  const LAST = Math.round(tl.captions[tl.captions.length - 1].e * FPS) - START[N - 1]; // last word ends (local, final scene)
  return { TOTAL, START, DUR, W, LAST };
};

export const Short: React.FC<{
  tl: TL; scenes: React.FC[]; trans: TransitionPresentation<never>[]; music: string; hide?: number[];
}> = ({ tl, scenes, trans, music, hide = [3] }) => {
  const { DUR, START } = timing(tl);
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <TransitionSeries>
        {scenes.flatMap((Scene, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DUR[i]}>
            <Scene />
          </TransitionSeries.Sequence>,
          ...(i < scenes.length - 1
            ? [<TransitionSeries.Transition key={`t${i}`} presentation={trans[i % trans.length]} timing={linearTiming({ durationInFrames: T })} />]
            : []),
        ])}
      </TransitionSeries>
      <Captions caps={tl.captions} hideScenes={hide} />
      <Audio src={staticFile(tl.audio)} volume={1} />
      <Audio src={staticFile(music)} volume={0.1} />
      {START.slice(1).map((s) => <Sfx key={s} at={s - 2} src="sfx/whoosh.wav" volume={0.45} />)}
    </AbsoluteFill>
  );
};

// ── overlays ────────────────────────────────────────────────────────────────

export const Pill: React.FC<{ text: string; delay: number; top: number; color?: string; fontSize?: number; exit?: boolean }> = ({ text, delay, top, color, fontSize = 52, exit }) => (
  <LabelPill text={text} delay={delay} color={color} fontSize={fontSize} exit={exit}
    style={{ left: 0, width: 1080, top, display: "flex", justifyContent: "center" }} />
);

// Thought cloud centred at cx; the trailing dots point toward (tx) = the thinker's head.
export const Thought: React.FC<{ cx: number; top: number; delay: number; w?: number; h?: number; tx?: number; out?: number; children: React.ReactNode }> = ({ cx, top, delay, w = 300, h = 250, tx = 540, out = 0, children }) => {
  const f = useCurrentFrame();
  const bob = Math.sin((f + cx) / 13) * 8;
  const dir = (tx - cx) / 600;
  return (
    <PopIn delay={delay} exit={false} style={{ left: cx - w / 2, top: top + bob, opacity: 1 - out }}>
      <div style={{ transform: `scale(${1 - out})` }}>
        <svg width={w} height={h + 90} viewBox={`0 0 ${w} ${h + 90}`} style={{ position: "absolute", overflow: "visible" }}>
          <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={THEME.paper} />
          <circle cx={w / 2 + dir * w * 0.35} cy={h + 22} r={18} fill={THEME.paper} />
          <circle cx={w / 2 + dir * w * 0.55} cy={h + 64} r={11} fill={THEME.paper} />
        </svg>
        <div style={{ position: "relative", width: w, height: h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: THEME.font }}>
          {children}
        </div>
      </div>
    </PopIn>
  );
};

// Speech bubble with a tail toward the speaker (tail = "left" | "right" | "down").
export const Say: React.FC<{ left: number; top: number; delay: number; text: string; tail?: "left" | "right" | "down"; size?: number; bg?: string; ink?: string; exit?: boolean }> = ({ left, top, delay, text, tail = "down", size = 54, bg = THEME.paper, ink = THEME.ink, exit = true }) => (
  <PopIn delay={delay} exit={exit} style={{ left, top }}>
    <div style={{ position: "relative", background: bg, borderRadius: 34, padding: "18px 34px", fontFamily: THEME.font, fontWeight: 900, fontSize: size, color: ink, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.15)" }}>
      {text}
      <svg width={60} height={50} style={{ position: "absolute", left: tail === "left" ? 30 : tail === "right" ? undefined : "45%", right: tail === "right" ? 30 : undefined, bottom: -36 }}>
        <path d={tail === "right" ? "M10 0 L60 0 L50 46 Z" : tail === "left" ? "M0 0 L50 0 L10 46 Z" : "M0 0 L60 0 L30 46 Z"} fill={bg} />
      </svg>
    </div>
  </PopIn>
);

// Big rubber stamp that slams in at `at`.
export const Stamp: React.FC<{ at: number; text: string; top?: number; size?: number; color?: string; rot?: number }> = ({ at, text, top = 400, size = 150, color = THEME.amber, rot = -8 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 11, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * s})`, opacity: Math.min(1, s * 2) }}>
      <div style={{ border: `14px solid ${color}`, borderRadius: 30, padding: "4px 50px", background: "rgba(30,36,64,0.92)", fontFamily: THEME.font, fontWeight: 900, fontSize: size, color, letterSpacing: 6, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// End card: the comment question, pops after the last word and stays to the end.
export const CommentCta: React.FC<{ at: number; text: string; top?: number; chime?: boolean }> = ({ at, text, top = 1170, chime = true }) => {
  const f = useCurrentFrame();
  const wob = f >= at + 20 ? Math.sin((f - at) / 6) * 2 : 0;
  return (
    <>
      <PopIn delay={at} exit={false} style={{ left: 70, top, width: 940 }}>
        <div style={{ background: THEME.paper, borderRadius: 40, padding: "26px 34px", display: "flex", alignItems: "center", gap: 26, boxShadow: "0 12px 0 rgba(0,0,0,0.2)", transform: `rotate(${wob}deg)` }}>
          <svg width={110} height={110} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <circle cx={50} cy={50} r={48} fill={THEME.primary} />
            <rect x={20} y={26} width={60} height={40} rx={12} fill="#fff" />
            <path d="M34 64 L30 80 L48 64 Z" fill="#fff" />
            {[36, 50, 64].map((x) => <circle key={x} cx={x} cy={46} r={5} fill={THEME.primary} />)}
          </svg>
          <div style={{ fontFamily: THEME.font }}>
            <div style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.08, color: THEME.ink }}>{text}</div>
            <div style={{ fontWeight: 800, fontSize: 36, color: THEME.primary, marginTop: 6 }}>Tulis di komentar!</div>
          </div>
        </div>
      </PopIn>
      {chime ? <Sfx at={at} src="sfx/confirmation_001.ogg" volume={0.45} /> : null}
    </>
  );
};

// Rolling number (id-ID thousands dots).
export const Count: React.FC<{ from: number; to: number; a: number; b: number; size?: number; color?: string; suffix?: string }> = ({ from, to, a, b, size = 150, color = THEME.paper, suffix = "" }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `16px ${THEME.navy}`, paintOrder: "stroke fill", textShadow: "0 10px 0 rgba(0,0,0,0.25)" }}>
      {Math.round(v).toLocaleString("id-ID")}{suffix}
    </span>
  );
};

// ── props & icons (own drawings) ─────────────────────────────────────────────

export const Clock: React.FC<{ w?: number; min: number; hour?: number }> = ({ w = 160, min, hour }) => {
  const h = hour ?? min / 12 + 300;
  return (
    <svg width={w} height={w} viewBox="0 0 100 100">
      <circle cx={52} cy={53} r={46} fill="#000" opacity={0.15} />
      <circle cx={50} cy={50} r={46} fill={THEME.paper} stroke={THEME.primary} strokeWidth={7} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={49} y={10} width={2.5} height={i % 3 ? 5 : 9} fill={THEME.ink} transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <rect x={47.5} y={28} width={5} height={24} rx={2.5} fill={THEME.ink} transform={`rotate(${h} 50 50)`} />
      <rect x={48.5} y={16} width={3} height={36} rx={1.5} fill={THEME.primary} transform={`rotate(${min * 6} 50 50)`} />
      <circle cx={50} cy={50} r={4} fill={THEME.amber} />
    </svg>
  );
};

export const Calendar: React.FC<{ w?: number; top: string; big: string; color?: string }> = ({ w = 240, top, big, color = THEME.primary }) => (
  <div style={{ width: w, borderRadius: w * 0.12, overflow: "hidden", background: THEME.paper, boxShadow: "0 10px 0 rgba(0,0,0,0.18)", fontFamily: THEME.font, textAlign: "center" }}>
    <div style={{ background: color, color: THEME.paper, fontWeight: 900, fontSize: w * 0.15, padding: `${w * 0.04}px 0` }}>{top}</div>
    <div style={{ fontWeight: 900, fontSize: w * 0.42, color: THEME.ink, lineHeight: 1.25 }}>{big}</div>
  </div>
);

export const Puff: React.FC<{ at: number; x: number; y: number; r?: number }> = ({ at, x, y, r = 120 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 18) return null;
  const t = (f - at) / 18;
  return (
    <svg width={r * 4} height={r * 4} style={{ position: "absolute", left: x - r * 2, top: y - r * 2, overflow: "visible" }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return <circle key={i} cx={r * 2 + Math.cos(a) * r * t} cy={r * 2 + Math.sin(a) * r * t} r={r * 0.35 * (1 - t) + 4} fill="#fff" opacity={0.9 * (1 - t)} />;
      })}
    </svg>
  );
};

export const HeartIcon: React.FC<{ w?: number; color?: string; crack?: number }> = ({ w = 120, color = THEME.pink, crack = 0 }) => {
  const id = React.useId().replace(/:/g, "");
  const d = "M50 88 L12 50 A20 20 0 0 1 50 22 A20 20 0 0 1 88 50 Z";
  const zig = "L50 22 L44 40 L56 52 L44 66 L50 88 L50 100";
  return (
    <svg width={w} height={w} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`hl${id}`}><path d={`M0 0 L50 0 ${zig} L0 100 Z`} /></clipPath>
        <clipPath id={`hr${id}`}><path d={`M100 0 L50 0 ${zig} L100 100 Z`} /></clipPath>
      </defs>
      {crack ? (
        <>
          <path d={d} fill={color} clipPath={`url(#hl${id})`} transform={`translate(${-14 * crack} ${30 * crack * crack}) rotate(${-18 * crack} 50 88)`} />
          <path d={d} fill={color} clipPath={`url(#hr${id})`} transform={`translate(${14 * crack} ${30 * crack * crack}) rotate(${18 * crack} 50 88)`} />
        </>
      ) : <path d={d} fill={color} />}
    </svg>
  );
};

export const Bowl: React.FC<{ w?: number; steam?: boolean }> = ({ w = 220, steam = true }) => {
  const f = useCurrentFrame();
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 220 176" style={{ overflow: "visible" }}>
      {steam ? [70, 110, 150].map((x, i) => {
        const t = ((f / 40 + i / 3) % 1);
        return <path key={x} d={`M${x} ${70 - t * 50} q-12 -16 0 -32 q12 -16 0 -32`} stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.6 * Math.sin(t * Math.PI)} />;
      }) : null}
      <ellipse cx={110} cy={168} rx={92} ry={10} fill="#000" opacity={0.18} />
      <ellipse cx={110} cy={86} rx={104} ry={22} fill="#E9A23B" />
      <ellipse cx={92} cy={82} rx={30} ry={8} fill="#F6C46A" />
      <ellipse cx={140} cy={88} rx={18} ry={6} fill="#5BAE5B" />
      <path d="M6 86 Q16 160 110 162 Q204 160 214 86 Z" fill={THEME.paper} />
      <path d="M150 156 Q200 140 214 86 L190 86 Q182 136 140 152 Z" fill="#000" opacity={0.08} />
      <rect x={30} y={112} width={160} height={10} rx={5} fill={THEME.teal} opacity={0.8} />
    </svg>
  );
};

export const Salt: React.FC<{ w?: number }> = ({ w = 110 }) => (
  <svg width={w} height={w * 1.4} viewBox="0 0 100 140">
    <path d="M22 50 Q20 30 50 26 Q80 30 78 50 L84 126 Q50 138 16 126 Z" fill="#F4F7FB" />
    <path d="M60 30 Q78 34 78 50 L84 126 Q72 131 62 132 Z" fill="#000" opacity={0.08} />
    <rect x={26} y={8} width={48} height={24} rx={8} fill="#B9C2D3" />
    {[38, 50, 62].map((x) => <circle key={x} cx={x} cy={18} r={3} fill="#5A6275" />)}
    <text x={50} y={96} textAnchor="middle" fontFamily={THEME.font} fontWeight={900} fontSize={30} fill={THEME.primary}>S</text>
  </svg>
);

export const Brain: React.FC<{ w?: number }> = ({ w = 150 }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 150 120">
    <path d="M75 18 C60 2 30 6 26 28 C6 32 4 60 18 70 C10 92 34 110 54 102 C62 116 88 116 96 102 C116 110 140 92 132 70 C146 60 144 32 124 28 C120 6 90 2 75 18 Z" fill={THEME.pink} />
    <path d="M75 18 L75 106 M42 40 Q56 50 46 64 M108 40 Q94 50 104 64 M36 80 Q50 76 56 88 M114 80 Q100 76 94 88" stroke="#E46F96" strokeWidth={6} strokeLinecap="round" fill="none" />
  </svg>
);

export const Bus: React.FC<{ w?: number }> = ({ w = 170 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 170 120">
    <rect x={8} y={14} width={154} height={82} rx={18} fill={THEME.teal} />
    <rect x={8} y={70} width={154} height={26} rx={8} fill="#0E8B78" />
    {[22, 62, 102].map((x) => <rect key={x} x={x} y={26} width={34} height={30} rx={6} fill="#DDF7F1" />)}
    <rect x={140} y={26} width={16} height={30} rx={4} fill="#DDF7F1" />
    {[44, 128].map((x) => <g key={x}><circle cx={x} cy={98} r={15} fill={THEME.ink} /><circle cx={x} cy={98} r={6} fill="#9AA3B8" /></g>)}
  </svg>
);

export const Towers: React.FC<{ w?: number; grow?: number }> = ({ w = 170, grow = 1 }) => (
  <svg width={w} height={w} viewBox="0 0 170 170">
    {([[14, 70, THEME.primary], [62, 120, THEME.primaryDark], [112, 90, THEME.teal]] as const).map(([x, h, c], i) => {
      const hh = h * Math.min(1, Math.max(0, grow * 1.6 - i * 0.3));
      return (
        <g key={x}>
          <rect x={x} y={160 - hh} width={44} height={hh} rx={5} fill={c} />
          {Array.from({ length: Math.floor(hh / 22) }).map((_, r) => <rect key={r} x={x + 10} y={160 - hh + 10 + r * 22} width={24} height={9} rx={2} fill="#fff" opacity={0.6} />)}
        </g>
      );
    })}
    <rect x={4} y={158} width={162} height={8} rx={4} fill={THEME.ink} opacity={0.3} />
  </svg>
);

export const Sailboat: React.FC<{ w?: number }> = ({ w = 160 }) => (
  <svg width={w} height={w} viewBox="0 0 160 160">
    <path d="M78 14 L78 108 L22 108 Z" fill={THEME.paper} stroke="#C9CFDB" strokeWidth={3} />
    <path d="M84 30 L84 108 L132 108 Z" fill={THEME.amber} />
    <rect x={77} y={10} width={5} height={104} fill="#8D6440" />
    <path d="M12 112 L148 112 L128 140 L32 140 Z" fill="#B0703D" />
    <path d="M12 112 L148 112 L144 118 L16 118 Z" fill="#D9A06A" />
    <path d="M0 146 Q20 138 40 146 T80 146 T120 146 T160 146" stroke="#4FA8D8" strokeWidth={6} fill="none" />
  </svg>
);

export const Rooster: React.FC<{ w?: number; crow?: number }> = ({ w = 200, crow = 0 }) => (
  <svg width={w} height={w} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <ellipse cx={100} cy={190} rx={60} ry={8} fill="#000" opacity={0.2} />
    <path d="M70 150 L66 186 M110 150 L114 186" stroke="#E9A23B" strokeWidth={7} strokeLinecap="round" />
    <path d="M40 60 Q10 70 18 120 Q30 90 46 100 Q24 130 50 150 Z" fill={THEME.teal} />
    <ellipse cx={92} cy={118} rx={58} ry={42} fill="#C9643A" />
    <path d="M60 116 Q92 150 128 120" stroke="#A44E2A" strokeWidth={8} fill="none" strokeLinecap="round" />
    <g transform={`rotate(${-18 * crow} 130 90)`}>
      <rect x={118} y={52} width={30} height={56} rx={14} fill="#F2EEE6" />
      <circle cx={140} cy={50} r={24} fill="#F2EEE6" />
      <path d="M126 28 Q130 14 138 26 Q144 12 150 26 Q158 16 158 34 Z" fill="#E2445C" />
      <circle cx={146} cy={46} r={4} fill={THEME.ink} />
      <path d={`M162 50 L182 ${54 - 6 * crow} L162 ${58 + 4 * crow} Z`} fill="#E9A23B" />
      <path d="M156 62 Q160 78 150 76 Q148 66 156 62 Z" fill="#E2445C" />
    </g>
  </svg>
);

export const Car: React.FC<{ w?: number; color?: string }> = ({ w = 420, color = THEME.amber }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 420 176">
    <ellipse cx={210} cy={166} rx={190} ry={10} fill="#000" opacity={0.2} />
    <path d="M20 120 Q20 86 60 82 L120 78 L160 30 Q170 22 186 22 L290 22 Q306 22 316 34 L350 80 L392 88 Q406 92 406 110 L406 134 L20 134 Z" fill={color} />
    <path d="M170 38 L282 38 Q292 38 298 46 L326 80 L140 80 Z" fill="#CFE6FF" />
    <rect x={230} y={36} width={8} height={46} fill={color} />
    <rect x={392} y={98} width={14} height={14} rx={4} fill="#FFF2B8" />
    {[100, 320].map((x) => <g key={x}><circle cx={x} cy={136} r={30} fill={THEME.ink} /><circle cx={x} cy={136} r={12} fill="#9AA3B8" /></g>)}
  </svg>
);

export const Box: React.FC<{ w?: number }> = ({ w = 200 }) => (
  <svg width={w} height={w} viewBox="0 0 200 200">
    <ellipse cx={100} cy={186} rx={80} ry={10} fill="#000" opacity={0.2} />
    <path d="M20 60 L100 30 L180 60 L180 160 L100 190 L20 160 Z" fill="#C99A62" />
    <path d="M100 90 L180 60 L180 160 L100 190 Z" fill="#B0844F" />
    <path d="M20 60 L100 90 L180 60 L100 30 Z" fill="#DDB27E" />
    <path d="M60 45 L140 75 L140 105" stroke={THEME.primary} strokeWidth={14} fill="none" />
  </svg>
);
