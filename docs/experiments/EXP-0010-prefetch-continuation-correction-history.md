# EXP-0010: Prefetch continuation-correction history

## Status

**UNDER TEST.** No performance, Elo, Stockfish 18 parity, or superiority claim is made until Crab's independent gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `7b35f4213f2e03edb73cad541ecfa4a380391427`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Candidate branch: `exp/0010-prefetch-continuation-correction-history`
- Candidate patch: `experiments/EXP-0010-prefetch-continuation-correction-history.patch`
- Candidate patch SHA-256: `69ba4c297d3cb72322831adcc404a1324e3bf75d4a42820f9d65023f92b406bc`

## Focused hypothesis

`correction_value()` reads two continuation-correction-history entries from earlier stack frames after the child position is established. Those addresses are predictable from the moved piece and destination square before `pos.do_move()` mutates the position.

EXP-0010 prefetches exactly those two entries in `Search::Worker::do_move()` when `ss != nullptr`, before the position update. For ordinary moves, the prefetched addresses are the same entries the child later consumes. Castling and promotion can issue harmless approximate prefetches because the moved-piece identity can differ after transformation.

Hypothesis: overlapping the history-entry memory latency with the position/NNUE update reduces elapsed search time without altering node count, move ordering, evaluation, or search decisions.

Counter-risk: the data may already be resident, the prefetch may arrive too early/late, or the extra instructions may be neutral or harmful on this runner.

## Upstream research provenance

The hypothesis is independently revalidated from post-SF18 Stockfish commit `4150d22b86d1cc83b3a3b1111a63a3935590bcb3`, authored by Bartosz Paprzycki and merged August 10, 2026, titled `Prefetch continuation correction histories` and classified upstream as `No functional change`.

Upstream reported:

- STC: 480,448 games
- W/D/L: 124,828 / 231,742 / 123,878
- LLR: `3.35 (-2.94,2.94) <0.00,2.00>`
- Graviton 3 spot check: about 1.0% lower elapsed time
- Zen 3 AVX2 spot check: about 0.5% lower elapsed time
- Ice Lake AVX-512 spot check: approximately neutral (+0.03%)
- fresh Graviton 3 recheck: about 1.0% lower elapsed time with identical nodes

Crab does not treat those upstream numbers as Crab evidence. They motivate the hypothesis only.

## Candidate change

The experiment patch modifies only `engine/src/search.cpp` when applied. It adds two `prefetch()` calls in `Search::Worker::do_move()` using:

- `(*(ss - 1)->continuationCorrectionHistory)[pc][to]`
- `(*(ss - 3)->continuationCorrectionHistory)[pc][to]`

No evaluation/search constants, history update values, TT format, NNUE network data, UCI identity, executable branding, website branding, GPLv3 notice, Stockfish copyright, or upstream attribution notice is changed.

The patch remains an experiment artifact until acceptance. Promotion, if earned, must apply the exact tested patch to the latest accepted Crab lineage and re-run correctness gates before merge.

## Required gates

1. Patch applies cleanly to accepted Crab `7b35f4213f2e03edb73cad541ecfa4a380391427`.
2. Experiment scope is exactly `engine/src/search.cpp` after patch application.
3. Native GCC candidate build.
4. Native Clang candidate build.
5. Address/undefined sanitizer candidate smoke.
6. UCI identity remains Crab Chess.
7. Candidate deterministic bench is exactly `2050811` nodes.
8. Accepted Crab control deterministic bench is exactly `2050811` nodes.
9. Large and small NNUE SHA-256 checksums match between control and candidate.
10. Playable website smoke remains functional through normal Crab CI.
11. Paired Clang AVX2 throughput screen: Threads=1, Hash=16 MiB, 20 alternating pairs, 2 warmups, exact `2050811` nodes per timed sample.
12. A clearly positive first throughput result must reproduce on a fresh runner before matched-resource strength testing begins.

## Strength-testing policy

No games are authorized from a flat or negative throughput screen. If EXP-0010 reproduces a positive throughput result, strength testing must use matched resources against both:

- latest accepted Crab baseline; and
- untouched official SF18 `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.

Records must include candidate/baseline SHA, compiler and CPU, binary hashes, Threads/Hash, time control, concurrency, opening-suite checksum, network checksums, deterministic bench, W/D/L, Elo estimate with confidence interval or SPRT result.

## Current decision

Pending Crab correctness and throughput evidence. The immutable SF18 comparison baseline remains unchanged, and accepted Crab engine semantics remain EXP-0004 until a later experiment earns promotion.
