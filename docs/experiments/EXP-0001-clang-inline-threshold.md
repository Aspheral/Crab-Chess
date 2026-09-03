# EXP-0001 — Clang/LLVM inline threshold 500

## Status

**Candidate under validation.** Do not count this as an accepted Crab strength gain until Crab CI and paired testing are complete.

## Hypothesis

For optimized Clang/LLVM builds, increasing LLVM's inlining threshold to `500` can improve search throughput without changing chess semantics, node counts, or deterministic search behavior.

Crab applies the candidate only when `COMP=clang` and `CRAB_CLANG_INLINE=yes`:

```text
-Xclang -mllvm -Xclang -inline-threshold=500
```

The paired control is produced with `CRAB_CLANG_INLINE=no`.

## Upstream research provenance

This experiment is based on a post-Stockfish-18 upstream optimization by Yen-Chao Shen (lemteay), merged as:

- upstream commit: `005f0f9b2a59d858a1f7d8dd33fd4327b47a8bd7`
- upstream title: `Raise inline threshold for clang/llvm`
- upstream STC: 29,952 games, W 7,843 / L 7,549 / D 14,560
- upstream LLR: `2.93 (-2.94,2.94) <0.00,2.00>`
- reported upstream speedup: `+2.96%` over 100 benchmark runs on Clang 21.1.8 / Ryzen 9 7945HX
- reported upstream probability of positive speedup: `1.0000`

The upstream test occurred after the frozen SF18 control, so Crab treats it as an optimization candidate rather than part of the immutable SF18 baseline.

## Crab baseline

- frozen upstream source: Stockfish 18 tag `sf_18`
- frozen upstream commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- deterministic baseline bench nodes: `2050811`
- Crab derived baseline branch: `crab/sf18-derived-base`

## Acceptance gates

1. GCC build remains unaffected.
2. Clang candidate builds successfully.
3. UCI identity remains Crab Chess.
4. Deterministic bench remains exactly `2050811` nodes.
5. Sanitizer smoke tests remain green.
6. Candidate must show a repeatable throughput benefit in paired same-runner testing before being promoted as a Crab performance gain.
7. Because the change is compiler-only and was already strength-tested upstream, Crab may accept it as a build optimization after reproducible performance validation, but it must not be advertised as a novel Crab Elo gain.

## Reproduction

Control:

```bash
make clean
make baseline-build ARCH=x86-64 COMP=clang
./engine/src/crab bench
```

Candidate:

```bash
make clean
make candidate-build ARCH=x86-64 COMP=clang
./engine/src/crab bench
```

For serious timing comparisons, alternate control and candidate runs on the same physical machine, pin affinity/frequency policy where possible, warm the binaries first, and collect enough samples for confidence intervals.

## Result

Pending Crab validation.
