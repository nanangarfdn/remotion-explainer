import React from "react";
import { useCurrentFrame } from "remotion";

// Orange tabby, own drawing, semi-realistic: almond eyes with slit pupils, shaded fur, tabby stripes, chest ruff.
// Origin = neck point (0,0) in a viewBox -200 -230 400 400; sitting paws rest at y ≈ 146.
// head / body rotate separately around the neck so the righting reflex can turn the head first, then the body.
// Life: lids close over 7 f (sometimes twice), 6-segment tail wave with phase lag, independent ear flicks,
// idle head tilt + eye drift, breathing, whisker twitch. Action knobs: crouch (−1 stretch … 1 squash), earsBack, paddle, tailAmp.
export type CatPose = "sit" | "fall" | "spread" | "sleep" | "stand";

const FUR = "#F0923A";
const FUR_L = "#FFB767";
const FUR_D = "#C96A1E";
const STRIPE = "#B5571A";
const CREAM = "#FFF1DE";
const CREAM_D = "#F1D6B4";
const INK = "#2A1B14";
const PINK = "#F29AAE";

const bump = (t: number, len: number) => (t >= 0 && t <= len ? Math.sin((Math.PI * t) / len) : 0);
const TAIL_BASE: Record<CatPose, number[]> = {
  sit: [-4, -22, -50, -80, -104, -122],
  stand: [-4, -22, -50, -80, -104, -122],
  fall: [-60, -80, -96, -108, -118, -126],
  spread: [-70, -84, -96, -104, -110, -116],
  sleep: [100, 150, 175, 185, 195, 210],
};

export const Cat: React.FC<{
  w?: number;
  pose?: CatPose;
  head?: number; // deg
  body?: number; // deg
  look?: { x: number; y: number };
  eyes?: "open" | "wide" | "closed" | "happy";
  mouth?: "smile" | "o" | "flat";
  blink?: boolean;
  idle?: boolean;
  crouch?: number;
  earsBack?: number;
  paddle?: number;
  tailAmp?: number;
  seed?: number;
}> = ({ w = 400, pose = "sit", head = 0, body = 0, look = { x: 0, y: 0 }, eyes = "open", mouth = "smile", blink = true, idle = true, crouch = 0, earsBack = 0, paddle, tailAmp = 1, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 37;
  const id = React.useId().replace(/:/g, "");
  const sleeping = pose === "sleep";
  const breathe = sleeping ? Math.sin(f / 16) * 5 : Math.sin(f / 20) * 2.2;
  const airborne = pose === "fall" || pose === "spread";
  const legsOut = pose === "spread" ? 1 : pose === "fall" ? 0.35 : 0;
  const pad = paddle ?? (airborne ? 0.6 : 0);

  // lids: a 7-frame close/open every ~3.8 s, a double blink every third time
  const cyc = f % 113;
  const lidBlink = blink && eyes !== "closed" ? Math.max(bump(cyc, 7), Math.floor(f / 113) % 3 === 0 ? bump(cyc - 9, 7) : 0) : 0;
  const lid = Math.min(1, lidBlink);
  const ey = eyes === "closed" || lid > 0.92 ? "closed" : eyes;

  // idle life
  const tilt = idle && !sleeping ? Math.sin(f / 47) * 3 + Math.sin(f / 23) * 1.2 : 0;
  const lx = look.x + (idle && !sleeping ? Math.sin(f / 61) * 0.18 : 0);
  const ly = look.y + (idle && !sleeping ? Math.sin(f / 83 + 1) * 0.1 : 0);
  const earL = bump(f % 131, 8) * 14;
  const earR = bump((f + 57) % 149, 7) * 16;
  const whisk = Math.sin(f / 9) * 1.5 + bump((f + 20) % 90, 6) * 4;
  const cr = crouch;
  const g = (n: string) => `url(#${n}${id})`;

  // tail = 6-segment chain, each segment lags the previous (travelling wave)
  const base = TAIL_BASE[pose];
  const segLen = sleeping ? 40 : 34;
  const pts: [number, number][] = [sleeping ? [100, 118] : [48, 120]];
  base.forEach((a0, i) => {
    const amp = (sleeping ? 1.5 : 5) * tailAmp * (0.4 + i * 0.35);
    const a = ((a0 + Math.sin(f / 13 - i * 0.75) * amp * (sleeping ? 1 : 1.6)) * Math.PI) / 180;
    const [px, py] = pts[pts.length - 1];
    pts.push([px + Math.cos(a) * segLen, py + Math.sin(a) * segLen]);
  });
  const tailD = pts.reduce((d, p, i) => {
    if (i === 0) return `M${p[0]} ${p[1]}`;
    const n = pts[i + 1];
    if (!n) return `${d} L${p[0]} ${p[1]}`;
    return `${d} Q${p[0]} ${p[1]} ${(p[0] + n[0]) / 2} ${(p[1] + n[1]) / 2}`;
  }, "");
  const tip = pts[pts.length - 1];

  const paw = (x: number, y: number, beans: boolean) => (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={21} ry={13} fill={CREAM} />
      {beans ? (
        <g fill={PINK}>
          <ellipse cx={0} cy={3} rx={8} ry={6} />
          {[-11, -4, 4, 11].map((bx) => <circle key={bx} cx={bx} cy={-7} r={3.4} />)}
        </g>
      ) : (
        <g stroke={CREAM_D} strokeWidth={2.5} strokeLinecap="round">
          <path d="M-7 -4 L-7 6" /><path d="M0 -5 L0 7" /><path d="M7 -4 L7 6" />
        </g>
      )}
    </g>
  );
  const leg = (x: number, y: number, side: 1 | -1, front: boolean) => {
    const swing = pad * Math.sin(f / 4.5 + (front ? 0 : 1.6) + (side > 0 ? Math.PI : 0)) * 22;
    const ang = side * (front ? 70 : 100) * legsOut + swing;
    const len = front ? 98 : 90;
    const knee = pad ? 1 - 0.12 * Math.max(0, Math.sin(f / 4.5 + side)) : 1;
    return (
      <g transform={`translate(${x} ${y}) rotate(${ang}) scale(1 ${knee})`}>
        <rect x={-14} y={0} width={28} height={len} rx={14} fill={front ? g("fur") : FUR_D} />
        {[30, 56].map((sy) => <path key={sy} d={`M-13 ${sy} q13 8 26 0`} stroke={STRIPE} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.75} />)}
        {paw(0, len, pose === "spread")}
      </g>
    );
  };

  const tail = (
    <g>
      <path d={tailD} stroke={FUR} strokeWidth={sleeping ? 30 : 26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={tailD} stroke={STRIPE} strokeWidth={sleeping ? 30 : 26} fill="none" strokeDasharray="9 19" opacity={0.6} />
      <circle cx={tip[0]} cy={tip[1]} r={sleeping ? 15 : 13} fill={STRIPE} />
    </g>
  );

  const torso = sleeping ? (
    <g transform={`scale(1 ${1 + breathe * 0.012})`} style={{ transformOrigin: "0px 150px" } as React.CSSProperties}>
      <ellipse cx={10} cy={84} rx={138} ry={70} fill={g("fur")} />
      {[-70, -30, 10, 50, 90].map((x) => <path key={x} d={`M${x} 18 q12 30 0 62`} stroke={STRIPE} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.7} />)}
      <ellipse cx={40} cy={126} rx={70} ry={20} fill={CREAM} opacity={0.9} />
    </g>
  ) : (
    <g>
      {!airborne ? [-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * 60} cy={98 + cr * 6} rx={56 + cr * 4} ry={58 - cr * 6} fill={FUR_D} />
          <path d={`M${s * 30} ${70 + cr * 6} q${s * 30} -14 ${s * 58} 6`} stroke={STRIPE} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d={`M${s * 30} ${96 + cr * 6} q${s * 32} -12 ${s * 64} 8`} stroke={STRIPE} strokeWidth={8} fill="none" strokeLinecap="round" />
          {paw(s * 86, 146, false)}
        </g>
      )) : null}
      {airborne ? <>{leg(-50, 92, -1, false)}{leg(50, 92, 1, false)}</> : null}
      <path d={`M-48 -8 C -70 30, -82 ${100 + breathe}, -60 132 Q 0 ${150 + breathe} 60 132 C 82 ${100 + breathe}, 70 30, 48 -8 Z`} fill={g("fur")} />
      {[1, 2, 3].map((k) => [-1, 1].map((s) => (
        <path key={`${k}${s}`} d={`M${s * 66} ${k * 30 - 4} q${-s * 14} 8 ${-s * 22} 22`} stroke={STRIPE} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
      )))}
      <path d="M-40 -6 L-30 18 L-40 30 L-24 46 L-30 64 L-12 80 L0 108 L12 80 L30 64 L24 46 L40 30 L30 18 L40 -6 Z" fill={CREAM} transform={`scale(${1 + breathe * 0.01})`} />
      <path d="M-14 40 l14 10 l14 -10 M-10 66 l10 8 l10 -8" stroke={CREAM_D} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );

  // crouch squashes the body down onto the paws (and stretches when negative); the head rides on it
  const sy = 1 - 0.14 * cr;
  const sx = 1 + 0.06 * cr;
  const drop = cr * 34;
  const bodyG = (
    <g transform={`rotate(${body}) translate(0 146) scale(${sx} ${sy}) translate(0 -146) translate(0 ${-breathe * 0.4})`}>
      {tail}
      {torso}
      {!sleeping ? <>{leg(-24, 36, -1, true)}{leg(24, 36, 1, true)}</> : null}
    </g>
  );

  const eye = (x: number, s: 1 | -1) => {
    const y = -92;
    if (ey === "closed") return <path d={`M${x - 24} ${y} q24 14 48 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (ey === "happy") return <path d={`M${x - 24} ${y + 6} q24 -20 48 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
    const big = ey === "wide" ? 1.2 : 1;
    const rx = 28 * big;
    const ry = 20 * big;
    const almond = `M${x - rx} ${y + 2} Q${x - rx * 0.3} ${y - ry * 1.5} ${x + rx} ${y - 2} Q${x + rx * 0.3} ${y + ry * 1.3} ${x - rx} ${y + 2} Z`;
    const px = x + lx * 10;
    const py = y + ly * 6;
    return (
      <g transform={`translate(0 ${y}) scale(1 ${1 - lid * 0.92}) translate(0 ${-y})`}>
        <clipPath id={`e${s}${id}`}><path d={almond} /></clipPath>
        <path d={almond} fill={g("iris")} />
        <g clipPath={`url(#e${s}${id})`}>
          <ellipse cx={px} cy={py} rx={ey === "wide" ? 12 : 5} ry={ry * 0.95} fill={INK} />
          <circle cx={px + 9} cy={py - 8} r={5.5} fill="#fff" />
          <circle cx={px - 8} cy={py + 9} r={2.5} fill="#fff" opacity={0.7} />
          <rect x={x - rx} y={y - ry * 1.6} width={rx * 2} height={ry * 0.7} fill={FUR_D} opacity={0.35} />
        </g>
        <path d={almond} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
    );
  };

  const headG = (
    <g transform={`translate(0 ${drop}) rotate(${head + tilt}) translate(0 ${-breathe * 0.6})`}>
      {[-1, 1].map((s) => {
        const flick = s < 0 ? -earL : earR;
        return (
          <g key={s} transform={`rotate(${flick + s * earsBack * 38} ${s * 70} -140) scale(1 ${1 - earsBack * 0.18})`}>
            <path d={`M${s * 96} -112 Q${s * 112} -186 ${s * 104} -214 Q${s * 70} -196 ${s * 30} -160 Z`} fill={FUR} />
            <path d={`M${s * 88} -126 Q${s * 100} -176 ${s * 98} -196 Q${s * 72} -180 ${s * 46} -156 Z`} fill={g("ear")} />
            <path d={`M${s * 66} -150 l${s * 12} -24 M${s * 76} -146 l${s * 14} -18 M${s * 84} -140 l${s * 12} -12`} stroke={CREAM} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      })}
      <path d="M-100 -76 Q-104 -146 -48 -164 Q0 -176 48 -164 Q104 -146 100 -76 L116 -50 L96 -48 L106 -28 L74 -24 Q0 6 -74 -24 L-106 -28 L-96 -48 L-116 -50 Z" fill={g("head")} />
      <path d="M-30 -168 L-20 -132 M0 -172 L0 -134 M30 -168 L20 -132" stroke={STRIPE} strokeWidth={9} strokeLinecap="round" />
      {[-1, 1].map((s) => (
        <g key={s} stroke={STRIPE} strokeWidth={7} fill="none" strokeLinecap="round">
          <path d={`M${s * 98} -84 q${-s * 20} 4 ${-s * 30} 14`} />
          <path d={`M${s * 100} -64 q${-s * 18} 2 ${-s * 26} 12`} />
          <path d={`M${s * 72} -96 q${s * 10} -4 ${s * 22} 0`} />
        </g>
      ))}
      <ellipse cx={0} cy={-26} rx={30} ry={20} fill={CREAM} />
      <ellipse cx={-24} cy={-42} rx={28} ry={21} fill={CREAM} />
      <ellipse cx={24} cy={-42} rx={28} ry={21} fill={CREAM} />
      <path d="M-8 -118 Q0 -84 -6 -64 L6 -64 Q0 -84 8 -118" fill={FUR_L} opacity={0.6} />
      {[-1, 1].map((s) => [0, 1, 2].map((k) => <circle key={`${s}${k}`} cx={s * (18 + k * 9)} cy={-44 + k * 4} r={2} fill={CREAM_D} />))}
      {eye(-44, -1)}
      {eye(44, 1)}
      <path d="M-12 -60 Q0 -66 12 -60 Q8 -50 0 -46 Q-8 -50 -12 -60 Z" fill={g("nose")} />
      <path d="M0 -46 L0 -38" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {mouth === "o" ? (
        <ellipse cx={0} cy={-26} rx={10} ry={12} fill="#6E2434" />
      ) : mouth === "flat" ? (
        <path d="M-14 -32 L14 -32" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      ) : (
        <path d="M-18 -36 q9 9 18 -2 q9 11 18 2" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      {[-1, 1].map((s) => (
        <g key={s} stroke="#fff" strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.95} transform={`rotate(${s * whisk} ${s * 40} -40)`}>
          <path d={`M${s * 40} -46 q${s * 60} -16 ${s * 120} -10`} />
          <path d={`M${s * 42} -38 q${s * 60} -4 ${s * 124} 6`} />
          <path d={`M${s * 40} -30 q${s * 56} 8 ${s * 112} 24`} />
        </g>
      ))}
    </g>
  );

  return (
    <svg width={w} height={w} viewBox="-200 -230 400 400" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`fur${id}`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={FUR_L} /><stop offset="0.55" stopColor={FUR} /><stop offset="1" stopColor={FUR_D} />
        </radialGradient>
        <radialGradient id={`head${id}`} cx="45%" cy="35%" r="75%">
          <stop offset="0" stopColor={FUR_L} /><stop offset="0.6" stopColor={FUR} /><stop offset="1" stopColor={FUR_D} />
        </radialGradient>
        <radialGradient id={`iris${id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#E7F27A" /><stop offset="0.55" stopColor="#9CC83A" /><stop offset="1" stopColor="#4E8A2A" />
        </radialGradient>
        <linearGradient id={`ear${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#F7B9C6" /><stop offset="1" stopColor="#D97C92" />
        </linearGradient>
        <linearGradient id={`nose${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4A0B2" /><stop offset="1" stopColor="#C9637C" />
        </linearGradient>
      </defs>
      {sleeping ? (
        <g transform="translate(0 40)">
          {bodyG}
          <g transform={`translate(-80 ${74 + breathe * 0.8}) rotate(-12) scale(0.86)`}>{headG}</g>
        </g>
      ) : (
        <>
          {bodyG}
          {headG}
        </>
      )}
    </svg>
  );
};
