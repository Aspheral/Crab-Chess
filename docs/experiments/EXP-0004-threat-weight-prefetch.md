# EXP-0004 — Threat-weight row L2 prefetch

## Status

**Throughput reproduction passed; advance to matched-resource game testing.** The accepted Crab engine source is still unchanged. CI applies `experiments/EXP-0004-threat-weight-prefetch.patch` only to the candidate build.

This candidate is **not accepted yet**, and the NPS measurements below are not an Elo or playing-strength claim.

## Hypothesis

Threat-feature indices are computed hundreds of cycles before their corresponding NNUE threat-weight rows are consumed. Prefetching the relevant rows with low locality can place the data in L2 without unnecessarily polluting L1, reducing memory stalls in the threat-feature accumulator hot path.

## Upstream research provenance

Based on post-SF18 Stockfish commit:

- commit: `238ef05bb0a306589ce5e5876bc34b68d43354a0`
- title: `Prefetch threat weight rows during append_changed_indices`
- upstream classification: `No functional change`
- STC first run: 120,800 games, LLR `2.96 (-2.94,2.94) <0.00,2.00>`
- LTC: 86,850 games, LLR `2.94 (-2.94,2.94) <0.50,2.50>`
- STC SMP: 84,480 games, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- STC second sanity run: 132,192 games, LLR `2.93 (-2.94,2.94) <0.00,2.00>`

The upstream implementation uses `__builtin_prefetch` locality 1 on GCC/Clang, which maps to a low-locality cache prefetch appropriate for the large threat-weight table.

## Crab control

- accepted baseline branch: `crab/sf18-derived-base`
- accepted baseline SHA at experiment start: `d27318a91d5c8ec3b88eb5884a98972077dfbf02`
- candidate branch SHA for the reproduced throughput run: `9097aa26dde1b02a8b8bef58a5b3b339023fed2b`
- immutable SF18 control: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- deterministic baseline signature: `2,050,811` nodes
- candidate patch: `experiments/EXP-0004-threat-weight-prefetch.patch`

## Correctness and safety gates

The candidate passed all currently configured gates on both the original run and the fresh-runner confirmation:

1. upstream patch applies cleanly to Crab via `git apply --directory=engine`;
2. native GCC build passes;
3. native Clang build passes;
4. UCI identity remains `Crab Chess`;
5. deterministic bench remains exactly `2,050,811` nodes;
6. ASan/UBSan smoke passes;
7. website smoke test passes;
8. every timed throughput sample searched exactly `2,050,811` nodes.

## Throughput measurement 1

Environment recorded by CI:

- OS: Ubuntu 24.04 hosted runner
- compiler: Clang 18.1.3
- CPU: AMD EPYC 9V74
- architecture target: `x86-64-avx2`
- pairs: 20 alternating control/candidate pairs
- warmups: 2
- deterministic nodes per sample: `2,050,811`

Results:

- control median: **948,132 NPS**
- candidate median: **951,431 NPS**
- raw median delta: **+0.3479%**
- paired median delta: **+0.5307%**
- control mean: **946,138.85 NPS**
- candidate mean: **952,443.70 NPS**

This was considered promising but inconclusive because EXP-0003 had previously produced a positive first result that failed reproduction.

## Fresh-runner confirmation

GitHub Actions run `33722378293`, attempt 2, benchmark artifact `9884303267`:

- pairs: 20 alternating control/candidate pairs
- warmups: 2
- deterministic nodes per sample: `2,050,811`
- control median: **881,313 NPS**
- candidate median: **892,239 NPS**
- raw median delta: **+1.2397%**
- paired median delta: **+1.2845%**
- control mean: **895,242.1 NPS**
- candidate mean: **908,021.6 NPS**
- control standard deviation: **36,932.22 NPS**
- candidate standard deviation: **35,576.81 NPS**

The confirmation therefore reproduced the direction of the first run and increased the observed paired-median advantage rather than collapsing toward zero or reversing sign.

## Decision

**ADVANCE TO STRENGTH TESTING; DO NOT PROMOTE YET.**

The throughput hypothesis has now reproduced on a fresh hosted runner while preserving deterministic chess behavior and sanitizer cleanliness. That is sufficient to justify the next stage, but not to merge the engine change into the accepted Crab baseline.

The next gate is matched-resource game testing against:

1. the latest accepted Crab baseline; and
2. untouched Stockfish 18 at `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.

The game record must capture candidate SHA, both baseline SHAs, compiler/CPU, threads, hash, NNUE checksum, opening source/settings, time control, concurrency, adjudication settings, W/D/L, and either an Elo estimate with confidence interval or an SPRT result. Only statistically meaningful matched-resource evidence can promote EXP-0004 or support any strength statement.
