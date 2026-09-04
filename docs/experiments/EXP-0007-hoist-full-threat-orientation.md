# EXP-0007: Hoist FullThreats orientation invariants

## Status

**REJECTED.** The initial positive throughput screen did not reproduce on a fresh runner. No strength testing was started and no engine source is accepted from EXP-0007.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `0fb724d48004b8e405700c83d09c2e54f7655575`
- Candidate branch: `exp/0007-hoist-full-threat-orientation`
- Initial engine-change commit: `824e9f4995b5ae813b4ec3e1efb264a0864b0d38`
- Screened candidate SHA: `6d8f2c768347990ec9f56f9d7f276c65e3ec0280`

## Focused hypothesis

`FullThreats::append_active_indices()` reconstructs every active threat index during a full threat-accumulator refresh. In accepted Crab, every call to `FullThreats::make_index()` recomputes three values that are invariant across many indices in that refresh:

- king/perspective orientation;
- perspective color swap;
- oriented attacker identity for the current attacker piece.

EXP-0007 hoists those invariants out of the per-threat indexing path. A small internal helper consumes the precomputed orientation, swap, and oriented attacker while preserving the existing `FullThreats::make_index()` interface for incremental threat updates.

Hypothesis: eliminating repeated orientation/swap/attacker bookkeeping during full FullThreats reconstruction could slightly reduce instruction overhead without changing feature indices, NNUE weights, evaluation values, or search semantics.

Counter-risk: the compiler may already perform equivalent common-subexpression elimination/inlining, making the source-level hoist neutral or harmful through register pressure/code shape.

## Candidate change

Only `engine/src/nnue/features/full_threats.cpp` engine semantics are changed. The modification:

- introduces an always-inline `make_index_oriented()` helper containing the existing final LUT/index calculation;
- keeps `FullThreats::make_index()` behavior intact by computing the same values and forwarding to the helper;
- computes orientation and perspective swap once per `append_active_indices()` invocation;
- computes oriented attacker identity once per attacker piece loop;
- uses those precomputed invariants for pawn and non-pawn active threat indices.

No pruning constants, evaluation constants, move ordering, NNUE values, search logic, threat feature mapping, UCI identity, executable branding, GPLv3 notice, or upstream attribution text is changed.

Patch artifact: `experiments/EXP-0007-hoist-full-threat-orientation.patch`.
Audited patch SHA-256: `fd231481660d1f4bcb0d302b8e9df5f2ff3cedb478eba71fcd7d7643e4caf11d`.
Audited engine-source diff SHA-256: `8439a48b5c05aeb7e689cfc27f4cea0f174833ccf78b643e752d0e82b7b89fde`.

An earlier provisional ledger value for the patch hash was stale; the hashes above are the values recorded by both the screening and reproduction workflows for the exact screened candidate.

## Correctness gates

Crab CI run `33822469053` passed all required correctness gates for the screened candidate:

- native GCC build: pass;
- native Clang build: pass;
- address/undefined sanitizer build and UCI smoke: pass;
- playable website smoke: pass;
- Crab Chess UCI identity/handshake: pass;
- candidate deterministic bench: exactly `2050811` nodes;
- accepted Crab deterministic bench in the throughput workflow: exactly `2050811` nodes;
- large and small NNUE checksums match control and candidate.

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

## Initial throughput screen

Workflow run: `33822469114`
Job: `100867894854`
Artifact ID: `9918786893`
Artifact name: `exp0007-throughput-6d8f2c768347990ec9f56f9d7f276c65e3ec0280`
Artifact ZIP SHA-256: `399bf4173bd0e11417efc1e223579b8abcbba3fea122840328a68b3b8121ed59`

Environment and settings:

- Ubuntu GitHub-hosted runner
- Clang 18.1.3
- AMD EPYC 9V45 96-Core Processor
- Microsoft hypervisor
- x86-64-avx2
- Threads=1
- Hash=16 MiB
- 20 alternating pairs
- 2 warmups
- exact `2050811` nodes per timed sample

Binary SHA-256:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0007 candidate: `03fd17e20caf98eda2ff28c49ff184d2628c43b897eabd5840c8d8626741e657`

Measured screen:

| Metric | Accepted Crab | EXP-0007 candidate |
| --- | ---: | ---: |
| Median NPS | 1,550,121 | 1,560,147 |
| Mean NPS | 1,556,336.35 | 1,568,838.05 |
| Minimum NPS | 1,476,465 | 1,488,251 |
| Maximum NPS | 1,635,415 | 1,641,962 |
| Standard deviation | 47,818.49 | 42,019.88 |

- raw median change: **+0.6468%**
- paired median change: **+0.7711%**

This was treated only as a positive screening result and advanced to mandatory fresh-runner reproduction. No games were started.

## Fresh-runner reproduction

Workflow run: `33824623040`
Job: `100874529252`
Artifact ID: `9919524741`
Artifact name: `exp0007-reproduction-6d8f2c768347990ec9f56f9d7f276c65e3ec0280`
Artifact ZIP SHA-256: `055fa18287026e7fd50e12153c51d2e33639170a9512098121165b1ce7181ddc`

The reproduction checked out and measured the exact screened candidate SHA `6d8f2c768347990ec9f56f9d7f276c65e3ec0280` on a separate fresh runner. Its provenance, source-scope audit, builds, exact deterministic benches, Crab UCI identity, and NNUE checksum match all passed before measurement.

Environment and settings:

- Ubuntu GitHub-hosted runner
- Clang 18.1.3
- AMD EPYC 9V45 96-Core Processor
- Microsoft hypervisor
- x86-64-avx2
- Threads=1
- Hash=16 MiB
- 20 alternating pairs
- 2 warmups
- exact `2050811` nodes per timed sample

Binary SHA-256 matched the screening build:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0007 candidate: `03fd17e20caf98eda2ff28c49ff184d2628c43b897eabd5840c8d8626741e657`

Measured reproduction:

| Metric | Accepted Crab | EXP-0007 candidate |
| --- | ---: | ---: |
| Median NPS | 1,592,244 | 1,579,369 |
| Mean NPS | 1,592,116.20 | 1,587,528.20 |
| Minimum NPS | 1,483,944 | 1,515,750 |
| Maximum NPS | 1,636,720 | 1,636,720 |
| Standard deviation | 37,448.15 | 31,103.59 |

- raw median change: **-0.8086%**
- paired median change: **-0.3514%**

The initial positive result therefore did **not** reproduce. The fresh runner measured the candidate slower than accepted Crab by both raw and paired median metrics.

## Workflow audit note

Unlike EXP-0006, EXP-0007 used a full-history candidate checkout and `set -euo pipefail` for source-diff verification. The fresh reproduction was also pinned to the exact screened candidate SHA, so later workflow-only commits on the experiment branch did not alter the engine candidate being reproduced.

## Strength evidence

**Not started.** The reproduction gate failed, so matched-resource games against accepted Crab and untouched SF18 were intentionally not run.

There is therefore no EXP-0007 W/D/L, Elo estimate, Elo confidence interval, or SPRT result.

## Final decision

**REJECT EXP-0007.** Hoisting the FullThreats orientation invariants is not supported by reproducible throughput evidence. Do not promote its engine change into `crab/sf18-derived-base` and do not stack future experiments on this candidate.

Accepted Crab remains `0fb724d48004b8e405700c83d09c2e54f7655575`.

No Elo gain, Stockfish 18 parity, or Stockfish 18 superiority claim is made from EXP-0007.
