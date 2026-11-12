#!/usr/bin/env python3
"""One narration take -> scene timeline + word captions in the naskah's spelling.
Usage: python3 scripts/align.py naskah/<id>.json public/voiceover/<id>/full.mp3 public/voiceover/<id>/words.json
(words.json from: <venv>/python -I scripts/words.py full.mp3 words.json)
Writes public/voiceover/<id>/timeline.json:
  scenes[i]: {id, text, start, end} seconds; boundaries sit mid-silence between lines
  captions[]: {w, s, e, scene} naskah words with Whisper times (interpolated when Whisper misheard)
"""
import difflib, json, re, subprocess, sys

naskah_path, audio, words_path = sys.argv[1:4]
naskah = json.load(open(naskah_path))
heard = json.load(open(words_path))

norm = lambda w: re.sub(r"[^\w]", "", w.lower())
# Naskah tokens; hyphenated words stay one token ("tiba-tiba"), Whisper may split them.
toks = [(i, w) for i, sc in enumerate(naskah["scenes"]) for w in sc["text"].split()]
a = [norm(w) for _, w in toks]
b = [norm(h["w"]) for h in heard]
times = [None] * len(toks)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    tag, i1, i2, j1, j2 = blk
    if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
        for k in range(i2 - i1):
            times[i1 + k] = (heard[j1 + k]["s"], heard[j1 + k]["e"])
    elif tag == "replace":  # n naskah words ~ m heard words: spread over the heard span
        s0, e0 = heard[j1]["s"], heard[j2 - 1]["e"]
        n = i2 - i1
        for k in range(n):
            times[i1 + k] = (s0 + (e0 - s0) * k / n, s0 + (e0 - s0) * (k + 1) / n)
# Fill words Whisper skipped by interpolating between neighbours.
for k, t in enumerate(times):
    if t is None:
        prev = next((times[j][1] for j in range(k - 1, -1, -1) if times[j]), 0.0)
        nxt = next((times[j][0] for j in range(k + 1, len(times)) if times[j]), prev + 0.3)
        times[k] = (prev, max(prev + 0.05, nxt))

# Silences in the take; each line boundary snaps to the silence nearest the aligned gap.
log = subprocess.run(["ffmpeg", "-i", audio, "-af", "silencedetect=n=-38dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
sil = [(float(e) - float(d), float(e)) for e, d in re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", log)]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio],
                           capture_output=True, text=True).stdout)

n_sc = len(naskah["scenes"])
first = [next(k for k, (i, _) in enumerate(toks) if i == s) for s in range(n_sc)]
cuts = []
for s in range(1, n_sc):
    gap = (times[first[s] - 1][1] + times[first[s]][0]) / 2
    a0, a1 = min(sil, key=lambda x: abs((x[0] + x[1]) / 2 - gap))
    cuts.append(((a0 + a1) / 2, a0, a1))
starts = [0.0] + [c[0] for c in cuts]
ends = [c[0] for c in cuts] + [dur]
# Clamp words into their line: a line's words start after the silence that opens it.
for k, (i, _) in enumerate(toks):
    lo = cuts[i - 1][2] if i else 0.0
    hi = cuts[i][1] if i < n_sc - 1 else dur
    s, e = times[k]
    s = min(max(s, lo), hi - 0.05)
    times[k] = (s, min(max(e, s + 0.05), hi))

out = {
    "id": naskah["id"], "fps": naskah.get("fps", 30), "duration": dur, "audio": f"voiceover/{naskah['id']}/full.mp3",
    "scenes": [{"id": sc["id"], "text": sc["text"], "start": round(starts[i], 3), "end": round(ends[i], 3)}
               for i, sc in enumerate(naskah["scenes"])],
    "captions": [{"w": w, "s": round(times[k][0], 3), "e": round(times[k][1], 3), "scene": i} for k, (i, w) in enumerate(toks)],
}
path = audio.rsplit("/", 1)[0] + "/timeline.json"
json.dump(out, open(path, "w"), ensure_ascii=False, indent=1)
for sc in out["scenes"]:
    print(f'{sc["id"]:12} {sc["start"]:6.2f}-{sc["end"]:6.2f}  {sc["text"][:50]}')
print("->", path)
