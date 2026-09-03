# EXP-0002 — Branchless correction-history update

## Status

**REJECTED on Crab's current supported AVX2 baseline.**

The candidate preserved deterministic chess behavior under GCC and Clang and passed sanitizer checks, but it produced a clear throughput regression in Crab's paired GCC/AVX2 reproduction. It is not part of the accepted Crab engine baseline.

## Hypothesis

Replace the conditional continuation-correction-history update with a masked branchless path. The candidate adds `Move::to_sq_unchecked()` so the low six move bits can be read without firing the normal validity assertion; when the move is invalid, the history bonuses are multiplied by zero.

The intended benefit was to remove a branch from frequently executed search bookkeeping while preserving chess behavior.

## Provenance

Based on post-SF18 upstream commit:

- commit: `542c30c292d1623b6b4cd710b2ed9ca621bfd589`
- title: `Branchless correction history with to_sq_unchecked`
- upstream STC: 92,384 games
- W/D/L: 24,052 / 44,667 / 23,665
- LLR: `2.93 (-2.94,2.94) <0.00,2.00>`
- upstream classification: no functional change

The positive upstream result remains valid evidence for that later upstream environment. Crab does not assume that a no-functional-change patch is automatically faster on every compiler/CPU combination.

## Crab control

- engine lineage: official SF18 tag `sf_18`
- frozen upstream SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- accepted Crab base: `crab/sf18-derived-base`
- control bench signature: exactly `2,050,811` nodes

## Correctness results

All correctness gates passed:

- patch applies cleanly: PASS
- GCC candidate build: PASS
- Clang candidate build: PASS
- Crab UCI identity: PASS
- GCC deterministic bench: PASS, exactly `2,050,811` nodes
- Clang deterministic bench: PASS, exactly `2,050,811` nodes
- candidate ASan/UBSan smoke: PASS
- baseline CI/sanitizers/web: PASS

This is strong evidence that the patch was behavior-preserving in the tested configuration.

## Performance reproduction

Environment:

- Ubuntu 24.04 GitHub-hosted runner
- GCC 13.3.0
- AMD EPYC 7763 virtualized under Microsoft
- 4 logical CPUs exposed to the runner
- `ARCH=x86-64-avx2`
- 10 alternating control/candidate pairs
- 2 warmup runs per binary
- every timed sample searched exactly `2,050,811` nodes

Results:

- baseline median: `926,503 NPS`
- candidate median: `912,911 NPS`
- baseline mean: `911,189.2 NPS`
- candidate mean: `902,354.9 NPS`
- median delta: `-1.4670%`
- paired-median delta: `-1.2116%`

## Decision

**Reject.** Crab will not apply this patch to the accepted engine baseline and will not count it as a performance or strength gain.

The experiment can be revisited only with materially new evidence, such as a different compiler generation, dedicated bare-metal hardware, or a later Crab code state that changes branch prediction/cache behavior enough to justify retesting.

Keeping this negative result prevents the project from repeatedly rediscovering the same regression and keeps Crab's optimization history auditable.
