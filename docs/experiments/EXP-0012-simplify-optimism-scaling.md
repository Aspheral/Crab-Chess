# EXP-0012: Simplify optimism scaling arithmetic

## Status

**REJECTED, not promoted.** The candidate passed correctness and deterministic-bench requirements, but two independent matched-resource strength screens did not provide statistically meaningful evidence of an improvement over the accepted Crab baseline.

No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `8b76be93c34840fb6f2f6042b03f5d686a15b4cd`
- Accepted Crab engine semantics: EXP-0004
- Candidate branch: `exp/0012-simplify-optimism-scaling`
- Tested candidate SHA: `1bb0b8b170b51114f8de03f6ccd7b3766dcd2b63`
- Upstream motivation: Stockfish commit `2edd935bbb3ea6e484a1700f582a95e0ee773ec2`, `Simplify optimism scaling formula`
- Candidate engine-diff SHA-256: `598a66e932f49be71a542e2da35cad0a32020136832f76a9cea19e39e9d8a770`

## Focused hypothesis

The candidate rewrote the SF18-era NNUE/optimism blend in `engine/src/evaluate.cpp` so the exact `nnue * 77871` contribution was taken outside the numerator division. The motivation was to simplify the arithmetic while retaining Crab's SF18-era constants.

Because signed integer division truncation can make the expressions differ by a unit in edge cases, this was treated as a **functional evaluation experiment**, not a no-functional-change optimization.

The later Stockfish commit was motivation only. Its testing was not counted as Crab evidence.

## Candidate scope and correctness

Functional engine scope was exactly one expression in `engine/src/evaluate.cpp`. Both independent runs passed the dedicated correctness/provenance gates:

- GCC correctness build;
- Clang AVX2 build;
- Crab Chess UCI identity;
- ASan/UBSan smoke;
- focused engine-scope verification;
- accepted Crab control bench exactly `2050811`;
- untouched SF18 control at the immutable SHA, bench exactly `2050811`;
- candidate deterministic bench exactly `2256520` on repeated runs;
- identical Crab/SF18 NNUE checksums;
- pinned Cute Chess source;
- complete audit manifests and PGNs.

The repository-wide generic Crab CI expected candidate bench `2050811` and therefore failed this intentionally functional experiment. That generic failure is not a correctness failure for EXP-0012; the dedicated workflow required candidate bench determinism while independently enforcing `2050811` on both controls.

## Test environment

Both strength attempts used matched settings:

- Clang: 18.1.3
- GCC correctness build: 13.3.0
- CPU: AMD EPYC 7763 64-Core Processor, 4 visible logical CPUs on the hosted runner
- architecture: `x86-64-avx2`
- Threads: 1
- Hash: 64 MiB
- time control: `3+0.03`
- concurrency: 2
- games per opponent per attempt: 512
- openings: fixed sequential 8-ply openings with repeated colors
- adjudication: none
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- opening-book SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`

Binary SHA-256:

- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0012 candidate: `df8e6cc698b577fea20da9020083c6ad53497906e40bf19fedb2695d987f1348`
- immutable SF18: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

## Attempt 1

Workflow run: `33856897562`, attempt 1.

Evidence artifact digest: `sha256:4c6a40619e01cf1e9b84ca4d5d39168b8003efb54a68e0f86e7855ded38d803e`

- vs accepted Crab: **56 / 406 / 50**, score `50.5859375%`, **+4.0717 Elo**, 95% CI **[-9.6333, +17.7894]**
- vs untouched SF18: **44 / 420 / 48**, score `49.609375%`, **-2.7144 Elo**, 95% CI **[-15.4921, +10.0559]**

Decision after attempt 1: **INCONCLUSIVE**. A fresh rerun on the exact same candidate SHA was authorized.

## Attempt 2: independent replication

Workflow run: `33856897562`, attempt 2.

Evidence artifact digest: `sha256:445501ec6870d8f734c4087bb3b65535815e636752e80029e263b5a19152afed`

- vs accepted Crab: **44 / 424 / 44**, score `50.0000000%`, **0.0000 Elo**, 95% CI **[-12.4943, +12.4943]**
- vs untouched SF18: **46 / 430 / 36**, score `50.9765625%`, **+6.7867 Elo**, 95% CI **[-5.2559, +18.8456]**

## Combined screening evidence

Combining the two independent 512-game screens only after attempt 2 passed the same gates:

### Candidate vs accepted Crab

- games: 1024
- W/D/L: **100 / 830 / 94**
- score: `50.29296875%`
- Elo estimate: **+2.0358**
- draw-aware normal 95% CI: **[-7.2315, +11.3060]**

### Candidate vs immutable SF18

- games: 1024
- W/D/L: **90 / 850 / 84**
- score: `50.29296875%`
- Elo estimate: **+2.0358**
- draw-aware normal 95% CI: **[-6.7406, +10.8148]**

These are screening estimates, not SPRT results. Both confidence intervals comfortably include zero. The two independent direct Crab screens produced +4.07 Elo and 0.00 Elo point estimates, and the aggregate is only about +2.04 Elo.

## Decision

**REJECTED, not promoted.** EXP-0012 does not provide sufficiently strong evidence that the functional arithmetic change improves accepted Crab. The candidate source is not merged into the accepted engine lineage.

Accepted Crab engine semantics remain EXP-0004. The immutable SF18 comparison baseline remains `cb3d4ee9b47d0c5aae855b12379378ea1439675c` with official deterministic bench `2050811`.
