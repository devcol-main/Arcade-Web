#!/usr/bin/env bash
# dist/<game> → ../devcol-site/devcol-build/docs/public/games/<game>
# 사용법: npm run build && scripts/copy-to-site.sh stack-up
set -euo pipefail

game="${1:?Usage: scripts/copy-to-site.sh <game>}"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
src="$repo_root/dist/$game"
dest="$repo_root/../devcol-site/devcol-build/docs/public/games/$game"

if [ ! -d "$src" ]; then
  echo "Missing $src. Run 'npm run build' first." >&2
  exit 1
fi

rm -rf "$dest"
mkdir -p "$dest"
cp -R "$src/." "$dest/"
echo "Copied $src -> $dest"
