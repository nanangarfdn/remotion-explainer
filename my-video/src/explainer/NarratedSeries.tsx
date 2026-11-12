import React from "react";
import { staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TRANSITION_FRAMES } from "./kit";

export { TRANSITION_FRAMES };

// Shape written by scripts/voiceover.mjs (public/voiceover/<id>/timeline.json).
export type Timeline = {
  id: string;
  fps: number;
  durationInFrames: number;
  scenes: { id: string; text: string; audio: string; durationInFrames: number; shot?: string }[];
};

const FADE = fade();

// Composition length once transitions overlap neighbouring scenes.
export const narratedDuration = (t: Timeline) =>
  t.durationInFrames - (t.scenes.length - 1) * TRANSITION_FRAMES;

// One Sequence per narrated scene: its art + its voice line. Unlisted scenes/transitions fall back.
export const NarratedSeries: React.FC<{
  timeline: Timeline;
  scenes: Record<string, React.FC>;
  fallback: React.FC<{ text: string; shot?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- presentations have different prop types
  transitions?: Record<string, TransitionPresentation<any>>; // keyed by the scene it leads INTO
}> = ({ timeline, scenes, fallback: Fallback, transitions = {} }) => (
  <TransitionSeries>
    {timeline.scenes.flatMap((s, i) => {
      const Scene = scenes[s.id];
      const nodes = [];
      if (i > 0) {
        nodes.push(
          <TransitionSeries.Transition
            key={`t-${s.id}`}
            presentation={transitions[s.id] ?? FADE}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />,
        );
      }
      nodes.push(
        <TransitionSeries.Sequence key={s.id} durationInFrames={s.durationInFrames}>
          {Scene ? <Scene /> : <Fallback text={s.text} shot={s.shot} />}
          <Audio src={staticFile(s.audio)} />
        </TransitionSeries.Sequence>,
      );
      return nodes;
    })}
  </TransitionSeries>
);
