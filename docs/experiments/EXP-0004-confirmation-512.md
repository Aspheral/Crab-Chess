# EXP-0004 — 512-game confirmation

This record supplements `EXP-0004-threat-weight-prefetch.md` with the independent 512-game-per-opponent confirmation completed on GitHub Actions run `33759591391`.

## Candidate and baselines

- experiment: `EXP-0004`
- PR branch at the completed run: `exp/0004-threat-weight-prefetch`
- workflow checkout SHA recorded by the old manifest: `a3482163aea18c495342b5e4a2b71f1ed97ea80d`
- accepted Crab baseline SHA: `d27318a91d5c8ec3b88eb5884a98972077dfbf02`
- immutable Stockfish 18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- official SF18 bench signature required: `2,050,811` nodes
- candidate source definition for this run: accepted Crab baseline plus `experiments/EXP-0004-threat-weight-prefetch.patch`
- artifact: `exp0004-strength-confirmation`
- artifact id: `9897980748`
- artifact SHA-256: `0a550f9d1086f5b4a9b1dfd9aed2c8f38aebdbe35e9c0180c9bd7416e2cfbc6f`

The old manifest field named `candidate_sha` was the GitHub pull-request merge-test checkout SHA, not a standalone commit containing the patched engine source. This ambiguity is corrected by commit `00a1e590963a3ef34efce7c239d96dd67fb499df`, which records the candidate branch SHA, workflow checkout SHA, patch checksum, applied engine-diff checksum, and binary checksum separately on future runs.

## Environment

- runner: Ubuntu 24.04 hosted runner
- compiler: Ubuntu Clang 18.1.3
- CPU: AMD EPYC 7763 64-Core Processor, 4 logical CPUs exposed to the runner
- target: `x86-64-avx2`
- Threads: 1
- Hash: 64 MiB
- concurrency: 2
- time control: `3+0.03`
- openings: fixed 16-opening PGN, sequential, 8 plies, repeated colors
- opening SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- adjudication: none
- match runner: Cute Chess v1.3.1
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- large NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- small NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`

## Deterministic bench

Both controls remained deterministic at the immutable SF18 signature:

- candidate: `2,050,811` nodes, 990,729 NPS on this runner
- untouched SF18: `2,050,811` nodes, 980,780 NPS on this runner

The NPS values above are single bench observations from the strength runner. They are not substituted for the dedicated paired throughput measurements already recorded in the main EXP-0004 record.

## Candidate versus accepted Crab

512 games:

- W/D/L: **46 / 424 / 42**
- score: **50.390625%**
- Elo estimate: **+2.71 Elo**
- draw-aware normal 95% CI: **[-9.77, +15.21] Elo**

The confidence interval includes zero. This is consistent with no detected strength regression, but it does not establish a positive Elo gain.

## Candidate versus immutable Stockfish 18

512 games:

- W/D/L: **42 / 420 / 50**
- score: **49.21875%**
- Elo estimate: **-5.43 Elo**
- draw-aware normal 95% CI: **[-18.21, +7.33] Elo**

The confidence interval includes zero and the point estimate is negative. This result does not establish Stockfish 18 parity and cannot support a superiority claim.

## Accumulated screening evidence

Combining this independent confirmation with the earlier 256-game screen gives 768 games per opponent. This pooled view is descriptive only; it is not an SPRT and does not replace a predeclared sequential test.

Candidate versus accepted Crab, 768 total games:

- W/D/L: **71 / 630 / 67**
- score: **50.2604%**
- Elo estimate: **+1.81 Elo**
- approximate draw-aware normal 95% CI: **[-8.61, +12.24] Elo**

Candidate versus immutable SF18, 768 total games:

- W/D/L: **70 / 615 / 83**
- score: **49.1536%**
- Elo estimate: **-5.88 Elo**
- approximate draw-aware normal 95% CI: **[-16.86, +5.09] Elo**

## Decision

**DO NOT CLAIM ELO GAIN, STOCKFISH 18 PARITY, OR SUPERIORITY.**

EXP-0004 has strong performance evidence for its actual hypothesis: two independent paired throughput runs reproduced a positive NPS direction, correctness and sanitizer gates remained clean, deterministic bench remained exactly `2,050,811` nodes, and 768 matched games against the accepted Crab baseline did not detect a strength regression. The SF18 comparison remains statistically inconclusive and slightly negative by point estimate.

The experiment is therefore evidence-backed as a non-functional performance candidate, but source promotion should remain separate from the experiment branch so that the accepted Crab baseline receives an explicit, auditable promotion commit. No public strength claim should be attached to that promotion.
