# EXP-0009: Cache TT replacement score

## Status

**REJECTED.** Correctness passed, but the required first paired throughput screen was effectively flat and did not provide evidence of a performance improvement. No fresh-runner reproduction or strength testing was started, and no EXP-0009 engine source is promoted into accepted Crab.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `c8bd40810bbfe915a5e616558082df6066cbb1cf`
- Candidate branch: `exp/0009-cache-tt-replacement-score`
- Engine-change commit: `25c996b5a537991a820ef5e42fd63b45b21bb5dd`
- Screened candidate branch SHA: `d73085939ce4f2b734bc8055aac364103ba7acb5`
- Workflow checkout SHA: `ecf34c7d9d7dfd12e947972e23be6dcc58678415`

## Focused hypothesis

`TranspositionTable::probe()` scans a fixed three-entry cluster to choose the least valuable replacement entry after a miss. The accepted implementation recomputes the current replacement entry's score, `depth8 - relative_age(generation8)`, on each loop iteration.

EXP-0009 caches the current replacement score and updates it only when a new replacement candidate wins.

Hypothesis: avoiding one redundant `relative_age()`/score computation in the common case could reduce instruction overhead in the extremely hot TT miss path while preserving the exact replacement order and policy.

Counter-risk: the compiler may already keep the current score live, or the extra local/value bookkeeping may produce equal or worse code.

## Candidate change

Only `engine/src/tt.cpp` engine semantics are touched. The change:

- leaves the TT key-hit scan unchanged;
- initializes `replaceValue` from entry 0 once;
- computes each candidate entry score once;
- updates both `replace` and `replaceValue` only when the same original comparison says to replace.

No TT format, cluster size, hit precedence, replacement policy, evaluation/search constants, NNUE data, UCI identity, executable branding, GPLv3 notice, or Stockfish attribution text is changed.

Patch artifact: `experiments/EXP-0009-cache-tt-replacement-score.patch`.
Patch SHA-256: `ffa221d25e864a796421bbb806f19a3e0883dcd01b7bcd6a7d8ba011853fb698`.
Source-diff audit SHA-256: `edb5951b0712a7ebb04b906180f0836af025ea4ceb847d7d5ed4f12d3cc2fa16`.

## Correctness evidence

Crab CI run `33828551847` passed all required correctness gates:

- playable web smoke;
- native GCC build;
- native Clang build;
- Crab Chess UCI identity/handshake;
- exact deterministic bench gate;
- address/undefined sanitizer build and smoke.

The throughput workflow also built both accepted Crab and EXP-0009 successfully, verified matching NNUE files, preserved Crab Chess UCI identity, and verified exact `2050811` standalone benches.

## Throughput evidence

Workflow run: `33828551883`.
Job: `100886362910`.
Artifact: `exp0009-throughput-d73085939ce4f2b734bc8055aac364103ba7acb5` (artifact ID `9920872574`).
Artifact digest: `sha256:5a8e2833845b78b9424174d0f27c9cf0ab6534a6163de30bd5bbc8f8e25d20ad`.

Environment and settings:

- Ubuntu GitHub-hosted runner
- Clang `18.1.3`
- CPU: Intel(R) Xeon(R) 6973P-C
- 4 visible logical CPUs
- Microsoft full hypervisor
- `x86-64-avx2`
- Threads=`1`
- Hash=`16` MiB
- 20 alternating pairs
- 2 warmups
- exact `2050811` nodes for every timed sample

Network SHA-256 values:

- large NNUE: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small NNUE: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

Binary SHA-256 values:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0009 candidate: `9d84e136a4f6e7dc6eebaf83c765907d5fedbfd2dfaa59a3d4095f2085afd325`

Results:

- accepted Crab samples: `20`
- accepted median: `1246693` NPS
- accepted mean: `1246053.9` NPS
- accepted min: `1213497` NPS
- accepted max: `1276173` NPS
- accepted sample stdev: `15934.91` NPS
- EXP-0009 samples: `20`
- candidate median: `1245936` NPS
- candidate mean: `1245538.75` NPS
- candidate min: `1203527` NPS
- candidate max: `1284164` NPS
- candidate sample stdev: `19218.42` NPS
- raw median change: `-0.0607%`
- paired median change: `+0.0917%`

The raw median was slightly negative and the paired median only slightly positive. This is effectively flat relative to runner noise and does not provide evidence that the candidate is faster. The candidate also had higher sample variability than the accepted control.

## Strength evidence

**Not started.** EXP-0009 did not clear the first throughput gate, so no fresh-runner reproduction, W/D/L, Elo estimate/confidence interval, or SPRT result exists for this candidate.

## Final decision

**REJECT.** Do not promote the cached TT replacement-score change. Keep accepted Crab engine semantics unchanged from EXP-0004. The accepted lineage for this experiment remains `c8bd40810bbfe915a5e616558082df6066cbb1cf` until documentation-only evidence preservation changes it.

EXP-0009 provides no evidence of an Elo gain and no evidence for Stockfish 18 parity or superiority.
