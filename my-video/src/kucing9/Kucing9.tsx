import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Captions } from "../explainer/Captions";
import { LabelPill, PopIn, THEME, TRANSITION_FRAMES as T, colorWipe, whipBlur } from "../explainer/kit";
import timeline from "../../public/voiceover/kucing9/timeline.json";
import { CommentCta, Count, FPS, HeartIcon, Puff, Stamp, clamp, ramp, timing } from "../shorts/common";
import { Amb, BSB, Snd } from "../hape2m/parts";
import { Cat } from "./Cat";
import { Bedroom, City, ClinicFront, Room, Sky, Wardrobe } from "./sets";

// "Apa benar nyawa kucing 9?" — vertical short, 1080×1920. A 9-heart HUD tracks the myth through the test.
const { TOTAL, START, DUR, W } = timing(timeline);
export const KUCING9_DURATION = TOTAL;
const G = (i: number, w: string, nth = 0) => START[i] + W(i, w, nth);
const sp = (f: number, at: number, config: { damping: number; stiffness: number }) => spring({ frame: f - at, fps: FPS, config });
const bump = (t: number, len: number) => (t >= 0 && t <= len ? Math.sin((Math.PI * t) / len) : 0);

const txt = (size: number, color: string = THEME.paper): React.CSSProperties => ({
  fontFamily: THEME.font, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `${size / 9}px ${THEME.navy}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.25)", whiteSpace: "nowrap",
});
// place a Cat by its neck point
const At: React.FC<{ x: number; y: number; w: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, w, style, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - (w * 230) / 400, width: w, height: w, ...style }}>{children}</div>
);
const Shadow: React.FC<{ x: number; y: number; rx: number; o?: number }> = ({ x, y, rx, o = 0.28 }) => (
  <div style={{ position: "absolute", left: x - rx, top: y - rx * 0.12, width: rx * 2, height: rx * 0.24, borderRadius: "50%", background: `rgba(0,0,0,${o})`, filter: "blur(4px)" }} />
);
const MiniCat: React.FC<{ w?: number; c?: string; ghost?: boolean }> = ({ w = 34, c = "#F59A3C", ghost }) => (
  <svg width={w} height={w} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
    <g fill={ghost ? "none" : c} stroke={ghost ? "#fff" : "none"} strokeWidth={2.5} strokeDasharray={ghost ? "4 3" : undefined}>
      <path d="M7 18 L9 4 L18 11 Z" /><path d="M33 18 L31 4 L22 11 Z" /><circle cx={20} cy={23} r={14} />
    </g>
    {ghost ? <text x={20} y={30} textAnchor="middle" fontSize={18} fontWeight={900} fill="#fff" fontFamily={THEME.font}>?</text>
      : <><circle cx={15} cy={22} r={2.4} fill={THEME.ink} /><circle cx={25} cy={22} r={2.4} fill={THEME.ink} /></>}
  </svg>
);

// ── HUD: 9 hearts, the myth on trial ─────────────────────────────────────────
const KEEP = 4; // the centre heart survives
const CRACK_ORDER = [0, 8, 1, 7, 2, 6, 3, 5];
const Hearts: React.FC = () => {
  const f = useCurrentFrame();
  const in0 = G(0, "sembilan");
  if (f < in0) return null;
  const satu = G(7, "satu");
  const grey = interpolate(f, [G(5, "tunggu"), G(5, "tunggu") + 8], [0, 1], clamp) * (1 - ramp(f, satu, 6));
  const bump = (at: number) => (f >= at ? Math.exp(-(f - at) / 7) : 0);
  const pulse = bump(G(2, "utuh")) + bump(G(4, "selamat"));
  return (
    <div style={{ position: "absolute", top: 92, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 14 }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const s = spring({ frame: f - in0 - i * 3, fps: FPS, config: { damping: 10, stiffness: 200 } });
        const k = CRACK_ORDER.indexOf(i);
        const at = satu + k * 3;
        const crack = i === KEEP ? 0 : interpolate(f, [at, at + 16], [0, 1], clamp);
        const gone = i === KEEP ? 1 : 1 - ramp(f, at + 10, 10);
        const keep = i === KEEP ? ramp(f, satu + 28, 10) : 0;
        const shake = grey ? Math.sin(f * 1.7 + i) * 3 * grey : 0;
        return (
          <div key={i} style={{ position: "relative", width: 86, height: 86, opacity: gone, transform: `translate(${shake}px,${keep * 14}px) scale(${s * (1 + 0.25 * pulse + 0.45 * keep)})`, filter: grey ? `grayscale(${grey})` : undefined }}>
            <HeartIcon w={86} crack={crack} />
            {grey > 0.4 ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...txt(54) }}>?</div> : null}
          </div>
        );
      })}
    </div>
  );
};

// ── 0 k1 "Katanya, kucing punya sembilan nyawa. Yuk, kita buktiin." ─────────────
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const bukti = W(0, "buktiin");
  // frame 0: glancing aside, turns to camera; "buktiin": startle (ears back, crouch, little jump), then settles
  const turn = sp(f, 4, { damping: 14, stiffness: 90 });
  const st = sp(f, bukti, { damping: 9, stiffness: 200 });
  const settle = sp(f, bukti + 16, { damping: 14, stiffness: 80 });
  const crouch = 0.75 * st - 0.4 * settle;
  const hop = -46 * bump(f - bukti - 3, 11);
  return (
    <AbsoluteFill>
      <Room />
      <Shadow x={540} y={1290} rx={190 + hop * 0.6} />
      <At x={540} y={1064 + hop} w={620}>
        <Cat w={620} head={-10 * (1 - turn)} look={{ x: -0.85 * (1 - turn) + (st > 0.2 ? -0.3 : 0), y: 0.1 }} eyes={st > 0.2 ? "wide" : "open"} mouth={st > 0.2 ? "o" : "smile"}
          crouch={crouch} earsBack={0.85 * st * (1 - 0.5 * settle)} tailAmp={1 + 2 * st * (1 - settle)} />
      </At>
      <Stamp at={bukti} text="UJI MITOS" top={300} size={120} />
      <Amb src={BSB.room} vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 1 k2 wardrobe fall, slow-mo righting reflex ───────────────────────────────
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const jatuh = W(1, "jatuh");
  const dalam = W(1, "dalam");
  const kepala = W(1, "kepala");
  const badan = W(1, "badannya");
  const land = W(1, "mendarat");
  const L = land + 6; // paws touch
  // anticipation: peeks over the edge, crouches; slip rotates the whole cat over 14 f
  const peek = ramp(f, jatuh - 24, 16);
  const slip = interpolate(f, [jatuh, jatuh + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const drop = interpolate(f, [jatuh + 6, dalam], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) }); // time slows into slow-mo
  const slow = interpolate(f, [dalam, L], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const x = 280 + 18 * peek + 122 * slip + 160 * slow;
  const y = 412 + 60 * slip + 100 * drop + 569 * slow;
  // head leads with a little overshoot (spring), body follows; head never fully opposes the body
  const hT = sp(f, kepala, { damping: 11, stiffness: 110 });
  const bT = sp(f, badan, { damping: 12, stiffness: 90 });
  const head = 180 * slip - 110 * hT - 70 * bT + 8 * peek * (1 - slip);
  const body = 180 * slip * (1 - bT);
  const airborne = f >= jatuh && f < L;
  const lt = f - L;
  const crouch = f >= L ? 0.95 * Math.exp(-lt / 8) * Math.cos(lt / 3.4) + 0.1 * (1 - ramp(f, L + 20, 20)) : 0.35 * peek * (1 - slip);
  const sm = f >= dalam && f < L ? 1 : 0;
  const step = (n: string, at: number, i: number) => <LabelPill text={n} delay={at} color={[THEME.teal, THEME.primary, THEME.orange][i]} fontSize={44} style={{ left: 640, top: 300 + i * 92 }} />;
  return (
    <AbsoluteFill>
      <Room picture={false} />
      <Wardrobe />
      <Shadow x={x} y={1282} rx={130 * interpolate(y, [600, 1141], [0.3, 1], clamp)} o={0.28 * interpolate(y, [600, 1141], [0.2, 1], clamp)} />
      {sm ? <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(120,200,255,0) 45%, rgba(20,40,90,0.45) 100%)", opacity: ramp(f, dalam, 8) * (1 - ramp(f, L - 6, 6)) }} /> : null}
      {sm ? [0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: x - 150 + k * 90, top: y - 330 - ((f * 3 + k * 50) % 160), width: 8, height: 90, borderRadius: 4, background: "rgba(255,255,255,0.35)" }} />) : null}
      <At x={x} y={y} w={380}>
        <Cat w={380} pose={airborne ? "fall" : f >= L ? "stand" : "sit"} head={head} body={body} look={{ x: 0.3 * peek, y: f >= L ? 0 : 0.7 * peek }}
          eyes={airborne ? "wide" : f >= L + 40 ? "happy" : "open"} mouth={airborne ? "o" : "smile"} blink={!airborne}
          crouch={crouch} earsBack={airborne ? 0.55 : 0.3 * Math.max(0, crouch)} paddle={airborne ? (sm ? 0.25 : 0.6) : 0} tailAmp={airborne ? 2.4 : 1} />
      </At>
      {sm ? (
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <div style={{ background: THEME.paper, color: THEME.primaryDark, fontFamily: THEME.font, fontWeight: 900, fontSize: 44, padding: "6px 26px", borderRadius: 14, opacity: 0.6 + 0.4 * Math.sin(f / 4) ** 2 }}>● SLOW-MO</div>
        </div>
      ) : null}
      {step("1 kepala", kepala, 0)}
      {step("2 badan", badan, 1)}
      {step("3 kaki", land, 2)}
      <Puff at={L} x={x} y={1280} r={110} />
      <Amb src={BSB.room} vol={0.25} />
      <Snd at={jatuh} src={BSB.air} vol={0.5} len={30} />
      <Snd at={L - 1} src={BSB.cloth} vol={0.6} len={14} fade={3} />
    </AbsoluteFill>
  );
};

// ── 2 k3 "refleks memutar badan" filmstrip, "Masih utuh." ─────────────────────
const STAGES = [{ head: 180, body: 180 }, { head: 70, body: 180 }, { head: 20, body: 90 }, { head: 0, body: 0 }];
const S2: React.FC = () => {
  const r = W(2, "refleks");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(10px)", transform: "scale(1.06)" }}><Room /></AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(22,26,58,0.5)" }} />
      <LabelPill text="Refleks memutar badan" delay={W(2, "namanya")} exit={false} color={THEME.primary} fontSize={50} style={{ left: 110, top: 250 }} />
      {STAGES.map((s, i) => {
        const cx = i % 2 ? 790 : 290;
        const top = i < 2 ? 380 : 820;
        return (
          <PopIn key={i} delay={r + i * 5} exit={false} style={{ left: cx - 220, top, width: 440, height: 400 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.22)", borderRadius: 30 }} />
            <div style={{ position: "absolute", left: 18, top: 10, ...txt(54) }}>{i + 1}</div>
            <At x={220} y={210} w={260}>
              <Cat w={260} pose={i === 3 ? "stand" : "fall"} head={s.head} body={s.body} eyes={i === 3 ? "happy" : "wide"} mouth={i === 3 ? "smile" : "o"} blink={false} />
            </At>
          </PopIn>
        );
      })}
      <Stamp at={W(2, "utuh")} text="MASIH 9 ✓" top={680} size={120} color={THEME.paper} rot={-6} />
    </AbsoluteFill>
  );
};

// ── 3 k4 building + 132 cats study ────────────────────────────────────────────
const GRID = 132;
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [W(3, "kedua"), W(3, "tinggi") + 8], [0.35, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const a = W(3, "seratus");
  const b = W(3, "kucing") + 6;
  const lit = Math.floor(interpolate(f, [W(3, "rata-rata"), W(3, "lima") + 2], [0, 5], clamp));
  return (
    <AbsoluteFill>
      <City rise={rise} lit={lit} />
      <div style={{ position: "absolute", left: 535, top: 470, width: 490, height: 650, background: "#FFFDF8", borderRadius: 18, boxShadow: "0 16px 0 rgba(0,0,0,0.18)", transform: `rotate(1.5deg) scale(${ramp(f, W(3, "penelitian") - 2, 10)})` }}>
        <div style={{ position: "absolute", left: 175, top: -26, width: 140, height: 46, borderRadius: 10, background: "#8E98A8" }} />
        {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30, right: 30, top: 640 - k * 22, height: 4, background: "#E5DED0" }} />)}
      </div>
      <At x={200} y={1250 - 730 * rise - 96} w={180}><Cat w={180} look={{ x: 0.2, y: 0.8 * ramp(f, W(3, "tinggi"), 14) }} head={10 * ramp(f, W(3, "tinggi"), 14)} crouch={0.3 * ramp(f, W(3, "tinggi"), 14)} earsBack={0.4 * ramp(f, W(3, "tinggi"), 14)} eyes={f > W(3, "tinggi") ? "wide" : "open"} /></At>
      {lit >= 5 ? <LabelPill text="± lantai 5" delay={W(3, "lima")} exit={false} color={THEME.orange} fontSize={44} style={{ left: 150, top: 880 }} /> : null}
      <LabelPill text="penelitian 1987" delay={W(3, "penelitian")} exit={false} color={THEME.teal} fontSize={40} style={{ left: 600, top: 440 }} />
      {f >= a ? <div style={{ position: "absolute", left: 540, width: 500, top: 500, display: "flex", justifyContent: "center" }}><Count from={0} to={132} a={a} b={b} size={130} /></div> : null}
      <div style={{ position: "absolute", left: 560, top: 680, width: 12 * 38, display: "flex", flexWrap: "wrap" }}>
        {Array.from({ length: GRID }).map((_, i) => {
          const p = ramp(f, a + (i / GRID) * (b - a), 5);
          return <div key={i} style={{ width: 38, height: 38, transform: `scale(${p})` }}><MiniCat /></div>;
        })}
      </div>
      <Amb src={BSB.street} vol={0.12} />
    </AbsoluteFill>
  );
};

// ── 4 k5 ">90% selamat" then the parachute cat ────────────────────────────────
const SAFE = 119; // ~90% of 132
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const sel = W(4, "selamat");
  const swap = ramp(f, W(4, "badannya") - 4, 10);
  const fl = f - W(4, "badannya");
  return (
    <AbsoluteFill>
      <Sky />
      <div style={{ opacity: 1 - swap }}>
        <div style={{ position: "absolute", left: 290, top: 700, width: 500, height: 470, borderRadius: 24, background: "rgba(255,255,255,0.88)", boxShadow: "0 12px 0 rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
          <span style={txt(90)}>&gt;</span><Count from={0} to={90} a={W(4, "lebih")} b={W(4, "persen") + 4} size={220} suffix="%" />
        </div>
        <LabelPill text="selamat!" delay={sel} exit={false} color={THEME.primary} fontSize={56} style={{ left: 380, top: 600 }} />
        <div style={{ position: "absolute", left: 312, top: 730, width: 12 * 38, display: "flex", flexWrap: "wrap" }}>
          {Array.from({ length: GRID }).map((_, i) => {
            const ok = i < SAFE && f >= sel + Math.floor(i / 12);
            return <div key={i} style={{ width: 38, height: 38, borderRadius: 19, background: ok ? "rgba(22,184,160,0.3)" : undefined }}><MiniCat c={i < SAFE ? "#F59A3C" : "#8C8C99"} /></div>;
          })}
        </div>
      </div>
      {swap > 0 ? (
        <div style={{ opacity: swap }}>
          {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", left: 200 + k * 130, top: 1250 - ((fl * 9 + k * 97) % 900), width: 10, height: 120, borderRadius: 5, background: "rgba(255,255,255,0.4)" }} />)}
          <At x={540} y={700 + Math.sin(fl / 12) * 24} w={560} style={{ transform: `rotate(${Math.sin(fl / 16) * 5}deg)` }}>
            <Cat w={560} pose={fl > 0 ? "spread" : "fall"} eyes="happy" paddle={0.18} tailAmp={1.6} />
          </At>
          <LabelPill text="kayak parasut" delay={W(4, "parasut")} exit={false} color={THEME.orange} fontSize={56} style={{ left: 300, top: 300 }} />
        </div>
      ) : null}
      <Snd at={W(4, "melebar")} src={BSB.air} vol={0.45} len={40} fade={6} />
    </AbsoluteFill>
  );
};

// ── 5–6 k6/k7 survivorship bias: only the cats that reached the vet were counted ──
const GHOSTS = [[70, 680], [70, 820], [70, 960], [70, 1100], [1010, 680], [1010, 820], [1010, 960], [1010, 1100], [150, 1520], [300, 1500], [450, 1520], [600, 1500], [750, 1520]];
const Clinic: React.FC<{ filled: (i: number) => number; ghosts: number; tag?: React.ReactNode }> = ({ filled, ghosts, tag }) => (
  <>
    <div style={{ position: "absolute", left: 220, top: 815, width: 8 * 80, display: "flex", flexWrap: "wrap" }}>
      {Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ width: 80, height: 88, display: "flex", justifyContent: "center", transform: `translateY(${-200 * (1 - filled(i))}px) scale(${filled(i)})`, opacity: filled(i) }}><MiniCat w={64} /></div>)}
    </div>
    {GHOSTS.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 35, top: y - 35, opacity: ghosts * (0.55 + 0.45 * Math.sin(i * 1.3)) }}><MiniCat w={70} ghost /></div>)}
    {tag}
  </>
);
// the cat freezes on "Tapi tunggu", then shrinks to the corner and watches the evidence
const Watcher: React.FC<{ m: number; look?: { x: number; y: number }; mouth?: "o" | "flat" | "smile" }> = ({ m, look = { x: -0.7, y: -0.5 }, mouth = "flat" }) => {
  const w = 520 - 280 * m;
  const f = useCurrentFrame();
  const scan = Math.sin(f / 22) * 0.5;
  return <At x={540 + 390 * m} y={1080 + 480 * m} w={w}><Cat w={w} eyes="wide" mouth={mouth} head={-8 * m + scan * 6 * m} crouch={0.3 * (1 - m)} earsBack={0.5 * (1 - m)} look={{ x: look.x * m + scan * m, y: look.y * m }} /></At>;
};
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const tw = W(5, "tunggu");
  const pen = W(5, "penelitian");
  const a = W(5, "dibawa") - 6;
  const b = W(5, "hewan") + 6;
  return (
    <AbsoluteFill>
      <ClinicFront />
      <div style={{ opacity: 1 - ramp(f, pen, 8) }}><Stamp at={tw} text="TAPI TUNGGU…" top={330} size={110} /></div>
      {f >= pen ? (
        <Clinic filled={(i) => ramp(f, a + (i / 24) * (b - a), 6)} ghosts={0} />
      ) : null}
      <LabelPill text="yang dihitung" delay={W(5, "ngitung")} exit={false} color={THEME.teal} fontSize={44} style={{ left: 380, top: 1150 }} />
      <Watcher m={ramp(f, pen - 4, 14)} />
      <Amb src={BSB.room} vol={0.2} />
    </AbsoluteFill>
  );
};
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [W(6, "nggak") - 4, W(6, "selamat") + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <ClinicFront />
      <Clinic filled={() => 1} ghosts={g} />
      <Stamp at={W(6, "hitungan")} text="NGGAK DIHITUNG" top={330} size={90} />
      <Watcher m={1} look={{ x: -0.8, y: -0.2 }} mouth={g > 0.5 ? "o" : "flat"} />
      <Amb src={BSB.room} vol={0.2} />
      <Snd at={W(6, "nggak")} src={BSB.air} vol={0.3} len={30} fade={8} />
    </AbsoluteFill>
  );
};

// ── 7 k8 the answer: one life, an amazing reflex ──────────────────────────────
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const satu = W(7, "satu");
  const kel = W(7, "kelihatan");
  const rf = W(7, "refleksnya");
  const J = 26; // airtime
  const spin = interpolate(f, [rf + 2, rf + J - 2], [0, 360], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tj = (f - rf) / J;
  const hop = tj > 0 && tj < 1 ? -230 * 4 * tj * (1 - tj) : 0;
  const lt = f - rf - J;
  const crouch = f < rf ? 0.6 * ramp(f, rf - 9, 9) : lt >= 0 ? 0.85 * Math.exp(-lt / 8) * Math.cos(lt / 3.4) : -0.3 * (1 - tj);
  const orbit = interpolate(f, [kel - 4, kel + 6], [0, 1], clamp) * (1 - ramp(f, rf, 8));
  return (
    <AbsoluteFill>
      <Room />
      <Shadow x={540} y={1286} rx={110 * (1 + hop / 400)} />
      <LabelPill text="jawabannya" delay={W(7, "jawabannya")} exit={false} color={THEME.teal} fontSize={44} style={{ left: 380, top: 250 }} />
      <PopIn delay={satu} exit={false} style={{ left: 340, top: 330, width: 400, height: 400 }}>
        <HeartIcon w={400} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 30, ...txt(190) }}>1</div>
      </PopIn>
      {(
        <PopIn delay={4} exit={false} style={{ left: 0, top: 0, width: 1080, height: 1920 }}>
          {orbit > 0 ? Array.from({ length: 8 }).map((_, i) => {
            const t = (i / 8) * Math.PI * 2 + f / 20;
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(t) * 330 - 35, top: 1090 + Math.sin(t) * 150 - 35, opacity: orbit * 0.8, transform: `scale(${orbit})` }}><HeartIcon w={70} color="rgba(255,255,255,0.75)" /></div>;
          }) : null}
          <At x={540} y={1150 + hop} w={360}>
            <Cat w={360} pose={hop ? "fall" : "sit"} head={spin} body={spin} eyes={f >= rf + J + 6 ? "happy" : "open"} crouch={crouch} paddle={0} tailAmp={hop ? 2.5 : 1} earsBack={hop ? 0.4 : 0} look={{ x: Math.sin(f / 30) * 0.3, y: 0 }} />
          </At>
        </PopIn>
      )}
      <LabelPill text="refleks luar biasa" delay={W(7, "luar")} exit={false} color={THEME.orange} fontSize={48} style={{ left: 290, top: 760 }} />
      <Snd at={satu} src={BSB.heart} vol={0.5} len={45} fade={6} />
      <Snd at={rf} src={BSB.air} vol={0.4} len={26} />
      <Snd at={rf + J - 1} src={BSB.cloth} vol={0.45} len={12} fade={3} />
    </AbsoluteFill>
  );
};

// ── 8 k9 CTA ─────────────────────────────────────────────────────────────────
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bedroom />
      <At x={610} y={770} w={600}><Cat w={600} pose="sleep" eyes="closed" /></At>
      {[0, 1, 2].map((k) => {
        const t = ((f + k * 20) % 60) / 60;
        return <div key={k} style={{ position: "absolute", left: 800 + t * 80, top: 640 - t * 180, opacity: Math.sin(t * Math.PI), ...txt(60 + k * 10) }}>z</div>;
      })}
      <CommentCta at={W(8, "apa")} text="Kucingmu pernah selamat dari apa?" top={1150} chime={false} />
      <Amb src={BSB.room} vol={0.25} />
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8];
const TRANS: Record<number, () => unknown> = { 0: whipBlur, 2: () => colorWipe(THEME.amber), 4: whipBlur, 6: () => colorWipe(THEME.teal) };

export const Kucing9: React.FC = () => {
  const f = useCurrentFrame();
  const teaser = 1 - ramp(f, START[1] - 6, 8);
  const tw = G(5, "tunggu");
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
        <div style={{ position: "absolute", left: 0, width: 1080, top: 230, display: "flex", justifyContent: "center", opacity: teaser, transform: `scale(${0.6 + 0.4 * spring({ frame: f, fps: FPS, config: { damping: 11 } })})` }}>
          <div style={{ background: THEME.amber, color: THEME.ink, fontFamily: THEME.font, fontWeight: 900, fontSize: 60, padding: "8px 40px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", transform: `rotate(${-2 + Math.sin(f / 10)}deg)` }}>NYAWA KUCING 9?</div>
        </div>
      ) : null}
      <Hearts />
      <Captions caps={timeline.captions} hideScenes={[8]} />
      <Audio src={staticFile(timeline.audio)} volume={1} />
      {/* music drops out on "Tapi tunggu" and comes back with the answer */}
      <Audio src={staticFile("hape2m/music.wav")} volume={(fr) => 0.07 * Math.min(1, fr / 20, (TOTAL - fr) / 40) * Math.min(1, interpolate(fr, [tw - 3, tw], [1, 0.15], clamp) + ramp(fr, START[7], 20))} />
    </AbsoluteFill>
  );
};
