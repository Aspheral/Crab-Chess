# EXP-0022 — Depth-shaped LMR history divisor

## Status

DRAFT / STACK-ELIGIBLE screen, exact-candidate replication running. Do not merge into accepted Crab without replicated matched-resource evidence.

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

Only `engine/src/search.cpp` may change when the patch is applied. GPLv3 and inherited Stockfish notices must remain intact. Crab Chess remains the executable/UCI/public identity.

## Applicability

Accepted Crab still contains the exact constant quiet-history LMR term `lmrDepth += history / 3208;` and has no existing depth-indexed LMR-history divisor. The hypothesis is therefore applicable and not a duplicate of EXP-0021.

## Harness history

Runs #1-#3 failed in patch-application/hunk metadata before candidate compilation and therefore contain zero strength evidence. Run #4 is the first complete semantic screen.

## Run #4 — complete first screen

Workflow run `34053982067` completed successfully with every correctness/provenance gate green and evidence artifact `exp0022-evidence` (artifact digest `sha256:aa0db84d85c99a76cc331027d15ec8ec30d1321f3b21b4381693008f60ebc140`).

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

Strength screen:

- vs accepted Crab: **43 W / 433 D / 36 L**, 512 games, score **50.6836%**, Elo estimate **+4.75**, draw-aware 95% CI **[-7.08, +16.59]**
- vs immutable SF18: **39 W / 421 D / 52 L**, 512 games, score **48.7305%**, Elo estimate **-8.82**, draw-aware 95% CI **[-21.53, +3.86]**

Interpretation: the direct-Crab point estimate is positive but statistically unresolved. The SF18 context leg is negative and unresolved. Per Crab policy this is **STACK-ELIGIBLE / replication-required**, not promotion evidence and not evidence of SF18 parity or superiority. The exact engine candidate is therefore being independently replicated before any final EXP-0022 classification or stack inclusion decision.

## Required gates

1. Patch applies cleanly to accepted Crab and changes only `engine/src/search.cpp`.
2. GCC and Clang AVX2 builds succeed and identify as Crab Chess.
3. Candidate deterministic bench is reproducible across GCC/Clang and repeated Clang runs.
4. ASan/UBSan smoke passes.
5. Accepted Crab control reproduces `2673975` nodes.
6. Immutable SF18 reproduces `2050811` nodes.
7. NNUE and opening checksums are recorded and matched as appropriate.
8. Compiler, CPU, Threads/Hash, TC, concurrency, opening policy, binary hashes, patch hash, engine-diff hash, and post-patch tree are recorded.
9. Run 512 matched games vs accepted Crab and 512 vs immutable SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, sequential fixed 8-ply repeated-color openings, no adjudication.
10. Promising unresolved direct-Crab results must be replicated with the exact engine candidate before promotion or stack decisions.

## Classification policy

- clear direct-Crab negative: REJECT
- positive/non-harmful but unresolved: STACK-ELIGIBLE and replicate when warranted
- flat with no plausible complementary value: leave out of stack
- statistically meaningful direct-Crab positive evidence: replicate exact candidate before any promotion decision

A 512-game screen is triage, not proof. No Stockfish 18 parity/superiority claim may be made from this experiment.
