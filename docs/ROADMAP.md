# Crab Chess Roadmap

## Mission

Develop **Crab Chess**, a GPLv3 UCI chess engine derived from the official Stockfish 18 release, until Crab can credibly match or exceed that frozen release under controlled testing.

Crab’s public identity is Crab Chess. The immutable scientific control is official Stockfish 18 tag `sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official bench `2050811`.

The project no longer spends time independently rebuilding solved foundations merely to arrive back at SF18. We begin at SF18-strength code and spend the engineering budget on measurable improvements.

---

# 1. Non-negotiable rules

## 1.1 Branding

Project-owned identity is Crab:

- executable `crab`
- UCI identity `Crab Chess`
- website `Crab Chess`
- WASM engine `Crab`
- benchmark and experiment names `Crab`
- new project namespaces, scripts, dashboards and releases use Crab naming

Upstream names remain only in legal/provenance notices and when identifying the immutable scientific control. Copyright and GPL notices are not removed.

## 1.2 Two baselines

Every experiment knows both:

- **SF18 control:** untouched official release commit `cb3d4ee9...`
- **Crab accepted:** strongest currently accepted Crab commit

Candidates normally fight Crab accepted. Important changes also receive direct SF18 comparison.

## 1.3 One hypothesis per patch

Do not bundle unrelated strength changes. A useful engine experiment should be describable as one sentence such as:

> Increase quiet-history influence on LMR only for non-PV improving nodes.

That patch gets correctness checks, deterministic bench, performance profiling and a strength test. Accept or revert it before stacking the next hypothesis.

## 1.4 No NPS worship

NPS is diagnostic, not the objective. A patch may search fewer nodes while becoming stronger because the tree is better selected. Likewise, a faster patch can lose Elo.

## 1.5 No fake parity

Parity claims require equal resources and enough games for statistical meaning. Screenshots, puzzle suites, isolated wins and guessed Elo do not count.

---

# 2. Repository target layout

```text
engine/
  src/                    Crab-native engine source derived from SF18
  tests/                  Crab-specific correctness/regression tests
upstream/
  stockfish18.json        immutable release metadata/checksums
experiments/
  accepted/               winning experiment manifests
  rejected/               failed/neutral experiment manifests
  pending/                queued hypotheses
benchmarks/
  sf18/                   frozen control bench/performance metadata
  crab/                   accepted Crab benchmark history
tools/
  match/                  paired match orchestration
  sprt/                   sequential test/result parsing
  bench/                  deterministic benchmark runners
  profile/                perf/VTune/Tracy/etc adapters where practical
  data/                   PGN/EPD/FEN utilities
web/                      Crab Chess browser UI and future WASM client
docs/
  ROADMAP.md
  ARCHITECTURE.md
  TESTING.md
  STRENGTH-PROTOCOL.md
  OPTIMIZATION-NOTES.md
UPSTREAM.md                provenance and branding policy
Copying.txt                unmodified GPLv3 license text
```

---

# 3. Migration milestone: SF18 becomes Crab

Before strength research begins, produce a mechanically faithful Crab baseline.

## Required work

1. Import official `sf_18` source exactly from the frozen commit.
2. Preserve GPLv3 and applicable copyright notices.
3. Mark the project as modified and record the derivation date.
4. Rename the built executable to `crab`.
5. Change UCI `id name` to `Crab Chess`.
6. Change project-owned version output to Crab versioning.
7. Rename build/package/release artifacts to Crab.
8. Rename user-facing documentation and website references to Crab.
9. Keep protocol semantics UCI-compatible.
10. Avoid semantic engine changes during the rename commit.
11. Build the same architecture target used for the reference.
12. Run the official benchmark and verify the imported baseline reproduces the expected SF18 signature where configuration permits.
13. Record compiler, architecture, network file/checksum and command line.
14. Freeze that commit as `crab-sf18-base`.

### Exit gate

The rename/migration is accepted only when Crab behaves chess-wise like the frozen SF18 control. Branding changes must not accidentally change engine strength or search behavior.

---

# 4. Testing laboratory

## Correctness suite

Every candidate must pass:

- upstream unit/regression tests that apply
- UCI smoke tests
- bench completion
- legal-PV validation
- sanitizer builds on supported configurations
- no crash/hang under randomized UCI command sequences
- tablebase smoke tests where available
- Chess960 smoke tests
- repetition/en-passant regression positions

## Deterministic bench

Track:

- final bench signature
- total nodes
- total time
- NPS
- compiler
- CPU architecture target
- threads
- hash
- network checksum

Search patches are allowed to change the expected node signature, but the change must be intentional and recorded.

## Performance profiling

Track hot-path cost for at least:

- `Search::Worker::search`
- qsearch
- move generation
- move picker
- TT probe/store
- NNUE accumulator updates
- NNUE forward propagation
- correction-history access
- thread synchronization
- time checking

## Strength testing ladder

### L0: smoke
20-100 paired games or a tiny fixed-node batch. Purpose: catch catastrophes, not establish Elo.

### L1: screening
Hundreds to low thousands of fast paired games. Eliminate obvious losers cheaply.

### L2: SPRT
Sequential test with bounds fixed before launch. Candidate either passes, fails or remains unresolved.

### L3: confirmation
Longer time control and/or alternate hardware for major accepted changes.

### L4: SF18 challenge
Direct matched-resource match against frozen SF18.

---

# 5. Optimization program

## Track A: Search selectivity

Research independently:

- LMR base formula
- LMR history adjustments
- improving/not-improving split
- cut-node/PV-node adjustments
- TT-PV interactions
- move-count pruning
- futility margins
- reverse futility margins
- SEE pruning margins
- null-move reduction formula
- null-move verification conditions
- ProbCut depth/margin behavior
- singular-extension eligibility
- extension/reduction interactions
- qsearch pruning
- mate-distance behavior

Metrics beyond Elo:

- effective branching factor
- fail-high move index
- re-search rate
- average reduction by depth/move index
- qsearch share
- TT cutoff rate
- depth reached at fixed nodes

## Track B: Histories and correction

Research:

- pawn correction history
- minor-piece correction history
- non-pawn correction history
- continuation correction
- capture history
- quiet history
- pawn history
- continuation history
- history scaling/gravity
- saturation behavior
- aging/reset strategy
- thread-local vs selectively shared information

Avoid making large history tables larger without profiling cache effects.

## Track C: Root search and time management

Research:

- best-move stability
- score volatility
- PV volatility
- root move competition
- fail-low/fail-high recovery
- aspiration-window growth
- optimum-time scaling
- maximum-time scaling
- increment usage
- moves-to-go handling
- ponder conversion
- emergency time behavior

Tournament strength is the objective, not pretty analysis depth.

## Track D: Transposition table

Research:

- cluster size
- entry packing
- generation width
- depth/value/bound replacement weighting
- age/depth replacement interaction
- prefetch strategy
- huge pages
- NUMA placement
- hash sharing behavior
- write contention

Measure cache misses and scaling, not only nominal hit rate.

## Track E: NNUE / SFNNv10 evolution

First reproduce the SF18 network path bit-correctly.

Then investigate:

- threat feature encoding variants
- feature-transformer dimensions
- king-bucket layout
- accumulator refresh policy
- sparse update scheduling
- output bucket selection
- quantization ranges
- activation alternatives compatible with efficient integer inference
- SIMD packing
- AVX2/AVX-512/VNNI kernels
- network size vs speed tradeoffs
- dual-network/specialist ideas only if testing justifies complexity

Network experiments require reproducible training recipes and checksummed datasets/networks.

## Track F: Threading

Research:

- thread search diversity
- thread voting
- shared vs local histories
- false sharing
- thread startup/teardown
- NUMA grouping
- TT contention
- accumulator memory locality
- 1/2/4/8/16/32+ thread scaling

A patch that gains at 1 thread but loses badly at 16 threads is not universally accepted without a dispatch strategy.

## Track G: Compiler and hardware

Measure:

- GCC vs Clang
- architecture-specific builds
- PGO
- LTO
- AVX2
- AVX-512
- VNNI
- BMI2/PEXT behavior by microarchitecture
- prefetch changes
- alignment
- branch prediction hints only when profiling supports them

Keep portable fallbacks.

---

# 6. Experiment manifest

Every serious candidate gets a machine-readable record containing:

```text
id
hypothesis
candidate_sha
parent_crab_sha
sf18_sha
source_files_changed
network_sha256
compiler
compiler_flags
cpu
os
threads
hash_mb
opening_suite
opening_seed
time_control
nodes_if_fixed_node
pairs
wins
draws
losses
elo_estimate
elo_low
elo_high
sprt_llr
sprt_state
bench_signature
bench_nodes
bench_nps
accepted
notes
```

Rejected experiments are valuable and remain recorded so the same dead end is not repeatedly rediscovered.

---

# 7. Website roadmap

The website remains Crab-branded throughout.

## Stage W0

- responsive board
- legal local play
- move list
- FEN/PGN export
- board flip
- mobile touch support

## Stage W1

- drag pieces
- premoves
- arrows and square annotations
- clocks
- sound controls
- themes
- accessibility improvements

## Stage W2

Compile Crab to WASM and run it in a Web Worker using UCI-style messaging.

- Human vs Crab
- analysis mode
- PV
- depth/seldepth
- nodes/NPS
- hashfull
- WDL/evaluation
- MultiPV

## Stage W3

Research cockpit:

- accepted Crab version history
- benchmark history
- experiment browser
- SF18 comparison results
- Elo/confidence plots
- downloadable PGNs
- hardware/build metadata

---

# 8. First 96 half-hour blocks

Each block is a 30-minute engineering unit. Automated runs occur hourly and should normally consume two consecutive blocks when practical.

## Day 1: clean derivation

01. Freeze SF18 tag/commit/tree/official bench metadata.
02. Record GPL/provenance and Crab branding policy.
03. Import upstream source without semantic changes.
04. Import required build scripts and network metadata.
05. Preserve upstream copyright/license headers.
06. Mark modified project/version provenance.
07. Rename executable target to `crab`.
08. Change UCI engine identity to `Crab Chess`.
09. Rename project-owned build/package artifacts.
10. Rename project-owned runtime/version strings.
11. Compile portable baseline.
12. Compile native/AVX2 baseline.
13. Run UCI smoke sequence.
14. Run official-style bench and record signature.
15. Compare Crab-migration output with untouched SF18 control.
16. Freeze first `crab-sf18-base` commit if behavior matches.

## Day 2: laboratory

17. Define benchmark JSON schema.
18. Add benchmark result writer/parser.
19. Define experiment manifest schema.
20. Add accepted/rejected/pending directories.
21. Add paired-match command wrapper.
22. Add PGN metadata normalizer.
23. Add W/D/L and pentanomial parser.
24. Add Elo/confidence calculator.
25. Add SPRT state calculator/integration adapter.
26. Add reproducible opening-suite seed handling.
27. Add engine binary/network checksums.
28. Add hardware/compiler manifest capture.
29. Add UCI randomized smoke harness.
30. Add sanitizer CI for Crab source.
31. Add deterministic bench CI gate.
32. Produce first full SF18-vs-Crab-baseline control report.

## Day 3: profile before touching strength

33. Capture single-thread CPU profile.
34. Rank hottest functions by self/inclusive time.
35. Profile L1/L2/LLC cache behavior where tooling permits.
36. Profile branch misses.
37. Measure TT probe/store frequency.
38. Measure NNUE accumulator update/refresh frequency.
39. Measure NNUE inference share.
40. Measure qsearch share.
41. Measure move-picker stage distribution.
42. Measure LMR re-search frequency.
43. Measure null-move attempt/cutoff frequency.
44. Measure correction-history lookup/update frequency.
45. Capture 8-thread profile.
46. Identify false-sharing/thread-contention candidates.
47. Write ranked optimization hypothesis backlog.
48. Select first low-risk micro-optimization.

## Day 4: first optimization cycle

49. Implement candidate A behind a compile-time or small diff boundary.
50. Run formatting/build/static checks.
51. Run UCI/correctness smoke tests.
52. Run deterministic bench comparison.
53. Run microprofile comparison.
54. Run L0 game smoke batch.
55. Analyze losses/crashes/time behavior.
56. Promote candidate A to L1 or revert.
57. Run candidate A screening batch.
58. Parse paired statistics.
59. Start/continue SPRT if promising.
60. Record full experiment manifest.
61. Accept/reject candidate A.
62. Rebase next hypothesis onto accepted Crab only.
63. Implement candidate B.
64. Repeat correctness/bench gates.

## Day 5: search selectivity

65. Instrument reductions by depth/move index.
66. Instrument fail-high index distribution.
67. Build LMR baseline heat map/table output.
68. Form one LMR hypothesis.
69. Implement LMR candidate.
70. Bench and fixed-node compare.
71. L0/L1 strength screen.
72. Accept/reject and document.
73. Instrument futility pruning activation/cutoffs.
74. Form one futility-margin hypothesis.
75. Implement futility candidate.
76. Bench and fixed-node compare.
77. Strength screen.
78. Accept/reject.
79. Instrument SEE-pruning effectiveness.
80. Queue one SEE hypothesis.

## Day 6: histories/correction

81. Profile correction-history tables and cache footprint.
82. Measure correction magnitude distribution.
83. Separate correction statistics by node type/depth.
84. Form one correction-history hypothesis.
85. Implement correction candidate.
86. Correctness/bench/profile.
87. L0/L1 strength test.
88. Accept/reject.
89. Profile continuation-history accesses.
90. Measure history saturation/distribution.
91. Form one continuation/history hypothesis.
92. Implement candidate.
93. Correctness/bench/profile.
94. Strength screen.
95. Accept/reject and archive.
96. Re-rank backlog using all observed data.

After block 96 the project enters the permanent research loop below.

---

# 9. Permanent research loop

Repeat:

1. **30 min:** inspect profile/game evidence and state one hypothesis.
2. **30 min:** implement the smallest patch that tests it.
3. **30 min:** correctness/build/sanitizer checks.
4. **30 min:** deterministic bench + profiling.
5. **30 min:** L0/L1 screening.
6. **30 min:** analyze games and telemetry.
7. **30 min:** SPRT/confirmation setup or continuation.
8. **30 min:** accept/revert, archive result, choose next hypothesis.

The loop is intentionally merciless. Crab does not accumulate changes because they look clever. It accumulates changes because the evidence says they make the crab bite harder. 🦀
