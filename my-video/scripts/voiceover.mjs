#!/usr/bin/env node
// Naskah JSON -> VoiceStudio TTS per scene -> public/voiceover/<id>/<scene>.wav + timeline JSON.
// Usage: node scripts/voiceover.mjs naskah/<id>.json [--only scene-id] [--force]
// Env:   VOICESTUDIO_URL (default http://localhost:3900), VOICESTUDIO_API_KEY (optional)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const force = args.includes("--force");
if (!file) {
  console.error("usage: node scripts/voiceover.mjs naskah/<id>.json [--only scene] [--force]");
  process.exit(2);
}

const BASE = process.env.VOICESTUDIO_URL ?? "http://localhost:3900";
const naskah = JSON.parse(readFileSync(file, "utf8"));
// padSeconds: silence after each line; keep it >= transition length (16f = 0.53s) so voices never overlap.
// seed: keep the same designed voice across all lines (voice design is random without it).
const { id, fps = 30, voice, language = "id", speed = 1, instruct, seed = 42, padSeconds = 0.6 } = naskah;
if (!id || !voice || !Array.isArray(naskah.scenes)) {
  console.error("naskah needs: id, voice, scenes[]");
  process.exit(2);
}

const outDir = path.join("public", "voiceover", id);
mkdirSync(outDir, { recursive: true });

const probe = (f) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f])
      .toString()
      .trim(),
  );

const headers = { "Content-Type": "application/json" };
if (process.env.VOICESTUDIO_API_KEY) headers.Authorization = `Bearer ${process.env.VOICESTUDIO_API_KEY}`;

const timeline = [];
let from = 0;
for (const scene of naskah.scenes) {
  const wav = path.join(outDir, `${scene.id}.wav`);
  const body = JSON.stringify({
    model: "tts-1",
    voice: scene.voice ?? voice,
    input: scene.text,
    language,
    speed: scene.speed ?? speed,
    ...((scene.instruct ?? instruct) ? { instruct: scene.instruct ?? instruct } : {}),
    seed: scene.seed ?? seed,
    response_format: "wav",
  });
  // Regenerate when the request changed (text, voice, seed…), not only when the file is missing.
  const hash = createHash("sha1").update(body).digest("hex");
  const hashFile = `${wav}.sha1`;
  const fresh = existsSync(wav) && existsSync(hashFile) && readFileSync(hashFile, "utf8") === hash;
  const skip = (only && scene.id !== only) || (!force && !only && fresh);
  if (!skip) {
    const res = await fetch(`${BASE}/v1/audio/speech`, { method: "POST", headers, body });
    if (!res.ok) {
      console.error(`✗ ${scene.id}: HTTP ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    writeFileSync(wav, Buffer.from(await res.arrayBuffer()));
    writeFileSync(hashFile, hash);
  }
  if (!existsSync(wav)) {
    console.error(`✗ ${scene.id}: ${wav} missing (run without --only first)`);
    process.exit(1);
  }
  const seconds = probe(wav); // throws if the "wav" is actually an error body
  const durationInFrames = Math.ceil((seconds + (scene.pad ?? padSeconds)) * fps);
  timeline.push({ ...scene, audio: `voiceover/${id}/${scene.id}.wav`, seconds, from, durationInFrames });
  from += durationInFrames;
  console.log(`${skip ? "·" : "✓"} ${scene.id.padEnd(16)} ${seconds.toFixed(2)}s  ${durationInFrames}f`);
}

const out = path.join(outDir, "timeline.json");
writeFileSync(out, JSON.stringify({ id, fps, durationInFrames: from, scenes: timeline }, null, 2));
console.log(`→ ${out}  total ${(from / fps).toFixed(1)}s (${from}f, before transition overlap)`);
