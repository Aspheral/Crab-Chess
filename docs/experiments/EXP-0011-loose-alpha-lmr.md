# EXP-0011: Reduce LMR less aggressively in loose alpha windows

## Status

**REJECTED.** Correctness passed, but the matched-resource screen did not demonstrate an improvement over the latest accepted Crab baseline. The candidate was not promoted and PR #31 was closed unmerged.

No Stockfish 18 parity or superiority claim is made. The positive point estimate against SF18 is statistically inconclusive and is recorded only as experiment evidence.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start and after rejection: `e8cefaae1523776b4e783e2cb04cfa7389a08433`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Tested candidate wrapper SHA: `a3434c26745a54b2f4540f882ed68cb651a037c0`
- Workflow checkout SHA: `1e8465e7f56f9f1e1346652f58a0befe10dfaa26`
- Candidate patch SHA-256: `1d8afa8b3e8af624d879ff0c49e71e0625cfdacce544c06a9c9e0e32b5612c3e`
- Applied engine diff SHA-256: `b446be6c1757cb33a57dbc6c6ac0a6eb7feb48a1476b1fbfd9ffed4d75ccf053`

The actual tested engine source is reproducibly identified by the accepted Crab SHA plus exact patch SHA-256 plus applied engine-diff SHA-256. This deliberately distinguishes the experiment-wrapper commit from the post-patch engine source produced inside CI.

## Focused hypothesis

EXP-0011 tested one functional search change in the late-move-reduction path. For non-captures under non-decisive alpha it added, after history scaling:

`r += 3 * std::clamp(alpha - eval, -64, 96)`

The hypothesis was that quiet moves in loose alpha windows could be over-reduced and would benefit from a bounded alpha-versus-static-evaluation adjustment.

The idea was adapted from post-SF18 Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2`. Upstream results were motivation only and were not counted as Crab evidence.

## Correctness evidence

Valid workflow run: `33835572850`

Evidence artifact: `exp0011-strength-a3434c26745a54b2f4540f882ed68cb651a037c0`

Artifact digest: `sha256:6f7086912ce10fdd16352c16d9f9396109b40ad65bcd57be63a226cb33a60ee0`

All required gates passed:

- patch applied cleanly and changed only `engine/src/search.cpp`;
- GCC and Clang builds passed and UCI identity remained Crab Chess;
- ASan/UBSan smoke passed;
- accepted Crab deterministic bench: exactly `2050811` nodes;
- untouched SF18 deterministic bench: exactly `2050811` nodes;
- candidate deterministic bench: exactly `2347163` nodes on both identical runs;
- NNUE checksums matched across candidate, accepted Crab, and untouched SF18;
- normal Crab CI, including website smoke, passed.

The earlier patch-checksum failure was harness bookkeeping before patch application and generated no candidate evidence. The valid run pinned the exact patch listed above.

## Strength protocol

- CPU: AMD EPYC 7763 64-Core Processor, 4 visible logical CPUs
- Clang: 18.1.3
- GCC correctness build: 13.3.0
- architecture: `x86-64-avx2`
- Cute Chess commit: `1071d84cf272bd7deca0964336bf02e367e2b22b` (v1.3.1 checkout)
- Threads: 1
- Hash: 64 MiB
- time control: `3+0.03`
- concurrency: 2
- 512 games per opponent
- opening suite SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- sequential openings, 8 plies, repeated colors
- adjudication: none

Binary SHA-256:

- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- candidate: `546db943b54b57fe2c0338a93202cb338874b1d8ac2f6f4888c20633c58d022f`
- untouched SF18: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

## Results

### Candidate vs accepted Crab

- W/D/L: **48 / 412 / 52** (512 games)
- score: **49.609375%**
- Elo estimate: **-2.7144**
- 95% CI: **[-16.0369, +10.6001] Elo**
- method: draw-aware normal 95% CI, screening estimate, not SPRT

The direct comparison did not demonstrate an improvement over accepted Crab.

### Candidate vs untouched Stockfish 18

- W/D/L: **49 / 426 / 37** (512 games)
- score: **51.171875%**
- Elo estimate: **+8.1445**
- 95% CI: **[-4.1832, +20.4928] Elo**
- method: draw-aware normal 95% CI, screening estimate, not SPRT

The positive point estimate is statistically inconclusive and is not evidence of SF18 parity or superiority.

## Decision

**REJECTED, not promoted.** A larger confirmation run on this exact candidate is not justified because the first direct matched screen against the latest accepted Crab baseline failed to demonstrate a gain. The engine patch remains outside accepted Crab.

Accepted Crab therefore remains `e8cefaae1523776b4e783e2cb04cfa7389a08433` with EXP-0004 engine semantics. Immutable SF18 remains `cb3d4ee9b47d0c5aae855b12379378ea1439675c` with official bench `2050811`.
