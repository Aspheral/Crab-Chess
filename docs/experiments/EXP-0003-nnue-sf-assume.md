# EXP-0003 — Compiler-visible NNUE assumptions

## Status

**REJECTED — first-pass gain did not reproduce.** The accepted Crab engine source remains unchanged. The candidate patch is retained only on the experiment branch as research history.

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

Crab independently reproduced the change against its frozen SF18-derived baseline instead of assuming the later upstream result transferred to our compiler and hardware.

## Crab control

- accepted baseline branch: `crab/sf18-derived-base`
- deterministic bench signature: `2,050,811` nodes
- experimental candidate patch: `experiments/EXP-0003-nnue-sf-assume.patch` on branch `exp/0003-nnue-sf-assume`

## Acceptance gates

1. Patch applies cleanly to the accepted Crab baseline.
2. Candidate builds under Clang AVX2.
3. Candidate UCI identity remains Crab Chess.
4. Candidate bench remains exactly `2,050,811` nodes.
5. Candidate passes ASan/UBSan smoke testing.
6. Paired same-runner Clang AVX2 throughput testing must show a repeatable positive result before source promotion.
7. Throughput alone is not an Elo claim.

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

The first pass looked promising, so Crab required a larger fresh-runner confirmation before promotion.

## Confirmation reproduction

Environment:

- fresh GitHub hosted Ubuntu 24.04 runner
- Clang 18.1.3
- AMD EPYC 7763
- `ARCH=x86-64-avx2`
- 20 alternating control/candidate pairs after 2 warmups

Correctness and safety again passed:

- patch applied cleanly
- candidate compiled successfully
- Crab UCI identity remained intact
- candidate bench remained exactly `2,050,811` nodes
- candidate ASan/UBSan smoke passed

Throughput:

- baseline median: `973,339 NPS`
- candidate median: `974,257 NPS`
- median speedup: **`+0.0943%`**
- paired median speedup: **`-0.1437%`**
- baseline mean/stdev: `971,363.6 / 23,882.86 NPS`
- candidate mean/stdev: `970,832.25 / 17,106.45 NPS`

The candidate's raw median was effectively flat, while the paired median and mean both favored the control. The larger confirmation therefore failed the repeatability gate.

## Result

**REJECTED.** EXP-0003 preserves correctness but does not demonstrate a repeatable throughput improvement on Crab's current Clang 18 / EPYC environment. The candidate source change is not promoted.
