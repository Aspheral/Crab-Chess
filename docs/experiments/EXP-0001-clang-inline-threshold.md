# EXP-0001 — Clang/LLVM inline threshold 500

## Status

**REJECTED for Crab's current supported toolchain/hardware profile.**

The candidate preserved deterministic chess behavior but failed the required throughput gate on both generic x86-64 and AVX2 GitHub-hosted runners. It is not part of the accepted Crab baseline.

## Hypothesis

For optimized Clang/LLVM builds, increasing LLVM's inlining threshold to `500` could improve search throughput without changing chess semantics, node counts, or deterministic search behavior.

Candidate flag:

```text
-Xclang -mllvm -Xclang -inline-threshold=500
```

## Upstream research provenance

This experiment was based on a post-SF18 upstream optimization by Yen-Chao Shen (lemteay):

- upstream commit: `005f0f9b2a59d858a1f7d8dd33fd4327b47a8bd7`
- upstream title: `Raise inline threshold for clang/llvm`
- upstream STC: 29,952 games, W 7,843 / L 7,549 / D 14,560
- upstream LLR: `2.93 (-2.94,2.94) <0.00,2.00>`
- reported upstream speedup: `+2.96%` over 100 benchmark runs
- upstream environment: Clang 21.1.8 / AMD Ryzen 9 7945HX

The upstream result remains valid evidence for that environment, but Crab does not assume a compiler optimization transfers unchanged across LLVM versions and CPUs.

## Crab baseline

- frozen upstream source: Stockfish 18 tag `sf_18`
- frozen upstream commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- deterministic baseline bench nodes: `2050811`
- Crab derived baseline branch: `crab/sf18-derived-base`

## Correctness results

All correctness/infrastructure gates passed:

- GCC build: PASS
- Clang build: PASS
- Crab UCI identity/handshake: PASS
- deterministic bench: PASS, exactly `2,050,811` nodes
- ASan/UBSan smoke: PASS
- web smoke: PASS

Therefore the candidate was behavior-preserving in the tested configuration.

## Performance result 1 — generic x86-64

GitHub-hosted runner, 6 alternating pairs after warmup:

- baseline median: `632,185 NPS`
- candidate median: `630,346 NPS`
- median delta: `-0.2909%`
- paired-median delta: `-0.2603%`

Result: no reproduced benefit.

## Performance result 2 — AVX2

Environment:

- Ubuntu 24.04 GitHub-hosted runner
- Clang `18.1.3`
- AMD EPYC 7763 virtualized runner
- `ARCH=x86-64-avx2`
- 10 alternating pairs
- 2 warmup runs per binary

Results:

- baseline median: `1,001,372 NPS`
- candidate median: `986,756 NPS`
- baseline mean: `998,502 NPS`
- candidate mean: `982,766.6 NPS`
- median delta: `-1.4596%`
- paired-median delta: `-1.4619%`

Every sample searched exactly `2,050,811` nodes.

## Decision

**Reject.** Crab will not enable this optimization by default and will not count it as a performance or Elo improvement.

The most plausible reason for the disagreement with the upstream result is toolchain/hardware sensitivity: the upstream test used Clang 21.1.8 on a Ryzen 9 7945HX, while Crab's reproduction used Clang 18.1.3 on a virtualized EPYC 7763. We may revisit the experiment if Crab's supported compiler baseline moves to LLVM 21+ or if dedicated benchmark hardware becomes available.

The experiment is retained as a negative result so we do not accidentally repeat it without new evidence.
