# ABL-0006: refined STACK-0001 minus EXP-0015

Status: **RUNNING / DRAFT**

## Question

After ABL-0005 showed that EXP-0016 can be removed without a meaningful loss, does the refined cumulative stack remain as strong if EXP-0015 IIR guard removal is also removed?

## Refined parent evidence

ABL-0005's exact-engine replication produced a refined stack containing EXP-0010, EXP-0012, EXP-0015, EXP-0017, and EXP-0018, with EXP-0016 absent.

Across two independent 512-game runs versus accepted Crab, that refined stack scored **117 W / 820 D / 87 L over 1,024 games**, score **51.4648%**, approximately **+10.18 Elo** with draw-aware 95% CI **[+0.70, +19.68]**.

For immutable-SF18 context, the refined stack scored **110 W / 828 D / 86 L over 1,024 games**, score **51.1719%**, approximately **+8.14 Elo** with draw-aware 95% CI **[-1.16, +17.46]**. This is context only and is not a parity or superiority claim.

## Candidate

Remove EXP-0015's IIR guard-removal hunk from the already-refined stack. EXP-0016 remains absent. Preserve:

- EXP-0010 continuation-correction prefetch
- EXP-0012 optimism arithmetic
- EXP-0017 multi-cut correction history
- EXP-0018 dynamic root-score EMA

This is the last previously unablated STACK-0001 component.

## Required gates

- patch applies cleanly only to expected engine files
- verify the baseline IIR `priorReduction <= 3` guard remains present
- verify the EXP-0016 negative-extension simplification remains absent
- Crab Chess UCI identity
- GCC and Clang clean builds
- identical repeated deterministic candidate bench across compilers
- ASan/UBSan smoke
- accepted Crab control exact bench `2050811`
- immutable Stockfish 18 control at `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, exact bench `2050811`
- NNUE and opening checksums
- pinned Cute Chess v1.3.1
- 512 matched games vs accepted Crab
- 512 matched games vs immutable SF18

Resources: Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed openings at 8 plies with repeated colors, no adjudication.

## Decision rule

A clearly weaker result supports retaining EXP-0015 in the refined stack. A non-harmful or stronger result may support removing it, but a promising unresolved 512-game screen should be replicated before changing the final stack composition.

This PR remains draft and must not be merged into accepted `main`. Accepted Crab remains the last promoted evidence-backed engine, and no SF18 parity or superiority claim is made.
