# EXP-0011: Reduce LMR less aggressively in loose alpha windows

## Status

**UNDER TEST.** This is a functional search experiment. No Crab strength gain is claimed until Crab-specific matched testing supports it.

## Immutable references

- Official Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `7b35f4213f2e03edb73cad541ecfa4a380391427`
- Accepted engine semantics currently include EXP-0004 only
- Candidate branch: `exp/0011-lmr-loose-alpha`

## Focused hypothesis

Late-move reductions can be slightly too aggressive for quiet moves when the current alpha is materially above or below the static evaluation. Adjust the LMR reduction using the alpha-eval gap for non-captures while avoiding decisive alpha values.

Candidate delta, adapted directly onto Crab's SF18-derived search:

```cpp
if (!capture && !is_decisive(alpha))
    r += 3 * std::clamp(alpha - eval, -64, 96);
```

The change is inserted after the existing history-based LMR adjustment and before ALL-node scaling. Positive `alpha - eval` increases the reduction; negative `alpha - eval` decreases it. The clamp bounds the effect.

## Upstream provenance and attribution

Adapted from post-SF18 Stockfish commit:

- upstream commit: `5f7348f03f820038f5d246b82de544cbc1d8ffd2`
- title: `Reduce LMR less aggressively in loose alpha windows`
- author: Adarsh Das (Saphereye)
- upstream STC: 90,784 games, W 23,707 / D 43,758 / L 23,319, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- upstream LTC: 209,640 games, W 54,841 / D 100,620 / L 54,179, LLR `2.94 (-2.94,2.94) <0.50,2.50>`

The experiment patch also adds `Adarsh Das (Saphereye)` to Crab's preserved Stockfish `AUTHORS` attribution list. Crab does not treat upstream Fishtest results as proof that the patch transfers to the SF18-derived Crab code state.

Patch artifact: `experiments/EXP-0011-lmr-loose-alpha.patch`.

## Correctness / deterministic bench policy

This patch intentionally changes search behavior, so the candidate is **not** required to retain the SF18 `2050811` node signature. Instead:

1. accepted Crab must still bench exactly `2050811` nodes;
2. immutable SF18 must still bench exactly `2050811` nodes;
3. the patched candidate must build under Clang AVX2 and retain Crab Chess UCI identity;
4. the candidate bench is run twice and must produce the same node count both times;
5. network SHA-256 checksums must match the accepted Crab control;
6. patch application and the resulting source diff are hashed and recorded.

## First Crab strength screen

If correctness passes, run two matched-resource screens:

- candidate vs accepted Crab: 512 games;
- candidate vs untouched SF18: 512 games.

Settings:

- Threads=1
- Hash=64 MiB
- time control `3+0.03`
- sequential fixed opening set, 8 plies
- repeated colors
- concurrency=2
- no adjudication
- Cute Chess 1.3.1 built from pinned source

Record W/D/L, score, Elo estimate and draw-aware 95% confidence interval, binary hashes, network hashes, opening checksum, runner SHA, compiler/CPU, candidate bench signature, accepted baseline SHA, and immutable SF18 SHA.

A favorable 512-game screen is only an initial gate. It is not sufficient by itself for a strong parity/superiority claim. A candidate that looks positive will receive larger confirmation or SPRT before source promotion.

## Cumulative acceptance policy

Only independently supported positive changes are stacked into the accepted Crab engine. If EXP-0011 is accepted, future experiments branch from a baseline containing both EXP-0004 and EXP-0011. If EXP-0011 fails, it is rejected without altering the accepted source.

## Current decision

Pending Crab-specific testing. No Crab Elo gain and no SF18 parity or superiority claim exists for EXP-0011.