# EXP-0039 — child futility multiplier 76 → 74

Status: **RUNNING / UNCLASSIFIED**

## Immutable controls

- Accepted Crab baseline: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Stockfish 18 tag: `sf_18`
- Stockfish 18 commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Accepted Crab deterministic bench gate: `2146293`

## Applicability and hypothesis

Accepted Crab's child-node futility margin uses `Value futilityMult = 76 - 23 * !ss->ttHit;`. EXP-0037 tested 76 → 78 and finished flat/slightly negative, so it was not banked. EXP-0039 probes the opposite, deliberately small direction, 76 → 74. This changes only the base multiplier and preserves the TT-hit adjustment, improving/opponent-worsening terms, correction-history contribution, depth gate, and return expression.

A slightly smaller margin makes child futility pruning modestly more aggressive. The hypothesis is that the accepted threshold may retain a small number of low-value nodes whose search cost is better spent elsewhere. This is an isolated tuning probe, not an assumption that symmetry with EXP-0037 implies benefit.

## Method

Candidate remains outside accepted `main`. Require clean accepted/candidate builds, `id name Crab Chess`, deterministic bench capture, ASan/UBSan smoke, NNUE/opening checksums, exact immutable SF18 bench validation, then matched 512-game triage screens versus accepted Crab and untouched SF18 at Threads=1, Hash=64 MiB, `3+0.03`, sequential fixed 8-ply openings, repeated colors, concurrency 2, no adjudication.

Positive but unresolved direct-Crab evidence is eligible for replication or STACK-ELIGIBLE banking. Clear negative is rejected. Flat evidence without plausible complementary value remains outside the stack. No individual screen is a parity/superiority claim.

## Audit fields

Preserve candidate/wrapper SHA, accepted SHA, immutable SF18 SHA, patch SHA-256, applied engine-diff SHA-256, compiler/CPU, binary checksums, NNUE/opening checksums, deterministic benches, UCI identity, sanitizer output, PGNs, W/D/L, score, Elo estimate/CI, replication/ablation evidence, and final classification.