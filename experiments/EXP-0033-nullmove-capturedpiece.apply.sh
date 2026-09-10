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
files = sorted((root / "engine").rglob("*.cpp"))

capture_re = re.compile(r"^[ \t]*newSt\.capturedPiece\s*=\s*NO_PIECE\s*;[ \t]*$", re.MULTILINE)
memcpy_re = re.compile(r"std::memcpy\s*\(\s*&newSt\s*,\s*st\s*,\s*sizeof\s*\(\s*StateInfo\s*\)\s*\)\s*;")
previous_re = re.compile(r"^[ \t]*newSt\.previous\s*=\s*st\s*;[ \t]*$")
next_re = re.compile(r"^[ \t]*st\s*=\s*&newSt\s*;[ \t]*$")

matches = []
for path in files:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    if any(capture_re.match(line.rstrip("\r\n")) for line in lines):
        raise SystemExit("EXP-0033 already applied")
    for i, line in enumerate(lines):
        if not memcpy_re.search(line):
            continue
        prev = next((j for j in range(i + 1, min(i + 12, len(lines))) if previous_re.match(lines[j].rstrip("\r\n"))), None)
        nxt = next((j for j in range((prev + 1) if prev is not None else i + 1, min(i + 14, len(lines))) if next_re.match(lines[j].rstrip("\r\n"))), None)
        if prev is not None and nxt is not None and prev < nxt:
            matches.append((path, lines, nxt))
            break

if len(matches) != 1:
    raise SystemExit(f"EXP-0033 null-move anchor count mismatch: {len(matches)}")

path, lines, insert_at = matches[0]
indent = re.match(r"^[ \t]*", lines[insert_at]).group(0)
lines.insert(insert_at, indent + "newSt.capturedPiece = NO_PIECE;\n")
path.write_text("".join(lines), encoding="utf-8")
print(path)
PY
