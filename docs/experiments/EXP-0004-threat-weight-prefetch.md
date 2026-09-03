# EXP-0004 — Threat-weight row L2 prefetch

## Status

**Candidate under validation.** The accepted Crab engine source is unchanged. CI applies `experiments/EXP-0004-threat-weight-prefetch.patch` only to the candidate build.

## Hypothesis

Threat-feature indices are computed hundreds of cycles before their corresponding NNUE threat-weight rows are consumed. Prefetching the relevant rows with low locality can place the data in L2 without unnecessarily polluting L1, reducing memory stalls in the threat-feature accumulator hot path.

## Upstream research provenance

Based on post-SF18 Stockfish commit:

- commit: `238ef05bb0a306589ce5e5876bc34b68d43354a0`
- title: `Prefetch threat weight rows during append_changed_indices`
- upstream classification: `No functional change`
- STC first run: 120,800 games, LLR `2.96 (-2.94,2.94) <0.00,2.00>`
- LTC: 86,850 games, LLR `2.94 (-2.94,2.94) <0.50,2.50>`
- STC SMP: 84,480 games, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- STC second sanity run: 132,192 games, LLR `2.93 (-2.94,2.94) <0.00,2.00>`

The upstream implementation uses `__builtin_prefetch` locality 1 on GCC/Clang, which maps to a low-locality cache prefetch appropriate for the large threat-weight table.

## Crab control

- accepted baseline branch: `crab/sf18-derived-base`
- deterministic baseline signature: `2,050,811` nodes
- candidate patch: `experiments/EXP-0004-threat-weight-prefetch.patch`

## Initial acceptance gates

1. Upstream patch must apply cleanly to Crab with only the repository path prefix adjusted via `git apply --directory=engine`.
2. Control and candidate must both build with Clang using `ARCH=x86-64-avx2`.
3. Candidate UCI identity must remain Crab Chess.
4. Candidate bench must remain exactly `2,050,811` nodes.
5. Candidate must pass ASan/UBSan smoke testing.
6. Run 20 alternating control/candidate benchmark pairs after 2 warmups on the same hosted runner.
7. A candidate must show a repeatable positive paired throughput result before source promotion. Any Elo claim requires game testing rather than NPS inference.

## Result

Pending Crab validation.
