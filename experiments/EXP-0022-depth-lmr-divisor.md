# EXP-0022 — Depth-shaped LMR history divisor

## Status

ARCHIVED / FLAT after exact-candidate replication. Do not merge into accepted Crab and do not include in the active cumulative stack absent new complementary evidence.

## Accepted baseline

- Accepted Crab: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Accepted Crab deterministic bench: `2673975`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`

## Hypothesis

Crab currently scales quiet-move LMR history with one constant divisor, `3208`, at every depth. Test whether a depth-shaped divisor can improve how history influences reductions without changing Crab's overall average divisor scale.

The candidate uses a 16-entry depth table derived from official post-SF18 Stockfish commit `95f3680080799d1a9e1b39ceec78a1eff789c6c2` ("Replace constant LMR history divisor with depth-based array"). Upstream passed STC and LTC strength tests plus a VLTC non-regression test. Those results are prior evidence only.

To isolate the *depth-shaping* hypothesis from a global LMR scaling shift, the upstream table is normalized so its arithmetic mean is Crab's current `3208` divisor (candidate mean `3208.0625`). This intentionally does not blindly copy upstream's lower absolute scale.

Candidate table:

`{3452, 3059, 3000, 2942, 3356, 3367, 3366, 2904, 2984, 3047, 3224, 3419, 3320, 2994, 3138, 3757}`

Only `engine/src/search.cpp` changes when the patch is applied. GPLv3 and inherited Stockfish notices remain intact. Crab Chess remains the executable/UCI/public identity.

## Applicability

Accepted Crab contains the exact constant quiet-history LMR term `lmrDepth += history / 3208;` and has no existing depth-indexed LMR-history divisor. The hypothesis was therefore applicable and not a duplicate of EXP-0021.

## Harness history

Runs #1-#3 failed in patch-application/hunk metadata before candidate compilation and contain zero strength evidence. Run #4 is the first complete semantic screen. Run #5 is an independent exact-candidate replication.

## Run #4 — first complete screen

Workflow run `34053982067` completed successfully with every correctness/provenance gate green and evidence artifact digest `sha256:aa0db84d85c99a76cc331027d15ec8ec30d1321f3b21b4381693008f60ebc140`.

Provenance/correctness:

- workflow wrapper SHA recorded by the run: `1f6ddf2847f7822eb7b46901d63acc4fc25ef3ad`
- accepted Crab SHA: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- patch SHA-256: `812cabb1050e0fb459673d558bfaf7d6efb92e1042d76a0c99eccb7b3058145d`
- applied engine-diff SHA-256: `07831e10747ac00c93d5ad42a86b8feee36cd46c629bec6ac429668e2bb8720b`
- canonical post-patch tree: `cc4da16bb1585f77c0aee10ab0a6964ffaabbb0a`
- candidate deterministic bench: `2470525`, reproduced across GCC/Clang and repeated Clang runs
- accepted Crab deterministic bench: `2673975`
- immutable SF18 deterministic bench: `2050811`
- GCC: `gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`
- Clang: `Ubuntu clang version 18.1.3 (1ubuntu1)`
- CPU: AMD EPYC 7763 64-Core Processor runner, 4 logical CPUs exposed
- candidate Clang binary SHA-256: `be986066067bfc910ea86db82e172c5b7d23c55b39a7cbac8af2303b84a54055`
- candidate GCC binary SHA-256: `282d3deaad23c7aced59cc9d7a6cfa4fb16f2e0fb12d2d2760531fce7bc4f1e1`
- accepted binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- NNUE checksums matched across candidate, accepted Crab, and SF18: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- openings SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed 8-ply openings with repeated colors, no adjudication

Strength:

- vs accepted Crab: **43 W / 433 D / 36 L**, 512 games, score **50.6836%**, Elo estimate **+4.75**, draw-aware 95% CI **[-7.08, +16.59]**
- vs immutable SF18: **39 W / 421 D / 52 L**, 512 games, score **48.7305%**, Elo estimate **-8.82**, draw-aware 95% CI **[-21.53, +3.86]**

Run #4 alone was positive but unresolved, so policy required exact-candidate replication rather than promotion.

## Run #5 — exact-candidate replication

Workflow run `34060269635` completed successfully with every correctness/provenance gate green and evidence artifact digest `sha256:0f67464abe83c62703abc71be567aabb1c806a4877cc761bcc10fb30f6cd579b`.

Replication provenance/correctness:

- workflow wrapper SHA recorded by the run: `1e630a1e6d5efa59acf201af58b2dde794af8dee`
- accepted Crab SHA: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- patch SHA-256: `812cabb1050e0fb459673d558bfaf7d6efb92e1042d76a0c99eccb7b3058145d`
- applied engine-diff SHA-256: `07831e10747ac00c93d5ad42a86b8feee36cd46c629bec6ac429668e2bb8720b`
- canonical post-patch tree: `5f8d260ee0f73a55c4d7786faafcff85465fef52`
- candidate deterministic bench: `2470525`, reproduced across GCC/Clang and repeated Clang runs
- accepted Crab deterministic bench: `2673975`
- immutable SF18 deterministic bench: `2050811`
- GCC: `gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`
- Clang: `Ubuntu clang version 18.1.3 (1ubuntu1)`
- CPU: AMD EPYC 7763 64-Core Processor runner, 4 logical CPUs exposed
- candidate Clang binary SHA-256: `be986066067bfc910ea86db82e172c5b7d23c55b39a7cbac8af2303b84a54055`
- candidate GCC binary SHA-256: `282d3deaad23c7aced59cc9d7a6cfa4fb16f2e0fb12d2d2760531fce7bc4f1e1`
- accepted binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- NNUE checksums matched across candidate, accepted Crab, and SF18: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- openings SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed 8-ply openings with repeated colors, no adjudication

Replication strength:

- vs accepted Crab: **41 W / 424 D / 47 L**, 512 games, score **49.4141%**, Elo estimate **-4.07**, draw-aware 95% CI **[-16.57, +8.41]**
- vs immutable SF18: **45 W / 422 D / 45 L**, 512 games, score **50.0000%**, Elo estimate **0.00**, draw-aware 95% CI **[-12.64, +12.64]**

## Combined direct-Crab evidence

Across the two complete, independent matched-resource runs:

- **84 W / 857 D / 83 L**, 1024 games
- score **50.0488%**
- combined Elo estimate approximately **+0.34**
- draw-aware normal 95% CI approximately **[-8.26, +8.94]**

The exact replication reversed the first screen's sign and the combined effect is essentially flat. The first positive 512-game point estimate therefore did not survive replication.

Combined SF18 context is also unresolved and is not used as promotion proof. No SF18 parity or superiority claim is made.

## Final classification

**FLAT / ARCHIVED / NOT STACK-ELIGIBLE.**

Reason: the exact candidate produced +4.75 Elo in the first direct-Crab screen and -4.07 Elo in the replication, leaving the combined 1024-game direct evidence at only about +0.34 Elo with a wide confidence interval. There is no demonstrated cumulative contribution and no specific complementary interaction presently motivating inclusion. Per Crab's bank-stack-ablate policy, this candidate stays out of the active stack while its standalone evidence remains preserved.

Accepted Crab `main` remains unchanged.
