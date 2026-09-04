#!/usr/bin/env python3
"""Combine independent Crab strength-screen summaries by W/D/L counts."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path


def elo(score: float) -> float:
    return -400 * math.log10(1 / score - 1)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("summaries", nargs="+", help="JSON files from summarize_match.py")
    p.add_argument("--json", required=True, help="combined output JSON")
    a = p.parse_args()

    if len(a.summaries) < 2:
        raise SystemExit("at least two independent summaries are required")

    rows = [json.loads(Path(path).read_text()) for path in a.summaries]
    engine = rows[0].get("engine")
    opponent = rows[0].get("opponent")
    if not engine or not opponent:
        raise SystemExit("summary is missing engine/opponent")

    for row in rows:
        if row.get("engine") != engine or row.get("opponent") != opponent:
            raise SystemExit("all summaries must have the same engine/opponent orientation")
        expected = int(row["wins"]) + int(row["draws"]) + int(row["losses"])
        if int(row["games"]) != expected:
            raise SystemExit("summary games count does not equal wins+draws+losses")

    wins = sum(int(row["wins"]) for row in rows)
    draws = sum(int(row["draws"]) for row in rows)
    losses = sum(int(row["losses"]) for row in rows)
    games = wins + draws + losses
    score = (wins + 0.5 * draws) / games

    mean = score
    variance = (
        wins * (1 - mean) ** 2
        + draws * (0.5 - mean) ** 2
        + losses * mean**2
    ) / max(1, games - 1)
    se = math.sqrt(variance / games)
    low_score = max(1e-9, score - 1.96 * se)
    high_score = min(1 - 1e-9, score + 1.96 * se)

    result = {
        "engine": engine,
        "opponent": opponent,
        "independent_summaries": len(rows),
        "source_files": a.summaries,
        "games": games,
        "wins": wins,
        "draws": draws,
        "losses": losses,
        "score": score,
        "elo": elo(score),
        "elo95_low": elo(low_score),
        "elo95_high": elo(high_score),
        "method": "aggregate W/D/L draw-aware normal 95% CI; screening estimate, not SPRT",
    }
    Path(a.json).write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
