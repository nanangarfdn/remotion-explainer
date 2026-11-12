import csv, glob, json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

m = WhisperModel("deepdml/faster-whisper-large-v3-turbo-ct2", device="cpu", compute_type="int8")
for views, vid, dur, title in csv.reader(open(sys.argv[1]), delimiter="\t"):
    out = f"transcripts/{vid}.json"
    src = glob.glob(f"audio/{vid}.*")
    if os.path.exists(out) or not src:
        continue
    # PyAV in this venv breaks on file paths (learnings 2026-11-06): decode with ffmpeg instead.
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src[0], "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True).stdout
    segs, _ = m.transcribe(np.frombuffer(raw, np.float32), language="id", beam_size=5, vad_filter=True)
    segs = [{"s": round(s.start, 1), "e": round(s.end, 1), "t": s.text.strip()} for s in segs]
    json.dump({"id": vid, "title": title, "views": int(views), "duration": float(dur or 0), "segments": segs},
              open(out, "w"), ensure_ascii=False, indent=1)
    print(vid, title, "|", " ".join(s["t"] for s in segs)[:120], flush=True)
