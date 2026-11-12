import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Chibi } from "../explainer/Chibi";
import { Layer, LabelPill, World, Sfx, THEME, TRANSITION_FRAMES as T, TitleCard, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, KamarDesk, RuangBack, RuangFront, RuangSofaBack } from "./sets";
import timeline from "../../public/voiceover/contoh-el/timeline.json";

// Sample narrated by ElevenLabs (Serena, v4; split into lines in public/voiceover/contoh-el).
// Acting beats below are placed on word times from a Whisper word-level transcript of that take.
const BASE = [100, 90, 142];
// Voice starts once the incoming transition has uncovered the shot, and must end before the next one.
const VO_START = [6, T / 2, T / 2];
const VO_FRAMES = timeline.scenes.map((s) => Math.ceil(s.seconds * timeline.fps));
const SCENES = BASE.map((b, i) => Math.max(b, VO_START[i] + VO_FRAMES[i] + (i < BASE.length - 1 ? T : 24)));
const Voice: React.FC<{ i: number }> = ({ i }) => (
  <Sfx at={VO_START[i]} src={timeline.scenes[i].audio} volume={1} />
);
export const CONTOH_DURATION = SCENES.reduce((a, b) => a + b, 0) - (SCENES.length - 1) * T;
// Global frame where each transition starts (for the whoosh track).
const CUTS = [SCENES[0] - T, SCENES[0] + SCENES[1] - 2 * T];

const WIPE = colorWipe(THEME.amber);
const WHIP = whipBlur();
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── Layout switch ─────────────────────────────────────────────────────────
// Scenes are built in one 1920×1080 world. Portrait (`v`) films that same world through a zoomed
// camera: `World` scales by k and shifts so world (x, y) is the frame's top-left corner. The sets
// extend past the world edges in portrait, and each scene's layout object moves props and overlays
// into the 1080×1920 frame. Overlays must land in the platform safe zone (x 60–960, y 260–1480)
// AFTER the Layer push-in, so their world spots are picked with that scale included.


// ── Scene 1: late night, deadline ─────────────────────────────────────────
// Real-time clock at 23:55:20: second hand steps 6° once per second (short overshoot ease),
// minute and hour hands creep at true speed. TICKS = the step frames, for the tick SFX.
const SEC0 = 23 * 3600 + 55 * 60 + 20;
const TICKS = Array.from({ length: Math.floor((SCENES[0] - 1) / 30) }, (_, k) => (k + 1) * 30);
const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 30);
  const step = k === 0 ? 1 : interpolate(frame - k * 30, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const secs = SEC0 + k - 1 + step;
  const hand = (deg: number, len: number, w: number, color: string) => (
    <line x1={100} y1={112} x2={100} y2={100 - len} stroke={color} strokeWidth={w} strokeLinecap="round"
      transform={`rotate(${deg} 100 100)`} />
  );
  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      <circle cx={104} cy={106} r={92} fill="#000" opacity={0.12} />
      <circle cx={100} cy={100} r={92} fill="#fff" stroke={THEME.primaryDark} strokeWidth={10} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={97} y={16} width={6} height={i % 3 ? 10 : 18} rx={3} fill={THEME.ink}
          transform={`rotate(${i * 30} 100 100)`} />
      ))}
      {hand(((secs / 3600) % 12) * 30, 44, 11, THEME.ink)}
      {hand(((secs / 60) % 60) * 6, 66, 7, THEME.ink)}
      {hand((secs % 60) * 6, 72, 3.5, THEME.amber)}
      <circle cx={100} cy={100} r={8} fill={THEME.ink} />
      <circle cx={100} cy={100} r={3} fill={THEME.amber} />
    </svg>
  );
};

// Mug sits on the desk left of the laptop, inside the lamp light (lit left, shaded right). Steam drifts up slowly.
const Mug: React.FC<{ left: number }> = ({ left }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top: 616 }}>
      {[0, 1].map((i) => {
        const t = ((frame + i * 45) % 90) / 90;
        return (
          <div key={i} style={{
            position: "absolute", left: 24 + i * 34, top: -40 - t * 56, width: 14, height: 44, borderRadius: 7,
            background: "#fff", opacity: Math.sin(t * Math.PI) * 0.5, transform: `translateX(${Math.sin(t * 5 + i) * 5}px)`,
          }} />
        );
      })}
      <svg width={140} height={110} viewBox="0 0 140 110" style={{ overflow: "visible" }}>
        <ellipse cx={58} cy={100} rx={62} ry={8} fill="#000" opacity={0.22} />
        <path d="M100 26 C134 26 134 70 100 70" stroke={THEME.primaryDark} strokeWidth={12} fill="none" />
        <path d="M0 0 L104 0 L96 88 C95 95 90 100 82 100 L22 100 C14 100 9 95 8 88 Z" fill={THEME.primary} />
        <path d="M70 0 L104 0 L96 88 C95 95 90 100 82 100 L66 100 Z" fill={THEME.primaryDark} opacity={0.55} />
        <ellipse cx={52} cy={2} rx={52} ry={5} fill="#5A3A26" />
        <rect x={16} y={34} width={60} height={24} rx={12} fill="#fff" opacity={0.85} />
      </svg>
    </div>
  );
};

// The laptop screen faces the character: its light (this colour) is on the face and chest, never shown directly.
const LAPTOP_LIGHT = "#BFE9FF";
// Clock centre on screen ≈ (1660, 190); head centre ≈ (960, 300) → glance = eyes up-right + head turned that way.
// Portrait: clock (scaled 0.7) on the wall below-left of the window, frame ≈ (90–300, 495–705), inside the
// safe zone after the push-in → glance = eyes up-LEFT + head tilted left. `glance` = eye offset + head tilt.
// Beats on the words: "Haa" sigh (f6–29) → "…besok" glance + label (f57) → "tapi kok malah ngantuk" nod off (f89–133) → jolt.
const LATE = {
  h: {
    cam: undefined, clock: { left: 1560, top: 90 }, clockScale: 1, label: { left: 1310, top: 305 }, pill: 44, mug: 560,
    glance: { x: 24, y: -22, tilt: 7 },
  },
  // k 1.5 → character 780 px wide (72 %); head centre lands at y ≈ 790.
  v: {
    cam: { k: 1.5, x: 600, y: -200 }, clock: { left: 660, top: 130 }, clockScale: 0.7, label: { left: 680, top: 0 }, pill: 36, mug: 1172,
    glance: { x: -30, y: -20, tilt: -7 },
  },
};
const LateNight: React.FC<{ v: boolean }> = ({ v }) => {
  const L = v ? LATE.v : LATE.h;
  const frame = useCurrentFrame();
  const sigh = interpolate(frame, [6, 16, 29], [0, 1, 0], clamp);
  const glance = interpolate(frame, [40, 46, 72, 78], [0, 1, 1, 0], clamp);
  const sleepy = interpolate(frame, [92, 118, 128, 134], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  // Base gaze: down at the laptop in front (eyes low, face tipped down, lids half lowered). Glance: toward the clock.
  const look = { x: glance * L.glance.x, y: (1 - glance) * 26 + glance * L.glance.y + sleepy * 6 + sigh * 4 };
  const typing = (1 - glance) * (1 - sleepy) * (1 - sigh);
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}>
        <World cam={L.cam}>
          <KamarBack v={v} />
          <div style={{ position: "absolute", ...L.clock, transform: `scale(${L.clockScale})`, transformOrigin: "0 0" }}><Clock /></div>
        </World>
      </Layer>
      <Layer to={1.03} drift={10}>
        <World cam={L.cam}>
          <LabelPill text="deadline besok" delay={57} style={L.label} fontSize={L.pill} />
        </World>
      </Layer>
      <Layer to={1.07} drift={24}>
        <World cam={L.cam}>
        {/* shoulders and upper arms show above the lid; the hands are on the keyboard behind it */}
        <div style={{ position: "absolute", left: 700, top: 80 }}>
          <Chibi width={520} look={look} mouth={sleepy > 0.5 || sigh > 0.4 ? "o" : "worried"} worried glow={LAPTOP_LIGHT}
            pose="hold" typing={typing} pitch={10 * (1 - glance)} headTilt={glance * L.glance.tilt - sleepy * 5}
            headDrop={sleepy * 16 + sigh * 8} eyesOpen={0.82 + 0.18 * glance - sleepy * 0.7 - sigh * 0.35} />
        </div>
        {/* screen light spilling over the lid's top edge onto the chest */}
        <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(ellipse 230px 46px at 960px 582px, ${LAPTOP_LIGHT}66 0%, ${LAPTOP_LIGHT}00 100%)` }} />
        </World>
      </Layer>
      <Layer to={1.11} drift={40}>
        <World cam={L.cam}>
          <KamarDesk v={v} />
          <Mug left={L.mug} />
        </World>
      </Layer>
      {TICKS.map((f) => <Sfx key={f} at={f} src="sfx/tick_001.ogg" volume={0.2} />)}
      <Sfx at={57} src="sfx/drop_002.ogg" volume={0.6} />
      <Sfx at={134} src="sfx/pluck_002.ogg" volume={0.5} />
      <Voice i={0} />
    </AbsoluteFill>
  );
};

// ── Scene 2: title ─────────────────────────────────────────────────────────
const Title: React.FC<{ v: boolean }> = ({ v }) => (
  <>
    {/* portrait: wider box + bigger words → 3 lines */}
    {/* exit={false}: the words ride the whip out instead of leaving an empty card */}
    <TitleCard text="kenapa kita suka nunda?" exit={false} {...(v ? { fontSize: 180, maxWidth: "86%" } : {})} />
    {[0, 1, 2, 3].map((i) => <Sfx key={i} at={T / 2 + i * 4} src="sfx/pluck_001.ogg" volume={0.5} />)}
    <Voice i={1} />
  </>
);

// ── Scene 3: scrolling the phone on the sofa ─────────────────────────────
const Heart = () => <path d="M50 82 L18 50 A17 17 0 0 1 50 26 A17 17 0 0 1 82 50 Z" fill="#fff" />;
export const Chat = () => (
  <>
    <rect x={18} y={24} width={64} height={44} rx={14} fill="#fff" />
    <path d="M34 66 L30 82 L48 66 Z" fill="#fff" />
  </>
);
const Play = () => <path d="M38 26 L76 50 L38 74 Z" fill="#fff" />;

// Phone centre in the Scrolling character layer (Chibi at 680,140, scale 1.4; phone at viewBox 200,414).
export const PHONE_AT = { x: 680 + 200 * 1.4, y: 140 + 414 * 1.4 };
const NOTIF = 140;

// Notif leaves the phone small, grows with a spring and travels an eased arc to its spot, then floats.
export const Notif: React.FC<{
  icon: React.ReactNode; color: string; badge: string; badgeBg?: string; badgeInk?: string; delay: number; x: number; y: number;
}> = ({ icon, color, badge, badgeBg = THEME.amber, badgeInk = THEME.ink, delay, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  // Grows on the phone for a few frames, then flies out (ease in-out) along the arc.
  const t = interpolate(frame, [delay + 3, delay + 21], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const s = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const sx = PHONE_AT.x - NOTIF / 2;
  const sy = PHONE_AT.y - NOTIF / 2;
  // Control point beside the phone at the target's x: the arc swings out sideways, then up, clear of the face.
  const cx = x;
  const cy = sy;
  const px = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t ** 2 * x;
  const py = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t ** 2 * y;
  const float = Math.sin((frame + delay * 3) / 10) * 8 * t;
  return (
    <div style={{
      position: "absolute", left: px, top: py + float, transform: `scale(${0.15 + 0.85 * s})`,
      opacity: interpolate(frame, [delay, delay + 2], [0, 1], clamp),
    }}>
      <svg width={NOTIF} height={NOTIF} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <circle cx={52} cy={54} r={46} fill="#000" opacity={0.18} />
        <circle cx={50} cy={50} r={46} fill={color} />
        {icon}
        <rect x={62} y={-6} width={badge.length * 10 + 16} height={28} rx={14} fill={badgeBg} />
        <text x={70 + badge.length * 5} y={14} textAnchor="middle" fontSize={18} fontWeight={900}
          fontFamily={THEME.font} fill={badgeInk}>{badge}</text>
      </svg>
    </div>
  );
};

const SKIN = "#F6D2B0";
const SKIN_SHADE = "#E3B48E";

// The screen faces the character, so the camera sees the phone's BACK: dark case, camera bump
// top-left (viewer side), fingers wrapping both edges. Micro-movement = small wrist tilt + nudge.
export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = Math.sin(frame / 11) * 1.4;
  const nudge = Math.max(0, Math.sin(frame / 7)) * 1.5;
  return (
    <g transform={`translate(0 ${-nudge}) rotate(${tilt} 200 466)`}>
      <rect x={166} y={354} width={68} height={122} rx={14} fill="#272C46" />
      {/* lamp is on the right: rim light on the right edge */}
      <rect x={226} y={366} width={5} height={98} rx={2.5} fill="#fff" opacity={0.14} />
      <rect x={174} y={362} width={28} height={30} rx={8} fill="#3A4063" />
      <circle cx={182} cy={370} r={5} fill="#12141F" />
      <circle cx={182} cy={384} r={5} fill="#12141F" />
      <circle cx={180} cy={368} r={1.6} fill="#fff" opacity={0.5} />
      <circle cx={180} cy={382} r={1.6} fill="#fff" opacity={0.5} />
      <circle cx={195} cy={370} r={2.4} fill="#E8E2C8" opacity={0.7} />
      <circle cx={200} cy={420} r={8} fill="#fff" opacity={0.08} />
      {/* fingers curl around the edges onto the back */}
      {[404, 422, 440].map((fy) => (
        <g key={fy}>
          <rect x={156} y={fy} width={24} height={15} rx={7.5} fill={SKIN} />
          <rect x={220} y={fy + 2} width={24} height={15} rx={7.5} fill={SKIN} />
          <rect x={156} y={fy + 11} width={20} height={4} rx={2} fill={SKIN_SHADE} opacity={0.6} />
          <rect x={224} y={fy + 13} width={20} height={4} rx={2} fill={SKIN_SHADE} opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

// "hadiah" (f77) → first notif; "Kayak notifikasi ini" (f112–145) → the rest.
const NOTIFS = [
  { icon: <Heart />, color: THEME.amber, badge: "12", badgeBg: THEME.primary, badgeInk: THEME.paper, delay: 77 },
  { icon: <Chat />, color: THEME.primaryDark, badge: "3", delay: 114 },
  { icon: <Play />, color: THEME.teal, badge: "99+", delay: 122 },
  { icon: <Heart />, color: THEME.primary, badge: "5", delay: 130 },
];
// Notif spots (top-left, world px) + the eye flick toward the "99+" notif.
const SCROLL = {
  h: {
    // label left of the hair (it sat on the cowlick), heart notif nudged down to make room
    cam: undefined, label: { left: 530, top: 120 }, pill: 46, flick: { x: 22, y: -16 },
    notifs: [[470, 262], [1270, 190], [1330, 470], [470, 500]],
  },
  // k 1.4 → character 784 px wide (73 %). Two notifs above the head, two beside the shoulders.
  v: {
    cam: { k: 1.4, x: 574, y: -237 }, label: { left: 838, top: 20 }, pill: 36, flick: { x: 20, y: 6 },
    notifs: [[630, 0], [1060, 10], [1065, 630], [630, 620]],
  },
};

export const PHONE_LIGHT = "#9BE3FF";

const Scrolling: React.FC<{ v: boolean }> = ({ v }) => {
  const L = v ? SCROLL.v : SCROLL.h;
  const frame = useCurrentFrame();
  const surprised = frame >= 122 && frame < 140;
  // Eyes stay down on the phone (face tipped down); on the surprise they flick to the "99+" notif and back.
  const flick = interpolate(frame, [123, 127, 136, 142], [0, 1, 1, 0], clamp);
  const glow = interpolate(Math.sin(frame / 6), [-1, 1], [0.08, 0.14]);
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={-10} blur={2}>
        <World cam={L.cam}><RuangBack v={v} /></World>
      </Layer>
      <Layer to={1.08} drift={-24}>
        <World cam={L.cam}>
        <RuangSofaBack v={v} />
        <div style={{ position: "absolute", left: 680, top: 140 }}>
          <Chibi width={560} shirt={THEME.orange} shirtShade={THEME.orangeDark} lap={THEME.navy}
            look={{ x: flick * L.flick.x, y: 30 + flick * (L.flick.y - 6) }} pitch={10 * (1 - flick * 0.6)}
            pose="hold" glow={PHONE_LIGHT} lightFrom="right"
            mouth={surprised ? "o" : "smile"} eyesOpen={surprised ? 1.2 : 0.82} headTilt={Math.sin(frame / 20) * 3}>
            <Phone />
          </Chibi>
        </div>
        {/* screen light lands on the chin and chest above the phone, not around its back */}
        <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(ellipse 190px 110px at 960px 640px, rgba(155,227,255,${glow}) 0%, rgba(155,227,255,0) 100%)` }} />
        </World>
      </Layer>
      <Layer to={1.12} drift={-40}>
        <World cam={L.cam}><RuangFront v={v} /></World>
      </Layer>
      <Layer to={1.08} drift={-24}>
        <World cam={L.cam}>
          {NOTIFS.map((n, i) => <Notif key={n.delay} {...n} x={L.notifs[i][0]} y={L.notifs[i][1]} />)}
          <LabelPill text="dopamin" delay={44} exit={false} style={L.label} fontSize={L.pill} />
        </World>
      </Layer>
      {NOTIFS.map((n) => <Sfx key={n.delay} at={n.delay} src="sfx/glass_001.ogg" volume={0.35} />)}
      <Sfx at={44} src="sfx/confirmation_001.ogg" volume={0.5} />
      <Voice i={2} />
    </AbsoluteFill>
  );
};

// One show, two framings: Contoh (1920×1080) and ContohVertical (1080×1920, Shorts/Reels/TikTok).
const ContohShow: React.FC<{ v: boolean }> = ({ v }) => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [CONTOH_DURATION - 12, CONTOH_DURATION], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <LateNight v={v} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={WIPE} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <Title v={v} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={WHIP} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <Scrolling v={v} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <AbsoluteFill style={{ background: THEME.navy, opacity: fadeOut }} />
      <Audio src={staticFile("contoh/music.wav")} volume={0.12} />
      {CUTS.map((c) => <Sfx key={c} at={c - 2} src="sfx/whoosh.wav" volume={0.5} />)}
    </AbsoluteFill>
  );
};

export const Contoh: React.FC = () => <ContohShow v={false} />;
export const ContohVertical: React.FC = () => <ContohShow v />;
