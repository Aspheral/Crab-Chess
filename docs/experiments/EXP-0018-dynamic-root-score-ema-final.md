# EXP-0018: Dynamic root-score EMA

## Final status

**REJECTED / NOT PROMOTED.** The candidate passed correctness, deterministic-bench, sanitizer, identity, provenance, immutable-control, and matched-resource harness gates, and showed a positive Stockfish-18 point estimate across three runs. However, after 1,536 matched games against the accepted Crab baseline, the direct-Crab 95% confidence interval still crossed zero. Crab therefore does not have sufficiently strong evidence to replace the accepted engine with this candidate.

No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Accepted Crab baseline at experiment start: `562df9ec5b3c748adb8170388479fe15f9340775`
- Accepted Crab engine semantics before and after this experiment: EXP-0004
- Candidate wrapper SHA: `7099b09f70b99e785a153462a31fc902ce5262ae`
- Canonical post-patch tree: `f0d792c566885ccc05c387c40661f04cbb4d62d7`
- Official Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`
- Candidate deterministic bench: `2917217`
- Upstream motivation only: official Stockfish commit `93ed4b53c4f602c4cc41dbdb67961a2a4712c60b`

## Focused hypothesis

Replace the fixed 50/50 updates of each root move's `averageScore` and `meanSquaredScore` with an effort-weighted EMA. The newest score receives a bounded weight determined by nodes spent on the current root search relative to previous accumulated effort. No unrelated search, evaluation, NNUE, pruning, or time-management parameters were intentionally changed.

## Test settings

All completed strength screens used matched resources:

- Threads: 1
- Hash: 64 MiB
- Time control: `3+0.03`
- Concurrency: 2
- Openings: sequential PGN, 8 plies, repeated colors
- Games: 512 per opponent per run
- Adjudication: none
- Cute Chess: v1.3.1, source SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Clang: 18.1.3
- GCC: 13.3.0
- CPU class for the recorded runs: AMD EPYC 7763 64-Core Processor, GitHub-hosted Azure VM, 4 vCPU exposed

## Correctness and provenance

The corrected candidate passed:

- focused patch-scope verification
- GCC and Clang AVX2 builds
- Crab Chess UCI identity checks
- repeated deterministic candidate bench agreement
- ASan/UBSan smoke
- accepted Crab control bench `2050811`
- immutable Stockfish 18 control bench `2050811`
- NNUE checksum verification
- opening checksum verification
- pinned Cute Chess provenance

Checksums:

- Large NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Small NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- Openings SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Candidate patch SHA-256: `15d5f2fd9abd2c23da06a0883da9cff904683df25052944402e56287f75996c0`
- Applied engine diff SHA-256: `26a96b45281823406c1082554b7972d27fd6e56a1b65a5f6e090f9f416695788`

## Strength evidence

### Run 1

- vs accepted Crab: **50 W / 422 D / 40 L**, **+6.79 Elo**, draw-aware normal 95% CI **[-5.83, +19.42]**
- vs immutable SF18: **56 W / 415 D / 41 L**, **+10.18 Elo**, draw-aware normal 95% CI **[-2.90, +23.30]**
- evidence artifact digest: `31b13419fa1942f4e10979ae3fc6102263741693ef2c1f3777002f65e459f070`

### Run 2

- vs accepted Crab: **53 W / 422 D / 37 L**, **+10.86 Elo**, draw-aware normal 95% CI **[-1.74, +23.49]**
- vs immutable SF18: **51 W / 427 D / 34 L**, **+11.54 Elo**, draw-aware normal 95% CI **[-0.70, +23.81]**
- evidence artifact digest: `69d4f73c9a1b94bbb37ba8cc469bf2f51ec04f296e77e88d298fd1a5d874f6a8`

### Run 3

- vs accepted Crab: **34 W / 437 D / 41 L**, **-4.75 Elo**, draw-aware normal 95% CI **[-16.28, +6.77]**
- vs immutable SF18: **51 W / 423 D / 38 L**, **+8.82 Elo**, draw-aware normal 95% CI **[-3.71, +21.38]**
- evidence artifact digest: `4d156124df6edb8a3fca80d5201411dd6f5307af97264a872fd127cf2f9d1d74`

### Combined 1,536 games per opponent

- vs accepted Crab: **137 W / 1,281 D / 118 L**, score **50.6185%**, **+4.30 Elo**, draw-aware normal 95% CI **[-2.78, +11.38]**
- vs immutable SF18: **158 W / 1,265 D / 113 L**, score **51.4648%**, **+10.18 Elo**, draw-aware normal 95% CI **[+2.90, +17.47]**

These are screening estimates, not SPRT. The SF18 comparison is positive under this estimator, but the project promotion gate requires convincing evidence against the latest accepted Crab baseline as well. After three exact-candidate runs the direct-Crab interval still includes zero, and run 3 itself was slightly negative. The candidate is therefore rejected rather than promoted on an unresolved signal.

## Decision

EXP-0018 is closed unmerged. The accepted Crab source and engine semantics remain unchanged. This record is documentation-only and does not modify the engine.
