# Contact sheet of stills from scripts/stills.mjs, in frame order: python3 scripts/sheet.py <dir> <Comp>  → <dir>/<Comp>_sheet.jpg
import glob, re, subprocess, sys
d, pat = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(f"{d}/{pat}_*.png"), key=lambda p: int(re.findall(r"_(\d+)\.png$", p)[0]))
n = len(fs); cols = 6; rows = -(-n // cols)
args = sum([["-i", f] for f in fs], [])
lay = "|".join(f"{'+'.join(['w0']*(i%cols)) or '0'}_{'+'.join(['h0']*(i//cols)) or '0'}" for i in range(n))
subprocess.run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex", "".join(f"[{i}:v]" for i in range(n)) + f"xstack=inputs={n}:layout={lay}:fill=black", f"{d}/{pat}_sheet.jpg"], check=True)
print(f"{d}/{pat}_sheet.jpg", [re.findall(r"_(\d+)\.png$", f)[0] for f in fs])
