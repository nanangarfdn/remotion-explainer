#!/usr/bin/env python3
# PostToolUse (Edit|Write|MultiEdit): type-check my-video after a .ts/.tsx edit under my-video/src, so a broken scene
# is caught here instead of in a failed stills/render round. Unused-symbol errors (TS6133/6192/6196) are skipped
# because they are normal mid-edit; scripts/ship.sh runs the full tsc before rendering.
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "my-video"
p = json.load(sys.stdin).get("tool_input", {}).get("file_path", "")
if not p or not re.search(r"\.tsx?$", p) or not Path(p).resolve().is_relative_to(ROOT / "src"):
    sys.exit(0)
r = subprocess.run(["npx", "tsc", "--noEmit", "--incremental", "--tsBuildInfoFile", "node_modules/.cache/tsc-hook.tsbuildinfo"],
                   cwd=ROOT, capture_output=True, text=True)
errs = [l for l in r.stdout.splitlines() if " error TS" in l and not re.search(r"TS(6133|6192|6196)", l)]
if errs:
    print("tsc:\n" + "\n".join(errs[:15]) + (f"\n… {len(errs) - 15} more" if len(errs) > 15 else ""), file=sys.stderr)
    sys.exit(2)
