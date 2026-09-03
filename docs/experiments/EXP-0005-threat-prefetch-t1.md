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

EXP-0004 established an independently reproduced throughput benefit from prefetching the NNUE FullThreats threat-weight row with low locality (`PrefetchLoc::LOW`, mapping to T2/locality 1 on the supported compilers). EXP-0005 changed only that call site's locality to `PrefetchLoc::MODERATE` (T1/locality 2).

Hypothesis: the threat-weight row is consumed soon enough after index discovery that bringing it closer than T2 reduces load latency and improves NPS without changing search semantics or deterministic node count. The counter-risk is excess pressure on nearer caches.

## Candidate change

Patch: `experiments/EXP-0005-threat-prefetch-t1.patch` on the rejected experiment branch.

Semantic scope: one prefetch-hint enum argument in `engine/src/nnue/features/full_threats.cpp`. No evaluation constants, pruning parameters, move ordering, search logic, NNUE values, UCI identity, or GPL/upstream notices were altered.

Patch SHA-256: `d12270d669ffd91cf36af6066490f59419119a291d585b2ef6452c19e937fa17`

## Correctness gates

All required gates passed: GCC and Clang native builds, Crab Chess UCI identity, exact `2050811` deterministic bench, address/undefined sanitizer smoke, and playable web smoke. The fresh-runner reproduction also preserved the exact deterministic node count.

## Throughput evidence

Common settings: Ubuntu Clang 18.1.3, `x86-64-avx2`, Threads=1, Hash=16 MiB, 20 alternating pairs, 2 warmups, and `2050811` nodes per timed sample.

Network SHA-256 values:

- large NNUE: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small NNUE: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

Binary SHA-256 values:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- candidate: `e3c59a09cc3077831a6c8898d6b3a71bd815b3d3e57289aedb627359ab5d5eba`

### First screen

Environment: AMD EPYC 7763 64-Core Processor, GitHub-hosted runner with 4 visible logical CPUs, Ubuntu 24.04.4 LTS.

- accepted Crab median: `974492` NPS
- EXP-0005 median: `987867` NPS
- raw median speedup: `+1.3725%`
- paired median speedup: `+1.0969%`
- accepted Crab mean: `981117.5` NPS, sample standard deviation `20641.83`
- EXP-0005 mean: `991393.05` NPS, sample standard deviation `16425.73`
- first-screen artifact digest: `sha256:b364cc40e3752a29b1df20f0b606055a764504efa4e43ee9b0bf38b92ad54d75`

### Fresh-runner reproduction

Workflow run: `33806552060` on branch head `5f414ccc79272e4a2db75cc19bd5c776b2e3c217`.

Environment: AMD EPYC 9V74 80-Core Processor, GitHub-hosted runner with 4 visible logical CPUs, Ubuntu Clang 18.1.3.

- accepted Crab median: `972178` NPS
- EXP-0005 median: `968505` NPS
- raw median speedup: `-0.3778%`
- paired median speedup: `-0.0235%`
- accepted Crab mean: `970213.05` NPS, sample standard deviation `7699.36`
- EXP-0005 mean: `969115.15` NPS, sample standard deviation `7870.24`
- accepted Crab range: `952536` to `981719` NPS
- EXP-0005 range: `952094` to `982659` NPS
- reproduction artifact digest: `sha256:ffa37af0cf1ec3a387c8150e54f85a7eca24f3733421ab6e4f86053af61e31b4`

The first-screen improvement did not reproduce. The paired result was effectively flat and the raw median result was negative.

## Strength evidence

**Not started.** EXP-0005 did not clear the reproduced-throughput gate, so no W/D/L, Elo estimate/confidence interval, or SPRT result exists for this candidate.

## Final decision

**REJECT.** Keep the accepted Crab implementation at `PrefetchLoc::LOW` / T2 from EXP-0004. Do not promote the T1/MODERATE change. The accepted Crab baseline remains `ff6e025c221b294a2ca243892f43a033003c7463` for the next experiment.

This experiment provides no evidence of an Elo gain and no evidence for Stockfish 18 parity or superiority.
