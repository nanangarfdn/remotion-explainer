---
name: naskah-voicestudio
description: Write Indonesian explainer narration scripts (naskah) in the casual edukasi style of the REFERENCE videos, then voice them with the local VoiceStudio app and sync them to Remotion scenes. Use when the user wants a naskah, script, voice over, narasi, or "suara" for a video, or wants to turn a topic into a narrated explainer. Pairs with explainer-2d (visuals) and voicestudio (raw API).
---

# Naskah + VoiceStudio

## 1. Style (measured from REFERENCE/ transcripts, Nov 2026)

- **Pace**: 132–135 words/minute, about 2.2 words/s. A 4-minute video is about 500 words, 5 minutes about 650.
- **Register**: casual Jakarta, "kita" with the viewer: *ngopi, gimana, bikin, nggak, ngeliat, simpelnya, gilanya*. No formal *Anda*.
- **Line length**: 6–14 words per line. One line per scene, so a scene runs 3–6 s.
- **Signposts** open each beat: *Oke, … / Nah, … / Tapi … / Simpelnya, … / Uniknya, … / Kabar sedihnya, … / Jadi, ya, …*

### Beat structure (both references follow it)

| # | Beat | Share | Pattern from refs |
|---|---|---|---|
| 1 | Hook | 0–8% | Everyday moment, repeated in threes ("Ngantuk bangun tidur, ngopi jawabannya. Ngerjain tugas, ngopi jawabannya.") or escalation ("bukan jam, bukan seminggu, tapi selamanya") |
| 2 | Big question | short | "Tapi apa jadinya kalau…?" / "Kenapa sampai sekarang…?" followed by a **5–8 s pause** for the title card |
| 3 | How it works | 15–20% | "Oke, kita harus tahu dulu gimana…". One metaphor ("kafein nipu otak, pura-pura jadi zat capek") |
| 4 | Escalate | 15% | "Oke, tapi gimana kalau kita terus, terus, dan terus…?" plus a real case or story |
| 5 | Twist | 15% | "Uniknya… / Tapi anehnya…": a surprising fact that flips the view |
| 6 | Stakes / local angle | 15–20% | "Kalau negara kita gimana?": data, climate, economy, people affected |
| 7 | Fun fact | 5–10% | History or culture tidbit |
| 8 | Close | 5% | Reflective call to action plus a callback joke to the hook. Use your **own** signature sign-off, not the channel's |

- **Big numbers get a relatable comparison**: "600 juta orang, setara dua kali penduduk Indonesia".
- **Facts need a source**: every "ada penelitian yang nunjukin…" line gets a `source` field with a real URL. Never invent numbers or studies. If unsure, ask the user or search.
- Sponsor segment (if any): in the last 60–90 s, after the close of the main story.

## 2. Write for TTS

- Numbers as words: "empat atau lima gelas", "dua ribu triliun rupiah". Never "4-5", "2rb T", "2x".
- Expand acronyms the way they are spoken: "Sutet" is fine, but write "We-En-I" or "warga negara Indonesia" instead of "WNI".
- Commas = short breath. Put a longer pause in `pad` (seconds), not in "…".
- Read the line aloud in your head. If it has two ideas, split it into two scenes.
- Never START a line with "Kenapa" (OmniVoice made near-silent audio 3/3 times). Use a lead-in: "Terus, kenapa sih…".
- No English words in narration ("deadline" was heard as "lain"). Keep English only for on-screen labels.

## 3. Naskah file

`my-video/naskah/<video-id>.json`:

```json
{
  "id": "kafein",
  "voice": "<profile id from GET /v1/audio/voices>",
  "language": "id",
  "speed": 1.0,
  "padSeconds": 0.6,
  "scenes": [
    { "id": "01-hook", "text": "Ngantuk bangun tidur, ngopi jawabannya.", "shot": "tokoh menguap di kasur, jam weker" },
    { "id": "02-tanya", "text": "Tapi apa jadinya kalau kita kebanyakan kafein?", "shot": "TitleCard merah", "pad": 2.5 },
    { "id": "05-data", "text": "Ada penelitian yang nunjukin batas amannya di bawah empat gelas sehari.", "shot": "info card + LabelPill AMAN", "source": "https://..." }
  ]
}
```

Per-scene overrides: `voice`, `speed`, `instruct`, `pad`. Keep `padSeconds` ≥ transition length (16 f = 0.53 s), or voices overlap during transitions.

## 4. Voice it (VoiceStudio)

1. Check the app is up: `curl -s localhost:3900/health`. If it is down, launch `~/Applications/VoiceStudio/VoiceStudio-0.5.7-linux-x64.AppImage`. First run needs setup and a model download in the app UI; ask the user before downloading.
2. Pick a voice: `curl -s localhost:3900/v1/audio/voices`. Use a saved profile id, never a guessed one. A designed voice can come from `instruct`, e.g. `"male, young adult, energetic"`. Cloning needs the speaker's consent.
3. Generate a single line first and listen to it: `node scripts/voiceover.mjs naskah/<id>.json --only 01-hook`
4. Generate the rest (only lines whose text/voice/seed changed are regenerated, via `.wav.sha1`): `node scripts/voiceover.mjs naskah/<id>.json` (skips existing WAVs; `--force` regenerates all of them; `--only <scene>` redoes one line).
   Writes `public/voiceover/<id>/<scene>.wav` and `timeline.json`.
5. CPU only (no NVIDIA here): generation is several times slower than realtime-on-GPU. Do one line before batching.

API fields accepted by `/v1/audio/speech` (backend `openai_compat.py`): `model, input, voice, language, speed, instruct, instructions, duration, seed, response_format`.

## 4b. Voice it (ElevenLabs, preferred since Nov 2026; held for 2 videos)

1. Give the user the full naskah as one text: one line per paragraph, blank lines between them, a few tags (`[curious]`, `[whispers]`, `[playful]`). Settings: Eleven v4, "Serena - Heartfelt Indonesian", stability 50, similarity 75. Generate once. The free plan is non-commercial.
2. The user drops the MP3 into `audio/` → copy it to `public/voiceover/<id>/full.mp3`.
3. `<venv>/python -I scripts/words.py full.mp3 words.json` (faster-whisper small; venv in the scratchpad `wenv/`, or `deepdml/faster-whisper-large-v3-turbo-ct2` as the 3rd argument for a second opinion).
4. `python3 scripts/align.py naskah/<id>.json full.mp3 words.json` → `timeline.json` (scene start/end at mid-silences, captions in the naskah spelling).
5. Composition: one `<Audio>` for the whole take, scenes from `timeline.scenes`, beats via word lookups (see `src/sadap/Sadap.tsx` `W()`), `<Captions caps={timeline.captions} />`.
6. Words Whisper mishears every time (both models) are the first thing the user should check by ear.
- Hooks are everyday moments, never news pegs ("lagi rame…"); the content must stay timeless.

## 5. Sync to Remotion

```tsx
import timeline from "../../public/voiceover/kafein/timeline.json";
import { NarratedSeries, narratedDuration } from "../explainer/NarratedSeries";
import { colorWipe, THEME } from "../explainer/kit";

// <Composition id="Kafein" component={Kafein} durationInFrames={narratedDuration(timeline)} fps={30} width={1920} height={1080} />
export const Kafein = () => (
  <NarratedSeries
    timeline={timeline}
    scenes={{ "01-hook": Hook, "02-tanya": Tanya }}   // scenes without art fall back to a draft card
    fallback={Draft}
    transitions={{ "02-tanya": colorWipe(THEME.yellow) }} // keyed by the scene it enters
  />
);
```

A `Draft` fallback that prints `shot` + `text` gives an animatic with real voice timing before any art exists. Build the art scene by scene after that.

## 6. Verify

- `node scripts/check-voice.mjs naskah/<id>.json`: Whisper round-trip per line, must be ≥ 0.9 (or a spelling-only miss). Regenerate failing lines with another seed or reworded text. A good take is precious: seeds are not reproducible.

- `ffprobe` each WAV, and play at least one line. An error body saved as `.wav` fails `ffprobe`.
- Render at `--scale=0.25`, check the audio stream exists and the duration equals `narratedDuration`.
- `silencedetect` on the render: gaps only where `pad` put them.
- Report what was not heard or checked.
- Append what you learned (voice choice, speed, mispronounced words and their fix, real generation time per line) to `../explainer-2d/LESSONS.md` under [naskah] / [tts].
