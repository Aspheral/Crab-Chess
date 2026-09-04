# EXP-0015 — Simplify Internal Iterative Reductions condition

Status: RUNNING

## Hypothesis

Remove only the `priorReduction <= 3` guard from Crab's Step 10 Internal Iterative Reductions condition:

```cpp
if (!allNode && depth >= 6 && !ttData.move && priorReduction <= 3)
```

becomes:

```cpp
if (!allNode && depth >= 6 && !ttData.move)
```

This makes IIR apply whenever the existing Crab PV/Cut-node, depth, and no-TT-move conditions hold, regardless of the previous ply's LMR reduction.

## Provenance and prior evidence

The hypothesis is adapted from official post-SF18 Stockfish commit `b1053e6` ("Simplify Internal Iterative Reductions (IIR) Condition"). Upstream reported passing STC, LTC, and VTC non-regression tests. Those upstream results are prior evidence only; they are not Crab evidence and do not justify promotion by themselves.

Crab deliberately ports only the removal of the `priorReduction <= 3` predicate. It does not import unrelated later Stockfish search changes or the later `followPV` condition.

## Frozen baselines

- Accepted Crab repository baseline: `a46219d83de20f0c35837d5c06e92caf73512ec2`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`

## Candidate isolation

The branch contains an exact one-hunk patch in `EXP-0015-simplify-iir-condition.patch`. The dedicated workflow applies it only to `engine/src/search.cpp`, verifies that no other engine path changes, records the patch SHA-256 and applied diff SHA-256, and records a canonical post-patch Git tree identity in addition to the branch wrapper SHA.

## Required correctness gates

1. Patch applies exactly and changes only `engine/src/search.cpp`.
2. GCC x86-64-avx2 build succeeds.
3. Clang x86-64-avx2 build succeeds.
4. Public UCI identity remains Crab Chess.
5. GCC and Clang produce the same deterministic candidate bench signature.
6. Two independent Clang candidate benches match exactly.
7. ASan/UBSan UCI + depth-3 smoke passes.
8. Accepted Crab control remains exactly `2050811` nodes.
9. Untouched SF18 control remains exactly `2050811` nodes.
10. Network and opening checksums are recorded.

Because this is a functional search change, the candidate bench is allowed to differ from `2050811`, but it must be deterministic across compilers/runs.

## Strength screen

If all correctness gates pass:

- 512 games candidate vs accepted Crab
- 512 games candidate vs immutable SF18
- Threads = 1
- Hash = 64 MiB
- TC = `3+0.03`
- concurrency = 2
- fixed sequential opening suite, 8 opening plies
- repeated colors
- no adjudication
- Cute Chess v1.3.1, exact source SHA recorded

Promotion requires positive evidence against the latest accepted Crab baseline and must survive independent replication. A positive point estimate against SF18 alone is insufficient.

## Decision rule

- ACCEPT only with reproducible positive strength evidence against accepted Crab.
- REJECT if direct Crab evidence is negative or replication fails.
- INCONCLUSIVE if uncertainty remains too large to justify promotion.

No SF18 parity or superiority claim may be made from this screen.
