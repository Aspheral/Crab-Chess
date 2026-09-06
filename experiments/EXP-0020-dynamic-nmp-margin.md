# EXP-0020: dynamic null-move reduction from evaluation margin

Status: **RUNNING / UNCLASSIFIED**

Accepted Crab baseline: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`

Immutable upstream comparison: official Stockfish 18 tag `sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench `2050811`.

## Hypothesis

Crab currently uses the SF18-style null-move reduction `R = 7 + depth / 3`. When corrected static evaluation is well above beta, increasing the null-move reduction in proportion to that margin may spend fewer nodes proving overwhelmingly favorable cut nodes, improving search efficiency and playing strength.

The candidate changes only the reduction expression to:

`R = 7 + depth / 3 + max(0, (staticEval - beta) / 256)`.

## Prior evidence, not Crab evidence

This is adapted from official post-SF18 Stockfish commit `9d4090e82685cca447265dcd7093d617cb34a107` by Ayush (`ayushthepiro11-design`). Upstream reported passed STC (85,504 games) and LTC (205,800 games). Those results establish plausibility only and are not treated as Crab strength evidence.

The inherited Stockfish GPLv3/copyright notices remain unchanged. Crab retains its public UCI/build identity. Upstream authorship for this candidate is recorded here and in the PR evidence.

## Required Crab gates

- patch applies exactly to current accepted Crab
- engine diff is limited to `engine/src/search.cpp`
- GCC and Clang AVX2 builds succeed
- candidate reports Crab Chess UCI identity
- GCC and Clang produce the same deterministic candidate bench signature, repeated under Clang
- ASan/UBSan smoke passes
- accepted Crab control reproduces deterministic bench `2673975`
- immutable SF18 reproduces official bench `2050811`
- network and opening checksums are recorded
- candidate, accepted Crab, and SF18 binaries/checksums are recorded where available
- 512 matched games vs latest accepted Crab
- 512 matched games vs immutable SF18
- Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed openings at 8 plies, repeated colors, no adjudication

A 512-game result is triage. Positive but unresolved evidence should be replicated rather than automatically discarded. No promotion occurs from this branch.
