# EXP-0035: reduce LMR move-count penalty from 73 to 65

## Status
Candidate staging only. No engine source, benchmark, strength, parity, or promotion result is claimed yet.

## Baseline
- Accepted Crab `main`: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Immutable Stockfish 18: `sf_18` / `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`

## Hypothesis
Reduce the late-move reduction move-count penalty from `r -= moveCount * 73` to `r -= moveCount * 65`, making reductions slightly less aggressive for later moves. This is a single focused search change; no other Stockfish 19 changes are imported.

## Applicability
The target expression is present in the accepted Crab `engine/src/search.cpp` post-`do_move()` reduction assembly. No duplicate target was found in the accepted tree.

## Planned gates
1. Apply the patch on a fresh candidate tree from accepted `main`.
2. Verify patch scope is exactly `engine/src/search.cpp` and preserve GPLv3, Stockfish copyright, modification, and upstream attribution notices.
3. GCC/Clang clean builds, Crab UCI identity, deterministic bench repeatability, ASan/UBSan smoke, network/opening checksum validation, and immutable SF18 plus accepted-Crab controls.
4. Matched 512-game triage against accepted Crab and immutable SF18 at Threads=1, Hash=64 MiB, sequential paired 8-ply openings, repeated colors, no adjudication.
5. If positive but unresolved, replicate exactly before any stack inclusion. Never claim Stockfish 18 parity or superiority from a small screen.

## Current result
No candidate engine has been built and no match has been run in this staging step.
