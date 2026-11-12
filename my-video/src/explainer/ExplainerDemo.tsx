import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LabelPill, PopIn, PushIn, THEME, TitleCard, colorWipe, whipBlur } from "./kit";

// Placeholder shot: flat sky + ground + round "character". Swap with real SVG/PNG art.
const Shot: React.FC<{ sky: string; ground: string; labels: string[] }> = ({
  sky,
  ground,
  labels,
}) => (
  <AbsoluteFill style={{ background: sky }}>
    <PushIn>
      <AbsoluteFill style={{ top: "68%", background: ground }} />
      <PopIn delay={6} style={{ left: 820, top: 420 }}>
        <div style={{ width: 280, height: 280, borderRadius: "50%", background: "#F2C9A0" }} />
      </PopIn>
      {labels.map((l, i) => (
        <LabelPill key={l} text={l} delay={18 + i * 6} style={{ left: 560 + i * 420, top: 300 }} />
      ))}
    </PushIn>
  </AbsoluteFill>
);

const WIPE = colorWipe(THEME.amber);
const WHIP = whipBlur();
const FADE = fade();
const T = 16;

export const SCENES = [75, 90, 90, 75];
export const EXPLAINER_DEMO_DURATION = SCENES.reduce((a, b) => a + b, 0) - 3 * T;

export const ExplainerDemo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
      <TitleCard text="apa jadinya?" />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={WIPE} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
      <Shot sky="#BFE3F5" ground="#7DBE5A" labels={["kopi", "kakao"]} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={WHIP} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
      <Shot sky={THEME.navy} ground="#3E5A3A" labels={["adrenalin"]} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={FADE} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
      <TitleCard text="kok gitu?" bg={THEME.mint} color={THEME.ink} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
