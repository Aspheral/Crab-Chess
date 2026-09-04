# EXP-0014: Simplify parent futility-value formula

## Status

**REJECTED.** The focused search change was not promoted. Two independent 512-game matched-resource screens against the accepted Crab baseline produced a negative aggregate estimate, and the SF18 comparison was also statistically unresolved. No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `7e1cececd54f7786513be8bdbd6f722fd70cb926`
- Accepted Crab engine semantics: EXP-0004
- Candidate SHA: `e55e93ac52ae0b49e7d62f0cf73144a1b41941ab`
- Candidate branch: `exp/0014-simplify-futility-value`
- Upstream motivation only: Stockfish commit `c85637b3f1e85dd802e4bdef6c68b63a4babbb7d`, `Simplify futilityValue formula`

## Focused hypothesis

Crab's quiet-move parent futility expression contained:

`staticEval + 42 + 161 * !bestMove + 127 * lmrDepth + 85 * (staticEval > alpha)`.

EXP-0014 tested removing only the boolean-dependent term and compensating with the corresponding non-best-move offset:

`staticEval + 127 * lmrDepth + 85 * (staticEval > alpha) + 203`.

This was a functional search experiment. The candidate changed only the intended `engine/src/search.cpp` expression, represented by `experiments/EXP-0014-simplify-futility-value.patch` on the experiment branch.

## Correctness and reproducibility

Both independent runs passed the focused-scope and correctness gates:

- GCC correctness build and Crab Chess UCI identity smoke;
- Clang `x86-64-avx2` build;
- ASan/UBSan smoke;
- candidate deterministic bench reproduced exactly at `2466635` nodes;
- accepted Crab control bench exactly `2050811`;
- immutable SF18 checkout exactly `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, bench exactly `2050811`;
- NNUE checksums matched the immutable SF18 networks.

## Match settings

Both runs used the same matched-resource configuration:

- Threads: `1`
- Hash: `64 MiB`
- Time control: `3+0.03`
- Games per comparison per run: `512`
- Openings: fixed sequential 8-ply set, repeated colors
- Concurrency: `2`
- Adjudication: none
- CPU: AMD EPYC 9V74
- Clang: 18.1.3
- GCC: 13.3.0
- Cute Chess SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- NNUE checksums: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`

## Results

### Attempt 1

Candidate vs accepted Crab, 512 games:

- W/D/L: **44 / 419 / 49**
- Score: 49.5117%
- Elo estimate: **-3.39**
- Draw-aware 95% CI: **[-16.24, +9.44]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **47 / 421 / 44**
- Score: 50.2930%
- Elo estimate: **+2.04**
- Draw-aware 95% CI: **[-10.67, +14.74]**

Evidence artifact digest: `sha256:612165887430f2fdb58c605f245cec8feb83881c22820b96043d72d55012f646`.

### Attempt 2

Candidate vs accepted Crab, 512 games:

- W/D/L: **42 / 409 / 61**
- Score: 48.1445%
- Elo estimate: **-12.90**
- Draw-aware 95% CI: **[-26.41, +0.57]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **30 / 439 / 43**
- Score: 48.7305%
- Elo estimate: **-8.82**
- Draw-aware 95% CI: **[-20.19, +2.53]**

Evidence artifact digest: `sha256:8ee951146a3fc73a3ed5722c9ed7f08090d8d49d8a0c599366aa4d0f85c3278c`.

### Aggregate descriptive summary

Across the two independent screens against accepted Crab, the candidate scored **86 W / 828 D / 110 L** over 1024 games, score 48.8281%, corresponding to approximately **-8.14 Elo** with a draw-aware normal 95% CI of approximately **[-17.46, +1.16]**.

Across the two independent SF18 screens, the candidate scored **77 W / 860 D / 87 L** over 1024 games, score 49.5117%, corresponding to approximately **-3.39 Elo** with a draw-aware normal 95% CI of approximately **[-11.92, +5.13]**.

These aggregate intervals are descriptive screening statistics, not an SPRT result and not evidence of SF18 parity.

## Decision

Reject EXP-0014 and leave the accepted Crab engine unchanged. The direct accepted-Crab evidence trends negative across both independent runs and does not justify promotion. The experiment branch remains useful only as an auditable record of the rejected candidate.
