# EXP-0014: Multi-cut pruning correction-history feedback

## Status

**UNDER TEST.** No Crab strength gain is claimed until Crab-specific matched testing supports it.

## Immutable references

- Official Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `5c460c30922ed634e5259e0d3a7c242b8f834427`
- Accepted Crab engine semantics: EXP-0004
- Candidate branch: `exp/0014-multicut-correction-history`
- Candidate patch SHA-256: `4f9d124ed429b3ebfe9e3190b29253e43e7e62498a0565ba977b5be18b10d31a`

## Focused hypothesis

When a reduced singular-search excluding the TT move still fails high over beta, Crab performs multi-cut pruning and returns immediately. That search result contains information about how far the searched position exceeded its static evaluation.

EXP-0014 feeds that information into Crab's existing correction histories before the multi-cut return:

```cpp
if (!ss->inCheck && value > ss->staticEval)
{
    const int bonus =
      std::clamp(int(value - ss->staticEval) * singularDepth * 177 / 1024,
                 -CORRECTION_HISTORY_LIMIT / 4, CORRECTION_HISTORY_LIMIT / 4);
    update_correction_history(pos, ss, *this, bonus);
}
```

No existing Crab LMR, singular-extension, multi-cut, history, NNUE, or evaluation constants are otherwise changed.

## Upstream provenance

The hypothesis is adapted from post-SF18 Stockfish commit:

- upstream commit: `218c74ec4d97807afaab3a4dbda94f43e6e02647`
- title: `Multi cut pruning correction history`
- author: Michael Stembera (`mstembera`)
- co-author / credited source: Patrick Leonhardt (`Yoshie2000`) / PlentyChess
- upstream STC: 151,072 games, W 39,154 / D 73,241 / L 38,677, LLR `2.93 (-2.94,2.94) <0.00,2.00>`
- upstream LTC: 109,866 games, W 28,697 / D 52,929 / L 28,240, LLR `2.96 (-2.94,2.94) <0.50,2.50>`

Both contributors are already present in Crab's inherited Stockfish `AUTHORS` file. Upstream Fishtest results are prior evidence only and do not count as Crab acceptance evidence.

## Scope

The candidate patch changes only `engine/src/search.cpp` at the existing SF18-era multi-cut return. In particular, EXP-0014 does **not** import the later Stockfish `ttMoveHistory` constants or any unrelated post-SF18 tuning.

## Correctness policy

This patch intentionally changes search state and can change the deterministic candidate bench signature. Therefore:

1. the patch must apply cleanly to exact accepted Crab `5c460c30922ed634e5259e0d3a7c242b8f834427`;
2. resulting engine scope must be exactly `engine/src/search.cpp`;
3. candidate must build with GCC and Clang AVX2;
4. candidate must pass ASan/UBSan UCI smoke;
5. UCI identity must remain Crab Chess;
6. accepted Crab and immutable SF18 controls must each retain exactly `2050811` bench nodes;
7. candidate bench must reproduce the same node count twice;
8. large and small NNUE SHA-256 checksums must match controls.

## First Crab strength screen

After correctness passes, run:

- candidate vs accepted Crab: 512 games;
- candidate vs untouched SF18: 512 games.

Matched settings:

- Threads=1
- Hash=64 MiB
- time control `3+0.03`
- sequential fixed openings, 8 plies
- repeated colors
- concurrency=2
- no adjudication
- Cute Chess 1.3.1 built from pinned source

Record W/D/L, score, Elo estimate and draw-aware 95% confidence interval, compiler/CPU, candidate/control binary hashes, NNUE checksums, opening checksum, Cute Chess source SHA, candidate deterministic bench, applied engine-diff SHA-256, and evidence artifact digest.

A positive or ambiguous initial screen is not sufficient for promotion. A candidate must show positive evidence against the latest accepted Crab baseline and survive independent replication before its source can enter the cumulative engine stack.

## Cumulative policy

Crab compounds only supported wins. EXP-0014 can become a new `+1` only if it improves the accepted EXP-0004 engine under matched testing. If accepted, subsequent experiments branch from the combined EXP-0004 + EXP-0014 engine. If rejected, accepted engine semantics remain EXP-0004.

## Current decision

Pending correctness and matched-resource strength testing. No Elo gain, Stockfish 18 parity, or Stockfish 18 superiority claim exists for EXP-0014.
