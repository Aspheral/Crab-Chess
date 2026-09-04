# Crab Chess

Crab Chess is a high-performance GPLv3 UCI chess engine and research project with one deliberately extreme target:

> **Match or exceed the official Stockfish 18 release under reproducible, controlled head-to-head testing.**

Crab does not start from a toy engine. The native engine is being rebased onto the official Stockfish 18 release (`sf_18`, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official bench `2050811`) and then developed as a measured optimization fork.

## Identity

The product identity is **Crab Chess**.

User-facing and project-owned surfaces use Crab branding:

- executable: `crab`
- UCI engine name: `Crab Chess`
- build targets and packages: Crab
- website and WASM client: Crab Chess
- benchmark/experiment names: Crab
- new namespaces, tools, documentation, telemetry, and release artifacts: Crab

The upstream GPLv3 license and copyright/provenance notices are preserved where legally required. See `UPSTREAM.md` and `Copying.txt` once the Stockfish-18 source import is complete.

## Development model

Crab uses two baselines.

1. **Immutable upstream baseline** — official Stockfish 18, commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.
2. **Accepted Crab baseline** — the strongest Crab commit that has passed the project’s correctness, benchmark, and strength gates.

Every engine experiment is small enough to measure independently. A candidate must answer:

- Is it correct?
- Does deterministic bench remain valid?
- Did speed improve without changing intended behavior?
- Did playing strength improve against the accepted Crab baseline?
- Does it also hold up against the untouched SF18 reference where the experiment warrants direct comparison?

Changes without evidence are rejected or reverted.

## Strength claims

Crab may not claim parity from a guessed Elo, analysis depth, NPS alone, a tactical suite, or a small handful of wins.

The eventual challenge protocol freezes:

- exact Crab and SF18 commit/binary checksums
- NNUE network checksums
- CPU and operating system
- compiler and architecture target
- thread count and affinity
- hash size
- NUMA policy
- tablebase access
- opening suite and seed
- paired colors
- time control
- adjudication rules
- number of games or sequential stopping rule
- confidence interval and/or SPRT bounds

A claim that Crab is **better** must be reproduced across more than one hardware class and more than one materially different time control.

## Engine research priorities

Because the starting point is already SF18-strength code, Crab development focuses on improvements rather than reimplementing solved foundations:

### Search
- correction-history experiments
- continuation/capture/pawn-history refinements
- LMR/LMP/futility formula research
- pruning interaction studies
- singular-extension and ProbCut refinements
- root search stability
- time-allocation modeling
- thread interaction and search-diversity experiments

### Evaluation / NNUE
- SFNNv10-compatible baseline validation
- alternative threat representations
- feature-transformer experiments
- accumulator/update-path optimization
- quantization and SIMD research
- network architecture experiments backed by reproducible training recipes

### Performance
- hot-path profiling
- cache layout and false-sharing work
- modern CPU instruction dispatch
- AVX2/AVX-512/VNNI experiments
- NUMA behavior
- transposition-table layout/replacement research
- PGO/LTO and compiler-specific tuning

### Testing infrastructure
- deterministic bench tracking
- paired game runner
- SPRT automation
- experiment manifests
- PGN archive
- performance telemetry
- regression position suites
- reproducible build metadata

## Website

The website is the public Crab Chess cockpit. It will provide:

- playable local chess
- Human vs Crab through WebAssembly
- engine analysis with PV, depth, seldepth, nodes, NPS, hashfull, WDL, and evaluation
- FEN/PGN import/export
- clocks and common time controls
- premoves, drag/tap interaction, arrows, annotations, and mobile support
- engine version/build selection
- benchmark and strength-history dashboards

The board may inherit the strongest interaction ideas from Vanta Chess, but Crab’s version should be cleaner, more accessible, and more useful as an engine-development interface.

## Repository shape

```text
Crab-Chess/
├─ engine/                 # Crab native C++ engine derived from the SF18 baseline
├─ upstream/               # immutable provenance/reference metadata where useful
├─ experiments/            # optimization manifests and accepted/rejected results
├─ tools/                  # match runner, SPRT, benchmark, PGN/EPD utilities
├─ benchmarks/             # deterministic performance and strength records
├─ web/                    # Crab Chess browser client + future WASM engine
├─ docs/                   # architecture, roadmap, testing and research notes
└─ .github/workflows/      # CI, sanitizers, benchmarks, web and match smoke tests
```

## License and provenance

Crab Chess is distributed under the GNU General Public License v3 because its engine is derived from GPLv3-licensed upstream code. Required upstream copyright and license notices are retained. Crab-specific modifications are clearly marked and tracked in Git history and experiment records.

See `UPSTREAM.md` for the frozen source anchor and derivation policy.
