# Crab Chess Roadmap

## Mission

Build an original, auditable UCI chess engine and surrounding testing infrastructure capable of eventually matching or exceeding Stockfish 18 under controlled head-to-head testing.

This is a research program, not a feature checklist. Every stage below exists to make the next strength claim more trustworthy.

---

## 1. What “on par with Stockfish 18” means

Crab may not claim parity because of a website Elo estimate, a tactical puzzle score, a few wins, a single long game, or a match with unequal resources.

The eventual parity protocol must freeze:

- Crab commit SHA and executable checksum.
- Stockfish 18 release binary/source commit and network checksum.
- CPU model, operating system, frequency policy, thread count, affinity policy, and NUMA policy.
- Hash size and tablebase access.
- Opening book/suite and randomized seed.
- Time control and increment.
- Color-paired openings.
- Adjudication rules.
- Number of games / stopping rule.
- Statistical method and confidence level.

### Strength gates

- **Gate S0:** beats a deliberately weak internal baseline reliably.
- **Gate S1:** stable against common open-source engines around club strength.
- **Gate S2:** competitive with mature classical engines.
- **Gate S3:** competitive with strong NNUE engines.
- **Gate S4:** within a statistically meaningful distance of Stockfish 18.
- **Gate S5 (parity):** a matched-resource test cannot establish Stockfish 18 as stronger at the predefined confidence threshold.
- **Gate S6 (better):** Crab shows a reproducible positive result on at least two hardware classes and at least two materially different time controls.

---

## 2. Repository architecture

```text
engine/
  include/crab/          public engine headers
  src/                   board, movegen, search, eval, UCI, threading
  tests/                 native correctness/unit tests
web/                     browser board + future Crab WASM integration
tools/
  match/                 tournament runner adapters + result parser
  tune/                  parameter tuning / SPSA-style utilities
  data/                  PGN/EPD/FEN transformation and dataset tools
  nnue/                  training/export/inference verification
benchmarks/              deterministic performance baselines + result manifests
tests/
  perft/                 canonical perft positions
  tactics/               EPD tactical regression suites
  positions/             search/eval regression corpus
  protocol/              UCI command/response fixtures
docs/
  ROADMAP.md
  ARCHITECTURE.md
  TESTING.md
  STRENGTH-PROTOCOL.md
  NNUE.md
.github/workflows/        build/test/sanitize/web/benchmark CI
```

The native engine is the source of truth. Browser logic is allowed to use a temporary rules dependency during bootstrap, but the long-term website must load the same Crab engine core through WebAssembly.

---

## 3. Non-negotiable engineering gates

### Correctness gate

No search optimization is trusted until all of the following are green:

- Start-position perft through at least depth 6 in development; deeper/offline runs as practical.
- Kiwipete and other castling/en-passant/promotion-heavy perft positions.
- Make/unmake restores full state byte-for-byte or field-for-field where appropriate.
- Zobrist key consistency after make/unmake and transpositions.
- Repetition handling including en-passant edge cases.
- Fifty-move counter behavior.
- Legal evasions while in check, double check, pins, discovered checks.
- Castling legality through attacked squares.
- Promotion generation for all four promotion pieces.

### Search regression gate

Every search change should preserve or improve:

- Mate finding on fixed suites.
- No illegal PV moves.
- No score sign inversions across side-to-move.
- Deterministic single-thread benchmark signature when configured deterministically.
- Node-count expectations for fixed positions where the algorithm is intended to remain unchanged.
- No sanitizer findings.

### Performance gate

Track at minimum:

- Nodes/second.
- Evaluation calls/second.
- Move-generation calls/second.
- TT hit/cutoff rate.
- Branching factor by depth.
- LMR re-search rate.
- Null-move fail-high rate.
- QSearch share of total nodes.
- Hashfull.
- Time-to-depth on fixed positions.
- Thread scaling efficiency.

### Strength gate

Once self-play is meaningful, experimental changes should be accepted by a staged ladder:

1. Unit/perft/sanitizer pass.
2. Deterministic bench pass.
3. Tactical/regression suite pass.
4. Short fixed-node game batch to catch catastrophic regressions.
5. SPRT or equivalent sequential test against the current accepted baseline.
6. Longer time-control confirmation for major search/eval changes.

---

## 4. Engine implementation phases

## Phase A — Board kernel

Deliverables:

- 64-bit bitboards.
- Square/piece/color/move compact types.
- Piece-list or piece-bitboard representation chosen from profiling, not dogma.
- Side to move, castling rights, en-passant square, halfmove/fullmove state.
- Zobrist hashing.
- Precomputed pawn/knight/king attacks.
- Fast sliding attacks, initially a correct portable implementation, then magic/PEXT or equivalent optimized dispatch.
- FEN parse/serialize.
- UCI move parse/format.
- Make/unmake with reversible state stack.

Exit condition: canonical perft suite passes.

## Phase B — Baseline search

Deliverables:

- Negamax alpha-beta.
- Iterative deepening.
- Principal variation search.
- Quiescence search.
- Mate-distance scoring.
- Check extensions.
- Transposition table with replacement policy and generation aging.
- PV extraction.
- Search stop tokens and node/time limits.

Exit condition: stable legal UCI engine can complete games.

## Phase C — Move ordering

Implement and measure:

- TT move first.
- Promotions and winning captures.
- SEE-based capture ordering.
- Killer heuristic.
- Quiet history.
- Capture history.
- Countermoves.
- Continuation history.
- History gravity / maluses.

Metrics: fail-high move index distribution and effective branching factor.

## Phase D — Pruning and reductions

Research separately, each behind a testable patch:

- Null-move pruning with verification conditions.
- Reverse futility pruning.
- Razoring.
- Futility pruning.
- Late move pruning.
- Late move reductions with depth/move-index tables or formulas.
- History-based pruning/reduction adjustments.
- SEE pruning.
- ProbCut.
- Internal iterative reductions.
- Singular extension framework.
- Multi-cut experiments only if data supports them.

No bundle-of-ten-heuristics commits. Each heuristic needs its own bench and strength evidence.

## Phase E — Time management

Build time management as an engine subsystem rather than a `remaining / 30` formula.

Inputs:

- Remaining time.
- Increment.
- Moves-to-go if supplied.
- Search depth trajectory.
- PV stability.
- Best-move stability.
- Score volatility.
- Root move competition.
- Node growth.
- Opponent time where useful for practical play modes.

Outputs:

- Optimum time.
- Maximum time.
- Soft stop.
- Hard stop.
- Ponder transition handling.

Regression tests must cover bullet, blitz, rapid, classical, zero-increment, tiny remaining time, and large increments.

## Phase F — Evaluation before NNUE

A classical evaluator is useful as a transparent bootstrap baseline and debugging oracle.

Track:

- Material.
- Piece-square terms.
- Pawn structure.
- Mobility.
- King safety.
- Passed pawns.
- Space.
- Threats.
- Outposts.
- Bishop pair.
- Rook files/seventh rank.
- Tempo.
- Endgame scaling.

Keep terms measurable and removable. Do not turn the classical evaluator into a permanent maze once NNUE becomes superior.

## Phase G — NNUE foundation

Deliverables:

- Versioned feature schema.
- Sparse feature activation.
- Incrementally updated accumulators.
- Quantized integer inference.
- Scalar reference implementation.
- SIMD implementations with bit-exact validation against scalar output.
- Network file format with checksum.
- Trainer + exporter + verifier.
- Reproducible training manifest.

Research tracks:

- HalfKP-style baseline.
- King-bucket variants.
- Threat-aware features.
- Multiple accumulator perspectives.
- Network width/depth tradeoffs.
- Activation/quantization choices.
- Output buckets / phase conditioning.

## Phase H — Parallel search and hardware

- Lazy-SMP style baseline.
- Thread-local histories where appropriate.
- Carefully selected shared history structures.
- Shared TT.
- False-sharing audit.
- NUMA-aware thread grouping.
- CPU feature dispatch: portable, POPCNT/BMI2, AVX2, AVX-512/VNNI where useful.
- Large-page experiments.
- Profile-guided optimization.
- LTO builds.

Thread count increases must be measured by Elo or time-to-depth, not NPS alone.

## Phase I — Endgames and tablebases

- Syzygy WDL/DTZ probing.
- Root tablebase move selection.
- Search tablebase cutoffs.
- Fifty-move aware DTZ handling.
- Material-key based specialized endgame logic only where measurable.

## Phase J — Research/testing farm

Build a Crab equivalent of a lightweight Fishtest workflow:

- Candidate commit.
- Baseline commit.
- Reproducible build manifest.
- Opening suite version.
- Worker hardware fingerprint.
- Paired games.
- Result upload.
- SPRT state.
- Automatic accept/reject recommendation.
- PGN archive.
- Crash/timeout quarantine.

The testing system eventually matters almost as much as the engine. High-end engine work is a statistics problem wearing a chessboard costume.

---

## 5. Website roadmap

### Web Stage 0 — Bootstrap (current)

- Responsive board.
- Legal local play.
- Promotion selection.
- Check/checkmate/draw status.
- Move list.
- PGN/FEN copy.
- Undo/new/flip.
- Mobile layout.

### Web Stage 1 — Vanta-quality interaction, improved

- Drag and tap movement.
- Touch ghost piece.
- Premoves.
- Last-move animation.
- Check animation that does not obscure pieces.
- Right-click arrows and square highlights.
- Keyboard navigation.
- Full accessibility labels.
- Sound toggles.
- Board themes and piece themes.

### Web Stage 2 — Real game shell

- Clocks.
- Time-control presets.
- PGN/FEN import.
- Game termination modal.
- Resign/draw controls.
- Persistent settings.
- Shareable position URL.

### Web Stage 3 — Crab WASM

- Compile native core with Emscripten.
- Run engine in Worker.
- UCI bridge.
- Human vs Crab.
- MultiPV analysis.
- Depth/nodes/NPS/hashfull/WDL/PV telemetry.
- Analysis arrows and evaluation graph.

### Web Stage 4 — Research cockpit

- Select engine build by manifest.
- Load benchmark JSON.
- Compare two Crab revisions.
- View perft/bench/strength history.
- Browse failed tactical positions.
- Export reproducible bug package.

---

## 6. 30-minute development schedule

### Important cadence rule

The engineering queue is intentionally divided into 30-minute blocks. An automated ChatGPT task can currently execute at most once per hour, so each automated run should consume **two consecutive blocks** from this queue whenever the work can be completed safely in one run. Human/manual sessions can follow the blocks exactly every 30 minutes.

Each block ends with one of: code + test, benchmark evidence, documentation, or a clearly recorded blocker. No block should end with an untested pile of changes.

### Day 1 — Repository and executable spine

| Block | Work |
|---|---|
| 01 | Freeze mission, parity definition, repository layout, contribution rules. |
| 02 | Add CMake C++20 build, warning policy, sanitizer option, CTest entrypoint. |
| 03 | Implement UCI process shell: `uci`, `isready`, `ucinewgame`, `quit`. |
| 04 | Add UCI smoke test and CI matrix skeleton. |
| 05 | Define `Color`, `PieceType`, `Piece`, `Square`, `Move`, `Score`, `Depth`, `Value` types. |
| 06 | Define position state structure and reversible state stack. |
| 07 | Implement square/file/rank helpers and algebraic square conversion. |
| 08 | Implement bitboard utility layer: set/clear/test/popcount/lsb/pop-lsb. |
| 09 | Generate pawn attack lookup tables. |
| 10 | Generate knight and king attack lookup tables. |
| 11 | Implement portable rook/bishop ray attacks. |
| 12 | Add attack-table unit tests for corners, center, blockers. |
| 13 | Add FEN parser with strict error reporting. |
| 14 | Add FEN serializer and round-trip tests. |
| 15 | Add Zobrist key tables with deterministic seed. |
| 16 | Add Zobrist recomputation reference and position-key tests. |

### Day 2 — Move generation correctness

| Block | Work |
|---|---|
| 17 | Implement pseudo-legal pawn pushes and captures. |
| 18 | Add double pushes, en-passant candidates, and promotion generation. |
| 19 | Implement knight moves. |
| 20 | Implement bishop/rook/queen sliding moves. |
| 21 | Implement king moves. |
| 22 | Implement castling candidates with rights/path checks. |
| 23 | Implement attack detection for arbitrary square/color. |
| 24 | Implement checkers calculation. |
| 25 | Implement pinned-piece detection or legal-filter baseline. |
| 26 | Implement legal move filtering through make/unmake reference path. |
| 27 | Implement make move for quiet/capture moves. |
| 28 | Add promotion/en-passant/castling make logic. |
| 29 | Implement unmake and state restoration. |
| 30 | Add make/unmake round-trip corpus. |
| 31 | Implement perft driver and divide output. |
| 32 | Validate start position depths 1–5, record node counts. |

### Day 3 — Perft gauntlet and UCI position handling

| Block | Work |
|---|---|
| 33 | Add Kiwipete perft fixture. |
| 34 | Add en-passant legality edge fixtures. |
| 35 | Add promotion-heavy fixtures. |
| 36 | Add castling-through-check fixtures. |
| 37 | Fix first perft discrepancies; add regression tests for each bug. |
| 38 | Continue perft debugging until all fixtures pass target depths. |
| 39 | Add `position startpos moves ...` UCI parsing. |
| 40 | Add `position fen ... moves ...` parsing. |
| 41 | Add UCI move parser including promotions. |
| 42 | Add UCI move formatter. |
| 43 | Implement repetition key history. |
| 44 | Implement fifty-move bookkeeping. |
| 45 | Add insufficient-material helper if used by engine protocol. |
| 46 | Add legal move count / game-over helpers. |
| 47 | Add debug `d`, `fen`, and `perft` developer commands. |
| 48 | Run sanitizer/perft soak and fix undefined behavior. |

### Day 4 — Baseline search

| Block | Work |
|---|---|
| 49 | Define search stack and root result structures. |
| 50 | Implement static material-only evaluation as first oracle. |
| 51 | Implement basic negamax alpha-beta. |
| 52 | Add terminal mate/stalemate/draw scoring. |
| 53 | Add iterative deepening loop. |
| 54 | Add PV table / PV reconstruction. |
| 55 | Add UCI `go depth N`. |
| 56 | Add UCI `bestmove` and `info depth score nodes pv`. |
| 57 | Implement quiescence search with captures/promotions. |
| 58 | Add stand-pat and in-check qsearch behavior. |
| 59 | Add mate-distance score normalization. |
| 60 | Add search stop flag and node limit. |
| 61 | Add monotonic timer abstraction. |
| 62 | Add `go movetime` hard stop. |
| 63 | Add basic remaining-time allocation. |
| 64 | Play first legal Crab-vs-Crab games and save PGNs. |

### Day 5 — Transposition table and ordering

| Block | Work |
|---|---|
| 65 | Design 16-byte/compact TT entry target and replacement semantics. |
| 66 | Implement TT allocation, clear, generation aging. |
| 67 | Add exact/lower/upper bound probe/store. |
| 68 | Normalize mate scores into/out of TT. |
| 69 | Order TT move first. |
| 70 | Add MVV-LVA baseline capture score. |
| 71 | Implement static exchange evaluation reference. |
| 72 | Replace capture ordering with SEE-aware scoring. |
| 73 | Add killer moves. |
| 74 | Add quiet history table. |
| 75 | Add history bonuses on beta cutoffs. |
| 76 | Add history maluses to failed quiets. |
| 77 | Instrument fail-high move index distribution. |
| 78 | Add deterministic `bench` command and signature. |
| 79 | Record baseline nodes, NPS, depth, TT hit rate. |
| 80 | Refactor only measured hot spots found by profiling. |

### Day 6 — PVS, aspiration, pruning

| Block | Work |
|---|---|
| 81 | Convert alpha-beta to PVS. |
| 82 | Add aspiration windows around previous iteration score. |
| 83 | Add fail-low/high widening logic. |
| 84 | Implement null move make/unmake state. |
| 85 | Add conservative null-move pruning. |
| 86 | Add zugzwang-sensitive disable conditions. |
| 87 | Add reverse futility pruning experiment behind constant/flag. |
| 88 | Add shallow futility pruning experiment. |
| 89 | Implement late move pruning experiment. |
| 90 | Add baseline LMR table/formula. |
| 91 | Add LMR re-search when reduced move raises alpha. |
| 92 | Condition LMR on checks, captures, PV, history. |
| 93 | Instrument reduction counts and re-search rates. |
| 94 | Run tactical suite before/after pruning changes. |
| 95 | Split any bundled regression into one heuristic at a time. |
| 96 | Establish first accepted search baseline tag/manifest. |

### Day 7 — Website + CI + research loop consolidation

| Block | Work |
|---|---|
| 97 | Validate local web board on desktop viewport. |
| 98 | Validate mobile/touch layout and coordinate visibility. |
| 99 | Add drag interaction without breaking click/tap. |
| 100 | Add right-click arrows and square annotations. |
| 101 | Add FEN input and safe error surface. |
| 102 | Add PGN import/export. |
| 103 | Add local clocks and time-control selector. |
| 104 | Add resign/draw/new-game termination flow. |
| 105 | Add browser smoke test or DOM-level test harness. |
| 106 | Add Linux GCC/Clang CI builds. |
| 107 | Add sanitizer CI job. |
| 108 | Add perft regression CI job. |
| 109 | Add deterministic bench smoke job. |
| 110 | Add web static-file validation job. |
| 111 | Write `docs/STRENGTH-PROTOCOL.md` with paired-opening match format. |
| 112 | Open next research milestone: evaluation + stronger search histories. |

---

## 7. After the first 112 blocks

Use a repeating research loop rather than a fixed fantasy calendar:

### Block A — Hypothesis
Choose one measurable idea. Define expected mechanism, affected metrics, and failure mode.

### Block B — Minimal implementation
Implement the smallest version behind a constant or feature switch.

### Block C — Correctness
Run unit, perft, sanitizer, protocol, and tactical checks.

### Block D — Performance
Run deterministic bench and collect node/NPS/branching telemetry.

### Block E — Short strength test
Run a small paired opening set against accepted baseline. Reject catastrophic regressions immediately.

### Block F — Statistical test
If promising, launch the predefined SPRT/large match.

### Block G — Diagnose
Inspect losses, time usage, PV instability, fail-high distribution, and tactical misses.

### Block H — Accept or revert
Merge only with evidence. Store manifest/results. Then start the next hypothesis.

This eight-block loop is four hours of structured engineering before long-running game tests. It repeats for move ordering, pruning, evaluation, NNUE, time management, parallelism, and low-level optimization.

---

## 8. Major milestone sequence

1. **M0 Bootstrap:** repo, UCI shell, playable web board, CI.
2. **M1 Legal Crab:** perfect movegen/perft and full UCI position support.
3. **M2 Thinking Crab:** complete legal games with baseline alpha-beta/qsearch.
4. **M3 Fast Crab:** TT, PVS, ordering, pruning, reductions, robust time control.
5. **M4 Trained Crab:** NNUE inference + reproducible training pipeline.
6. **M5 Many Crabs:** scalable multithread search and hardware dispatch.
7. **M6 Lab Crab:** distributed/parallel strength testing with SPRT gates.
8. **M7 Tournament Crab:** strong-engine ladder and public benchmark manifests.
9. **M8 Stockfish Challenge:** controlled Stockfish 18 match protocol.
10. **M9 Research Continuum:** repeat measured experiments until parity is reached or evidence shows a different architecture is needed.

There is deliberately no promised calendar date for M8. Stockfish-level strength is the product of years of search research, huge testing volume, optimized NNUE, and hardware work. Crab’s schedule optimizes the rate of trustworthy experiments rather than inventing a finish date.
