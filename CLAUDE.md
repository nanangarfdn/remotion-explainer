# REMOTION explainer studio

Indonesian flat-2D explainer videos: Remotion project in `my-video/`, narration via local VoiceStudio (`localhost:3900`).

## Improvement loop (every video)

1. Before work: read `.claude/skills/explainer-2d/LESSONS.md`.
2. Use the skills: `explainer-2d` (visuals), `naskah-voicestudio` (script + voice), `remotion-best-practices` (API).
3. After rendering, or after any user feedback: append dated lessons to LESSONS.md (what broke, the rule, evidence).
4. A lesson that held for 2+ videos → move it into the skill's SKILL.md and shorten LESSONS.md.

## Fixed decisions

- 1920×1080, 30 fps. Own palette (`THEME` in `my-video/src/explainer/kit.tsx`). Never the reference channel's red, characters or branding.
- `REFERENCE/` videos are for pacing and structure study only.
- Sounds: CC0 or self-generated only; record the source in `my-video/public/sfx/LICENSES.txt`.
- Verify before claiming done: look at rendered frames; check audio cues with onset/energy detection; say what was not heard.
