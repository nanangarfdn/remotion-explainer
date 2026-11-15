import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Captions, type Cap } from "../explainer/Captions";
import { Hero } from "../explainer/Hero";
import { Watermark } from "../brand/Watermark";
import { THEME, TRANSITION_FRAMES as T } from "../explainer/kit";
import { ramp, timing } from "./common";

// Shared cast + frame for narrated vertical shorts (Lalat, Pensiun and later), so a new short only writes its scenes.
export type HeroP = React.ComponentProps<typeof Hero>;
export const A: Partial<HeroP> = { shirt: THEME.orange, shirtShade: THEME.orangeDark };
export const B: Partial<HeroP> = { hairStyle: "bob", outfit: "tee", lashes: true, hair: "#3B2A22", shirt: THEME.primary, shirtShade: THEME.primaryDark };

// Hero placed by its head centre-ish (x) and shoulder line (y)
export const P: React.FC<HeroP & { x: number; y: number; style?: React.CSSProperties }> = ({ x, y, style, ...h }) => (
  <div style={{ position: "absolute", left: x - h.width / 2, top: y - (190 * h.width) / 400, ...style }}>
    <Hero {...h} />
  </div>
);
export const Blurred: React.FC<{ px?: number; children: React.ReactNode }> = ({ px = 8, children }) => (
  <AbsoluteFill style={{ filter: `blur(${px}px)`, transform: "scale(1.06)" }}>{children}</AbsoluteFill>
);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// spoken numbers/acronyms → how they read on screen: [["dua", "puluh", "juta"], "20 juta"]
export const mergeCaps = <C extends Cap>(caps: C[], rules: [string[], string][]) => {
  const out: C[] = [];
  for (let i = 0; i < caps.length; i++) {
    const m = rules.find(([ws]) => ws.every((w, j) => caps[i + j]?.w === w));
    if (m) {
      out.push({ ...caps[i], w: m[1], e: caps[i + m[0].length - 1].e });
      i += m[0].length - 1;
    } else out.push(caps[i]);
  }
  return out;
};

type TL = Parameters<typeof timing>[0];
export const VShort: React.FC<{
  tl: TL;
  scenes: React.FC[];
  trans?: Record<number, () => unknown>; // cut index → presentation; default fade
  banner?: string; // question pill on frame 0, gone at the first cut
  bannerTop?: number;
  bannerSize?: number;
  bannerLoop?: boolean; // also back in the last 14 frames, so the loop reads as one shot
  caps?: Cap[];
  hide?: number[];
  music?: string;
  musicVolume?: (fr: number) => number; // default 0.07 with a 20-frame fade-in, no fade-out (the loop restarts mid-bed)
  children?: React.ReactNode; // extra overlays, drawn under the watermark and captions
}> = ({ tl, scenes, trans = {}, banner, bannerTop = 200, bannerSize = 60, bannerLoop = false, caps, hide, music = "hape2m/music.wav", musicVolume, children }) => {
  const f = useCurrentFrame();
  const { TOTAL, START, DUR } = timing(tl);
  const op = Math.max(1 - ramp(f, START[1] - 6, 8), bannerLoop ? ramp(f, TOTAL - 14, 8) : 0);
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <TransitionSeries>
        {scenes.flatMap((Scene, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DUR[i]}><Scene /></TransitionSeries.Sequence>,
          ...(i < scenes.length - 1
            ? [<TransitionSeries.Transition key={`t${i}`} presentation={(trans[i]?.() ?? fade()) as never} timing={linearTiming({ durationInFrames: T })} />]
            : []),
        ])}
      </TransitionSeries>
      {banner && op > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: bannerTop, display: "flex", justifyContent: "center", opacity: op }}>
          <div style={{ background: THEME.amber, color: THEME.ink, fontFamily: THEME.font, fontWeight: 900, fontSize: bannerSize, padding: "8px 40px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", transform: `rotate(${-2 + Math.sin(f / 10)}deg)` }}>{banner}</div>
        </div>
      ) : null}
      {children}
      <Watermark />
      <Captions caps={caps ?? tl.captions} hideScenes={hide} />
      <Audio src={staticFile(tl.audio)} volume={1} />
      <Audio src={staticFile(music)} volume={musicVolume ?? ((fr) => 0.07 * Math.min(1, fr / 20))} />
    </AbsoluteFill>
  );
};
