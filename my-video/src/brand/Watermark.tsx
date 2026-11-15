import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { THEME } from "../explainer/kit";

// Channel mark for every video: small logo + handle in the top-left corner, plus a faint handle that
// hops between spots every few seconds (harder to crop or blur out than a fixed corner mark).
const SPOTS = [[140, 720], [560, 1010], [180, 1160], [600, 520]];
const HOP = 180; // frames per spot

export const Watermark: React.FC<{ corner?: number; ghost?: number }> = ({ corner = 0.75, ghost = 0.13 }) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / HOP);
  const t = f % HOP;
  const [x, y] = SPOTS[k % SPOTS.length];
  const fade = interpolate(t, [0, 20, HOP - 20, HOP], [0, 1, 1, 0]);
  return (
    <>
      <div style={{ position: "absolute", left: 36, top: 40, display: "flex", alignItems: "center", gap: 12, opacity: corner }}>
        <Img src={staticFile("brand/yesyouknow-logo.svg")} style={{ width: 64, height: 64, borderRadius: 32 }} />
        <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 32, color: THEME.paper, WebkitTextStroke: `5px ${THEME.navy}`, paintOrder: "stroke fill" }}>@yes.youknow</div>
      </div>
      <div style={{ position: "absolute", left: x, top: y, opacity: ghost * fade, transform: "rotate(-12deg)", fontFamily: THEME.font, fontWeight: 900, fontSize: 46, color: THEME.paper, letterSpacing: 2, whiteSpace: "nowrap", pointerEvents: "none" }}>
        @yes.youknow
      </div>
    </>
  );
};
