# EXP-0024 — Static-evaluation null-move reduction

Status: DRAFT / UNMERGED / SCREEN PENDING

Accepted Crab baseline: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a` (deterministic bench `2673975`).

Immutable Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`, official deterministic bench `2050811`).

## Hypothesis

Crab's accepted null-move pruning still uses a depth-only reduction:

`R = 7 + depth / 3`

Test one focused post-SF18 idea: make null-move reduction slightly more aggressive when static evaluation already exceeds beta, using:

`R = 7 + depth / 3 + max((staticEval - beta) / 256, 0)`

and pair it with the upstream decisive-range guard `beta >= -2000` so the more aggressive reduction is not used deep inside losing/mating-score territory.

The hypothesis is adapted from official Stockfish commit `356d7c5c12b982e10f400d35d2dffac62613f60e` ("Reintroduce static evaluation based NMP reduction"). Upstream evidence passed STC (`206720` games, `53724/99830/53166`) and LTC (`106344` games, `27926/50946/27472`). These results are prior evidence only and are not Crab evidence.

## Applicability

Current accepted Crab still has `R = 7 + depth / 3` and guards NMP with `!is_loss(beta)`, so the static-evaluation reduction term and stricter beta threshold are not already present. The candidate touches only the existing Step 9 null-move search block in `engine/src/search.cpp`.

A separate applicability check rejected official commit `7da31a1f1d8e16721ca2fd430c44fcb4b99b0bec` (simplify futility multiplier) without games because accepted Crab's current futility formulation has already diverged and no longer contains the upstream interpolation being simplified.

## Validation policy

The dedicated workflow applies the isolated patch to a wrapper branch derived from exact accepted main and requires:

- patch/scope verification with only `engine/src/search.cpp` changed;
- Crab Chess UCI identity under GCC and Clang;
- reproducible deterministic candidate bench across compilers and repeated Clang runs;
- ASan/UBSan smoke;
- exact accepted-Crab and immutable-SF18 controls;
- NNUE and opening checksums;
- pinned Cute Chess provenance;
- matched 512-game triage legs versus accepted Crab and untouched SF18 at Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed 8-ply openings with repeated colors, and no adjudication;
- complete audit JSON, PGNs, binary/patch/diff hashes, canonical post-patch tree, compiler/CPU details, and match summaries.

A 512-game screen is triage only. Positive but unresolved evidence is eligible for exact replication; clear negative evidence is rejected; tiny non-harmful evidence may be banked only when it has plausible complementary value. No SF18 parity or superiority claim is implied by an SF18 screen.

GPLv3 licensing, inherited Stockfish copyright/upstream attribution, and Crab Chess public identity are preserved.