import React from "react";
import { AbsoluteFill } from "remotion";
import { Chibi } from "../explainer/Chibi";
import { Hero } from "../explainer/Hero";
import { THEME } from "../explainer/kit";

// Still for picking the new character look (not part of any video).
const Label: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 40, color: THEME.ink, textAlign: "center", marginTop: 8 }}>{t}</div>
);
const Card: React.FC<{ t: string; children: React.ReactNode }> = ({ t, children }) => (
  <div style={{ background: THEME.paper, borderRadius: 36, padding: 18, width: 470, height: 620, boxShadow: "0 8px 0 rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
    {children}
    <Label t={t} />
  </div>
);
const EXPR: [string, Partial<React.ComponentProps<typeof Hero>>][] = [
  ["senang", { mouth: "grin" }],
  ["kaget", { mouth: "o", eyesOpen: 1.15, browUp: 1 }],
  ["cemas", { mouth: "worried", worried: true }],
  ["kesal", { mouth: "flat", angry: true, look: { x: -14, y: 0 } }],
  ["ngantuk", { mouth: "flat", eyesOpen: 0.45 }],
  ["licik", { mouth: "smirk", look: { x: 18, y: -4 }, eyesOpen: 0.75 }],
];
export const CharacterLab: React.FC = () => (
  <AbsoluteFill style={{ background: "#EEF0FA", padding: 50, gap: 34, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ display: "flex", gap: 40 }}>
      <Card t="LAMA"><Chibi width={400} mouth="smile" /></Card>
      <Card t="BARU A · hoodie"><Hero width={400} mouth="grin" shirt={THEME.orange} shirtShade={THEME.orangeDark} /></Card>
    </div>
    <div style={{ display: "flex", gap: 40 }}>
      <Card t="BARU B · rambut bob"><Hero width={400} hairStyle="bob" outfit="tee" lashes hair="#3B2A22" shirt={THEME.primary} shirtShade={THEME.primaryDark} mouth="smile" /></Card>
      <Card t="BARU C · keriting + kacamata"><Hero width={400} hairStyle="fluffy" glasses shirt={THEME.teal} shirtShade="#109583" mouth="open" hair="#2E2420" skin="#E9B98F" skinShade="#D49C70" /></Card>
    </div>
    <div style={{ display: "flex", gap: 14, background: THEME.paper, borderRadius: 36, padding: "20px 16px" }}>
      {EXPR.map(([t, p]) => (
        <div key={t} style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Hero width={150} shirt={THEME.orange} shirtShade={THEME.orangeDark} {...p} />
          <div style={{ fontFamily: THEME.font, fontWeight: 900, fontSize: 28, color: THEME.ink }}>{t}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
