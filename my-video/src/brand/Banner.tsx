import { AbsoluteFill } from "remotion";
import { THEME } from "../explainer/kit";

// YouTube banner 2048x1152; everything that must read sits in the 1235x338 safe area (y 407–745)
export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 800 800">
    <circle cx="400" cy="400" r="400" fill="#2E2A6B" />
    <circle cx="400" cy="400" r="330" fill="#3A3585" />
    <path d="M220 230 h360 a70 70 0 0 1 70 70 v170 a70 70 0 0 1 -70 70 h-170 l-95 85 v-85 h-95 a70 70 0 0 1 -70 -70 v-170 a70 70 0 0 1 70 -70z" fill="#F7931E" />
    <path d="M290 385 l75 72 l150 -150" fill="none" stroke="#fff" strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M640 170 l14 38 l38 14 l-38 14 l-14 38 l-14 -38 l-38 -14 l38 -14z" fill="#2EC4B6" />
  </svg>
);

const Spark: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={s} height={s} viewBox="0 0 40 40">
    <path d="M20 0 l5 15 l15 5 l-15 5 l-5 15 l-5 -15 l-15 -5 l15 -5z" fill={c} />
  </svg>
);

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: "#2E2A6B", fontFamily: THEME.font, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -200, right: -200, top: 380, height: 392, background: "#3A3585", transform: "rotate(-2deg)" }} />
    <Spark x={330} y={300} s={46} c={THEME.teal} />
    <Spark x={1700} y={760} s={38} c={THEME.amber} />
    <Spark x={1560} y={330} s={26} c={THEME.pink} />
    <div style={{ position: "absolute", left: 406, top: 407, width: 1235, height: 338, display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
      <LogoMark size={230} />
      <div style={{ color: "#fff" }}>
        <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
          yes<span style={{ color: "#F7931E" }}>you</span>know
        </div>
        <div style={{ fontSize: 50, fontWeight: 800, marginTop: 16, opacity: 0.92, whiteSpace: "nowrap" }}>Hal-hal yang belum tentu kamu tahu</div>
      </div>
    </div>
  </AbsoluteFill>
);
