import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame } from "remotion";
import { Chibi } from "../explainer/Chibi";
import { Layer, Sfx, THEME, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, KamarDesk } from "../contoh/sets";
import { Hedge, StreetBack } from "../sadap/street";
import timeline from "../../public/voiceover/pulau/timeline.json";
import { Bus, CommentCta, Count, FPS, Pill, Sailboat, Short, Stamp, Thought, Towers, clamp, ramp, rnd, timing } from "./common";

// "Apa jadinya kalau Indonesia cuma satu pulau?" — hook short, 1080×1920.
const { TOTAL, W, LAST } = timing(timeline);
export const PULAU_DURATION = TOTAL;

// ── Sea seen from a boat: three rows of islands toward the horizon ─────────────
const HZ = 900;
type Row = { y: number; n: number; gap: number; w: [number, number]; h: [number, number]; c: string; shade: string; par: number; palm: boolean };
const ROWS: Row[] = [
  { y: HZ + 6, n: 9, gap: 230, w: [110, 190], h: [34, 56], c: "#8CC9B0", shade: "#77B79D", par: 0.25, palm: false },
  { y: HZ + 70, n: 7, gap: 330, w: [190, 290], h: [70, 110], c: "#55B37E", shade: "#459D6B", par: 0.55, palm: false },
  { y: HZ + 190, n: 5, gap: 520, w: [300, 420], h: [120, 170], c: "#3C9A63", shade: "#2F8453", par: 1, palm: true },
];
const ISLES = ROWS.flatMap((r, ri) => Array.from({ length: r.n }).map((_, k) => {
  const s = ri * 31 + k * 7;
  return { ri, x0: k * r.gap + rnd(s) * r.gap * 0.5, w: r.w[0] + rnd(s + 1) * (r.w[1] - r.w[0]), h: r.h[0] + rnd(s + 2) * (r.h[1] - r.h[0]), order: rnd(s + 3) };
}));
const ORDER = [...ISLES].sort((a, b) => a.order - b.order);

const Isle: React.FC<{ x: number; y: number; w: number; h: number; c: string; shade: string; palm: boolean; s: number }> = ({ x, y, w, h, c, shade, palm, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={w * 0.6} ry={Math.max(6, h * 0.12)} fill="#F3DFA2" />
    <path d={`M${-w / 2} 0 C${-w / 3} ${-h} ${w / 3} ${-h} ${w / 2} 0 Z`} fill={c} />
    <path d={`M0 ${-h * 0.74} C${w / 4} ${-h * 0.76} ${w / 3} ${-h * 0.4} ${w / 2} 0 L0 0 Z`} fill={shade} />
    {palm ? (
      <g transform={`translate(${-w * 0.12} ${-h * 0.7})`}>
        <path d="M0 0 Q6 -60 22 -110" stroke="#8D6440" strokeWidth={10} fill="none" strokeLinecap="round" />
        {[-150, -100, -40, 10].map((a) => <ellipse key={a} cx={22 + Math.cos((a * Math.PI) / 180) * 34} cy={-110 + Math.sin((a * Math.PI) / 180) * 16} rx={40} ry={11} fill="#2F8453" transform={`rotate(${a + 90} ${22 + Math.cos((a * Math.PI) / 180) * 34} ${-110 + Math.sin((a * Math.PI) / 180) * 16})`} />)}
      </g>
    ) : null}
  </g>
);

const SeaSide: React.FC<{ pan?: number; grow?: number; sunT?: number }> = ({ pan = 0, grow = 1, sunT = 0.3 }) => {
  const f = useCurrentFrame();
  const th = sunT * Math.PI * 2; // 0…π day, π…2π night
  const sx = 540 - 520 * Math.cos(th);
  const sy = HZ - 620 * Math.sin(th);
  const night = Math.min(1, Math.max(0, -Math.sin(th) * 3)) * 0.7;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FA8F5" /><stop offset="1" stopColor="#DCEBFF" /></linearGradient>
        <linearGradient id="psea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5BB8E0" /><stop offset="1" stopColor="#1C6FA8" /></linearGradient>
      </defs>
      <rect width={1080} height={HZ} fill="url(#psky)" />
      {sy < HZ ? <><circle cx={sx} cy={sy} r={110} fill="#FFF2B8" opacity={0.55} /><circle cx={sx} cy={sy} r={78} fill="#FFE07A" /></> : null}
      <rect y={HZ} width={1080} height={1920 - HZ} fill="url(#psea)" />
      {ROWS.map((r, ri) => {
        const L = r.n * r.gap;
        return ISLES.filter((i) => i.ri === ri).map((i, k) => {
          const x = ((((i.x0 - pan * r.par) % L) + L) % L) - 220;
          const idx = ORDER.indexOf(i);
          const t = Math.min(1, Math.max(0, grow * ISLES.length - idx));
          const s = t <= 0 ? 0 : Easing.out(Easing.back(2.2))(t);
          return s > 0 ? <Isle key={`${ri}-${k}`} x={x} y={r.y} w={i.w} h={i.h} c={r.c} shade={r.shade} palm={r.palm} s={s} /> : null;
        });
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const y = HZ + 40 + i * 70 + (i % 2) * 20;
        const x = ((i * 173 - f * (1.5 + i * 0.25) - pan * (0.2 + i * 0.06)) % 1300 + 1300) % 1300 - 160;
        return <path key={i} d={`M${x} ${y} q24 -10 48 0 t48 0`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.35} strokeLinecap="round" />;
      })}
      {night ? (
        <g>
          <rect width={1080} height={1920} fill="#141A33" opacity={night} />
          {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 50) * (HZ - 100)} r={3} fill="#fff" opacity={night} />)}
        </g>
      ) : null}
    </svg>
  );
};

// Character in a wooden boat (bobbing), body hidden by the hull below the chest.
const BoatRider: React.FC<{ look: { x: number; y: number }; mouth: "smile" | "o" | "worried" | "flat"; hair?: string; worried?: boolean; eyes?: number }> = ({ look, mouth, hair, worried, eyes = 1 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 10) * 8;
  const rot = Math.sin(f / 13) * 1.6;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${bob}px) rotate(${rot}deg)`, transformOrigin: "780px 1300px" }}>
      <div style={{ position: "absolute", left: 560, top: 800 }}>
        <Chibi width={440} lightFrom="right" look={look} mouth={mouth} hair={hair} worried={worried} eyesOpen={eyes} shirt={THEME.orange} shirtShade={THEME.orangeDark} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M440 1236 L1120 1236 L1060 1440 L520 1440 Z" fill="#A9653A" />
        <path d="M440 1236 L1120 1236 L1112 1262 L448 1262 Z" fill="#D9A06A" />
        {[1300, 1360].map((y) => <path key={y} d={`M${450 + (y - 1236) * 0.3} ${y} L${1100 - (y - 1236) * 0.3} ${y}`} stroke="#8A4F2A" strokeWidth={6} />)}
        <path d="M400 1450 Q560 1420 720 1450 T1080 1450" stroke="#fff" strokeWidth={10} fill="none" opacity={0.5} />
      </svg>
    </div>
  );
};

// ── 1 "Indonesia punya lebih dari 17.000 pulau." ──────────────────────────────
const Banyak: React.FC = () => {
  const f = useCurrentFrame();
  const n = W(0, "17000");
  const p = W(0, "pulau");
  const grow = interpolate(f, [0, n + 12], [0.05, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill>
      <Layer to={1.04} drift={20}><SeaSide grow={grow} /></Layer>
      <BoatRider look={{ x: -22, y: -10 }} mouth={f >= n ? "o" : "smile"} eyes={f >= n ? 1.1 : 1} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 230, textAlign: "center" }}>
        <Count from={0} to={17000} a={W(0, "lebih")} b={n + 6} size={190} />
      </div>
      <Pill text="pulau" delay={p} top={470} color={THEME.primary} fontSize={60} />
      {[0, 10, 20, 30, 40, n].map((d) => <Sfx key={d} at={d} src="sfx/pluck_001.ogg" volume={0.3} />)}
      <Sfx at={p} src="sfx/drop_002.ogg" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 2 One island a day → 46 years (time-lapse days, the rider's hair goes grey) ──
const Hari: React.FC = () => {
  const f = useCurrentFrame();
  const m = W(1, "mampir");
  const satu = W(1, "satu");
  const n46 = W(1, "46");
  const th = W(1, "tahun");
  const lap = interpolate(f, [m, th], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const days = Math.max(1, Math.round(lap * 17000));
  const pan = interpolate(f, [0, m], [0, 80], clamp) + lap * 9000;
  const sunT = 0.3 + lap * 8; // eight visible day/night cycles = deliberate time-lapse
  const old = ramp(f, th, 20);
  const hair = interpolateColors(old, [0, 1], ["#23202B", "#D6D6DE"]);
  const card = spring({ frame: f - m, fps: FPS, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <SeaSide pan={pan} sunT={f >= th ? 0.3 : sunT} />
      <BoatRider look={{ x: f >= th ? 0 : -18, y: f >= th ? 6 : -14 }} mouth={old > 0.4 ? "worried" : "smile"} hair={hair} worried={old > 0.4} eyes={1 - 0.25 * old} />
      <div style={{ position: "absolute", left: 270, top: 250, width: 540, transform: `scale(${card})`, borderRadius: 40, overflow: "hidden", background: THEME.paper, boxShadow: "0 12px 0 rgba(0,0,0,0.2)", fontFamily: THEME.font, textAlign: "center" }}>
        <div style={{ background: THEME.primary, color: THEME.paper, fontWeight: 900, fontSize: 50, padding: "8px 0" }}>HARI KE-</div>
        <div style={{ fontWeight: 900, fontSize: 130, color: THEME.ink, lineHeight: 1.2 }}>{days.toLocaleString("id-ID")}</div>
      </div>
      <Pill text="1 pulau / hari" delay={satu} top={560} color={THEME.teal} fontSize={46} />
      <Stamp at={n46} text="46 TAHUN" top={600} size={130} />
      <Sfx at={m} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={satu} src="sfx/drop_002.ogg" volume={0.4} />
      {Array.from({ length: 8 }).map((_, i) => {
        const at = Math.round(interpolate(Math.sqrt((i + 1) / 8), [0, 1], [m, th]));
        return <Sfx key={i} at={at} src="sfx/tick_001.ogg" volume={0.35} />;
      })}
      <Sfx at={n46} src="sfx/drop_002.ogg" volume={0.8} />
    </AbsoluteFill>
  );
};

// ── 3 "seumur hidup … cuma kenal segelintir" — at the desk, thinking of a map ──
const DESK_CAM = { k: 1.2, x: 510, y: -380 };
const DOTS = Array.from({ length: 46 }).map((_, i) => ({ x: 70 + rnd(i * 3) * 660, y: 40 + rnd(i * 3 + 1) * 150, r: 7 + rnd(i * 3 + 2) * 12 }));
const KNOWN = [4, 17, 23, 38];
const Segelintir: React.FC = () => {
  const f = useCurrentFrame();
  const art = W(2, "artinya");
  const cuma = W(2, "cuma");
  const seg = W(2, "segelintir");
  const shrug = ramp(f, cuma, 10);
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><World cam={DESK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.06} drift={20}>
        <World cam={DESK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} look={{ x: 0, y: -20 + 14 * shrug }} mouth={shrug > 0.5 ? "worried" : "flat"} worried={shrug > 0.5}
              headTilt={6 * shrug + Math.sin(f / 18) * 2} />
          </div>
        </World>
      </Layer>
      <Layer to={1.09} drift={34}><World cam={DESK_CAM}><KamarDesk v laptop={false} /></World></Layer>
      <Thought cx={540} top={250} w={860} h={300} delay={art} tx={540}>
        <svg width={800} height={230} viewBox="0 0 800 230">
          <rect x={20} y={10} width={760} height={210} rx={30} fill="#CFEAF6" />
          {DOTS.map((d, i) => {
            const k = KNOWN.indexOf(i);
            const on = k >= 0 ? spring({ frame: f - seg - k * 4, fps: FPS, config: { damping: 9 } }) : 0;
            return (
              <g key={i}>
                <circle cx={d.x} cy={d.y + 10} r={d.r + 6 * on} fill={on > 0.05 ? THEME.amber : "#9FB7A8"} />
                {on > 0.05 ? <g transform={`translate(${d.x} ${d.y + 10 - d.r}) scale(${1.8 * on})`}><path d="M0 0 C-14 -16 -14 -36 0 -36 C14 -36 14 -16 0 0 Z" fill={THEME.primary} /><circle cy={-26} r={5} fill="#fff" /></g> : null}
              </g>
            );
          })}
        </svg>
      </Thought>
      <Sfx at={art} src="sfx/pluck_001.ogg" volume={0.4} />
      {KNOWN.map((_, k) => <Sfx key={k} at={seg + k * 4} src="sfx/tick_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 4 Title: the islands drift together into one landmass (top-down) ─────────
const TOP = Array.from({ length: 30 }).map((_, i) => ({ x: 80 + rnd(i * 5) * 920, y: 280 + rnd(i * 5 + 1) * 1150, r: 26 + rnd(i * 5 + 2) * 46, s: i }));
const blob = (seed: number, r: number) => {
  const n = 9;
  const pts = Array.from({ length: n }).map((_, k) => {
    const a = (k / n) * Math.PI * 2;
    const rr = r * (0.72 + 0.4 * rnd(seed * 13 + k));
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).join(" ")}`;
  pts.forEach((p, k) => { d += ` Q${p.join(" ")} ${mid(p, pts[(k + 1) % n]).join(" ")}`; });
  return d + " Z";
};
const Tanya: React.FC = () => {
  const f = useCurrentFrame();
  const semua = W(3, "semua");
  const nyatu = W(3, "nyatu");
  const jadi = W(3, "jadi");
  const t = interpolate(f, [semua, nyatu + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const title = ramp(f, jadi - 6, 10);
  const C = { x: 540, y: 880 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: title ? `blur(${title * 8}px)` : undefined, transform: `scale(${1 + f * 0.0012})` }}>
        <svg width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#2F8FCB" />
          {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${((i * 211 + f * 1.2) % 1300) - 150} ${120 + i * 100} q30 -12 60 0 t60 0`} stroke="#fff" strokeWidth={5} opacity={0.25} fill="none" />)}
          {[0, 1].map((layer) => TOP.map((p) => {
            const x = p.x + (C.x - p.x) * t * 0.82;
            const y = p.y + (C.y - p.y) * t * 0.82;
            const s = 1 + t * 1.4;
            return <path key={`${layer}-${p.s}`} d={blob(p.s, p.r)} transform={`translate(${x} ${y}) scale(${s})`} fill={layer ? "#4FB07A" : "#F3DFA2"} stroke={layer ? undefined : "#F3DFA2"} strokeWidth={layer ? 0 : 16} />;
          }))}
          {t > 0.6 ? <path d={blob(99, 330)} transform={`translate(${C.x} ${C.y}) scale(${(t - 0.6) * 2.5})`} fill="#4FB07A" /> : null}
        </svg>
      </AbsoluteFill>
      {title > 0 ? (
        <AbsoluteFill style={{ opacity: title }}>
          <TitleCard text="Indonesia jadi 1 pulau?" exit={false} fontSize={170} maxWidth="86%" bg="rgba(30,36,64,0.55)" delay={jadi} />
        </AbsoluteFill>
      ) : null}
      <Sfx at={semua} src="sfx/whoosh.wav" volume={0.4} />
      <Sfx at={nyatu + 10} src="sfx/drop_002.ogg" volume={0.6} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={jadi + i * 4} src="sfx/pluck_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 5 maju? mudik? or losing what makes Indonesia Indonesia? → comment ──────
const Akhir: React.FC = () => {
  const f = useCurrentFrame();
  const maju = W(4, "maju");
  const mudik = W(4, "mudik");
  const atau = W(4, "atau");
  const hilang = W(4, "kehilangan");
  const swap = ramp(f, atau, 8);
  const grey = ramp(f, hilang, 20);
  return (
    <AbsoluteFill>
      <Layer to={1.05} drift={20}>
        <div style={{ position: "absolute", inset: 0, filter: `grayscale(${grey * 0.85})` }}><StreetBack /></div>
        <div style={{ position: "absolute", left: 260, top: 640 }}>
          <Chibi width={560} lightFrom="right" shirt={THEME.orange} shirtShade={THEME.orangeDark}
            look={{ x: f < mudik ? -22 : f < atau ? 22 : 0, y: f < atau ? -16 : -8 + 14 * grey }}
            mouth={grey > 0.5 ? "worried" : "smile"} worried={grey > 0.5} headTilt={f < atau ? (f < mudik ? -5 : 5) : -3 * grey} />
        </div>
        <Hedge top={1290} />
      </Layer>
      <Thought cx={250} top={290} w={360} h={280} delay={maju} tx={540} out={swap}>
        <Towers w={170} grow={ramp(f, maju, 20)} />
        <span style={{ fontWeight: 900, fontSize: 46, color: THEME.ink }}>maju?</span>
      </Thought>
      <Thought cx={830} top={290} w={360} h={280} delay={mudik} tx={540} out={swap}>
        <div style={{ transform: `translateX(${Math.sin(f / 9) * 30}px)` }}><Bus w={170} /></div>
        <span style={{ fontWeight: 900, fontSize: 46, color: THEME.ink }}>mudik?</span>
      </Thought>
      <Thought cx={540} top={250} w={500} h={330} delay={atau + 4} tx={540}>
        <div style={{ filter: `grayscale(${grey})`, opacity: 1 - 0.45 * grey, transform: `translateY(${grey * 20}px) rotate(${grey * 8}deg)` }}><Sailboat w={190} /></div>
        <span style={{ fontWeight: 900, fontSize: 44, color: THEME.ink }}>{grey > 0.5 ? "hilang?" : "laut kita"}</span>
      </Thought>
      <CommentCta at={LAST + 14} text="Menurutmu untung atau rugi?" />
      <Sfx at={maju} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={mudik} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={atau + 4} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={hilang} src="sfx/drop_002.ogg" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Pulau: React.FC = () => (
  <Short tl={timeline} music="pulau/music.wav" scenes={[Banyak, Hari, Segelintir, Tanya, Akhir]}
    trans={[whipBlur(), colorWipe(THEME.teal), colorWipe(THEME.amber), whipBlur()] as never[]} />
);
