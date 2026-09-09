#!/usr/bin/env bash
set -euo pipefail

# Guarded EXP-0033 application harness.
# Applies only the audited one-line null-move fix to a temporary worktree copy.
# The repository source remains unchanged until this harness succeeds in CI.

ROOT="${1:?usage: $0 <repo-root>}"

python3 - "$ROOT" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
files = sorted((root / "engine" / "src").glob("*.cpp"))

# Match the actual Stockfish/Crab null-move copy sequence while tolerating
# spacing differences in aligned assignments.
anchor_re = re.compile(
    r"(?P<prefix>^[ \t]*std::memcpy\(&newSt, st, sizeof\(StateInfo\)\);\s*\n\s*"
    r"newSt\.previous\s*=\s*st;\s*\n)"
    r"(?P<tail>^[ \t]*st\s*=\s*&newSt;\s*$)",
    re.MULTILINE,
)
new_line = "    newSt.capturedPiece = NO_PIECE;"

matches = []
for path in files:
    text = path.read_text(encoding="utf-8")
    if anchor_re.search(text):
        matches.append((path, text))

if len(matches) != 1:
    raise SystemExit(f"EXP-0033 null-move anchor count mismatch: {len(matches)}")

path, text = matches[0]
if re.search(r"^[ \t]*newSt\.capturedPiece\s*=\s*NO_PIECE;[ \t]*$", text, re.MULTILINE):
    raise SystemExit("EXP-0033 already applied")

match = anchor_re.search(text)
assert match is not None
replacement = match.group("prefix") + new_line + "\n" + match.group("tail")
text = text[:match.start()] + replacement + text[match.end():]
path.write_text(text, encoding="utf-8")
print(path)
PY
