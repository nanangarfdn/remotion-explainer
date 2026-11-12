import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Static set pieces drawn as 1920×1080 SVG layers. Animated bits live in Contoh.tsx.
// `v` = portrait: the same world seen through a zoomed camera (Contoh.tsx `World`), so walls and
// floors extend past 0…1080 (drawn outside the viewBox, overflow visible) and props move into view.
type V = { v?: boolean };

const Full: React.FC<{ children: React.ReactNode; v?: boolean }> = ({ children, v }) => (
  <AbsoluteFill>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={v ? { overflow: "visible" } : undefined}>{children}</svg>
  </AbsoluteFill>
);
// World y range the portrait sets cover (camera sees about −240…1140).
const VY = -400;
const VH = 1900;

// ── Kamar (bedroom, late night) ───────────────────────────────────────────

const BUILDINGS: [number, number, number][] = [
  [0, 70, 150], [66, 54, 210], [116, 80, 120], [192, 60, 250], [248, 90, 170], [334, 50, 230], [380, 100, 140],
];

const Window: React.FC = () => (
  <g transform="translate(150 100)">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141A33" />
        <stop offset="1" stopColor="#3A4B86" />
      </linearGradient>
      <clipPath id="win"><rect width={480} height={380} rx={8} /></clipPath>
    </defs>
    <rect x={-24} y={-24} width={528} height={428} rx={20} fill="#FFFFFF" />
    <g clipPath="url(#win)">
      <rect width={480} height={380} fill="url(#sky)" />
      {[[40, 50], [120, 30], [200, 80], [280, 40], [90, 130], [430, 160], [250, 150]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill="#fff" opacity={0.8} />
      ))}
      <circle cx={370} cy={90} r={46} fill="#FFF4C7" />
      <circle cx={356} cy={78} r={9} fill="#EFE2A6" />
      <circle cx={386} cy={104} r={6} fill="#EFE2A6" />
      {BUILDINGS.map(([x, w, h], b) => (
        <g key={x}>
          <rect x={x} y={380 - h} width={w} height={h} fill="#1A2242" />
          {Array.from({ length: Math.floor((h - 20) / 26) }).flatMap((_, r) =>
            Array.from({ length: Math.floor((w - 10) / 20) }).map((__, c) => (
              <rect key={`${r}-${c}`} x={x + 8 + c * 20} y={380 - h + 14 + r * 26} width={10} height={12}
                fill={(b * 7 + r * 3 + c * 5) % 4 === 0 ? "#FFD36B" : "#2A3458"} />
            )),
          )}
        </g>
      ))}
    </g>
    <rect x={236} y={0} width={8} height={380} fill="#fff" />
    <rect x={0} y={186} width={480} height={8} fill="#fff" />
    <rect x={-44} y={398} width={568} height={26} rx={8} fill="#F5EFE6" />
    <rect x={-44} y={420} width={568} height={10} rx={5} fill="#000" opacity={0.08} />
  </g>
);

const Curtain: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} 62) scale(${flip ? -1 : 1} 1)`}>
    <path d="M0 0 L130 0 C110 160 90 300 120 470 C80 490 30 490 0 480 Z" fill={THEME.teal} />
    {[30, 62, 94].map((fx) => (
      <path key={fx} d={`M${fx} 0 C${fx - 8} 160 ${fx - 14} 320 ${fx - 4} 482`} stroke="#0E8B78" strokeWidth={8} fill="none" opacity={0.6} />
    ))}
    <rect x={-4} y={300} width={110} height={18} rx={9} fill={THEME.amber} transform="rotate(-8 50 309)" />
  </g>
);

const Corkboard: React.FC = () => (
  <g transform="translate(1230 140)">
    <rect width={230} height={250} rx={14} fill="#C79A6B" stroke="#8D6440" strokeWidth={12} />
    {[
      [20, 24, THEME.amber, -6], [120, 30, THEME.pink, 5], [40, 130, THEME.mint, 4], [128, 136, "#fff", -4],
    ].map(([x, y, c, r]) => (
      <g key={`${x}${y}`} transform={`rotate(${r} ${Number(x) + 40} ${Number(y) + 40})`}>
        <rect x={Number(x)} y={Number(y)} width={80} height={80} fill={String(c)} />
        {[22, 38, 54].map((ly) => (
          <rect key={ly} x={Number(x) + 12} y={Number(y) + ly} width={56} height={5} rx={2} fill="#000" opacity={0.15} />
        ))}
        <circle cx={Number(x) + 40} cy={Number(y) + 8} r={7} fill={THEME.primary} />
      </g>
    ))}
  </g>
);

const BOOKS: [number, number, string, number][] = [
  [0, 120, THEME.primary, 0], [34, 140, THEME.amber, 0], [72, 110, THEME.teal, 0], [104, 130, THEME.pink, 0],
  [140, 118, "#5A5F73", 14],
];

const Shelf: React.FC = () => (
  <g transform="translate(1540 360)">
    {BOOKS.map(([x, h, c, r]) => (
      <g key={x} transform={`rotate(${r} ${x} 150)`}>
        <rect x={x} y={150 - h} width={30} height={h} rx={4} fill={c} />
        <rect x={x + 6} y={150 - h + 16} width={18} height={6} rx={3} fill="#fff" opacity={0.5} />
      </g>
    ))}
    {/* small plant */}
    <path d="M250 150 L238 96 L302 96 L290 150 Z" fill="#E7E1D6" />
    {[[-30, 60], [0, 70], [30, 58]].map(([rot, h]) => (
      <ellipse key={rot} cx={270} cy={96 - h / 2} rx={14} ry={h / 2} fill="#3FA66B" transform={`rotate(${rot} 270 96)`} />
    ))}
    <rect x={-20} y={150} width={350} height={18} rx={6} fill="#8D6440" />
    <rect x={-20} y={166} width={350} height={8} fill="#000" opacity={0.1} />
  </g>
);

export const KamarBack: React.FC<V> = ({ v }) => (
  <Full v={v}>
    <rect y={v ? VY : 0} width={1920} height={v ? VH : 1080} fill="#EADFCB" />
    {Array.from({ length: 31 }).map((_, i) => (
      <rect key={i} x={i * 64} y={v ? VY : 0} width={28} height={v ? VH : 1080} fill="#E2D5BE" />
    ))}
    {/* portrait: window + curtains shrink into the top-left corner, above the head; the clock hangs below-left */}
    <g transform={v ? "translate(522 -287) scale(0.75)" : undefined}>
      <Window />
      <rect x={90} y={50} width={700} height={12} rx={6} fill="#6B4B3A" />
      <circle cx={90} cy={56} r={14} fill="#6B4B3A" />
      <circle cx={790} cy={56} r={14} fill="#6B4B3A" />
      <Curtain x={110} />
      <Curtain x={770} flip />
    </g>
    <g transform={v ? "translate(-50 -40)" : undefined}><Corkboard /></g>
    <g transform={v ? "translate(-370 0)" : undefined}><Shelf /></g>
  </Full>
);

// Laptop seen from the camera side: lid back (sticker), hinge strip, base slab. Screen faces the character.
const Laptop: React.FC<{ cx: number; y: number }> = ({ cx, y }) => (
  <g transform={`translate(${cx} ${y})`}>
    <ellipse cx={0} cy={4} rx={200} ry={12} fill="#000" opacity={0.22} />
    <rect x={-196} y={-14} width={392} height={16} rx={6} fill="#8E97A3" />
    {/* lid tilts away from the camera, so its top edge is a little narrower */}
    <path d="M-180 -10 L-173 -136 C-172 -146 -167 -150 -157 -150 L157 -150 C167 -150 172 -146 173 -136 L180 -10 Z" fill="url(#lap)" />
    <path d="M-176 -40 L176 -40 L180 -10 L-180 -10 Z" fill="#000" opacity={0.08} />
    <rect x={-150} y={-12} width={300} height={6} rx={3} fill="#5E6672" />
    <circle cx={0} cy={-84} r={30} fill={THEME.teal} />
    <path d="M5 -109 L-12 -79 L1 -79 L-6 -55 L14 -88 L1 -88 Z" fill="#fff" />
  </g>
);

// Desk and everything on it, drawn in front of the character.
export const KamarDesk: React.FC<V & { laptop?: boolean }> = ({ v, laptop = true }) => {
  // portrait: lamp moves right (still left of the laptop, so the light direction holds; its base tucks
  // behind the laptop's left corner) and stays inside the frame after the 1.11 push-in; drawer under the laptop
  const lampX = v ? "translate(470 0)" : undefined;
  return (
  <Full v={v}>
    <defs>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE3A3" stopOpacity={0.55} />
        <stop offset="1" stopColor="#FFE3A3" stopOpacity={0} />
      </linearGradient>
      {/* lamp is on the left: lid back is lit top-left, darker bottom-right */}
      <linearGradient id="lap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D5DBE3" />
        <stop offset="1" stopColor="#A9B2BE" />
      </linearGradient>
    </defs>
    {/* lamp light */}
    <g transform={lampX}>
      <path d="M292 548 L372 548 L540 700 L160 700 Z" fill="url(#cone)" />
      <ellipse cx={350} cy={704} rx={200} ry={16} fill="#FFE3A3" opacity={0.5} />
    </g>
    {/* desk */}
    <rect x={-20} y={700} width={1960} height={44} fill="#9C6A42" />
    <rect x={-20} y={700} width={1960} height={8} fill="#B57D50" />
    <ellipse cx={350} cy={712} rx={230} ry={18} fill="#FFE3A3" opacity={0.18} transform={lampX} />
    <rect x={-20} y={744} width={1960} height={v ? 760 : 340} fill="#84552F" />
    <rect x={-20} y={744} width={1960} height={14} fill="#000" opacity={0.15} />
    {(v ? [800, 880, 960, 1040, 1120, 1200] : [800, 880, 960, 1040]).map((y) => (
      <path key={y} d={`M0 ${y} C400 ${y - 10} 800 ${y + 12} 1920 ${y - 4}`} stroke="#000" strokeWidth={3} opacity={0.08} fill="none" />
    ))}
    <g transform={v ? "translate(-540 0)" : undefined}>
      <rect x={1300} y={790} width={400} height={150} rx={12} fill="#91603A" />
      <rect x={1440} y={850} width={120} height={18} rx={9} fill="#5E3D22" />
      {/* sticky note on the drawer */}
      <g transform="rotate(-6 1370 840)">
        <rect x={1328} y={804} width={84} height={78} fill={THEME.amber} />
        <rect x={1328} y={804} width={84} height={14} fill="#000" opacity={0.08} />
        {[34, 48, 62].map((ly) => <rect key={ly} x={1340} y={804 + ly} width={58} height={5} rx={2} fill="#000" opacity={0.18} />)}
      </g>
    </g>
    {/* charger cable from the laptop, over the desk edge and down */}
    <path d={`M1150 718 C1200 720 1230 722 1238 744 C1246 800 1222 ${v ? 1000 : 900} 1250 ${v ? 1520 : 1100}`}
      stroke="#2B2F3A" strokeWidth={7} fill="none" strokeLinecap="round" />
    {/* desk lamp */}
    <g transform={lampX}>
    <ellipse cx={312} cy={712} rx={84} ry={12} fill="#000" opacity={0.2} />
    <ellipse cx={300} cy={706} rx={70} ry={14} fill={THEME.primaryDark} />
    <path d="M300 706 L250 612 L322 540" stroke={THEME.primaryDark} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx={250} cy={612} r={14} fill={THEME.primary} />
    <path d="M282 550 L382 550 L360 494 L304 494 Z" fill={THEME.primary} />
    <ellipse cx={332} cy={550} rx={46} ry={7} fill="#FFF3CF" />
    </g>
    {/* paper stack + pencil cup: off-camera in portrait (the mug takes that spot) */}
    {v ? null : <>
    <ellipse cx={1330} cy={714} rx={100} ry={8} fill="#000" opacity={0.18} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={1245 + i * 3} y={698 - i * 6} width={170} height={16} rx={3} fill={i % 2 ? "#FFFFFF" : "#F1ECE2"}
        transform={`rotate(${i % 2 ? 2 : -2} 1330 ${704 - i * 6})`} />
    ))}
    {/* pencil cup */}
    <ellipse cx={1530} cy={712} rx={50} ry={8} fill="#000" opacity={0.2} />
    {[[1507, THEME.amber, -8], [1527, THEME.pink, 4], [1543, THEME.primary, 12]].map(([x, c, r]) => (
      <rect key={String(x)} x={Number(x)} y={572} width={12} height={70} rx={4} fill={String(c)} transform={`rotate(${r} ${x} 632)`} />
    ))}
    <rect x={1495} y={622} width={70} height={92} rx={10} fill={THEME.teal} />
    <rect x={1537} y={622} width={28} height={92} rx={10} fill="#0E8B78" opacity={0.5} />
    </>}
    {laptop ? <Laptop cx={960} y={724} /> : null}
  </Full>
  );
};

// ── Ruang tamu (living room, night, warm lamp) ─────────────────────────────

const Leaf: React.FC<{ x: number; y: number; r: number; s: number }> = ({ x, y, r, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C40 -30 90 -30 130 0 C90 30 40 30 0 0 Z" fill="#2F8F5B" />
    <path d="M0 0 L120 0" stroke="#1F6B43" strokeWidth={4} />
  </g>
);

// Potted plant standing on the floor (pot base at 300, 930).
const Plant: React.FC = () => (
  <>
    <Leaf x={300} y={760} r={-130} s={1.2} />
    <Leaf x={300} y={760} r={-95} s={1.4} />
    <Leaf x={300} y={760} r={-60} s={1.2} />
    <Leaf x={300} y={760} r={-160} s={0.9} />
    <Leaf x={300} y={760} r={-25} s={0.9} />
    <ellipse cx={306} cy={934} rx={90} ry={12} fill="#000" opacity={0.25} />
    <path d="M230 760 L370 760 L350 930 L250 930 Z" fill="#E7E1D6" />
    <rect x={224} y={752} width={152} height={22} rx={8} fill="#D6CFC2" />
  </>
);

export const RuangBack: React.FC<V> = ({ v }) => {
  const frame = useCurrentFrame();
  const flicker = 0.92 + Math.sin(frame / 7) * 0.03;
  // portrait: floor lamp moves in beside the head (glow follows it), frames go above the head
  const glowAt = v ? { gradientUnits: "userSpaceOnUse" as const, cx: 1240, cy: 250, r: 900 } : { cx: "0.84", cy: "0.25", r: "0.6" };
  return (
    <Full v={v}>
      <defs>
        <radialGradient id="lampGlow" {...glowAt}>
          <stop offset="0" stopColor="#FFC870" stopOpacity={0.55 * flicker} />
          <stop offset="1" stopColor="#FFC870" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C3366" />
          <stop offset="1" stopColor="#3E4683" />
        </linearGradient>
      </defs>
      <rect y={v ? VY : 0} width={1920} height={v ? VH : 1080} fill="url(#wall)" />
      <rect y={v ? VY : 0} width={1920} height={v ? VH : 1080} fill="url(#lampGlow)" />
      {/* picture frames */}
      <g transform={v ? "translate(330 -250)" : undefined}>
      <g transform="translate(290 150)">
        <rect width={270} height={200} rx={10} fill="#F5EFE6" />
        <rect x={18} y={18} width={234} height={164} fill="#BDE3F5" />
        <path d="M18 182 L90 90 L140 150 L190 70 L252 182 Z" fill="#4E7F6B" />
        <circle cx={210} cy={50} r={18} fill={THEME.amber} />
      </g>
      <g transform="translate(600 110)">
        <rect width={170} height={230} rx={10} fill="#F5EFE6" />
        <rect x={16} y={16} width={138} height={198} fill="#F4D9C6" />
        <circle cx={70} cy={90} r={40} fill={THEME.primary} />
        <circle cx={100} cy={140} r={30} fill={THEME.teal} />
      </g>
      </g>
      {/* floor lamp */}
      <g transform={v ? "translate(-380 0)" : undefined}>
      <rect x={1612} y={300} width={14} height={620} fill="#20243F" />
      <ellipse cx={1612} cy={934} rx={96} ry={14} fill="#000" opacity={0.25} />
      <ellipse cx={1619} cy={922} rx={70} ry={14} fill="#20243F" />
      <path d="M1540 300 L1700 300 L1670 190 L1570 190 Z" fill="#FFE7BD" />
      </g>
      {/* floor + rug */}
      <rect x={0} y={930} width={1920} height={v ? 570 : 150} fill="#5C4030" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 260 - 40} y={930} width={4} height={v ? 570 : 150} fill="#000" opacity={0.15} />
      ))}
      <ellipse cx={960} cy={1020} rx={720} ry={70} fill={THEME.amber} opacity={0.85} />
      <ellipse cx={960} cy={1020} rx={620} ry={50} fill="none" stroke="#fff" strokeWidth={6} opacity={0.5} />
      {/* plant (portrait: in the foreground instead, see RuangFront) */}
      {v ? null : <Plant />}
    </Full>
  );
};

// Sofa back + cushions, behind the character but sharp (same depth as the character).
// Portrait (v) = a narrower sofa that fits the 770-wide camera.
export const RuangSofaBack: React.FC<V> = ({ v }) => {
  const [l, r] = v ? [600, 1050] : [560, 1110]; // cushion x
  return (
    <Full v={v}>
      <rect x={v ? 590 : 500} y={430} width={v ? 740 : 920} height={420} rx={70} fill="#127E70" />
      <rect x={l} y={470} width={250} height={190} rx={40} fill={THEME.amber} transform={`rotate(-6 ${l + 125} 565)`} />
      <rect x={r} y={470} width={250} height={190} rx={40} fill={THEME.pink} transform={`rotate(6 ${r + 125} 565)`} />
    </Full>
  );
};

// Sofa seat and arms, in front of the character.
export const RuangFront: React.FC<V> = ({ v }) => {
  const [al, ar] = v ? [560, 1210] : [440, 1330]; // arm x
  const [sx, sw] = v ? [600, 720] : [540, 840]; // seat
  return (
    <Full v={v}>
      <ellipse cx={960} cy={948} rx={v ? 440 : 540} ry={20} fill="#000" opacity={0.28} />
      <rect x={sx} y={800} width={sw} height={130} rx={30} fill={THEME.teal} />
      <rect x={sx} y={800} width={sw} height={16} rx={8} fill="#fff" opacity={0.18} />
      {/* knees resting on the seat (Chibi lap) cast a soft shadow on its front edge */}
      <ellipse cx={960} cy={808} rx={150} ry={12} fill="#000" opacity={0.22} />
      <rect x={al} y={640} width={150} height={290} rx={60} fill={THEME.teal} />
      <rect x={ar} y={640} width={150} height={290} rx={60} fill={THEME.teal} />
      <rect x={al} y={640} width={150} height={40} rx={20} fill="#fff" opacity={0.15} />
      <rect x={ar} y={640} width={150} height={40} rx={20} fill="#fff" opacity={0.15} />
      {[al + 120, ar + 10].map((x) => <rect key={x} x={x} y={926} width={22} height={24} rx={6} fill="#20243F" />)}
      {/* portrait: plant in the bottom-left foreground, standing on the floor in front of the sofa */}
      {v ? <g transform="translate(310 290)"><Plant /></g> : null}
    </Full>
  );
};
