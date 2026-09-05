# EXP-0015: Simplify Internal Iterative Reductions condition

## Status

**REJECTED.** The focused search change was not promoted. Two independent 512-game matched-resource screens against the accepted Crab baseline produced a positive aggregate point estimate, but the confidence interval still crossed zero. The immutable SF18 comparison was likewise unresolved. No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `a46219d83de20f0c35837d5c06e92caf73512ec2`
- Accepted Crab engine semantics: EXP-0004
- Candidate wrapper SHA: `9120fa3a5635e2724fd3ec83f1b78a8a91f14201`
- Candidate branch: `exp/0015-simplify-iir-condition`
- Canonical post-patch tree: `d72a7ef28a9cca14228662b0ca3c1bde31398ca8`
- Upstream motivation only: Stockfish commit `b1053e6`, `Simplify Internal Iterative Reductions (IIR) Condition`

## Focused hypothesis

EXP-0015 tested removing only the `priorReduction <= 3` guard from Crab's Step 10 Internal Iterative Reductions condition. The existing all-node, depth, and TT-move requirements were left unchanged.

This was a functional search experiment. The candidate patch SHA-256 was `b4ea12d9cddde35feaecd9fef337083bbeb2d970b4450b874fe1951174957acc`; the applied engine diff SHA-256 was `e0f5873f4bf0dede67e95342be99aa7d12c0931420a6519797150d5b4abfaa84`.

## Correctness and reproducibility

Both independent runs passed the focused-scope and correctness gates:

- GCC correctness build and Crab Chess UCI identity smoke;
- Clang `x86-64-avx2` build;
- ASan/UBSan smoke;
- candidate deterministic bench reproduced at `2567885` nodes;
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
- CPU: AMD EPYC 9V74
- Clang: 18.1.3
- GCC: 13.3.0
- Cute Chess: v1.3.1
- Cute Chess SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- NNUE small checksum: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- NNUE large checksum: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`

## Results

### Attempt 1

Candidate vs accepted Crab, 512 games:

- W/D/L: **59 / 402 / 51**
- Score: 50.78125%
- Elo estimate: **+5.43**
- Draw-aware 95% CI: **[-8.53, +19.40]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **57 / 406 / 49**
- Score: 50.78125%
- Elo estimate: **+5.43**
- Draw-aware 95% CI: **[-8.27, +19.15]**

Evidence artifact digest: `sha256:aef0b017a95d688ea75e3d3be4705d2f7019a308eb38a1af6617df30efaa876b`.

### Attempt 2

Candidate vs accepted Crab, 512 games:

- W/D/L: **64 / 401 / 47**
- Score: 51.66016%
- Elo estimate: **+11.54**
- Draw-aware 95% CI: **[-2.45, +25.57]**

Candidate vs immutable SF18, 512 games:

- W/D/L: **49 / 417 / 46**
- Score: 50.29297%
- Elo estimate: **+2.04**
- Draw-aware 95% CI: **[-10.94, +15.02]**

Evidence artifact digest: `sha256:4df181487e9c42a6039985027a642e752cd96333400e432334965827c1ec0a41`.

Attempt 2 binary SHA-256 values recorded by the workflow:

- candidate: `16106adea69868425589a6e13a90204c4daf11d3c6c2065ceec643271bab145b`
- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- immutable SF18: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

### Aggregate descriptive summary

Across the two independent screens against accepted Crab, the candidate scored **123 W / 803 D / 98 L** over 1024 games, score 51.2207%, corresponding to approximately **+8.48 Elo** with a draw-aware normal 95% CI of approximately **[-1.39, +18.37]**.

Across the two independent SF18 screens, the candidate scored **106 W / 823 D / 95 L** over 1024 games, score 50.5371%, corresponding to approximately **+3.73 Elo** with a draw-aware normal 95% CI of approximately **[-5.69, +13.16]**.

These aggregate intervals are descriptive screening statistics, not an SPRT result. Both include zero. They are therefore insufficient for promotion and do not establish equality, parity, or superiority over SF18.

## Decision

Reject EXP-0015 and leave the accepted Crab engine unchanged. The direct accepted-Crab point estimate was positive in both independent runs, but even the combined 1024-game confidence interval crossed zero. Under Crab's evidence gate, a promising point estimate is not enough to alter the accepted engine. The candidate remains archived for future research but is not merged or promoted.
