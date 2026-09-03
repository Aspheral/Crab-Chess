# Crab Chess experiment ledger

Crab Chess accepts engine changes only when they survive reproducible correctness and strength testing against matched-resource baselines.

## Immutable upstream baseline

- Upstream: official-stockfish/Stockfish
- Tag: `sf_18`
- Commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official deterministic bench: `2050811`

The upstream baseline is never modified. Crab candidates are compared against both this immutable SF18 binary and the latest accepted Crab baseline.

## One-hypothesis rule

Each candidate must test one focused optimization hypothesis. Do not bundle unrelated search, evaluation, move-ordering, time-management, compiler, or NNUE changes into one strength experiment.

Before a candidate can be accepted, record:

```text
experiment_id:
hypothesis:
candidate_sha:
latest_accepted_crab_sha:
sf18_sha: cb3d4ee9b47d0c5aae855b12379378ea1439675c
source_diff_summary:
compiler:
compiler_flags:
cpu:
os:
threads:
hash_mb:
large_pages:
network_files:
network_sha256:
opening_book:
opening_book_sha256:
time_control:
inc_or_nodes:
concurrency:
ponder:
syzygy:
repeatable_seed_or_schedule:
correctness_checks:
candidate_bench:
accepted_crab_bench:
sf18_bench: 2050811
candidate_vs_sf18_wdl:
candidate_vs_sf18_elo:
candidate_vs_sf18_ci:
candidate_vs_sf18_sprt:
candidate_vs_crab_wdl:
candidate_vs_crab_elo:
candidate_vs_crab_ci:
candidate_vs_crab_sprt:
verdict: ACCEPT | REJECT | INCONCLUSIVE
revert_sha_if_rejected:
notes:
```

## Acceptance policy

1. Correctness first: build, UCI, deterministic bench, and relevant regression tests must pass.
2. Resources must match: same hardware class, threads, hash, networks, opening set, tablebases, time control, and concurrency unless the experiment explicitly studies one of those variables.
3. Candidate order/colors/openings should be paired or otherwise balanced.
4. A small positive raw W/D/L is not evidence of superiority. Use a confidence interval or a predeclared SPRT boundary.
5. If evidence is negative, revert. If evidence is inconclusive, do not promote the candidate to the accepted Crab baseline.
6. Never describe Crab as equal to or stronger than Stockfish 18 without statistically meaningful matched-resource testing supporting that exact statement.

`./scripts/verify_sf18_baseline.sh` independently resolves the official tag, verifies its exact commit, builds it, checks the official deterministic bench, and records compiler/CPU plus NNUE checksums.
