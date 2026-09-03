#!/usr/bin/env python3
"""Paired throughput benchmark for Crab Chess binaries.

This tool alternates baseline/candidate execution order to reduce systematic
runner drift, verifies that both binaries search the expected deterministic
node count, and reports robust NPS summaries. It is a performance diagnostic,
not a playing-strength test.
"""

from __future__ import annotations

import argparse
import json
import re
import statistics
import subprocess
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

NODES_RE = re.compile(r"Nodes searched\s*:\s*(\d+)")
NPS_RE = re.compile(r"Nodes/second\s*:\s*(\d+)")


@dataclass(frozen=True)
class Sample:
    pair: int
    order: int
    label: str
    nodes: int
    nps: int


def run_bench(binary: Path, expected_nodes: int) -> tuple[int, int]:
    proc = subprocess.run(
        [str(binary), "bench"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        print(proc.stdout, file=sys.stderr)
        raise RuntimeError(f"{binary} bench exited with {proc.returncode}")

    nodes_match = NODES_RE.search(proc.stdout)
    nps_match = NPS_RE.search(proc.stdout)
    if not nodes_match or not nps_match:
        print(proc.stdout, file=sys.stderr)
        raise RuntimeError(f"could not parse benchmark output from {binary}")

    nodes = int(nodes_match.group(1))
    nps = int(nps_match.group(1))
    if nodes != expected_nodes:
        raise RuntimeError(
            f"{binary} searched {nodes} nodes; expected deterministic signature {expected_nodes}"
        )
    return nodes, nps


def summary(values: list[int]) -> dict[str, float | int]:
    return {
        "samples": len(values),
        "median_nps": int(statistics.median(values)),
        "mean_nps": round(statistics.fmean(values), 2),
        "min_nps": min(values),
        "max_nps": max(values),
        "stdev_nps": round(statistics.stdev(values), 2) if len(values) > 1 else 0.0,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("baseline", type=Path)
    parser.add_argument("candidate", type=Path)
    parser.add_argument("--pairs", type=int, default=6)
    parser.add_argument("--warmups", type=int, default=1)
    parser.add_argument("--expected-nodes", type=int, default=2_050_811)
    parser.add_argument("--json", type=Path, dest="json_path")
    args = parser.parse_args()

    for binary in (args.baseline, args.candidate):
        if not binary.is_file():
            parser.error(f"binary not found: {binary}")

    if args.pairs < 1 or args.warmups < 0:
        parser.error("--pairs must be >= 1 and --warmups must be >= 0")

    print(f"Crab paired NPS benchmark: {args.pairs} pairs, {args.warmups} warmup(s)")
    print(f"Expected deterministic signature: {args.expected_nodes} nodes")

    for _ in range(args.warmups):
        run_bench(args.baseline, args.expected_nodes)
        run_bench(args.candidate, args.expected_nodes)

    samples: list[Sample] = []
    binaries = {"baseline": args.baseline, "candidate": args.candidate}

    for pair in range(1, args.pairs + 1):
        # Reverse every second pair to reduce first/second-run bias.
        order = ["baseline", "candidate"] if pair % 2 else ["candidate", "baseline"]
        for index, label in enumerate(order, start=1):
            nodes, nps = run_bench(binaries[label], args.expected_nodes)
            samples.append(Sample(pair=pair, order=index, label=label, nodes=nodes, nps=nps))
            print(f"pair {pair:02d}.{index}: {label:9s} {nps:>12,d} NPS")

    baseline_nps = [s.nps for s in samples if s.label == "baseline"]
    candidate_nps = [s.nps for s in samples if s.label == "candidate"]
    base_summary = summary(baseline_nps)
    cand_summary = summary(candidate_nps)

    base_median = float(base_summary["median_nps"])
    cand_median = float(cand_summary["median_nps"])
    median_ratio = cand_median / base_median if base_median else float("nan")
    median_speedup_pct = (median_ratio - 1.0) * 100.0

    paired_ratios: list[float] = []
    for pair in range(1, args.pairs + 1):
        base = next(s.nps for s in samples if s.pair == pair and s.label == "baseline")
        cand = next(s.nps for s in samples if s.pair == pair and s.label == "candidate")
        paired_ratios.append(cand / base)

    paired_median_ratio = statistics.median(paired_ratios)
    paired_speedup_pct = (paired_median_ratio - 1.0) * 100.0

    result = {
        "expected_nodes": args.expected_nodes,
        "baseline": base_summary,
        "candidate": cand_summary,
        "median_speedup_percent": round(median_speedup_pct, 4),
        "paired_median_speedup_percent": round(paired_speedup_pct, 4),
        "samples": [asdict(sample) for sample in samples],
    }

    print("\nSummary")
    print(f"baseline median : {int(base_median):,} NPS")
    print(f"candidate median: {int(cand_median):,} NPS")
    print(f"median speedup  : {median_speedup_pct:+.3f}%")
    print(f"paired median   : {paired_speedup_pct:+.3f}%")

    if args.json_path:
        args.json_path.parent.mkdir(parents=True, exist_ok=True)
        args.json_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {args.json_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
