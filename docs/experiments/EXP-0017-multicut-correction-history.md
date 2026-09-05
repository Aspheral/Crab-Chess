# EXP-0017: Multi-cut correction-history update

## Status

**IN PROGRESS.** This candidate is not accepted, merged, or evidence of Stockfish 18 parity/superiority. Promotion requires Crab's correctness, deterministic-bench, and matched-resource strength gates.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `541afd8655dc6bebeaa6b958b349f200139121bc`
- Accepted Crab engine semantics: EXP-0004; later `main` commits are audit/documentation-only unless separately recorded as accepted engine changes
- Candidate branch: `exp/0017-multicut-correction-history`
- Upstream motivation only: official Stockfish commit `218c74ec4d97807afaab3a4dbda94f43e6e02647`, `Multi cut pruning correction history`

## Focused hypothesis

Crab's current singular-search multi-cut path returns immediately when the excluded-move search still fails high over beta. That fail-high contains information about the error between corrected static evaluation and search value, but the path currently returns without feeding that information into correction history.

EXP-0017 changes only that path. Before the existing multi-cut `return value`, when the node is not in check and `value > ss->staticEval`, it computes a bounded correction-history bonus from `(value - ss->staticEval) * singularDepth` and calls `update_correction_history(pos, ss, *this, bonus)`.

The candidate intentionally leaves Crab's existing multi-cut predicate, TT-move-history update, singular margins, negative extensions, pruning formulas, NNUE, and time management unchanged. The engine change is stored as `experiments/EXP-0017-multicut-correction-history.patch` so the accepted source tree remains untouched until evidence justifies promotion.

Official Stockfish's later commit is motivation, not Crab evidence. That upstream change reported passing STC and LTC, but Crab must independently establish correctness and strength against both its accepted baseline and immutable SF18.

## Required validation

The dedicated experiment workflow must record and enforce:

- candidate wrapper SHA and canonical post-patch Git tree;
- candidate patch and applied-engine-diff SHA-256;
- GCC and Clang versions plus CPU/host details;
- GCC and Clang AVX2 builds with Crab Chess UCI identity;
- repeated deterministic candidate bench with matching GCC/Clang node count;
- ASan/UBSan smoke;
- accepted Crab control at exactly `2050811` nodes;
- immutable SF18 at exactly `cb3d4ee9b47d0c5aae855b12379378ea1439675c` and exactly `2050811` bench nodes;
- candidate/control binary SHA-256 values;
- NNUE and opening checksums;
- pinned Cute Chess provenance;
- 512 matched games against accepted Crab and 512 matched games against immutable SF18 using Threads=1, Hash=64 MiB, `3+0.03`, concurrency 2, fixed sequential 8-ply openings with repeated colors, and no adjudication;
- W/D/L plus Elo estimate and confidence interval from the archived PGNs.

## Decision rule

Do not promote from upstream precedent, deterministic bench, NPS, tactical anecdotes, or a positive point estimate alone. If the candidate cannot produce statistically meaningful evidence against the accepted Crab baseline while remaining correct and reproducible, reject it and preserve the record. Any statement about SF18 must remain limited to the measured matched-resource result and must not be generalized into a parity or superiority claim without substantially stronger evidence.
