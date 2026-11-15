#!/usr/bin/env bash
# Render a composition + make the YouTube browser-upload copy (< 10 MB) + one-line check.
# Usage: scripts/ship.sh <Comp> <id>   → out/<id>/<Comp>.mp4 and out/<id>/<Comp>-yt.mp4
# SKIP_RENDER=1 re-encodes an existing render only.
set -euo pipefail
export LC_ALL=C
comp=$1 id=$2 dir=out/$2
mkdir -p "$dir"
if ! out=$(npx tsc --noEmit -p .); then echo "$out" | head -20; echo "tsc failed, not rendering"; exit 1; fi
[ -n "${SKIP_RENDER:-}" ] || npx remotion render "$comp" "$dir/$comp.mp4" --log=error
yt=$dir/$comp-yt.mp4 log=$dir/p2
ffmpeg -v error -y -i "$dir/$comp.mp4" -c:v libx264 -b:v 1100k -pass 1 -passlogfile "$log" -an -f mp4 /dev/null
ffmpeg -v error -y -i "$dir/$comp.mp4" -c:v libx264 -b:v 1100k -pass 2 -passlogfile "$log" -c:a aac -b:a 96k -movflags +faststart "$yt"
rm -f "$log"*
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$yt")
bytes=$(stat -c %s "$yt")
lufs=$(ffmpeg -nostats -i "$yt" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
printf "%s  %.2f s  %.1f MB  %s LUFS  %s\n" "$yt" "$dur" "$(echo "$bytes/1048576" | bc -l)" "$lufs" "$( [ "$bytes" -lt 10485760 ] && echo OK || echo 'TOO BIG for browser upload')"
