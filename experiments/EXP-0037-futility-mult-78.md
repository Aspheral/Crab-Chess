# EXP-0037: child-futility multiplier 76 -> 78

## Status
**ACTIVE / UNCLASSIFIED.** Isolated 512-game triage pending. Do not promote or bank before evidence.

## Baselines
- Accepted Crab `main`: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Immutable Stockfish 18: `sf_18` / `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Accepted Crab deterministic bench gate: `2146293`

## Applicability
Current accepted `engine/src/search.cpp` contains exactly the child-node futility expression `Value futilityMult = 76 - 23 * !ss->ttHit;`. EXP-0037 changes only the base multiplier from 76 to 78. The TT-miss adjustment, improving/opponent-worsening terms, correction-history term, depth limit, and return expression remain unchanged.

## Hypothesis
A very small increase in the child-node futility margin may avoid a subset of marginal fail-high pruning decisions while retaining the existing search structure. This is intentionally a two-point perturbation, small enough to test local sensitivity rather than redesign the heuristic.

This experiment is independent of the archived EXP-0035/0036 LMR coefficient probes and does not stack either flat candidate.

## Required gates
Clean accepted/candidate builds; Crab UCI identity; deterministic benches; ASan/UBSan smoke; NNUE/opening SHA-256 recording; immutable SF18 exact bench; matched 512-game candidate-vs-accepted-Crab and candidate-vs-SF18 screens at Threads=1, Hash=64 MiB, 3+0.03, paired sequential 8-ply openings, repeated colors, concurrency 2, no adjudication; PGNs and JSON summaries retained.

## Classification policy
Direct evidence versus accepted Crab controls classification. A clear negative is rejected. A flat result without plausible complementary value stays out of the stack. A consistently positive but unresolved micro-signal may become STACK-ELIGIBLE and should be replicated/combined rather than promoted by arithmetic Elo addition. SF18 is mandatory context only.

GPLv3, inherited Stockfish copyright/upstream attribution, Crab public identity, and accepted `main` remain untouched by this experimental wrapper.
