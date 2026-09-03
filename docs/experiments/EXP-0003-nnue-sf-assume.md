# EXP-0003 — Compiler-visible NNUE assumptions

## Status

**Positive first pass; confirmation in progress.** The accepted Crab engine source is still unchanged. CI applies `experiments/EXP-0003-nnue-sf-assume.patch` only to the candidate build until the result is independently confirmed on another hosted runner.

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

## First Crab reproduction

Environment:

- GitHub hosted Ubuntu 24.04 runner
- Clang 18.1.3
- AMD EPYC 7763
- `ARCH=x86-64-avx2`
- 10 alternating control/candidate pairs after 2 warmups

Correctness and safety:

- candidate patch applied cleanly
- GCC and Clang baseline CI passed
- candidate UCI identity remained Crab Chess
- candidate deterministic bench remained exactly `2,050,811` nodes
- candidate ASan/UBSan smoke passed

Throughput:

- baseline median: `985,729 NPS`
- candidate median: `994,814 NPS`
- median speedup: **`+0.9217%`**
- paired median speedup: **`+0.8238%`**
- baseline mean/stdev: `982,785.4 / 19,704.38 NPS`
- candidate mean/stdev: `991,716.3 / 9,128.31 NPS`

This is Crab's first positive local performance result after EXP-0001 and EXP-0002 were rejected. It is promising but modest enough that Crab requires a larger second paired run before promotion.

## Confirmation plan

Repeat the same control-versus-candidate test on a fresh hosted runner with 20 alternating pairs after 2 warmups. Promotion requires the confirmation run to remain positive while preserving all correctness gates.

## Result

**Provisional positive: +0.92% median NPS / +0.82% paired median. Awaiting confirmation before source promotion.**
