import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "./kit";

// Word captions for vertical cuts (many viewers watch muted). Times come from scripts/align.py
// (global seconds, naskah spelling). A chunk = up to 3 words / 16 chars, broken at punctuation.
export type Cap = { w: string; s: number; e: number; scene: number };

const chunkCaps = (caps: Cap[]) => {
  const out: Cap[][] = [];
  let cur: Cap[] = [];
  for (const c of caps) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + c.w.length;
    const prev = cur[cur.length - 1];
    if (cur.length && (cur.length >= 3 || len > 16 || /[.,?!:]$/.test(prev.w) || prev.scene !== c.scene)) {
      out.push(cur);
      cur = [];
    }
    cur.push(c);
  }
  if (cur.length) out.push(cur);
  return out;
};

export const Captions: React.FC<{ caps: Cap[]; hideScenes?: number[]; top?: number }> = ({ caps, hideScenes = [], top = 1300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = React.useMemo(() => chunkCaps(caps), [caps]);
  const t = frame / fps;
  const k = chunks.findIndex((ch, i) => t >= ch[0].s - 0.05 && t < (chunks[i + 1]?.[0].s ?? ch[ch.length - 1].e + 0.6) - 0.05);
  if (k < 0) return null;
  const ch = chunks[k];
  if (hideScenes.includes(ch[0].scene)) return null;
  // Last chunk of a line fades out once its words are spoken (no stale text over the next shot's pause).
  if (t > ch[ch.length - 1].e + 0.5) return null;
  const pop = spring({ frame: frame - Math.round((ch[0].s - 0.05) * fps), fps, config: { damping: 14, stiffness: 260 } });
  return (
    <div style={{
      position: "absolute", left: 60, width: 900, top, display: "flex", flexWrap: "wrap", justifyContent: "center",
      gap: "0 30px", transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: "50% 50%",
    }}>
      {ch.map((c) => {
        const on = t >= c.s - 0.03;
        const hit = spring({ frame: frame - Math.round(c.s * fps), fps, config: { damping: 12, stiffness: 300 } });
        const active = c === [...ch].reverse().find((x) => t >= x.s - 0.03); // the word being spoken
        return (
          <span key={c.s} style={{
            fontFamily: THEME.font, fontWeight: 900, fontSize: 78, lineHeight: 1.15,
            color: active ? THEME.amber : THEME.paper, opacity: on ? 1 : 0.55,
            WebkitTextStroke: `14px ${THEME.navy}`, paintOrder: "stroke fill",
            textShadow: "0 8px 0 rgba(0,0,0,0.25)", display: "inline-block",
            transform: `translateY(${active ? -6 * Math.min(1, hit) : 0}px) scale(${active ? 1 + 0.08 * Math.min(1, hit) : 1})`,
          }}>
            {c.w.replace(/[,.:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
