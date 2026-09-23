# EXP-0039 — child futility multiplier 76 → 74

Status: **PROMISING / REPLICATION REQUIRED**

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

## First completed screen

Workflow run `35796041753`, evidence artifact `10726211853`, artifact digest `sha256:4bfabbeb4f0e279622017b2a79508349a4cdab442cb36a95a5f1dbde1a741600`.

Validation gates passed before games: accepted/candidate builds, Crab UCI identity, deterministic bench capture, sanitizer smoke, NNUE/opening checksum validation, and immutable SF18 bench validation. The applied candidate engine tree recorded SHA `4a21396eee5405f025949c2bfe79aeda92bad3ab`; candidate engine-diff SHA-256 `41deb4fdd0cbde58f3d25787ead774d70e2d4b12ddca9c255753d00656e97682`; candidate patch SHA-256 `ea37089ff71f906ac87777736f2080e054b7e9602b7aab1472a21a78edaf7e96`.

- Candidate vs accepted Crab: **49 W / 423 D / 40 L**, 512 games, score **50.8789%**, screening Elo **+6.11**, draw-aware 95% CI **[-6.44, +18.67]**.
- Candidate vs immutable SF18: **53 W / 429 D / 30 L**, 512 games, score **52.2461%**, screening Elo **+15.62**, draw-aware 95% CI **[+3.55, +27.72]**.

The direct-Crab result is positive but statistically unresolved, so this is not promotion evidence. The SF18 screen is encouraging context only and is not a parity/superiority claim. Per bank-stack-ablate policy, the consistently positive first screen warrants an exact replication before final classification. A documentation-only branch update is used to trigger the same validation/strength workflow without changing the candidate patch.

## Audit fields

Preserve candidate/wrapper SHA, accepted SHA, immutable SF18 SHA, patch SHA-256, applied engine-diff SHA-256, compiler/CPU, binary checksums, NNUE/opening checksums, deterministic benches, UCI identity, sanitizer output, PGNs, W/D/L, score, Elo estimate/CI, replication/ablation evidence, and final classification.