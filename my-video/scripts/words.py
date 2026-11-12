import sys, subprocess, json, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True).stdout
a = np.frombuffer(raw, np.float32)
m = WhisperModel(sys.argv[3] if len(sys.argv)>3 else "small", device="cpu", compute_type="int8")
segs, _ = m.transcribe(a, language="id", word_timestamps=True, beam_size=5)
out=[]
for s in segs:
    for w in s.words: out.append({"w": w.word.strip(), "s": round(w.start,2), "e": round(w.end,2)})
json.dump(out, open(sys.argv[2],"w"), ensure_ascii=False)
print(" ".join(f"{o['w']}@{o['s']}" for o in out))
