# EXP-0002 — Branchless correction-history update

## Status

**Candidate under validation.**

## Hypothesis

Replace the conditional continuation-correction-history update with a masked branchless path. The candidate adds `Move::to_sq_unchecked()` so the low six move bits can be read without firing the normal validity assertion; when the move is invalid, the history bonuses are multiplied by zero.

The goal is to remove a branch from a frequently executed search bookkeeping path while preserving deterministic chess behavior.

## Provenance

Based on post-SF18 upstream commit:

- commit: `542c30c292d1623b6b4cd710b2ed9ca621bfd589`
- title: `Branchless correction history with to_sq_unchecked`
- upstream STC: 92,384 games
- W/D/L: 24,052 / 44,667 / 23,665
- LLR: `2.93 (-2.94,2.94) <0.00,2.00>`
- upstream classification: no functional change

Crab treats this only as evidence that the idea is worth reproducing. It is not accepted until Crab's own gates pass.

## Crab control

- engine lineage: official SF18 tag `sf_18`
- frozen upstream SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- accepted Crab base: `crab/sf18-derived-base`
- control bench signature: exactly `2,050,811` nodes

## Candidate patch

`tools/experiments/patches/EXP-0002-branchless-correction-history.patch`

The experiment workflow builds the control binary, applies that patch, then builds the candidate binary from the same checkout.

## Acceptance gates

1. Patch must apply cleanly to the accepted Crab base.
2. GCC and Clang candidate builds must succeed.
3. UCI identity remains Crab Chess.
4. Candidate must preserve the exact `2,050,811` deterministic bench node signature.
5. ASan/UBSan candidate smoke must pass.
6. Paired same-runner NPS test must not show a clear throughput regression.
7. Because the upstream test is positive but our local CI cannot reproduce tens of thousands of games, the change can only be promoted as a provisional accepted micro-optimization after correctness + performance reproduction. It must not be counted as a Crab-original Elo gain.

## Result

Pending.
