# Crab Chess

Crab Chess is an engine-first chess project with one deliberately extreme target:

> **Match or exceed Stockfish 18 under reproducible, controlled head-to-head testing.**

The project is not allowed to claim parity from a guessed Elo number, a handful of wins, analysis screenshots, or mismatched hardware. Strength claims must come from statistically meaningful tests with controlled time controls, openings, hardware, thread/hash settings, colors, adjudication, and engine builds.

## Project pillars

1. **Correctness before speed** — legal move generation, make/unmake, repetition, castling, en-passant, promotion, draw rules, and UCI behavior must be exact.
2. **Measurement before intuition** — every search/evaluation change should be benchmarked and, once the testing harness is mature, strength-tested.
3. **Engine-first architecture** — the native engine is the source of truth. The website is a client, eventually consuming the same engine through WebAssembly.
4. **Regression gates** — perft, tactical suites, deterministic bench, sanitizer builds, UCI protocol tests, and head-to-head results are permanent infrastructure.
5. **No fake parity** — Stockfish-18 parity means a statistically credible result under a published protocol.

## Planned architecture

```text
Crab-Chess/
├─ engine/                 # Native C++ engine core + UCI executable
│  ├─ include/crab/
│  ├─ src/
│  └─ tests/
├─ web/                    # Playable browser client; native rules now, WASM engine later
├─ tools/                  # Match runner, SPRT, benchmark, PGN/EPD utilities
├─ tests/                  # Cross-component regression positions and protocols
├─ benchmarks/             # Versioned performance/strength reference data
├─ docs/                   # Architecture, roadmap, testing protocol, research notes
└─ .github/workflows/      # CI, sanitizers, perft, web checks, benchmark smoke tests
```

## Strength roadmap

### Phase 0 — Laboratory
- Reproducible CMake builds.
- UCI shell.
- Board representation and Zobrist hashing.
- Legal move generator.
- Make/unmake correctness.
- Perft suite through known deep reference positions.
- Deterministic benchmark format.

### Phase 1 — Complete classical engine
- Iterative deepening alpha-beta/PVS.
- Quiescence search.
- Transposition table.
- Aspiration windows.
- Killer/history/countermove ordering.
- Null-move pruning.
- Futility/razoring/LMP/LMR.
- Extensions and mate-distance pruning.
- Time management.
- Classical tapered evaluation sufficient for independent testing.

### Phase 2 — High-performance core
- Bitboards and tuned attack generation.
- Cache-aware position/search structures.
- SIMD-aware hot paths.
- Multi-threaded search.
- NUMA-aware scaling where useful.
- Huge-page/hash experiments.
- Syzygy tablebase integration.
- Hardware feature dispatch.

### Phase 3 — NNUE
- Incrementally updateable accumulator.
- Quantized inference.
- SIMD kernels.
- Reproducible trainer pipeline.
- Feature-set experiments, including explicit threat-aware inputs.
- Self-play / external-eval dataset tooling.
- Network versioning and checksum pinning.

### Phase 4 — Search research loop
- Correction histories.
- Rich continuation histories.
- Data-driven LMR/LMP/futility tuning.
- Singular-extension research.
- ProbCut / multi-cut experiments.
- Search instability and time-allocation modeling.
- Automated parameter tuning.
- SPRT-gated experimental branches.

### Phase 5 — Stockfish-18 challenge protocol
Crab is only considered "on par" when it passes a published match protocol, initially:
- Same physical machine and OS image.
- Same logical thread count.
- Same hash allocation.
- Same tablebase access.
- Same opening suite and paired colors.
- Fixed engine binaries/checksums.
- Thousands of paired games as required by confidence bounds.
- Draw adjudication rules fixed before the run.
- Confidence interval and/or SPRT result reported with raw PGNs.

A stretch gate for "better" is a positive result reproduced on more than one hardware class and at more than one time control.

## Website goals

The website is not a toy demo. It should become the public cockpit for Crab:
- Play local chess immediately.
- Human vs Crab when WASM engine support lands.
- Engine analysis with PV, depth, nodes, NPS, hashfull, WDL, and evaluation graph.
- FEN/PGN import/export.
- Board flip, premoves, drag/tap movement, keyboard accessibility.
- Clocks and common time controls.
- Analysis arrows and square annotations.
- Engine build/version selector.
- Benchmark/strength dashboard sourced from checked-in results.
- Mobile-first responsive board inspired by the strongest parts of Vanta Chess, but with clearer information hierarchy, better accessibility, and tighter engine telemetry.

## Development rule

Every meaningful engine commit should answer at least one of these:

- Did correctness improve?
- Did speed improve at equal behavior?
- Did playing strength improve under a controlled test?
- Did observability/testing improve enough to make the next strength gain safer?

If the answer is none of the above, the change needs a very good reason.

## Current status

Bootstrap stage. See `docs/ROADMAP.md` once the initial project scaffold lands.
