#!/usr/bin/env node
// Naskah JSON -> ElevenLabs TTS (with timestamps) per scene -> public/voiceover/<id>/{full.mp3,timeline.json,words.json}
// Usage: npm run tts -- naskah/<id>.json [--force]
// Env (.env): ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID (or "elevenVoice" in the naskah), ELEVENLABS_MODEL (optional)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

if (existsSync(".env")) process.loadEnvFile(".env");
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
// --estimate: no API call; silent audio + evenly spread word times (14.3 chars/s, measured on Hape2m) to lay out animation before the real take
const estimate = args.includes("--estimate");
if (!file) {
  console.error("usage: npm run tts -- naskah/<id>.json [--force]");
  process.exit(2);
}

const KEY = process.env.ELEVENLABS_API_KEY;
const naskah = JSON.parse(readFileSync(file, "utf8"));
const { id, fps = 30, padSeconds = 0.6, stability = 0.5, similarity = 0.75, style = 0.2, speed = 1 } = naskah;
const voice = naskah.elevenVoice ?? process.env.ELEVENLABS_VOICE_ID;
const model = naskah.elevenModel ?? process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
if (!estimate && (!KEY || KEY === "isi-api-key-di-sini")) {
  console.error("ELEVENLABS_API_KEY belum diisi di my-video/.env");
  process.exit(2);
}
if (!id || !voice || !Array.isArray(naskah.scenes)) {
  console.error("naskah needs: id, scenes[], and a voice (elevenVoice or ELEVENLABS_VOICE_ID)");
  process.exit(2);
}

const outDir = path.join("public", "voiceover", id);
const partDir = path.join(outDir, "eleven");
mkdirSync(partDir, { recursive: true });

const scenes = naskah.scenes;
const timeline = [];
const words = [];
const concat = [];
let t = 0;
for (const [i, scene] of scenes.entries()) {
  const mp3 = path.join(partDir, `${scene.id}.mp3`);
  const alignFile = path.join(partDir, `${scene.id}.json`);
  const body = JSON.stringify({
    text: scene.text,
    model_id: model,
    voice_settings: { stability, similarity_boost: similarity, style, speed: scene.speed ?? speed },
    // neighbours keep intonation continuous across separately generated lines
    previous_text: scenes[i - 1]?.text,
    next_text: scenes[i + 1]?.text,
  });
  const hash = createHash("sha1").update(voice + body).digest("hex");
  const fresh = existsSync(alignFile) && JSON.parse(readFileSync(alignFile, "utf8")).hash === hash;
  if (estimate) {
    const secs = scene.text.length / 14.3;
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", secs.toFixed(3), "-b:a", "64k", mp3]);
    const chars = [...scene.text];
    const st = chars.map((_, k) => (k / chars.length) * secs);
    writeFileSync(alignFile, JSON.stringify({ hash: "estimate", alignment: { characters: chars, character_start_times_seconds: st, character_end_times_seconds: st.map((x) => x + secs / chars.length) } }));
  } else if (force || !fresh) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`,
      { method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" }, body },
    );
    if (!res.ok) {
      console.error(`✗ ${scene.id}: HTTP ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    const j = await res.json();
    writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
    writeFileSync(alignFile, JSON.stringify({ hash, alignment: j.alignment }));
  }
  const { alignment: a } = JSON.parse(readFileSync(alignFile, "utf8"));
  const seconds = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString().trim(),
  );

  // characters -> words, shifted to global time
  let cur = null;
  a.characters.forEach((ch, k) => {
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      return;
    }
    const s = +(t + a.character_start_times_seconds[k]).toFixed(3);
    const e = +(t + a.character_end_times_seconds[k]).toFixed(3);
    cur = cur ? { ...cur, w: cur.w + ch, e } : { w: ch, s, e, scene: i };
  });
  if (cur) words.push(cur);

  const pad = scene.pad ?? padSeconds;
  timeline.push({ id: scene.id, text: scene.text, start: +t.toFixed(3), end: +(t + seconds + pad).toFixed(3) });
  concat.push({ mp3, pad });
  t += seconds + pad;
  console.log(`${force || !fresh ? "✓" : "·"} ${scene.id.padEnd(16)} ${seconds.toFixed(2)}s`);
}

// full.mp3 = every line followed by its pad of silence
const inputs = concat.flatMap(({ mp3 }) => ["-i", mp3]);
const filter =
  concat.map(({ pad }, k) => `[${k}:a]aresample=44100,apad=pad_dur=${pad}[a${k}]`).join(";") +
  ";" +
  concat.map((_, k) => `[a${k}]`).join("") +
  `concat=n=${concat.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100[out]`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-b:a", "192k", path.join(outDir, "full.mp3")]);

writeFileSync(
  path.join(outDir, "timeline.json"),
  JSON.stringify({ id, fps, duration: +t.toFixed(3), audio: `voiceover/${id}/full.mp3`, estimate, scenes: timeline, captions: words }, null, 1),
);
writeFileSync(path.join(outDir, "words.json"), JSON.stringify(words));
console.log(`→ ${outDir}/full.mp3  ${t.toFixed(1)}s, ${words.length} words`);
