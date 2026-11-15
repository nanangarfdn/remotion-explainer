---
name: explainer-2d
description: Build Indonesian-style flat 2D explainer videos (chibi characters, solid colour cards, label pills, slow push-in, colour wipes) with our own indigo/amber palette in this Remotion project. Use when the user wants a video "seperti referensi", an edukasi/explainer animation, or asks for scenes, transitions, labels or title cards in that look. Pairs with naskah-voicestudio for narration and remotion-best-practices for API details.
---

# Explainer 2D

Look and pacing measured from the 3 videos in `REFERENCE/` (Nov 2026). Inspiration only:
never reuse their characters, logo, channel name or art. Draw original assets.

## Measured style

| Thing | Value from refs |
|---|---|
| Resolution / fps | 1920×1080 (refs 1280×720), **30 fps**. 60 fps not worth it: 2× render time, no visible gain for this motion |
| Length | 3:40 – 5:50 |
| Average shot | 6 – 8 s (37–42 cuts per video). Never hold a static frame > 10 s |
| Cuts | Mostly hard cuts + short crossfade (~0.5 s). Solid colour card wipe to change topic (refs yellow/green; **we use amber `#FFB020`**). Whip-blur for "meanwhile / elsewhere" |
| Camera | Every shot drifts: slow push-in 1.00 → 1.08 over the shot. Background often blurred (depth of field) |
| Entrances | Characters/props pop with spring overshoot; flags, coins, icons stagger in from bottom |
| Labels | Rounded pill, white bold caps, pops in after the object is visible (refs use red; **we use indigo `#4B3FD8`**) |
| Title cards | Full-colour card, big heavy rounded font, words pop one by one (refs red; **we use indigo + dotted texture, last word amber**) |
| Info card | White rounded panel with heading + 1–2 lines, flag/icon on the left |
| Characters | Chibi: big round head, dot eyes, no outlines, flat fills + one soft shadow |
| Night scenes | Navy `#1F2A44` palette, moon, city silhouette |
| Real footage | Occasional photo/video inside a white rounded frame, never full-bleed |
| Ending | CTA card: characters + speech bubble + QR/link |

## Kit (already in project)

`my-video/src/explainer/kit.tsx`, demo in `ExplainerDemo.tsx` (composition `ExplainerDemo`):

- `THEME` — own palette: primary indigo `#4B3FD8`, primaryDark `#3328A8`, amber `#FFB020`, teal `#16B8A0`, mint, navy. Never the refs' red `#E8303F`.
- `Chibi` (`src/explainer/Chibi.tsx`) — original character: props `mouth` (smile/flat/o/worried), `worried`, `pose` (idle/hold), `look`, `glow`, `shirt`, children = prop in hand.
- Detailed set example: `src/contoh/sets.tsx` (bedroom + living room as layered 1920×1080 SVG, back layer / character / front layer) and composition `Contoh`.
- `colorWipe(color)` — panel sweeps in, covers the cut, sweeps out. 14–18 frames.
- `whipBlur()` — fast slide with motion blur. 12–16 frames.
- `fade()` from `@remotion/transitions/fade` — the default soft cut. 12–15 frames.
- Font: Nunito 700–900 via `@remotion/google-fonts` (`THEME.font`). Never rely on system fonts.
- `<Layer to drift blur>` — parallax depth layer. Standard stack: back `to 1.03 drift 10 blur 2` → character `1.07/24` → foreground `1.11/40`. Labels on a wall use the wall's to/drift without blur. `<PushIn>` = single layer.
- `<PopIn delay exit>` — spring with squash & stretch; auto-exits (8 f, back-ease) just before the shot's transition. `exit={false}` on the last shot.
- `TRANSITION_FRAMES` (16) — shared by kit, PopIn exits and NarratedSeries.
- `<Sfx at src volume>` — one-shot sound at a local frame. Library in `public/sfx/` (Kenney CC0 + generated whoosh, see `LICENSES.txt`): pluck = pop, drop = label, glass = notification, confirmation = key point, tick = clock, whoosh = every transition (start 2 f before it).
- Music bed: `python3 scripts/music.py public/<id>/music.wav <seconds> <bpm>` (own synth, licence-free), play at volume ≈ 0.2 under voice.
- Acting: drive `Chibi` props per frame with `interpolate` beats (look → glance → react). Every shot needs at least one beat, not just idle breathing.
- Render: `remotion.config.ts` sets CRF 18 + JPEG 95. Verify audio with onset/energy check, not only that an audio stream exists.
- `<LabelPill text delay style color>` — indigo tag (white text, so keep bg dark).
- `<TitleCard text bg color accent>` — word-by-word title, last word in accent.
- `NarratedSeries` + `narratedDuration` (`src/explainer/NarratedSeries.tsx`) — builds the TransitionSeries from a voiceover `timeline.json`, one Sequence + `<Audio>` per line.

Create presentations at module level (`const WIPE = colorWipe(THEME.yellow)`), never inside components.
Total duration = sum(scene frames) − sum(transition frames).

## Realism rules (user rule, 2026-11-06)

Flat style, real-world logic. Check every scene against these rules before rendering.

1. **Screens face their user.** A character using a phone, laptop or TV toward the camera shows its BACK (case, camera bump, logo). Sell the screen with light on the face (glow colour = screen colour). Show screen content only in a separate close-up shot or a callout bubble, never by flipping the device.
2. **Gaze is motivated.** Eyes and head point at what the character uses or reacts to, at that object's actual position on screen. A glance at a clock goes toward the clock.
3. **Devices sit in front of their user.** A laptop is between the character and the camera, not beside them. Hands touch what they hold or type on.
4. **Props move at real speed.** A second hand moves 6° per second in 1 s steps, a minute hand barely moves, and the tick SFX lands on the step. Steam rises slowly. Exaggerate only when the narration says so (time-lapse), and make it look deliberate.
5. **Cause → effect from the source.** Notifications pop out of the device, then float to their spots. A sound plays on the frame its visual source moves.
6. **Contact and support.** Objects rest on a surface with a contact shadow, or are held. Only graphic overlays (labels, notif bubbles) may float.
7. **Consistent light.** The side facing a lamp or screen is lit, and glow colours match their source.
8. **Plausible scale.** A mug is smaller than a laptop, and a phone fits in a hand.

## Expressions / acting (`Hero` in `src/explainer/Hero.tsx`, check sheet: composition `EmotionLab`)

- Use `emotion="shock"` or keyed `face={emo(f, [[0, "determined"], [hit + 1, "cringe"], [hon, "shock"]], len)}`; 14 presets (neutral happy laugh sad cry shock scared angry smug cringe thinking sleepy determined love). Override a preset with `faceOf("scared", { teeth: 0, sweat: 1 })`. Legacy `mouth/worried/angry/browUp/eyesOpen` still work but don't mix them with `face`.
- Built from FACS: surprise = brows up + arched, lids wide, jaw drop → round O (AU1+2+5+26); sadness = inner brows up + mouth corners down (AU1+4+15); real smile = cheeks push the lower lids up (AU6+12, Duchenne), a mouth-only smile reads fake; contempt/smug = one-sided mouth corner + one brow (asymmetric, mirror it for the other character with negative `smirk`/`browAsym`); fear/cringe = clenched teeth box + sweat.
- Acting: react on the beat (key at word frame +0–1), change in 4–6 frames with overshoot (`emo` does it), hold each expression ≥ 12 frames. Eyes lead the head; add a `blinks` frame on every gaze/head change. Give each character its own `seed` so blinks and breathing don't sync.
- Arc per shot: start → react → settle (e.g. determined → cringe per miss → scared → shock → relieved). A face that never changes in a shot = dead shot.

## Vertical 9:16

Shorts/Reels/TikTok cut = same show, second composition (`ContohVertical`, 1080×1920, same audio, beats and duration). Never copy scenes.
- Scenes take `v: boolean`; each has a layout object `{ h, v }` (camera, prop spots, overlay spots, gaze vectors). Landscape values stay as they were.
- `World cam={{ k, x, y }}` (`src/contoh/Contoh.tsx`) films the same 1920×1080 world through a zoomed camera: scale k, world (x, y) = frame top-left. Put it inside every `Layer`.
- Sets take `v`: extend walls/floors past 0…1080 (overflow visible), move key props into the ~720–770 px wide camera, keep the light side. No empty bands.
- k ≈ 1.4–1.5 → character 70–85 % of frame width, head near y 850–950. Re-aim gaze vectors at the props' new spots.
- Safe zone for faces, labels, titles, notifs: x 60–960, y 260–1480, checked AFTER the Layer push-in (1.08 scale pulls a y 300 overlay up to ≈ 255).
- TitleCard: `fontSize 180, maxWidth "86%"` → 2–3 lines.
- Verify: landscape frame sequence before/after must be pixel-identical; stills of the vertical cut with the safe box drawn on.

## Physics (helpers in `src/explainer/phys.ts`, self-check `npx tsx src/explainer/phys.ts`)

- **Scale first**: pick px/m from a known object in the shot (head ≈ 0.23 m, table height ≈ 0.75 m, phone ≈ 0.15 m). Gravity = `gPx(pxPerM)` px/frame²; a 1 m drop takes ~13.5 frames, a table edge ~12 (`fallFrames`). Falls use `ballistic()` (constant acceleration), never a linear or eased tween.
- **Strikes** (slap, clap, punch, stamp): `strike(f, at)` = short wind-up opposite to the hit (anticipation), accelerating swing (t²), **abrupt stop on contact** (no ease-in into a surface), 2-frame hold, damped recoil. A human swat lasts ~4–6 frames from start of swing to contact.
- **Impacts** spread: `damped()` camera shake (amp ≤ 10 px, decay ~4 f), loose objects jiggle, dust/air ring at the contact point, SFX on the contact frame.
- **Arcs**: limbs rotate around a joint (shoulder/elbow), so hands travel on arcs; moving toward the camera also grows (perspective).
- **Air**: a palm or swatter pushes air ahead of it; small things (flies, paper, hair) react a few frames *before* contact.
- **Insects**: wings beat ~200×/s, so at 30 fps draw a translucent blur fan, never visible flaps. Flight = straight legs with near-instant turns (Drosophila turns ~90° in < 50 ms, ≈ 1–2 frames) + fine jitter (`saccadeFlight`), not smooth circles. Escape take-off happens in 1–2 frames, away from the threat.
- **Follow-through & overlap**: core moves first, loose parts (hair, tail, cloth, liquid) lag and settle; heavier = less overshoot.
- Check on a 2–4-frame-step contact sheet around every physical beat.

## Shorts growth (algorithm + channel data, Nov 2026)

Script rules live in `naskah-voicestudio` → "Shorts". Visual side:
- **Frame 0 = action + question text** (big pill/banner, readable with sound off). No logo intro, no fade-in from black, no static first second.
- **Mid-video comment chip** at ~40–60 %: short "Komen: A atau B?" for 2–3 s (wrap `CommentCta` in `<Sequence from={x} durationInFrames={75}>` with `at={0}`), so viewers who leave early still saw the ask.
- **No dead end**: `HOLD` in `src/shorts/common.tsx` is 12 frames. The end CTA pops during the last line, not after it; never a 2+ s static end card (viewers swipe before the "end" and the view counts as unfinished).
- **Loop frame**: the last shot visually matches frame 0 (same set/camera or a cut that reads as the start), music bed does not fade to silence.
- Change something on screen every 2–3 s; check the contact sheet for empty tiles.
- Frame 0 shows the *stakes* of the test or the viewer's own object (cat at the cupboard edge, a phone with 0 % battery), not a set that needs explaining (empty VP chair read as politics → most swipes).
- After publish: pinned question comment (user OK) + answer comments in the first hour. Read Studio (video → Insight) at **~2 h, ~6 h and 48 h**: views, views in the last 60 min, viewed-vs-swiped, watch hours (avg s = hours × 3600 / views), likes, comments, subs. Our feed push lasts ~4 h; if the last-60-min views fall under ~30 by 6 h with stayed < 60 %, the test is over: note the lesson, don't wait. Goals: stayed ≥ 65 % keeps the push (Kucing), ≥ 70 % for a breakout; likes ≥ 1.2 %. Compare against our own scoreboard (LESSONS.md, 2026-11-15 analytics), not internet benchmarks.

## Workflow

0. Read [LESSONS.md](./LESSONS.md) first; append new lessons when done (format at its top).
1. Script first (skill `naskah-voicestudio`): it produces `public/voiceover/<id>/timeline.json`. Don't open that file: `python3 scripts/beats.py <id> [scene…]` prints scene start/length and every word's local frame (`word@frame`, repeats `word#n@frame` = `W(i, "word", n)`).
2. Vertical short: `src/<id>/<Comp>.tsx` with scenes `S0…Sn` + `src/<id>/props.tsx`. Import the cast and frame from `src/shorts/cast.tsx` (`A`, `B`, `P`, `Blurred`, `lerp`, `mergeCaps`, `VShort`) instead of copying them; the export is one line: `<VShort tl={timeline} scenes={SCENES} trans={TRANS} banner="…" bannerLoop caps={CAPS} />` (banner, music bed 0.07 with no fade-out, watermark, captions and voice included; `children` for extra overlays, `musicVolume` for ducking). Pensiun is the reference. Landscape: one component per scene in `src/<video-id>/scenes/`, each wrapped in `<PushIn>`.
3. Assets: SVG/PNG in `public/<video-id>/`, loaded with `staticFile()`. Layer as separate files (bg, mid, character, props) so each can move.
4. `<TransitionSeries>` with mostly `fade()`, `colorWipe` at topic changes, `whipBlur` sparingly.
5. Type errors are reported after each edit by the `tsc_check.py` hook (`.claude/hooks/`), so fix them before rendering stills.
6. Verify: `SCALE=0.4 node scripts/stills.mjs <new dir> Comp:f1,f2…` (one bundle) at each transition midpoint + one per beat, then `python3 scripts/sheet.py <dir> Comp` and look at the sheet before claiming it works.
7. Ship: `scripts/ship.sh <Comp> <id>` = full tsc, render, 2-pass upload copy (< 10 MB) and one line `path  s  MB  LUFS  OK`. `SKIP_RENDER=1` re-encodes only.
8. Studio numbers: navigate to `studio.youtube.com/video/<id>/analytics/tab-overview/period-default`, then run `scripts/studio-stats.js` as the javascript_tool text → one JSON line (views, stayed, avg s / %, likes, subs, recent views).

## Don'ts

- No grain, heavy vignette or glow: the refs are clean and flat.
- No linear motion for objects; springs or eased interpolate with clamp.
- No text walls: max ~6 words on screen besides an info card.
