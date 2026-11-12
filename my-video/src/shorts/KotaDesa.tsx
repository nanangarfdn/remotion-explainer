import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Chibi } from "../explainer/Chibi";
import { Layer, Sfx, THEME, TitleCard, World, colorWipe, whipBlur } from "../explainer/kit";
import { KamarBack, KamarDesk } from "../contoh/sets";
import { PHONE_LIGHT, Phone } from "../contoh/Contoh";
import { Hedge, StreetBack } from "../sadap/street";
import timeline from "../../public/voiceover/kotadesa/timeline.json";
import { Bowl, Box, Car, CommentCta, FPS, Pill, Puff, Rooster, Short, Thought, clamp, ramp, timing } from "./common";

// "Mending hidup di kota atau di desa?" — hook short, 1080×1920.
const { TOTAL, W, LAST } = timing(timeline);
export const KOTADESA_DURATION = TOTAL;

// ── Village at sunrise: mountains, rice terraces, our terrace in front ───────
const House: React.FC<{ x: number; y: number; s: number; wall?: string }> = ({ x, y, s, wall = "#C98F5A" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={300} width={40} height={90} fill="#7A4E2C" />
    <rect x={430} y={300} width={40} height={90} fill="#7A4E2C" />
    <rect x={0} y={90} width={460} height={220} fill={wall} />
    {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={i * 42} y={90} width={4} height={220} fill="#000" opacity={0.08} />)}
    <path d="M-50 100 L230 -60 L510 100 Z" fill="#8C3B2E" />
    <path d="M-50 100 L230 -60 L230 -40 L-20 100 Z" fill="#fff" opacity={0.1} />
    <rect x={180} y={150} width={100} height={160} rx={6} fill="#6B3F22" />
    <rect x={40} y={150} width={100} height={80} rx={6} fill="#FFE7B0" />
    <rect x={320} y={150} width={100} height={80} rx={6} fill="#FFE7B0" />
    <rect x={88} y={150} width={4} height={80} fill="#6B3F22" />
    <rect x={368} y={150} width={4} height={80} fill="#6B3F22" />
    <rect x={-30} y={306} width={520} height={24} fill="#A0683C" />
  </g>
);
const DesaBack: React.FC<{ rise?: number }> = ({ rise = 1 }) => {
  const f = useCurrentFrame();
  const sunY = 760 - 180 * rise;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FB8F0" /><stop offset="0.7" stopColor="#FFD9A8" /><stop offset="1" stopColor="#FFC98A" /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#dawn)" />
      <circle cx={760} cy={sunY} r={140} fill="#FFF2B8" opacity={0.5} />
      <circle cx={760} cy={sunY} r={95} fill="#FFD25E" />
      {[[140, 320, 1], [880, 260, 0.8]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${((x + f * 0.6) % 1300) - 100} ${y}) scale(${s})`} fill="#fff" opacity={0.85}>
          <ellipse rx={90} ry={36} /><ellipse cx={-60} cy={12} rx={56} ry={26} /><ellipse cx={64} cy={14} rx={60} ry={26} />
        </g>
      ))}
      <path d="M-100 1000 L260 620 Q300 585 340 620 L760 1000 Z" fill="#7FA7C9" />
      <path d="M380 1000 L780 660 Q820 628 860 660 L1200 1000 Z" fill="#6A93B8" />
      <path d="M260 620 Q300 585 340 620 L320 640 L300 625 L280 642 Z" fill="#fff" opacity={0.7} />
      {["#9BD46B", "#86C95C", "#72BC4E", "#5FAE48"].map((c, i) => (
        <path key={c} d={`M0 ${960 + i * 90} Q270 ${930 + i * 90} 540 ${955 + i * 90} T1080 ${945 + i * 90} L1080 1920 L0 1920 Z`} fill={c} />
      ))}
      {Array.from({ length: 4 }).map((_, i) => <path key={i} d={`M0 ${1000 + i * 90} Q270 ${970 + i * 90} 540 ${995 + i * 90} T1080 ${985 + i * 90}`} stroke="#fff" strokeWidth={3} opacity={0.25} fill="none" />)}
      {[[90, 930], [980, 900]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q-6 -90 10 -170" stroke="#8D6440" strokeWidth={12} fill="none" />
          {[-160, -110, -60, -10, 30].map((a) => <ellipse key={a} cx={10} cy={-170} rx={70} ry={14} fill="#3C9A63" transform={`rotate(${a + 90 + Math.sin(f / 20) * 3} 10 -170) translate(40 0)`} />)}
        </g>
      ))}
      <House x={600} y={800} s={0.42} wall="#D9A06A" />
    </svg>
  );
};
// Our terrace: house wall behind the character, railing in front.
const TerraceBack: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <rect x={-40} y={560} width={560} height={800} fill="#C98F5A" />
    {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={-40 + i * 44} y={560} width={5} height={800} fill="#000" opacity={0.08} />)}
    <rect x={-40} y={600} width={210} height={150} rx={8} fill="#FFE7B0" />
    <rect x={60} y={600} width={6} height={150} fill="#6B3F22" />
    <path d="M-80 580 L560 580 L520 500 L-80 500 Z" fill="#8C3B2E" />
    <rect x={-40} y={1340} width={600} height={40} fill="#A0683C" />
  </svg>
);
const TerraceFront: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <rect x={-40} y={1220} width={600} height={22} rx={6} fill="#7A4E2C" />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 64} y={1230} width={18} height={150} fill="#8C5A33" />)}
    <rect x={-40} y={1370} width={1160} height={560} fill="#5FAE48" />
    <rect x={-40} y={1370} width={1160} height={14} fill="#4E9A3B" />
    {/* bamboo fence post on the right for the rooster */}
    <rect x={780} y={1190} width={200} height={20} rx={8} fill="#C9A15A" />
    {[800, 900].map((x) => <rect key={x} x={x} y={1190} width={22} height={190} rx={8} fill="#B88E48" />)}
  </svg>
);
const Wind: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {[0, 1, 2].map((i) => {
        const t = (f - at - i * 8) / 40;
        if (t < 0 || t > 1) return null;
        const x = -200 + t * 1400;
        const y = 640 + i * 110;
        return <path key={i} d={`M${x} ${y} q80 -30 160 0 t160 0 q40 -40 0 -60`} stroke={THEME.mint} strokeWidth={10} strokeLinecap="round" fill="none" opacity={Math.sin(t * Math.PI)} />;
      })}
    </svg>
  );
};

// ── 1 Village morning ────────────────────────────────────────────────────────
const Desa: React.FC = () => {
  const f = useCurrentFrame();
  const pagi = W(0, "pagi");
  const ayam = W(0, "ayam");
  const kokok = W(0, "berkokok");
  const udara = W(0, "udara");
  const tetangga = W(0, "tetangga");
  const awake = ramp(f, pagi + 6, 10);
  const breathe = f >= udara && f < tetangga ? ramp(f, udara, 10) : 0;
  const crow = f >= kokok && f < kokok + 30 ? Math.sin(((f - kokok) / 30) * Math.PI) : 0;
  const wave = f >= tetangga ? Math.sin(f / 3) : 0;
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><DesaBack rise={interpolate(f, [0, 150], [0, 1], clamp)} /></Layer>
      <Layer to={1.05} drift={16}>
        {/* neighbour on her terrace across the yard */}
        <div style={{ position: "absolute", left: 640, top: 760, transform: `scale(${spring({ frame: f - tetangga, fps: FPS, config: { damping: 11 } })})`, transformOrigin: "50% 100%" }}>
          <Chibi width={260} shirt={THEME.pink} shirtShade="#E46F96" hair="#3B2A22" mouth={f % 16 < 8 ? "o" : "smile"} look={{ x: -18, y: 0 }} lightFrom="right" />
          <svg width={80} height={80} style={{ position: "absolute", left: 200, top: 210 + wave * 12, overflow: "visible" }}>
            <rect x={-14} y={30} width={26} height={70} rx={13} fill={THEME.pink} transform={`rotate(${30 + wave * 18} 0 90)`} />
            <circle cx={10 + wave * 8} cy={24} r={14} fill="#F6D2B0" />
          </svg>
        </div>
      </Layer>
      <Layer to={1.07} drift={24}>
        <TerraceBack />
        <div style={{ position: "absolute", left: 90, top: 700 }}>
          <Chibi width={520} lightFrom="right" eyesOpen={0.1 + 0.9 * awake - 0.8 * breathe} mouth={awake < 0.5 ? "o" : "smile"}
            headTilt={-6 * (1 - awake) + (f >= tetangga ? 5 : 0)} headDrop={-8 * breathe} look={{ x: f >= tetangga ? 24 : 0, y: f >= tetangga ? -6 : 0 }} />
        </div>
      </Layer>
      <Layer to={1.1} drift={34}>
        <TerraceFront />
        <div style={{ position: "absolute", left: 790, top: 1010, transform: `scale(${spring({ frame: f - ayam, fps: FPS, config: { damping: 10 } })})`, transformOrigin: "50% 100%" }}>
          <Rooster w={190} crow={crow} />
          {crow > 0.2 ? [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 180 + i * 22, top: 30 - i * 10, width: 14, height: 50 + i * 14, borderRadius: 8, background: THEME.amber, transform: `rotate(${-30 + i * 30}deg)`, opacity: crow }} />) : null}
        </div>
      </Layer>
      <Wind at={udara} />
      <Pill text="desa" delay={4} top={270} color={THEME.teal} fontSize={60} />
      <Sfx at={ayam} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={kokok} src="sfx/glass_001.ogg" volume={0.35} />
      <Sfx at={udara} src="sfx/whoosh.wav" volume={0.25} />
      <Sfx at={tetangga} src="sfx/pluck_002.ogg" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 2 City morning: horn, train, then everything delivered ──────────────────
const Train: React.FC<{ x: number }> = ({ x }) => (
  <svg width={1600} height={200} style={{ position: "absolute", left: x, top: 700 }}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 520} 0)`}>
        <rect x={0} y={20} width={500} height={130} rx={i === 0 ? 50 : 16} fill="#EDEFF7" />
        <rect x={0} y={110} width={500} height={16} fill={THEME.primary} />
        {[30, 140, 250, 360].map((wx) => <rect key={wx} x={wx} y={44} width={90} height={50} rx={10} fill="#7FA8F5" />)}
      </g>
    ))}
    <rect x={-200} y={152} width={2000} height={30} fill="#8A86A8" />
  </svg>
);
const Kota: React.FC = () => {
  const f = useCurrentFrame();
  const kl = W(1, "klakson");
  const kejar = W(1, "kejar");
  const tapi = W(1, "tapi");
  const semua = W(1, "semua");
  const pesan = W(1, "pesan");
  const carX = interpolate(f, [kl - 14, kl + 22], [-560, 1200], clamp);
  const flinch = interpolate(f, [kl, kl + 3, kl + 16], [0, 1, 0], clamp);
  const trainX = interpolate(f, [kejar - 20, tapi], [1200, -1700], clamp);
  const run = f >= kejar && f < tapi ? 1 : 0;
  const calm = f >= tapi;
  const box = f >= pesan ? spring({ frame: f - pesan, fps: FPS, config: { damping: 9 } }) : 0;
  return (
    <AbsoluteFill>
      <Layer to={1.04} drift={16}>
        <StreetBack />
        <Train x={trainX} />
        <div style={{ position: "absolute", left: carX, top: 880 }}><Car w={520} color={THEME.teal} /></div>
      </Layer>
      <Layer to={1.07} drift={24}>
        <div style={{ position: "absolute", left: 260 + run * Math.sin(f / 3) * 30, top: 640 - run * Math.abs(Math.sin(f / 3)) * 26 }}>
          <Chibi width={560} lightFrom="right" pose={calm ? "hold" : "idle"} glow={calm ? PHONE_LIGHT : undefined}
            worried={!calm && f >= kl} mouth={flinch > 0.3 ? "o" : calm ? "smile" : f >= kl ? "worried" : "flat"}
            look={calm ? { x: 0, y: 26 } : run ? { x: -24, y: -6 } : { x: flinch * -20, y: 0 }} pitch={calm ? 10 : 0} eyesOpen={calm ? 0.85 : 1}
            headTilt={flinch * 6 + (run ? Math.sin(f / 3) * 4 : 0)}>
            {calm ? <Phone /> : null}
          </Chibi>
        </div>
        <Hedge top={1290} />
        {box > 0 ? <div style={{ position: "absolute", left: 760, top: 1110 - (1 - Math.min(1, box)) * 500 }}><Box w={220} /></div> : null}
      </Layer>
      {flinch > 0 ? <div style={{ position: "absolute", left: 620, top: 760, fontFamily: THEME.font, fontWeight: 900, fontSize: 90, color: THEME.amber, WebkitTextStroke: `12px ${THEME.navy}`, paintOrder: "stroke fill", transform: `scale(${0.6 + flinch * 0.6}) rotate(-8deg)` }}>TIN!</div> : null}
      <Puff at={pesan + 6} x={870} y={1300} r={90} />
      <Thought cx={790} top={300} w={360} h={260} delay={semua} tx={560} out={ramp(f, pesan, 8)}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}><Bowl w={130} /><Box w={110} /></div>
      </Thought>
      <Pill text="kota" delay={W(1, "bangun")} top={270} color={THEME.primary} fontSize={60} />
      <Sfx at={kl} src="sfx/glass_001.ogg" volume={0.5} />
      <Sfx at={kl - 6} src="sfx/whoosh.wav" volume={0.4} />
      <Sfx at={kejar} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={semua} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={pesan + 6} src="sfx/drop_002.ogg" volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 3 Split: both feel nice, both have a price ────────────────────────────────
const Tag: React.FC<{ at: number; x: number; text: string }> = ({ at, x, text }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const drop = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 140 } });
  const swing = Math.sin((f - at) / 5) * 16 * Math.exp(-(f - at) / 20);
  return (
    <div style={{ position: "absolute", left: x - 170, top: -200 + 560 * drop, width: 340, transform: `rotate(${swing}deg)`, transformOrigin: "50% -120px" }}>
      <div style={{ position: "absolute", left: 168, top: -400, width: 4, height: 400, background: THEME.navy }} />
      <div style={{ background: THEME.amber, borderRadius: 24, padding: "18px 10px", textAlign: "center", fontFamily: THEME.font, fontWeight: 900, fontSize: 46, color: THEME.ink, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 30, opacity: 0.7 }}>HARGANYA</div>{text}
      </div>
    </div>
  );
};
const Split: React.FC<{ blur?: number; children?: React.ReactNode }> = ({ blur = 0, children }) => (
  <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1920, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -320, top: 0 }}><DesaBack /></div>
      <svg width={540} height={1920} style={{ position: "absolute" }}><rect y={1290} width={540} height={630} fill="#5FAE48" /></svg>
    </div>
    <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -200, top: 0 }}><StreetBack /></div>
      <div style={{ position: "absolute", left: -200, top: 0 }}><Hedge top={1290} /></div>
    </div>
    <div style={{ position: "absolute", left: 534, top: 0, width: 12, height: 1920, background: THEME.paper }} />
    {children}
  </AbsoluteFill>
);
const Harga: React.FC = () => {
  const f = useCurrentFrame();
  const enak = W(2, "enak");
  const harga = W(2, "harga");
  const sad = f >= harga + 6;
  return (
    <AbsoluteFill>
      <Layer to={1.05}>
        <Split>
          <div style={{ position: "absolute", left: 80, top: 860 }}>
            <Chibi width={380} lightFrom="right" mouth={sad ? "worried" : "smile"} worried={sad} eyesOpen={sad ? 1 : 0.4} headTilt={sad ? 0 : -6} look={{ x: sad ? 10 : 0, y: sad ? -12 : 0 }} />
          </div>
          <div style={{ position: "absolute", left: 620, top: 860 }}>
            <Chibi width={380} lightFrom="right" pose="hold" glow={PHONE_LIGHT} shirt={THEME.primary} shirtShade={THEME.primaryDark}
              mouth={sad ? "worried" : "smile"} worried={sad} look={{ x: sad ? -10 : 0, y: sad ? -12 : 24 }} pitch={sad ? 0 : 10}>
              <Phone />
            </Chibi>
          </div>
        </Split>
      </Layer>
      {[270, 810].map((x, i) => (
        <div key={x} style={{ opacity: 1 - ramp(f, harga - 4, 6) }}>
          <div style={{ position: "absolute", left: x - 540, width: 1080 }}>
            <Pill text="enak" delay={enak + i * 6} top={330} color={i ? THEME.primary : THEME.teal} fontSize={56} />
          </div>
        </div>
      ))}
      <Tag at={harga} x={270} text="sepi, jauh" />
      <Tag at={harga + 5} x={810} text="macet, mahal" />
      <Sfx at={enak} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={enak + 6} src="sfx/pluck_002.ogg" volume={0.4} />
      <Sfx at={harga} src="sfx/drop_002.ogg" volume={0.6} />
    </AbsoluteFill>
  );
};

// ── 4 Title: one person on the dividing line, looking at each side ─────────
const Tanya: React.FC = () => {
  const f = useCurrentFrame();
  const mending = W(3, "mending");
  const look = Math.sin(f / 14);
  const title = ramp(f, mending - 6, 10);
  return (
    <AbsoluteFill>
      <Split blur={title * 8}>
        <div style={{ position: "absolute", left: 280, top: 760, filter: title ? `blur(${title * 8}px)` : undefined }}>
          <Chibi width={520} lightFrom="right" shirt={THEME.orange} shirtShade={THEME.orangeDark} look={{ x: look * 26, y: -4 }} headTilt={look * 5} mouth="flat" worried />
        </div>
      </Split>
      {title > 0 ? (
        <AbsoluteFill style={{ opacity: title }}>
          <TitleCard text="Kota atau desa?" exit={false} fontSize={190} maxWidth="86%" bg="rgba(30,36,64,0.55)" delay={mending} />
        </AbsoluteFill>
      ) : null}
      {[0, 1, 2].map((i) => <Sfx key={i} at={mending + i * 4} src="sfx/pluck_001.ogg" volume={0.4} />)}
    </AbsoluteFill>
  );
};

// ── 5 What does science say? (at the desk, researching) → comment ───────────
const DESK_CAM = { k: 1.2, x: 510, y: -380 };
const Gauge: React.FC<{ v: number }> = ({ v }) => (
  <svg width={240} height={150} viewBox="0 0 240 150">
    <path d="M20 130 A100 100 0 0 1 220 130" stroke="#E6E9F2" strokeWidth={26} fill="none" />
    <path d="M20 130 A100 100 0 0 1 120 30" stroke={THEME.teal} strokeWidth={26} fill="none" />
    <path d="M120 30 A100 100 0 0 1 220 130" stroke={THEME.primary} strokeWidth={26} fill="none" />
    <rect x={116} y={50} width={8} height={84} rx={4} fill={THEME.ink} transform={`rotate(${v * 70} 120 130)`} />
    <circle cx={120} cy={130} r={14} fill={THEME.amber} />
  </svg>
);
const Ilmu: React.FC = () => {
  const f = useCurrentFrame();
  const ilmu = W(4, "ilmu");
  const bahagia = W(4, "bahagia");
  const typing = f < bahagia ? 1 : 0;
  return (
    <AbsoluteFill>
      <Layer to={1.03} drift={10} blur={2}><World cam={DESK_CAM}><KamarBack v /></World></Layer>
      <Layer to={1.06} drift={20}>
        <World cam={DESK_CAM}>
          <div style={{ position: "absolute", left: 700, top: 120 }}>
            <Chibi width={520} glow="#BFE9FF" typing={typing} pitch={typing ? 8 : 0} look={{ x: 0, y: typing ? 24 : -16 }} eyesOpen={typing ? 0.85 : 1}
              mouth={f >= bahagia ? "o" : "flat"} headTilt={f >= bahagia ? 6 : 0} />
          </div>
        </World>
      </Layer>
      <Layer to={1.09} drift={34}><World cam={DESK_CAM}><KamarDesk v /></World></Layer>
      <Thought cx={270} top={300} w={380} h={270} delay={ilmu} tx={520}>
        <svg width={170} height={150} viewBox="0 0 170 150">
          <path d="M60 10 L110 10 L110 20 L102 20 L102 60 L150 130 Q154 142 140 142 L30 142 Q16 142 20 130 L68 60 L68 20 L60 20 Z" fill="#DDF7F1" stroke={THEME.teal} strokeWidth={6} />
          <path d="M44 100 L126 100 L146 132 L24 132 Z" fill={THEME.teal} />
          {[0, 1, 2].map((i) => <circle key={i} cx={70 + i * 16} cy={84 - ((f / 3 + i * 9) % 30)} r={6} fill={THEME.teal} opacity={0.7} />)}
        </svg>
        <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>kata ilmu?</span>
      </Thought>
      <Thought cx={800} top={300} w={400} h={270} delay={bahagia} tx={560}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 900, fontSize: 34, color: THEME.teal }}>desa</span>
          <Gauge v={Math.sin(f / 7)} />
          <span style={{ fontWeight: 900, fontSize: 34, color: THEME.primary }}>kota</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: 40, color: THEME.ink }}>lebih bahagia?</span>
      </Thought>
      <CommentCta at={LAST + 14} text="Kamu tim kota atau tim desa?" />
      <Sfx at={ilmu} src="sfx/pluck_001.ogg" volume={0.4} />
      <Sfx at={bahagia} src="sfx/pluck_002.ogg" volume={0.4} />
    </AbsoluteFill>
  );
};

export const KotaDesa: React.FC = () => (
  <Short tl={timeline} music="kotadesa/music.wav" scenes={[Desa, Kota, Harga, Tanya, Ilmu]}
    trans={[whipBlur(), colorWipe(THEME.amber), colorWipe(THEME.teal), whipBlur()] as never[]} />
);
