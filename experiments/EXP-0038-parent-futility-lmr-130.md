# EXP-0038 — parent futility LMR coefficient 127 → 130

Status: **RUNNING / UNCLASSIFIED**

## Immutable controls

- Accepted Crab baseline: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Stockfish 18 tag: `sf_18`
- Stockfish 18 commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Accepted Crab deterministic bench gate: `2146293`

## Applicability

Current accepted Crab has parent-node quiet futility value:

`ss->staticEval + 42 + 161 * !bestMove + 127 * lmrDepth + 85 * (ss->staticEval > alpha)`

This experiment changes only the `lmrDepth` coefficient from 127 to 130. The hypothesis is that a slightly larger reduced-depth contribution improves shallow parent futility pruning decisions without altering the surrounding depth gate, SEE pruning, history adjustment, or other search logic.

## Method

The candidate is carried as a one-line patch and is not merged into accepted `main`. Validation requires clean accepted/candidate builds, `id name Crab Chess`, deterministic bench capture, ASan/UBSan smoke, NNUE/opening checksums, exact immutable SF18 bench validation, then matched 512-game screens versus accepted Crab and untouched SF18 using Threads=1, Hash=64 MiB, `3+0.03`, fixed sequential 8-ply openings, repeated colors, concurrency 2, and no adjudication.

The 512-game screens are triage only. A positive but unresolved direct Crab signal is eligible for exact replication or banking under the bank-stack-ablate policy; a clear negative is rejected; a flat result without complementary rationale stays out of the stack.

## Audit fields

Candidate/wrapper SHA, patch SHA-256, applied engine-diff SHA-256, accepted SHA, immutable SF18 SHA, compiler/CPU, binary checksums, NNUE/opening checksums, deterministic benches, UCI identity, sanitizer output, PGNs, W/D/L, score, Elo estimate/CI, replication/ablation evidence, and final classification are to be preserved in workflow artifacts and this record when the run completes.
