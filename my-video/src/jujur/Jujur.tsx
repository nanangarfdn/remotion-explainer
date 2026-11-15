import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Captions } from "../explainer/Captions";
import { Hero } from "../explainer/Hero";
import { Watermark } from "../brand/Watermark";
import { LabelPill, PopIn, THEME, TRANSITION_FRAMES as T, colorWipe, whipBlur } from "../explainer/kit";
import { PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { PhoneFront } from "../sadap/icons";
import timeline from "../../public/voiceover/jujur/timeline.json";
import { CommentCta, FPS, Say, Stamp, clamp, ramp, timing } from "../shorts/common";
import { Amb, BSB, Snd } from "../hape2m/parts";
import { Bedroom, Room } from "../kucing9/sets";
import { BedBack, Desk, Door, Duvet, Lineup, Office, SofaBack, Space, Table } from "./sets";

// "Kalau semua orang nggak bisa bohong" — vertical short, 1080×1920, one ElevenLabs v4 take per line.
const { TOTAL, START, DUR, W } = timing(timeline);
export const JUJUR_DURATION = TOTAL;
const G = (i: number, w: string, nth = 0) => START[i] + W(i, w, nth);
const CAPS = timeline.captions.map((c) => ({ ...c, w: c.w.replace(/["“”]/g, "") }));

const txt = (size: number, color: string = THEME.paper): React.CSSProperties => ({
  fontFamily: THEME.font, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `${size / 9}px ${THEME.navy}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.25)", whiteSpace: "nowrap",
});

// the cast
type HeroP = React.ComponentProps<typeof Hero>;
const A: Partial<HeroP> = { shirt: THEME.orange, shirtShade: THEME.orangeDark }; // "kamu"
const B: Partial<HeroP> = { hairStyle: "bob", outfit: "tee", lashes: true, hair: "#3B2A22", shirt: THEME.primary, shirtShade: THEME.primaryDark }; // teman
const C: Partial<HeroP> = { hairStyle: "fluffy", glasses: true, hair: "#2B211C", skin: "#D9A47E", skinShade: "#C08862", shirt: THEME.teal, shirtShade: "#109583" };
const BOSS: Partial<HeroP> = { hair: "#8C8C99", glasses: true, outfit: "tee", shirt: "#2E3350", shirtShade: "#22283F" };

// place a Hero by its head centre (viewBox head = (200,190) of 400×520)
const P: React.FC<HeroP & { x: number; y: number; style?: React.CSSProperties }> = ({ x, y, style, ...h }) => (
  <div style={{ position: "absolute", left: x - h.width / 2, top: y - (190 * h.width) / 400, ...style }}>
    <Hero {...h} />
  </div>
);
const Sparkle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ position: "absolute", left: x - 30, top: y - 30, transform: `scale(${s})` }}>
    <path d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z" fill="#FFF3B0" />
  </svg>
);

// ── HUD: "JUJUR MODE" chip that stays on after the hook ──
const ModeChip: React.FC = () => {
  const f = useCurrentFrame();
  const at = G(0, "bohong") + 24;
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 180 } });
  const sad = ramp(f, G(5, "tapi"), 20) * (1 - ramp(f, START[6], 16));
  return (
    <div style={{ position: "absolute", top: 110, left: 0, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${s})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(30,36,64,0.85)", borderRadius: 999, padding: "8px 28px", fontFamily: THEME.font, fontWeight: 900, fontSize: 34, color: THEME.paper }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: sad > 0.5 ? "#8C8C99" : THEME.teal, opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 12)) }} />
        JUJUR MODE: ON
      </div>
    </div>
  );
};

// ── 0 "Gimana kalau mulai besok, semua orang di dunia nggak bisa bohong?" ──
const RING = [0, 1, 2, 3, 4, 5].map((i) => {
  const a = ((i * 60 + 30) * Math.PI) / 180;
  return { x: 540 + 395 * Math.cos(a), y: 800 + 370 * Math.sin(a) };
});
const MINI = [A, B, C, BOSS, { ...B, hair: "#1E1A1A", shirt: THEME.pink, shirtShade: "#E07597" }, { ...A, hairStyle: "fluffy", shirt: THEME.amber, shirtShade: "#D9921A" }] as Partial<HeroP>[];
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const semua = W(0, "semua");
  const boh = W(0, "bohong");
  return (
    <AbsoluteFill>
      <Space spin={f * 2.2} />
      {RING.map((p, i) => {
        const s = spring({ frame: f - semua - i * 3, fps: FPS, config: { damping: 10, stiffness: 170 } });
        const ok = spring({ frame: f - boh - 4 - i * 2, fps: FPS, config: { damping: 10, stiffness: 220 } });
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${p.x}px,${p.y + Math.sin(f / 14 + i) * 8}px) scale(${s})` }}>
            <P x={0} y={0} width={150} {...MINI[i]} mouth={f >= boh ? "o" : "smile"} browUp={f >= boh ? 1 : 0} look={{ x: (540 - p.x) / 30, y: (800 - p.y) / 30 }} />
            {f >= boh ? (
              <div style={{ position: "absolute", left: 30, top: -95, width: 54, height: 54, borderRadius: 27, background: THEME.teal, transform: `scale(${ok})`, display: "flex", alignItems: "center", justifyContent: "center", border: "5px solid #fff" }}>
                <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L25 8" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            ) : null}
          </div>
        );
      })}
      <Stamp at={boh + 6} text="JUJUR MODE: ON" top={1110} size={84} color={THEME.teal} />
      <Snd at={boh + 6} src={BSB.cloth} vol={0.4} len={12} fade={3} />
    </AbsoluteFill>
  );
};

// ── 1 haircut: "Mending yang kemarin." / "Iya, mukamu juga." ──
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const m = W(1, "mending");
  const iy = W(1, "iya");
  const proud = f < m + 4;
  const shocked = f >= m + 4 && f < iy;
  const lean = spring({ frame: f - iy, fps: FPS, config: { damping: 11, stiffness: 140 } });
  const bHit = f >= iy + 6;
  return (
    <AbsoluteFill>
      <Room />
      <P x={330 + 16 * lean} y={860} width={480} {...A} lightFrom="right" mouth={proud ? "grin" : shocked ? (f < m + 20 ? "o" : "worried") : "smirk"}
        browUp={shocked && f < m + 20 ? 1 : 0} eyesOpen={shocked && f < m + 20 ? 1.15 : f >= iy ? 0.78 : 1} worried={shocked && f >= m + 20}
        headTilt={proud ? 6 * Math.sin(f / 9) : -4 * lean} look={{ x: f >= m ? 16 : 0, y: 0 }} />
      <P x={765} y={870} width={460} {...B} lightFrom="right" mouth={bHit ? (f < iy + 26 ? "o" : "flat") : f >= m ? "flat" : "smile"}
        eyesOpen={bHit && f < iy + 26 ? 1.15 : f >= m ? 0.8 : 1} browUp={bHit && f < iy + 26 ? 1 : 0} angry={f >= iy + 26} look={{ x: -16, y: 0 }} headTilt={f >= m && f < iy ? 5 : 0} />
      <SofaBack />
      {proud ? [[200, 640], [470, 620], [330, 560]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} s={0.6 + 0.5 * Math.abs(Math.sin(f / 7 + i * 2))} />) : null}
      <LabelPill text="rambut baru" delay={6} color={THEME.primary} fontSize={46} style={{ left: 150, top: 330 }} />
      <Say left={380} top={470} delay={m} text="Mending yang kemarin." tail="right" size={50} />
      <Say left={70} top={560} delay={iy} text="Iya, mukamu juga." tail="left" size={50} bg={THEME.amber} />
      <Amb src={BSB.room} vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 2 "kamus jujur": four phrases, each acted, card shows the honest meaning ──
const Kamus: React.FC<{ phrase: string; honest: string; at: number; hit: number }> = ({ phrase, honest, at, hit }) => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [hit - 6, hit + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const h = spring({ frame: f - hit, fps: FPS, config: { damping: 10, stiffness: 200 } });
  return (
    <PopIn delay={at} exit={false} style={{ left: 70, top: 290, width: 940 }}>
      <div style={{ position: "absolute", left: 30, top: -34, background: THEME.amber, borderRadius: 999, padding: "4px 26px", fontFamily: THEME.font, fontWeight: 900, fontSize: 34, color: THEME.ink }}>KAMUS JUJUR</div>
      <div style={{ background: THEME.paper, borderRadius: 36, padding: "40px 40px 30px", boxShadow: "0 12px 0 rgba(0,0,0,0.2)", fontFamily: THEME.font, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", fontWeight: 900, fontSize: 66, color: strike > 0.5 ? "#9AA0B4" : THEME.ink }}>
          “{phrase}”
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, borderRadius: 5, width: `calc(${strike * 100}% + 20px)`, background: THEME.orange }} />
        </div>
        <div style={{ height: 150 * Math.min(1, h), overflow: "hidden" }}>
          <div style={{ fontWeight: 800, fontSize: 30, color: THEME.primary, marginTop: 8, opacity: h }}>artinya:</div>
          <div style={{ fontWeight: 900, fontSize: 70, color: THEME.primary, transform: `scale(${0.6 + 0.4 * h})` }}>{honest}</div>
        </div>
      </div>
    </PopIn>
  );
};
const Drawing: React.FC = () => (
  <g>
    <rect x={92} y={318} width={216} height={160} rx={8} fill="#6B4A32" />
    <rect x={102} y={328} width={196} height={140} fill="#FFFDF5" />
    <circle cx={160} cy={392} r={34} fill="none" stroke={THEME.orange} strokeWidth={6} />
    <path d="M136 366 l6 -20 l12 16 M172 362 l10 -18 l6 20" stroke={THEME.orange} strokeWidth={6} fill="none" />
    <circle cx={150} cy={388} r={4} fill={THEME.ink} /><circle cx={170} cy={388} r={4} fill={THEME.ink} />
    <path d="M196 410 q30 -50 60 -20 q20 30 -10 40" stroke={THEME.teal} strokeWidth={6} fill="none" />
    <circle cx={262} cy={350} r={14} fill={THEME.amber} />
  </g>
);
const Slide: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 8 || (to !== undefined && f >= to)) return null;
  const x = interpolate(f, [from - 8, from], [1080, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: x > 40 ? `blur(${x / 60}px)` : undefined }}>{children}</AbsoluteFill>;
};
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const v2 = W(2, "bagus") - 4;
  const v3 = W(2, "nanti") - 4;
  const v4 = W(2, "dan") - 2;
  const tolong = W(2, "tolong");
  const jelek = W(2, "jelek");
  const nggak = W(2, "nggak");
  const ote = W(2, "otewe");
  const baru = W(2, "baru");
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <Slide from={0} to={v2}>
        <Room picture={false} />
        <Door />
        <P x={680} y={860} width={460} {...B} lightFrom="right" mouth={f >= tolong ? "flat" : "grin"} eyesOpen={f >= tolong ? 0.7 : 1}
          look={{ x: f >= tolong ? 0 : -18, y: 0 }} headTilt={f < tolong ? 6 * Math.sin(f / 6) : 0} />
        <SofaBack />
        <Kamus phrase="Mampir dulu!" honest="Tolong jangan mampir." at={4} hit={tolong} />
      </Slide>
      <Slide from={v2} to={v3}>
        <Room />
        <P x={330} y={870} width={460} {...A} lightFrom="right" pose="hold" mouth={f >= jelek + 4 ? "worried" : "grin"} worried={f >= jelek + 10} look={{ x: 16, y: 0 }}>
          <Drawing />
        </P>
        <P x={770} y={870} width={440} {...B} lightFrom="right" mouth={f >= jelek ? "flat" : "smile"} eyesOpen={f >= jelek ? 0.75 : 1} look={{ x: -16, y: 8 }} />
        <SofaBack />
        <Kamus phrase="Bagus kok." honest="Jelek." at={v2 + 2} hit={jelek} />
      </Slide>
      <Slide from={v3} to={v4}>
        <Room />
        <P x={560} y={860} width={480} {...B} lightFrom="right" pose="call" mouth={f >= nggak ? "smirk" : "smile"} eyesOpen={f >= nggak ? 0.75 : 1}
          look={{ x: f >= nggak ? 18 : 0, y: f >= nggak ? -6 : 0 }} headTilt={-4 + 3 * Math.sin(f / 10)} />
        <SofaBack color="#E9A23B" dark="#C8842A" />
        <Kamus phrase="Nanti aku kabarin." honest="Nggak akan." at={v3 + 2} hit={nggak} />
      </Slide>
      <Slide from={v4}>
        <Bedroom />
        <BedBack />
        <P x={540} y={900} width={480} {...A} pose="hold" glow={PHONE_LIGHT} pitch={10} look={{ x: 0, y: 26 }} eyesOpen={f >= baru ? 0.3 : 0.5}
          mouth={f >= baru && f < baru + 30 ? "o" : "flat"} headTilt={-8 + 2 * Math.sin(f / 20)}>
          <Phone />
        </P>
        <Duvet />
        {f >= ote ? (
          <div style={{ position: "absolute", left: 600, top: 1000 - 220 * ramp(f, ote, 12), transform: `scale(${ramp(f, ote, 6)})`, transformOrigin: "0 100%" }}>
            <div style={{ background: "#DCF8C6", borderRadius: 26, padding: "12px 30px", fontFamily: THEME.font, fontWeight: 900, fontSize: 54, color: THEME.ink, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>otw ✓✓</div>
          </div>
        ) : null}
        <Kamus phrase="OTW" honest="Baru bangun." at={v4 + 2} hit={baru} />
      </Slide>
      <Amb src={BSB.room} vol={0.25} />
      <Snd at={ote} src={BSB.notif} vol={0.3} len={30} />
    </AbsoluteFill>
  );
};

// ── 3 selfie chat: the honest reply sends itself ──
const Bubble: React.FC<{ at: number; out?: boolean; children: React.ReactNode }> = ({ at, out, children }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 220 } });
  if (f < at) return null;
  return (
    <div style={{ alignSelf: out ? "flex-end" : "flex-start", transform: `scale(${s})`, transformOrigin: out ? "100% 100%" : "0 100%", background: out ? "#DCF8C6" : THEME.paper, borderRadius: 24, padding: 12, maxWidth: 400, boxShadow: "0 3px 0 rgba(0,0,0,0.08)", fontFamily: THEME.font, fontWeight: 800, fontSize: 38, color: THEME.ink }}>
      {children}
    </div>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const kirim = W(3, "kirim");
  const gim = W(3, "gimana");
  const jaw = W(3, "jawabannya");
  const kel = W(3, "keluar");
  const mik = W(3, "mikir");
  const typed = "cakep ba".slice(0, Math.max(0, Math.floor((f - jaw) / 4)));
  const shake = f >= kel && f < kel + 14 ? Math.sin(f * 2.4) * 10 * (1 - (f - kel) / 14) : 0;
  const rise = spring({ frame: f, fps: FPS, config: { damping: 14, stiffness: 90 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(12px)", transform: "scale(1.08)" }}><Room /></AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(22,26,58,0.35)" }} />
      <div style={{ position: "absolute", left: 240, top: 250 + 300 * (1 - rise), transform: `translateX(${shake}px) rotate(${-1.5 + shake * 0.2}deg)` }}>
        <PhoneFront w={600} h={1040} screen="#ECE5DA">
          <div style={{ height: 120, background: THEME.teal, display: "flex", alignItems: "center", gap: 18, padding: "34px 24px 0", fontFamily: THEME.font }}>
            <div style={{ width: 66, height: 66, borderRadius: 33, background: "#F7C4D0", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: -12, top: 2 }}><Hero width={90} {...B} /></div>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 36, color: "#fff" }}>Rina</div>
              <div style={{ fontWeight: 700, fontSize: 26, color: "#E6FFF9", opacity: f >= mik ? 1 : 0.8 }}>{f >= mik ? "sedang mengetik…" : "online"}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 22px" }}>
            <Bubble at={kirim}>
              <div style={{ width: 300, height: 330, borderRadius: 16, overflow: "hidden", position: "relative", background: "linear-gradient(#FFD9A8,#F7A7B8)" }}>
                <div style={{ position: "absolute", left: 10, top: 40 }}><Hero width={280} {...B} mouth="grin" headTilt={-8} eyesOpen={0.85} /></div>
              </div>
            </Bubble>
            <Bubble at={gim}>gimana?</Bubble>
            <Bubble at={kel} out>kayak habis begadang 3 hari</Bubble>
          </div>
          <div style={{ position: "absolute", left: 16, right: 16, bottom: 20, height: 74, borderRadius: 37, background: THEME.paper, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: THEME.font, fontWeight: 800, fontSize: 36, color: THEME.ink }}>
            {f < kel ? typed : ""}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: THEME.teal }}>|</span>
          </div>
        </PhoneFront>
        {/* thumbs holding the phone */}
        {[[-26, 820], [586, 860]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 60, height: 120, borderRadius: 30, background: "#F7D4B5", boxShadow: "inset -8px 0 0 #E8B795" }} />)}
      </div>
      {f >= kel ? <LabelPill text="terkirim sendiri!" delay={kel + 8} exit={false} color={THEME.orange} fontSize={46} style={{ left: 290, top: 170 }} /> : null}
      <Snd at={kirim} src={BSB.notif} vol={0.3} len={30} />
      <Snd at={gim} src={BSB.notif} vol={0.25} len={30} />
      <Snd at={kel} src={BSB.vibrate} vol={0.5} len={18} fade={4} />
      <Amb src={BSB.room} vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 4 office: "meeting ini penting" → "harusnya cukup lewat email" ──
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const meet = W(4, "meeting");
  const ber = W(4, "berubah");
  const har = W(4, "harusnya");
  const talk = f >= meet && f < ber ? (Math.floor(f / 5) % 2 ? "open" : "smile") : f >= har ? "worried" : "smile";
  return (
    <AbsoluteFill>
      <Office email={ramp(f, ber + 2, 12)} />
      <P x={220} y={930} width={360} {...C} mouth={f >= har ? "o" : "flat"} eyesOpen={f >= har ? 0.25 : 0.7} headTilt={f >= har ? -10 : 0} look={{ x: 10, y: -14 }} />
      <P x={540} y={900} width={380} {...BOSS} mouth={talk} worried={f >= har + 10} browUp={f >= meet && f < ber ? 0.6 : 0} look={{ x: f < ber ? 0 : -14, y: f < ber ? 0 : -16 }} headTilt={f >= meet && f < ber ? 4 * Math.sin(f / 6) : 0} />
      <P x={860} y={930} width={360} {...B} lightFrom="right" mouth={f >= har ? "smirk" : "flat"} eyesOpen={f >= har ? 0.55 : 0.75} look={{ x: -14, y: -14 }} />
      <Table />
      <LabelPill text="1 jam kemudian…" delay={ber} color={THEME.navy} fontSize={42} style={{ left: 330, top: 225 }} />
      <Amb src={BSB.room} vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 5 twist: no surprise parties, no "kamu pasti bisa" ──
const Hat: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const f = useCurrentFrame();
  const k = w / 400;
  const bob = Math.sin(f / 12) * 4 * k;
  return (
    <svg width={120 * k} height={150 * k} viewBox="0 0 120 150" style={{ position: "absolute", left: x - 60 * k + 30 * k, top: y - 0.375 * w - 120 * k + bob, transform: "rotate(14deg)" }}>
      <path d="M60 0 L110 140 L10 140 Z" fill={THEME.amber} />
      {[40, 80, 115].map((yy) => <path key={yy} d={`M${60 - yy * 0.33} ${yy} L${60 + yy * 0.33} ${yy}`} stroke={THEME.pink} strokeWidth={10} />)}
      <circle cx={60} cy={4} r={12} fill={THEME.pink} />
    </svg>
  );
};
const Cake: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <ellipse cx={200} cy={470} rx={110} ry={16} fill="#EDEFF7" />
      <rect x={110} y={400} width={180} height={70} rx={12} fill="#F7C4D0" />
      <rect x={110} y={400} width={180} height={18} rx={9} fill="#FFF" />
      {[150, 200, 250].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={360} width={10} height={40} fill={[THEME.teal, THEME.amber, THEME.primary][i]} />
          <ellipse cx={x} cy={350 + Math.sin(f / 3 + i) * 2} rx={7} ry={12} fill="#FFC447" />
        </g>
      ))}
    </g>
  );
};
const PaperBack: React.FC = () => (
  <g>
    <rect x={120} y={330} width={160} height={150} rx={6} fill="#FFFDF5" transform="rotate(-4 200 400)" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={140} y={355 + i * 26} width={110} height={6} fill="#9AA0B4" opacity={0.25} transform="rotate(-4 200 400)" />)}
  </g>
);
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const kej = W(5, "kejutan");
  const n2 = W(5, "nggak", 1) - 4;
  const kamu = W(5, "kamu");
  const waktu = W(5, "waktu");
  const ragu = W(5, "ragu");
  const enter = spring({ frame: f - (kej - 14), fps: FPS, config: { damping: 14, stiffness: 120 } });
  const bx = 1300 - 540 * enter;
  const grey = 0.25 + 0.75 * (1 - ramp(f, 0, 40));
  const strike = interpolate(f, [waktu, waktu + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ filter: `saturate(${grey})` }}>
      {f < n2 ? (
        <>
          <Room night />
          <P x={320} y={870} width={460} {...A} mouth="flat" eyesOpen={0.72} look={{ x: f >= kej ? 16 : 0, y: 0 }} />
          <P x={bx} y={880} width={440} {...B} pose="hold" mouth={f < kej + 34 ? "grin" : "flat"} look={{ x: -16, y: 0 }}><Cake /></P>
          <Hat x={bx} y={880} w={440} />
          <SofaBack />
          <Say left={520} top={430} delay={kej + 2} text="SURPRISE!" tail="right" size={64} bg={THEME.amber} />
          <Say left={90} top={560} delay={kej + 22} text="Udah tau." tail="left" size={52} />
        </>
      ) : (
        <>
          <AbsoluteFill style={{ filter: "blur(8px)" }}><Room night picture={false} /></AbsoluteFill>
          <P x={470} y={900} width={480} {...A} pose="hold" mouth="worried" worried={f >= ragu} pitch={10} look={{ x: 0, y: 24 }} headDrop={f >= ragu ? 10 * ramp(f, ragu, 12) : 0} eyesOpen={0.8}>
            <PaperBack />
          </P>
          <Desk />
          <LabelPill text="besok ujian" delay={n2 + 6} exit={false} color={THEME.navy} fontSize={44} style={{ left: 120, top: 330 }} />
          {f >= kamu ? (
            <div style={{ position: "absolute", left: 520, top: 470, opacity: 1 - 0.75 * ramp(f, ragu, 14) }}>
              <PopIn delay={kamu} exit={false} style={{ position: "relative" }}>
                <div style={{ position: "relative", border: "6px dashed #fff", borderRadius: 34, padding: "16px 30px", fontFamily: THEME.font, fontWeight: 900, fontSize: 50, color: THEME.paper, whiteSpace: "nowrap" }}>
                  kamu pasti bisa!
                  <div style={{ position: "absolute", left: 16, top: "48%", height: 9, borderRadius: 5, width: `${strike * 88}%`, background: THEME.orange }} />
                </div>
              </PopIn>
            </div>
          ) : null}
        </>
      )}
      <Amb src={BSB.room} vol={0.22} />
      <Snd at={kej} src={BSB.chatter} vol={0.12} len={40} fade={10} />
    </AbsoluteFill>
  );
};

// ── 6 CTA: which job vanishes first? ──
const SIL: Partial<HeroP>[] = [{ hairStyle: "spiky" }, { hairStyle: "fluffy", glasses: true }, { hairStyle: "bob" }];
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const pro = W(6, "profesi");
  const teb = W(6, "tebak");
  const juj = W(6, "jujur");
  return (
    <AbsoluteFill>
      <Lineup />
      {SIL.map((s, i) => {
        const x = 220 + i * 320;
        const q = spring({ frame: f - teb - i * 5, fps: FPS, config: { damping: 9, stiffness: 200 } });
        const sway = Math.sin(f / 16 + i * 2) * 3;
        return (
          <React.Fragment key={i}>
            <P x={x} y={826 + 260 * (1 - spring({ frame: f - pro + 10 - i * 4, fps: FPS, config: { damping: 13, stiffness: 120 } }))} width={300} {...s} headTilt={sway} style={{ filter: "brightness(0)", opacity: 0.86 }} />
            <div style={{ position: "absolute", left: x - 40, top: 470, transform: `scale(${q}) rotate(${sway * 2}deg)`, ...txt(130, THEME.amber) }}>?</div>
            <div style={{ position: "absolute", left: x - 60, top: 1060, width: 120, height: 80, borderRadius: 12, background: THEME.paper, display: "flex", alignItems: "center", justifyContent: "center", ...txt(56, THEME.ink), WebkitTextStroke: undefined, textShadow: undefined }}>{i + 1}</div>
          </React.Fragment>
        );
      })}
      <LabelPill text="hilang duluan?" delay={W(6, "hilang")} exit={false} color={THEME.primary} fontSize={50} style={{ left: 300, top: 300 }} />
      <P x={880} y={1700} width={340} {...A} mouth={f >= juj ? "smirk" : "smile"} eyesOpen={f >= juj ? 0.6 : 1} look={{ x: -16, y: -16 }} headTilt={f >= juj ? 8 : 0} />
      <CommentCta at={W(6, "tulis")} text="Profesi apa yang hilang duluan?" top={1160} chime={false} />
      <Amb src={BSB.room} vol={0.2} />
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6];
const TRANS: Record<number, () => unknown> = { 0: whipBlur, 1: whipBlur, 3: whipBlur, 4: () => colorWipe(THEME.navy, THEME.amber), 5: () => colorWipe(THEME.amber) };

export const Jujur: React.FC = () => {
  const f = useCurrentFrame();
  const teaser = 1 - ramp(f, START[1] - 6, 8);
  const tapi = G(5, "tapi");
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
          <div style={{ background: THEME.amber, color: THEME.ink, fontFamily: THEME.font, fontWeight: 900, fontSize: 58, padding: "8px 40px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", transform: `rotate(${-2 + Math.sin(f / 10)}deg)` }}>SEMUA ORANG JUJUR?</div>
        </div>
      ) : null}
      <ModeChip />
      <Watermark />
      <Captions caps={CAPS} hideScenes={[6]} />
      <Audio src={staticFile(timeline.audio)} volume={1} />
      {/* music thins out for the twist and comes back for the question */}
      <Audio src={staticFile("hape2m/music.wav")} volume={(fr) => 0.07 * Math.min(1, fr / 20, (TOTAL - fr) / 40) * Math.min(1, interpolate(fr, [tapi - 3, tapi + 10], [1, 0.3], clamp) + ramp(fr, START[6], 20))} />
    </AbsoluteFill>
  );
};
