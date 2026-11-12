import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Hero, type HeroMouth } from "../explainer/Hero";
import { Captions } from "../explainer/Captions";
import { Layer, PopIn, THEME, TRANSITION_FRAMES as T, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, RuangBack, RuangFront, RuangSofaBack } from "../contoh/sets";
import { PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { PhoneFront } from "../sadap/icons";
import { Hedge, StreetBack } from "../sadap/street";
import timeline from "../../public/voiceover/hape2m/timeline.json";
import { Brain, Calendar, Clock, CommentCta, Count, FPS, HeartIcon, Pill, Puff, Say, Stamp, Thought, clamp, ramp, timing } from "../shorts/common";
import { Amb, BSB, DayRing, KelasBack, KelasDesks, MoodChart, PeopleGrid, Snd, Toggle, Tracker, WifiIcon } from "./parts";

// "30 hari tanpa hape" — 2-minute vertical explainer, 1080×1920. Hero A (hoodie) + Hero B (bob, tee).
// Sound: recorded CC0 foley/ambience only (BigSoundBank), cued to things that move on screen.
const { TOTAL, START, DUR, W, LAST } = timing(timeline);
export const HAPE2M_DURATION = TOTAL;
const G = (i: number, w: string, nth = 0) => START[i] + W(i, w, nth); // global frame of a word

const A = { shirt: THEME.orange, shirtShade: THEME.orangeDark } as const;
const B = { hairStyle: "bob", outfit: "tee", lashes: true, hair: "#3B2A22", shirt: THEME.primary, shirtShade: THEME.primaryDark } as const;

const Bg: React.FC<{ c: string }> = ({ c }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(rgba(255,255,255,0.1) 3px, transparent 3px) ${f * 0.6}px ${f * 0.4}px / 46px 46px, ${c}` }} />;
};
const Big: React.FC<{ at: number; left?: number; top: number; width?: number; children: React.ReactNode }> = ({ at, left = 0, top, width = 1080, children }) => (
  <PopIn delay={at} exit={false} style={{ left, top, width, display: "flex", justifyContent: "center" }}>{children}</PopIn>
);
const txt = (size: number, color: string = THEME.paper): React.CSSProperties => ({
  fontFamily: THEME.font, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `${size / 9}px ${THEME.navy}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(0,0,0,0.25)", whiteSpace: "nowrap",
});

// ── sofa set, Hero A ─────────────────────────────────────────────────────────
const SOFA_CAM = { k: 1.4, x: 574, y: -237 };
const PHONE = { x: 540, y: 1351 }; // phone in A's hands, screen px
type SofaP = { look?: { x: number; y: number }; mouth?: HeroMouth; phone?: boolean; buzz?: number; pitch?: number; eyes?: number; tilt?: number; worried?: boolean; angry?: boolean; brow?: number; drop?: number; dx?: number; thumb?: boolean; hair?: string };
const Sofa: React.FC<SofaP> = ({ look = { x: 0, y: 0 }, mouth = "smile", phone, buzz = 0, pitch = 0, eyes = 1, tilt = 0, worried, angry, brow = 0, drop = 0, dx = 0, thumb, hair }) => {
  const f = useCurrentFrame();
  const jx = buzz ? Math.sin(f * 2.7) * 5 * buzz : 0;
  return (
    <>
      <Layer to={1.03} drift={-10} blur={2}><World cam={SOFA_CAM}><RuangBack v /></World></Layer>
      <Layer to={1.08} drift={-24}>
        <World cam={SOFA_CAM}>
          <RuangSofaBack v />
          <div style={{ position: "absolute", left: 680 + dx, top: 140 }}>
            <Hero width={560} {...A} hair={hair} lap={THEME.navy} look={look} pitch={pitch} pose={phone === undefined ? "idle" : "hold"}
              glow={phone ? PHONE_LIGHT : undefined} lightFrom="right" mouth={mouth} eyesOpen={eyes} worried={worried} angry={angry} browUp={brow}
              headDrop={drop} headTilt={tilt + Math.sin(f / 20) * 3} thumb={thumb}>
              {phone ? <g transform={`translate(${jx} 0)`}><Phone /></g> : null}
            </Hero>
          </div>
        </World>
      </Layer>
      <Layer to={1.12} drift={-40}><World cam={SOFA_CAM}><RuangFront v /></World></Layer>
    </>
  );
};
// short vibration marks either side of a buzzing phone
const Buzz: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const f = useCurrentFrame();
  if (!on) return null;
  const a = 0.5 + 0.5 * Math.sin(f * 1.3);
  return (
    <svg width={300} height={200} style={{ position: "absolute", left: x - 150, top: y - 100, opacity: on * a }}>
      {[-1, 1].map((s) => [0, 1].map((k) => <path key={`${s}${k}`} d={`M${150 + s * (70 + k * 22)} ${70 - k * 6} q${s * 10} 30 0 ${60 + k * 12}`} stroke={THEME.paper} strokeWidth={8} strokeLinecap="round" fill="none" />))}
    </svg>
  );
};

// ── 0 h1 "Coba ingat, kapan terakhir kali kamu megang hape?" — the phone buzzes at frame 0 ──
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const buzz = f < 34 ? 1 : 0;
  const think = ramp(f, W(0, "ingat"), 10);
  return (
    <AbsoluteFill>
      <Sofa phone buzz={buzz} look={{ x: -16 * think, y: buzz ? 28 : -20 * think }} pitch={buzz ? 10 : 0} mouth={think > 0.5 ? "flat" : "o"} brow={buzz} tilt={-6 * think} />
      <Buzz x={PHONE.x} y={PHONE.y - 40} on={buzz} />
      <Thought cx={290} top={330} w={360} h={280} delay={W(0, "kapan")} tx={520}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ transform: `rotate(${Math.sin(f / 8) * 8}deg)` }}><PhoneFront w={90} h={160} screen="#9BE3FF" /></div>
          <span style={{ fontWeight: 900, fontSize: 120, color: THEME.primary }}>?</span>
        </div>
      </Thought>
      <Amb src={BSB.room} vol={0.3} />
      <Snd at={0} src={BSB.vibrate} vol={0.5} len={36} fade={4} />
    </AbsoluteFill>
  );
};

// ── 1 h2 "5 menit lalu? … kamu lagi megang hape sekarang." → the shot shrinks into YOUR phone ──
const SKIN = "#F7D4B5";
const SKIN_SHADE = "#E8B795";
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const lima = W(1, "5");
  const jj = W(1, "jangan-jangan");
  const skr = W(1, "sekarang");
  const z = interpolate(f, [jj, jj + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const s = 1 - 0.48 * z;
  const rew = interpolate(f, [lima, lima + 20], [0, -5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wave = f >= skr ? 1 : 0;
  const hold = Math.sin(f / 15) * 6 * z;
  return (
    <AbsoluteFill>
      {z > 0 ? (
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.1)" }}>
          <World cam={{ k: 1.5, x: 600, y: -200 }}><KamarBack v /></World>
          <AbsoluteFill style={{ background: "rgba(30,36,64,0.45)" }} />
        </AbsoluteFill>
      ) : null}
      {z > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", transform: `translateY(${hold}px)`, opacity: z }}>
          <ellipse cx={170} cy={1420} rx={190} ry={260} fill={SKIN} />
          <ellipse cx={910} cy={1420} rx={190} ry={260} fill={SKIN} />
          <ellipse cx={950} cy={1480} rx={120} ry={180} fill={SKIN_SHADE} opacity={0.5} />
        </svg>
      ) : null}
      <AbsoluteFill style={{
        transform: `translateY(${hold - 40 * z}px) scale(${s})`, transformOrigin: "540px 880px",
        borderRadius: 120 * z, overflow: "hidden", boxShadow: z ? "0 0 0 46px #1B1E2E, 0 30px 60px 40px rgba(0,0,0,0.35)" : undefined,
      }}>
        <Sofa look={wave ? { x: 0, y: 0 } : z ? { x: 0, y: -6 } : { x: -12, y: -18 }} mouth={wave ? "grin" : z ? "o" : "flat"} eyes={z ? 1.1 : 1} brow={z && !wave ? 0.6 : 0} tilt={wave ? 6 : -4} />
        <Thought cx={290} top={300} w={360} h={280} delay={lima} tx={520} out={ramp(f, W(1, "atau"), 8)}>
          <Clock w={170} min={rew} hour={-60 + rew / 2} />
          <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>5 menit lalu?</span>
        </Thought>
      </AbsoluteFill>
      {z > 0.3 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", transform: `translateY(${hold}px)`, opacity: z }}>
          <rect x={210} y={1240} width={90} height={190} rx={45} fill={SKIN} transform="rotate(-24 255 1335)" />
          <rect x={790} y={1240} width={90} height={190} rx={45} fill={SKIN} transform="rotate(24 835 1335)" />
          <rect x={790} y={1250} width={30} height={170} rx={15} fill={SKIN_SHADE} opacity={0.5} transform="rotate(24 835 1335)" />
        </svg>
      ) : null}
      <Pill text="ya, kamu!" delay={W(1, "kamu")} top={270} color={THEME.amber} fontSize={64} exit={false} />
      <Amb src={BSB.room} vol={0.3} from={120} />
      <Snd at={jj - 4} src={BSB.cloth} vol={0.5} len={30} fade={6} />
    </AbsoluteFill>
  );
};

// ── 2 h3 hours a day staring at a small screen (time-lapse, real clock ticking) ──
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const jam = W(2, "berjam-jam");
  const sehari = W(2, "sehari");
  const layar = W(2, "layar");
  const lapse = interpolate(f, [jam, sehari + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dusk = Math.sin(lapse * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
  const tired = ramp(f, jam, 40);
  return (
    <AbsoluteFill>
      <Sofa phone thumb look={{ x: 0, y: 28 }} pitch={10} mouth="flat" eyes={0.85 - 0.25 * tired} drop={8 * tired} />
      <AbsoluteFill style={{ background: "#141A33", opacity: dusk * 0.5 }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(ellipse 260px 160px at 540px 1250px, rgba(155,227,255,${0.25 * dusk}) 0%, rgba(155,227,255,0) 100%)` }} />
      <Thought cx={270} top={300} w={340} h={270} delay={jam - 4} tx={520}>
        <Clock w={170} min={lapse * 60 * 14} />
        <span style={{ fontWeight: 900, fontSize: 38, color: THEME.ink }}>berjam-jam</span>
      </Thought>
      <Thought cx={810} top={300} w={340} h={270} delay={layar} tx={560}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <PhoneFront w={80} h={150} screen="#9BE3FF" />
          <svg width={30} height={160} viewBox="0 0 30 160">
            <rect x={4} y={0} width={22} height={160} rx={4} fill={THEME.amber} />
            {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={4} y={8 + i * 18} width={i % 2 ? 8 : 14} height={3} fill={THEME.ink} />)}
          </svg>
        </div>
        <span style={{ fontWeight: 900, fontSize: 38, color: THEME.ink }}>sekecil ini</span>
      </Thought>
      <Pill text="tiap hari" delay={sehari} top={650} color={THEME.primary} fontSize={44} />
      <Amb src={BSB.room} vol={0.3} from={300} />
      <Snd at={jam - 4} src={BSB.tick} vol={0.8} len={sehari + 34 - jam} fade={6} rate={1.6} />
    </AbsoluteFill>
  );
};

// ── 3 h4 the phone vanishes → title ─────────────────────────────────────────
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const hilang = W(3, "hilang");
  const selama = W(3, "selama");
  const gone = f >= hilang + 2;
  const shock = ramp(f, hilang + 4, 6);
  const title = ramp(f, selama - 4, 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: title ? `blur(${title * 8}px)` : undefined }}>
        <Sofa phone={!gone} look={{ x: 0, y: 28 - 4 * shock }} pitch={10} mouth={shock > 0.5 ? "o" : "flat"} eyes={0.85 + 0.35 * shock} brow={shock} worried={shock > 0.5} />
        <Puff at={hilang} x={PHONE.x} y={PHONE.y - 40} r={130} />
      </AbsoluteFill>
      {title > 0 ? (
        <AbsoluteFill style={{ opacity: title }}>
          <TitleCard text="30 hari tanpa hape?" exit={false} fontSize={170} maxWidth="86%" bg="rgba(30,36,64,0.55)" delay={selama} />
        </AbsoluteFill>
      ) : null}
      <Amb src={BSB.room} vol={0.3} from={500} />
      <Snd at={hilang - 3} src={BSB.air} vol={0.35} />
    </AbsoluteFill>
  );
};

// ── 4 h5 "Apa yang terjadi sama otak kita? Dan berapa lama sampai kita mulai panik?" ──
// The two questions become cards (Tracker, global) that stay pinned to the top for the whole video.
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const berapa = W(4, "berapa");
  const panik = W(4, "panik");
  const p = f >= panik ? 1 : 0;
  const dart = p ? Math.sign(Math.sin(f / 3)) * 24 : 0;
  return (
    <AbsoluteFill style={{ transform: p ? `translate(${Math.sin(f * 2.1) * 4}px, ${Math.cos(f * 1.7) * 3}px)` : undefined }}>
      <Sofa look={{ x: dart, y: p ? -4 : -18 }} mouth={p ? "o" : "flat"} worried={f >= berapa} eyes={p ? 1.12 : 1} brow={p} tilt={p ? Math.sin(f / 2) * 3 : -5} />
      <Amb src={BSB.room} vol={0.3} from={700} />
      <Snd at={panik - 2} src={BSB.heart} vol={0.2} len={60} fade={10} />
    </AbsoluteFill>
  );
};

// ── 5 b1 "Oke, kita jawab yang paling cepat dulu: panik. Ternyata nggak perlu nunggu 30 hari." ──
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const ter = W(5, "ternyata");
  const nunggu = W(5, "nunggu");
  const shake = f >= ter && f < nunggu ? Math.sin(f * 1.8) * 6 : 0;
  const x = interpolate(f, [nunggu, nunggu + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg c={THEME.primary} />
      <Big at={W(5, "oke")} top={430}>
        <div style={{ transform: `rotate(${shake - 4}deg)`, position: "relative" }}>
          <Calendar w={460} top="HARI KE-" big="30" color={THEME.orange} />
          <svg width={460} height={460} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 30 }}>
            <path d={`M14 14 L${14 + 72 * Math.min(1, x * 2)} ${14 + 72 * Math.min(1, x * 2)}`} stroke={THEME.amber} strokeWidth={9} strokeLinecap="round" />
            {x > 0.5 ? <path d={`M86 14 L${86 - 72 * (x * 2 - 1)} ${14 + 72 * (x * 2 - 1)}`} stroke={THEME.amber} strokeWidth={9} strokeLinecap="round" /> : null}
          </svg>
        </div>
      </Big>
      <Pill text="lebih cepat dari itu" delay={nunggu + 10} top={1080} color={THEME.orange} fontSize={56} exit={false} />
    </AbsoluteFill>
  );
};

// ── 6 b2 classroom study: phones collected, anxiety after 10 minutes, rising ──
const SEATS = [
  { x: 410, y: 720, w: 260, p: { shirt: THEME.teal, shirtShade: "#109583", hairStyle: "fluffy", hair: "#4A3428" } },
  { x: 410, y: 720, w: 0, p: A }, // ponytail: placeholder keeps A/B at indexes 2/3
  { x: 90, y: 820, w: 420, p: A },
  { x: 570, y: 820, w: 420, p: B },
] as const;
const BASKET = { x: 150, y: 660 };
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const simpan = W(6, "disimpan");
  const mulai = W(6, "mulai");
  const cemas = W(6, "cemas");
  const menit = W(6, "menit");
  const terutama = W(6, "terutama");
  const makin = W(6, "makin");
  const naik = W(6, "naik");
  const clockMin = interpolate(f, [mulai, menit + 6, 346], [0, 10, 40], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const meter = interpolate(f, [cemas, menit + 10, terutama + 20, makin, naik + 10], [0.06, 0.4, 0.55, 0.6, 0.95], clamp);
  const anx = f >= cemas;
  const spot = ramp(f, terutama, 10) * (1 - ramp(f, makin - 6, 10));
  return (
    <AbsoluteFill>
      <KelasBack clockMin={clockMin} meter={meter} />
      {SEATS.map((s, i) => {
        if (!s.w) return null;
        const me = i === 2;
        const worry = anx && (me || f >= makin || i === 3);
        const dart = me && f >= terutama ? Math.sign(Math.sin(f / 4)) * 22 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y }}>
            <Hero width={s.w} {...s.p} lightFrom="right" look={{ x: dart || (i % 2 ? -8 : 8), y: f >= simpan && f < simpan + 30 ? -12 : 0 }}
              mouth={worry ? (me && f >= makin ? "o" : "worried") : "smile"} worried={worry} eyesOpen={me && f >= terutama ? 1.1 : 1}
              headTilt={Math.sin((f + i * 23) / 18) * 3} headDrop={me && f >= makin ? 4 : 0} />
          </div>
        );
      })}
      <KelasDesks />
      {/* phones fly into the basket on the shelf */}
      {SEATS.map((s, i) => {
        const a = simpan + i * 5;
        if (f < a - 6 || !s.w) return null;
        const t = interpolate(f, [a, a + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const x0 = s.x + s.w / 2, y0 = s.y + s.w * 1.0;
        const x = interpolate(t, [0, 1], [x0, BASKET.x + (i - 1.5) * 26]);
        const y = interpolate(t, [0, 1], [y0, BASKET.y]) - Math.sin(t * Math.PI) * 220;
        return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 40, transform: `rotate(${t * 360 + i * 20}deg)` }}><PhoneFront w={44} h={78} screen="#2E355A" /></div>;
      })}
      <svg width={1080} height={1920} style={{ position: "absolute" }}><path d="M60 676 L240 676 L222 720 L78 720 Z" fill="#C99A62" /></svg>
      {/* dim everyone except A while "the heaviest users" */}
      <AbsoluteFill style={{ background: `radial-gradient(circle 300px at 300px 1030px, rgba(20,24,44,0) 60%, rgba(20,24,44,${0.55 * spot}) 100%)` }} />
      <Say left={300} top={700} delay={terutama + 20} text="Hapeku getar?" tail="left" size={46} />
      <PopIn delay={menit} exit={false} style={{ left: 40, top: 530 }}>
        <div style={{ background: THEME.orange, color: THEME.paper, fontFamily: THEME.font, fontWeight: 900, fontSize: 44, padding: "6px 24px", borderRadius: 999, boxShadow: "0 6px 0 rgba(0,0,0,0.18)" }}>10 MENIT</div>
      </PopIn>
      <Snd at={simpan - 4} src={BSB.cloth} vol={0.6} len={40} fade={6} />
      <Snd at={mulai} src={BSB.tick} vol={0.8} len={menit + 10 - mulai} fade={4} rate={1.4} />
      <Snd at={terutama + 14} src={BSB.vibratePocket} vol={0.22} len={34} fade={4} />
      <Snd at={makin} src={BSB.heart} vol={0.2} fade={20} loop />
    </AbsoluteFill>
  );
};

// ── 7 b3 "Orang Indonesia rata-rata main hape sekitar 6 jam sehari … lebih dari sepertiga waktu kita melek." ──
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const enam = W(7, "6");
  const itu = W(7, "itu");
  const melek = W(7, "melek");
  const ring = ramp(f, itu - 4, 10);
  const p = interpolate(f, [itu, itu + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: ring ? `blur(${ring * 10}px)` : undefined }}>
        <Sofa phone thumb look={{ x: 0, y: 28 }} pitch={10} mouth="flat" eyes={0.8} drop={6} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(30,36,64,0.6)", opacity: ring }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 270, display: "flex", justifyContent: "center", opacity: 1 - ring }}>
        {f >= enam - 6 ? <Count from={0} to={6} a={enam - 6} b={enam + 6} size={170} suffix=" JAM" /> : null}
      </div>
      <div style={{ opacity: 1 - ring }}><Pill text="sehari · #1 di dunia" delay={W(7, "dunia")} top={500} color={THEME.amber} fontSize={50} exit={false} /></div>
      {ring > 0 ? (
        <div style={{ position: "absolute", left: 340, top: 440, opacity: ring, transform: `scale(${1.7 * (0.8 + 0.2 * ring)})`, transformOrigin: "200px 200px" }}>
          <DayRing p={p} hiPhone={ramp(f, W(7, "sepertiga"), 8)} />
        </div>
      ) : null}
      {ring > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1060, display: "flex", justifyContent: "center", gap: 18, opacity: ramp(f, itu + 30, 10), fontFamily: THEME.font, fontWeight: 900, fontSize: 36 }}>
          {([["tidur 8", THEME.navy], ["hape 6", THEME.amber], ["lainnya", THEME.mint]] as const).map(([t, c]) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: THEME.paper }}><span style={{ width: 30, height: 30, borderRadius: 8, background: c, border: "3px solid #fff" }} />{t}</span>
          ))}
        </div>
      ) : null}
      <Pill text="> 1/3 waktu melek" delay={melek} top={1140} color={THEME.orange} fontSize={50} exit={false} />
      <Amb src={BSB.room} vol={0.3} from={900} />
      <Snd at={enam - 2} src={BSB.notif} vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 8 b4 "Terus gimana dengan otaknya? 30 hari belum ada yang neliti. Tapi 2 minggu udah." ──
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const tiga = W(8, "30");
  const tapi = W(8, "tapi");
  const flip = ramp(f, tapi, 10);
  return (
    <AbsoluteFill>
      <Bg c={THEME.primaryDark} />
      <Big at={W(8, "otaknya") - 4} top={300}>
        <div style={{ transform: `translateY(${Math.sin(f / 10) * 10}px) rotate(${Math.sin(f / 14) * 4}deg)`, display: "flex", alignItems: "center", gap: 10 }}>
          <Brain w={340} /><span style={txt(160, THEME.amber)}>?</span>
        </div>
      </Big>
      <Big at={tiga} top={720} left={60} width={440}>
        <div style={{ opacity: 1 - 0.5 * flip, transform: `scale(${1 - 0.15 * flip})` }}><Calendar w={360} top="STUDI" big="30 hari" color={THEME.orange} /></div>
      </Big>
      {f >= W(8, "belum") ? (
        <div style={{ position: "absolute", left: 60, width: 440, top: 860, display: "flex", justifyContent: "center", transform: `rotate(-10deg) scale(${spring({ frame: f - W(8, "belum"), fps: FPS, config: { damping: 11, stiffness: 220 } })})` }}>
          <span style={{ ...txt(64, THEME.amber), border: `8px solid ${THEME.amber}`, borderRadius: 20, padding: "0 20px", background: "rgba(30,36,64,0.9)", WebkitTextStroke: 0 }}>BELUM ADA</span>
        </div>
      ) : null}
      <Big at={tapi + 6} top={720} left={580} width={440}>
        <div style={{ position: "relative" }}>
          <Calendar w={360} top="STUDI" big="14 hari" color={THEME.teal} />
          <svg width={110} height={110} viewBox="0 0 100 100" style={{ position: "absolute", right: -30, top: -40 }}>
            <circle cx={50} cy={50} r={46} fill={THEME.paper} /><path d="M24 52 L44 72 L78 30" stroke={THEME.teal} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </Big>
      <Snd at={tapi + 2} src={BSB.air} vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 9 b5 "Peneliti minta 467 orang mematikan internet di hape mereka selama 2 minggu. Telepon dan SMS masih boleh." ──
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const n = W(9, "467");
  const mati = W(9, "mematikan");
  const tel = W(9, "telepon");
  const grid = interpolate(f, [n - 6, n + 30], [0, 467], { ...clamp, easing: Easing.out(Easing.cubic) });
  const off = ramp(f, mati, 14);
  const ok = (at: number, label: string, icon: React.ReactNode) => (
    <PopIn delay={at} exit={false} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: THEME.paper, borderRadius: 999, padding: "10px 28px 10px 14px", fontFamily: THEME.font, fontWeight: 900, fontSize: 44, color: THEME.ink, boxShadow: "0 6px 0 rgba(0,0,0,0.2)" }}>
        {icon}{label}
        <svg width={50} height={50} viewBox="0 0 100 100"><path d="M18 54 L42 76 L84 26" stroke={THEME.teal} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      </div>
    </PopIn>
  );
  return (
    <AbsoluteFill>
      <Bg c={THEME.navy} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 250, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24 }}>
        {f >= n - 6 ? <><Count from={0} to={467} a={n - 6} b={n + 30} size={150} color={THEME.amber} /><span style={txt(70)}>orang</span></> : null}
      </div>
      <div style={{ position: "absolute", left: 130, top: 450 }}><PeopleGrid n={grid} off={off} w={820} /></div>
      {f >= mati ? (
        <div style={{ position: "absolute", left: 390, top: 560, transform: `scale(${spring({ frame: f - mati, fps: FPS, config: { damping: 10 } })})` }}>
          <div style={{ width: 300, height: 300, borderRadius: 160, background: THEME.paper, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.25)" }}>
            <WifiIcon w={220} off={off} />
          </div>
        </div>
      ) : null}
      <Pill text="2 minggu" delay={W(9, "2")} top={900} color={THEME.orange} fontSize={56} exit={false} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1030, display: "flex", justifyContent: "center", gap: 24 }}>
        {ok(tel, "telepon", <svg width={50} height={50} viewBox="0 0 100 100"><path d="M28 12 Q12 14 14 34 Q22 66 62 86 Q84 92 88 74 L72 60 Q64 58 58 68 Q40 58 32 40 Q42 34 40 26 Z" fill={THEME.primary} /></svg>)}
        {ok(W(9, "pesan"), "SMS", <svg width={50} height={50} viewBox="0 0 100 100"><rect x={8} y={14} width={84} height={58} rx={16} fill={THEME.primary} /><path d="M26 70 L22 92 L48 70 Z" fill={THEME.primary} /></svg>)}
      </div>
    </AbsoluteFill>
  );
};

// ── 10 b6 "9 dari 10 orang membaik di salah satunya: suasana hati, kesehatan mental, atau fokus." ──
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const sembilan = W(10, "9");
  const baik = W(10, "membaik");
  const shirts = [THEME.teal, THEME.orange, THEME.primary, THEME.pink, THEME.amber];
  const icons = [
    [W(10, "suasana"), "hati", <HeartIcon key="h" w={110} />],
    [W(10, "kesehatan"), "mental", <svg key="m" width={110} height={110} viewBox="0 0 100 100"><path d="M50 8 L86 22 L84 54 Q80 80 50 94 Q20 80 16 54 L14 22 Z" fill={THEME.teal} /><path d="M34 50 L46 62 L68 38" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>],
    [W(10, "fokus"), "fokus", <svg key="f" width={110} height={110} viewBox="0 0 100 100">{[46, 32, 18].map((r, i) => <circle key={r} cx={50} cy={50} r={r} fill={i % 2 ? THEME.paper : THEME.orange} />)}<circle cx={50} cy={50} r={7} fill={THEME.navy} /></svg>],
  ] as const;
  return (
    <AbsoluteFill>
      <Bg c={THEME.teal} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 250, display: "flex", justifyContent: "center" }}>
        {f >= sembilan - 4 ? <span style={{ ...txt(150), transform: `scale(${spring({ frame: f - sembilan + 4, fps: FPS, config: { damping: 10 } })})` }}>9<span style={{ fontSize: 90 }}> dari </span>10</span> : null}
      </div>
      {Array.from({ length: 10 }).map((_, i) => {
        const lit = i !== 7 && f >= baik + (i % 5) * 2 + Math.floor(i / 5) * 4;
        return (
          <div key={i} style={{ position: "absolute", left: 30 + (i % 5) * 205, top: 470 + Math.floor(i / 5) * 270, filter: lit || f < baik ? undefined : "grayscale(0.9) brightness(0.9)" }}>
            <Hero width={200} shirt={shirts[i % 5]} shirtShade={THEME.navy} hairStyle={(["spiky", "bob", "fluffy"] as const)[i % 3]} lashes={i % 3 === 1}
              mouth={lit ? "grin" : "flat"} eyesOpen={lit ? 1 : 0.8} look={{ x: 0, y: 4 }} headTilt={Math.sin((f + i * 13) / 14) * 4} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1030, display: "flex", justifyContent: "center", gap: 40 }}>
        {icons.map(([at, label, icon]) => (
          <PopIn key={label} delay={at} exit={false} style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: THEME.paper, borderRadius: 30, padding: "16px 26px", boxShadow: "0 8px 0 rgba(0,0,0,0.18)", fontFamily: THEME.font, fontWeight: 900, fontSize: 38, color: THEME.ink }}>
              {icon}{label}
            </div>
          </PopIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 11 b7 "naiknya fokus mereka setara mundur 10 tahun dari penurunan karena umur." — grey hair turns dark ──
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const fokus = W(11, "fokus");
  const mundur = W(11, "mundur");
  const young = ramp(f, mundur, 30);
  const bar = interpolate(f, [fokus - 6, mundur], [0.35, 0.85], { ...clamp, easing: Easing.out(Easing.cubic) });
  const g = (a: number, b: number) => Math.round(a + (b - a) * young).toString(16).padStart(2, "0");
  const hair = `#${g(0xbf, 0x23)}${g(0xbb, 0x20)}${g(0xb6, 0x2b)}`;
  return (
    <AbsoluteFill>
      <Bg c={THEME.navy} />
      <div style={{ position: "absolute", left: 140, top: 280, width: 800, fontFamily: THEME.font, fontWeight: 900, fontSize: 44, color: THEME.paper }}>
        FOKUS
        <div style={{ marginTop: 10, height: 64, borderRadius: 40, background: "#2E355A" }}>
          <div style={{ width: `${bar * 100}%`, height: 64, borderRadius: 40, background: THEME.teal }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 270, top: 520 }}>
        <Hero width={540} {...A} hair={hair} mouth={young > 0.5 ? "grin" : "smile"} eyesOpen={young > 0.5 ? 1.1 : 0.85} browUp={young} look={{ x: 0, y: 0 }} headTilt={Math.sin(f / 16) * 3} />
      </div>
      {f >= mundur - 4 && f < mundur + 40 ? (
        <div style={{ position: "absolute", left: 760, top: 500 }}><Clock w={180} min={-(f - mundur) * 8} hour={-(f - mundur) * 2} /></div>
      ) : null}
      <Stamp at={W(11, "10")} text="−10 TAHUN" top={1080} size={110} color={THEME.amber} rot={-6} />
      <Snd at={mundur - 2} src={BSB.tick} vol={0.8} len={40} fade={4} rate={2} />
    </AbsoluteFill>
  );
};

// ── 12 b8 "bukan sulap. Tanpa internet, mereka lebih sering ketemu orang, olahraga, dan jalan di luar." ──
const BIRDS = [0, 1, 2, 3, 4];
const S12: React.FC = () => {
  const f = useCurrentFrame();
  const tanpa = W(12, "tanpa");
  const ketemu = W(12, "ketemu");
  const olah = W(12, "olahraga");
  const jalan = W(12, "jalan");
  const bx = interpolate(f, [tanpa, ketemu - 4], [1100, 560], { ...clamp, easing: Easing.out(Easing.quad) });
  const walking = f >= tanpa && f < ketemu - 4;
  const jog = f >= olah && f < jalan + 10;
  const step = (k: number) => (walking && k ? Math.abs(Math.sin(f / 4)) * -14 : jog ? Math.abs(Math.sin(f / 2.6 + k)) * -26 : 0);
  const items = [[ketemu, "ketemu orang"], [olah, "olahraga"], [jalan, "jalan di luar"]] as const;
  return (
    <AbsoluteFill>
      <Layer to={1.05} drift={16}>
        <StreetBack />
        {f >= jalan - 6 ? BIRDS.map((i) => {
          const t = (f - jalan + 6) / 70 + i * 0.07;
          return <svg key={i} width={60} height={30} style={{ position: "absolute", left: -80 + t * 1300, top: 330 + i * 34 + Math.sin(f / 5 + i) * 10 }}><path d={`M4 ${18 - 8 * Math.sin(f / 3 + i)} Q16 6 30 18 Q44 6 56 ${18 - 8 * Math.sin(f / 3 + i)}`} stroke={THEME.navy} strokeWidth={5} fill="none" strokeLinecap="round" /></svg>;
        }) : null}
        <div style={{ position: "absolute", left: 60, top: 780 + step(0) }}>
          <Hero width={440} {...A} lightFrom="right" mouth={f >= ketemu ? "grin" : "smile"} look={{ x: 16, y: 0 }} headTilt={jog ? 6 : 4} />
        </div>
        {f >= tanpa ? (
          <div style={{ position: "absolute", left: bx, top: 780 + step(1) }}>
            <Hero width={440} {...B} lightFrom="right" mouth={f >= ketemu ? "grin" : "smile"} look={{ x: -16, y: 0 }} headTilt={jog ? -6 : -4} />
          </div>
        ) : null}
        <Hedge top={1290} />
      </Layer>
      <div style={{ opacity: 1 - ramp(f, tanpa - 4, 8) }}><Pill text="bukan sulap" delay={W(12, "bukan")} top={300} color={THEME.primary} fontSize={60} exit={false} /></div>
      <div style={{ position: "absolute", left: 90, top: 270, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map(([at, t]) => (
          <PopIn key={t} delay={at} exit={false} style={{ position: "relative", transformOrigin: "0 50%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: THEME.paper, borderRadius: 999, padding: "6px 26px 6px 10px", fontFamily: THEME.font, fontWeight: 900, fontSize: 46, color: THEME.ink, boxShadow: "0 6px 0 rgba(0,0,0,0.18)" }}>
              <span style={{ width: 52, height: 52, borderRadius: 99, background: THEME.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={34} height={34} viewBox="0 0 100 100"><path d="M18 54 L42 76 L84 26" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              </span>{t}
            </div>
          </PopIn>
        ))}
      </div>
      <Amb src={BSB.street} vol={0.09} from={60} />
      <Snd at={tanpa} src={BSB.steps} vol={0.45} len={ketemu - tanpa} fade={6} />
      <Snd at={olah} src={BSB.run} vol={0.6} from={90} len={jalan + 10 - olah} fade={6} />
      <Snd at={jalan - 8} src={BSB.birds} vol={0.25} fade={14} from={300} />
    </AbsoluteFill>
  );
};

// ── 13 b9 "Efeknya masih kerasa 2 minggu setelah internetnya nyala lagi." ──
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const nyala = W(13, "nyala");
  const on = ramp(f, nyala - 4, 10);
  return (
    <AbsoluteFill>
      <Sofa phone look={{ x: 0, y: 20 }} pitch={6} mouth="smile" eyes={1} />
      <Thought cx={280} top={330} w={340} h={260} delay={W(13, "efeknya")} tx={520}>
        <Brain w={170} />
        <span style={{ fontWeight: 900, fontSize: 38, color: THEME.ink }}>masih segar</span>
      </Thought>
      <Big at={W(13, "setelah")} top={330} left={640} width={340}>
        <div style={{ width: 240, height: 240, borderRadius: 130, background: THEME.paper, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 0 rgba(0,0,0,0.2)" }}>
          <WifiIcon w={170} off={1 - on} color={on > 0.5 ? THEME.teal : THEME.primary} />
        </div>
      </Big>
      <Pill text="+2 minggu kemudian" delay={W(13, "2")} top={640} color={THEME.teal} fontSize={50} exit={false} />
      <Amb src={BSB.room} vol={0.3} from={1100} />
      <Snd at={nyala + 4} src={BSB.notif} vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 14 b10 "Tapi jujur aja, ini nggak gampang. Cuma seperempat peserta yang kuat sampai 2 minggu penuh." ──
const S14: React.FC = () => {
  const f = useCurrentFrame();
  const jujur = W(14, "jujur");
  const gampang = W(14, "gampang");
  const cuma = W(14, "cuma");
  const fidget = f >= gampang && f < gampang + 24 ? Math.sin(f / 3) * 16 : 0;
  const card = ramp(f, cuma - 4, 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * ramp(f, 0, 12)})`, transformOrigin: "540px 900px" }}>
        <Sofa look={{ x: -20, y: -18 }} mouth={f >= gampang ? "worried" : "flat"} worried angry={f >= jujur && f < cuma} dx={fidget} tilt={-6} />
      </AbsoluteFill>
      <Thought cx={290} top={330} w={340} h={280} delay={jujur - 6} tx={520} out={card}>
        <div style={{ position: "relative", transform: `translateX(${Math.sin(f * 2.5) * 3}px)` }}>
          <PhoneFront w={110} h={190} screen="#9BE3FF" />
          <span style={{ position: "absolute", right: -40, top: -20, background: THEME.orange, color: "#fff", fontFamily: THEME.font, fontWeight: 900, fontSize: 34, borderRadius: 30, padding: "2px 12px" }}>99+</span>
        </div>
      </Thought>
      {card > 0 ? (
        <div style={{ position: "absolute", left: 140, top: 300, width: 800, opacity: card, transform: `scale(${0.9 + 0.1 * card})`, background: THEME.paper, borderRadius: 40, padding: "30px 0", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", gap: 34 }}>
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} width={130} height={170} viewBox="0 0 100 130">
                <circle cx={50} cy={34} r={26} fill={i === 0 ? THEME.teal : "#C9CFDB"} />
                <path d="M10 126 Q10 70 50 70 Q90 70 90 126 Z" fill={i === 0 ? THEME.teal : "#C9CFDB"} />
              </svg>
            ))}
          </div>
          <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 60, color: THEME.ink, marginTop: 10 }}>cuma <span style={{ color: THEME.teal }}>1 dari 4</span> kuat</div>
        </div>
      ) : null}
      <Amb src={BSB.room} vol={0.3} from={1300} />
      <Snd at={jujur - 4} src={BSB.vibrate} vol={0.45} from={60} len={40} fade={4} />
      <Snd at={gampang} src={BSB.cloth} vol={0.6} len={28} fade={6} />
    </AbsoluteFill>
  );
};

// ── 15 b11 "otak kita bakal panik di awal, tapi besar kemungkinan malah lebih tenang dan lebih fokus." ──
const S15: React.FC = () => {
  const f = useCurrentFrame();
  const otak = W(15, "otak");
  const panik = W(15, "panik");
  const tenang = W(15, "tenang");
  const p = interpolate(f, [otak, panik + 10, tenang], [0, 0.3, 1], clamp);
  const calmFace = f >= tenang - 10;
  const scared = f >= panik && !calmFace;
  return (
    <AbsoluteFill>
      <Bg c={THEME.mint} />
      <div style={{ position: "absolute", left: 90, top: 330 }}><MoodChart p={p} calm={ramp(f, tenang, 10)} /></div>
      <div style={{ position: "absolute", left: 330, top: 840 }}>
        <Hero width={420} {...A} mouth={calmFace ? "grin" : scared ? "o" : "flat"} worried={scared} eyesOpen={scared ? 1.12 : calmFace ? 0.9 : 1} browUp={scared ? 1 : 0}
          look={{ x: scared ? Math.sign(Math.sin(f / 3)) * 20 : 0, y: 0 }} headTilt={Math.sin(f / 16) * 4} />
      </div>
      <Snd at={panik - 2} src={BSB.heart} vol={0.18} len={tenang - panik} fade={10} />
    </AbsoluteFill>
  );
};

// ── 16 b12 "Nggak perlu buang hape kok. Coba aja matiin data seharian pas akhir pekan." ──
const S16: React.FC = () => {
  const f = useCurrentFrame();
  const matiin = W(16, "matiin");
  const on = 1 - interpolate(f, [matiin, matiin + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg c={THEME.teal} />
      <Big at={W(16, "nggak") - 4} top={280}>
        <div style={{ transform: `rotate(${Math.sin(f / 18) * 2}deg)` }}>
          <PhoneFront w={460} h={860} screen="#EEF1F8">
            <div style={{ padding: "90px 26px 0", display: "flex", flexDirection: "column", gap: 26 }}>
              <Toggle label="Data seluler" on={on} />
              <Toggle label="Wi-Fi" on={on} />
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 30 }}>
                {[0, 1].map((i) => (
                  <PopIn key={i} delay={W(16, "akhir") + i * 6} exit={false} style={{ position: "relative" }}>
                    <Calendar w={160} top={["SAB", "MIN"][i]} big="off" color={THEME.orange} />
                  </PopIn>
                ))}
              </div>
            </div>
          </PhoneFront>
        </div>
      </Big>
      <Pill text="seharian aja" delay={W(16, "seharian")} top={1160} color={THEME.navy} fontSize={50} exit={false} />
    </AbsoluteFill>
  );
};

// ── 17 b13 "Kamu kira-kira kuat berapa lama? Tulis di komentar." ──
const S17: React.FC = () => {
  const f = useCurrentFrame();
  const kamu = W(17, "kamu");
  return (
    <AbsoluteFill>
      <Layer to={1.04} drift={-12}>
        <StreetBack />
        <div style={{ position: "absolute", left: 40, top: 740 }}>
          <Hero width={480} {...A} lightFrom="right" mouth={f >= kamu && f < W(17, "tulis") ? "open" : "grin"} look={{ x: 0, y: 0 }} browUp={0.4} headTilt={Math.sin(f / 14) * 4} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 740 }}>
          <Hero width={480} {...B} lightFrom="right" mouth="smile" look={{ x: 0, y: 0 }} headTilt={-4 + Math.sin(f / 16) * 3} />
        </div>
        <Hedge top={1290} />
      </Layer>
      <CommentCta at={LAST + 14} text="Kamu kuat berapa lama?" chime={false} />
      <Amb src={BSB.birds} vol={0.2} from={900} />
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17];
// default soft fade; colour wipes only where the topic turns, whip into the "Tapi" twist
const TRANS: Record<number, () => unknown> = { 2: whipBlur, 4: () => colorWipe(THEME.amber), 7: () => colorWipe(THEME.teal), 13: whipBlur, 16: () => colorWipe(THEME.amber) };

export const Hape2m: React.FC = () => {
  const f = useCurrentFrame();
  const teaser = 1 - ramp(f, START[3] - 6, 8);
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
      {/* frame-0 promise, until the title card takes over */}
      {teaser > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 150, display: "flex", justifyContent: "center", opacity: teaser, transform: `scale(${0.6 + 0.4 * spring({ frame: f, fps: FPS, config: { damping: 11 } })})` }}>
          <div style={{ background: THEME.amber, color: THEME.ink, fontFamily: THEME.font, fontWeight: 900, fontSize: 56, padding: "8px 40px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", transform: `rotate(${-2 + Math.sin(f / 10)}deg)` }}>30 HARI TANPA HAPE?</div>
        </div>
      ) : null}
      <Tracker otakIn={G(4, "otak") - 2} panikIn={G(4, "panik") - 2} fly={START[5] - 4}
        pulseP={G(5, "panik")} panikDone={G(6, "menit") + 12} pulseO={G(8, "otaknya")} otakDone={G(15, "tenang")} />
      <Captions caps={timeline.captions} hideScenes={[3]} />
      <Audio src={staticFile(timeline.audio)} volume={1} />
      <Audio src={staticFile("hape2m/music.wav")} volume={(fr) => 0.07 * Math.min(1, fr / 20, (TOTAL - fr) / 40)} />
    </AbsoluteFill>
  );
};
