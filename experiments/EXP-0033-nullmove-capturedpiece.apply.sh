#!/usr/bin/env bash
set -euo pipefail

# Guarded EXP-0033 application harness.
# Applies only the audited one-line null-move fix to a temporary worktree copy.
# The repository source remains unchanged until this harness succeeds in CI.

ROOT="${1:?usage: $0 <repo-root>}"
TARGET="$ROOT/engine/src/position.cpp"

python3 - "$TARGET" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
if not path.is_file():
    raise SystemExit(f"EXP-0033 target missing: {path}")
text = path.read_text(encoding="utf-8")

if "newSt.capturedPiece = NO_PIECE;" in text:
    raise SystemExit("EXP-0033 already applied")

anchor = re.compile(
    r"(?P<memcpy>std::memcpy\\s*\\(\\s*&newSt\\s*,\\s*st\\s*,\\s*sizeof\\s*\\(\\s*StateInfo\\s*\\)\\s*\\)\\s*;"
    r"(?P<gap>\\s+)"
    r"newSt\\.previous\\s*=\\s*st\\s*;"
    r"(?P<gap2>\\s+)"
    r"(?P<indent>[ \\t]*)st\\s*=\\s*&newSt\\s*;)",
    re.MULTILINE,
)

matches = list(anchor.finditer(text))
if len(matches) != 1:
    raise SystemExit(f"EXP-0033 null-move anchor count mismatch: {len(matches)}")

m = matches[0]
indent = m.group("indent")
replacement = m.group(0).replace(
    indent + "st = &newSt;",
    indent + "newSt.capturedPiece = NO_PIECE;\\n" + indent + "st = &newSt;",
    1,
)
path.write_text(text[:m.start()] + replacement + text[m.end():], encoding="utf-8")
print(path)
PY
