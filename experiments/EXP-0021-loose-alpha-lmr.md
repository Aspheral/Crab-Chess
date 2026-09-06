# EXP-0021 — loose-alpha quiet-move LMR adjustment

## Baselines

- Accepted Crab: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`
- Accepted Crab deterministic bench: `2673975`

## Hypothesis

At non-capture moves, make late-move reduction respond to the distance between alpha and the node's current evaluation:

```cpp
if (!capture && !is_decisive(alpha))
    r += 3 * std::clamp(alpha - eval, -64, 96);
```

When alpha is loose below eval, this decreases the reduction; when alpha is well above eval, it increases it within a bounded range. The candidate is deliberately limited to this one LMR term.

## Applicability

Current accepted Crab still computes `ss->statScore`, applies `r -= ss->statScore * 850 / 8192`, and then immediately scales reductions for ALL nodes. It has no equivalent alpha-vs-eval adjustment, so the hypothesis is applicable without duplicating an accepted Crab component.

## Upstream prior

Adapted from official Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2`, authored by Adarsh Das (Saphereye), "Reduce LMR less aggressively in loose alpha windows".

Upstream prior evidence, treated as context only:

- STC: 90,784 games, W 23,707 / D 43,758 / L 23,319, passed `<0.00,2.00>`
- LTC: 209,640 games, W 54,841 / D 100,620 / L 54,179, passed `<0.50,2.50>`

Crab does not inherit those Elo claims. Crab's matched tests decide classification.

## Required gates

Before any strength classification: exact patch/scope check, GCC and Clang AVX2 builds, Crab Chess UCI identity, deterministic/reproducible candidate bench, ASan/UBSan smoke, accepted Crab control at `2673975`, untouched SF18 control at `2050811`, matching NNUE and opening checksums, compiler/CPU/resource provenance, patch/diff/tree/binary hashes, and pinned Cute Chess.

If all correctness gates pass, run 512 games vs accepted Crab and 512 vs immutable SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, sequential fixed 8-ply openings with repeated colors, no adjudication.

512 games are triage. A positive but unresolved direct-Crab signal should normally be replicated or banked as STACK-ELIGIBLE rather than treated as disproven merely because its CI crosses zero. Clear negative evidence is rejected and archived. No Stockfish 18 parity or superiority claim is made.

The inherited Stockfish GPLv3/copyright notices remain untouched. Crab Chess remains the executable, UCI, build, documentation, and public identity; this experiment record preserves the post-SF18 source attribution for the adapted idea.
