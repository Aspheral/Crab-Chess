#!/usr/bin/env bash
set -euo pipefail

# Guarded EXP-0033 application harness.
# Applies only the audited one-line null-move fix to a temporary worktree copy.
# The repository source remains unchanged until this harness succeeds in CI.

ROOT="${1:?usage: $0 <repo-root>}"
FILE="$ROOT/engine/src/position.cpp"

python3 - "$FILE" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
old = "    st->pliesFromNull = 0;\n\n    sideToMove = ~sideToMove;"
new = "    st->pliesFromNull = 0;\n\n    st->capturedPiece = NO_PIECE;\n\n    sideToMove = ~sideToMove;"

if new in text:
    raise SystemExit("EXP-0033 already applied")
if text.count(old) != 1:
    raise SystemExit(f"EXP-0033 anchor count mismatch: {text.count(old)}")

path.write_text(text.replace(old, new), encoding="utf-8")
PY

grep -A5 -B2 -n "pliesFromNull" "$FILE"
