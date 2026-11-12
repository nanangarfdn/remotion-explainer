#!/usr/bin/env node
// Round-trip check: transcribe each generated line with VoiceStudio's Whisper and compare to the naskah.
// Usage: node scripts/check-voice.mjs naskah/<id>.json   (exit 1 if any line scores below --min, default 0.9)
import { readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const min = args.includes("--min") ? Number(args[args.indexOf("--min") + 1]) : 0.9;
const BASE = process.env.VOICESTUDIO_URL ?? "http://localhost:3900";
const naskah = JSON.parse(readFileSync(file, "utf8"));

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
// Word-level similarity: 1 - editDistance / max(len).
const score = (a, b) => {
  const x = norm(a), y = norm(b);
  const d = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) d[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - d[x.length][y.length] / Math.max(x.length, y.length, 1);
};

let bad = 0;
for (const scene of naskah.scenes) {
  const wav = path.join("public", "voiceover", naskah.id, `${scene.id}.wav`);
  const form = new FormData();
  form.append("file", new Blob([readFileSync(wav)], { type: "audio/wav" }), `${scene.id}.wav`);
  form.append("model", "whisper-1");
  form.append("language", naskah.language ?? "id");
  form.append("response_format", "json");
  const res = await fetch(`${BASE}/v1/audio/transcriptions`, { method: "POST", body: form });
  if (!res.ok) {
    console.error(`✗ ${scene.id}: HTTP ${res.status} ${await res.text()}`);
    process.exit(2);
  }
  const heard = (await res.json()).text.trim();
  const s = score(scene.text, heard);
  if (s < min) bad++;
  console.log(`${s >= min ? "✓" : "✗"} ${scene.id.padEnd(14)} ${s.toFixed(2)}  heard: ${heard}`);
}
process.exit(bad ? 1 : 0);
