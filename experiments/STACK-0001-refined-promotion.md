# Refined STACK-0001 promotion record

Status: promotion candidate, pending full PR validation and merge decision.

## Identity

- Accepted Crab baseline: `27b27330bda59e87e46df552754394638c74334a`
- Immutable Stockfish 18 baseline: official `sf_18` commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Refined Crab deterministic bench: `2673975`
- Validated refined engine diff SHA-256: `db8376929cf1bdc9502679531bebf3c440eae7f3d54a7088d95ba14af27b11d6`
- ABL-0005 wrapper SHA: `9f402add1433bee8e6b6469711b3f73a94bf7dcf`
- ABL-0005 wrapper-specific canonical post-patch tree: `5bf84ab4e58423d5672ae57f49f2226740886f2c`
- Promotion engine commit: `3c318a3fb988c0b17845e5273a87e590e35473eb`

The promotion branch was created fresh from accepted `main`. The engine commit was produced by applying the exact ABL-0005 `candidate.diff` and gating both the input patch and staged engine diff on the recorded SHA-256 above. The promotion tree differs from the ABL-0005 wrapper-specific tree because the experiment wrapper contains harness/documentation files that are deliberately not part of the promotion branch.

The refined Crab bench signature is intentionally different from the immutable upstream SF18 bench. Crab CI pins `2673975` for this promoted engine candidate while the upstream SF18 verification remains pinned to `2050811`.

## Refined stack

Included components:

- EXP-0010 continuation-correction-history prefetch
- EXP-0012 optimism arithmetic simplification
- EXP-0015 IIR guard removal
- EXP-0017 multi-cut correction-history feedback
- EXP-0018 dynamic root-score EMA

Excluded component:

- EXP-0016 negative-extension simplification

## Direct Crab evidence

ABL-0005 tested the refined five-component stack against accepted Crab under the matched-resource policy. Across two independent 512-game runs, the refined stack scored:

- W/D/L: `117/820/87`
- Games: `1024`
- Score: `51.4648%`
- Elo estimate: approximately `+10.18`
- Draw-aware 95% CI: `[+0.70, +19.68]`

This is statistically meaningful direct evidence versus the accepted Crab baseline. The point estimate is not an arithmetic sum of constituent experiment estimates.

## Ablation context

The original six-component STACK-0001 was independently replicated before component ablation. ABL-0001 through ABL-0004 supported retaining EXP-0017, EXP-0012, EXP-0010, and EXP-0018. ABL-0005 showed that removing EXP-0016 preserved the full stack's aggregate direct-Crab result across 1,024 games, so EXP-0016 was removed from the refined stack. ABL-0006 then removed EXP-0015 and scored `45/419/48` versus accepted Crab over 512 games, about `-2.04 Elo` with 95% CI `[-14.88,+10.81]`; this provided no evidence-based reason to remove EXP-0015.

## Validation policy

Before promotion can be merged, the fresh promotion PR must pass the repository's full CI and website smoke checks while preserving:

- Crab/Crab Chess public identity
- GPLv3 licensing and inherited Stockfish copyright/upstream attribution
- deterministic/reproducible engine behavior
- network/opening integrity expectations
- the immutable SF18 comparison baseline

No Stockfish 18 parity or superiority claim is made by this promotion. SF18 testing remains comparison context; the promotion decision is based on statistically meaningful direct evidence versus the latest accepted Crab baseline plus the completed ablation map.
