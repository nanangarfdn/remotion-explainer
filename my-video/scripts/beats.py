#!/usr/bin/env python3
# Word → local frame table, same maths as timing()/W() in src/shorts/common.tsx, so scenes can be keyed without reading timeline.json.
# Usage: python3 scripts/beats.py <id> [scene ...]     prints: S<i> <id> start dur | word@frame ...  (repeats get #n, as W(i, w, n))
import json, math, re, sys
from pathlib import Path

FPS, T, HOLD = 30, 16, 12  # FPS/HOLD: common.tsx, T: TRANSITION_FRAMES in explainer/kit.tsx
vid, only = sys.argv[1], {int(x) for x in sys.argv[2:]}
tl = json.loads((Path("public/voiceover") / vid / "timeline.json").read_text())
sc, N = tl["scenes"], len(tl["scenes"])
total = math.ceil(tl["duration"] * FPS) + HOLD
start = [round(s["start"] * FPS) - T // 2 if i else 0 for i, s in enumerate(sc)]
dur = [(round(s["end"] * FPS) + T // 2 if i < N - 1 else total) - start[i] for i, s in enumerate(sc)]
print(f"{vid}: TOTAL {total} f ({tl['duration']} s)")
for i, s in enumerate(sc):
    if only and i not in only:
        continue
    seen, out = {}, []
    for c in (c for c in tl["captions"] if c["scene"] == i):
        w = re.sub(r"[^a-z0-9-]", "", c["w"].lower())
        n = seen.get(w, 0); seen[w] = n + 1
        out.append(f"{w}{'#' + str(n) if n else ''}@{round(c['s'] * FPS) - start[i]}")
    print(f"S{i} {s['id']} start {start[i]} dur {dur[i]} | {' '.join(out)}")
