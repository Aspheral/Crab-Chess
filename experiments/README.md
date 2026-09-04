# Crab Chess experiment ledger

Every engine change is treated as a candidate, not an improvement, until matched-resource evidence says otherwise.

## Required candidate record

Create one Markdown file per hypothesis under `experiments/`, named `NNNN-short-hypothesis.md`. Record all of the following before a candidate may become the accepted Crab baseline:

- Hypothesis, with exactly one intended engine-strength or performance mechanism.
- Candidate commit SHA.
- Latest accepted Crab baseline SHA.
- Immutable Stockfish 18 baseline SHA: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`).
- Official SF18 deterministic bench reference: `2050811` nodes.
- Compiler and exact version.
- CPU model / architecture.
- Threads and hash for every engine.
- NNUE filename(s) and SHA-256 checksum(s).
- Build flags / architecture target.
- Deterministic Crab bench result and whether it reproduced on a second run.
- Correctness checks used (unit/perft/sanitizer/UCI as applicable).
- Match runner and version.
- Time control or fixed-node budget.
- Opening suite, opening count, colors-reversed policy, and RNG seed.
- Candidate vs accepted Crab: games, W/D/L, score, Elo estimate and 95% CI or complete SPRT result.
- Candidate vs immutable SF18: games, W/D/L, score, Elo estimate and 95% CI or complete SPRT result.
- Decision: `ACCEPT`, `REJECT`, or `INCONCLUSIVE`.
- Evidence artifact links or CI run IDs.

## Acceptance rules

1. One focused hypothesis per candidate.
2. Correctness and deterministic bench gates must pass before strength testing.
3. Resources must be matched: same machine class, threads, hash, NNUE policy, opening distribution, and time/node control.
4. Colors must be balanced. Prefer paired openings with colors reversed.
5. Do not call a small positive point estimate a gain when its confidence interval includes zero.
6. `INCONCLUSIVE` candidates do not replace the accepted baseline.
7. `REJECT` candidates are reverted or left isolated on their experiment branch; they do not accumulate in `main`.
8. Crab Chess must not claim Stockfish 18 parity or superiority without statistically meaningful testing against the immutable SF18 baseline.

## Suggested staged testing

Use a cheap screening stage first, then spend games only on candidates that survive it:

- Stage A: compile, UCI handshake, unit/perft checks, sanitizers where practical, deterministic bench twice.
- Stage B: short candidate-vs-accepted-Crab match to catch obvious regressions.
- Stage C: longer matched candidate-vs-accepted-Crab test using SPRT or a predeclared game count.
- Stage D: candidate-vs-SF18 comparison for accepted candidates and release milestones.

The immutable upstream verification workflow writes the SF18 commit, toolchain, CPU, network checksums, and deterministic bench output to a downloadable CI artifact.