# REMOTION explainer studio

Indonesian flat-2D explainer videos: Remotion project in `my-video/`, narration via local VoiceStudio (`localhost:3900`).

## Improvement loop (every video)

1. Before work: read `.claude/skills/explainer-2d/LESSONS.md`.
2. Use the skills: `explainer-2d` (visuals), `naskah-voicestudio` (script + voice), `remotion-best-practices` (API).
3. After rendering, or after any user feedback: append dated lessons to LESSONS.md (what broke, the rule, evidence).
4. A lesson that held for 2+ videos → move it into the skill's SKILL.md and shorten LESSONS.md.

## Fixed decisions

- 1920×1080, 30 fps (shorts 1080×1920). Own palette (`THEME` in `my-video/src/explainer/kit.tsx`). Never the reference channel's red, characters or branding.
- `REFERENCE/` videos are for pacing and structure study only.
- Sounds: CC0 or self-generated only; record the source in `my-video/public/sfx/LICENSES.txt`.
- Verify before claiming done: look at rendered frames; check audio cues with onset/energy detection; say what was not heard.

## Token budget (quality first: these only remove re-reading and boilerplate)

- Frames for beats: `python3 my-video/scripts/beats.py <id>`; never read `public/voiceover/**.json` (the `read_guard.py` hook blocks it).
- New short = scenes + props only; cast, banner, captions, audio come from `my-video/src/shorts/cast.tsx` (`VShort`).
- Big `.tsx` files: grep for the scene (`grep -n "const S4"`), then Read with offset/limit; don't re-read a file you just edited.
- Render + upload copy + checks: `my-video/scripts/ship.sh <Comp> <id>`. Studio numbers: `my-video/scripts/studio-stats.js`.
- Hooks live in `.claude/hooks/` and are registered in the user's `~/.claude/settings.json` (PostToolUse Edit|Write|MultiEdit → `tsc_check.py`, PreToolUse Read → `read_guard.py`), because sessions often start outside this folder. On another machine add the same two entries with that machine's path.
