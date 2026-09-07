# EXP-0023 — Simplify razoring margin

Status: **DRAFT / SCREEN PENDING**

## Baselines

- Accepted Crab: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Accepted Crab deterministic bench: `2673975`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`

## Hypothesis

Accepted Crab currently razors non-PV positions when:

```cpp
if (!PvNode && eval < alpha - 485 - 281 * depth * depth)
```

EXP-0023 tests the single-line form:

```cpp
if (!PvNode && eval < alpha - 482 * depth * depth)
```

The hypothesis is that removing the independent razoring offset and using a single quadratic margin may improve the depth profile of razoring while simplifying the hot search condition. This is adapted from official post-SF18 Stockfish commit `6d215a03063d79782333970a67abcb6aea32912c` ("Simplify Away Second Razoring Number"). Upstream evidence is prior context only, not Crab strength evidence: the upstream patch passed 169,600-game STC non-regression and 28,332-game LTC non-regression.

## Applicability / duplicate checks

- Current accepted Crab still has the two-term `485 + 281 * depth * depth` razoring margin.
- No Crab pull request matching `razoring` or upstream commit `6d215a03063d79782333970a67abcb6aea32912c` was found before opening this experiment.
- Two other post-SF18 candidates were checked first and skipped without games because accepted Crab already contains them: continuation-correction-history prefetching (`4150d22b...`) and multi-cut correction-history updating (`218c74ec...`).
- Candidate engine scope is exactly `engine/src/search.cpp`; GPLv3 and inherited Stockfish notices are untouched, and Crab Chess remains the executable/UCI/public identity.

## Required screen

The EXP-0023 workflow must verify patch scope/application, GCC and Clang builds, Crab UCI identity, deterministic/reproducible candidate bench, sanitizer smoke, exact accepted-Crab bench, immutable SF18 official bench, NNUE/opening checksums, pinned Cute Chess, and matched 512-game legs against both accepted Crab and immutable SF18.

512 games are triage only. Classification will follow the bank-stack-ablate policy: reject clear negatives; archive inapplicable candidates without games; bank tiny/unresolved positive or non-harmful candidates only when plausible complementary value remains; do not interpret a confidence interval crossing zero as proof of no effect.

## Evidence

Pending workflow evidence. Do not merge while this section is pending.
