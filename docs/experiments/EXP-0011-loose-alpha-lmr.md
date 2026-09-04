# EXP-0011: Reduce LMR less aggressively in loose alpha windows

## Status

**REJECTED.** Correctness passed, but the matched-resource screen did not demonstrate an improvement over the latest accepted Crab baseline. The candidate is not promoted.

No Stockfish 18 parity or superiority claim is made. The positive point estimate against SF18 is statistically inconclusive and is recorded only as experiment evidence.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `e8cefaae1523776b4e783e2cb04cfa7389a08433`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Candidate branch: `exp/0011-loose-alpha-lmr`
- Tested candidate branch SHA: `a3434c26745a54b2f4540f882ed68cb651a037c0`
- Workflow checkout SHA: `1e8465e7f56f9f1e1346652f58a0befe10dfaa26`
- Candidate patch: `experiments/EXP-0011-loose-alpha-lmr.patch`
- Candidate patch SHA-256: `1d8afa8b3e8af624d879ff0c49e71e0625cfdacce544c06a9c9e0e32b5612c3e`
- Applied engine diff SHA-256: `b446be6c1757cb33a57dbc6c6ac0a6eb7feb48a1476b1fbfd9ffed4d75ccf053`

The tested engine source is reproducibly identified by the tuple `(accepted Crab SHA, exact patch SHA-256, applied engine diff SHA-256)`. The experiment-wrapper branch SHA is recorded separately because the engine patch was applied by the workflow rather than committed directly into the wrapper tree.

## Focused hypothesis

In the late-move-reduction path, quiet moves searched under a loose alpha window can be over-reduced when the current static evaluation is materially below alpha. EXP-0011 adds a small bounded adjustment after history-based LMR scaling:

`r += 3 * std::clamp(alpha - eval, -64, 96)`

for non-captures while alpha is non-decisive.

Hypothesis: reducing LMR less aggressively when alpha is high relative to static evaluation lets promising quiet moves receive enough depth to improve playing strength, while the clamp limits the search-cost increase and allows the opposite adjustment when alpha is below eval.

## Upstream research provenance

The hypothesis is adapted from post-SF18 Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2`, authored by Adarsh Das and merged August 19, 2026, titled `Reduce LMR less aggressively in loose alpha windows`.

Upstream reported:

- STC: 90,784 games, W/D/L 23,707 / 43,758 / 23,319, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- LTC: 209,640 games, W/D/L 54,841 / 100,620 / 54,179, LLR `2.94 (-2.94,2.94) <0.50,2.50>`
- upstream post-change bench: `2132401`

Those upstream results motivated the Crab hypothesis only and were not counted as Crab evidence.

## Candidate change

The patch changes only `engine/src/search.cpp` after application and inserts the bounded alpha-eval LMR adjustment immediately after the existing history-based reduction adjustment.

No TT format, NNUE network data, UCI identity, executable branding, website branding, GPLv3 notice, Stockfish copyright, or upstream attribution notice is changed.

## Correctness evidence

Workflow run: `33835572850`

Artifact: `exp0011-strength-a3434c26745a54b2f4540f882ed68cb651a037c0`

Artifact digest: `sha256:6f7086912ce10fdd16352c16d9f9396109b40ad65bcd57be63a226cb33a60ee0`

All required gates passed:

- patch applied cleanly to accepted Crab and changed only `engine/src/search.cpp`;
- native GCC candidate build and Crab Chess UCI identity passed;
- native Clang AVX2 candidate build and UCI identity passed;
- candidate ASan/UBSan smoke passed;
- accepted Crab deterministic bench remained exactly `2050811` nodes;
- untouched SF18 deterministic bench remained exactly `2050811` nodes;
- candidate deterministic bench was exactly `2347163` nodes on both identical runs;
- large and small NNUE checksums matched across candidate, accepted Crab, and untouched SF18;
- normal Crab CI, including the website smoke, passed for the experiment head.

The first workflow attempt failed before patch application because the manifest contained an incorrect patch checksum. That was experiment-harness bookkeeping only. The search patch was not changed; the valid run pinned and verified the actual patch SHA-256 above.

## Matched-resource strength screen

Environment and protocol:

- CPU: AMD EPYC 7763 64-Core Processor, 4 visible logical CPUs on hosted runner
- Clang: 18.1.3
- GCC correctness build: 13.3.0
- architecture: `x86-64-avx2`
- Cute Chess: `1071d84cf272bd7deca0964336bf02e367e2b22b` (v1.3.1 checkout)
- Threads: 1
- Hash: 64 MiB
- time control: `3+0.03`
- concurrency: 2
- games per opponent: 512
- opening suite SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- opening order: sequential, 8 plies, repeated colors
- adjudication: none

Binary SHA-256:

- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0011 candidate: `546db943b54b57fe2c0338a93202cb338874b1d8ac2f6f4888c20633c58d022f`
- untouched SF18: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

### Candidate vs accepted Crab

- games: 512
- W/D/L: **48 / 412 / 52**
- score: **49.609375%**
- Elo estimate: **-2.7144**
- 95% CI: **[-16.0369, +10.6001] Elo**
- method: draw-aware normal 95% CI; screening estimate, not SPRT

The point estimate is negative and the interval spans both meaningful loss and gain. This does not provide evidence that EXP-0011 improves the accepted Crab baseline.

### Candidate vs untouched Stockfish 18

- games: 512
- W/D/L: **49 / 426 / 37**
- score: **51.171875%**
- Elo estimate: **+8.1445**
- 95% CI: **[-4.1832, +20.4928] Elo**
- method: draw-aware normal 95% CI; screening estimate, not SPRT

The positive point estimate is interesting but statistically inconclusive. It is not evidence of SF18 parity or superiority, and it cannot override the absence of demonstrated improvement versus the accepted Crab baseline.

## Decision

**REJECTED, not promoted.** EXP-0011 passed correctness but failed Crab's evidence gate for a functional search promotion because its direct matched comparison with the latest accepted Crab baseline did not demonstrate a gain. Spending a larger confirmation run on this exact candidate is not justified under the one-hypothesis evidence discipline.

PR #31 is closed unmerged. Accepted Crab remains `e8cefaae1523776b4e783e2cb04cfa7389a08433`, accepted engine semantics remain EXP-0004, and immutable SF18 remains `cb3d4ee9b47d0c5aae855b12379378ea1439675c` with official bench `2050811`.
