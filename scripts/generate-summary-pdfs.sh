#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/summaries/pdf"
ZIP_FILE="$ROOT_DIR/summaries/AI-Course-Summaries.zip"
PORT="8765"
BASE_URL="http://127.0.0.1:${PORT}"

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/*.pdf "$ZIP_FILE"

cd "$ROOT_DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/ai-summary-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
sleep 2

CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [[ -z "$CHROME" ]]; then
  echo "No Chrome/Chromium executable found." >&2
  exit 1
fi

render_pdf() {
  local type="$1"
  local number="$2"
  local label="$3"
  local url="${BASE_URL}/summaries/summary.html?type=${type}&number=${number}&pdf=1"
  local output="${OUT_DIR}/${label}-${number}-Summary.pdf"

  echo "Generating $(basename "$output")"
  "$CHROME" \
    --headless=new \
    --no-sandbox \
    --disable-gpu \
    --disable-dev-shm-usage \
    --hide-scrollbars \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=12000 \
    --print-to-pdf-no-header \
    --print-to-pdf="$output" \
    "$url" >/tmp/chrome-summary.log 2>&1

  if [[ ! -s "$output" ]]; then
    echo "Failed to generate $output" >&2
    cat /tmp/chrome-summary.log >&2 || true
    exit 1
  fi
}

for n in $(seq -w 1 20); do
  render_pdf lecture "$n" Lecture
  render_pdf lab "$n" Lab
done

cd "$ROOT_DIR/summaries"
zip -q -9 -r "$(basename "$ZIP_FILE")" pdf

echo "Generated 40 PDF summaries and $(basename "$ZIP_FILE")."
