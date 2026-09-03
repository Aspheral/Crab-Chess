# EXP-0003 — Compiler-visible NNUE assumptions

## Status

**Candidate under validation.** The accepted Crab engine source is not modified by this experiment. CI applies `experiments/EXP-0003-nnue-sf-assume.patch` only to the candidate build.

## Hypothesis

Expose NNUE accumulator size invariants more clearly to the compiler, including Clang's `__builtin_assume`, cache repeated `IndexList::size()` results in local integers, and mark impossible size combinations unreachable. This may improve optimized NNUE incremental-update code without changing chess semantics.

## Upstream research provenance

Based on post-SF18 upstream commit:

- commit: `9f968446cbbe7630b3044526359baef4f67fa62d`
- title: `Improve usage of sf_assume`
- upstream STC: 63,488 games
- W/L/D: 16,530 / 16,188 / 30,770
- LLR: `2.93 (-2.94,2.94) <0.00,2.00>`
- upstream classification: `No functional change`

Crab independently reproduces the change against its frozen SF18-derived baseline rather than assuming the later upstream result transfers to our compiler and hardware.

## Crab control

- accepted baseline branch: `crab/sf18-derived-base`
- deterministic bench signature: `2,050,811` nodes
- candidate patch: `experiments/EXP-0003-nnue-sf-assume.patch`

## Acceptance gates

1. Patch applies cleanly to the accepted Crab baseline.
2. Candidate builds under Clang AVX2.
3. Candidate UCI identity remains Crab Chess.
4. Candidate bench remains exactly `2,050,811` nodes.
5. Candidate passes ASan/UBSan smoke testing.
6. Paired same-runner Clang AVX2 throughput testing must show a repeatable positive result before the source change can be promoted.
7. A positive throughput result is not automatically claimed as Elo. Any strength claim requires separate game testing.

## Result

Pending Crab validation.
