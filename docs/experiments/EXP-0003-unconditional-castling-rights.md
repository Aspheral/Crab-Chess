# EXP-0003 — Unconditional castling-rights update

## Status

**Candidate under validation.**

## Hypothesis

In `Position::do_move()`, remove the conditional branch guarding castling-rights/Zobrist updates and perform the three operations unconditionally. When no castling rights are present or no rights are affected, the operations are algebraically neutral; removing the branch may be cheaper than testing it on every move.

## Provenance

Based on post-SF18 upstream commit:

- commit: `24af6a6bc409541a3d6e5cab7c5923ac397476fd`
- title: `Update castling rights unconditionally.`
- upstream STC: 163,680 games
- W/D/L: 42,214 / 79,329 / 42,137
- LLR: `2.93 (-2.94,2.94) <-1.75,0.25>`
- upstream classification: no functional change

The patch landed shortly after SF18 and applies directly to Crab's frozen SF18-derived `Position::do_move()` implementation.

## Crab control

- frozen upstream SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- accepted Crab base: `crab/sf18-derived-base`
- deterministic control signature: exactly `2,050,811` nodes

## Candidate patch

`tools/experiments/patches/EXP-0003-unconditional-castling-rights.patch`

## Acceptance gates

1. Patch applies cleanly to accepted Crab.
2. Candidate compiles with GCC and Clang.
3. UCI identity remains Crab Chess.
4. Exact deterministic bench remains `2,050,811` nodes under GCC and Clang.
5. Candidate ASan/UBSan smoke passes.
6. Paired GCC/AVX2 throughput test must not show a clear regression.
7. Any acceptance is a reproduced micro-optimization, not a Crab-original Elo claim.

## Result

Pending.
