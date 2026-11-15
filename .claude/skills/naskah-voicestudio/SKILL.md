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

### Hook & close rules (50 top Kok Bisa? videos, `riset/kokbisa/POLA-HOOK-CLOSING.md`)

- Pick ONE hook type: everyday moment (most common, 18/50), shocking number + local comparison (9), "what school/films got wrong" (7), cold question with 2–3 escalating follow-ups (5), one-person story (3), analogy (rest).
- Say the title question by **10–27 s (median 19 s)**, after a "Tapi …" pivot (28/50). Start answering right after; no channel intro.
- Close in 45–75 s: one-line recap ("Ya, itu dia …") → what it means for us / Indonesia → moral or zoom-out → calm practical advice (no fear-mongering) → open question for the comments → our own sign-off.

- **Big numbers get a relatable comparison**: "600 juta orang, setara dua kali penduduk Indonesia".
- **Facts need a source**: every "ada penelitian yang nunjukin…" line gets a `source` field with a real URL. Never invent numbers or studies. If unsure, ask the user or search.
- Sponsor segment (if any): in the last 60–90 s, after the close of the main story.

### Shorts (vertical) — replaces the beat table above

Why: Shorts are ranked on viewed-vs-swiped (first 1–2 s) and % watched; replays count as views. Every short so far got a ~1.2–2k test push from the Shorts feed; only stayed ≥ ~65 % kept it going past the first hours.

**Hook types ranked by our data** (Studio 15 Nov 14.34; stayed / avg watched / likes / subs):

| Rank | Hook type | Video | Result |
|---|---|---|---|
| 1 | **Test with escalating stakes** ("Kita uji: jatuh dari lemari… sampai lantai 5!") | Kucing 1:02 | 66.4 % / 50 % / 1.1 % / +4, still 59 views/h at 21 h (only one still pushed) |
| 2 | **Relatable "you" scenario** ("Hape kamu hilang 30 hari, otakmu kenapa?") | Hape 1:54 | 65.5 % / 36 % / 1.3 % / **+6** (most subs) |
| 3 | Hypothetical world ("Kalau semua orang nggak bisa bohong…") | Jujur 1:01 | 58.4 % / 42 % / 1.2 % / +2 |
| 4 | Fact statement ("Di mata lalat, tangan lo literally slow motion") | Lalat 1:01 | 57.9 % / 34 % / 0.6 % / +1, push ended ~4 h |
| 5 | News / politics ("Mundur dari wapres, dapet 20 juta sebulan") | Pensiun 0:54 | **48.4 %** / 23 % / **1.8 %** / 0, most swiped but most likes + 3 comments |

Reading: what makes people *stay* is an unanswered "what happens?" they can picture (a test, their own phone); a fact said up front answers itself, and a politics word in line 1 makes half the feed swipe. What makes people *comment* is a one-word A/B verdict (Pensiun). Length alone is not it: Pensiun was the shortest and the worst, Kucing at 62 s the best. Default = rank 1–2 hook + Pensiun-style A/B ask.

- **Length 35–50 s** (≈ 80–110 words at 2.2 words/s). Over 60 s only if every beat earns it.
- **Line 1 (≤ 2 s) = the question or promise**, no setup: "Gimana kalau mulai besok semua orang nggak bisa bohong?". No greeting, no channel name. Never a fact that already answers itself (Lalat); prefer a test, a dare or the viewer's own life (Kucing, Hape).
- **Escalate in steps** the viewer can rank: lemari → lantai 2 → lantai 5; 1 hari → 1 minggu → 30 hari. Name the last step in line 1 so they wait for it.
- **Comment question in the first 5 s and again in the last line.** It must be answerable in one word or a pick: A/B, a guess, a number, "kamu tim mana". Never only "tulis di komentar" without a prompt.
- **Open loop**: tease the payoff early ("yang terakhir paling bikin kaget"), pay it off in the last 20 %.
- **Opinion beat**: one claim people will disagree with or want to add to (a ranking, a "menurutku…"). Pure facts get watched, not discussed.
- **Loop line**: the last line flows grammatically into line 1 (last: "…dan itu baru hari pertama, karena…" → first: "Gimana kalau…"), so a replay feels like one sentence. No sign-off after it.
- One beat per 2–3 s of narration; cut any line that only restates.

### Register "Jaksel" (option, user ask 14 Nov 2026)

- Base: casual Jakarta, **gue/lo**, particles carry the tone: *sih, tuh, kok, dong, deh, kan, gitu, kayak, banget, se-…itu* ("se-niat itu").
- English goes where Jaksel speakers put it, never as a full sentence:
  - openers/closers: *literally, basically, honestly, jujurly, actually, even, you know, make sense kan?, no debat*;
  - the "wrong" connector *which is* (used as "jadi/yang bikin");
  - Indonesian affixes on English verbs: *nge-scan, nge-plan, nge-dodge, di-skip, di-slow, ke-trigger, nge-lag*;
  - nouns/labels: *plot twist, skill issue, the real MVP, red flag, worth it, effort, vibes, struggle, random banget, valid*.
- Max 1–2 English chunks per sentence; a nge-/di- verb counts as Indonesian. Facts and numbers stay in Indonesian, so the info still reads as trustworthy.
- Rhythm: short punchy fragment → longer explain line → tag question ("…kan?", "…sih"). One self-aware joke per video, not per line.
- Avoid: profanity (anjir/anjay), dated or cringe slang (*slay* every line, *gaskeun*, *mantul*), Gen-Z text slang that only works written (*ngl, fr, lowkey*).
- TTS: test one Jaksel line before the full take (English words in an Indonesian voice can come out with Indonesian phonetics, which is fine, or get swallowed). Whisper-check that each English word is heard.

### Sound human, not AI (adapted from blader/humanizer's patterns)

Cut on sight: "Pernahkah kamu…", "Tahukah kamu…", "Yuk simak", "Mari kita bahas", "Di era digital ini", "tersebut", "merupakan", "sangatlah", "tentu saja", "tidak hanya… tetapi juga", rhetorical triples in every beat, an em-dash in every line, an upbeat moral at the end.
Do: one concrete everyday detail per beat (a brand-free object, a time, a place), uneven sentence lengths, a fragment now and then ("Tiga kali. Gagal semua."), a small opinion ("menurut gue sih…"), and read it aloud: if a 20-year-old would not say it to a friend, rewrite.

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

0. **User approves first** (rule 15 Nov 2026): send 2–3 hook options + the full naskah, wait for an explicit OK, then generate. No TTS call before that, not even a hook test. Label each option with its hook type and rank from the Shorts table, so the pick is made on data.

1. Give the user the full naskah as one text: one line per paragraph, blank lines between them, a few tags (`[curious]`, `[whispers]`, `[playful]`). Settings: Eleven v4, "Serena - Heartfelt Indonesian", stability 50, similarity 75. Generate once. The free plan is non-commercial.
2. The user drops the MP3 into `audio/` → copy it to `public/voiceover/<id>/full.mp3`.
3. `<venv>/python -I scripts/words.py full.mp3 words.json` (faster-whisper small; venv in the scratchpad `wenv/`, or `deepdml/faster-whisper-large-v3-turbo-ct2` as the 3rd argument for a second opinion).
4. `python3 scripts/align.py naskah/<id>.json full.mp3 words.json` → `timeline.json` (scene start/end at mid-silences, captions in the naskah spelling).
5. Composition: one `<Audio>` for the whole take, scenes from `timeline.scenes`, beats via word lookups (see `src/sadap/Sadap.tsx` `W()`), `<Captions caps={timeline.captions} />`.
6. Words Whisper mishears every time (both models) are the first thing the user should check by ear.
- Hooks are everyday moments by default. News / politics scored worst on retention (Pensiun 48 % stayed): use it only when the user picks it, and open on the viewer's side ("Gaji lo vs pensiun mantan pejabat"), never with the office or name in line 1. News pegs are allowed (user, 15 Nov 2026) only as a timeless fact angle on the news: the rule, number or history behind it, never the gossip. Check every claim in 2+ outlets or the law text, keep it neutral (aturan, not the person), no real faces (symbols: empty chair, book, stamp), sources in the description.
- Take too slow for 35–50 s? `python3 scripts/speed.py <id> 1.12–1.15` (atempo on full.mp3 + rescaled timeline; originals kept as *-orig).

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
