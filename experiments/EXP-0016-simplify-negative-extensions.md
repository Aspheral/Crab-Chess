# EXP-0016: Simplify negative extensions

## Status

**RUNNING.** This candidate is not accepted and must not be described as stronger than accepted Crab or Stockfish 18 unless the matched-resource evidence clears the project gate.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline at experiment start: `3de373eff3e5f59285ae66ced5b5c4e824da019b`
- Accepted Crab engine semantics: EXP-0004; later `main` commits through EXP-0015 are audit/documentation-only unless separately recorded as accepted engine changes
- Candidate branch: `exp/0016-simplify-negative-extensions`
- Upstream motivation only: official Stockfish commit `c5aef2bf1f77d94a3dd476f276af68fd71a0ac07`, `Simplify Negative Extensions`

## Focused hypothesis

Crab's SF18-derived singular-extension path currently uses two negative-extension levels after the excluded-move search: `-3` when the TT value is already at or above beta, and `-2` for the remaining cut-node case. EXP-0016 changes only that distinction, using `-3` whenever `ttData.value >= beta || cutNode` and removing the separate `-2` cut-node branch.

The intent is to test whether the stronger unified reduction improves search efficiency/strength in Crab without introducing correctness failures. This is a functional search change, so the candidate deterministic bench is allowed to differ from `2050811`, but it must reproduce exactly across repeated GCC/Clang runs in the experiment environment.

Official Stockfish later adopted the same local simplification in commit `c5aef2b`, where it passed STC, LTC, and VVLTC non-regression tests. Those upstream results are motivation only; they do not count as Crab strength evidence because Crab is evaluated from a different accepted lineage and with Crab's own controlled binaries.

## Required gates

The dedicated workflow must record and verify:

- candidate wrapper SHA, focused patch SHA-256, applied engine-diff SHA-256, and canonical post-patch Git tree;
- GCC and Clang `x86-64-avx2` builds;
- public UCI identity `Crab Chess` and Crab contributor author line;
- ASan/UBSan smoke;
- repeated deterministic candidate bench, identical across GCC and Clang;
- accepted Crab control at exactly `2050811` nodes;
- immutable SF18 checkout at exactly `cb3d4ee9b47d0c5aae855b12379378ea1439675c` and exactly `2050811` nodes;
- compiler/CPU/host provenance, candidate/control binary SHA-256 values, NNUE checksums, opening checksum, and Cute Chess source SHA;
- 512 matched games candidate vs accepted Crab and 512 matched games candidate vs immutable SF18;
- Threads `1`, Hash `64 MiB`, time control `3+0.03`, concurrency `2`, fixed sequential 8-ply openings with repeated colors, and no adjudication;
- W/D/L plus Elo/confidence summary from the preserved PGNs.

## Decision rule

Do not promote on deterministic bench/NPS alone or on an attractive point estimate whose confidence interval remains unresolved. Reject or leave unmerged unless the direct accepted-Crab evidence is statistically meaningful under the project's gate. The SF18 leg is a frozen external reference and must never be turned into a parity/superiority claim without statistically meaningful matched-resource testing.
