#!/usr/bin/env python3
# Speed up a voiceover take and rescale its timeline: python3 scripts/speed.py <id> <factor>
# Keeps full-orig.mp3 / timeline-orig.json, and always works from them, so re-running with another factor is safe.
import json, shutil, subprocess, sys
from pathlib import Path

vid, k = sys.argv[1], float(sys.argv[2])
d = Path("public/voiceover") / vid
for a, b in [("full.mp3", "full-orig.mp3"), ("timeline.json", "timeline-orig.json")]:
    if not (d / b).exists():
        shutil.copy(d / a, d / b)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(d / "full-orig.mp3"), "-filter:a", f"atempo={k}", "-b:a", "192k", str(d / "full.mp3")], check=True)
t = json.loads((d / "timeline-orig.json").read_text())
r = lambda x: round(x / k, 3)
t["duration"] = r(t["duration"])
for s in t["scenes"]:
    s["start"], s["end"] = r(s["start"]), r(s["end"])
for c in t["captions"]:
    c["s"], c["e"] = r(c["s"]), r(c["e"])
(d / "timeline.json").write_text(json.dumps(t, ensure_ascii=False, indent=2))
print(f"{vid}: x{k} -> {t['duration']} s")
