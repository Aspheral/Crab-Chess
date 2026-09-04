# EXP-0001 — Clang/LLVM inline threshold 500

## Status

**REJECTED.** The candidate preserved deterministic chess behavior but failed Crab's throughput gate and is not part of the accepted engine baseline.

## Candidate

```text
-Xclang -mllvm -Xclang -inline-threshold=500
```

The hypothesis came from post-SF18 upstream commit `005f0f9b2a59d858a1f7d8dd33fd4327b47a8bd7`, which reported a +2.96% benchmark result on Clang 21.1.8 / Ryzen 9 7945HX and passed a 29,952-game STC test.

## Crab reproduction

Frozen SF18-derived behavior: exactly `2,050,811` benchmark nodes.

Correctness gates all passed: GCC, Clang, Crab UCI identity, exact bench signature, ASan/UBSan smoke, and web smoke.

### Generic x86-64

- baseline median: `632,185 NPS`
- candidate median: `630,346 NPS`
- median delta: `-0.2909%`
- paired-median delta: `-0.2603%`

### AVX2

Environment: Ubuntu 24.04 GitHub-hosted runner, Clang 18.1.3, AMD EPYC 7763, `ARCH=x86-64-avx2`, 10 alternating pairs after 2 warmups.

- baseline median: `1,001,372 NPS`
- candidate median: `986,756 NPS`
- median delta: `-1.4596%`
- paired-median delta: `-1.4619%`

Every sample searched exactly `2,050,811` nodes.

## Decision

Do not enable the flag and do not count it as a Crab performance or Elo gain. The difference from upstream is likely toolchain/hardware sensitivity. Revisit only with materially new evidence, such as LLVM 21+ or dedicated benchmark hardware.
