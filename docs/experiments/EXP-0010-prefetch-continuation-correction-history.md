# EXP-0010: Prefetch continuation-correction history

## Status

**REJECTED.** Correctness passed, but the first valid paired throughput screen did not provide sufficiently clear evidence of a speedup to justify fresh-runner reproduction or strength testing.

No Elo gain, Stockfish 18 parity, or Stockfish 18 superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `7b35f4213f2e03edb73cad541ecfa4a380391427`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Candidate branch: `exp/0010-prefetch-continuation-correction-history`
- Tested candidate branch SHA: `eef959b4ea8a7480489e13c6b0a67f913fe513b8`
- Workflow checkout SHA: `c6550a307b8d74c3166eb08f1dfccbe2f461b253`
- Candidate patch SHA-256: `9f2c69860840833b62fb93dfbbaab38a661258cb35ea2290b4dc05c2e0e30489`

## Focused hypothesis

`correction_value()` later reads two continuation-correction-history entries whose addresses can be predicted from the moved piece and destination square before the position update. EXP-0010 therefore prefetched those two entries in `Search::Worker::do_move()` before `pos.do_move()`.

The hypothesis was that overlapping memory latency with the position/NNUE update would reduce elapsed search time without changing search semantics.

## Upstream research provenance

The hypothesis was independently revalidated from post-SF18 Stockfish commit `4150d22b86d1cc83b3a3b1111a63a3935590bcb3`, `Prefetch continuation correction histories`, authored by Bartosz Paprzycki and merged August 10, 2026. Upstream classified it as `No functional change` and reported STC 480,448 games with W/D/L 124,828 / 231,742 / 123,878 and LLR `3.35 (-2.94,2.94) <0.00,2.00>` plus architecture-specific elapsed-time spot checks.

Those upstream results motivated the Crab experiment only; they were not counted as Crab evidence.

## Candidate change

The tested patch changed only `engine/src/search.cpp` after application and added two prefetches:

- `(*(ss - 1)->continuationCorrectionHistory)[pc][to]`
- `(*(ss - 3)->continuationCorrectionHistory)[pc][to]`

No evaluation/search constants, history update values, TT format, NNUE network data, UCI identity, executable branding, website branding, GPLv3 notice, Stockfish copyright, or upstream attribution notice changed.

## Correctness evidence

All valid candidate gates passed:

- patch applied cleanly and experiment scope was exactly `engine/src/search.cpp`;
- native GCC candidate build passed;
- native Clang AVX2 candidate build passed;
- candidate ASan/UBSan smoke passed;
- UCI identity remained Crab Chess;
- candidate deterministic bench: exactly `2050811` nodes;
- accepted Crab control deterministic bench: exactly `2050811` nodes;
- large and small NNUE checksums matched;
- normal Crab CI passed website smoke, GCC, Clang, UCI identity, deterministic bench, and sanitizers.

The first three experiment-workflow attempts failed only because of experiment-harness patch/checksum bookkeeping and produced no valid performance evidence. The fourth run, `33832215955`, was the first valid measurement run and passed all gates.

## Valid throughput screen

Workflow run: `33832215955`

Artifact digest: `sha256:1f86a7b4fd5b259cd01510b8339303e655ac43ea0d0cd3c5631873fbcb9f7125`

Test environment:

- CPU: AMD EPYC 7763 64-Core Processor, 4 visible logical CPUs on hosted runner
- Clang: 18.1.3
- GCC correctness build: 13.3.0
- architecture: `x86-64-avx2`
- Threads: 1
- Hash: 16 MiB
- pairs: 20 alternating pairs
- warmups: 2
- nodes per timed sample: exactly `2050811`

Binary SHA-256:

- accepted Crab: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0010 candidate: `495930fd990bb96e5bd93191aa08ff80d8cdc3ed8869a14e187825266a8b6fbb`

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

Throughput result:

- accepted median: `1007028` NPS
- candidate median: `1009261` NPS
- accepted mean: `1005418.95` NPS
- candidate mean: `1008960.10` NPS
- accepted stdev: `12338.73` NPS
- candidate stdev: `10311.52` NPS
- raw median change: `+0.2217%`
- paired median change: `+0.1728%`
- candidate won 12 of 20 individual pairs

The measured effect was positive in sign but small relative to pair-to-pair variation. It did not satisfy Crab's requirement for a **clearly positive** first throughput result before spending a fresh-runner reproduction.

## Strength testing

Not run. The throughput gate did not qualify for independent reproduction, so matched-resource games against accepted Crab and untouched SF18 were not authorized. Therefore there is no W/D/L, Elo estimate/confidence interval, or SPRT result for EXP-0010.

## Decision

**REJECTED, not promoted.** No EXP-0010 engine source is accepted. Accepted Crab engine semantics remain EXP-0004, and the immutable SF18 comparison baseline remains `cb3d4ee9b47d0c5aae855b12379378ea1439675c` with official bench `2050811`.
