# EXP-0017: Multi-cut correction-history update

## Status

**REJECTED. NOT PROMOTED.** The candidate passed Crab's correctness, deterministic-bench, sanitizer, provenance, and matched-resource harness gates, but the first complete strength screen did not show a positive signal worth replication.

No Stockfish 18 parity or superiority claim is made.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `541afd8655dc6bebeaa6b958b349f200139121bc`
- Accepted Crab engine semantics remain EXP-0004; this archival commit is documentation-only
- Candidate branch: `exp/0017-multicut-correction-history`
- Candidate wrapper SHA: `a59124d908ba9339cf21f4a39030bce2d6787fa0`
- Canonical post-patch tree: `a51f52741c6ac81d17a579d8242febd74740ce9a`
- Upstream motivation only: official Stockfish commit `218c74ec4d97807afaab3a4dbda94f43e6e02647`, `Multi cut pruning correction history`

## Focused hypothesis

When the singular-search multi-cut path fails high and is about to return, update correction history from the gap between the searched value and corrected static evaluation before returning.

The candidate changed only that path. Crab's existing multi-cut predicate, TT-move-history update, singular margins, negative extensions, pruning formulas, NNUE, and time management were otherwise left unchanged.

Official Stockfish's later commit was used only as motivation. Its upstream results were never treated as evidence for Crab.

## Correctness and deterministic bench

The dedicated workflow passed:

- focused patch-scope verification
- GCC candidate build
- Clang x86-64-avx2 candidate build
- Crab Chess UCI identity checks
- GCC/Clang deterministic-bench agreement
- two identical repeated Clang candidate benches
- ASan/UBSan smoke
- accepted Crab control build and exact `2050811` bench
- untouched SF18 control at exact immutable SHA and exact `2050811` bench
- NNUE checksum verification
- opening-suite checksum verification
- pinned Cute Chess build/provenance

Candidate deterministic bench: **2,383,815 nodes**.

## Strength protocol

- CPU: AMD EPYC 9V74 80-Core Processor, GitHub-hosted Azure VM with 4 vCPU exposed
- Clang: 18.1.3
- GCC: 13.3.0
- Architecture: x86-64-avx2
- Threads: 1
- Hash: 64 MiB
- Time control: `3+0.03`
- Concurrency: 2
- Games: 512 per opponent
- Openings: sequential, 8 plies, repeated colors
- Adjudication: none
- Cute Chess: v1.3.1, source SHA `1071d84cf272bd7deca0964336bf02e367e2b22b`

## Results

### Candidate vs accepted Crab

- W/D/L: **46 / 421 / 45**
- Score: **50.0977%**
- Elo estimate: **+0.68**
- Draw-aware normal 95% CI: **[-12.03, +13.39]**

### Candidate vs immutable Stockfish 18

- W/D/L: **41 / 421 / 50**
- Score: **49.1211%**
- Elo estimate: **-6.11**
- Draw-aware normal 95% CI: **[-18.81, +6.58]**

These are screening estimates, not SPRT results. The direct accepted-Crab result is essentially flat and the SF18 point estimate is negative. There was no positive signal strong enough to justify another 1,024 matched games, so the candidate was rejected after the first complete screen.

## Audit hashes

- Candidate patch SHA-256: `71df5282c42df5737c35f05378115bc1833f603a4d63d7a1ad6e79ab197997e7`
- Applied engine diff SHA-256: `edad54447cd54efd793ac217a025b9d1915672f09d9a4b4afb5cd88bf9d1fed1`
- Candidate binary SHA-256: `1e064328577a8b72e9eba86da7833b96a0fac9bd8d375773941552e48a8d9f49`
- Accepted Crab binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- Large NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Small NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`
- Opening suite SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Evidence artifact digest: `a26cd098c06f7d410bdba4728ed7a5e5e514a0cb9a1aa737c920b99fbad06f6a`

## Decision

**REJECTED.** PR #44 was closed unmerged. The candidate engine change was not promoted, so accepted Crab engine semantics remain unchanged.
