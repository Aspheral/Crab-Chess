#!/usr/bin/env bash
set -euo pipefail

# Guarded EXP-0033 application harness.
# Applies only the audited one-line null-move fix to a temporary worktree copy.
# The repository source remains unchanged until this harness succeeds in CI.

ROOT="${1:?usage: $0 <repo-root>}"

python3 - "$ROOT" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
files = sorted((root / "engine" / "src").glob("*.cpp"))
needle = "std::memcpy(&newSt, st, sizeof(StateInfo));"
old_tail = "st             = &newSt;"
new_line = "    newSt.capturedPiece = NO_PIECE;"

matches = []
for path in files:
    text = path.read_text(encoding="utf-8")
    if needle in text and old_tail in text:
        matches.append((path, text))

if len(matches) != 1:
    raise SystemExit(f"EXP-0033 null-move anchor count mismatch: {len(matches)}")

path, text = matches[0]
if new_line in text:
    raise SystemExit("EXP-0033 already applied")

anchor = needle + "\n\n    newSt.previous = st;\n" + old_tail
if text.count(anchor) != 1:
    raise SystemExit(f"EXP-0033 complete anchor count mismatch in {path}: {text.count(anchor)}")

replacement = needle + "\n\n    newSt.previous = st;\n" + new_line + "\n" + old_tail
path.write_text(text.replace(anchor, replacement), encoding="utf-8")
print(path)
PY
