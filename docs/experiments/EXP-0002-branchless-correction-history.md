# EXP-0002 — Branchless correction-history update

## Status

**REJECTED on Crab's current supported AVX2 baseline.**

The candidate preserved deterministic chess behavior under GCC and Clang and passed sanitizer checks, but it produced a clear throughput regression in Crab's paired GCC/AVX2 reproduction. It is not part of the accepted Crab engine baseline.

## Provenance

Based on post-SF18 upstream commit `542c30c292d1623b6b4cd710b2ed9ca621bfd589` (`Branchless correction history with to_sq_unchecked`). Upstream reported a positive 92,384-game STC result: W 24,052 / D 44,667 / L 23,665, LLR `2.93 (-2.94,2.94) <0.00,2.00>`, and classified the patch as no functional change.

Crab treats upstream results as useful prior evidence, not automatic acceptance.

## Crab control

- official SF18 tag: `sf_18`
- frozen upstream SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- accepted Crab base: `crab/sf18-derived-base`
- deterministic control signature: exactly `2,050,811` nodes

## Correctness results

All gates passed:

- candidate patch applies cleanly
- GCC candidate build
- Clang candidate build
- Crab UCI identity
- GCC exact `2,050,811`-node bench
- Clang exact `2,050,811`-node bench
- candidate ASan/UBSan smoke
- baseline CI, sanitizers, and web smoke

## Performance reproduction

Environment:

- Ubuntu 24.04 GitHub-hosted runner
- GCC 13.3.0
- AMD EPYC 7763 virtualized under Microsoft
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

**Reject.** Crab does not apply the patch and does not count it as a performance or strength gain. Revisit only with materially new compiler/hardware evidence or a later Crab code state that changes the cost model.
