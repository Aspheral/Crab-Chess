# EXP-0006: Active FullThreats LUT-row prefetch

## Status

**REJECTED.** The initial positive throughput screen did not reproduce on a fresh runner. No strength testing was started and no engine source is accepted from EXP-0006.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0006-active-threat-prefetch`
- Initial engine-change commit: `7e1ffa39d1c6ca5ead5e89f9160e45bc6bb47834`
- Audited candidate branch SHA before reproduction workflow: `319ff23d3d68335f39e33adb70d20bfa52cf7d96`
- Reproduction workflow SHA: `2a326cb072923ceff6ab454ab49092f1e01dd7c7`

## Focused hypothesis

During a full FullThreats refresh, each non-pawn source square can generate several threat indices. `make_index()` consumes one byte from the 64-byte `index_lut2[attacker][from]` slice for every target. EXP-0006 issues one low-locality read prefetch for that slice immediately after selecting the source square and before enumerating its occupied attack targets.

Hypothesis: fetching that one cache-line-sized LUT slice once per non-pawn source square could reduce lookup latency during full threat-index reconstruction without changing feature indices, NNUE weights, evaluation values, or search semantics.

Counter-risk: `index_lut2` is small enough that it may already be hot, making the prefetch pure overhead or harmful cache traffic.

## Candidate change

Only `engine/src/nnue/features/full_threats.cpp` engine semantics are changed. The modification:

- computes the existing orientation and attacker-orientation values once before the non-pawn source loop;
- computes the oriented source square once per source piece;
- issues `prefetch<PrefetchRw::READ, PrefetchLoc::LOW>` for `index_lut2[attackerOriented][fromOriented][0]` before target enumeration.

No pruning constants, evaluation constants, move ordering, NNUE values, search logic, UCI identity, executable branding, GPLv3 notice, or upstream attribution text is changed.

Patch artifact: `experiments/EXP-0006-active-threat-lut-prefetch.patch`.
Patch SHA-256: `4142e68f7ed089da64067e0f5e432e88dbca1ff4847fcb863d34fe4760c741a5`.

## Correctness gates

The candidate passed the required correctness gates before throughput evaluation, including native builds, sanitizer/web smoke as defined by Crab CI, Crab UCI identity, and exact deterministic bench. The fresh reproduction independently reconfirmed:

- accepted Crab bench: exactly `2050811` nodes;
- candidate bench: exactly `2050811` nodes;
- UCI name: `Crab Chess 0.1.0`;
- UCI author: `Crab Chess contributors`;
- large NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`;
- small NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`.

## Initial throughput screen

The first paired Clang AVX2 screen was positive:

- Threads: 1
- Hash: 16 MiB
- pairs: 20
- warmups: 2
- deterministic signature: `2050811` nodes for every timed sample
- paired median throughput change: **+0.5502%**

Per policy, this was treated only as a screening result and required reproduction on a fresh runner before games.

## Fresh-runner reproduction

Workflow run: `33816781477`
Job: `100850562998`
Artifact ID: `9916895099`
Artifact name: `exp0006-reproduction-2a326cb072923ceff6ab454ab49092f1e01dd7c7`
Artifact ZIP SHA-256: `b9aeeb2575beacc0ceaf53000d03fdc9bbb854a71eb91568a6541079318de0ca`

Environment and settings:

- Ubuntu 24.04.4
- Clang 18.1.3
- AMD EPYC 7763 64-Core Processor
- 4 visible logical CPUs
- Microsoft hypervisor
- x86-64-avx2
- Threads=1
- Hash=16 MiB
- 20 alternating pairs
- 2 warmups
- exact `2050811` nodes per timed sample

Binary SHA-256:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- candidate: `88ac0910461f6c6d4ae8c6fd85ee5f88befe638bc990510a7dfcdc0d37844ee9`

Measured reproduction:

| Metric | Accepted Crab | EXP-0006 candidate |
| --- | ---: | ---: |
| Median NPS | 996,506 | 995,297 |
| Mean NPS | 994,711.4 | 993,594.1 |
| Minimum NPS | 965,541 | 977,507 |
| Maximum NPS | 1,011,746 | 1,005,299 |
| Standard deviation | 12,971.49 | 7,696.95 |

- raw median change: **-0.1213%**
- paired median change: **-0.1453%**

The initial +0.5502% screen therefore did **not** reproduce. The fresh runner instead measured a small negative result.

### Reproduction audit note

The workflow's auxiliary source-diff hashing command emitted `fatal: bad object 0fb724d...` because the candidate checkout was depth 1 and did not contain the accepted-baseline object. That command was piped into `sha256sum` without `pipefail`, so it produced the empty-input SHA-256 rather than failing the job. This does not alter the throughput comparison: accepted and candidate were separately checked out at explicit SHAs, compiled independently, had recorded binary hashes, matching NNUE hashes, exact deterministic benches, and all 20 paired samples carried the required `2050811` node signature. The patch itself was independently hashed as recorded above. Future reproduction workflows should fetch the comparison object or avoid this shallow-checkout diff command.

## Strength evidence

**Not started.** The reproduction gate failed, so matched-resource games against accepted Crab and untouched SF18 were intentionally not run.

There is therefore no EXP-0006 W/D/L, Elo estimate, Elo confidence interval, or SPRT result.

## Final decision

**REJECT EXP-0006.** The active FullThreats LUT-row prefetch is not supported by reproducible throughput evidence. Do not promote its engine change into `crab/sf18-derived-base` and do not stack future experiments on this candidate.

Accepted Crab remains `0fb724d48004b8e405700c83d09c2e54f7655575`, whose engine source still contains the accepted EXP-0004 threat-weight prefetch optimization.

No Elo gain, Stockfish 18 parity, or Stockfish 18 superiority claim is made from EXP-0006.
