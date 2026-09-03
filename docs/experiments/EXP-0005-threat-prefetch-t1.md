# EXP-0005: Threat-weight prefetch locality T1

## Status

UNDER VALIDATION. The first throughput screen is positive, but this candidate is not accepted and must reproduce on a fresh runner before strength testing.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline for this experiment: `ff6e025c221b294a2ca243892f43a033003c7463`
- Candidate branch: `exp/0005-threat-prefetch-t1`
- First-screen candidate branch SHA: `1ed3547848b408a19881644fc023df73c9af8e07`

## Focused hypothesis

EXP-0004 established an independently reproduced throughput benefit from prefetching the NNUE FullThreats threat-weight row with low locality (`PrefetchLoc::LOW`, mapping to T2/locality 1 on the supported compilers). EXP-0005 changes only that call site's locality to `PrefetchLoc::MODERATE` (T1/locality 2).

Hypothesis: the threat-weight row is consumed soon enough after index discovery that bringing it closer than T2 reduces load latency and improves NPS without changing search semantics or deterministic node count. The counter-risk is excess pressure on nearer caches, in which case the candidate should be rejected.

## Candidate change

Patch: `experiments/EXP-0005-threat-prefetch-t1.patch`

Semantic scope: one prefetch-hint enum argument in `engine/src/nnue/features/full_threats.cpp`. No evaluation constants, pruning parameters, move ordering, search logic, NNUE values, UCI identity, or GPL/upstream notices are altered.

## Correctness gates

Candidate must pass all of the following before any strength test:

1. Patch applies cleanly to the accepted Crab baseline.
2. GCC and Clang native builds pass.
3. UCI identifies as `Crab Chess` / `Crab Chess contributors`.
4. Deterministic bench remains exactly `2050811` nodes.
5. Address/undefined sanitizer smoke passes.
6. Playable web smoke remains green.

All six gates passed in Crab CI run `33800829313` on 2026-09-03.

## Throughput screen

CI runs the accepted Crab control and candidate on the same runner using:

- compiler: Ubuntu Clang 18.1.3
- CPU: AMD EPYC 7763 64-Core Processor (GitHub-hosted runner; 4 visible logical CPUs)
- OS: Ubuntu 24.04.4 LTS
- architecture target: `x86-64-avx2`
- deterministic bench configuration: 1 thread, default 16 MiB hash
- 20 alternating pairs
- 2 warmups
- expected nodes each sample: `2050811`
- first-screen patch SHA-256: `d12270d669ffd91cf36af6066490f59419119a291d585b2ef6452c19e937fa17`
- accepted-control binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- candidate binary SHA-256: `e3c59a09cc3077831a6c8898d6b3a71bd815b3d3e57289aedb627359ab5d5eba`
- first-screen artifact digest: `sha256:b364cc40e3752a29b1df20f0b606055a764504efa4e43ee9b0bf38b92ad54d75`

### First screen

- accepted Crab median: `974492` NPS
- EXP-0005 median: `987867` NPS
- raw median speedup: `+1.3725%`
- paired median speedup: `+1.0969%`
- accepted Crab mean: `981117.5` NPS, sample standard deviation `20641.83`
- EXP-0005 mean: `991393.05` NPS, sample standard deviation `16425.73`
- deterministic signature: every timed baseline and candidate sample searched exactly `2050811` nodes

This is encouraging but remains one hosted-runner measurement. It does not satisfy the reproduction gate by itself.

### Provenance correction

The first-screen artifact's `candidate_branch_sha` field was accidentally blank because the workflow referenced an unset shell variable (`GITHUB_HEAD_SHA`) on the pull-request event. The branch SHA is independently recorded above from GitHub PR metadata, but that omission means the artifact itself is not sufficient provenance for promotion.

A dedicated reproduction workflow must therefore record both `${{ github.event.pull_request.head.sha }}` and `${{ github.sha }}` explicitly, plus full SHA-256 checksums of the two NNUE network files used by the build. The reproduction result, not the defective field in the first artifact, will be used for the next gate.

### Decision rule

- Reject/revert if correctness differs, deterministic node count changes, sanitizers fail, or throughput is materially negative.
- Treat a small/noisy positive result as inconclusive and reproduce it on a fresh runner before strength testing.
- Advance to matched-resource game testing only after a reproducible throughput improvement.
- Acceptance as a performance optimization still requires no detected strength regression against the latest accepted Crab baseline. Stockfish 18 parity/superiority requires separate statistically meaningful matched-resource evidence and is not implied by NPS.

## Strength evidence

Not started. W/D/L, Elo confidence interval or SPRT result will be recorded here if and only if the candidate clears correctness and reproduced throughput gates.
