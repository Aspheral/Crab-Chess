# STACK-0002: EXP-0021 + EXP-0023 + EXP-0025

## Classification

**REJECTED / NOT PROMOTION-ELIGIBLE** after the complete audited 512-game screen against both controls.

The stack combined the EXP-0021 loose-alpha quiet-move LMR adjustment, EXP-0023 simplified non-PV razoring margin, and EXP-0025 inexact TT window-mismatch penalty. EXP-0023 was already present in accepted `main`; the candidate patch applied only the EXP-0021 and EXP-0025 deltas to avoid double application.

## Provenance

- Stack workflow / wrapper commit: `d8d0691306c94d0e4dd1eb88f1e78f0d68da767d`
- Candidate head: `f14c88aff2e5b5226d76d9e77bed380672d4b52c`
- Accepted Crab baseline: `917fa7fff1124343c145838aafcd59aa6c64d356`
- Immutable Stockfish 18: `sf_18`, `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 bench: `2050811`
- Accepted Crab bench: `2146293`
- Candidate bench: `2537739`
- Workflow run: `34446141002`
- Evidence artifact: `stack0002-exp0021-exp0023-exp0025-evidence` (artifact id `10142197845`)
- Artifact SHA-256: `73d2085fec03402f712b5cd36af8724ca0747ad06b3ba69b46d5394acc7d92ce`
- Post-patch tree identity: `0e7968d433a9c5f28137667619ab6cb67bf27f9f`

## Validation gates

Completed successfully:

- provenance capture
- patch normalization and verification
- GCC build and deterministic bench
- Clang build and bench reproduction
- ASan/UBSan smoke
- accepted Crab control build
- immutable SF18 control build
- NNUE and opening checksum verification
- pinned Cute Chess build
- 512-game candidate vs accepted Crab
- 512-game candidate vs immutable SF18
- audit manifest generation
- evidence artifact upload

Controls: Threads=1, Hash=64 MiB, 3+0.03, 512 games per leg, sequential fixed 8-ply openings with repeated colors, concurrency=2, no adjudication.

## Strength results

All values are screening estimates with draw-aware normal 95% confidence intervals, not SPRT results.

| Opponent | Games | W-D-L | Score | Elo estimate | 95% CI |
|---|---:|---:|---:|---:|---:|
| Accepted Crab | 512 | 47-408-57 | 49.023% | -6.79 | -20.37 to +6.78 |
| Immutable SF18 | 512 | 45-410-57 | 48.828% | -8.14 | -21.60 to +5.28 |

## Decision rationale

The stack produced a negative point estimate against both the accepted Crab baseline and immutable SF18. The confidence intervals cross zero, so the screen does not prove a precise loss, but there is no positive direct-Crab signal supporting replication, ablation, or promotion. Under the bank-stack policy, this stack is not stack-eligible and is archived without further games.

No parity or superiority claim versus SF18 is made. Accepted Crab `main` remains unchanged. Complete evidence, including PGNs, checksums, build provenance, and audit manifest, remains preserved in the workflow artifact.
