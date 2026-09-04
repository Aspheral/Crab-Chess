# EXP-0008: Unroll fixed-size TT probe loops

## Status

**UNDER TEST.** No performance or strength claim is made until the required gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0008-unroll-tt-probe`
- Engine-change commit: `2dfd1491f964ecf55f7e365d509c43338fe09f1a`

## Focused hypothesis

`TranspositionTable::probe()` is executed at extremely high frequency. Crab inherits Stockfish 18's fixed three-entry TT cluster and currently uses two small counted loops: one to scan the three entries for a key hit and another to select the least valuable replacement entry.

EXP-0008 explicitly unrolls those fixed-size loops while preserving the exact comparison order and replacement policy.

Hypothesis: making the three-entry control flow explicit can reduce loop/control overhead or produce a more favorable instruction layout on the tested Clang AVX2 build.

Counter-risk: modern optimizing compilers may already fully unroll these constant-trip-count loops, making the source change neutral or slightly worse through code-size or branch-layout effects.

## Candidate change

Only `engine/src/tt.cpp` engine semantics are touched. The change:

- replaces the `ClusterSize == 3` key-scan loop with three ordered key comparisons;
- replaces the two-iteration replacement-selection loop with the same two ordered comparisons;
- preserves hit precedence, `TTEntry::read()`, occupancy behavior, generation aging, replacement value calculation, cluster size/layout, hash size, and writer selection.

No evaluation constants, pruning constants, move ordering, TT format, TT replacement policy, NNUE values, search logic, UCI identity, executable branding, GPLv3 notice, or Stockfish attribution text is changed.

Patch artifact: `experiments/EXP-0008-unroll-tt-probe.patch`.
Patch SHA-256: `d6feac67270cba95e40529f472a013a159696624a5d84caaa82fb79488e85cca`.

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

Strength testing is **not started** until a positive performance result reproduces independently. If EXP-0008 reaches that gate, it must be tested with matched resources against both accepted Crab and untouched SF18, with W/D/L, Elo estimate/confidence interval or SPRT result, CPU/compiler, Threads/Hash, time control, opening checksum, NNUE checksums, and binary hashes recorded.

## Current decision

Pending correctness and throughput evidence. No Elo gain, SF18 parity, or SF18 superiority claim exists for EXP-0008.
