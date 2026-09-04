# EXP-0004 — Threat-weight row L2 prefetch

## Status

**ACCEPTED as a non-functional performance optimization for source promotion.**

EXP-0004 is accepted because its intended throughput hypothesis reproduced independently twice, all correctness gates remained clean, and three matched-resource game screens detected no strength regression against the accepted Crab baseline. Acceptance is **not** an Elo-gain claim and does **not** establish Stockfish 18 parity or superiority.

The tested source change is represented by `experiments/EXP-0004-threat-weight-prefetch.patch`. The accepted experiment evidence was merged at `6354c99ac7cb7bcad7ec43418997f94cd70f48e4`. The exact tested engine diff was promoted separately in source commit `e63d254eb9df756664d502d03a2e94c4d78a2a64` on `promote/exp0004-threat-weight-prefetch`.

## Hypothesis

Threat-feature indices are computed hundreds of cycles before their corresponding NNUE threat-weight rows are consumed. Prefetching the relevant rows with low locality can place data in L2 without unnecessarily polluting L1, reducing memory stalls in the threat-feature accumulator hot path.

## Upstream research provenance

Based on post-SF18 Stockfish commit:

- commit: `238ef05bb0a306589ce5e5876bc34b68d43354a0`
- title: `Prefetch threat weight rows during append_changed_indices`
- upstream classification: `No functional change`
- STC: 120,800 games, LLR `2.96 (-2.94,2.94) <0.00,2.00>`
- LTC: 86,850 games, LLR `2.94 (-2.94,2.94) <0.50,2.50>`
- STC SMP: 84,480 games, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- second STC sanity run: 132,192 games, LLR `2.93 (-2.94,2.94) <0.00,2.00>`

Crab preserves Stockfish GPLv3 copyright and upstream attribution notices while using Crab Chess for public engine identity and Crab-owned project code.

## Immutable controls

- accepted Crab baseline at experiment start: `d27318a91d5c8ec3b88eb5884a98972077dfbf02`
- immutable Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- official deterministic SF18 bench signature: `2,050,811` nodes
- candidate patch SHA-256: `f7bb808818257a37268fbaeccb1ed9e80bbd62ed13c8e11bfd3c386180553798`
- applied engine-diff SHA-256: `25ad1f6f8d1738de9c5477d310558140243c72fdaa92aa9d76fd3b237ba436c1`

## Correctness and safety gates

The candidate passed:

1. exact patch application through `git apply --directory=engine`;
2. native GCC build;
3. native Clang build;
4. UCI identity `id name Crab Chess`;
5. deterministic bench exactly `2,050,811` nodes;
6. ASan/UBSan smoke;
7. website smoke;
8. repeated paired-throughput samples with every timed sample searching exactly `2,050,811` nodes;
9. independent immutable SF18 bench verification before matched games;
10. source-promotion verification that the applied engine diff SHA-256 exactly matched the tested candidate diff before commit.

## Throughput measurement 1

Ubuntu 24.04 / Clang 18.1.3 / AMD EPYC 9V74 / `x86-64-avx2`, 20 alternating pairs after 2 warmups:

- control median: **948,132 NPS**
- candidate median: **951,431 NPS**
- raw median delta: **+0.3479%**
- paired median delta: **+0.5307%**
- control mean: **946,138.85 NPS**
- candidate mean: **952,443.70 NPS**

## Fresh-runner throughput confirmation

GitHub Actions run `33722378293`, attempt 2, 20 alternating pairs after 2 warmups:

- control median: **881,313 NPS**
- candidate median: **892,239 NPS**
- raw median delta: **+1.2397%**
- paired median delta: **+1.2845%**
- control mean: **895,242.1 NPS**
- candidate mean: **908,021.6 NPS**
- control standard deviation: **36,932.22 NPS**
- candidate standard deviation: **35,576.81 NPS**

The independent confirmation reproduced the direction of the first run rather than collapsing or reversing.

## Matched-resource strength evidence

All screens used Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, fixed sequential openings at 8 plies with repeated colors, and no adjudication. The opening suite SHA-256 was `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`.

### Initial 256-game screen

Candidate vs accepted Crab:

- W/D/L: **25 / 206 / 25**
- score: **50.000%**
- Elo estimate: **0.0**
- 95% CI: **[-18.86, +18.86] Elo**

Candidate vs immutable SF18:

- W/D/L: **28 / 195 / 33**
- score: **49.023%**
- Elo estimate: **-6.79**
- 95% CI: **[-27.64, +14.02] Elo**

### Independent 512-game confirmation

GitHub Actions run `33759591391`.

Candidate vs accepted Crab:

- W/D/L: **46 / 424 / 42**
- Elo estimate: **+2.71**
- 95% CI: **[-9.77, +15.21] Elo**

Candidate vs immutable SF18:

- W/D/L: **42 / 420 / 50**
- Elo estimate: **-5.43**
- 95% CI: **[-18.21, +7.33] Elo**

The full historical record for this run is in `docs/experiments/EXP-0004-confirmation-512.md`.

### Fresh provenance-corrected 512-game confirmation

GitHub Actions run `33777023785`, evidence artifact `exp0004-strength-confirmation`, artifact digest `sha256:972754ca36d693a1effe3e606b088e93c1319fe659602917fb1c36c024c55566`.

Environment and provenance:

- candidate branch SHA: `41dd1c37058114b9f82a8a0fce7b092fc2599a80`
- workflow checkout SHA: `4575d8c7d288ae1ed556ab97e79da280add7edca`
- accepted Crab baseline SHA: `d27318a91d5c8ec3b88eb5884a98972077dfbf02`
- immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- compiler: Ubuntu Clang 18.1.3
- CPU: AMD EPYC 9V45
- match runner: Cute Chess v1.3.1, source SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`
- large NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- small NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- candidate binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- candidate bench: **2,050,811 nodes**
- SF18 bench: **2,050,811 nodes**

Candidate vs accepted Crab:

- games: **512**
- W/D/L: **38 / 441 / 33**
- score: **50.4883%**
- Elo estimate: **+3.39**
- draw-aware normal 95% CI: **[-7.82, +14.62] Elo**

Candidate vs immutable SF18:

- games: **512**
- W/D/L: **31 / 440 / 41**
- score: **49.0234%**
- Elo estimate: **-6.79**
- draw-aware normal 95% CI: **[-18.08, +4.50] Elo**

The confidence intervals include zero. The SF18 point estimate is negative. This evidence therefore does not justify a parity or superiority statement.

## Source promotion

A one-shot promotion workflow applied the already-tested patch verbatim to the accepted Crab-derived tree. Before committing source it verified:

- experiment evidence baseline: `6354c99ac7cb7bcad7ec43418997f94cd70f48e4`
- patch SHA-256: `f7bb808818257a37268fbaeccb1ed9e80bbd62ed13c8e11bfd3c386180553798`
- resulting engine diff SHA-256: `25ad1f6f8d1738de9c5477d310558140243c72fdaa92aa9d76fd3b237ba436c1`
- exactly five expected engine files changed;
- Clang `x86-64-avx2` build passed;
- deterministic bench remained exactly `2,050,811` nodes;
- UCI identity remained `Crab Chess`.

Promotion workflow run: `33788783391`.

Source promotion commit: `e63d254eb9df756664d502d03a2e94c4d78a2a64` (`engine: promote accepted EXP-0004 threat-weight prefetch`).

## Decision

**ACCEPT EXP-0004 AS A PERFORMANCE OPTIMIZATION.**

The evidence supports the narrow claim that the threat-weight L2 prefetch improves Crab-side throughput on the tested runners without a detected strength regression. It does **not** support claiming positive Elo, Stockfish 18 parity, or superiority. Future public strength claims require statistically meaningful matched-resource testing against untouched SF18 and the latest accepted Crab baseline.
