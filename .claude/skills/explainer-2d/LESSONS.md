# Lessons log

Read this before starting a video. After finishing (or after user feedback), append dated lines:
`- YYYY-MM-DD [area] what happened → rule / fix (evidence: file:line, frame, dB, error)`.
Promote a lesson into SKILL.md once it has held for 2+ videos. Delete a lesson that is proven wrong.

Areas: style · character · sets · motion · transition · audio · naskah · tts · render · tooling · user-feedback

## 2026-11-06 — first sample (`Contoh`, 10 s, no voice)

- [user-feedback] Plain shapes were judged too simple → default to layered, detailed sets (decor, lighting, shading) from the first draft.
- [user-feedback] Red main colour looked like the reference channel → own THEME (indigo #4B3FD8 / amber #FFB020). Never reuse the reference palette or branding.
- [user-feedback] When given a ranked list of improvements, the user said "perbaiki semua" → propose ranked, then do all of them in one pass.
- [character] Hair Bezier `C40 40 …` left the head top bald → hair cap control points must go above the head (`C36 -24 366 -34`). Check the head top in a crop.
- [character] "Worried" brows drawn with the inner ends DOWN read as angry → worried = inner ends UP.
- [character] A big screen-glow ellipse over the face looked like fog → keep the glow small at the chin (rx 120 ry 70, opacity ≤ 0.35).
- [character] Idle breathing alone looks dead → each shot needs 1–3 acting beats (glance, nod off, jolt, surprise) driven by `interpolate`.
- [motion] Pop with plain scale looked stiff → squash & stretch from the spring overshoot, plus an auto-exit before the transition.
- [transition] TitleCard words popped while the colour wipe still covered the card → start the words after half the transition (`delay = T/2`).
- [sets] The desk lamp shade overlapped the window → check large props against the wall decor in a full-frame still.
- [sets] An amber label pill with white text has poor contrast → keep pills on dark colours (primary/primaryDark).
- [sets] Blurring a layer that holds the sofa back made it mismatch the sharp sofa front → one object = one depth layer.
- [style] The font fell back to a system sans (Nunito was not installed) → always load fonts via `@remotion/google-fonts`.
- [audio] Silent video felt unfinished → every pop/label/transition gets an SFX, plus a music bed at about 0.2. Verify by onset detection (cues landed on exact frames, +15…+49 dB over the music).
- [render] 10 s at 1080p30 renders in about 21 s on this CPU with parallax + blur. Fine to render full previews.
- [tooling] `pkill -f name` inside a Bash call kills its own shell (exit 144) when `name` is in the command → kill via PID.
- [tooling] faster-whisper on file paths: `TypeError: open() got an unexpected keyword argument 'metadata_errors'` → decode with ffmpeg to float32 and pass the array.
- [tts] VoiceStudio API not yet tested live (setup was installing the "Seimbang" pack). The first real line must be listened to and its ffprobe duration recorded here.
- 2026-11-06 [tts] VoiceStudio API live (cpu, 0.5.7), but `/v1/audio/speech` returned 403 `model_licence_required` until the OmniVoice licence is accepted in the app (Model Catalogue). OmniVoice weights are **CC-BY-NC (non-commercial)** → not for monetised videos. Commercial-friendly engines with Indonesian: Confucius4-TTS (Apache-2.0, clone-only, ~5 GB, CPU ~17× realtime), VoxCPM2 (licence not verified). OpenAI voice names (alloy…) only alias the default engine voice.
- 2026-11-06 [tts] OmniVoice (instruct "male, young adult, moderate pitch") made near-silent audio (−26…−36 dB, empty ASR) for 3/3 lines that START with "Kenapa…". The same question with a lead-in word ("Terus, kenapa sih…", "Sebenarnya, kenapa…") was perfect → never open a line with "Kenapa"; put a lead-in word first.
- 2026-11-06 [tts] English loanword "Deadline" was heard as "Lain" → write narration in Indonesian ("Tugasnya dikumpulin besok"). English words may stay as on-screen labels.
- 2026-11-06 [tts] `seed` is not reproducible across request changes (adding `speed: 1.0` changed a good take into a slurred one) → keep verified takes; voiceover.mjs now stores a request hash (`.wav.sha1`) and only regenerates changed lines.
- 2026-11-06 [tts] Speed on this CPU: first model load + 3 lines = 212 s; warm ≈ 12–17× the audio length (2.4 s line ≈ 28–35 s). Budget ~1 h of generation per 4-min video.
- 2026-11-06 [tts] `node scripts/check-voice.mjs naskah/<id>.json` = Whisper round-trip score per line (exit 1 below 0.9). Spelling-only misses ("doian"/"doyan") score ~0.89; read the "heard" text before regenerating.
- 2026-11-06 [audio] Scene length = max(base, voiceStart + voiceFrames + T). Voice starts at T/2 after an incoming transition. Music at 0.12 under narration. The final mix transcribed perfectly with starts on the planned frames (0/93/177 vs 6/92/176).
- 2026-11-06 [tts] ElevenLabs Eleven v4, "Serena - Heartfelt Indonesian" (stability 50, similarity 75): all 3 lines transcribed word-perfect on the first take, `[sighs]` became an audible "Haa" and it added expressive pauses. Free plan = non-commercial. One take with blank lines between sentences → split at the mid-points of the silences (silencedetect −40 dB, 0.35 s) confirmed by Whisper word times; one pause can be inside a sentence.
- 2026-11-06 [user-feedback] Given a new voice take, the user wants the VIDEO adapted to the audio ("video aja yang disesuaikan"), not two parallel versions → retime scenes and acting beats to the word timestamps.
- 2026-11-06 [motion] Placing beats on Whisper word starts (frame = voiceStart + t·fps) landed within ±1 frame on the final mix ("besok" 56/57, "hadiah" 312/313). Word starts right after a long drawn-out word can be off by ~0.4 s.
- 2026-11-06 [user-feedback] "animasinya yang lebih realistis… jangan screen hp, layarnya di belakang… terapkan juga di yang lain, kasih rules". The phone faced the camera, the clock second hand ran at 180°/s (30× real), the laptop sat beside the character, and the notifs appeared from nowhere → added "Realism rules" to SKILL.md.
- 2026-11-06 [motion] Realism pass on landscape `Contoh`: phone shows its back (camera bump, fingers over the edges, wrist tilt instead of thumb bob); notifs grow on the phone 3 f, then fly an in-out arc whose control point is (targetX, phoneY) → a straight-up arc crossed the face (frame 360), the sideways-then-up arc stays clear. Clock: second hand steps at 30k frames, tick SFX on `TICKS`; measured hand angle constant at f31/36/59, jumps at f30/f60 (evidence: still crops, angle 138.8/139.2/139.0 → 143.6).
- 2026-11-06 [character] Light from the right (scene 3 floor lamp) needs mirrored shading → `Chibi lightFrom="right"`. The head's neck shadow showed over the wall when the head tilted → clipped to the body.
- 2026-11-06 [sets] Laptop in front of the character: put it on the desk top band (y 700–744) AFTER the desk rect, lid ~360×180 centred under the face, with a contact shadow; a large blue overlay over the face read as fog → only a thin glow over the lid's top edge plus the Chibi chin glow.
- 2026-11-06 [render] Portrait cut `ContohVertical`: a zoomed `World` camera over the landscape world (k 1.5 scene 1, 1.4 scene 3) plus `v` set variants reused every scene; landscape stayed pixel-identical over all 416 frames (half-scale PNG sequence diff; a single max-4 diff on frame 1 in the first run did not repeat → render noise). Overlay spots must include the Layer push-in or they drift out of the safe zone. Mug and shelf at the same height read as "mug on the shelf" → keep wall shelves clear of desk props.
- 2026-11-06 [motion] TitleCard words overlapped ("kenapakitasuka", f156–165 both cuts): spring scale overshoot ~1.28 grew each word past the 28 px gap → bounce in translateY only, scale overshoot capped (`pop = min(s,1) + max(0,s-1)·0.15`, kit.tsx:219).
- 2026-11-06 [transition] Title exit finished before the whip → ~8 empty-card frames (f234–242) → `TitleCard exit={false}` when the outgoing transition moves the whole card (whip).
- 2026-11-06 [character] Screen glow as a normal-alpha pale-blue gradient over skin read as grey stubble → `mixBlendMode: "screen"`, low alpha (0.3), only the bottom rim of the face; scene glow overlays also `screen` and ≤ 0.14.
- 2026-11-06 [character] Dot eyes with look.y ≈ 20 still read as "looking at the viewer" → for device use: `pitch` 10 (face slides down), look.y 26–30 and eyesOpen 0.82 (draws a heavy upper-lid stroke). Verified in full-res crops f30/f280/v320.
- 2026-11-06 [sets] Laptop hid the whole body (floating head) → shorter lid (150) + character raised 40 px so shoulders/upper arms show above it; seated on a sofa → `Chibi lap` knees over the seat line + contact shadow.
- 2026-11-06 [style] Off-THEME notif colours (#EC4899/#3B82F6) slipped in → decor accents live in THEME (pink/orange/orangeDark); grep for raw hex before render.
- 2026-11-06 [render] Batch stills: one `bundle()` + many `renderStill()` (node script inside my-video so ESM resolves) = 15 stills in 25 s vs ~10 s each via CLI.

## 2026-11-06 — `Sadap` (1080×1920 only, 60 s, ElevenLabs one take)

- [audio] One continuous take: `scripts/words.py` (Whisper word times) + `scripts/align.py` (naskah words onto Whisper times, line cuts snapped to the mid-silence) → `timeline.json` with scenes + captions. Narration plays as ONE track, and each transition is centred on its cut (scene start = cut − T/2), so nothing waits for the voice. Cuts landed in 0.35–0.6 s silences.
- [motion] Beats via `W(scene, "word", nth)` from the captions (throws if the word is missing) → beats follow a new take automatically.
- [tts] Whisper small AND large-v3-turbo both heard "nguras rekening" as "murah serkening" (ElevenLabs drops the "ng"). Check by ear; if it really sounds wrong, write "menguras".
- [style] Caption words touched each other: a 14 px `WebkitTextStroke` eats the flex gap → gap 30 px. Hide captions on the title card (same words).
- [character] `Chibi pose="call"`: right forearm raised behind the cheek, a side-on phone + hand drawn over the head at the ear. Reads well at k 1.5.
- [sets] A close-up at k 1.7 (head radius ≈ 357 px) left no room for overlays inside the safe zone → k 1.5 with the head centre at y ≈ 760 leaves y 260–445 for a pill and a notif.
- [style] Text inside a close-up phone must be ≥ 28 px (the first pass at 22–30 px was unreadable at phone size); a 76 px balance overflowed a 480 px card → 60 px.
- [tooling] `node scripts/stills.mjs <dir> Comp:f1,f2…` (one bundle): 23 stills in 21 s.
- [motion] Between "tapi" (phone fades out) and "jurnalis" (first avatar), 2.2 s of nearly empty screen showed on the contact sheet → introduce the next group on the transition word ("targetnya") and save the emphasis (crosshair) for its own word. Check every 2.5 s contact-sheet tile for empty frames.
- [render] Sadap 1834 frames at 1080×1920 rendered in 2 m 59 s. Whisper on the final mix matched the naskah except spelling and "nguras rekening"; mean −25.5 dB, max −5.9 dB; no silence over 0.3 s at −40 dB (music bed).
- 2026-11-06 [user-feedback] "di semua scene buat full animasi" → no infographic slides (icons/cards on a dot card). Every scene = a set + character acting the line; info rides on top as pills/thought bubbles/one card at a time. Sadap rev 2: Resmi→street (caller signal → tower ← officer letter), Mata→table top-down + street targets, Mitos→desk with thought bubbles, Tips→street + card carousel, Apk→hand-held phone over blurred room with tapping hand, Title over blurred hook shot.
- 2026-11-06 [layout] Portrait street drawn at 1:1 left characters tiny (heads only) with ~45 % flat hedge below → wrap the world in `scale(1.3)` origin 0 0 (ground ≈ y 1350) or use chibi width ≥ 480 and hedge top ≈ 1300 so hand props stay visible. Pan targets must stay inside the visible world width (1080/k) — the IZIN paper landed off-screen until pan 700→480.
- 2026-11-06 [character] A straight capsule "thumb" read as a stick → a hand with pointing index finger + palm + folded fingers that enters from off-screen, taps, and leaves (Sadap TapHand).

## 2026-11-12 — 4 hook shorts (`Pulau`, `KotaDesa`, `Hape`, `Bohong`; 1080×1920, 22–29 s, ElevenLabs takes)

- [tooling] Shared plumbing in `src/shorts/common.tsx`: `timing(tl)` → START/DUR/W/LAST, `<Short>` (series + captions + voice + music + whooshes), Thought/Say/Stamp/CommentCta/Count + small props. A new short = naskah json → words.py (turbo) → align.py → one scene file. Naskah numbers written as digits ("17.000", "46", "5", "30") match Whisper's digits and give digit captions.
- [layout] Comment card at the top band collided with the last scene's thought bubbles (KotaDesa "lebih bahagia?" bubble shrank out after 18 f) → CTA sits at y 1170 (caption band) and pops at LAST+14 f, after the last caption fades (e + 0.5 s); HOLD 75 f so it reads for ~2 s.
- [layout] Split screen (desa | kota): the white divider drawn after the children cut through a centred face → draw the divider first, children over it. A Pill (1080 wide, self-centring) inside a half-width wrapper lands 270 px off → wrapper left = x − 540, width 1080.
- [motion] Meta beat for "kamu lagi megang hape sekarang": the whole shot scales 1→0.52 into a phone (box-shadow bezel, radius 0→120) held by the viewer's hands over a blurred room. Reads instantly on the contact sheet.
- [character] `Chibi towel` = wrap over the hair + knot (just showered). Stamps over a close-up face (top 660 at SOFA_CAM) hid the eyes → top ≤ 575 there.
- [tooling] RTK rewrites `ls` output even inside `$(...)` (sizes appended) → build file lists with python/glob, not `ls`. Contact sheet: `python3 scripts/sheet.py <dir> <Comp>` (numeric frame order; glob order put f140 before f30).

## 2026-11-12 — Hape2m (2-min vertical, Hero A+B, natural SFX)
- Hero (`src/explainer/Hero.tsx`) replaces Chibi 1:1 (same geometry): A = hoodie/spiky/orange, B = `hairStyle="bob" outfit="tee" lashes` primary. User asked for "more attractive" characters; drop-in swap needed no re-layout.
- SFX rule from user ("natural, jangan AI slop"): only recorded CC0 foley for things that visibly move (phone buzz, clock ticking, footsteps, cloth when a character fidgets) + quiet location ambience per scene (`Amb`, loop, 12-frame fades crossfade on cuts). No pop/pluck per pill, no UI chime on the CTA (`CommentCta chime={false}`). Levels vs voice mean −27.6 dB: room tone 0.3, street 0.09, birds 0.2–0.25, vibrate 0.7, notif 0.3, tick 0.8.
- Retention: frame-0 action (phone buzz + real vibration + "30 HARI TANPA HAPE?" banner until the title), the two hook questions become pinned chips (`Tracker`, global frames) that pulse when revisited and turn ✓ when answered (~min 1 and near the end); whip/colour-wipe only at "Tapi" turns and topic changes.
- Layout traps: classroom back-row desk bar crossed the front students' faces → draw back row without a desk; ring/count/pill stacked over each other → fade the count out when the ring appears.
