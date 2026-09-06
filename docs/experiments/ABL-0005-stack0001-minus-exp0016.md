# ABL-0005: STACK-0001 minus EXP-0016

Status: **RUNNING / DRAFT**

## Question

Does STACK-0001 remain as strong, or become stronger, if EXP-0016 negative-extension simplification is removed while all other stack components remain unchanged?

## Parent evidence

STACK-0001 combined direct-Crab evidence is **104 W / 846 D / 74 L over 1,024 games**, approximately **+10.18 Elo** under the repository's draw-aware screening estimator. This is cumulative matched-resource evidence, not an arithmetic sum of constituent Elo estimates.

Completed ablations support retaining EXP-0017, EXP-0012, EXP-0010, and EXP-0018. Among the two remaining unablated components, EXP-0016 has the weaker standalone direct-Crab aggregate than EXP-0015 (approximately +6.45 Elo versus +8.48 Elo), so it is tested next.

## Candidate

Remove only EXP-0016's cut-node negative-extension simplification from STACK-0001. Preserve:

- EXP-0010 continuation-correction prefetch
- EXP-0012 optimism arithmetic
- EXP-0015 IIR guard removal
- EXP-0017 multi-cut correction history
- EXP-0018 dynamic root-score EMA

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

This is component-ablation evidence. A clearly stronger or non-inferior ablated stack may justify removing EXP-0016, while a materially weaker ablated stack supports retention. A confidence interval crossing zero is not interpreted as proof of no effect. Promising unresolved ablations should be replicated before changing stack membership.

No code is promoted to `main` by this PR, and no Stockfish 18 parity or superiority claim is made.
