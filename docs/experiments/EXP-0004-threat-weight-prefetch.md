# EXP-0004 — Threat-weight row L2 prefetch

## Status

**Initial matched-resource strength screen passed as non-regressing but remains statistically inconclusive; advance to a larger independent confirmation.** The accepted Crab engine source is still unchanged. CI applies `experiments/EXP-0004-threat-weight-prefetch.patch` only to the candidate build.

This candidate is **not accepted yet**. Neither throughput nor the screening games below establish an Elo gain, Stockfish 18 parity, or superiority.

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
- candidate engine source SHA represented by the patch: `782b62ed0edcc638c7f80fec182dc06baef72561`
- immutable SF18 control: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- deterministic baseline signature: `2,050,811` nodes
- candidate patch: `experiments/EXP-0004-threat-weight-prefetch.patch`

## Correctness and safety gates

The candidate passed all currently configured gates on the original throughput run, fresh-runner throughput confirmation, and first matched-resource strength screen:

1. upstream patch applies cleanly to Crab via `git apply --directory=engine`;
2. native GCC build passes;
3. native Clang build passes;
4. UCI identity remains `Crab Chess`;
5. deterministic bench remains exactly `2,050,811` nodes;
6. ASan/UBSan smoke passes;
7. website smoke test passes;
8. every timed throughput sample searched exactly `2,050,811` nodes;
9. immutable SF18 control independently benches exactly `2,050,811` nodes before game testing.

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

## Fresh-runner throughput confirmation

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

The confirmation reproduced the direction of the first run and increased the observed paired-median advantage rather than collapsing toward zero or reversing sign.

## Initial matched-resource strength screen

GitHub Actions run `33753455395`, artifact `9894007089` (`sha256:3b505369f2ac5289bd12e4cbe0362dfa25209a1a5b1b7213eda13bf0cd43e31c`) completed both planned 256-game matches successfully.

Recorded environment and controls:

- PR head at execution: `93ddab17e45e8d98392937c4ff387b138d4d34e4`
- candidate engine source SHA: `782b62ed0edcc638c7f80fec182dc06baef72561`
- accepted Crab baseline SHA: `d27318a91d5c8ec3b88eb5884a98972077dfbf02`
- immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- compiler: Ubuntu Clang 18.1.3
- CPU: AMD EPYC 9V74 hosted runner
- architecture: `x86-64-avx2`
- Threads: 1
- Hash: 64 MiB
- time control: `3+0.03`
- concurrency: 2
- openings: fixed 16-opening PGN, sequential, 8 plies, repeated colors
- opening SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- adjudication: none
- runner: Cute Chess v1.3.1 at `1071d84cf272bd7deca0964336bf02e367e2b22b`
- large NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- small NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- candidate deterministic bench: `2,050,811` nodes, 907,037 NPS on that runner
- SF18 deterministic bench: `2,050,811` nodes, 932,610 NPS on that runner

Candidate versus accepted Crab:

- games: **256**
- W/D/L: **25 / 206 / 25**
- score: **50.000%**
- Elo estimate: **0.0 Elo**
- draw-aware normal 95% CI: **[-18.86, +18.86] Elo**

Candidate versus immutable SF18:

- games: **256**
- W/D/L: **28 / 195 / 33**
- score: **49.023%**
- Elo estimate: **-6.79 Elo**
- draw-aware normal 95% CI: **[-27.64, +14.02] Elo**

These results show no detected regression against the accepted Crab baseline in this small screen, but both confidence intervals include zero and are far too wide to support a strength or parity claim. The SF18 point estimate is negative, so it would be especially inappropriate to describe this result as matching or beating SF18.

## Decision

**ADVANCE TO LARGER INDEPENDENT STRENGTH CONFIRMATION; DO NOT PROMOTE YET.**

The optimization has reproduced its throughput direction twice, remains deterministic and sanitizer-clean, and produced a 25/206/25 dead-even first screen against the accepted Crab baseline. That is enough evidence to spend additional game-test budget, not enough evidence to alter the accepted baseline.

The next gate is a fresh-runner matched-resource confirmation with **512 games per opponent** under the same Threads=1, Hash=64 MiB, `3+0.03`, fixed-opening, repeated-color conditions. Promotion remains forbidden unless the accumulated evidence is statistically meaningful and consistent with a non-regressing optimization. Any future statement about Stockfish 18 parity or superiority requires substantially stronger matched-resource evidence than these screening runs.
