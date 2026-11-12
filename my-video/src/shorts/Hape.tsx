import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { Chibi } from "../explainer/Chibi";
import { Layer, Sfx, THEME, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, RuangBack, RuangFront, RuangSofaBack } from "../contoh/sets";
import { PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { PhoneFront } from "../sadap/icons";
import timeline from "../../public/voiceover/hape/timeline.json";
import { Brain, Calendar, Clock, CommentCta, Pill, Puff, Short, Stamp, Thought, clamp, ramp, timing } from "./common";

// "Seberapa lama kita kuat tanpa hape?" — hook short, 1080×1920.
const { TOTAL, W, LAST } = timing(timeline);
export const HAPE_DURATION = TOTAL;

const SOFA_CAM = { k: 1.4, x: 574, y: -237 };
const PHONE_SCREEN = { x: 540, y: 1351 }; // phone in the hands, screen px, SOFA_CAM
type Mouth = "smile" | "o" | "worried" | "flat";
const Sofa: React.FC<{ look: { x: number; y: number }; mouth: Mouth; phone?: boolean; pitch?: number; eyes?: number; tilt?: number; worried?: boolean; drop?: number; dx?: number }> = ({ look, mouth, phone, pitch = 0, eyes = 1, tilt = 0, worried, drop = 0, dx = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer to={1.03} drift={-10} blur={2}><World cam={SOFA_CAM}><RuangBack v /></World></Layer>
      <Layer to={1.08} drift={-24}>
        <World cam={SOFA_CAM}>
          <RuangSofaBack v />
          <div style={{ position: "absolute", left: 680 + dx, top: 140 }}>
            <Chibi width={560} shirt={THEME.orange} shirtShade={THEME.orangeDark} lap={THEME.navy} look={look} pitch={pitch}
              pose={phone === undefined ? "idle" : "hold"} glow={phone ? PHONE_LIGHT : undefined} lightFrom="right" mouth={mouth}
              eyesOpen={eyes} worried={worried} headDrop={drop} headTilt={tilt + Math.sin(f / 20) * 3}>
              {phone ? <Phone /> : null}
            </Chibi>
          </div>
        </World>
      </Layer>
      <Layer to={1.12} drift={-40}><World cam={SOFA_CAM}><RuangFront v /></World></Layer>
    </>
  );
};

// ── 1 "Coba ingat, kapan terakhir kali kamu megang hape?" ─────────────────────
const Ingat: React.FC = () => {
  const f = useCurrentFrame();
  const kapan = W(0, "kapan");
  const think = ramp(f, W(0, "ingat"), 10);
  return (
    <AbsoluteFill>
      <Sofa look={{ x: -16 * think, y: -20 * think }} mouth="flat" tilt={-6 * think} />
      <Thought cx={290} top={300} w={360} h={280} delay={kapan} tx={520}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ transform: `rotate(${Math.sin(f / 8) * 8}deg)` }}><PhoneFront w={90} h={160} screen="#9BE3FF" /></div>
          <span style={{ fontWeight: 900, fontSize: 120, color: THEME.primary }}>?</span>
        </div>
      </Thought>
      <Sfx at={kapan} src="sfx/pluck_001.ogg" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 2 "5 menit lalu? … kamu lagi megang hape sekarang." → the shot shrinks into YOUR phone ──
const SKIN = "#F6D2B0";
const SKIN_SHADE = "#E3B48E";
const Kamu: React.FC = () => {
  const f = useCurrentFrame();
  const lima = W(1, "5");
  const atau = W(1, "atau");
  const jj = W(1, "jangan-jangan");
  const kamu = W(1, "kamu");
  const skr = W(1, "sekarang");
  const z = interpolate(f, [jj, jj + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const s = 1 - 0.48 * z;
  const rew = interpolate(f, [lima, lima + 20], [0, -5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wave = f >= skr ? 1 : 0;
  const hold = Math.sin(f / 15) * 6 * z;
  return (
    <AbsoluteFill>
      {/* the viewer's own room, out of focus */}
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
        borderRadius: 120 * z, overflow: "hidden", boxShadow: z ? `0 0 0 ${46}px #1B1E2E, 0 30px 60px 40px rgba(0,0,0,0.35)` : undefined,
      }}>
        <Sofa look={wave ? { x: 0, y: 0 } : z ? { x: 0, y: -6 } : { x: -12, y: -18 }} mouth={wave ? "smile" : z ? "o" : "flat"} eyes={z ? 1.1 : 1} tilt={wave ? 6 : -4} />
        <Thought cx={290} top={300} w={360} h={280} delay={lima} tx={520} out={ramp(f, atau, 8)}>
          <Clock w={170} min={rew} hour={-60 + rew / 2} />
          <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>5 menit lalu?</span>
        </Thought>
      </AbsoluteFill>
      {/* thumbs over the bezel */}
      {z > 0.3 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", transform: `translateY(${hold}px)`, opacity: z }}>
          <rect x={210} y={1240} width={90} height={190} rx={45} fill={SKIN} transform="rotate(-24 255 1335)" />
          <rect x={790} y={1240} width={90} height={190} rx={45} fill={SKIN} transform="rotate(24 835 1335)" />
          <rect x={790} y={1250} width={30} height={170} rx={15} fill={SKIN_SHADE} opacity={0.5} transform="rotate(24 835 1335)" />
        </svg>
      ) : null}
      <Pill text="ya, kamu!" delay={kamu} top={270} color={THEME.amber} fontSize={64} exit={false} />
      <Sfx at={lima} src="sfx/tick_001.ogg" volume={0.5} />
      <Sfx at={jj} src="sfx/whoosh.wav" volume={0.45} />
      <Sfx at={kamu} src="sfx/drop_002.ogg" volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 3 Hours a day staring at a small screen (deliberate time-lapse) ──────────
const Layar: React.FC = () => {
  const f = useCurrentFrame();
  const jam = W(2, "berjam-jam");
  const sehari = W(2, "sehari");
  const layar = W(2, "layar");
  const lapse = interpolate(f, [jam, sehari + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dusk = Math.sin(lapse * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5; // day → night → day
  const tired = ramp(f, jam, 40);
  return (
    <AbsoluteFill>
      <Sofa phone look={{ x: 0, y: 28 }} pitch={10} mouth="flat" eyes={0.85 - 0.2 * tired} drop={8 * tired} />
      <AbsoluteFill style={{ background: "#141A33", opacity: dusk * 0.5 }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(ellipse 260px 160px at 540px 1250px, rgba(155,227,255,${0.25 * dusk}) 0%, rgba(155,227,255,0) 100%)` }} />
      <Thought cx={270} top={290} w={340} h={270} delay={jam - 4} tx={520}>
        <Clock w={170} min={lapse * 60 * 14} />
        <span style={{ fontWeight: 900, fontSize: 38, color: THEME.ink }}>berjam-jam</span>
      </Thought>
      <Thought cx={810} top={290} w={340} h={270} delay={layar} tx={560}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <PhoneFront w={80} h={150} screen="#9BE3FF" />
          <svg width={30} height={160} viewBox="0 0 30 160">
            <rect x={4} y={0} width={22} height={160} rx={4} fill={THEME.amber} />
            {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={4} y={8 + i * 18} width={i % 2 ? 8 : 14} height={3} fill={THEME.ink} />)}
          </svg>
        </div>
        <span style={{ fontWeight: 900, fontSize: 38, color: THEME.ink }}>sekecil ini</span>
      </Thought>
      <Pill text="tiap hari" delay={sehari} top={640} color={THEME.primary} fontSize={44} />
      {Array.from({ length: 6 }).map((_, i) => <Sfx key={i} at={jam + i * 9} src="sfx/tick_001.ogg" volume={0.3} />)}
      <Sfx at={layar} src="sfx/pluck_002.ogg" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 4 The phone vanishes for 30 days → title ────────────────────────────────
const Hilang: React.FC = () => {
  const f = useCurrentFrame();
  const hilang = W(3, "hilang");
  const selama = W(3, "selama");
  const gone = f >= hilang + 2;
  const shock = ramp(f, hilang + 4, 6);
  const title = ramp(f, selama - 4, 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: title ? `blur(${title * 8}px)` : undefined }}>
        <Sofa phone={!gone} look={{ x: 0, y: 28 - 4 * shock }} pitch={10} mouth={shock > 0.5 ? "o" : "flat"} eyes={0.85 + 0.3 * shock} worried={shock > 0.5} />
        <Puff at={hilang} x={PHONE_SCREEN.x} y={PHONE_SCREEN.y - 40} r={130} />
      </AbsoluteFill>
      {title > 0 ? (
        <AbsoluteFill style={{ opacity: title }}>
          <TitleCard text="30 hari tanpa hape?" exit={false} fontSize={170} maxWidth="86%" bg="rgba(30,36,64,0.55)" delay={selama} />
        </AbsoluteFill>
      ) : null}
      <Sfx at={hilang} src="sfx/whoosh.wav" volume={0.5} />
      <Sfx at={hilang + 2} src="sfx/drop_002.ogg" volume={0.5} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={selama + i * 4} src="sfx/pluck_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 5 What happens to the brain? How long until panic? → comment ─────────────
const Panik: React.FC = () => {
  const f = useCurrentFrame();
  const otak = W(4, "otak");
  const berapa = W(4, "berapa");
  const panik = W(4, "panik");
  const day = Math.max(1, Math.min(30, Math.floor(interpolate(f, [berapa, panik + 20], [1, 30], clamp))));
  const p = f >= panik ? 1 : 0;
  const dart = p ? Math.sign(Math.sin(f / 3)) * 24 : 0;
  return (
    <AbsoluteFill style={{ transform: p ? `translate(${Math.sin(f * 2.1) * 5}px, ${Math.cos(f * 1.7) * 4}px)` : undefined }}>
      <Sofa phone={false} look={{ x: dart, y: p ? -4 : -18 }} mouth={p ? "o" : "flat"} worried={f >= berapa} tilt={p ? Math.sin(f / 2) * 3 : -5} eyes={p ? 1.1 : 1} />
      <Thought cx={280} top={300} w={360} h={270} delay={otak - 4} tx={520}>
        <div style={{ transform: `scale(${1 + 0.05 * Math.sin(f / 5)})` }}><Brain w={170} /></div>
        <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>otak kita?</span>
      </Thought>
      {f >= berapa ? (
        <div style={{ position: "absolute", left: 680, top: 320, transform: `rotate(${Math.sin(f / 9) * 4}deg)` }}>
          <Calendar w={250} top="HARI KE-" big={String(day)} color={p ? THEME.orange : THEME.primary} />
        </div>
      ) : null}
      <Stamp at={panik} text="PANIK?" top={575} size={96} color={THEME.orange} rot={6} />
      <CommentCta at={LAST + 14} text="Berapa lama kamu kuat tanpa hape?" />
      <Sfx at={otak - 4} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={berapa} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={panik} src="sfx/drop_002.ogg" volume={0.7} />
    </AbsoluteFill>
  );
};

export const Hape: React.FC = () => (
  <Short tl={timeline} music="hape/music.wav" scenes={[Ingat, Kamu, Layar, Hilang, Panik]}
    trans={[fade(), colorWipe(THEME.amber), whipBlur(), colorWipe(THEME.teal)] as never[]} />
);
