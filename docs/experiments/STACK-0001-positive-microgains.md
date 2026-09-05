# STACK-0001: positive micro-gain stack

Status: **TESTING, NOT ACCEPTED**

This stack changes Crab's experiment policy from requiring every micro-change to independently clear zero to banking individually plausible gains and validating their cumulative interaction as one candidate.

## Included components

- **EXP-0010 continuation-correction-history prefetch**: semantics-preserving throughput candidate; paired median +0.1728% in its valid 20-pair screen.
- **EXP-0012 optimism-scaling arithmetic**: combined 1,024 games vs accepted Crab 100/830/94, about +2.04 Elo.
- **EXP-0015 simplified IIR condition**: combined 1,024 games vs accepted Crab 123/803/98, about +8.48 Elo.
- **EXP-0016 simplified negative extensions**: combined 1,024 games vs accepted Crab 94/855/75, about +6.45 Elo.
- **EXP-0017 multi-cut correction-history update**: 512 games vs accepted Crab 46/421/45, about +0.68 Elo. This is the weakest strength component and is included deliberately for later ablation rather than treated as proven.
- **EXP-0018 dynamic root-score EMA**: combined 1,536 games vs accepted Crab 137/1281/118, about +4.30 Elo.

## Excluded recent experiments

- EXP-0011: negative in both direct accepted-Crab screens.
- EXP-0014: clearly negative aggregate against accepted Crab.
- EXP-0019: exactly 50/412/50 against accepted Crab, no positive point estimate.
- EXP-0013: not applicable to the current source path.
- EXP-0009: throughput evidence effectively flat with raw median negative.
- EXP-0010 capture-predicate variant: throughput screen negative.

## Validation policy

STACK-0001 is not a sum-of-Elo claim. Search/evaluation changes can interact nonlinearly. The stack must independently pass Crab identity, GCC/Clang deterministic agreement, sanitizers, accepted-Crab control bench 2050811, immutable Stockfish 18 control bench 2050811, NNUE/opening provenance, then matched 512-game screens against both accepted Crab and immutable SF18.

If the stack is positive, follow with independent replication and component ablation. A component stays only if the cumulative engine is stronger with it than without it. Clear interaction regressions are removed.

Immutable upstream comparison remains official Stockfish 18 `sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench `2050811`.

No Stockfish 18 parity or superiority claim is made by creating this stack.
