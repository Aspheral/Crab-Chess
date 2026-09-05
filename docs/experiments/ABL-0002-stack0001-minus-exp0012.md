# ABL-0002: STACK-0001 minus EXP-0012

Status: **TESTING, NOT ACCEPTED**

## Hypothesis

Remove only **EXP-0012 optimism-scaling arithmetic** from STACK-0001 while retaining EXP-0010, EXP-0015, EXP-0016, EXP-0017, and EXP-0018. EXP-0012 had a positive but modest standalone result of about +2.04 Elo over 1,024 games, making it the next weakest strength component after EXP-0017.

## Parent evidence

STACK-0001 across two independent 512-game runs:

- vs accepted Crab: 104/846/74 over 1,024 games, about +10.18 Elo, simple draw-aware 95% CI about [+1.32,+19.05].
- vs immutable SF18: 96/851/77 over 1,024 games, about +6.45 Elo, unresolved.

ABL-0001 removed EXP-0017 and replicated at only 90/852/82 vs accepted Crab over 1,024 games, about +2.71 Elo. That removal was rejected and EXP-0017 remains in the parent stack.

## Validation

The candidate must pass Crab UCI identity, GCC/Clang deterministic agreement, sanitizers, accepted-Crab control bench 2050811, immutable Stockfish 18 control bench 2050811, NNUE/opening provenance, pinned Cute Chess, then matched 512-game screens against accepted Crab and immutable SF18 at 3+0.03, Threads=1, Hash=64, concurrency=2, sequential 8-ply openings with repeated colors and no adjudication.

This is an ablation experiment, not a promotion. If removing EXP-0012 preserves or improves the parent stack's direct-Crab strength, the component becomes a removal candidate and the result should be replicated. If the removal materially reduces the stack signal, EXP-0012 stays.

Immutable upstream comparison remains official Stockfish 18 `sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench `2050811`.

No Stockfish 18 parity or superiority claim is made.
