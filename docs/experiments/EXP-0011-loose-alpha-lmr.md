# EXP-0011: Reduce LMR less aggressively in loose alpha windows

## Status

**UNDER TEST.** This is a functional search experiment. No Elo gain, Stockfish 18 parity, or Stockfish 18 superiority claim is made until Crab's own matched-resource evidence is complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab lineage at experiment start: `e8cefaae1523776b4e783e2cb04cfa7389a08433`
- Accepted Crab engine semantics: EXP-0004 threat-weight L2 prefetch
- Candidate branch: `exp/0011-loose-alpha-lmr`
- Candidate patch: `experiments/EXP-0011-loose-alpha-lmr.patch`
- Candidate patch SHA-256: `1d8afa8b3e8af624d879ff0c49e71e0625cfdacce544c06a9c9e0e32b5612c3e`

## Focused hypothesis

In the late-move-reduction path, quiet moves searched under a loose alpha window can be over-reduced when the current static evaluation is materially below alpha. EXP-0011 adds a small bounded adjustment after history-based LMR scaling:

`r += 3 * std::clamp(alpha - eval, -64, 96)`

for non-captures while alpha is non-decisive.

Hypothesis: reducing LMR less aggressively when alpha is high relative to static evaluation lets promising quiet moves receive enough depth to improve playing strength, while the clamp limits the search-cost increase and allows the opposite adjustment when alpha is below eval.

This is a functional search change. A changed deterministic bench node count is therefore expected and is not itself a failure; the candidate bench must instead be deterministic across repeated identical runs.

## Upstream research provenance

The hypothesis is adapted from post-SF18 Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2`, authored by Adarsh Das and merged August 19, 2026, titled `Reduce LMR less aggressively in loose alpha windows`.

Upstream reported:

- STC: 90,784 games, W/D/L 23,707 / 43,758 / 23,319, LLR `2.95 (-2.94,2.94) <0.00,2.00>`
- LTC: 209,640 games, W/D/L 54,841 / 100,620 / 54,179, LLR `2.94 (-2.94,2.94) <0.50,2.50>`
- upstream post-change bench: `2132401`

Those upstream results motivate the Crab hypothesis only. Crab is SF18-derived with its own accepted changes and must independently validate the effect.

## Candidate change

The patch changes only `engine/src/search.cpp` after application and inserts the bounded alpha-eval LMR adjustment immediately after the existing history-based reduction adjustment.

No TT format, NNUE network data, UCI identity, executable branding, website branding, GPLv3 notice, Stockfish copyright, or upstream attribution notice is changed.

## Required correctness gates

1. Patch applies cleanly to accepted Crab `e8cefaae1523776b4e783e2cb04cfa7389a08433`.
2. Patch application changes only `engine/src/search.cpp`.
3. Native GCC candidate build and UCI handshake.
4. Native Clang AVX2 candidate build and UCI handshake.
5. Candidate ASan/UBSan smoke.
6. UCI identity remains Crab Chess.
7. Accepted Crab deterministic bench remains exactly `2050811` nodes.
8. Candidate deterministic bench is run twice from clean identical state and produces the same node count both times; that candidate node count is recorded.
9. Large and small NNUE SHA-256 checksums match across candidate, accepted Crab, and untouched SF18.
10. Playable website smoke remains functional through normal Crab CI.

## Strength-test plan

After correctness passes, run matched-resource games using Cute Chess v1.3.1 and the repository opening suite against both:

- latest accepted Crab `e8cefaae1523776b4e783e2cb04cfa7389a08433`; and
- untouched official SF18 `cb3d4ee9b47d0c5aae855b12379378ea1439675c`.

Initial screen settings:

- architecture: `x86-64-avx2`
- compiler: Clang, recorded from runner
- Threads: 1
- Hash: 64 MiB
- time control: `3+0.03`
- concurrency: 2
- 512 games per opponent
- sequential opening suite, 8 plies, repeated colors
- no adjudication

Record CPU/compiler, branch/workflow SHA, patch/diff/binary SHA-256, NNUE checksums, opening checksum, deterministic benches, W/D/L, score, Elo estimate and confidence interval from the repository match summarizer.

A 512-game screen is evidence for candidate triage, not sufficient by itself for any broad Stockfish parity/superiority claim. Any acceptance must be supported by the matched results and, when uncertainty is material, further testing.

## Current decision

Pending correctness and matched-resource strength evidence. Accepted Crab engine semantics remain EXP-0004.
