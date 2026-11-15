#!/usr/bin/env python3
# PreToolUse (Read): keep generated data out of context. Voiceover JSON (timeline/words/eleven parts) and vendored
# folders cost thousands of tokens and are never needed whole. Stills/sheets in out/ stay readable (visual review).
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
p = json.load(sys.stdin).get("tool_input", {}).get("file_path", "")
if not p:
    sys.exit(0)
try:
    rel = Path(p).resolve().relative_to(ROOT).as_posix()
except ValueError:
    sys.exit(0)
if re.match(r"my-video/public/voiceover/.+\.json$", rel):
    print("read_guard: voiceover JSON is large. Use `cd my-video && python3 scripts/beats.py <id> [scene…]` (word→frame, "
          "same maths as W()) or a python one-liner for one field.", file=sys.stderr)
    sys.exit(2)
if re.match(r"(my-video/node_modules|vendor|graphify-out)/", rel):
    print(f"read_guard: {rel.split('/')[0]}… is vendored/generated. grep it, or `graphify query` for graphify-out.", file=sys.stderr)
    sys.exit(2)
