# EXP-0014: Simplify parent futility-value formula

## Status

**ACTIVE CANDIDATE, not promoted.** No strength claim is made until Crab's dedicated correctness, deterministic-bench, and matched-resource strength gates complete.

No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `7e1cececd54f7786513be8bdbd6f722fd70cb926`
- Accepted Crab engine semantics: EXP-0004
- Candidate branch: `exp/0014-simplify-futility-value`
- Upstream motivation: Stockfish commit `c85637b3f1e85dd802e4bdef6c68b63a4babbb7d`, `Simplify futilityValue formula`

## Focused hypothesis

Crab's current quiet-move parent futility expression contains a `161 * !bestMove` term:

`staticEval + 42 + 161 * !bestMove + 127 * lmrDepth + 85 * (staticEval > alpha)`.

EXP-0014 removes only that boolean-dependent term and compensates with the corresponding non-best-move offset, yielding:

`staticEval + 127 * lmrDepth + 85 * (staticEval > alpha) + 203`.

This mirrors the arithmetic-shape simplification tested later upstream while retaining Crab's own SF18-derived tuned coefficients. The upstream result is motivation only and is not counted as Crab evidence.

Because the expression changes for the first/best move case, EXP-0014 is a **functional search experiment**. A changed candidate bench signature is permitted, but the candidate bench must reproduce exactly across repeated runs. Both accepted Crab and immutable SF18 controls must independently remain at `2050811`.

## Scope

Candidate engine scope is one expression in `engine/src/search.cpp`, represented by `experiments/EXP-0014-simplify-futility-value.patch`. No network, UCI identity, build-target, website, licensing, or upstream-attribution files are changed by the candidate.

## Required evidence before decision

- patch applies cleanly to accepted Crab baseline;
- focused diff confirms only the intended `engine/src/search.cpp` expression changes;
- GCC correctness build and UCI identity smoke;
- Clang `x86-64-avx2` build;
- ASan/UBSan smoke;
- candidate deterministic bench repeated twice with identical node count;
- accepted Crab control bench exactly `2050811`;
- immutable SF18 checkout exactly `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, bench exactly `2050811`;
- NNUE checksums recorded;
- 512 matched games candidate vs accepted Crab;
- 512 matched games candidate vs immutable SF18;
- Threads=1, Hash=64 MiB, `3+0.03`, repeated colors, fixed sequential 8-ply openings, concurrency=2, no adjudication;
- W/D/L, Elo estimate and 95% confidence interval recorded for both matches;
- candidate SHA, baseline SHA, compiler/CPU, binary/network/opening checksums, match-runner SHA, benches and PGNs preserved in the evidence artifact.

## Decision rule

Do not promote on a positive point estimate alone. Reject a clearly negative candidate. Treat overlapping-zero screens as inconclusive unless independent replication or a longer statistically meaningful test resolves them. Never infer SF18 parity or superiority from this 512-game screening stage alone.
