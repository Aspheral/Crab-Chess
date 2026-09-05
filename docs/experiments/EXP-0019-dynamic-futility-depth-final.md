# EXP-0019: Dynamic futility-pruning depth cutoff — Final audit

## Status

**REJECTED.** Not promoted. Accepted Crab engine semantics remain EXP-0004.

## Immutable references

- Accepted Crab baseline: `70a8cae334dbbad8fe2c893f60f95949ba298682`
- Candidate wrapper SHA: `c0f1f39810edd9833e494be20642aee81047e52c`
- Canonical post-patch tree: `7465a34f0ab8fe0ebe8254250dcf9a839c24a032`
- Official Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`
- Candidate deterministic bench: `2573191`

## Hypothesis

Replace Crab's fixed child-futility `depth < 14` gate with an eval/beta-aware mate-safety lookup cutoff while preserving Crab's existing futility-margin formula and surrounding pruning logic.

Official Stockfish commit `fa8b6add9df33cbdd279a3480df6c2cb2f43d6f8` was motivation only, not Crab evidence.

## Validation

The candidate passed focused patch verification, Crab Chess UCI identity, GCC/Clang AVX2 deterministic bench agreement, ASan/UBSan, accepted-Crab and immutable-SF18 control validation, NNUE/opening checksum verification, and pinned Cute Chess provenance.

## Matched-resource strength screen

Settings: Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, sequential 8-ply openings with repeated colors, 512 games/opponent, no adjudication.

- vs accepted Crab: **50 W / 412 D / 50 L**, score 50.0000%, **0.00 Elo**, draw-aware normal 95% CI **[-13.32, +13.32]**
- vs immutable SF18: **47 W / 420 D / 45 L**, score 50.1953%, **+1.36 Elo**, draw-aware normal 95% CI **[-11.42, +14.13]**

The direct Crab result is exactly flat and the SF18 result is statistically indistinguishable from zero. There is no positive signal strong enough to justify replication. EXP-0019 is rejected after its first complete screen.

## Audit provenance

- Patch SHA-256: `9d4382d3bc977e1496557ed21181928f2c9027a9406eee27bf041b46f8bb829a`
- Applied engine diff SHA-256: `e8427d4e3b003d5b6575c72f7032116381c970a4aae7cdf66cc1801d38ae1929`
- Evidence artifact digest: `b5533d551c70901deec21efe66d5f40207bb04dbadf2a10804cd73815a5d7239`
- CPU: AMD EPYC 9V74 80-Core Processor, 4 vCPU exposed
- Clang: 18.1.3
- GCC: 13.3.0
- NNUE SHA-256 large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- NNUE SHA-256 small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- Openings SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess: v1.3.1, source SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`

No Stockfish 18 parity or superiority claim is made.
