# EXP-0013: Peel one HalfKAv2 incremental-update iteration on AVX2

## Status

**PLANNED / ACTIVE.** No strength or performance claim is made yet.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `5c460c30922ed634e5259e0d3a7c242b8f834427`
- Accepted Crab engine semantics: EXP-0004
- Candidate branch: `exp/0013-peel-halfka-incremental`
- Upstream motivation: Stockfish commit `8bc5caa2e4b1d4c189b1428e93158b10d3edb0b6`, authored by Timothy Herchen and merged 2026-08-29

## Focused hypothesis

On AVX2 builds, the incremental HalfKAv2 PSQ feature-update lists are normally only one or two entries long. Replacing the generic indexed loop in that incremental path with one unconditional first update plus one conditional second update may reduce loop/control overhead in a hot NNUE accumulator path without changing engine semantics.

The candidate must be gated to AVX2-compatible builds. It must not be generalized to AVX512 or other architectures without independent evidence.

## Upstream motivation only

The post-SF18 Stockfish change reported:

- general STC: 96,192 games, 24,637 / 47,291 / 24,264, LLR 2.96 for `<0.00,2.00>`;
- AVX2 STC: 61,024 games, 15,789 / 29,778 / 15,457, LLR 2.94 for `<0.00,2.00>`;
- AVX512ICL STC: **failed**, 90,368 games, 22,968 / 44,312 / 23,088, LLR -2.96;
- upstream therefore gated the change to AVX2;
- local upstream timing over 500 runs reported base 1,907,788 +/- 1,384 vs test 1,930,017 +/- 1,426, approximately +1.17%.

These results motivate EXP-0013 but are **not Crab evidence**.

## Intended candidate scope

Engine source scope should be limited to `engine/src/nnue/nnue_accumulator.cpp` plus experiment/harness documentation.

The intended adaptation is the smallest SF18-compatible form of the upstream optimization:

1. specialize the PSQ incremental feature application path for the known-small update list;
2. assert the incremental-list cardinality expected by the existing update logic;
3. apply element 0 directly and element 1 only when present;
4. retain the generic loop for non-incremental/full-refresh paths;
5. gate the specialization to AVX2 so architectures for which upstream evidence was neutral/negative retain existing code.

Crab naming, UCI identity, executable naming, GPLv3 notices, Stockfish copyright, modification notices, and upstream attribution must remain intact.

## Required correctness gates

Before performance or strength conclusions:

- exact source-scope audit;
- GCC correctness build;
- Clang `x86-64-avx2` build;
- Crab Chess UCI identity check;
- ASan/UBSan smoke;
- candidate deterministic bench twice;
- accepted Crab deterministic bench control;
- immutable SF18 checkout at the exact SHA and official `2050811` bench;
- unchanged large/small NNUE checksums;
- no website regression.

Because the upstream patch is classified as no functional change, the candidate is expected to retain the accepted deterministic bench signature. Any bench divergence blocks performance testing until explained.

## Evidence plan

This is primarily a throughput hypothesis. First run a paired fresh-process AVX2 throughput screen against accepted Crab with alternating order and fixed nodes. Only if the speed result is clearly positive and reproducible on an independent fresh runner should matched-resource games be authorized.

If strength testing is reached, use the existing Crab matched protocol against both:

1. latest accepted Crab baseline;
2. untouched SF18 at `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.

Record candidate SHA, baseline SHA, compiler/CPU, architecture, Threads/Hash, network checksums, test settings, deterministic bench, W/D/L, Elo confidence interval or SPRT result, and evidence artifact digest.

## Decision rule

Reject/revert on correctness failure, deterministic-bench mismatch without a justified functional change, non-positive or noisy throughput evidence, or strength evidence that does not justify promotion. Never infer Stockfish 18 parity or superiority from upstream tests or from a small Crab screen.
