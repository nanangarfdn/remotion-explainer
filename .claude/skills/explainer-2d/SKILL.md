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

## Vertical 9:16

Shorts/Reels/TikTok cut = same show, second composition (`ContohVertical`, 1080×1920, same audio, beats and duration). Never copy scenes.
- Scenes take `v: boolean`; each has a layout object `{ h, v }` (camera, prop spots, overlay spots, gaze vectors). Landscape values stay as they were.
- `World cam={{ k, x, y }}` (`src/contoh/Contoh.tsx`) films the same 1920×1080 world through a zoomed camera: scale k, world (x, y) = frame top-left. Put it inside every `Layer`.
- Sets take `v`: extend walls/floors past 0…1080 (overflow visible), move key props into the ~720–770 px wide camera, keep the light side. No empty bands.
- k ≈ 1.4–1.5 → character 70–85 % of frame width, head near y 850–950. Re-aim gaze vectors at the props' new spots.
- Safe zone for faces, labels, titles, notifs: x 60–960, y 260–1480, checked AFTER the Layer push-in (1.08 scale pulls a y 300 overlay up to ≈ 255).
- TitleCard: `fontSize 180, maxWidth "86%"` → 2–3 lines.
- Verify: landscape frame sequence before/after must be pixel-identical; stills of the vertical cut with the safe box drawn on.

## Workflow

0. Read [LESSONS.md](./LESSONS.md) first; append new lessons when done (format at its top).
1. Script first (skill `naskah-voicestudio`): it produces `public/voiceover/<id>/timeline.json` with per-scene `durationInFrames` and a `shot` note.
2. One component per scene in `src/<video-id>/scenes/`, sized by the timeline, each wrapped in `<PushIn>`.
3. Assets: SVG/PNG in `public/<video-id>/`, loaded with `staticFile()`. Layer as separate files (bg, mid, character, props) so each can move.
4. `<TransitionSeries>` with mostly `fade()`, `colorWipe` at topic changes, `whipBlur` sparingly.
5. Open Studio (`npm run dev`) for preview. Render only when asked.
6. Verify: render stills at each transition midpoint + one per scene (`npx remotion still <Comp> out.png --frame=N --scale=0.25`), tile them with ffmpeg, look before claiming it works.

## Don'ts

- No grain, heavy vignette or glow: the refs are clean and flat.
- No linear motion for objects; springs or eased interpolate with clamp.
- No text walls: max ~6 words on screen besides an info card.
