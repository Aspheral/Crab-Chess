# EXP-0012: Simplify optimism scaling arithmetic

## Status

**UNDER TEST.** No strength or performance gain is claimed until Crab-specific matched testing finishes.

## Immutable references

- Accepted Crab baseline at experiment start: `8b76be93c34840fb6f2f6042b03f5d686a15b4cd`
- Accepted engine semantics: EXP-0004 threat-weight L2 prefetch
- Untouched Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`
- Candidate branch: `exp/0012-simplify-optimism-scaling`

## Focused hypothesis

Crab inherits SF18's evaluation blend in the form:

```cpp
(nnue * (77871 + material) + optimism * (7191 + material)) / 77871
```

EXP-0012 rewrites only the arithmetic shape to:

```cpp
nnue + (nnue * material + optimism * (7191 + material)) / 77871
```

Hypothesis: removing the large `nnue * 77871` contribution from the numerator can produce simpler generated arithmetic in this hot evaluation path and may improve effective search speed without changing the intended evaluation model.

Because C++ integer division truncates toward zero, the rewrite is not assumed bit-identical for every possible signed intermediate. It is therefore treated as a **functional evaluation experiment**, not as a no-functional-change micro-optimization. The candidate bench is expected to be deterministic but is not required to retain `2050811` nodes.

## Upstream research provenance and attribution

The hypothesis is adapted from post-SF18 Stockfish commit `2edd935bbb3ea6e484a1700f582a95e0ee773ec2`, authored by Fauzi Akram and merged August 25, 2026, titled `Simplify optimism scaling formula`.

That later Stockfish commit changed the same arithmetic shape in a newer evaluation state and reported successful STC/LTC non-regression tests. Crab does **not** import the later constants or count those upstream games as Crab evidence. Only the algebraic simplification idea is adapted to Crab's SF18-derived constants.

The existing Stockfish GPLv3 header and copyright notice in `engine/src/evaluate.cpp` remain intact. This experiment record provides explicit provenance for the adapted post-SF18 idea; Crab Chess remains the public engine identity.

## Candidate change

The functional engine delta is restricted to one expression in `engine/src/evaluate.cpp`. No NNUE files, search constants, move ordering, TT format, UCI identity, executable naming, build target branding, website branding, GPLv3 license text, or existing Stockfish attribution notices are modified.

## Correctness policy

Before games, the workflow must:

1. verify the only changed engine file versus accepted Crab is `engine/src/evaluate.cpp`;
2. build the candidate with GCC and Clang;
3. verify UCI identity remains `Crab Chess` / `Crab Chess contributors`;
4. run the candidate deterministic bench twice and require identical node counts;
5. run an ASan/UBSan UCI/search smoke;
6. verify accepted Crab still benches exactly `2050811`;
7. build untouched SF18 at the immutable SHA and require exact `2050811`;
8. verify candidate and accepted Crab use identical NNUE checksums.

The normal Crab PR CI remains responsible for the playable website smoke and standard native checks.

## Strength screen

If correctness gates pass, run matched-resource tests against both required controls:

- Candidate vs accepted Crab: 512 games
- Candidate vs untouched SF18: 512 games

Settings:

- Clang `x86-64-avx2`
- Threads=1
- Hash=64 MiB
- time control `3+0.03`
- concurrency=2
- fixed sequential opening suite, 8 plies
- colors repeated
- no adjudication
- Cute Chess v1.3.1 pinned by source SHA

Record candidate SHA, accepted baseline SHA, immutable SF18 SHA, compiler/CPU, binary hashes, NNUE hashes, opening checksum, runner SHA, deterministic benches, W/D/L, score, Elo estimate, and 95% confidence interval.

A 512-game screen is an experiment gate, not evidence for a broad Stockfish 18 parity or superiority claim. Any candidate considered for promotion must first demonstrate a positive result against the latest accepted Crab baseline; stronger claims require larger statistically meaningful confirmation under matched resources.

## Decision rule

- **REJECT** if the direct accepted-Crab screen has a negative point estimate or correctness fails.
- **INCONCLUSIVE** if the direct screen is non-negative but too uncertain to justify promotion.
- **ACCEPT only after confirmation** if the initial screen is favorable enough to justify a larger independent confirmation or SPRT and that confirmation supports the change.

No EXP-0012 source is promoted merely because the upstream Stockfish version passed its own tests.
