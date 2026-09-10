#!/usr/bin/env bash
set -euo pipefail

# Guarded EXP-0033 application harness.
# Applies only the audited one-line null-move fix to a temporary worktree copy.
# The repository source remains unchanged until this harness succeeds in CI.

ROOT="${1:?usage: $0 <repo-root>}"
TARGET="$ROOT/engine/src/position.cpp"

python3 - "$TARGET" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
if not path.is_file():
    raise SystemExit(f"EXP-0033 target missing: {path}")
lines = path.read_text(encoding="utf-8").splitlines(keepends=True)

if any("newSt.capturedPiece = NO_PIECE;" in line for line in lines):
    raise SystemExit("EXP-0033 already applied")

memcpy = [i for i, line in enumerate(lines) if "std::memcpy(&newSt, st, sizeof(StateInfo));" in line]
previous = [i for i, line in enumerate(lines) if line.strip() == "newSt.previous = st;"]
next_state = [i for i, line in enumerate(lines) if line.strip().replace(" ", "") == "st=&newSt;"]

anchors = []
for i in memcpy:
    prev = [j for j in previous if i < j < i + 12]
    nxt = [j for j in next_state if prev and prev[0] < j < i + 14]
    if len(prev) == 1 and len(nxt) == 1:
        anchors.append((i, prev[0], nxt[0]))

if len(anchors) != 1:
    raise SystemExit(f"EXP-0033 null-move anchor count mismatch: {len(anchors)}")

_, _, insert_at = anchors[0]
indent = lines[insert_at][:len(lines[insert_at]) - len(lines[insert_at].lstrip(" \t"))]
lines.insert(insert_at, indent + "newSt.capturedPiece = NO_PIECE;\n")
path.write_text("".join(lines), encoding="utf-8")
print(path)
PY
