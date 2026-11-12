import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Chibi } from "../explainer/Chibi";
import { Layer, Sfx, THEME, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, KamarDesk } from "../contoh/sets";
import { PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { Hedge, StreetBack } from "../sadap/street";
import timeline from "../../public/voiceover/bohong/timeline.json";
import { Bowl, Calendar, CommentCta, FPS, HeartIcon, Pill, Salt, Say, Short, Stamp, Thought, clamp, ramp, timing } from "./common";

// "Apa jadinya kalau kita gak bisa bohong?" — hook short, 1080×1920.
const { TOTAL, W, LAST } = timing(timeline);
export const BOHONG_DURATION = TOTAL;

const HOOK_CAM = { k: 1.5, x: 600, y: -200 };
const DESK_CAM = { k: 1.2, x: 510, y: -380 };
const ROBE = "#F4F1EC";
const ROBE_SHADE = "#DCD6CC";

// Steam rising off a fresh shower.
const Steam: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const f = useCurrentFrame();
  return (
    <svg width={400} height={300} style={{ position: "absolute", left: x - 200, top: y - 300, overflow: "visible" }}>
      {[0, 1, 2].map((i) => {
        const t = (f / 34 + i / 3) % 1;
        return <path key={i} d={`M${120 + i * 80} ${280 - t * 140} q-20 -26 0 -52 q20 -26 0 -52`} stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={on * 0.7 * Math.sin(t * Math.PI)} />;
      })}
    </svg>
  );
};

// ── 1 "Bentar lagi sampai." Padahal baru mandi. ───────────────────────────────
const Mandi: React.FC = () => {
  const f = useCurrentFrame();
  const sampai = W(0, "sampai");
  const padahal = W(0, "padahal");
  const mandi = W(0, "mandi");
  const up = ramp(f, padahal, 8);
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><World cam={HOOK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.07} drift={24}>
        <World cam={HOOK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} pose="hold" glow={PHONE_LIGHT} towel={THEME.pink} shirt={ROBE} shirtShade={ROBE_SHADE} thumb={f < sampai + 6}
              look={{ x: 0, y: 28 * (1 - up) }} pitch={10 * (1 - up)} eyesOpen={0.82 + 0.2 * up} mouth={up > 0.5 ? "smile" : "flat"} headTilt={7 * up}>
              <Phone />
            </Chibi>
          </div>
        </World>
      </Layer>
      <Layer to={1.11} drift={40}><World cam={HOOK_CAM}><KamarDesk v laptop={false} /></World></Layer>
      <Steam x={540} y={520} on={ramp(f, padahal, 10)} />
      <Say left={160} top={265} delay={sampai - 6} text="Bentar lagi sampai!" tail="right" size={56} bg={THEME.mint} />
      <Pill text="baru mandi" delay={mandi} top={395} color={THEME.primary} fontSize={50} />
      <Sfx at={sampai - 6} src="sfx/glass_001.ogg" volume={0.45} />
      <Sfx at={padahal} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={mandi} src="sfx/drop_002.ogg" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 2 "Enak kok masakannya." Padahal keasinan. ────────────────────────────────
const Asin: React.FC = () => {
  const f = useCurrentFrame();
  const enak = W(1, "enak");
  const padahal = W(1, "padahal");
  const asin = W(1, "keasinan");
  const cringe = ramp(f, padahal, 6);
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><World cam={DESK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.06} drift={20}>
        <World cam={DESK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} shirt={THEME.primary} shirtShade={THEME.primaryDark} pose="hold"
              mouth={cringe > 0.5 ? "worried" : "smile"} worried={cringe > 0.5} eyesOpen={1 - 0.75 * cringe}
              look={{ x: 0, y: cringe > 0.5 ? 0 : 16 }} headTilt={cringe * -6 + (cringe > 0.5 ? Math.sin(f) * 1.5 : 0)} />
          </div>
        </World>
      </Layer>
      <Layer to={1.09} drift={34}>
        <World cam={DESK_CAM}>
          <KamarDesk v laptop={false} />
          <div style={{ position: "absolute", left: 860, top: 567 }}><Bowl w={200} /></div>
        </World>
      </Layer>
      <Say left={110} top={280} delay={enak} text="Enak kok masakannya!" tail="right" size={54} bg={THEME.mint} />
      <Thought cx={790} top={420} w={380} h={300} delay={asin - 4} tx={600}>
        <div style={{ transform: `rotate(${Math.sin(f / 2) * 18}deg)`, transformOrigin: "50% 20%" }}><Salt w={125} /></div>
        <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>keasinan</span>
      </Thought>
      <Sfx at={enak} src="sfx/pluck_001.ogg" volume={0.45} />
      <Sfx at={padahal} src="sfx/tick_001.ogg" volume={0.5} />
      <Sfx at={asin} src="sfx/drop_002.ogg" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── 3 We all tell small lies — maybe even today ──────────────────────────────
const PEOPLE: [number, string, string, string][] = [
  [0, THEME.teal, "#109583", "#23202B"],
  [360, THEME.orange, THEME.orangeDark, "#3B2A22"],
  [720, THEME.pink, "#E46F96", "#23202B"],
];
const Semua: React.FC = () => {
  const f = useCurrentFrame();
  const kita = W(2, "kita");
  const bohong = W(2, "bohong");
  const hari = W(2, "hari");
  return (
    <AbsoluteFill>
      <Layer to={1.05} drift={20}>
        <StreetBack />
        {PEOPLE.map(([x, shirt, shade, hair], i) => (
          <div key={x} style={{ position: "absolute", left: x, top: 820 }}>
            <Chibi width={360} shirt={shirt} shirtShade={shade} hair={hair} lightFrom="right"
              mouth={f >= hari ? "worried" : (f + i * 5) % 14 < 7 && f > kita + i * 14 && f < bohong + 30 ? "o" : "smile"}
              worried={f >= hari} look={{ x: f >= hari ? 0 : (1 - i) * 14, y: 0 }} headTilt={Math.sin((f + i * 20) / 16) * 4} />
          </div>
        ))}
        <Hedge top={1290} />
      </Layer>
      <Say left={30} top={650} delay={kita} text="Otw!" tail="left" size={52} />
      <Say left={300} top={500} delay={kita + 14} text="Udah di jalan" tail="down" size={50} />
      <Say left={590} top={650} delay={kita + 28} text="Aku gapapa" tail="right" size={50} />
      <div style={{ opacity: 1 - ramp(f, hari - 4, 6) }}><Pill text="bohong kecil" delay={bohong} top={300} color={THEME.primary} /></div>
      <Stamp at={hari} text="HARI INI?" top={290} size={110} color={THEME.amber} rot={-6} />
      {[0, 14, 28].map((d) => <Sfx key={d} at={kita + d} src="sfx/pluck_001.ogg" volume={0.35} />)}
      <Sfx at={bohong} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={hari} src="sfx/drop_002.ogg" volume={0.7} />
    </AbsoluteFill>
  );
};

// ── 4 Title over the blurred bedroom ─────────────────────────────────────────
const Tanya: React.FC = () => {
  const f = useCurrentFrame();
  const gimana = W(3, "gimana");
  const title = ramp(f, gimana - 6, 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${3 + title * 6}px)`, transform: `scale(${1.05 + f * 0.0012})` }}>
        <World cam={HOOK_CAM}><KamarBack v /></World>
        <World cam={HOOK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 80 }}>
            <Chibi width={520} shirt={THEME.primary} shirtShade={THEME.primaryDark} mouth="o" eyesOpen={1.1} headTilt={Math.sin(f / 6) * 3} />
          </div>
        </World>
        <World cam={HOOK_CAM}><KamarDesk v laptop={false} /></World>
      </AbsoluteFill>
      {title > 0 ? (
        <AbsoluteFill style={{ opacity: title }}>
          <TitleCard text="Gak bisa bohong?" exit={false} fontSize={190} maxWidth="86%" bg="rgba(30,36,64,0.55)" delay={gimana} />
        </AbsoluteFill>
      ) : null}
      {[0, 1, 2].map((i) => <Sfx key={i} at={gimana + i * 4} src="sfx/pluck_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 5 More peaceful? Or friendships broken within a week? → comment ─────────
const Teman: React.FC = () => {
  const f = useCurrentFrame();
  const damai = W(4, "damai");
  const atau = W(4, "atau");
  const teman = W(4, "pertemanan");
  const hancur = W(4, "hancur");
  const minggu = W(4, "seminggu");
  const broke = f >= hancur;
  const crack = broke ? interpolate(f, [hancur, hancur + 16], [0.05, 1], clamp) : 0;
  const big = spring({ frame: f - teman, fps: FPS, config: { damping: 10 } });
  const day = Math.min(7, 1 + Math.floor(Math.max(0, f - minggu) / 3));
  return (
    <AbsoluteFill>
      <Layer to={1.05} drift={16}>
        <StreetBack />
        <div style={{ position: "absolute", left: 40, top: 760 }}>
          <Chibi width={460} lightFrom="right" mouth={broke ? "worried" : "smile"} worried={broke} look={{ x: broke ? 18 : 16, y: 0 }} headTilt={broke ? -4 : 4} />
        </div>
        <div style={{ position: "absolute", left: 580, top: 760 }}>
          <Chibi width={460} lightFrom="right" shirt={THEME.pink} shirtShade="#E46F96" hair="#3B2A22"
            mouth={broke ? "flat" : "smile"} look={{ x: broke ? 24 : -16, y: broke ? -6 : 0 }} headTilt={broke ? 10 : -4} eyesOpen={broke ? 0.8 : 1} />
        </div>
        <Hedge top={1290} />
      </Layer>
      {/* small hearts drift up between them while life is "peaceful" */}
      {f >= damai && f < teman ? [0, 1, 2, 3].map((i) => {
        const t = ((f - damai) / 36 + i / 4) % 1;
        return <div key={i} style={{ position: "absolute", left: 470 + Math.sin(t * 6 + i) * 60, top: 900 - t * 380, opacity: Math.sin(t * Math.PI) * (1 - ramp(f, atau, 10)) }}><HeartIcon w={90} /></div>;
      }) : null}
      {f >= teman ? (
        <div style={{ position: "absolute", left: 420, top: 470, transform: `scale(${big})` }}>
          <HeartIcon w={240} color={THEME.pink} crack={crack} />
        </div>
      ) : null}
      <Pill text="lebih damai?" delay={damai} top={300} color={THEME.teal} />
      {f >= minggu ? (
        <div style={{ position: "absolute", left: 760, top: 300, transform: `scale(${spring({ frame: f - minggu, fps: FPS, config: { damping: 10 } })}) rotate(6deg)` }}>
          <Calendar w={230} top="HARI KE-" big={String(day)} color={THEME.orange} />
        </div>
      ) : null}
      <CommentCta at={LAST + 14} text="Bohong terakhir kamu apa?" />
      <Sfx at={damai} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={teman} src="sfx/pluck_002.ogg" volume={0.45} />
      <Sfx at={hancur} src="sfx/drop_002.ogg" volume={0.8} />
      <Sfx at={minggu} src="sfx/tick_001.ogg" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Bohong: React.FC = () => (
  <Short tl={timeline} music="bohong/music.wav" scenes={[Mandi, Asin, Semua, Tanya, Teman]}
    trans={[whipBlur(), colorWipe(THEME.amber), colorWipe(THEME.teal), whipBlur()] as never[]} />
);
