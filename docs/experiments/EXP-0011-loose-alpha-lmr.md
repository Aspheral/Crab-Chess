# EXP-0011: Loose-alpha LMR adjustment

## Status

**REJECTED. NOT PROMOTED.**

EXP-0011 tested one focused functional-search hypothesis on accepted Crab baseline `e8cefaae1523776b4e783e2cb04cfa7389a08433`: for quiet moves under non-decisive alpha, adjust late-move reductions using the bounded `alpha - eval` gap.

The change was motivated by post-SF18 Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2` by Adarsh Das (Saphereye). Upstream results are prior evidence only; Crab required independent matched testing.

## Immutable references

- Accepted Crab baseline: `e8cefaae1523776b4e783e2cb04cfa7389a08433`
- Untouched Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`
- Candidate deterministic bench: `2347163` nodes, reproduced identically
- Crab large NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Crab small NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

## Original matched screen

Run `33835572850` used Threads=1, Hash=64 MiB, TC `3+0.03`, fixed sequential 8-ply openings with repeated colors, 512 games per opponent, concurrency 2, and no adjudication.

- Candidate vs accepted Crab: **48 / 412 / 52**, score 49.609375%, Elo **-2.7144**, 95% CI **[-16.0369, +10.6001]**.
- Candidate vs untouched SF18: **49 / 426 / 37**, score 51.171875%, Elo **+8.1445**, 95% CI **[-4.1832, +20.4928]**.

Audit identifiers:

- Tested wrapper SHA: `a3434c26745a54b2f4540f882ed68cb651a037c0`
- Exact patch SHA-256: `1d8afa8b3e8af624d879ff0c49e71e0625cfdacce544c06a9c9e0e32b5612c3e`
- Applied engine diff SHA-256: `b446be6c1757cb33a57dbc6c6ac0a6eb7feb48a1476b1fbfd9ffed4d75ccf053`
- Evidence artifact digest: `sha256:6f7086912ce10fdd16352c16d9f9396109b40ad65bcd57be63a226cb33a60ee0`

## Independent replication

A duplicate harness was discovered after the original rejection had already been finalized. Rather than promote or silently discard it, its completed run is retained as an independent replication of the decision.

Run `33843596812`, branch head `92847439b49624923aa78b511dc130fb5de54a44`:

- Compiler/CPU: Clang 18.1.3, AMD EPYC 9V74, x86-64-avx2
- Threads=1, Hash=64 MiB, TC `3+0.03`, concurrency=2
- Fixed sequential openings, 8 plies, repeated colors
- 512 games per opponent, no adjudication
- Candidate deterministic bench: `2347163`
- Candidate vs accepted Crab: **46 / 413 / 53**, score 49.31640625%, Elo **-4.7504**, 95% CI **[-18.0063, +8.4917]**.
- Candidate vs untouched SF18: **55 / 421 / 36**, score 51.85546875%, Elo **+12.8990**, 95% CI **[+0.2424, +25.5901]**.

Replication audit identifiers:

- Candidate binary SHA-256: `546db943b54b57fe2c0338a93202cb338874b1d8ac2f6f4888c20633c58d022f`
- Accepted binary SHA-256: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- Openings SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- Cute Chess source SHA: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- Evidence artifact digest: `sha256:ab3ce2397310838f7f6a38e99919d6d1914b5c21e9632c9e42fd033744de2987`

## Decision

Both independent candidate-vs-accepted-Crab screens produced negative point estimates. The hypothesis therefore fails Crab's promotion criterion and is rejected.

The SF18 comparison is retained as evidence but does not override the failed direct Crab comparison. In particular, the positive point estimates against SF18 are **not** a claim that Crab or this rejected candidate has reached or surpassed Stockfish 18 strength.

No EXP-0011 engine source is promoted. Accepted engine semantics remain those of EXP-0004.