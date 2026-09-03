# EXP-0006: Active FullThreats LUT-row prefetch

## Status

**UNDER TEST.** No performance or strength claim is made until the required gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0006-active-threat-prefetch`
- Initial engine-change commit: `7e1ffa39d1c6ca5ead5e89f9160e45bc6bb47834`

## Focused hypothesis

During a full FullThreats refresh, each non-pawn source square can generate several threat indices. `make_index()` consumes one byte from the 64-byte `index_lut2[attacker][from]` slice for every target. EXP-0006 issues one low-locality read prefetch for that slice immediately after selecting the source square and before enumerating its occupied attack targets.

Hypothesis: fetching that one cache-line-sized LUT slice once per non-pawn source square can reduce lookup latency during full threat-index reconstruction without changing feature indices, NNUE weights, evaluation values, or search semantics.

Counter-risk: `index_lut2` is small enough that it may already be hot, making the prefetch pure overhead or harmful cache traffic.

## Candidate change

Only `engine/src/nnue/features/full_threats.cpp` engine semantics are changed. The modification:

- computes the existing orientation and attacker-orientation values once before the non-pawn source loop;
- computes the oriented source square once per source piece;
- issues `prefetch<PrefetchRw::READ, PrefetchLoc::LOW>` for `index_lut2[attackerOriented][fromOriented][0]` before target enumeration.

No pruning constants, evaluation constants, move ordering, NNUE values, search logic, UCI identity, executable branding, GPLv3 notice, or upstream attribution text is changed.

Patch artifact: `experiments/EXP-0006-active-threat-lut-prefetch.patch`.

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

## Current decision

Pending correctness and throughput evidence. No Elo gain, SF18 parity, or SF18 superiority claim exists for EXP-0006.
