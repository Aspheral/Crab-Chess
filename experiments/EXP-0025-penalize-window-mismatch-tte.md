# EXP-0025 — Penalize window-mismatched inexact TTEs

Status: **DRAFT / EXPERIMENTAL / DO NOT MERGE**

Accepted Crab baseline: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a` (bench `2673975`).

Immutable upstream comparison baseline: official Stockfish 18 tag `sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench `2050811`.

## Hypothesis

When a sufficiently deep non-PV transposition-table entry has a valid inexact value but its bound points the wrong way for the current search window, decrement the stored depth by one. The intent is to reduce repeated reliance on a now-less-useful TTE, mitigating search explosions/endgame paralysis and improving search efficiency.

The isolated candidate is adapted from official post-SF18 Stockfish commit `319d61effdad40ac633425d6504a98f6d2ad0cd2` ("Penalize TTEs whose inexact value mismatches the current window"). Upstream evidence is prior evidence only: STC passed at 434,784 games and LTC passed at 81,018 games; the upstream VVLTC reversion test also supported retaining the change. Crab must establish its own direct evidence.

## Applicability

Current accepted Crab does not expose `TTWriter::penalize()` and its TT-cutoff block falls straight through to tablebase probing after a failed cutoff, so this behavior is absent. This experiment adds only the TTE-depth penalty mechanism and the matching failed-cutoff condition. It does not import unrelated later Stockfish tuning.

An immediately preceding candidate, upstream commit `924d29d3cab85f45a877a5da0eeeb73a52cb4b62` (first-picked-move reduction clamp removal), was screened out as inapplicable without games because accepted Crab already performs an unconditional first-picked-move reduction.

## Required gates

- isolated patch applies cleanly to current accepted Crab
- changed engine scope limited to `engine/src/search.cpp`, `engine/src/tt.cpp`, and `engine/src/tt.h`
- GCC and Clang AVX2 builds
- Crab Chess UCI identity
- reproducible deterministic candidate bench
- ASan/UBSan correctness smoke
- exact accepted-Crab control and immutable untouched SF18 control
- NNUE and opening SHA-256 validation
- pinned Cute Chess source identity
- matched 512-game screen vs accepted Crab and 512-game context screen vs untouched SF18
- complete audit manifest, binary checksums, PGNs, W/D/L, Elo estimate and draw-aware 95% interval

A 512-game screen is triage only. Clear negatives are rejected; a positive/non-harmful unresolved signal may be banked as STACK-ELIGIBLE and replicated when warranted. No Stockfish 18 parity or superiority claim may be inferred from this experiment.

GPLv3 licensing, inherited Stockfish copyright and attribution remain intact. Crab Chess remains the executable and UCI public identity; new experiment documentation and harness code are Crab-owned.