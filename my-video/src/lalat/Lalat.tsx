import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Captions } from "../explainer/Captions";
import { Hero, emo, faceOf } from "../explainer/Hero";
import { Watermark } from "../brand/Watermark";
import { LabelPill, PopIn, THEME, TRANSITION_FRAMES as T, colorWipe, whipBlur } from "../explainer/kit";
import timeline from "../../public/voiceover/lalat/timeline.json";
import { CommentCta, Count, FPS, Stamp, clamp, ramp, timing } from "../shorts/common";
import { Amb, BSB, Snd } from "../hape2m/parts";
import { Room } from "../kucing9/sets";
import { ArmHand, EyeMacro, FilmStrip, Fly, FlyTop, PalmFront, Racket, Stopwatch } from "./props";
import { TableDown, TableTop } from "./sets";
import { ballistic, damped, gPx, saccadeFlight, strike } from "../explainer/phys";

// "Lalat vs Tanganmu" — vertical short (Jaksel register), 1080×1920, ElevenLabs v4 take sped up 1.12×.
// Loop: the last shot cuts back to the hook's first frame, and the last line ("Soalnya…") runs into line 1.
const { TOTAL, START, DUR, W } = timing(timeline);
export const LALAT_DURATION = TOTAL;

type HeroP = React.ComponentProps<typeof Hero>;
const A: Partial<HeroP> = { shirt: THEME.orange, shirtShade: THEME.orangeDark }; // "lo", tim tangan
const B: Partial<HeroP> = { hairStyle: "bob", outfit: "tee", lashes: true, hair: "#3B2A22", shirt: THEME.primary, shirtShade: THEME.primaryDark }; // tim raket

const P: React.FC<HeroP & { x: number; y: number; style?: React.CSSProperties }> = ({ x, y, style, ...h }) => (
  <div style={{ position: "absolute", left: x - h.width / 2, top: y - (190 * h.width) / 400, ...style }}>
    <Hero {...h} />
  </div>
);
// side-view fly placed by its feet
const FlyAt: React.FC<React.ComponentProps<typeof Fly> & { x: number; y: number; rot?: number }> = ({ x, y, rot = 0, ...p }) => (
  <div style={{ position: "absolute", left: x - p.w / 2, top: y - (128 * p.w) / 200, transform: `rotate(${rot}deg)`, transformOrigin: "50% 90%" }}>
    <Fly {...p} />
  </div>
);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hop = (f: number, at: number, len: number, a: [number, number], b: [number, number], arc = 160): [number, number, number] => {
  const t = interpolate(f, [at, at + len], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t) - arc * Math.sin(Math.PI * t), t > 0 && t < 1 ? 1 : 0];
};
const Blurred: React.FC<{ px?: number; children: React.ReactNode }> = ({ px = 8, children }) => (
  <AbsoluteFill style={{ filter: `blur(${px}px)`, transform: "scale(1.06)" }}>{children}</AbsoluteFill>
);

// ── 0 hook (also the loop target): a hand swings at a fly and drops into slow motion ──
const HOOK_FAST = 12;
const HookShot: React.FC<{ f: number; len: number; fx?: boolean }> = ({ f, len, fx = true }) => {
  const p = f < HOOK_FAST ? interpolate(f, [0, HOOK_FAST], [0, 0.34], clamp) : 0.34 + 0.46 * interpolate(f, [HOOK_FAST, len], [0, 1], clamp);
  // arc around the shoulder at (1300,-260): angle and reach (perspective) change together
  const at = (q: number): [number, number] => {
    const a = lerp(121.6, 117.6, q) * (Math.PI / 180) + 0.35 * Math.sin(Math.PI * q) * 0.25;
    const r = lerp(610, 1422, q);
    return [1300 + r * Math.cos(a), -260 + r * Math.sin(a)];
  };
  const [hx, hy] = at(p);
  const slow = fx ? ramp(f, HOOK_FAST, 10) : 0;
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - 0.3 * slow})` }}>
      <Blurred><Room /></Blurred>
      <TableTop top={1100} />
      <FlyAt x={500} y={1170} w={250} rub={fx ? ramp(f, 26, 10) : 0} seed={1} />
      {f < HOOK_FAST && fx ? [0.1, 0.2].map((d) => <div key={d} style={{ opacity: 0.18 }}><ArmHand from={[1300, -260]} to={at(Math.max(0, p - d))} w={300} blur={4} /></div>) : null}
      <ArmHand from={[1300, -260]} to={at(p)} w={300} blur={f < HOOK_FAST && fx ? 2 : 0} />
      {/* the palm pushes air ahead of it: the fly feels the gust before the hand arrives */}
      {slow > 0.3 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 0.45 * slow }}>
          {[0, 1, 2].map((i) => {
            const k = ((f * 0.6 + i * 14) % 40) / 40;
            const y = lerp(hy + 140, 1120, k);
            return <path key={i} d={`M${hx - 150 + i * 40} ${y} q60 -${18 + i * 6} 120 0`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - k} />;
          })}
        </svg>
      ) : null}
      {/* slow-motion grade: letterbox + speed badge */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 120 * slow, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1080, height: 120 * slow, background: "#000" }} />
      {slow > 0.5 ? (
        <div style={{ position: "absolute", right: 60, top: 330, background: "rgba(0,0,0,0.6)", borderRadius: 16, padding: "8px 22px", fontFamily: THEME.font, fontWeight: 900, fontSize: 44, color: "#fff", opacity: slow }}>0,25×</div>
      ) : null}
    </AbsoluteFill>
  );
};
const S0: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <HookShot f={f} len={DUR[0]} />
      <Stamp at={W(0, "slow")} text="SLOW MOTION" top={640} size={110} color={THEME.teal} />
      <Snd at={0} src={BSB.air} vol={0.5} len={HOOK_FAST + 2} />
      <Snd at={HOOK_FAST} src={BSB.air} vol={0.35} rate={0.45} len={DUR[0] - HOOK_FAST} fade={10} />
      <Snd at={0} src="sfx/buzz.wav" vol={0.1} rate={0.55} loop fade={8} />
      <Amb src={BSB.room} vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 1 "tim tangan atau tim raket?" split ──
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const tan = W(1, "tangan");
  const rak = W(1, "raket");
  const swat = Math.sin(Math.max(0, f - tan) / 4) * 12 * ramp(f, tan, 6);
  const zap = f >= rak + 6 && Math.floor(f / 3) % 4 !== 0 ? 1 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1920, background: THEME.mint }} />
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, background: "#FFE3A8" }} />
      <div style={{ position: "absolute", left: 534, top: 0, width: 12, height: 1920, background: "#fff" }} />
      <div style={{ position: "absolute", left: 30, top: 470, transform: `rotate(${-12 + swat}deg)`, transformOrigin: "50% 100%", opacity: ramp(f, tan - 8, 6) }}>
        <PalmFront w={230} />
      </div>
      <div style={{ position: "absolute", left: 800, top: 340, transform: `rotate(12deg) scale(${spring({ frame: f - rak + 6, fps: FPS, config: { damping: 10 } })})`, transformOrigin: "50% 100%" }}>
        <Racket w={170} zap={zap} />
      </div>
      <P x={290} y={980} width={430} {...A} seed={1} face={emo(f, [[0, "happy"], [tan, "laugh"], [W(1, "spill"), "smug"]])} blinks={[tan - 1]} look={{ x: 10, y: -6 }} headTilt={f >= tan ? -5 : 0} />
      <P x={790} y={980} width={430} {...B} seed={2} face={emo(f, [[0, "happy"], [rak, "laugh"], [W(1, "spill") + 4, { ...faceOf("smug"), browAsym: -0.6, smirk: -0.8 }]])} blinks={[rak - 1]} look={{ x: -10, y: -6 }} headTilt={f >= rak ? 5 : 0} />
      <div style={{ position: "absolute", left: 0, top: 1250, width: 540, height: 700, background: "#8FD9C6" }} />
      <div style={{ position: "absolute", left: 540, top: 1250, width: 540, height: 700, background: "#F2C66E" }} />
      <div style={{ position: "absolute", left: 470, top: 640, width: 140, height: 140, borderRadius: 70, background: THEME.navy, border: "8px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 60, color: "#fff", transform: `scale(${spring({ frame: f - 4, fps: FPS, config: { damping: 9 } })})` }}>VS</div>
      <LabelPill text="tim tangan" delay={tan - 4} exit={false} color={THEME.teal} fontSize={46} style={{ left: 90, top: 300 }} />
      <LabelPill text="tim raket" delay={rak - 4} exit={false} color={THEME.orange} fontSize={46} style={{ left: 640, top: 240 }} />
      <CommentCta at={W(1, "spill")} text="Tim tangan atau tim raket?" top={1470} chime={false} />
      {zap ? <Snd at={rak + 6} src="sfx/crackle.wav" vol={0.25} len={20} /> : null}
    </AbsoluteFill>
  );
};

// ── 2 "Tiga kali nepok. Miss semua." ──
const SPOTS: [number, number][] = [[420, 1110], [700, 1150], [330, 1175]];
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const slaps = [W(2, "tiga") + 8, W(2, "nepok") + 4, W(2, "miss") - 4]; // first one after the incoming fade
  const hon = W(2, "honestly");
  const buk = W(2, "bukan");
  // fly: hops away 3 frames before each slap lands, then circles A's head
  let pos: [number, number] = SPOTS[0];
  let flying = 0;
  for (let i = 0; i < 3; i++) {
    if (f >= slaps[i] - 3) {
      const to: [number, number] = i < 2 ? SPOTS[i + 1] : [560, 520];
      const [x, y, fl] = hop(f, slaps[i] - 3, 8, SPOTS[i], to, 180); // the gust ahead of the palm sets it off
      pos = [x, y];
      flying = fl;
    }
  }
  const orbit = f >= slaps[2] + 5;
  if (orbit) {
    const [x, y] = saccadeFlight(f - slaps[2], [[560, 520], [830, 450], [760, 640], [300, 600], [250, 430], [520, 380]], 6, 5, 2);
    pos = [x, y];
    flying = 1;
  }
  const n = slaps.filter((s) => f >= s).length;
  // the slap: arm from A's right shoulder down to the spot the fly just left
  const cur = slaps.reduce((c, s, i) => (f >= s - 7 && f < s + 8 ? i : c), -1); // latest swing in progress
  const arm = cur >= 0 ? (() => {
    const s = slaps[cur];
    const [tx, ty] = SPOTS[cur];
    const down = strike(f, s, 4, 3, 2, 6);
    return <ArmHand from={[650, 960]} to={[tx, lerp(ty - 200, ty - 40, down)]} w={250} blur={down > 0.1 && down < 0.9 ? 3 : 0} />;
  })() : null;
  const shake = slaps.reduce((acc, s) => acc + damped(f, s, 9, 4, 4), 0);
  const lost = f >= slaps[2] + 4;
  return (
    <AbsoluteFill style={{ transform: `translateY(${shake}px)` }}>
      <Room />
      <P x={540} y={720} width={440} {...A} lightFrom="right" seed={1} blinks={[slaps[2] + 5, hon - 1, buk - 1]}
        face={emo(f, [[0, "determined"], ...slaps.flatMap((s, i): [number, "cringe" | "determined"][] => i < 2 ? [[s + 1, "cringe"], [s + 9, "determined"]] : [[s + 1, "cringe"]]), [slaps[2] + 10, { ...faceOf("scared"), teeth: 0, jaw: 0.3, sweat: 1 }], [hon, "shock"], [buk, { ...faceOf("happy"), sweat: 0.6 }]], 4)}
        look={orbit && f < hon ? { x: (pos[0] - 540) / 18, y: -10 } : f >= hon ? { x: 0, y: 0 } : { x: 0, y: 22 }} pitch={lost ? 0 : 8} />
      <TableTop top={1000} />
      {SPOTS.map(([x, y], i) => (f >= slaps[i] && f < slaps[i] + 14 ? <div key={i} style={{ position: "absolute", left: x - 90, top: y - 30, width: 180, height: 60, borderRadius: 90, border: "6px solid #fff", opacity: 1 - (f - slaps[i]) / 14, transform: `scale(${1 + (f - slaps[i]) / 10})` }} /> : null))}
      <FlyAt x={pos[0]} y={pos[1]} w={orbit ? 120 : 150} flying={flying} shadow={!flying} flip={orbit && saccadeFlight(f - slaps[2], [[560, 520], [830, 450], [760, 640], [300, 600], [250, 430], [520, 380]], 6, 5, 2)[2] < 0} seed={2} />
      {arm}
      {n > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 250, display: "flex", justifyContent: "center" }}>
          <div style={{ background: THEME.navy, borderRadius: 999, padding: "10px 40px", fontFamily: THEME.font, fontWeight: 900, fontSize: 56, color: "#fff", transform: `scale(${1 + 0.15 * (1 - ramp(f, slaps[n - 1], 8))})` }}>
            KENA: <span style={{ color: THEME.orange }}>0</span>/{n}
          </div>
        </div>
      ) : null}
      <LabelPill text="bukan skill issue" delay={buk} exit={false} color={THEME.teal} fontSize={48} style={{ left: 250, top: 370 }} />
      {slaps.map((s) => <Snd key={s} at={s} src="sfx/slap.wav" vol={0.6} len={12} />)}
      {slaps.map((s) => <Snd key={`b${s}`} at={s - 3} src="sfx/buzz.wav" vol={0.18} len={12} fade={3} />)}
      <Snd at={slaps[2] + 5} src="sfx/buzz.wav" vol={0.12} loop fade={8} />
      <Amb src={BSB.room} vol={0.22} />
    </AbsoluteFill>
  );
};

// ── 3 compound eye (macro) → near-360° radar ──
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const rib = W(3, "ribuan");
  const scanW = W(3, "nge-scan") - 4;
  const ham = W(3, "hampir");
  const bel = W(3, "belakang");
  const zoom = 1 + 0.12 * interpolate(f, [0, scanW], [0, 1], clamp);
  const scanY = f >= rib ? ((f - rib) * 22) % 900 - 100 : -1;
  const radar = f >= scanW;
  const sweep = (f - scanW) * 9;
  const reveal = ramp(f, scanW, 18);
  const handY = interpolate(f, [bel - 30, bel + 4], [2200, 1300], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #2B3A2E, #0E1410)" }}>
      {!radar ? (
        <>
          <div style={{ position: "absolute", left: 90, top: 330, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
            <EyeMacro w={900} scan={scanY} />
          </div>
          <LabelPill text="ribuan lensa kecil" delay={rib} exit={false} color={THEME.orange} fontSize={50} style={{ left: 240, top: 220 }} />
        </>
      ) : (
        <>
          <TableDown />
          <div style={{ position: "absolute", left: 540 - 400, top: 800 - 400, width: 800, height: 800, borderRadius: 400, opacity: reveal,
            background: `conic-gradient(from ${sweep}deg, rgba(22,184,160,0.55), rgba(22,184,160,0.05) 70deg, rgba(22,184,160,0.18) 340deg, rgba(22,184,160,0.55))`, border: "6px solid rgba(255,255,255,0.7)" }} />
          {[1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: 540 - r * 130, top: 800 - r * 130, width: r * 260, height: r * 260, borderRadius: r * 130, border: "3px dashed rgba(255,255,255,0.45)", opacity: reveal }} />)}
          <div style={{ position: "absolute", left: 540 - 75, top: 800 - 90 }}><FlyTop w={150} /></div>
          <ArmHand from={[560, handY + 600]} to={[560, handY]} w={240} />
          {f >= bel ? (
            <PopIn delay={bel} exit={false} style={{ left: 600, top: 600 }}>
              <div style={{ width: 90, height: 90, borderRadius: 45, background: THEME.orange, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 64, color: "#fff" }}>!</div>
            </PopIn>
          ) : null}
          <LabelPill text="hampir 360°" delay={ham} exit={false} color={THEME.navy} fontSize={52} style={{ left: 330, top: 240 }} />
        </>
      )}
      {f >= bel ? <Snd at={bel} src="sfx/buzz.wav" vol={0.15} len={14} fade={3} /> : null}
    </AbsoluteFill>
  );
};

// ── 4 60 vs 250 per second ──
const Avatar: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <div style={{ width: 180, height: 180, borderRadius: 90, background: bg, border: "8px solid #fff", overflow: "hidden", position: "relative" }}>{children}</div>
);
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const sixty = W(4, "60");
  const two = W(4, "250");
  const emp = W(4, "empat");
  const gil = W(4, "gila");
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      {[0, 1].map((i) => {
        const x = i ? 570 : 90;
        const on = i ? two - 20 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 250, width: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: ramp(f, on, 10) }}>
            <Avatar bg={i ? THEME.mint : "#FFE3A8"}>
              {i ? <div style={{ position: "absolute", left: 10, top: 40 }}><Fly w={160} rub={1} shadow={false} /></div> : <div style={{ position: "absolute", left: -10, top: 10 }}><Hero width={200} {...A} face={emo(f, [[0, "happy"], [gil, { ...faceOf("shock"), shock: 0 }]], 4)} blinks={[gil - 1]} /></div>}
            </Avatar>
            <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 40, color: "#fff" }}>{i ? "MATA LALAT" : "MATA KITA"}</div>
            <FilmStrip w={360} h={540} perFrame={i ? 12 : 3} step={i ? 22 : 90} speed={7} color={i ? "#DDF5EE" : "#FFF1D2"} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 90, top: 1120, width: 420, display: "flex", justifyContent: "center", opacity: ramp(f, sixty - 4, 6) }}><Count from={0} to={60} a={sixty} b={sixty + 14} size={120} /></div>
      <div style={{ position: "absolute", left: 570, top: 1120, width: 420, display: "flex", justifyContent: "center", opacity: ramp(f, two - 4, 6) }}><Count from={0} to={250} a={two} b={two + 18} size={120} color={THEME.amber} /></div>
      <Stamp at={emp} text="4× LEBIH CEPET" top={740} size={100} color={THEME.amber} />
    </AbsoluteFill>
  );
};

// ── 5 fly POV: your swing looks like a video at 0.25× ──
const HexVision: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 0.16, mixBlendMode: "screen" }}>
    <defs>
      <pattern id="hexv" width={60} height={52} patternUnits="userSpaceOnUse">
        <path d="M15 0 L45 0 L60 26 L45 52 L15 52 L0 26 Z" fill="none" stroke="#fff" strokeWidth={3} />
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#hexv)" />
  </svg>
);
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const slw = W(5, "di-slow");
  const san = W(5, "santai");
  const t = f / DUR[5];
  const palm = lerp(300, 560, t);
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <AbsoluteFill style={{ filter: "saturate(0.85)" }}>
        <Blurred px={5}><Room /></Blurred>
        <P x={540} y={760} width={720} {...A} face={faceOf("determined", { teeth: 1, jaw: 0.2, wide: 0.75, browIn: -0.9, open: 1.05, sweat: 0.6 })} seed={1} headTilt={-4 * t} look={{ x: 0, y: 6 }} />
        {[0.12, 0.06].map((d) => <div key={d} style={{ position: "absolute", left: 760 - lerp(300, 560, t - d) / 2, top: 1180 - lerp(300, 560, t - d) * 0.9, opacity: 0.18 }}><PalmFront w={lerp(300, 560, t - d)} /></div>)}
        <div style={{ position: "absolute", left: 760 - palm / 2, top: 1180 - palm * 0.9 }}><PalmFront w={palm} /></div>
        <HexVision />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      </AbsoluteFill>
      {/* player UI */}
      <div style={{ position: "absolute", left: 80, top: 1225, width: 920, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.35)" }}>
        <div style={{ width: `${20 + 10 * t}%`, height: 10, borderRadius: 5, background: THEME.orange }} />
        <div style={{ position: "absolute", left: `calc(${20 + 10 * t}% - 14px)`, top: -9, width: 28, height: 28, borderRadius: 14, background: THEME.orange }} />
      </div>
      <LabelPill text="pov: lalat" delay={2} exit={false} color={THEME.navy} fontSize={44} style={{ left: 60, top: 160 }} />
      <PopIn delay={slw} exit={false} style={{ left: 760, top: 160 }}>
        <div style={{ background: "rgba(0,0,0,0.7)", borderRadius: 18, padding: "10px 26px", fontFamily: THEME.font, fontWeight: 900, fontSize: 56, color: "#fff" }}>0,25×</div>
      </PopIn>
      {f >= san ? (
        <PopIn delay={san} exit={false} style={{ left: 640, top: 320 }}>
          <div style={{ width: 340, height: 340, borderRadius: 170, background: THEME.mint, border: "10px solid #fff", overflow: "hidden", position: "relative", boxShadow: "0 12px 0 rgba(0,0,0,0.25)" }}>
            <div style={{ position: "absolute", left: 30, top: 90 }}><Fly w={280} rub={1} seed={5} /></div>
          </div>
        </PopIn>
      ) : null}
      {/* mid-video comment ask (for viewers who leave early) */}
      {f < san ? <LabelPill text="tim tangan atau raket? komen!" delay={8} exit={false} color={THEME.orange} fontSize={40} style={{ left: 170, top: 1440 }} /> : null}
      <Snd at={0} src={BSB.air} vol={0.3} rate={0.4} len={DUR[5]} fade={12} />
      <Snd at={0} src="sfx/buzz.wav" vol={0.06} rate={0.5} loop fade={10} />
    </AbsoluteFill>
  );
};

// ── 6 escape plan in 0.1 s ──
const Route: React.FC<{ d: string; at: number; color: string; out?: number }> = ({ d, at, color, out = 0 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, 10);
  return <path d={d} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="34 26" pathLength={1000} strokeDashoffset={0} style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` } as React.CSSProperties} opacity={p * (1 - out)} />;
};
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const sep = W(6, "sepersepuluh");
  const plan = W(6, "nge-plan");
  const kab = W(6, "kabur");
  const lom = W(6, "lompatnya");
  const nia = W(6, "se-niat");
  const shadow = interpolate(f, [plan - 10, DUR[6]], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Blurred><Room /></Blurred>
      <TableTop top={900} props={false} />
      <div style={{ position: "absolute", left: -400 + 260 * shadow, top: 1000, width: 700, height: 260, borderRadius: 350, background: "#000", opacity: 0.25 * shadow, filter: "blur(30px)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Route d="M520 1040 Q330 860 190 960" at={plan} color={THEME.orange} out={ramp(f, kab + 6, 10)} />
        <Route d="M520 1040 Q500 760 420 640" at={plan + 6} color={THEME.orange} out={ramp(f, kab + 6, 10)} />
        <Route d="M560 1040 Q760 760 930 700" at={plan + 12} color={THEME.teal} />
      </svg>
      {f >= kab + 6 ? [[230, 940], [440, 660]].map(([x, y], i) => (
        <PopIn key={i} delay={kab + 6} exit={false} style={{ left: x - 40, top: y - 40 }}>
          <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 90, color: THEME.orange, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill" }}>X</div>
        </PopIn>
      )) : null}
      <FlyAt x={540} y={1140} w={460} crouch={ramp(f, lom, 8)} rub={f < plan ? 1 : 0} seed={3} />
      <div style={{ position: "absolute", left: 700, top: 230, opacity: ramp(f, sep - 6, 6) }}>
        <Stopwatch w={240} t={interpolate(f, [sep, sep + 8], [0, 0.1], clamp)} />
      </div>
      <LabelPill text="0,1 detik" delay={sep + 6} exit={false} color={THEME.navy} fontSize={46} style={{ left: 640, top: 540 }} />
      <LabelPill text="udah diitung" delay={W(6, "diitung")} exit={false} color={THEME.teal} fontSize={42} style={{ left: 640, top: 800 }} />
      <Stamp at={nia} text="SE-NIAT ITU" top={330} size={96} color={THEME.pink} rot={6} />
      <Snd at={sep} src={BSB.tick} vol={0.6} len={10} />
      <Amb src={BSB.room} vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 7 the trick: aim ahead of the fly ──
const Ring: React.FC<{ x: number; y: number; at: number; color: string; mark: "x" | "v" }> = ({ x, y, at, color, mark }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 11, stiffness: 160 } });
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x - 130, top: y - 130, width: 260, height: 260, transform: `scale(${s}) rotate(${(f - at) * 0.8}deg)` }}>
      <div style={{ width: 260, height: 260, borderRadius: 130, border: `12px dashed ${color}` }} />
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: "absolute", right: -30, top: -30, transform: `rotate(${-(f - at) * 0.8}deg)` }}>
        <circle cx={60} cy={60} r={52} fill={color} stroke="#fff" strokeWidth={8} />
        {mark === "x" ? <path d="M38 38 L82 82 M82 38 L38 82" stroke="#fff" strokeWidth={14} strokeLinecap="round" /> : <path d="M34 62 L52 80 L86 42" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </div>
  );
};
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const jan = W(7, "jangan");
  const ara = W(7, "arahin");
  const lom = W(7, "lompat");
  const mak = W(7, "make");
  const clap = lom + 8;
  const [fx, fy, fl] = hop(f, lom, 8, [540, 860], [540, 560], 0);
  const close = f >= clap ? 1 : strike(f, clap, 5, 5); // pull back, then accelerate into the clap
  const caught = f >= clap;
  return (
    <AbsoluteFill style={{ transform: `translate(${damped(f, clap, 7, 4, 4)}px, ${damped(f, clap, 5, 5, 4)}px)` }}>
      <TableDown />
      <Ring x={540} y={860} at={jan} color={THEME.orange} mark="x" />
      <Ring x={540} y={560} at={ara} color={THEME.teal} mark="v" />
      {f >= ara + 6 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M540 760 L540 690" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeDasharray="20 16" opacity={ramp(f, ara + 6, 8)} />
          <path d="M515 705 L540 680 L565 705" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" opacity={ramp(f, ara + 6, 8)} />
        </svg>
      ) : null}
      {!caught ? <div style={{ position: "absolute", left: fx - 70, top: fy - 84 }}><FlyTop w={140} flying={fl} /></div> : null}
      {f >= clap - 12 ? (
        <>
          <ArmHand from={[-260, 640]} to={[lerp(-40, 450, close), 560]} w={230} />
          <ArmHand from={[1340, 480]} to={[lerp(1120, 630, close), 560]} w={230} sleeve={THEME.orange} />
        </>
      ) : null}
      {caught ? [0, 1, 2, 3].map((i) => {
        const a = (f - clap) / 6 + (i * Math.PI) / 2;
        return <div key={i} style={{ position: "absolute", left: 540 + 150 * Math.cos(a) - 24, top: 440 + 40 * Math.sin(a) - 24, fontFamily: THEME.font, fontWeight: 900, fontSize: 56, color: THEME.amber, WebkitTextStroke: "6px #fff", paintOrder: "stroke fill" }}>★</div>;
      }) : null}
      <LabelPill text="arahin ke depannya" delay={ara + 4} exit={false} color={THEME.teal} fontSize={46} style={{ left: 230, top: 260 }} />
      <P x={880} y={1700} width={340} {...A} seed={1} face={emo(f, [[0, "thinking"], [clap, "happy"], [mak, "smug"]])} blinks={[clap - 1, mak - 1]} look={{ x: -16, y: -16 }} headTilt={f >= mak ? 8 : 0} />
      <Snd at={lom} src="sfx/buzz.wav" vol={0.18} len={10} fade={3} />
      <Snd at={clap} src="sfx/slap.wav" vol={0.7} len={12} />
    </AbsoluteFill>
  );
};

// ── 8 "raket nyamuk tetep the real MVP. Soalnya…" → back to the hook frame ──
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const rak = W(8, "raket");
  const mvp = W(8, "mvp");
  const soal = W(8, "soalnya");
  const [fx, fy] = hop(f, rak - 10, 14, [1200, 520], [560, 700], 80);
  const zapped = f >= rak + 4;
  const zap = zapped && f < rak + 22 ? 1 : 0;
  const tf = Math.max(0, f - (rak + 22));
  const [dx, dy] = ballistic(tf, [500, 660], [2.5, -6], gPx(1570)); // small kick from the zap, then gravity
  const back = ramp(f, soal + 6, 8);
  const crown = spring({ frame: f - mvp, fps: FPS, config: { damping: 9, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <Room />
      <div style={{ position: "absolute", left: 540 - 160, top: 400, transform: `rotate(${Math.sin(f / 14) * 3}deg)`, transformOrigin: "50% 100%" }}>
        <Racket w={320} zap={zap} />
        {f >= mvp ? (
          <svg width={200} height={130} viewBox="0 0 200 130" style={{ position: "absolute", left: 60, top: -110, transform: `scale(${crown}) rotate(-8deg)` }}>
            <path d="M10 120 L20 30 L65 80 L100 10 L135 80 L180 30 L190 120 Z" fill={THEME.amber} stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
            {[20, 100, 180].map((x, i) => <circle key={i} cx={x} cy={[30, 10, 30][i]} r={12} fill={THEME.pink} />)}
          </svg>
        ) : null}
      </div>
      {!zapped ? (
        <FlyAt x={fx} y={fy} w={110} flying={1} shadow={false} flip seed={4} />
      ) : (
        <div style={{ position: "absolute", left: dx, top: dy, transform: `rotate(${Math.min(200, tf * 22)}deg)`, opacity: dy > 1500 ? 0 : 1 }}>
          <Fly w={110} shadow={false} />
        </div>
      )}
      <P x={190} y={1700} width={340} {...A} seed={1} face={emo(f, [[0, { ...faceOf("scared"), teeth: 0, jaw: 0, sweat: 1 }], [rak + 4, "shock"], [rak + 26, "sad"], [mvp, "cry"]], 5)} blinks={[rak + 3, mvp - 1]} look={{ x: 16, y: -16 }} headTilt={-6} headDrop={f >= mvp ? 6 : 0} />
      <P x={890} y={1700} width={340} {...B} seed={2} face={emo(f, [[0, "smug"], [rak + 4, "happy"], [mvp, "laugh"]], 5)} blinks={[rak + 3]} look={{ x: -16, y: -16 }} headTilt={f >= mvp ? 8 : 0} />
      <Stamp at={mvp} text="THE REAL MVP" top={1000} size={92} color={THEME.amber} />
      <CommentCta at={W(8, "menurut")} text="Tim tangan atau tim raket?" top={200} chime={false} />
      {zapped ? <Snd at={rak + 4} src="sfx/crackle.wav" vol={0.35} len={20} /> : null}
      <Snd at={rak - 10} src="sfx/buzz.wav" vol={0.15} len={14} fade={3} />
      <Amb src={BSB.room} vol={0.2} />
      {/* loop: end on the hook's first frame */}
      {back > 0 ? <AbsoluteFill style={{ opacity: back }}><HookShot f={0} len={DUR[0]} fx={false} /></AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8];
const TRANS: Record<number, () => unknown> = {
  0: whipBlur,
  2: () => colorWipe(THEME.navy, THEME.amber),
  3: whipBlur,
  4: whipBlur,
  6: () => colorWipe(THEME.amber),
  7: whipBlur,
};

export const Lalat: React.FC = () => {
  const f = useCurrentFrame();
  const teaser = 1 - ramp(f, START[1] - 6, 8);
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <TransitionSeries>
        {SCENES.flatMap((Scene, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DUR[i]}><Scene /></TransitionSeries.Sequence>,
          ...(i < SCENES.length - 1
            ? [<TransitionSeries.Transition key={`t${i}`} presentation={(TRANS[i]?.() ?? fade()) as never} timing={linearTiming({ durationInFrames: T })} />]
            : []),
        ])}
      </TransitionSeries>
      {teaser > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 200, display: "flex", justifyContent: "center", opacity: teaser }}>
          <div style={{ background: THEME.amber, color: THEME.ink, fontFamily: THEME.font, fontWeight: 900, fontSize: 60, padding: "8px 40px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", transform: `rotate(${-2 + Math.sin(f / 10)}deg)` }}>LALAT vs TANGAN LO</div>
        </div>
      ) : null}
      <Watermark />
      <Captions caps={timeline.captions} />
      <Audio src={staticFile(timeline.audio)} volume={1} />
      {/* no fade-out: the loop restarts mid-bed */}
      <Audio src={staticFile("hape2m/music.wav")} volume={(fr) => 0.07 * Math.min(1, fr / 20)} />
    </AbsoluteFill>
  );
};
