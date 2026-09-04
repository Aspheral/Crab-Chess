#!/usr/bin/env python3
"""Run one auditable Crab Chess matched-resource strength screen.

This wrapper intentionally centralizes the settings that must remain identical
across experiment workflows. It does not build engines or decide whether a
candidate is accepted; it only runs one repeated-color Cute Chess match and
summarizes the resulting PGN.
"""

from __future__ import annotations

import argparse
import shlex
import subprocess
import sys
from pathlib import Path


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    p.add_argument("--cutechess", required=True, help="path to pinned cutechess-cli")
    p.add_argument("--engine-name", required=True)
    p.add_argument("--engine-cmd", required=True)
    p.add_argument("--opponent-name", required=True)
    p.add_argument("--opponent-cmd", required=True)
    p.add_argument("--openings", default="tools/strength/openings.pgn")
    p.add_argument("--summarizer", default="tools/strength/summarize_match.py")
    p.add_argument("--pgn", required=True)
    p.add_argument("--json", required=True)
    p.add_argument("--tc", default="3+0.03")
    p.add_argument("--threads", type=int, default=1)
    p.add_argument("--hash-mb", type=int, default=64)
    p.add_argument("--plies", type=int, default=8)
    p.add_argument("--games-per-round", type=int, default=2)
    p.add_argument("--rounds", type=int, default=256)
    p.add_argument("--concurrency", type=int, default=2)
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="validate inputs and print the exact command without starting games",
    )
    return p


def require_file(value: str, label: str) -> Path:
    path = Path(value)
    if not path.is_file():
        raise SystemExit(f"{label} does not exist: {path}")
    return path


def positive(value: int, label: str) -> int:
    if value <= 0:
        raise SystemExit(f"{label} must be positive")
    return value


def main() -> int:
    a = parser().parse_args()

    if a.engine_name == a.opponent_name:
        raise SystemExit("engine and opponent names must differ")

    cutechess = require_file(a.cutechess, "cutechess executable")
    engine = require_file(a.engine_cmd, "candidate engine")
    opponent = require_file(a.opponent_cmd, "opponent engine")
    openings = require_file(a.openings, "opening book")
    summarizer = require_file(a.summarizer, "match summarizer")

    positive(a.threads, "threads")
    positive(a.hash_mb, "hash-mb")
    positive(a.plies, "plies")
    positive(a.games_per_round, "games-per-round")
    positive(a.rounds, "rounds")
    positive(a.concurrency, "concurrency")

    pgn = Path(a.pgn)
    summary = Path(a.json)
    pgn.parent.mkdir(parents=True, exist_ok=True)
    summary.parent.mkdir(parents=True, exist_ok=True)

    command = [
        str(cutechess),
        "-engine",
        f"name={a.engine_name}",
        f"cmd={engine}",
        "proto=uci",
        "-engine",
        f"name={a.opponent_name}",
        f"cmd={opponent}",
        "proto=uci",
        "-each",
        f"tc={a.tc}",
        f"option.Threads={a.threads}",
        f"option.Hash={a.hash_mb}",
        "-openings",
        f"file={openings}",
        "format=pgn",
        "order=sequential",
        f"plies={a.plies}",
        "-games",
        str(a.games_per_round),
        "-rounds",
        str(a.rounds),
        "-repeat",
        "-concurrency",
        str(a.concurrency),
        "-pgnout",
        str(pgn),
    ]

    print("strength command:", shlex.join(command), flush=True)
    print(
        "policy: repeated colors, sequential fixed openings, no adjudication; "
        f"planned games={a.games_per_round * a.rounds}",
        flush=True,
    )

    if a.dry_run:
        return 0

    subprocess.run(command, check=True)
    subprocess.run(
        [
            sys.executable,
            str(summarizer),
            str(pgn),
            "--engine",
            a.engine_name,
            "--opponent",
            a.opponent_name,
            "--json",
            str(summary),
        ],
        check=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
