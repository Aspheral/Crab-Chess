# ABL-0004: STACK-0001 minus EXP-0018

Status: **RUNNING / DRAFT**

## Question

Does STACK-0001 remain as strong, or become stronger, if EXP-0018 dynamic root-score EMA is removed while all other stack components remain unchanged?

## Parent evidence

STACK-0001 combined direct-Crab evidence: **104 W / 846 D / 74 L over 1,024 games**, approximately **+10.18 Elo** under the repository's draw-aware screening estimator. This is meaningful cumulative evidence, not an arithmetic sum of constituent Elo estimates.

Completed ablations currently support retaining EXP-0017, EXP-0012, and EXP-0010. ABL-0004 therefore tests the next weakest remaining standalone component by direct-Crab evidence.

EXP-0018 standalone combined direct-Crab evidence across three 512-game runs was **137/1281/118 over 1,536 games**, approximately **+4.30 Elo**, 95% CI **[-2.78, +11.38]**. Its standalone SF18 comparison was positive but does not establish parity or superiority.

## Candidate

Remove only EXP-0018's effort-weighted root-score EMA from STACK-0001. Preserve:

- EXP-0010 continuation-correction prefetch
- EXP-0012 optimism arithmetic
- EXP-0015 IIR guard removal
- EXP-0016 negative-extension simplification
- EXP-0017 multi-cut correction history

## Required gates

- patch applies cleanly only to the expected engine files
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

Resources remain Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed openings at 8 plies with repeated colors, no adjudication.

## Decision rule

This is component-ablation evidence. A clearly stronger or non-inferior ablated stack may justify removing EXP-0018, while a materially weaker ablated stack supports retention. A confidence interval crossing zero is not interpreted as proof of no effect. Promising unresolved results should be replicated before changing stack membership.

No code is promoted to `main` by this PR, and no Stockfish 18 parity or superiority claim is made.
