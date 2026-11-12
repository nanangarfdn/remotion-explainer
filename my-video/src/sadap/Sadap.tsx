import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Chibi } from "../explainer/Chibi";
import { Captions } from "../explainer/Captions";
import { Layer, LabelPill, PopIn, Sfx, THEME, TRANSITION_FRAMES as T, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, KamarDesk, RuangBack, RuangFront, RuangSofaBack } from "../contoh/sets";
import { Chat, Notif, PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { Hedge, Megaphone, Mic, StreetBack } from "./street";
import timeline from "../../public/voiceover/sadap/timeline.json";
import {
  ApkFile, Battery, Bug, CourtHouse, Crackle, Crosshair, NoTap, OtpLock, Paper, PhoneFront, Shield, SpyEye,
  Thermo, Tower, WaveIcon,
} from "./icons";

// "HP kamu bisa disadap nggak?" — 1080×1920 short, one continuous ElevenLabs take.
// Cuts sit mid-silence between lines (scripts/align.py); each transition is centred on its cut, so the
// narration plays as one track and scenes never wait for it. Beats use word starts: W(scene, word).
const FPS = 30;
const SC = timeline.scenes;
const N = SC.length;
export const SADAP_DURATION = Math.ceil(timeline.duration * FPS) + 20;
const START = SC.map((s, i) => (i ? Math.round(s.start * FPS) - T / 2 : 0));
const DUR = SC.map((s, i) => (i < N - 1 ? Math.round(s.end * FPS) + T / 2 : SADAP_DURATION) - START[i]);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, "");
const W = (i: number, word: string, nth = 0) => {
  const c = timeline.captions.filter((x) => x.scene === i && norm(x.w) === word)[nth];
  if (!c) throw new Error(`word "${word}" #${nth} not in scene ${i}`);
  return Math.round(c.s * FPS) - START[i];
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, len = 8) => interpolate(f, [a, a + len], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

// Pill centred horizontally at `top`.
const Pill: React.FC<{ text: string; delay: number; top: number; color?: string; fontSize?: number }> = ({ text, delay, top, color, fontSize = 52 }) => (
  <LabelPill text={text} delay={delay} color={color} fontSize={fontSize}
    style={{ left: 0, width: 1080, top, display: "flex", justifyContent: "center" }} />
);

const Badge: React.FC<{ n: string; size?: number; bg?: string; ink?: string }> = ({ n, size = 140, bg = THEME.amber, ink = THEME.ink }) => (
  <div style={{
    width: size, height: size, borderRadius: 999, background: bg, color: ink, fontFamily: THEME.font, fontWeight: 900,
    fontSize: size * 0.62, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 0 rgba(0,0,0,0.2)",
  }}>{n}</div>
);

// Dashed link that draws itself from (x1,y1) to (x2,y2) and then flows.
const Link: React.FC<{ x1: number; y1: number; x2: number; y2: number; from: number; color?: string }> = ({ x1, y1, x2, y2, from, color = THEME.amber }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, from, 12);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id={`lk-${from}`}><circle cx={x1} cy={y1} r={len * p + 1} /></clipPath>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={10} strokeLinecap="round"
        strokeDasharray="4 26" strokeDashoffset={-frame * 2} clipPath={`url(#lk-${from})`} />
    </svg>
  );
};

// ── 1 Hook: on a call at the desk, a crackle, then suspicion ──────────────
const HOOK_CAM = { k: 1.5, x: 600, y: -200 };
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const kres = W(0, "kresek");
  const mikir = W(0, "langsung");
  const jj = W(0, "jangan-jangan");
  const sadap = W(0, "disadap");
  const flinch = interpolate(f, [kres, kres + 3, kres + 14, kres + 24], [0, 1, 1, 0], clamp);
  const sus = ramp(f, mikir, 10);
  const listen = f < kres ? Math.sin(f / 9) * 3 : 0; // small nods while listening
  const shake = flinch * Math.sin(f * 2.2) * 6;
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><World cam={HOOK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.07} drift={24}>
        <World cam={HOOK_CAM}>
          <div style={{ position: "absolute", left: 700 + shake, top: 80 }}>
            {/* phone pressed to the ear: eyes slide toward it (viewer-left) once suspicious */}
            <Chibi width={520} pose="call" glow="#BFE9FF" worried={f >= mikir}
              look={{ x: -26 * sus, y: 6 * sus }} headTilt={6 * flinch - 4 * sus} headDrop={listen}
              mouth={flinch > 0.3 ? "o" : f >= mikir ? "worried" : "smile"} eyesOpen={1 - 0.45 * flinch - 0.12 * sus} />
          </div>
        </World>
      </Layer>
      <Layer to={1.11} drift={40}><World cam={HOOK_CAM}><KamarDesk v /></World></Layer>
      {/* overlays in screen px */}
      <Layer to={1.04}>
        {f >= kres && f < mikir + 24 ? (
          <div style={{ position: "absolute", left: 70, top: 590, opacity: interpolate(f, [kres, kres + 2, mikir + 14, mikir + 24], [0, 1, 1, 0], clamp) }}>
            <Crackle w={210} />
          </div>
        ) : null}
        <PopIn delay={jj} style={{ left: 700, top: 300 }}>
          <svg width={210} height={190} viewBox="0 0 210 190" style={{ overflow: "visible" }}>
            <circle cx={30} cy={170} r={12} fill={THEME.paper} />
            <circle cx={58} cy={140} r={18} fill={THEME.paper} />
            <ellipse cx={120} cy={74} rx={90} ry={74} fill={THEME.paper} />
          </svg>
          <div style={{ position: "absolute", left: 30, top: 0, width: 180, height: 148, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {f < sadap ? (
              <span style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 110, color: THEME.primary }}>?</span>
            ) : (
              <div style={{ transform: `scale(${spring({ frame: f - sadap, fps: FPS, config: { damping: 9 } })})` }}>
                <SpyEye w={110} look={Math.sin(f / 8)} />
              </div>
            )}
          </div>
        </PopIn>
      </Layer>
      <Sfx at={kres} src="sfx/crackle.wav" volume={0.55} />
      <Sfx at={jj} src="sfx/pluck_001.ogg" volume={0.5} />
      <Sfx at={sadap} src="sfx/glass_001.ogg" volume={0.45} />
    </AbsoluteFill>
  );
};

// ── 2 Title over the blurred call shot (the story keeps moving behind the words) ──
const Title: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(9px)", transform: `scale(${1.08 + f * 0.0015})` }}>
        <World cam={HOOK_CAM}><KamarBack v /></World>
        <World cam={HOOK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} pose="call" glow="#BFE9FF" worried look={{ x: -26, y: 6 }} headTilt={-4 + Math.sin(f / 5) * 2}
              mouth="worried" eyesOpen={0.88} />
          </div>
        </World>
        <World cam={HOOK_CAM}><KamarDesk v /></World>
      </AbsoluteFill>
      <TitleCard text="HP kamu bisa disadap?" exit={false} fontSize={180} maxWidth="86%" bg="rgba(30,36,64,0.6)" />
      <PopIn delay={T / 2 + 18} style={{ left: 470, top: 1330 }} exit={false}>
        <SpyEye w={140} look={Math.sin(f / 6)} />
      </PopIn>
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={T / 2 + i * 4} src="sfx/pluck_001.ogg" volume={0.45} />)}
    </AbsoluteFill>
  );
};

// ── 3 Two kinds; #1 lawful interception: your call → operator tower ← officer's request ──
// Street world 1600 px wide; the camera pans right from the caller to the court on "cuma".
const RW = 1600;
const OFFICER = { x: 1000, y: 600, w: 300 };
const RK = 1.3; // world zoom: ground lands at y≈1350, characters fill the middle band // hands at viewBox (200,466)
const Resmi: React.FC = () => {
  const f = useCurrentFrame();
  const oke = W(2, "oke");
  const dua = W(2, "dua");
  const satu = W(2, "pertama");
  const peny = W(2, "penyadapan");
  const cuma = W(2, "cuma");
  const hukum = W(2, "penegakan");
  const minta = W(2, "permintaan");
  const aparat = W(2, "aparat");
  const pan = interpolate(f, [cuma - 6, hukum + 4], [0, 480], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const k = OFFICER.w / 400;
  const hx = OFFICER.x + 200 * k;
  const hy = OFFICER.y + 440 * k;
  // the request letter leaves the officer's hands, arcs to the tower, gets stamped "IZIN" on "aparat"
  const fly = interpolate(f, [minta, minta + 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = hx - 55 + (660 - hx) * fly;
  const py = hy - 70 + (700 - hy) * fly - Math.sin(fly * Math.PI) * 180;
  const talk = f % 14 < 7 && f < cuma; // chatting on the phone until the camera leaves
  const swapPill = ramp(f, satu, 8);
  return (
    <AbsoluteFill>
      <Layer to={1.05}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${RK})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: -pan * 0.4, top: 0 }}><StreetBack w={RW} /></div>
        <div style={{ position: "absolute", left: -pan, top: 0, width: RW, height: 1920 }}>
          <div style={{ position: "absolute", left: 470, top: 540 }}><Tower w={340} pulse={f >= satu ? (f % 30) / 30 : 0} /></div>
          <div style={{ position: "absolute", left: 1000, top: 620 }}><CourtHouse w={420} /></div>
          {/* caller: phone at the ear, its signal goes to the operator tower */}
          <div style={{ position: "absolute", left: 30, top: 640 }}>
            <Chibi width={400} pose="call" lightFrom="right" mouth={talk ? "o" : "smile"} look={{ x: 10 * ramp(f, satu, 10), y: -6 }}
              headTilt={Math.sin(f / 14) * 3} />
          </div>
          {f >= satu ? <Link x1={90} y1={850} x2={630} y2={600} from={satu} /> : null}
          {/* officer (plain cap, no insignia) holds the request letter */}
          <div style={{ position: "absolute", left: OFFICER.x, top: OFFICER.y }}>
            <Chibi width={OFFICER.w} shirt="#2A3358" shirtShade="#1E2440" hat="#2A3358" pose="hold" lightFrom="right" mouth="flat"
              look={{ x: -24 * ramp(f, minta, 6), y: -10 * fly }}>
              {f < minta ? <g transform="translate(160 380) rotate(-6 40 50)"><Paper w={80} /></g> : null}
            </Chibi>
          </div>
          {f >= aparat + 8 ? <Link x1={700} y1={660} x2={1000} y2={800} from={aparat + 8} color={THEME.teal} /> : null}
          {f >= minta ? (
            <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${(1 - fly) * -14}deg)` }}>
              <Paper w={110} stamp={spring({ frame: f - aparat, fps: FPS, config: { damping: 8 } })} />
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: -pan * 1.15, top: 0 }}><Hedge w={RW * 1.3} top={990} /></div>
        </div>
      </Layer>
      {/* screen-space headline: "2 jenis" → "1 · penyadapan resmi" */}
      <div style={{ opacity: 1 - swapPill }}><Pill text="ada 2 jenis" delay={dua} top={280} color={THEME.navy} /></div>
      <Pill text="1 · penyadapan resmi" delay={satu} top={280} color={THEME.primary} />
      <Pill text="penegakan hukum" delay={hukum} top={420} color={THEME.teal} fontSize={46} />
      <Sfx at={oke} src="sfx/pluck_001.ogg" volume={0.45} />
      <Sfx at={dua} src="sfx/pluck_002.ogg" volume={0.45} />
      <Sfx at={peny} src="sfx/confirmation_001.ogg" volume={0.4} />
      <Sfx at={cuma - 6} src="sfx/whoosh.wav" volume={0.25} />
      <Sfx at={minta} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={aparat} src="sfx/drop_002.ogg" volume={0.55} />
    </AbsoluteFill>
  );
};

// ── 4 #2 spyware: phone on the table gets in without a tap → then it's aimed at specific people ──
const ChatRow: React.FC<{ show: number; mine?: boolean; w?: number }> = ({ show, mine, w = 190 }) => (
  <div style={{
    alignSelf: mine ? "flex-end" : "flex-start", width: w, height: 58, borderRadius: 18, margin: "12px 18px",
    background: mine ? THEME.mint : THEME.paper, opacity: show, transform: `translateY(${(1 - show) * 30}px)`,
    boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
  }} />
);
// Table seen from above (the phone lies screen-up, so its screen faces the camera).
const Table: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#B98557" }}>
      <svg width={1080} height={1920}>
        {[220, 520, 820, 1120, 1420, 1720].map((y) => (
          <g key={y}>
            <rect x={0} y={y} width={1080} height={6} fill="#000" opacity={0.12} />
            <path d={`M0 ${y + 120} C300 ${y + 100} 700 ${y + 150} 1080 ${y + 115}`} stroke="#000" strokeWidth={3} opacity={0.06} fill="none" />
          </g>
        ))}
        {/* mug from above: the coffee surface ripples */}
        <g transform="translate(170 1060)">
          <circle r={130} fill="#000" opacity={0.15} cx={8} cy={12} />
          <rect x={100} y={-30} width={90} height={60} rx={30} fill="#F1ECE2" />
          <circle r={130} fill="#F1ECE2" />
          <circle r={104} fill="#6B3F22" />
          {[0, 1, 2].map((i) => {
            const t = ((f / 40 + i / 3) % 1);
            return <circle key={i} r={20 + t * 80} fill="none" stroke="#fff" strokeWidth={3} opacity={0.25 * (1 - t)} />;
          })}
        </g>
        {/* pen */}
        <g transform="rotate(-28 900 1180)">
          <rect x={820} y={1160} width={240} height={30} rx={15} fill={THEME.primary} />
          <path d="M820 1160 L780 1175 L820 1190 Z" fill="#E7E1D6" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
const Mata: React.FC = () => {
  const f = useCurrentFrame();
  const kedua = W(3, "kedua");
  const apl = W(3, "aplikasi");
  const masuk = W(3, "masuk");
  const tanpa = W(3, "tanpa");
  const tapi = W(3, "tapi");
  const target = W(3, "targetnya");
  const jur = W(3, "jurnalis");
  const akt = W(3, "aktivis");
  // camera slides from the table to the street on "tapi"
  const sw = interpolate(f, [tapi, tapi + 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const blur = Math.sin(sw * Math.PI) * 14;
  const buzz = f >= masuk && f < masuk + 14 ? Math.sin(f * 3.1) * 7 : 0;
  const eyeIn = ramp(f, masuk + 6, 12);
  const lock = (d: number) => interpolate(f, [d, d + 14], [140, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  // before locking, each crosshair sweeps across the crowd
  const aim = (d: number, x: number) => (f < d ? x + Math.sin(f / 6) * 120 : x);
  const people: [number, number, string, string, string, number][] = [
    [jur, 30, "jurnalis", THEME.teal, "#0E8B78", 0],
    [akt, 570, "aktivis", THEME.orange, THEME.orangeDark, 5],
  ];
  return (
    <AbsoluteFill>
      {/* A: the table */}
      <AbsoluteFill style={{ transform: `translateX(${-1080 * sw}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <Layer to={1.06}>
          <Table />
          <div style={{ position: "absolute", left: 330, top: 560, transform: `rotate(-5deg) translateX(${buzz}px)` }}>
            <PhoneFront w={400} h={700} screen="#E9EDF5">
              <div style={{ display: "flex", flexDirection: "column", paddingTop: 60 }}>
                <ChatRow show={1} />
                <ChatRow show={1} mine w={160} />
                <ChatRow show={ramp(f, masuk, 8)} w={240} />
              </div>
              {/* the eye slips out of the new message into the phone */}
              <div style={{
                position: "absolute", left: 30 + 240 * eyeIn, top: 250 + 300 * eyeIn, opacity: Math.min(1, eyeIn * 3),
                transform: `scale(${0.4 + 0.6 * eyeIn})`,
              }}>
                <SpyEye w={100} look={Math.sin(f / 7)} />
              </div>
            </PhoneFront>
          </div>
          {buzz ? [0, 1].map((i) => (
            <div key={i} style={{ position: "absolute", left: i ? 760 : 270, top: 700, width: 40, height: 120, borderLeft: `8px solid ${THEME.amber}`, borderRadius: 40, opacity: 0.8, transform: `scaleX(${i ? -1 : 1})` }} />
          )) : null}
        </Layer>
        <PopIn delay={tanpa} style={{ left: 780, top: 1000 }} exit={false}>
          <NoTap w={200} ring={ramp(f, tanpa + 2, 10)} />
        </PopIn>
        <PopIn delay={kedua} style={{ left: 190, top: 270 }} exit={false}><Badge n="2" size={120} /></PopIn>
        <LabelPill text="aplikasi mata-mata" delay={apl} color={THEME.navy} fontSize={52} exit={false} style={{ left: 330, top: 290 }} />
      </AbsoluteFill>
      {/* B: the street — only specific people get targeted */}
      {sw > 0 ? (
        <AbsoluteFill style={{ transform: `translateX(${1080 * (1 - sw)}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
          <Layer to={1.05} drift={-20}>
            <StreetBack />
            {people.map(([d, x, label, shirt, shade, lag]) => (
              <PopIn key={label} delay={target + lag} style={{ left: x, top: 720 }}>
                <Chibi width={480} shirt={shirt} shirtShade={shade} pose="hold" lightFrom="right"
                  mouth={label === "aktivis" ? "o" : f % 12 < 6 ? "o" : "smile"} worried={f >= d + 6} look={{ x: label === "aktivis" ? 18 : -10, y: 0 }}>
                  {label === "aktivis" ? <Megaphone shout={0.5 + 0.5 * Math.sin(f / 3)} /> : <Mic />}
                </Chibi>
              </PopIn>
            ))}
            <Hedge top={1300} />
          </Layer>
          {people.map(([d, x, label]) => (
            <React.Fragment key={label}>
              <div style={{ position: "absolute", left: aim(d, x + 40), top: 748, opacity: f >= target + 8 ? 0.35 + 0.65 * ramp(f, d, 6) : 0 }}>
                <Crosshair w={400} spin={f < d ? f * 2 : lock(d)} />
              </div>
              <LabelPill text={label} delay={d + 6} fontSize={44} color={THEME.navy}
                style={{ left: x, width: 480, top: 668, display: "flex", justifyContent: "center" }} />
            </React.Fragment>
          ))}
          <Pill text="target tertentu" delay={target} top={280} color={THEME.primary} />
        </AbsoluteFill>
      ) : null}
      <Sfx at={kedua} src="sfx/pluck_002.ogg" volume={0.45} />
      <Sfx at={masuk} src="sfx/glass_001.ogg" volume={0.4} />
      <Sfx at={tanpa} src="sfx/drop_002.ogg" volume={0.4} />
      <Sfx at={tapi} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={target} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={jur} src="sfx/tick_001.ogg" volume={0.5} />
      <Sfx at={jur + 14} src="sfx/confirmation_001.ogg" volume={0.35} />
      <Sfx at={akt} src="sfx/tick_001.ogg" volume={0.5} />
      <Sfx at={akt + 14} src="sfx/confirmation_001.ogg" volume={0.35} />
    </AbsoluteFill>
  );
};

// ── 5 Myths: at the desk, worried thoughts pop up → MITOS stamp, relief ─────
// Wider desk shot than the hook: head starts ~y 614, thought bubbles fit above it.
const DESK_CAM = { k: 1.2, x: 510, y: -380 };
const Thought: React.FC<{ cx: number; delay: number; out: number; label: string; children: React.ReactNode }> = ({ cx, delay, out, label, children }) => {
  const f = useCurrentFrame();
  const bob = Math.sin((f + cx) / 13) * 8;
  return (
    <PopIn delay={delay} style={{ left: cx - 130, top: 370 + bob, opacity: 1 - out }} exit={false}>
      <div style={{ transform: `scale(${1 - out})` }}>
        <svg width={260} height={330} viewBox="0 0 260 330" style={{ position: "absolute", overflow: "visible" }}>
          <ellipse cx={130} cy={118} rx={128} ry={112} fill={THEME.paper} />
          <circle cx={130 + (540 - cx) * 0.18} cy={262} r={16} fill={THEME.paper} />
          <circle cx={130 + (540 - cx) * 0.3} cy={304} r={10} fill={THEME.paper} />
        </svg>
        <div style={{ position: "relative", width: 260, height: 236, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {children}
          <span style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 40, color: THEME.ink, marginTop: -6 }}>{label}</span>
        </div>
      </div>
    </PopIn>
  );
};
const Mitos: React.FC = () => {
  const f = useCurrentFrame();
  const nah = W(4, "nah");
  const kres = W(4, "kresek");
  const bat = W(4, "baterai");
  const hp = W(4, "hp");
  const bukan = W(4, "bukan");
  const stamp = spring({ frame: f - bukan, fps: FPS, config: { damping: 11, stiffness: 220 } });
  const shake = f >= bukan ? Math.sin((f - bukan) * 3) * 14 * Math.max(0, 1 - (f - bukan) / 8) : 0;
  const pop = ramp(f, bukan + 12, 8);
  const relief = ramp(f, bukan + 6, 10);
  const worry = f >= kres && relief < 0.5;
  // phone gets "hot": heat wisps rise from it while the thermometer thought is up
  const heat = f >= hp ? 1 - relief : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Layer to={1.03} drift={10} blur={2}><World cam={DESK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.06} drift={20}>
        <World cam={DESK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} pose="hold" glow={PHONE_LIGHT} worried={worry} pitch={10 * (1 - relief)}
              look={{ x: 0, y: 28 * (1 - relief) }} eyesOpen={0.82 + 0.28 * relief} mouth={relief > 0.5 ? "smile" : worry ? "worried" : "flat"}
              headTilt={relief * 5 + (worry ? Math.sin(f / 4) * 1.5 : 0)}>
              <Phone />
            </Chibi>
          </div>
        </World>
      </Layer>
      <Layer to={1.09} drift={34}><World cam={DESK_CAM}><KamarDesk v laptop={false} /></World></Layer>
      {heat > 0 ? [470, 590].map((x, i) => {
        const t = ((f / 22 + i * 0.5) % 1);
        return (
          <svg key={x} width={60} height={120} style={{ position: "absolute", left: x, top: 1090 - t * 70, opacity: heat * Math.sin(t * Math.PI) }}>
            <path d="M30 110 q-16 -20 0 -40 q16 -20 0 -40" stroke={THEME.orange} strokeWidth={8} strokeLinecap="round" fill="none" />
          </svg>
        );
      }) : null}
      <Thought cx={195} delay={kres} out={pop} label="kresek">
        <div style={{ transform: `scaleY(${1 + 0.35 * Math.sin(f * 1.7)})` }}><WaveIcon w={130} /></div>
      </Thought>
      <Thought cx={540} delay={bat} out={pop} label="boros">
        <Battery w={130} level={0.95 - (((f - bat) % 45) / 45) * 0.85} />
      </Thought>
      <Thought cx={885} delay={hp} out={pop} label="panas">
        <div style={{ transform: `rotate(${Math.sin(f / 2) * 5}deg)` }}><Thermo w={130} /></div>
      </Thought>
      <Pill text="tanda disadap?" delay={nah} top={262} color={THEME.navy} fontSize={44} />
      {f >= bukan ? (
        <div style={{
          position: "absolute", left: 0, width: 1080, top: 400, display: "flex", justifyContent: "center",
          transform: `rotate(-10deg) scale(${2.2 - 1.2 * stamp})`, opacity: Math.min(1, stamp * 2),
        }}>
          <div style={{
            border: `16px solid ${THEME.amber}`, borderRadius: 30, padding: "6px 60px", background: "rgba(30,36,64,0.92)",
            fontFamily: THEME.font, fontWeight: 900, fontSize: 170, color: THEME.amber, letterSpacing: 8,
          }}>MITOS</div>
        </div>
      ) : null}
      {[nah, kres, bat, hp].map((d) => <Sfx key={d} at={d} src="sfx/pluck_001.ogg" volume={0.4} />)}
      <Sfx at={bukan} src="sfx/drop_002.ogg" volume={0.8} />
    </AbsoluteFill>
  );
};

// ── 6 Twist: the real threat arrives in your own chat ─────────────────────
const SOFA_CAM = { k: 1.4, x: 574, y: -237 };
const Sofa: React.FC<{ cam: typeof SOFA_CAM; look: { x: number; y: number }; pitch: number; mouth: "smile" | "o" | "worried" | "flat"; eyesOpen: number; tilt?: number; children?: React.ReactNode }> = ({ cam, look, pitch, mouth, eyesOpen, tilt = 0, children }) => {
  const f = useCurrentFrame();
  const glow = interpolate(Math.sin(f / 6), [-1, 1], [0.08, 0.14]);
  return (
    <>
      <Layer to={1.03} drift={-10} blur={2}><World cam={cam}><RuangBack v /></World></Layer>
      <Layer to={1.08} drift={-24}>
        <World cam={cam}>
          <RuangSofaBack v />
          <div style={{ position: "absolute", left: 680, top: 140 }}>
            <Chibi width={560} shirt={THEME.orange} shirtShade={THEME.orangeDark} lap={THEME.navy} look={look} pitch={pitch}
              pose="hold" glow={PHONE_LIGHT} lightFrom="right" mouth={mouth} eyesOpen={eyesOpen} headTilt={tilt + Math.sin(f / 20) * 3}>
              <Phone />
            </Chibi>
          </div>
          <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(ellipse 190px 110px at 960px 640px, rgba(155,227,255,${glow}) 0%, rgba(155,227,255,0) 100%)` }} />
        </World>
      </Layer>
      <Layer to={1.12} drift={-40}><World cam={cam}><RuangFront v /></World></Layer>
      <Layer to={1.08} drift={-24}><World cam={cam}>{children}</World></Layer>
    </>
  );
};
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const ancaman = W(5, "ancaman");
  const chat = W(5, "chat");
  const flick = interpolate(f, [chat + 4, chat + 9], [0, 1], clamp);
  const dim = ramp(f, ancaman, 20);
  return (
    <AbsoluteFill>
      <Sofa cam={SOFA_CAM} look={{ x: flick * 22, y: 30 - flick * 30 }} pitch={10 * (1 - flick * 0.7)}
        mouth={flick > 0.5 ? "o" : dim > 0.5 ? "flat" : "smile"} eyesOpen={flick > 0.5 ? 1.1 : 0.82}>
        <LabelPill text="ancaman nyata" delay={ancaman} fontSize={36} color={THEME.primaryDark} style={{ left: 665, top: 20 }} />
        <Notif icon={<Chat />} color={THEME.amber} badge="1" badgeBg={THEME.primary} badgeInk={THEME.paper} delay={chat} x={1060} y={60} />
      </Sofa>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(30,36,64,0) 30%, rgba(30,36,64,${0.45 * dim}) 100%)` }} />
      <Sfx at={ancaman} src="sfx/drop_002.ogg" volume={0.35} />
      <Sfx at={chat} src="sfx/glass_001.ogg" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 7 Close-up of the chat in the hand: APK "invitation" → OTP stolen → balance drained ──
const Bubble: React.FC<{ show: number; children: React.ReactNode }> = ({ show, children }) => (
  <div style={{
    alignSelf: "flex-start", background: THEME.paper, borderRadius: "8px 26px 26px 26px", padding: 18, margin: "14px 18px 0",
    maxWidth: 500, boxShadow: "0 5px 0 rgba(0,0,0,0.08)", opacity: show, transform: `translateY(${(1 - show) * 40}px) scale(${0.9 + 0.1 * show})`,
    transformOrigin: "0 0", fontFamily: THEME.font,
  }}>{children}</div>
);
const FileRow: React.FC<{ name: string; meta: string; tap?: number }> = ({ name, meta, tap = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: tap ? "#DCE3F2" : "#EEF1F7", borderRadius: 16, padding: "10px 14px", position: "relative" }}>
    <ApkFile w={100} />
    <div>
      <div style={{ fontWeight: 900, fontSize: 40, color: THEME.ink, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontWeight: 800, fontSize: 28, color: "#7C8597" }}>{meta}</div>
    </div>
    {tap ? <div style={{ position: "absolute", left: 120, top: 40, width: 160 * tap, height: 160 * tap, marginLeft: -80 * tap, marginTop: -80 * tap, borderRadius: 999, background: THEME.primary, opacity: 0.25 * (1 - tap) }} /> : null}
  </div>
);
const SKIN = "#F6D2B0";
const SKIN_SHADE = "#E3B48E";
// Other hand: index finger points from the bottom-right, enters to tap, then leaves. `tip` = fingertip.
const TapHand: React.FC<{ tip: [number, number] }> = ({ tip }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <g transform={`translate(${tip[0]} ${tip[1]}) rotate(-38)`}>
      <g transform="translate(10 14)" opacity={0.18}>
        <rect x={-36} y={-6} width={72} height={260} rx={36} />
        <ellipse cx={14} cy={330} rx={130} ry={150} />
      </g>
      <ellipse cx={14} cy={330} rx={130} ry={150} fill={SKIN} />
      {[-70, -10, 50].map((x) => <rect key={x} x={x - 4} y={190} width={64} height={110} rx={32} fill={SKIN} stroke={SKIN_SHADE} strokeWidth={6} />)}
      <rect x={-36} y={-6} width={72} height={260} rx={36} fill={SKIN} />
      <rect x={10} y={20} width={20} height={220} rx={10} fill={SKIN_SHADE} opacity={0.5} />
      <ellipse cx={0} cy={22} rx={24} ry={20} fill="#FBE6D6" />
      <path d="M-30 120 Q0 130 30 120" stroke={SKIN_SHADE} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
const Apk: React.FC = () => {
  const f = useCurrentFrame();
  const file = W(6, "file");
  const foto = W(6, "foto");
  const nomor = W(6, "nomor");
  const ternyata = W(6, "ternyata");
  const nyuri = W(6, "nyuri");
  const otp = W(6, "otp");
  const nguras = W(6, "nguras");
  const tap = f >= ternyata ? interpolate(f, [ternyata, ternyata + 12], [0.01, 1], clamp) : 0;
  const install = ramp(f, ternyata + 6, 14);
  const bug = spring({ frame: f - (ternyata + 20), fps: FPS, config: { damping: 9 } });
  const sms = ramp(f, nyuri, 8);
  const steal = interpolate(f, [otp + 6, otp + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const drain = interpolate(f, [nguras, nguras + 30], [12450000, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const card = ramp(f, nguras - 4, 8);
  const unknown = ramp(f, nomor, 6);
  // hand-held: slow sway; the thumb rests on the right edge, reaches to the file on "ternyata", returns
  const sway = Math.sin(f / 24) * 1.2;
  const bobY = Math.sin(f / 17) * 6;
  const reach = interpolate(f, [ternyata - 16, ternyata, ternyata + 8, ternyata + 26], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const press = f >= ternyata && f < ternyata + 8 ? 6 : 0;
  const tip: [number, number] = [1150 + (340 - 1150) * reach, 1900 + (530 + press - 1900) * reach];
  return (
    <AbsoluteFill>
      {/* the room behind the phone, out of focus */}
      <AbsoluteFill style={{ filter: "blur(14px)", transform: `scale(1.1) translateX(${Math.sin(f / 40) * 12}px)` }}>
        <World cam={SOFA_CAM}><RuangBack v /></World>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(30,36,64,0.45)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${bobY}px) rotate(${sway}deg)`, transformOrigin: "540px 1500px" }}>
        <div style={{ position: "absolute", left: 240, top: 240 }}>
          <PhoneFront w={600} h={1010} screen="#E9EDF5">
            {/* header: unknown number */}
            <div style={{ height: 170, background: THEME.primary, display: "flex", alignItems: "center", gap: 18, padding: "60px 22px 0", boxSizing: "border-box", fontFamily: THEME.font }}>
              <div style={{ width: 84, height: 84, borderRadius: 99, background: "#C9CFDB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 48, color: THEME.paper }}>?</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 38, color: THEME.paper }}>+62 8xx-xxxx-xxxx</div>
                <div style={{ fontWeight: 900, fontSize: 30, color: THEME.amber, opacity: 0.4 + 0.6 * unknown, transform: `scale(${1 + 0.15 * Math.sin(unknown * Math.PI)})`, transformOrigin: "0 50%" }}>Nomor tidak dikenal</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Bubble show={ramp(f, file, 8)}>
                <FileRow name="Undangan Pernikahan" meta="APK · 6,6 MB" tap={tap} />
                <div style={{ fontWeight: 800, fontSize: 34, color: THEME.ink, marginTop: 12 }}>Kami harap kehadirannya</div>
              </Bubble>
              <Bubble show={ramp(f, foto, 8)}>
                <FileRow name="Foto Paket" meta="APK" />
              </Bubble>
            </div>
            {/* install overlay → malware */}
            {f >= ternyata + 6 ? (
              <div style={{ position: "absolute", inset: 0, background: `rgba(30,36,64,${0.75 * install})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ transform: `scale(${bug}) rotate(${Math.sin(f / 3) * 6}deg)` }}><Bug w={200} /></div>
                <div style={{ width: 300, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.25)" }}>
                  <div style={{ width: 300 * install, height: 18, borderRadius: 9, background: THEME.amber }} />
                </div>
              </div>
            ) : null}
            {/* SMS with the OTP slides in from the top */}
            {f >= nyuri && steal < 0.02 ? (
              <div style={{ position: "absolute", left: 20, right: 20, top: -140 + 170 * sms, background: THEME.paper, borderRadius: 22, padding: "16px 22px", fontFamily: THEME.font, boxShadow: "0 8px 0 rgba(0,0,0,0.15)" }}>
                <div style={{ fontWeight: 800, fontSize: 28, color: "#7C8597" }}>SMS · Bank</div>
                <div style={{ fontWeight: 900, fontSize: 44, color: THEME.ink }}>Kode OTP: 482 916</div>
              </div>
            ) : null}
            {/* balance card drains */}
            {f >= nguras - 4 ? (
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 40, background: THEME.paper, borderRadius: 26, padding: "20px 26px", fontFamily: THEME.font, transform: `translateY(${(1 - card) * 200}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.15)" }}>
                <div style={{ fontWeight: 800, fontSize: 32, color: "#7C8597" }}>Saldo rekening</div>
                <div style={{ fontWeight: 900, fontSize: 60, color: drain < 1 ? THEME.primary : THEME.ink }}>Rp{Math.round(drain).toLocaleString("id-ID")}</div>
              </div>
            ) : null}
          </PhoneFront>
        </div>
        {/* fingers wrap the left edge */}
        {[780, 860, 940].map((y) => (
          <div key={y} style={{ position: "absolute", left: 200, top: y, width: 70, height: 56, borderRadius: 28, background: SKIN, boxShadow: `inset -10px -8px 0 ${SKIN_SHADE}` }} />
        ))}
        {reach > 0 ? <TapHand tip={tip} /> : null}
      </div>
      {/* the OTP leaves the phone (cause → effect from the source) */}
      {steal > 0.02 ? (
        <div style={{
          position: "absolute", left: 260 + steal * 520, top: 280 - steal * 220, transform: `scale(${1 - 0.6 * steal}) rotate(${steal * 25}deg)`,
          background: THEME.amber, borderRadius: 22, padding: "16px 26px", fontFamily: THEME.font, fontWeight: 900, fontSize: 40, color: THEME.ink,
          boxShadow: "0 8px 0 rgba(0,0,0,0.2)", opacity: 1 - interpolate(steal, [0.8, 1], [0, 1], clamp),
        }}>OTP 482 916</div>
      ) : null}
      <Sfx at={file} src="sfx/glass_001.ogg" volume={0.45} />
      <Sfx at={foto} src="sfx/glass_001.ogg" volume={0.4} />
      <Sfx at={ternyata} src="sfx/tick_001.ogg" volume={0.6} />
      <Sfx at={ternyata + 20} src="sfx/drop_002.ogg" volume={0.5} />
      <Sfx at={nyuri} src="sfx/pluck_002.ogg" volume={0.45} />
      <Sfx at={otp + 6} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={nguras} src="sfx/drain.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 8 Tips: on the street, one tip card at a time; the character reacts to each ──
const TipCard: React.FC<{ from: number; to: number; n: number; text: string; check: number; children: React.ReactNode }> = ({ from, to, n, text, check, children }) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const inX = 1 - spring({ frame: f - from, fps: FPS, config: { damping: 13, stiffness: 160 } });
  const outX = interpolate(f, [to, to + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const c = spring({ frame: f - check, fps: FPS, config: { damping: 9, stiffness: 200 } });
  return (
    <div style={{
      position: "absolute", left: 90, top: 270, width: 900, height: 330, borderRadius: 40, background: THEME.paper,
      display: "flex", alignItems: "center", gap: 26, padding: "0 34px", boxSizing: "border-box", boxShadow: "0 14px 0 rgba(0,0,0,0.18)",
      transform: `translateX(${inX * 1100 - outX * 1150}px) rotate(${(inX - outX) * 6}deg)`,
    }}>
      <div style={{ position: "absolute", left: 30, top: -30 }}><Badge n={String(n)} size={84} /></div>
      {children}
      <span style={{ flex: 1, fontFamily: THEME.font, fontWeight: 900, fontSize: 54, lineHeight: 1.1, color: THEME.ink }}>{text}</span>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: `scale(${f >= check ? c : 0})`, flexShrink: 0 }}>
        <circle cx={50} cy={50} r={46} fill={THEME.teal} />
        <path d="M28 52 L44 68 L74 34" stroke={THEME.paper} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
};
// circle-slash that draws itself over an icon
const NoMark: React.FC<{ p: number; w: number }> = ({ p, w }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <circle cx={50} cy={50} r={46} fill="none" stroke={THEME.amber} strokeWidth={9} strokeDasharray={290} strokeDashoffset={290 * (1 - p)} transform="rotate(-90 50 50)" />
    <path d="M18 82 L82 18" stroke={THEME.amber} strokeWidth={9} strokeLinecap="round" strokeDasharray={91} strokeDashoffset={91 * (1 - ramp(p * 10, 7, 3))} />
  </svg>
);
const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const simpel = W(7, "simpelnya");
  const j1 = W(7, "jangan", 0);
  const j2 = W(7, "jangan", 1);
  const ny = W(7, "nyalakan");
  const end = W(7, "langkah");
  // head shakes "no" on the two don'ts, nods on the do
  const shakeAt = (d: number) => (f >= d + 4 && f < d + 28 ? Math.sin((f - d) * 0.7) * 9 : 0);
  const nod = f >= ny + 4 && f < ny + 34 ? Math.abs(Math.sin((f - ny) * 0.3)) * 12 : 0;
  const happy = f >= ny;
  return (
    <AbsoluteFill>
      <Layer to={1.05} drift={20}>
        <StreetBack />
        <div style={{ position: "absolute", left: 260, top: 640 }}>
          <Chibi width={560} pose="hold" lightFrom="right" glow={PHONE_LIGHT} thumb={happy}
            headTilt={shakeAt(j1) + shakeAt(j2)} headDrop={nod} pitch={happy ? 0 : 6}
            look={{ x: 0, y: happy ? 0 : 18 }} mouth={happy ? "smile" : "flat"} eyesOpen={happy ? 1 : 0.9}>
            <Phone />
          </Chibi>
        </div>
        <Hedge top={1290} />
      </Layer>
      <div style={{ opacity: 1 - ramp(f, j1 - 4, 6) }}><Pill text="biar aman" delay={simpel} top={380} color={THEME.navy} /></div>
      <TipCard from={j1} to={j2 - 8} n={1} check={j2 - 18} text="Jangan pasang aplikasi dari chat">
        <div style={{ position: "relative", transform: `rotate(${f < j1 + 14 ? Math.sin(f) * 6 : 0}deg)` }}>
          <ApkFile w={170} /><NoMark w={170} p={ramp(f, j1 + 10, 14)} />
        </div>
      </TipCard>
      <TipCard from={j2 - 8} to={ny - 8} n={2} check={ny - 18} text="Jangan kasih kode OTP">
        <div style={{ position: "relative", transform: `translateY(${f >= j2 + 6 && f < j2 + 16 ? -Math.sin((f - j2 - 6) / 10 * Math.PI) * 18 : 0}px)` }}>
          <OtpLock w={170} />
        </div>
      </TipCard>
      <TipCard from={ny - 8} to={DUR[7] + 20} n={3} check={end + 4} text="Nyalakan verifikasi dua langkah">
        <div style={{ transform: `scale(${1 + 0.08 * Math.sin(f / 5)})` }}><Shield w={170} /></div>
      </TipCard>
      {[j1, j2 - 8, ny - 8].map((d) => <Sfx key={d} at={d} src="sfx/whoosh.wav" volume={0.25} />)}
      {[j2 - 18, ny - 18, end + 4].map((d) => <Sfx key={d} at={d} src="sfx/confirmation_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 9 Close: looks up at the viewer, asks for a comment ───────────────────
// Closer camera on the same sofa: phone (world 960,720) stays above the caption band.
const CLOSE_CAM = { k: 1.5, x: 600, y: -101 };
const Close: React.FC = () => {
  const f = useCurrentFrame();
  const kamu = W(8, "kamu");
  const pernah = W(8, "pernah");
  const tulis = W(8, "tulis");
  const up = ramp(f, kamu - 4, 8);
  return (
    <AbsoluteFill>
      <Sofa cam={CLOSE_CAM} look={{ x: 0, y: 30 * (1 - up) }} pitch={10 * (1 - up)} mouth="smile" eyesOpen={0.82 + 0.28 * up} tilt={5 * up}>
        <LabelPill text="pernah dapet?" delay={pernah} fontSize={40} color={THEME.primary} style={{ left: 653, top: 86 }} />
        <Notif icon={<Chat />} color={THEME.primaryDark} badge="+1" delay={tulis} x={1066} y={59} />
      </Sofa>
      <Sfx at={pernah} src="sfx/confirmation_001.ogg" volume={0.45} />
      <Sfx at={tulis} src="sfx/glass_001.ogg" volume={0.45} />
    </AbsoluteFill>
  );
};

const SCENES = [Hook, Title, Resmi, Mata, Mitos, Twist, Apk, Tips, Close];
const TRANS = [colorWipe(THEME.amber), whipBlur(), colorWipe(THEME.teal), whipBlur(), colorWipe(THEME.amber), whipBlur(), colorWipe(THEME.teal), whipBlur()];

export const Sadap: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.navy }}>
      <TransitionSeries>
        {SCENES.flatMap((Scene, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DUR[i]}>
            <Scene />
          </TransitionSeries.Sequence>,
          ...(i < N - 1 ? [<TransitionSeries.Transition key={`t${i}`} presentation={TRANS[i] as never} timing={linearTiming({ durationInFrames: T })} />] : []),
        ])}
      </TransitionSeries>
      <Captions caps={timeline.captions} hideScenes={[1]} />
      <Audio src={staticFile(timeline.audio)} volume={1} />
      <Audio src={staticFile("sadap/music.wav")} volume={0.1} />
      {START.slice(1).map((s) => <Sfx key={s} at={s - 2} src="sfx/whoosh.wav" volume={0.45} />)}
    </AbsoluteFill>
  );
};
