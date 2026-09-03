# EXP-0005: Threat-weight prefetch locality T1

## Status

**REJECTED.** The first throughput screen was positive, but the required fresh-runner reproduction did not reproduce the improvement. No strength testing was started and no engine source from EXP-0005 is promoted into the accepted Crab baseline.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline for this experiment: `ff6e025c221b294a2ca243892f43a033003c7463`
- Candidate branch: `exp/0005-threat-prefetch-t1`
- First-screen candidate branch SHA: `1ed3547848b408a19881644fc023df73c9af8e07`
- Reproduction candidate branch SHA: `5f414ccc79272e4a2db75cc19bd5c776b2e3c217`
- Reproduction workflow checkout SHA: `66090694a7e97ac2f1ddf5d4b8eac7825e15aba2`

## Focused hypothesis

EXP-0004 established an independently reproduced throughput benefit from prefetching the NNUE FullThreats threat-weight row with low locality (`PrefetchLoc::LOW`, mapping to T2/locality 1 on the supported compilers). EXP-0005 changes only that call site's locality to `PrefetchLoc::MODERATE` (T1/locality 2).

Hypothesis: the threat-weight row is consumed soon enough after index discovery that bringing it closer than T2 reduces load latency and improves NPS without changing search semantics or deterministic node count. The counter-risk is excess pressure on nearer caches, in which case the candidate should be rejected.

## Candidate change

Patch: `experiments/EXP-0005-threat-prefetch-t1.patch`

Semantic scope: one prefetch-hint enum argument in `engine/src/nnue/features/full_threats.cpp`. No evaluation constants, pruning parameters, move ordering, search logic, NNUE values, UCI identity, or GPL/upstream notices are altered.

Patch SHA-256: `d12270d669ffd91cf36af6066490f59419119a291d585b2ef6452c19e937fa17`

## Correctness gates

Candidate had to pass all of the following before any strength test:

1. Patch applies cleanly to the accepted Crab baseline.
2. GCC and Clang native builds pass.
3. UCI identifies as `Crab Chess` / `Crab Chess contributors`.
4. Deterministic bench remains exactly `2050811` nodes.
5. Address/undefined sanitizer smoke passes.
6. Playable web smoke remains green.

All six gates passed in Crab CI run `33800829313` on 2026-09-03. They also remained green on branch head `5f414ccc79272e4a2db75cc19bd5c776b2e3c217` in Crab CI run `33806551999`. The fresh-runner reproduction separately verified the baseline and candidate deterministic benches at exactly `2050811` nodes and preserved Crab Chess UCI identity.

## Throughput screen

Common settings:

- compiler: Ubuntu Clang 18.1.3
- architecture target: `x86-64-avx2`
- deterministic bench configuration: 1 thread, 16 MiB hash
- 20 alternating pairs
- 2 warmups
- expected nodes each timed sample: `2050811`
- accepted-control binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- candidate binary SHA-256: `e3c59a09cc3077831a6c8898d6b3a71bd815b3d3e57289aedb627359ab5d5eba`
- large NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

### First screen

Environment: AMD EPYC 7763 64-Core Processor, GitHub-hosted runner with 4 visible logical CPUs, Ubuntu 24.04.4 LTS.

- accepted Crab median: `974492` NPS
- EXP-0005 median: `987867` NPS
- raw median speedup: `+1.3725%`
- paired median speedup: `+1.0969%`
- accepted Crab mean: `981117.5` NPS, sample standard deviation `20641.83`
- EXP-0005 mean: `991393.05` NPS, sample standard deviation `16425.73`
- deterministic signature: every timed baseline and candidate sample searched exactly `2050811` nodes
- first-screen artifact digest: `sha256:b364cc40e3752a29b1df20f0b606055a764504efa4e43ee9b0bf38b92ad54d75`

The first screen was encouraging but insufficient by policy.

### Fresh-runner reproduction

Workflow: `EXP-0005 Reproduction`, run `33806552060`, completed successfully on 2026-09-03.

Environment: AMD EPYC 9V74 80-Core Processor, GitHub-hosted runner with 4 visible logical CPUs, Ubuntu Clang 18.1.3, `x86-64-avx2`, Threads=1, Hash=16 MiB, 20 alternating pairs, 2 warmups.

- accepted Crab median: `972178` NPS
- EXP-0005 median: `968505` NPS
- raw median speedup: `-0.3778%`
- paired median speedup: `-0.0235%`
- accepted Crab mean: `970213.05` NPS, sample standard deviation `7699.36`
- EXP-0005 mean: `969115.15` NPS, sample standard deviation `7870.24`
- accepted Crab range: `952536` to `981719` NPS
- EXP-0005 range: `952094` to `982659` NPS
- deterministic signature: every timed sample searched exactly `2050811` nodes
- reproduction artifact digest: `sha256:ffa37af0cf1ec3a387c8150e54f85a7eca24f3733421ab6e4f86053af61e31b4`

The direction and magnitude of the first screen did not reproduce. The paired median result is effectively flat and the raw median result is negative. Under Crab's evidence rule, this is insufficient to justify game testing or source promotion.

## Provenance correction

The first-screen artifact's `candidate_branch_sha` field was accidentally blank because the workflow referenced an unset shell variable (`GITHUB_HEAD_SHA`) on the pull-request event. The branch SHA was independently recorded from GitHub PR metadata, but that omission made the first artifact insufficient provenance for promotion by itself.

The dedicated reproduction fixed this by explicitly recording both the PR head SHA and workflow checkout SHA, plus NNUE, patch, and binary SHA-256 values. The reproduction artifact is therefore the controlling evidence for the final decision.

## Strength evidence

**Not started.** Because the required throughput improvement failed reproduction, EXP-0005 did not advance to matched-resource games. Therefore there is no W/D/L, Elo estimate/confidence interval, or SPRT result for EXP-0005.

## Final decision

**REJECT.** Keep the accepted Crab implementation at `PrefetchLoc::LOW` / T2 from EXP-0004. Do not promote the T1/MODERATE change. The accepted Crab baseline remains `ff6e025c221b294a2ca243892f43a033003c7463` for the next experiment.

This experiment provides no evidence of an Elo gain and no evidence for Stockfish 18 parity or superiority.
