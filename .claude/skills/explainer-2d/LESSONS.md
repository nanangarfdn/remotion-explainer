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

## 2026-11-13 — Kucing9 (vertical 58.7 s, ElevenLabs API Starter, Eleven v4)
- [tts] `npm run tts -- naskah/<id>.json` (scripts/eleven.mjs) = per-line API takes with character timestamps → timeline.json directly (no Whisper/align). Free-tier keys get 401 `detected_unusual_activity` on a shared home IP; a paid key works. The key in .env can belong to a different account than the browser → check `GET /v1/user/subscription` tier first. Model per naskah via `"elevenModel": "eleven_v4"`. Raw takes were −27.9 LUFS → loudnorm I=−16 in the concat (final mix −13.7 LUFS).
- [user-feedback] "ilustrasinya yang realistis dan lebih complex lagi detail2 nya" → flat bg + floor strip read as too plain. Portrait sets drawn natively at 1080×1920 (src/kucing9/sets.tsx: Room with window/curtains/plank floor/rug, Wardrobe, City apartment with balconies, Sky, ClinicFront, Bedroom) and a semi-realistic cat (almond eyes + slit pupils, gradient fur, tabby stripes via dasharray, chest ruff, toe beans).
- [character] Righting reflex with head and body as separate rotations: head 0 / body 180 hides the torso behind the head → let the head lead only to 70° until the body turns (Kucing9.tsx S1, stills f330/345).
- [motion] HUD of 9 hearts as a global overlay (grey + "?" on "Tapi tunggu", 8 crack on "satu", centre heart stays) carries the myth across all scenes.
- 2026-11-13 [user-feedback] "karakter kucingnya kurang smooth masih kaku" → instant blink swap, end-only tail swish and linear rotations read stiff. Fix in Cat.tsx: lids scale shut over 7 f (double blink every 3rd), 6-segment tail chain with per-segment phase lag, independent ear flicks, idle head tilt + eye drift, whisker twitch; action knobs crouch/earsBack/paddle/tailAmp. Scenes: spring() with overshoot for head/body turns, anticipation crouch before a jump, parabolic airtime, landing = decaying cosine crouch (0.95·e^(−t/8)·cos(t/3.4)), shadow shrinks with height. Checked on 15-frame-step contact sheets (f100–135 startle, f150–405 fall, f1545–1600 jump).

## 2026-11-14 — Jujur (vertical 58 s, ElevenLabs v4, Hero cast)
- [tts] Whisper turbo on the v4 take was word-perfect on the first try; "otewe" (written phonetically) was heard as "otw" → write chat slang phonetically in the naskah. Captions strip quote marks (`CAPS` map in src/jujur/Jujur.tsx) because the naskah uses quotes for dialogue intonation.
- [sets] Hero is a bust (ends at the hands) → every standing shot needs a foreground that covers the cut: sofa back, meeting table, desk, duvet (src/jujur/sets.tsx). Head centre y ≈ 860–930 at width 360–480 keeps the cut under a foreground top of 1140–1180.
- [layout] A card that grows a second line needs its reveal box sized to the largest text (120 px clipped "Tolong jangan mampir." → 150). Pills placed near a seated character's head collided with the hair (office "1 jam kemudian" 700 → 225).
- [render] 1815 frames rendered in 2 m 16 s; final mix −13.7 LUFS.

## 2026-11-14 — first Studio analytics (Hape 1:54, Kucing9 1:02)
- [user-feedback] "kenapa comment dan likes dikit" → Studio 14 Nov 22.43: Hape 1.624 views, stayed 65,3 %, ~40 s avg (35 %), 22 likes, 3 comments, 55 % watch time on TV; Kucing9 1.368 views, stayed 59,2 %, ~27 s avg (43 %), 14 likes, 0 comments. ~95 % from the Shorts feed. The comment ask came after the average stop point → Shorts rules added to naskah-voicestudio + explainer-2d SKILL.md (35–50 s, ask in the first 5 s + mid chip + end, loop line, no dead end).
- [render] `HOLD` 75 → 12 frames (src/shorts/common.tsx:11); end CTAs moved from `LAST + 14` to `LAST - 30` so they still show (KotaDesa, Hape, Bohong, Pulau, Hape2m). Since Mar 2025 replays count as Shorts views; "engaged views" exclude them.
- 2026-11-14 [tts] Jaksel test (Serena, eleven_v4, naskah/lalat-test*.json): Whisper turbo heard literally, slow motion, miss, honestly, skill issue, which is, nge-scan ("ngescan"), even, the real MVP correctly. "jujurly" and "jujurli" both came back as "jujur, Li" (0.66 s gap) → listen by ear or drop it. "raket" heard once as "rakyat", once correct. Hook "Di mata lalat, tangan lo literally slow motion." = 3.97 s take (claim ends ~3.5 s).

## 2026-11-14 — Lalat (vertical 60.8 s, Jaksel register, first short under the new growth rules)
- [tts] 9 lines at 2.2 words/s came out 67.7 s → `atempo=1.12` on full.mp3 + every scene/caption time ÷ 1.12 (`timeline-orig.json` kept) = 60.4 s; Whisper turbo on the final mix still word-perfect except "raket" → "rakyat" (2/2) and "jujurly" → "jujur, lih". Whisper invented "Tepuk. Tepuk." over the music-only tail (no voice there).
- [sets] New props in src/lalat/props.tsx: side + top-view fly (rub/crouch/flying knobs), ArmHand (shoulder → palm, back of the hand), PalmFront, Racket (zap), EyeMacro (hex lenses + scan band), Stopwatch, FilmStrip. Natural-ish SFX generated: sfx/buzz.wav, sfx/slap.wav.
- [transition] A beat placed on the first word of a scene lands inside the incoming fade (first slap at "tiga" − 2 was half-transparent) → first beat ≥ word + 8 f.
- [layout] A palm in front of a close-up face hid the whole face → offset the hand to the side the arm comes from (x 760). Top-down plate under the bottom-right reaction character → plate bottom-left.
- [render] 1825 frames in 2 m 05 s; −14.1 LUFS; upload copy 8.8 MB (2-pass 1100k).
- 2026-11-14 [motion] User: "research fisika agar lebih realistis" → src/explainer/phys.ts (gPx/fallFrames/ballistic/strike/damped/saccadeFlight) + SKILL.md "Physics". Lalat rev 2: hook hand on a shoulder arc + air gusts ahead of the palm, slaps with wind-up + t² swing + hard stop + damped shake, fly orbit as saccades, wing blur fan instead of flaps, zapped fly falls ballistically (racket ≈ 0.5 m ≈ 1570 px/m). A wind-up raised 330 px put the hand over the face → 200 px. phys.ts' self-check read `process.argv[1]` at module load and crashed the browser bundle (`Cannot read properties of undefined (reading '1')`) → `process.argv?.[1]`.

- 2026-11-14 Expressions v2 (Hero emo system, Lalat). Broke: shock mouth drawn with the two-curve shape collapses to a small "v" (fix: jaw > 0.45 + narrow lips → ellipse O); half-closed lids showed a light ring at the clip edge (fix: eye white starts under the lid, `y = 186 + lidDrop`); 3-col EmotionLab cut off the last row (4 cols × width 230). Rule: verify every preset on EmotionLab before using it; key emotions on word frames. Evidence: EmotionLab_20 sheet, Lalat stills 161…1750.

## 2026-11-15 — Pensiun (vertical 53 s, first news-peg short: VP resignation → UU 7/1978 pension)
- [naskah] 131 words came out 60.8 s → trimmed to 110 words, still 60.8 s (ElevenLabs pads each scene) → `scripts/speed.py pensiun 1.15` = 52.9 s. Whisper turbo word-perfect (numbers come back as digits: "20 juta", "1978", "MPR").
- [captions] Spoken numbers read badly as words → `MERGE` in src/pensiun/Pensiun.tsx joins caption tokens ("dua puluh juta" → "20 juta", "sembilan belas tujuh puluh delapan." → "1978.").
- [layout] Bars + labels at y 1240 sat under the captions (top 1300) → chart baseline 1100; a stamp after the caption goes to y ≈ 1440. Calculator text 96 px wrapped "jt" → 84 px + nowrap. Envelope covered the centred nameplate → `Desk plateX`.
- [loop] Hook props that are present on frame 0 (envelope) must also be in the last shot, or the loop jumps; the chair swivel is a function of t so the last shot starts it LOOP_LEAD frames before the cut and frame 0 continues it.
- [render] 1598 frames in 1 m 22 s; −14.2 LUFS; upload copy 7.7 MB.

## 2026-11-15 — analytics review, 5 shorts (Studio 14.34) → rules updated
| Video | Age | Views | Stayed | Avg watched | Likes | Comments | Subs | Views last 60 min |
|---|---|---|---|---|---|---|---|---|
| Kucing 1:02 | 21 h | 2.1k | 66.4 % | ~31 s (50 %) | 24 | 0 | +4 | 59 |
| Hape 1:54 | 2 d | 1.72k | 65.5 % | ~41 s (36 %) | 22 | 3 | +6 | – |
| Jujur 1:01 | 16 h | 1.29k | 58.4 % | ~26 s (42 %) | 16 | 2 | +2 | 13 |
| Lalat 1:01 | 6 h | 1.33k | 57.9 % | ~21 s (34 %) | 8 | 1 | +1 | 29 |
| Pensiun 0:54 | 4.5 h | 1.2k | 48.4 % | ~13 s (23 %) | 21 | 3 | 0 | 25 |
- [analytics] Every short gets a ~1.2–2k Shorts-feed test; Lalat's push ran 552 views/h at 1.7 h and ended by ~4 h (26/h). Only Kucing (≥ 65 % stayed) was still pushed after a day. Lalat's stayed rose 52 → 58 % between 1.7 h and 6 h, so judge at 6 h, not at the first read.
- [hook] Test-with-stakes (Kucing) and "your own phone" (Hape) beat a fact statement (Lalat) and politics (Pensiun). The A/B verdict ask (Pensiun) gave the best likes (1.8 %) and comments even with the worst retention → keep the ask, change the topic. Rules: naskah-voicestudio "Hook types ranked by our data", explainer-2d "Shorts growth".
- 2026-11-15 [tooling] Token pass (user: "hemat token tanpa mengurangi kualitas"): src/shorts/cast.tsx (cast, P, Blurred, lerp, mergeCaps, VShort frame) — Pensiun moved onto it, stills 0/200/700/1590 byte-identical before/after; scripts/beats.py (W() frame table, TOTAL 1598 = render), scripts/ship.sh (tsc + render + 2-pass + LUFS line; needs LC_ALL=C or printf rejects "53.27"), scripts/studio-stats.js (one JSON line; Kucing 15 Nov 15.xx: 2.1k, 66.5 %, 32 s/52 %, 74 views/h). Hooks .claude/hooks/tsc_check.py (incremental tsc 1.6 s warm, skips unused-symbol errors) and read_guard.py (blocks voiceover JSON, node_modules, vendor, graphify-out; out/ stills stay readable). ElevenLabs already caches per scene by request hash; editing one line also regenerates its neighbours (previous_text/next_text) — kept for intonation.
