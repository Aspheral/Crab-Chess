# EXP-0016: Simplify negative extensions

## Status

**REJECTED.** The focused search change was not promoted. Two independent 512-game matched-resource screens against the accepted Crab baseline produced positive point estimates, but the combined confidence interval still crossed zero. The immutable SF18 comparison was likewise unresolved. No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `3de373eff3e5f59285ae66ced5b5c4e824da019b`
- Accepted Crab engine semantics: EXP-0004; later main commits through EXP-0015 are audit/documentation-only unless separately recorded as accepted engine changes
- Candidate wrapper SHA: `43a028b8970440d18b7d9ac749d2e7897efa6d46`
- Candidate branch: `exp/0016-simplify-negative-extensions`
- Canonical post-patch tree: `1bff46d669002017fbbb8cd039b5727c71c82b2a`
- Upstream motivation only: official Stockfish commit `c5aef2bf1f77d94a3dd476f276af68fd71a0ac07`, `Simplify Negative Extensions`

## Focused hypothesis

Crab's SF18-derived singular-extension path used two negative-extension levels after the excluded-move search: `-3` when the TT value was already at or above beta, and `-2` for the remaining cut-node case. EXP-0016 changed only that distinction, using `-3` whenever `ttData.value >= beta || cutNode` and removing the separate `-2` cut-node branch.

This was a functional search experiment. The candidate patch SHA-256 was `e620055485255aad5ebad6de8624aeea1e32d5aa10b86b8fb6ffb37b1b02ba85`; the applied engine diff SHA-256 was `a9c5af4590faee756e176e3ab84fc846e9c321aaac5ae5760fe62347a2d268fa`.

## Correctness and reproducibility

Both independent runs passed the focused-scope and correctness gates:

- GCC correctness build and Crab Chess UCI identity smoke;
- Clang `x86-64-avx2` build;
- ASan/UBSan smoke;
- candidate deterministic bench reproduced at `2223317` nodes;
- accepted Crab control bench exactly `2050811`;
- immutable SF18 checkout exactly `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, bench exactly `2050811`;
- NNUE checksums matched the immutable SF18 networks;
- normal Crab CI passed for the candidate wrapper SHA.

## Match settings

Both runs used the same matched-resource configuration:

- Threads: `1`
- Hash: `64 MiB`
- Time control: `3+0.03`
- Games per comparison per run: `512`
- Openings: fixed sequential 8-ply set, repeated colors
- Concurrency: `2`
- Adjudication: none
- Clang: 18.1.3
- GCC: 13.3.0
- Cute Chess: v1.3.1
- Cute Chess SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- NNUE small checksum: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- NNUE large checksum: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`

The two independent runs landed on materially different GitHub-hosted CPU classes: attempt 1 used an Intel Xeon Platinum 8370C, while attempt 2 used an AMD EPYC 7763. This is useful replication evidence, but the project still does not make an SF18 parity/superiority claim from these screening runs.

## Results

### Attempt 1

Candidate vs accepted Crab, 512 games:

- W/D/L: **47 / 431 / 34**
- Score: 51.26953%
- Elo estimate: **+8.82**
- Draw-aware 95% CI: **[-3.14, +20.80]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **57 / 408 / 47**
- Score: 50.97656%
- Elo estimate: **+6.79**
- Draw-aware 95% CI: **[-6.78, +20.37]**

CPU: Intel Xeon Platinum 8370C.

Evidence artifact digest: `sha256:a07d03b7d60151b044f226b2eea08186758a9f0de8588097cfd0a1f909821bad`.

### Attempt 2

Candidate vs accepted Crab, 512 games:

- W/D/L: **47 / 424 / 41**
- Score: 50.58594%
- Elo estimate: **+4.07**
- Draw-aware 95% CI: **[-8.41, +16.57]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **50 / 420 / 42**
- Score: 50.78125%
- Elo estimate: **+5.43**
- Draw-aware 95% CI: **[-7.33, +18.21]**

CPU: AMD EPYC 7763.

Attempt 2 binary SHA-256 values recorded by the workflow:

- candidate: `178899753366e3a52f62031ad616cd1b9749d4a5282987505c6d9c98686fb83e`
- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- immutable SF18: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

Evidence artifact digest: `sha256:56099bc96175397cd087195c8c38e1e33c05d0308aeb52d9186d0579570687b1`.

## Aggregate descriptive summary

Across the two independent screens against accepted Crab, the candidate scored **94 W / 855 D / 75 L** over 1024 games, score 50.9277%, corresponding to approximately **+6.45 Elo** with a draw-aware normal 95% CI of approximately **[-2.20, +15.09]**.

Across the two independent SF18 screens, the candidate scored **107 W / 828 D / 89 L** over 1024 games, score 50.8789%, corresponding to approximately **+6.11 Elo** with a draw-aware normal 95% CI of approximately **[-3.20, +15.42]**.

These aggregate intervals are descriptive screening statistics, not an SPRT result. Both include zero. They are therefore insufficient for promotion and do not establish equality, parity, or superiority over SF18.

## Decision

Reject EXP-0016 and leave the accepted Crab engine unchanged. The direct accepted-Crab point estimate was positive in both independent runs, including replication on two different CPU classes, but even the combined 1024-game confidence interval crossed zero. Under Crab's evidence gate, that is not enough to alter the accepted engine. The candidate remains archived for future research but is not merged or promoted.
