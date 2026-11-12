import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Nunito";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const { fontFamily } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });

// Own palette (deliberately not the reference channel's red/yellow).
export const THEME = {
  primary: "#4B3FD8",
  primaryDark: "#3328A8",
  amber: "#FFB020",
  teal: "#16B8A0",
  mint: "#BDF2E4",
  // decor accents (never the reference red)
  pink: "#FF8FB1",
  orange: "#F28C38",
  orangeDark: "#D9752A",
  navy: "#1E2440",
  ink: "#1E1E24",
  paper: "#FFFFFF",
  font: fontFamily,
};

// Default transition length; PopIn exits finish before it starts.
export const TRANSITION_FRAMES = 16;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = Easing.inOut(Easing.cubic);

// ── Transitions ────────────────────────────────────────────────────────────

type WipeProps = { color: string; edge: string };

// Two-tone panel sweeps in, covers the cut, sweeps out. Edge colour leads by a hair.
const ColorWipe: React.FC<TransitionPresentationComponentProps<WipeProps>> = ({
  presentationProgress: p,
  presentationDirection,
  children,
  passedProps,
}) => {
  const xAt = (q: number) =>
    q < 0.5
      ? interpolate(q, [0, 0.5], [100, 0], { ...clamp, easing: ease })
      : interpolate(q, [0.5, 1], [0, -100], { ...clamp, easing: ease });
  const visible = presentationDirection === "exiting" ? p < 0.5 : p >= 0.5;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: visible ? 1 : 0 }}>{children}</AbsoluteFill>
      {presentationDirection === "entering" ? (
        <>
          <AbsoluteFill style={{ background: passedProps.edge, transform: `translateX(${xAt(Math.min(1, p + 0.07))}%)` }} />
          <AbsoluteFill style={{ background: passedProps.color, transform: `translateX(${xAt(p)}%)` }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const colorWipe = (color: string, edge = THEME.primary): TransitionPresentation<WipeProps> => ({
  component: ColorWipe,
  props: { color, edge },
});

// Fast horizontal slide with motion blur (whip pan between shots).
const WhipBlur: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  presentationProgress: p,
  presentationDirection,
  children,
}) => {
  const t = Easing.inOut(Easing.quad)(p);
  const entering = presentationDirection === "entering";
  const x = entering ? (1 - t) * 100 : -t * 100;
  const blur = Math.sin(t * Math.PI) * 24;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%)`, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const whipBlur = (): TransitionPresentation<Record<string, never>> => ({
  component: WhipBlur,
  props: {},
});

// ── Camera ─────────────────────────────────────────────────────────────────

// One depth layer of a shot. Stack several with growing `to`/`drift` for parallax:
// back (to 1.03, blur 2) → character (1.07) → foreground (1.11).
export const Layer: React.FC<{
  children: React.ReactNode;
  to?: number;
  drift?: number; // px of sideways travel over the shot
  blur?: number;
}> = ({ children, to = 1.08, drift = 0, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${-drift * t}px) scale(${1 + (to - 1) * t})`,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Films a 1920×1080 world through a zoomed camera (portrait cuts): scale k, world (x, y) = frame top-left.
export type Cam = { k: number; x: number; y: number };
export const World: React.FC<{ cam?: Cam; children: React.ReactNode }> = ({ cam, children }) =>
  cam ? (
    <div style={{
      position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
      transform: `scale(${cam.k}) translate(${-cam.x}px, ${-cam.y}px)`,
    }}>
      {children}
    </div>
  ) : <>{children}</>;

// Single-layer push-in (kept for simple shots).
export const PushIn: React.FC<{ children: React.ReactNode; to?: number }> = ({ children, to = 1.08 }) => (
  <Layer to={to}>{children}</Layer>
);

// ── Elements ───────────────────────────────────────────────────────────────

// Spring pop with squash & stretch, and a faster exit just before the shot's transition.
export const PopIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  exit?: boolean;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, exit = true, style }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 160 } });
  const over = s - 1; // <0 while rising (stretch), >0 while overshooting (squash)
  const exitEnd = durationInFrames - TRANSITION_FRAMES;
  const out = exit
    ? interpolate(frame, [exitEnd - 8, exitEnd], [1, 0], { ...clamp, easing: Easing.in(Easing.back(2)) })
    : 1;
  const sx = s * (1 + over * 0.5) * out;
  const sy = s * (1 - over * 0.5) * out;
  return (
    <div style={{ position: "absolute", transform: `scale(${sx}, ${sy})`, transformOrigin: "50% 100%", ...style }}>
      {children}
    </div>
  );
};

// Rounded tag with white caps, pops in after its object.
export const LabelPill: React.FC<{
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  color?: string;
  exit?: boolean;
  fontSize?: number;
}> = ({ text, delay = 0, style, color = THEME.primary, exit = true, fontSize = 36 }) => (
  <PopIn delay={delay} exit={exit} style={style}>
    <div
      style={{
        background: color,
        color: THEME.paper,
        fontFamily: THEME.font,
        fontWeight: 900,
        fontSize,
        letterSpacing: 1,
        padding: `${Math.round(fontSize * 0.22)}px ${Math.round(fontSize * 0.72)}px`,
        borderRadius: 999,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
      }}
    >
      {text}
    </div>
  </PopIn>
);

// Full-bleed card with drifting dot texture; words pop in one by one, then keep a gentle wave.
export const TitleCard: React.FC<{
  text: string;
  bg?: string;
  color?: string;
  accent?: string;
  delay?: number; // wait for the incoming transition to uncover the card
  fontSize?: number;
  maxWidth?: string; // wrap width; portrait uses a wider box and bigger words
  exit?: boolean; // false = words stay until the cut (a whip carries them out)
}> = ({ text, bg = THEME.primary, color = THEME.paper, accent = THEME.amber, delay = TRANSITION_FRAMES / 2, fontSize = 150, maxWidth = "70%", exit = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(" ");
  const exitEnd = durationInFrames - TRANSITION_FRAMES;
  const out = exit ? interpolate(frame, [exitEnd - 8, exitEnd], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) }) : 1;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(rgba(255,255,255,0.12) 3px, transparent 3px) ${frame * 0.6}px ${frame * 0.4}px / 46px 46px, ${bg}`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", maxWidth }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 10, stiffness: 180 } });
          const wave = Math.sin((frame - i * 6) / 9) * 5 * Math.min(1, s);
          // Bounce lives in translateY; scale overshoot is capped (~1.04) so a popping word never
          // grows into its neighbour across the 28 px gap.
          const pop = Math.min(s, 1) + Math.max(0, s - 1) * 0.15;
          return (
            <span
              key={i}
              style={{
                color: words.length > 1 && i === words.length - 1 ? accent : color,
                textShadow: "0 8px 0 rgba(0,0,0,0.18)",
                fontFamily: THEME.font,
                fontWeight: 900,
                fontSize,
                lineHeight: 1.05,
                transform: `translateY(${(1 - s) * 60 + wave}px) scale(${pop * out})`,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Sound ──────────────────────────────────────────────────────────────────

// One-shot sound at a frame (relative to the enclosing Sequence). Files live in public/.
export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.6 }) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
