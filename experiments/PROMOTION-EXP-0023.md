# EXP-0023 promotion evidence

## Scope

This promotion lane starts from accepted Crab Chess commit `b93ab2b0f635adffb9129c57e6f1cc2e8700720a` and carries only the validated EXP-0023 engine change plus this evidence record.

Crab Chess remains GPLv3 and Stockfish-18-derived. Existing Stockfish copyright, GPLv3, and upstream attribution notices are preserved. The public engine identity remains Crab/Crab Chess.

Immutable upstream comparison baseline:

- Official Stockfish 18 tag: `sf_18`
- Official Stockfish 18 commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official deterministic Stockfish 18 bench: `2050811`

Accepted Crab baseline:

- Commit: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Deterministic bench: `2673975`

## Validated engine change

EXP-0023 simplifies the non-PV razoring margin in `engine/src/search.cpp`:

```diff
-if (!PvNode && eval < alpha - 485 - 281 * depth * depth)
+if (!PvNode && eval < alpha - 482 * depth * depth)
```

The promotion branch was generated server-side from the accepted baseline and gated on the canonical staged engine diff SHA-256:

`59867c6325ab6bc0d1292a1c41715b5da3dbf1bd0701454addd5d41b35e809cc`

Experimental patch SHA-256:

`2673a1992c8268506a1207bad8fc8a9bc79f75717256581664f5cc41a3d951ed`

Validated EXP-0023 deterministic candidate bench:

`2146293`

The experimental canonical post-patch tree recorded by the evidence workflow was:

`a9275de39dc10fb8833c1ed526ccb7f99800e59a`

That tree identity came from the experimental worktree and is retained as provenance. The promotion commit is independently gated by the canonical engine-diff hash above.

## Direct accepted-Crab evidence

Three exact matched 512-game runs, aggregated without arithmetically adding individual Elo estimates:

- W/D/L: **163 / 1250 / 123**
- Games: **1536**
- Score: **51.3021%**
- Elo estimate: approximately **+9.05**
- Draw-aware normal 95% CI: approximately **[+1.56, +16.54]**

This is statistically meaningful direct evidence versus the latest accepted Crab baseline and is the basis for opening a promotion lane.

## Immutable SF18 context

Across the same three exact matched runs:

- W/D/L: **156 / 1256 / 124**
- Games: **1536**
- Score: **51.0417%**
- Elo estimate: approximately **+7.24**
- Draw-aware normal 95% CI: approximately **[-0.17, +14.66]**

The SF18 context is positive but narrowly unresolved. This is **not** a claim that Crab Chess is at parity with or stronger than Stockfish 18.

## Matched test configuration

The EXP-0023 evidence lane used:

- Threads: `1`
- Hash: `64 MiB`
- Time control: `3+0.03`
- Concurrency: `2`
- Games per run/leg: `512`
- Opening policy: sequential 8-ply openings with repeated colors
- Adjudication: none
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Primary NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- Secondary NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- GCC: Ubuntu GCC 13.3.0 in the archived experimental run
- Clang: Ubuntu Clang 18.1.3 in the archived experimental run

Exact per-run CPU, binary checksums, PGNs, JSON summaries, compiler output, network checksums, bench logs, and artifact digests remain preserved in the archived EXP-0023/STACK-0002 workflow artifacts and PR evidence. Runner CPU models can differ between GitHub-hosted runs, so they are intentionally not collapsed into one synthetic CPU identity here.

## Stack decision context

EXP-0025 remains STACK-ELIGIBLE but is not included in this promotion. The combined EXP-0023+EXP-0025 stack did not establish promotion-ready direct evidence versus accepted Crab. The promotion candidate therefore contains EXP-0023 alone rather than importing an unresolved cumulative stack.

## Promotion gate

This record does not merge anything by itself. Promotion requires the fresh branch to pass full Crab CI, including clean native builds, Crab UCI identity, deterministic/reproducible bench behavior, correctness/sanitizer gates, and website smoke checks. `main` remains the accepted STACK-0001 engine until that promotion is separately validated and merged.
