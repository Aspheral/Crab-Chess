# EXP-0019: Dynamic futility-pruning depth cutoff

## Status

**IN PROGRESS.** This candidate is not accepted, merged, or evidence of Stockfish 18 parity/superiority.

## Immutable references

- Accepted Crab baseline: `70a8cae334dbbad8fe2c893f60f95949ba298682`
- Accepted Crab engine semantics: EXP-0004
- Official Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 bench: `2050811`
- Upstream motivation only: official Stockfish commit `fa8b6add9df33cbdd279a3480df6c2cb2f43d6f8`

## Focused hypothesis

Crab currently uses a fixed `depth < 14` child-node futility-pruning cutoff. EXP-0019 keeps Crab's existing futility-margin formula intact and changes only the mate-safety depth gate to a lookup-based cutoff derived from `abs(eval) + abs(beta)`. The hypothesis is that selectively allowing deeper futility pruning in ordinary score ranges while backing off near extreme values can preserve or improve practical strength without sacrificing mate-finding behavior.

The candidate is stored as an experiment patch so accepted `main` remains untouched until evidence supports promotion.

## Required gates

- patch applies only to `engine/src/search.cpp`
- GCC/Clang AVX2 build agreement
- Crab Chess UCI identity
- repeated deterministic candidate bench
- ASan/UBSan smoke
- accepted Crab control and immutable SF18 control
- NNUE/opening checksum verification
- matched 512-game screens against accepted Crab and untouched SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency 2, repeated 8-ply openings, no adjudication

Official upstream test results are motivation only and are not Crab evidence.
