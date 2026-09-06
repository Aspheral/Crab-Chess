# ABL-0005: STACK-0001 minus EXP-0016

Status: **REPLICATION RUNNING / DRAFT**

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

## Run 1 evidence

Workflow run: `34010836297`

- Candidate wrapper SHA: `3fc7052c2c93bd4dfcdcb17501bce7e94b544988`
- Accepted Crab baseline SHA: `27b27330bda59e87e46df552754394638c74334a`
- Immutable SF18 SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Candidate patch SHA-256: `592e1ea64a9a104b981d3a51409a470a9c800c10a1f9fa604b211b874d946227`
- Applied engine-diff SHA-256: `db8376929cf1bdc9502679531bebf3c440eae7f3d54a7088d95ba14af27b11d6`
- Canonical post-patch tree: `45683133c8f29c9cc2dfc5953ad1e16edb2f90dc`
- Candidate deterministic bench: `2673975` nodes, reproduced across GCC/Clang
- Official SF18 control bench: `2050811` nodes
- Candidate binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- Accepted binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- GCC: `gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`
- Clang: `Ubuntu clang version 18.1.3 (1ubuntu1)`
- Runner CPU: AMD EPYC 7763, 4 vCPUs exposed
- NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Opening checksum: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess: v1.3.1, SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`

Matched-resource screen versus accepted Crab:

- **49 W / 425 D / 38 L** over 512 games
- score **51.0742%**
- approximately **+7.47 Elo**, draw-aware 95% CI **[-4.94, +19.89]**

Matched-resource SF18 context:

- **64 W / 407 D / 41 L** over 512 games
- score **52.2461%**
- approximately **+15.62 Elo**, draw-aware 95% CI **[+2.03, +29.25]**

All correctness, provenance, checksum, build, sanitizer, identity, and control gates passed. The SF18 screen is context only and is not a parity/superiority claim.

### Run 1 interpretation

The ablated stack remains directionally positive versus accepted Crab, but the direct-Crab confidence interval is unresolved and its point estimate is below the full STACK-0001 aggregate. Under the bank-stack-ablate rule, this is not sufficient evidence either to remove or retain EXP-0016. An exact engine-diff replication is therefore required before stack membership changes.

The replication may have a different wrapper SHA because this evidence-only documentation commit retriggers CI, but the applied engine patch, engine-diff SHA, canonical post-patch tree, resources, controls, openings, and harness are required to remain identical.

## Decision rule

This is component-ablation evidence. A clearly stronger or non-inferior ablated stack may justify removing EXP-0016, while a materially weaker ablated stack supports retention. A confidence interval crossing zero is not interpreted as proof of no effect. Promising unresolved ablations should be replicated before changing stack membership.

No code is promoted to `main` by this PR, and no Stockfish 18 parity or superiority claim is made.
