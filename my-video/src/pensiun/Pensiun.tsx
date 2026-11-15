import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { emo, faceOf } from "../explainer/Hero";
import { A, B, Blurred, P, VShort, lerp, mergeCaps } from "../shorts/cast";
import { LabelPill, PopIn, THEME, colorWipe, whipBlur } from "../explainer/kit";
import timeline from "../../public/voiceover/pensiun/timeline.json";
import { CommentCta, Count, FPS, Stamp, clamp, ramp, timing } from "../shorts/common";
import { Amb, BSB, Snd } from "../hape2m/parts";
import { damped, strike } from "../explainer/phys";
import { Calc, Desk, Envelope, Gavel, House, LawBook, Letter, Note, RubberStamp, StateRoom, Tomb, Utility, VpChair } from "./props";

// "Pensiun seumur hidup" — vertical short (Jaksel register), news peg (VP resignation, Nov 2026) with a timeless fact angle:
// UU 7/1978 gives a former VP who leaves "dengan hormat" a pension of 100 % of the base salary for life.
// No real faces: the empty chair stands for the office. Loop: the last shot is the hook's chair starting to swivel.
const { TOTAL, DUR, W } = timing(timeline);
export const PENSIUN_DURATION = TOTAL;


// swivel of a chair someone just got up from: starts at 0, damped
const swivel = (t: number) => (t <= 0 ? 0 : 30 * Math.sin((t / 34) * 2 * Math.PI) * Math.exp(-t / 40));
const LOOP_LEAD = 24; // the last shot starts the swivel this many frames before the cut back to frame 0

// ── 0 hook: empty VP chair still swivelling, money drops into an envelope, "SEUMUR HIDUP" ──
const HookShot: React.FC<{ f: number; t: number; money?: boolean }> = ({ f, t, money = true }) => {
  const a = W(0, "dua") - 4;
  const notes = money ? Array.from({ length: 8 }, (_, i) => {
    const s = a + i * 3;
    if (f < s) return null;
    // paper falls at terminal velocity with a side-to-side flutter, not ballistically
    const y = -140 + (f - s) * 46;
    if (y > 1090) return null;
    const x = 830 + ((i % 3) - 1) * 70 + 70 * Math.sin((f - s) / 4 + i);
    return <Note key={i} x={x} y={y} rot={28 * Math.sin((f - s) / 5 + i * 2)} />;
  }) : [];
  const landed = money ? Array.from({ length: 8 }, (_, i) => (-140 + (f - a - i * 3) * 46 > 1090 ? 1 : 0)).reduce((p: number, c) => p + c, 0) : 0;
  return (
    <AbsoluteFill>
      <Blurred px={3}><StateRoom /></Blurred>
      <VpChair x={540} y={820} w={440} turn={swivel(t)} />
      <Desk top={1180} plateX={330} />
      <Envelope x={830} y={1030} fat={landed / 8} />
      {notes}
      <Envelope x={830} y={1030} front />
    </AbsoluteFill>
  );
};
const S0: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <HookShot f={f} t={f + LOOP_LEAD} />
      <PopIn delay={W(0, "dua")} style={{ left: 0, width: 1080, top: 430, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 90, color: THEME.paper, WebkitTextStroke: `12px ${THEME.navy}`, paintOrder: "stroke fill" }}>Rp</span>
        <Count from={0} to={20} a={W(0, "dua")} b={W(0, "juta") + 6} size={170} suffix=" JUTA" />
        <span style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 64, color: THEME.amber, WebkitTextStroke: `10px ${THEME.navy}`, paintOrder: "stroke fill" }}>/bln</span>
      </PopIn>
      <Stamp at={W(0, "seumur")} text="SEUMUR HIDUP" top={700} size={110} color={THEME.amber} />
      <Snd at={0} src={BSB.cloth} vol={0.25} len={18} fade={6} />
      <Snd at={W(0, "dua") - 2} src={BSB.cloth} vol={0.35} len={34} fade={8} />
      <Snd at={W(0, "seumur")} src="sfx/slap.wav" vol={0.35} />
      <Amb src={BSB.room} vol={0.18} />
    </AbsoluteFill>
  );
};

// ── 1 "adil atau nggak?" split ──
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const ad = W(1, "adil", 1);
  const ng = W(1, "nggak", 1);
  const half = (left: boolean, on: number, label: string, color: string) => {
    const s = spring({ frame: f - on, fps: FPS, config: { damping: 10, stiffness: 200 } });
    return (
      <div style={{ position: "absolute", left: left ? 0 : 540, top: 0, width: 540, height: 1920, background: color, filter: f >= on ? "none" : "saturate(0.5) brightness(0.9)" }}>
        <div style={{ position: "absolute", top: 380, width: 540, textAlign: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 110, color: "#fff", transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5), textShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {half(true, ad, "ADIL", THEME.teal)}
      {half(false, ng, "NGGAK", THEME.amber)}
      <div style={{ position: "absolute", left: 470, top: 600, width: 140, height: 140, borderRadius: 70, background: THEME.navy, color: "#fff", fontFamily: THEME.font, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", border: "8px solid #fff" }}>VS</div>
      <P x={280} y={1000} width={420} {...A} seed={1} thumb={f >= ad} face={emo(f, [[0, "thinking"], [ad, "happy"]])} blinks={[ad - 1]} look={{ x: 10, y: -4 }} headTilt={f >= ad ? -5 : 0} />
      <P x={800} y={1000} width={420} {...B} seed={2} face={emo(f, [[0, "thinking"], [ng, { ...faceOf("angry"), vein: 0 }]])} blinks={[ng - 1]} look={{ x: -10, y: -4 }} headTilt={f >= ng ? 6 : 0} />
      <CommentCta at={W(1, "jawab")} text="Adil atau nggak? 1 kata aja" top={1470} chime={false} />
      <Snd at={ad} src="sfx/pluck_001.ogg" vol={0.4} />
      <Snd at={ng} src="sfx/pluck_002.ogg" vol={0.4} />
    </AbsoluteFill>
  );
};

// ── 2 the law from 1978: the book drops on the desk (dust), "48 TAHUN" ──
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const land = 16;
  // dropped from 0.35 m above the desk (~10 f), hard stop, small damped bounce
  const drop = f < land ? -620 * (1 - (f / land) ** 2) : -Math.abs(damped(f, land, 22, 8, 5));
  const wi = W(2, "which");
  return (
    <AbsoluteFill>
      <Blurred><StateRoom /></Blurred>
      <Desk top={1180} plate="" />
      <LawBook x={540} y={1190 + drop} w={520} rot={f < land ? -6 + f * 0.3 : 0} />
      {f >= land ? [0, 1, 2, 3, 4, 5].map((i) => {
        const k = (f - land) / 26;
        const dir = i < 3 ? -1 : 1;
        return k < 1 ? <div key={i} style={{ position: "absolute", left: 540 + dir * (280 + k * (120 + (i % 3) * 60)) - 40, top: 1150 - k * (40 + (i % 3) * 50), width: 80 + k * 80, height: 80 + k * 80, borderRadius: "50%", background: "#E9E2D2", opacity: 0.7 * (1 - k) }} /> : null;
      }) : null}
      <LabelPill text="UU No. 7 Tahun 1978" delay={W(2, "undang-undang")} style={{ left: 250, top: 470 }} fontSize={48} />
      {f >= wi ? (
        <PopIn delay={wi} style={{ left: 0, width: 1080, top: 230, display: "flex", justifyContent: "center" }}>
          <Count from={0} to={48} a={wi} b={wi + 18} size={150} suffix=" TAHUN" />
        </PopIn>
      ) : null}
      <P x={860} y={1690} width={360} {...A} seed={1} face={emo(f, [[0, "neutral"], [wi + 4, "shock"], [W(2, "kita") , "laugh"]], 5)} blinks={[wi + 3]} look={{ x: -16, y: -18 }} headTilt={f >= W(2, "kita") ? -6 : 0} />
      <Snd at={land} src="sfx/slap.wav" vol={0.5} />
      <Snd at={land - 12} src={BSB.air} vol={0.3} len={14} />
    </AbsoluteFill>
  );
};

// ── 3 the maths: 4 × 5,04 jt = 20,16 jt; base salary bar = pension bar ──
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const g = W(3, "gaji");
  const dua = W(3, "dua");
  const pen = W(3, "pensiunnya");
  const ser = W(3, "seratus");
  const sam = W(3, "sama");
  const bar = (at: number, label: string, color: string, x: number, pct: string) => {
    const h = 440 * interpolate(f, [at, at + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
    return (
      <>
        <div style={{ position: "absolute", left: x, top: 1100 - h, width: 300, height: h, borderRadius: "24px 24px 0 0", background: color, boxShadow: "0 0 0 8px rgba(255,255,255,0.15) inset" }} />
        <div style={{ position: "absolute", left: x - 30, top: 1118, width: 360, textAlign: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 44, color: "#fff" }}>{label}</div>
        {h > 40 ? <div style={{ position: "absolute", left: x, top: 1100 - h + 20, width: 300, textAlign: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 46, color: "#fff" }}>{pct}</div> : null}
      </>
    );
  };
  const keyAt = [g, g + 6, g + 12, dua];
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <Calc x={540} y={230} top={f >= g ? "4 × Rp5,04 jt" : ""} main={f >= dua ? "Rp20,16 jt" : f >= g ? "=" : "0"} />
      <div style={{ position: "absolute", left: 140, top: 1100, width: 800, height: 8, background: "#fff", opacity: 0.6 }} />
      {bar(dua, "GAJI POKOK", THEME.teal, 170, "Rp20,16 jt")}
      {bar(pen, "PENSIUN", THEME.amber, 610, f >= ser ? "100%" : "")}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 560, padding: "0 60px", boxSizing: "border-box", textAlign: "center", fontFamily: THEME.font, fontWeight: 800, fontSize: 30, color: "#fff", opacity: 0.7 * ramp(f, dua, 10) }}>4 × gaji pokok pejabat negara tertinggi (Rp5,04 jt) · belum termasuk tunjangan</div>
      <Stamp at={sam} text="SAMA PERSIS" top={1440} size={100} color={THEME.amber} rot={-6} />
      {keyAt.map((k, i) => <Snd key={i} at={k} src="sfx/tick_001.ogg" vol={0.35} />)}
      <Snd at={sam} src="sfx/slap.wav" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 4 plot twist: resignation letter gets stamped DENGAN HORMAT; the MPR gavel is the only exception ──
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const hit = W(4, "hormat") + 2;
  const gav = W(4, "tegas");
  const down = strike(f, hit, 6, 4, 3, 10);
  const shake = damped(f, hit, 9, 4, 4) + damped(f, gav, 7, 4, 4);
  const g = strike(f, gav, 5, 4, 2, 10);
  return (
    <AbsoluteFill style={{ background: "#7A4A2A", transform: `translateY(${shake}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${120 + i * 190} q270 -24 540 0 t540 0`} stroke="#5E3820" strokeWidth={6} fill="none" opacity={0.4} />)}
      </svg>
      <Letter x={540} y={300} title={"SURAT PENGUNDURAN DIRI"} />
      {f >= hit ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 760, display: "flex", justifyContent: "center", transform: "rotate(-10deg)" }}>
          <div style={{ border: `12px solid ${THEME.primary}`, borderRadius: 24, padding: "6px 36px", fontFamily: THEME.font, fontWeight: 900, fontSize: 78, color: THEME.primary, letterSpacing: 4, opacity: 0.85, whiteSpace: "nowrap" }}>DENGAN HORMAT</div>
        </div>
      ) : null}
      <div style={{ opacity: f < hit + 16 ? 1 : 1 - ramp(f, hit + 16, 8) }}>
        <RubberStamp x={540} y={lerp(300, 900, Math.max(-0.2, down))} />
      </div>
      {f >= gav - 14 ? (
        <>
          <div style={{ position: "absolute", left: 600, top: 1330, width: 360, height: 90, borderRadius: 20, background: "#5A3319", boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }} />
          <Gavel x={425} y={1260} rot={lerp(-55, 0, g)} />
          <LabelPill text="kecuali MPR bilang nggak" delay={gav} color={THEME.navy} style={{ left: 170, top: 1480 }} fontSize={44} />
        </>
      ) : null}
      <Snd at={hit} src="sfx/slap.wav" vol={0.55} />
      <Snd at={gav} src="sfx/slap.wav" vol={0.5} rate={0.8} />
    </AbsoluteFill>
  );
};

// ── 5 perks: a house pops, utilities fly into it, "DITANGGUNG NEGARA" ──
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const r = W(5, "rumah");
  const fly = (at: number, from: [number, number], to: [number, number]) => {
    const t = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
    return [lerp(from[0], to[0], t), lerp(from[1], to[1], t) - 220 * Math.sin(Math.PI * t), t] as const;
  };
  const items: ["bolt" | "drop" | "phone", number, [number, number], [number, number]][] = [
    ["bolt", W(5, "listrik"), [-100, 500], [330, 600]],
    ["drop", W(5, "air"), [1180, 420], [540, 520]],
    ["phone", W(5, "telepon"), [1180, 900], [750, 600]],
  ];
  const tg = W(5, "ditanggung");
  return (
    <AbsoluteFill>
      <Blurred><StateRoom /></Blurred>
      <PopIn delay={r} style={{ left: 0, top: 0 }}><House x={540} y={1180} w={620} /></PopIn>
      {items.map(([k, at, from, to]) => {
        if (f < at) return null;
        const [x, y, t] = fly(at, from, to);
        return <Utility key={k} kind={k} x={x} y={y} s={t < 1 ? 0.8 + 0.2 * t : 1 + 0.06 * Math.sin((f - at) / 5)} />;
      })}
      <LabelPill text="DITANGGUNG NEGARA" delay={tg} color={THEME.teal} style={{ left: 180, top: 260 }} fontSize={64} />
      <P x={200} y={1690} width={340} {...A} seed={1} face={emo(f, [[0, "thinking"], [tg, "shock"]], 5)} blinks={[tg - 1]} look={{ x: 16, y: -18 }} />
      <P x={880} y={1690} width={340} {...B} seed={2} face={emo(f, [[0, "neutral"], [W(5, "listrik"), "thinking"], [tg + 6, { ...faceOf("smug"), browAsym: -0.6, smirk: -0.8 }]], 5)} blinks={[tg + 5]} look={{ x: -16, y: -18 }} headTilt={f >= tg + 6 ? 6 : 0} />
      {items.map(([k, at]) => <Snd key={k} at={at + 13} src="sfx/pluck_001.ogg" vol={0.35} />)}
      <Snd at={r} src="sfx/drop_002.ogg" vol={0.4} />
    </AbsoluteFill>
  );
};

// ── 6 when it stops: two cards ──
const S6: React.FC = () => {
  const m = W(6, "meninggal");
  const pr = W(6, "presiden");
  const card = (at: number, x: number, label: string, art: React.ReactNode) => (
    <PopIn delay={at} style={{ left: x, top: 640 }}>
      <div style={{ width: 420, height: 620, borderRadius: 40, background: THEME.paper, boxShadow: "0 14px 0 rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 40, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 60, left: 0, width: 420, height: 380 }}>{art}</div>
        <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 52, color: THEME.ink, textAlign: "center", lineHeight: 1.1 }}>{label}</div>
      </div>
    </PopIn>
  );
  return (
    <AbsoluteFill style={{ background: THEME.primary }}>
      <LabelPill text="BERHENTI CUMA KALAU:" delay={2} color={THEME.navy} style={{ left: 150, top: 330 }} fontSize={60} />
      {card(m, 70, "MENINGGAL", <div style={{ position: "absolute", left: 80, top: 60 }}><Tomb /></div>)}
      {card(pr, 590, "MENJABAT LAGI", <VpChair x={210} y={150} w={230} />)}
      <Snd at={m} src="sfx/drop_002.ogg" vol={0.4} />
      <Snd at={pr} src="sfx/drop_002.ogg" vol={0.4} />
    </AbsoluteFill>
  );
};

// ── 7 opinion: not one person's rule, every former VP since 1978 ──
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const se = W(7, "semua");
  const ho = W(7, "honestly");
  return (
    <AbsoluteFill>
      <Blurred px={4}><StateRoom /></Blurred>
      {[0, 1, 2, 3, 4].map((i) => (
        <PopIn key={i} delay={se - 24 + i * 4} style={{ left: 0, top: 0 }}>
          <VpChair x={130 + i * 205} y={820} w={190} />
        </PopIn>
      ))}
      <LabelPill text="SEMUA MANTAN WAPRES" delay={se} color={THEME.primary} style={{ left: 150, top: 300 }} fontSize={60} />
      <LabelPill text="SEJAK 1978" delay={se + 10} color={THEME.amber} style={{ left: 380, top: 410 }} fontSize={44} />
      <P x={200} y={1690} width={340} {...A} seed={1} face={emo(f, [[0, "neutral"], [ho, "thinking"]])} blinks={[ho - 1]} look={{ x: 16, y: -16 }} />
      <P x={880} y={1690} width={340} {...B} seed={2} face={emo(f, [[0, "neutral"], [ho, "determined"], [se, "happy"]])} blinks={[ho - 1, se - 1]} look={{ x: -16, y: -16 }} headTilt={f >= se ? 5 * Math.sin((f - se) / 4) * Math.exp(-(f - se) / 30) : 0} />
    </AbsoluteFill>
  );
};

// ── 8 loop: ask again over the hook's chair; it starts to swivel LOOP_LEAD frames before the cut to frame 0 ──
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - (DUR[8] - LOOP_LEAD);
  return (
    <AbsoluteFill>
      <HookShot f={f} t={t} money={false} />
      <CommentCta at={W(8, "adil")} text="Adil atau nggak?" top={1450} chime={false} />
      <Snd at={DUR[8] - LOOP_LEAD} src={BSB.cloth} vol={0.25} len={LOOP_LEAD} fade={6} />
      <Amb src={BSB.room} vol={0.18} />
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8];
const TRANS: Record<number, () => unknown> = {
  0: whipBlur,
  1: () => colorWipe(THEME.amber),
  2: whipBlur,
  3: () => colorWipe(THEME.primary),
  5: whipBlur,
  6: () => colorWipe(THEME.amber),
  7: whipBlur,
};

// spoken numbers/acronyms → how they read on screen
const CAPS = mergeCaps(timeline.captions, [
  [["dua", "puluh", "juta"], "20 juta"],
  [["sembilan", "belas", "tujuh", "puluh", "delapan."], "1978."],
  [["seratus", "persen."], "100%."],
  [["M", "P", "R"], "MPR"],
]);

export const Pensiun: React.FC = () => (
  <VShort tl={timeline} scenes={SCENES} trans={TRANS} banner="MUNDUR, DIGAJI SEUMUR HIDUP?" bannerTop={210} bannerSize={58} bannerLoop caps={CAPS} />
);
