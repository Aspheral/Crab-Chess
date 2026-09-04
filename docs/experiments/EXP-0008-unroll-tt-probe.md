# EXP-0008: Unroll fixed-size TT probe loops

## Status

**REJECTED.** Correctness passed, but the first paired throughput screen was negative. No reproduction run or strength testing was started, and no EXP-0008 engine source is promoted.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0008-unroll-tt-probe`
- Engine-change commit: `2dfd1491f964ecf55f7e365d509c43338fe09f1a`
- First-screen candidate branch SHA: `b1ef100d67a44924e46e48ca4846e2803cc3ad17`
- Workflow checkout SHA: `09c52343f72a76db5dc49fa932f164a9ef10211a`

## Focused hypothesis

`TranspositionTable::probe()` is executed at extremely high frequency. Crab inherits Stockfish 18's fixed three-entry TT cluster and used two small counted loops: one to scan the three entries for a key hit and another to select the least valuable replacement entry.

EXP-0008 explicitly unrolled those fixed-size loops while preserving the exact comparison order and replacement policy.

Hypothesis: making the three-entry control flow explicit could reduce loop/control overhead or produce a more favorable instruction layout on the tested Clang AVX2 build.

Counter-risk: the compiler may already fully unroll these constant-trip-count loops, making the source change neutral or slightly worse through code-size or branch-layout effects.

## Candidate change

Only `engine/src/tt.cpp` engine semantics were touched. The change:

- replaced the `ClusterSize == 3` key-scan loop with three ordered key comparisons;
- replaced the two-iteration replacement-selection loop with the same two ordered comparisons;
- preserved hit precedence, `TTEntry::read()`, occupancy behavior, generation aging, replacement value calculation, cluster size/layout, hash size, and writer selection.

No evaluation constants, pruning constants, move ordering, TT format, TT replacement policy, NNUE values, search logic, UCI identity, executable branding, GPLv3 notice, or Stockfish attribution text changed.

Patch artifact: `experiments/EXP-0008-unroll-tt-probe.patch`.

Recorded patch SHA-256 from the tested candidate artifact: `3e7cff50870ad126acdbbcebe1d1764c82d5fd9237dfc26a40bf9f91bbbce65c`.

Source-diff SHA-256 recorded by the workflow: `fdf44cf7737507fd613071108554a4408f674db4d864481e148a0026c22d5dbd`.

## Correctness evidence

Crab CI run `33825560557` completed successfully. All required correctness gates passed:

- native GCC build;
- native Clang build;
- Crab Chess UCI identity and handshake;
- exact deterministic `2050811`-node bench;
- address/undefined sanitizer build and UCI smoke;
- playable website smoke.

The matched throughput workflow also independently built accepted Crab and EXP-0008, verified the exact `2050811`-node bench for both, and verified matching NNUE network checksums.

## Throughput evidence

Workflow run: `33825560587`

Job: `100877350001`

Artifact: `exp0008-throughput-b1ef100d67a44924e46e48ca4846e2803cc3ad17`

Artifact ID: `9919861105`

Artifact digest: `sha256:bdde3a3daaf20dc71654d15a80b47d544c35ddac1c1b2412b127e7db855462a2`

Environment and settings:

- Ubuntu GitHub-hosted runner
- Clang `18.1.3`
- CPU: AMD EPYC 9V74 80-Core Processor
- 4 visible logical CPUs under Microsoft hypervisor
- architecture: `x86-64-avx2`
- Threads: `1`
- Hash: `16 MiB`
- alternating pairs: `20`
- warmups: `2`
- expected/timed nodes per sample: `2050811`

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

Binary SHA-256:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0008 candidate: `6ef9dd74763b34fbe2fbed8cce7715a70b0b489d83d17c685614340dfba3af06`

Results:

- accepted Crab median: `1190257` NPS
- EXP-0008 median: `1187499` NPS
- accepted Crab mean: `1186686.15` NPS
- EXP-0008 mean: `1180494.35` NPS
- accepted Crab range: `1142513` to `1209204` NPS
- EXP-0008 range: `1105558` to `1218544` NPS
- accepted Crab sample standard deviation: `18780.17` NPS
- EXP-0008 sample standard deviation: `25650.41` NPS
- raw median change: `-0.2317%`
- paired median change: `-0.5837%`
- every timed sample: exactly `2050811` nodes

The first screen was negative. EXP-0008 therefore did not qualify for a fresh-runner reproduction.

## Strength evidence

**Not started.** The first throughput screen failed, so no matched games were run against accepted Crab or untouched SF18. No W/D/L, Elo estimate/confidence interval, or SPRT result exists for EXP-0008.

## Final decision

**REJECT.** Keep the accepted Crab TT probe implementation unchanged. Do not promote the explicit unroll.

This experiment provides no evidence of an Elo gain and no evidence for Stockfish 18 parity or superiority.
