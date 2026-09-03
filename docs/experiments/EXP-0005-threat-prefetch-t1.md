# EXP-0005: Threat-weight prefetch locality T1

## Status

UNDER TEST. Do not promote or claim strength improvement from this experiment without evidence.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline for this experiment: `ff6e025c221b294a2ca243892f43a033003c7463`
- Candidate branch: `exp/0005-threat-prefetch-t1`

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

## Throughput screen

CI runs the accepted Crab control and candidate on the same runner using:

- compiler: Clang, recorded in artifact
- architecture target: `x86-64-avx2`
- 20 alternating pairs
- 2 warmups
- expected nodes each sample: `2050811`

The artifact records candidate branch SHA, accepted baseline SHA, immutable SF18 SHA, compiler/CPU information, patch SHA-256, binary SHA-256 values, deterministic bench output, and paired NPS JSON.

### Decision rule

- Reject/revert if correctness differs, deterministic node count changes, sanitizers fail, or throughput is materially negative.
- Treat a small/noisy positive result as inconclusive and reproduce it on a fresh runner before strength testing.
- Advance to matched-resource game testing only after a reproducible throughput improvement.
- Acceptance as a performance optimization still requires no detected strength regression against the latest accepted Crab baseline. Stockfish 18 parity/superiority requires separate statistically meaningful matched-resource evidence and is not implied by NPS.

## Results

Pending first CI measurement.

## Strength evidence

Not started. W/D/L, Elo confidence interval or SPRT result will be recorded here if and only if the candidate clears correctness and reproduced throughput gates.
