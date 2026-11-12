#!/bin/bash
# Kok Bisa? hook study: first 60 s audio of each video in top50.tsv → audio/, then Whisper → transcripts/.
# Usage: ./fetch.sh [list.tsv] [full_n]   (cols: views, id, duration, title); the first full_n videos are fetched whole (closings).
cd "$(dirname "$0")"
list="${1:-top50.tsv}"
full="${2:-10}"
n=0
cut -f2 "$list" | while read -r id; do
    n=$((n + 1))
    ls audio/"$id".* >/dev/null 2>&1 && continue
    sec=(--download-sections "*0-60"); [ "$n" -le "$full" ] && sec=()
    uvx yt-dlp@latest --js-runtimes node -q --no-warnings -f bestaudio "${sec[@]}" \
        -o "audio/%(id)s.%(ext)s" "https://www.youtube.com/watch?v=$id" </dev/null \
        || echo "FAIL $id" >> fetch.err
    sleep $((5 + RANDOM % 10)) # ponytail: fixed jitter; back off further if 429s show up in fetch.err
done
uv run -q --with faster-whisper --with numpy python3 transcribe.py "$list"
