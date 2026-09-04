# EXP-0009: Cache TT replacement score

## Status

**UNDER TEST.** No performance or strength claim is made until the required gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `c8bd40810bbfe915a5e616558082df6066cbb1cf`
- Candidate branch: `exp/0009-cache-tt-replacement-score`
- Engine-change commit: `25c996b5a537991a820ef5e42fd63b45b21bb5dd`

## Focused hypothesis

`TranspositionTable::probe()` scans a fixed three-entry cluster to choose the least valuable replacement entry after a miss. The accepted implementation recomputes the current replacement entry's score, `depth8 - relative_age(generation8)`, on each loop iteration.

EXP-0009 caches the current replacement score and updates it only when a new replacement candidate wins.

Hypothesis: avoiding one redundant `relative_age()`/score computation in the common case can reduce instruction overhead in the extremely hot TT miss path while preserving the exact replacement order and policy.

Counter-risk: the compiler may already keep the current score live, or the extra local/value bookkeeping may produce equal or worse code.

## Candidate change

Only `engine/src/tt.cpp` engine semantics are touched. The change:

- leaves the TT key-hit scan unchanged;
- initializes `replaceValue` from entry 0 once;
- computes each candidate entry score once;
- updates both `replace` and `replaceValue` only when the same original comparison says to replace.

No TT format, cluster size, hit precedence, replacement policy, evaluation/search constants, NNUE data, UCI identity, executable branding, GPLv3 notice, or Stockfish attribution text is changed.

Patch artifact: `experiments/EXP-0009-cache-tt-replacement-score.patch`.

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

Strength testing is **not started** until a positive performance result reproduces independently. If EXP-0009 reaches that gate, it must be tested with matched resources against both accepted Crab and untouched SF18, with W/D/L, Elo estimate/confidence interval or SPRT result, CPU/compiler, Threads/Hash, time control, opening checksum, NNUE checksums, and binary hashes recorded.

## Current decision

Pending correctness and throughput evidence. No Elo gain, SF18 parity, or SF18 superiority claim exists for EXP-0009.
