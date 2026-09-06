# ABL-0005: STACK-0001 minus EXP-0016

Status: **ARCHIVED / ABLATION SUPPORTS REMOVAL OF EXP-0016 FROM THE EXPERIMENTAL STACK**

## Question

Does STACK-0001 remain as strong, or become stronger, if EXP-0016 negative-extension simplification is removed while all other stack components remain unchanged?

## Parent evidence

STACK-0001 combined direct-Crab evidence is **104 W / 846 D / 74 L over 1,024 games**, score **51.4648%**, approximately **+10.18 Elo** with draw-aware 95% CI **[+1.32, +19.05]**. This is cumulative matched-resource evidence, not an arithmetic sum of constituent Elo estimates.

## Candidate

Remove only EXP-0016's cut-node negative-extension simplification from STACK-0001. Preserve:

- EXP-0010 continuation-correction prefetch
- EXP-0012 optimism arithmetic
- EXP-0015 IIR guard removal
- EXP-0017 multi-cut correction history
- EXP-0018 dynamic root-score EMA

## Matched resources and required gates

Both runs used Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2, sequential fixed openings at 8 plies with repeated colors, and no adjudication.

Both runs passed:

- patch applicability and expected-file checks
- Crab Chess UCI identity
- GCC and Clang clean builds
- identical repeated deterministic candidate bench across compilers
- ASan/UBSan smoke
- accepted Crab control exact bench `2050811`
- immutable Stockfish 18 control at `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, exact bench `2050811`
- NNUE and opening checksum validation
- pinned Cute Chess v1.3.1
- 512 matched games vs accepted Crab
- 512 matched games vs immutable SF18

## Run 1 evidence

Workflow run: `34010836297`

- Candidate wrapper SHA: `3fc7052c2c93bd4dfcdcb17501bce7e94b544988`
- Accepted Crab baseline SHA: `27b27330bda59e87e46df552754394638c74334a`
- Immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Candidate patch SHA-256: `592e1ea64a9a104b981d3a51409a470a9c800c10a1f9fa604b211b874d946227`
- Applied engine-diff SHA-256: `db8376929cf1bdc9502679531bebf3c440eae7f3d54a7088d95ba14af27b11d6`
- Canonical post-patch tree: `45683133c8f29c9cc2dfc5953ad1e16edb2f90dc`
- Candidate deterministic bench: `2673975` nodes, reproduced across GCC/Clang
- Candidate binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- Accepted binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- GCC: `gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`
- Clang: `Ubuntu clang version 18.1.3 (1ubuntu1)`
- Runner CPU: AMD EPYC 7763, 4 vCPUs exposed
- NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess: v1.3.1, SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`

Versus accepted Crab:

- **49 W / 425 D / 38 L**
- score **51.0742%**
- approximately **+7.47 Elo**, draw-aware 95% CI **[-4.94, +19.89]**

Versus immutable SF18:

- **64 W / 407 D / 41 L**
- score **52.2461%**
- approximately **+15.62 Elo**, draw-aware 95% CI **[+2.03, +29.25]**

The SF18 result is context only and is not a parity or superiority claim.

## Run 2 replication evidence

Workflow run: `34015630827`

- Candidate wrapper SHA: `33a63a73241d4571b3c0e821f9ea46147c70683e`
- Accepted Crab baseline SHA: `27b27330bda59e87e46df552754394638c74334a`
- Immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Candidate patch SHA-256: `592e1ea64a9a104b981d3a51409a470a9c800c10a1f9fa604b211b874d946227`
- Applied engine-diff SHA-256: `db8376929cf1bdc9502679531bebf3c440eae7f3d54a7088d95ba14af27b11d6`
- Canonical post-patch tree: `eeaefc65e71bcfb4affdc08859f1a3475f4e4949`
- Candidate deterministic bench: `2673975` nodes, reproduced across GCC/Clang
- Candidate binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- Accepted binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- GCC: `gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`
- Clang: `Ubuntu clang version 18.1.3 (1ubuntu1)`
- Runner CPU: AMD EPYC 7763, 4 vCPUs exposed
- NNUE and opening checksums: identical to Run 1
- Cute Chess: v1.3.1, SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`

Versus accepted Crab:

- **68 W / 395 D / 49 L**
- score **51.8555%**
- approximately **+12.90 Elo**, draw-aware 95% CI **[-1.46, +27.31]**

Versus immutable SF18:

- **46 W / 421 D / 45 L**
- score **50.0977%**
- approximately **+0.68 Elo**, draw-aware 95% CI **[-12.03, +13.39]**

The wrapper-level canonical tree differs between runs because Run 2 includes the evidence-only Run 1 documentation commit. The applied engine-diff SHA and candidate binary checksum are identical, which verifies the replicated engine candidate itself was unchanged.

## Combined ablation evidence

Directly versus accepted Crab across both independent 512-game runs:

- **117 W / 820 D / 87 L** over 1,024 games
- score **51.4648%**
- approximately **+10.18 Elo**, draw-aware 95% CI **[+0.70, +19.68]**

For immutable-SF18 context across both runs:

- **110 W / 828 D / 86 L** over 1,024 games
- score **51.1719%**
- approximately **+8.14 Elo**, draw-aware 95% CI **[-1.16, +17.46]**

The full STACK-0001 parent and the EXP-0016-ablated stack therefore have the same aggregate direct-Crab score, **51.4648%**, over their respective 1,024-game matched-resource evidence sets. This is not an arithmetic combination of Elo estimates.

## Classification

**ABLATION SUPPORTS REMOVAL FROM THE EXPERIMENTAL STACK.**

Two independent runs of the exact same engine diff remained positive against accepted Crab, and the combined 1,024-game ablated result matches the parent stack's aggregate direct-Crab score rather than showing a meaningful loss. Under the bank-stack-ablate rule, sufficient evidence now exists that EXP-0016 is not required for the cumulative stack.

Accordingly:

- EXP-0016 is removed from the experimental cumulative stack going forward.
- Its standalone and ablation evidence remain archived; nothing is erased.
- PR #52 is not merged into accepted `main`.
- Accepted Crab remains `27b27330bda59e87e46df552754394638c74334a`.
- The next controlled ablation should test EXP-0015 from the refined stack that already excludes EXP-0016.
- No Stockfish 18 parity or superiority claim is made.
