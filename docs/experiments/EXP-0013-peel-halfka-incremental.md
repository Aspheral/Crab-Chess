# EXP-0013: Peel one HalfKAv2 incremental-update iteration on AVX2

## Status

**REJECTED BEFORE IMPLEMENTATION (NOT APPLICABLE).** No engine candidate was generated, no strength or performance claim is made, and accepted Crab engine semantics remain unchanged.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage when EXP-0013 was proposed: `5c460c30922ed634e5259e0d3a7c242b8f834427`
- Current `main` used to preserve this audit record: `ee82233f76fc74927e8faa664a1d0488c5e9408f`
- Accepted Crab engine semantics at proposal time: EXP-0004
- Upstream motivation: Stockfish commit `8bc5caa2e4b1d4c189b1428e93158b10d3edb0b6`, authored by Timothy Herchen and merged 2026-08-29

## Focused hypothesis

On AVX2 builds, the incremental HalfKAv2 PSQ feature-update lists are normally only one or two entries long. The proposed experiment was to replace a generic indexed loop in that incremental path with one unconditional first update plus one conditional second update, reducing loop/control overhead without changing engine semantics.

## Upstream motivation only

The post-SF18 Stockfish change reported successful general and AVX2 STC, a failed AVX512ICL STC, and approximately +1.17% local throughput. Those results motivated EXP-0013 but are **not Crab evidence**.

## Applicability audit

The experiment was stopped at the source-applicability gate before creating an engine candidate.

Crab's SF18-derived `engine/src/nnue/nnue_accumulator.cpp` does **not** contain the generic PSQ incremental loop targeted by upstream commit `8bc5caa2...`. Its PSQ one-move incremental path already:

1. asserts `added` and `removed` list cardinalities of one or two;
2. uses fixed-arity `AccumulatorUpdateContext::apply<...>()` instantiations for the 1/1, 1/2, 2/1 and 2/2 cases;
3. feeds those indices into compile-time fused operations rather than iterating a runtime PSQ feature list.

The generic list-based `updateContext.apply(added, removed)` path in this Crab tree is used for `ThreatFeatureSet`, not the PSQ incremental path targeted by the upstream HalfKA optimization.

Therefore the stated optimization has already been structurally superseded in this SF18-derived tree. Importing the later Stockfish patch literally is impossible without first replacing Crab's existing fixed-arity implementation with a less specialized abstraction; attempting an approximate rewrite would no longer test the focused EXP-0013 hypothesis.

## Evidence record

- Candidate engine SHA: **none generated**
- Accepted Crab baseline SHA at proposal time: `5c460c30922ed634e5259e0d3a7c242b8f834427`
- Immutable SF18 baseline SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Engine source changes: **none**
- Compiler / CPU: **N/A; stopped before build gate**
- Threads / Hash: **N/A; stopped before match gate**
- NNUE checksums: **not re-measured; no engine or network change was made**
- Candidate bench: **N/A; no candidate binary exists**
- Accepted baseline bench: `2050811` (existing accepted control)
- SF18 official bench: `2050811`
- W/D/L: **N/A; strength testing not authorized**
- Elo / confidence / SPRT: **N/A**
- Website / WASM impact: **none; documentation-only experiment record**

## Decision

**REJECT / NO-OP.** EXP-0013 is closed as not applicable to the current Crab architecture. No engine code is promoted or reverted because no candidate engine code was committed.

This is an evidence-preserving rejection, not a negative strength result. It says only that the proposed optimization does not correspond to the current Crab PSQ incremental implementation. It provides no evidence for or against Stockfish 18 parity or superiority.
