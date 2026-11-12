#!/usr/bin/env python3
"""Tiny lo-fi bed generator (stdlib only): soft pad + plucked arpeggio + muffled kick + hat.
Usage: python3 scripts/music.py public/contoh/music.wav [seconds] [bpm]
"""
import math
import random
import struct
import sys
import wave

SR = 44100
out = sys.argv[1]
SECONDS = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
BPM = float(sys.argv[3]) if len(sys.argv) > 3 else 96.0
BEAT = 60 / BPM
N = int(SR * SECONDS)

# Fmaj7 → Em7 → Dm7 → Cmaj7 (MIDI notes), one chord per bar of 4 beats
CHORDS = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

buf = [0.0] * N


def add(start, dur, fn, gain):
    s0 = int(start * SR)
    for i in range(int(dur * SR)):
        j = s0 + i
        if j >= N:
            break
        buf[j] += fn(i / SR) * gain


bar = 4 * BEAT
t = 0.0
k = 0
while t < SECONDS:
    chord = CHORDS[k % len(CHORDS)]
    # pad: detuned sines, slow attack/release
    for m in chord:
        f = hz(m)
        env = lambda x, d=bar: min(1, x / 0.6) * min(1, (d - x) / 0.6 + 0.0001)
        add(t, bar, lambda x, f=f, env=env: env(x) * (math.sin(2 * math.pi * f * x) + 0.5 * math.sin(2 * math.pi * f * 1.004 * x)), 0.05)
    # pluck arpeggio, eighth notes, an octave up
    for e in range(8):
        m = chord[[0, 1, 2, 3, 2, 1, 2, 3][e]] + 12
        f = hz(m)
        add(t + e * BEAT / 2, 0.45, lambda x, f=f: math.exp(-x * 9) * (2 / math.pi) * math.asin(math.sin(2 * math.pi * f * x)), 0.07)
    # kick on 1 and 3, hat on the off-beats
    for b in (0, 2):
        add(t + b * BEAT, 0.3, lambda x: math.exp(-x * 14) * math.sin(2 * math.pi * (50 + 70 * math.exp(-x * 30)) * x), 0.35)
    rnd = random.Random(k)
    for b in range(4):
        add(t + b * BEAT + BEAT / 2, 0.05, lambda x, r=rnd: math.exp(-x * 90) * (r.random() * 2 - 1), 0.05)
    t += bar
    k += 1

# 1-pole lowpass for the "muffled" lo-fi feel + 0.4 s fades
y, a = 0.0, 0.35
for i in range(N):
    y += a * (buf[i] - y)
    fade = min(1, i / (0.4 * SR), (N - i) / (0.4 * SR))
    buf[i] = y * fade

peak = max(abs(v) for v in buf) or 1
with wave.open(out, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(v / peak * 0.8 * 32767)) for v in buf))
print(f"{out}: {SECONDS}s @ {BPM} bpm, peak-normalised")
