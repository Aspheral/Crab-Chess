# EXP-0007: Hoist FullThreats orientation invariants

## Status

**UNDER TEST.** No performance or strength claim is made until the required gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0007-hoist-full-threat-orientation`
- Initial engine-change commit: `824e9f4995b5ae813b4ec3e1efb264a0864b0d38`

## Focused hypothesis

`FullThreats::append_active_indices()` reconstructs every active threat index during a full threat-accumulator refresh. In accepted Crab, every call to `FullThreats::make_index()` recomputes three values that are invariant across many indices in that refresh:

- king/perspective orientation;
- perspective color swap;
- oriented attacker identity for the current attacker piece.

EXP-0007 hoists those invariants out of the per-threat indexing path. A small internal helper consumes the precomputed orientation, swap, and oriented attacker while preserving the existing `FullThreats::make_index()` interface for incremental threat updates.

Hypothesis: eliminating repeated orientation/swap/attacker bookkeeping during full FullThreats reconstruction can slightly reduce instruction overhead without changing feature indices, NNUE weights, evaluation values, or search semantics.

Counter-risk: the compiler may already perform equivalent common-subexpression elimination/inlining, making the source-level hoist neutral or slightly harmful through register pressure/code shape.

## Candidate change

Only `engine/src/nnue/features/full_threats.cpp` engine semantics are changed. The modification:

- introduces an always-inline `make_index_oriented()` helper containing the existing final LUT/index calculation;
- keeps `FullThreats::make_index()` behavior intact by computing the same values and forwarding to the helper;
- computes orientation and perspective swap once per `append_active_indices()` invocation;
- computes oriented attacker identity once per attacker piece loop;
- uses those precomputed invariants for pawn and non-pawn active threat indices.

No pruning constants, evaluation constants, move ordering, NNUE values, search logic, threat feature mapping, UCI identity, executable branding, GPLv3 notice, or upstream attribution text is changed.

Patch artifact: `experiments/EXP-0007-hoist-full-threat-orientation.patch`.
Patch SHA-256: `e1ad5cd9764a4f81f8d11eaa5ee47bb443845fd5418dae6f0d310cad6a6adc3f`.

## Required gates

1. Native GCC build.
2. Native Clang build.
3. Address/undefined sanitizer smoke.
4. UCI identity remains Crab Chess.
5. Playable website smoke remains functional.
6. Candidate deterministic bench is exactly `2050811` nodes.
7. Accepted Crab control deterministic bench is exactly `2050811` nodes.
8. Large and small NNUE SHA-256 checksums match between control and candidate.
9. Paired Clang AVX2 throughput screen: Threads=1, Hash=16 MiB, 20 alternating pairs, 2 warmups, exact `2050811` nodes per timed sample.
10. A positive throughput screen must reproduce on a fresh runner before any matched-resource strength testing begins.

## Strength testing policy

Strength testing is **not started** until the performance hypothesis reproduces. If it reaches that gate, the candidate must be tested with matched resources against both:

- accepted Crab `0fb724d48004b8e405700c83d09c2e54f7655575`;
- untouched SF18 `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.

The final record must include W/D/L, Elo estimate and confidence interval or SPRT result, CPU/compiler, Threads/Hash, time control, opening checksum, NNUE checksums, and candidate/control binary hashes.

## Workflow audit note

Unlike EXP-0006, both EXP-0007 throughput workflows use a full-history candidate checkout and `set -euo pipefail` for source-diff verification. This prevents the shallow-checkout/empty-diff hash failure mode observed in EXP-0006.

## Current decision

Pending correctness and throughput evidence. No Elo gain, SF18 parity, or SF18 superiority claim exists for EXP-0007.
