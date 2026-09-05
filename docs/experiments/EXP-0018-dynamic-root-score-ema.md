# EXP-0018: Dynamic root-score EMA

## Status

**IN PROGRESS.** This candidate is not accepted, merged, or evidence of Stockfish 18 parity/superiority. Promotion requires Crab's correctness, deterministic-bench, and matched-resource strength gates.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `562df9ec5b3c748adb8170388479fe15f9340775`
- Accepted Crab engine semantics: EXP-0004; later `main` commits are audit/documentation-only unless separately recorded as accepted engine changes
- Candidate branch: `exp/0018-dynamic-root-score-ema`
- Upstream motivation only: official Stockfish commit `93ed4b53c4f602c4cc41dbdb67961a2a4712c60b`, `Dynamic root score ema2`

## Focused hypothesis

Crab currently updates each root move's `averageScore` and `meanSquaredScore` with a fixed 50/50 average after every root search. EXP-0018 changes only that estimator so the weight assigned to the newest root score depends on the search effort spent on that root move relative to its previous accumulated effort.

The candidate leaves move ordering, pruning, LMR, correction history, NNUE, time-control formulas, and all non-root search behavior unchanged. The engine change is stored as `experiments/EXP-0018-dynamic-root-score-ema.patch` so the accepted source tree remains untouched until evidence justifies promotion.

Official Stockfish's later commit passed STC and LTC. Those results are motivation only, not Crab evidence.

## Candidate formula

After adding the current root-search node count `N` to `rm.effort`, the candidate derives previous effort `E_prev` and computes a bounded weight on a 32-point scale:

- chi = 3/2
- minimum weight = 12/32
- maximum weight = 24/32
- mean-squared-score weight capped at 16/32

This is the same focused estimator concept as the upstream motivation while retaining Crab's public identity and existing surrounding search code.

## Required validation

The dedicated workflow must record the experiment wrapper SHA, accepted baseline SHA, immutable SF18 SHA, candidate patch SHA-256, applied engine-diff SHA-256, canonical post-patch Git tree, compiler/CPU data, candidate/control binary hashes, NNUE checksums, opening checksum, Cute Chess source SHA, bench signatures, and match results.

Correctness gates:

- focused patch applies only to `engine/src/search.cpp`
- GCC and Clang AVX2 builds succeed
- UCI identity remains `Crab Chess`
- GCC/Clang deterministic candidate bench signatures agree
- two repeated Clang benches agree
- ASan/UBSan smoke passes
- accepted Crab control bench is exactly `2050811`
- immutable SF18 control bench is exactly `2050811`

Strength screen after correctness:

- 512 games vs accepted Crab
- 512 games vs untouched SF18
- Threads=1
- Hash=64 MiB
- time control `3+0.03`
- concurrency=2
- sequential fixed 8-ply openings, repeated colors
- no adjudication

The initial 512-game screens are triage evidence only. No parity or superiority claim may be made from them.
