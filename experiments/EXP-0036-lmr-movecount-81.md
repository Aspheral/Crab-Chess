# EXP-0036: increase LMR move-count penalty from 73 to 81

## Status
Candidate staging only. No strength, parity, or promotion result is claimed.

## Baseline
- Accepted Crab `main`: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Immutable Stockfish 18: `sf_18` / `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`

## Hypothesis
EXP-0035 tested less aggressive late-move reduction pressure (`73 -> 65`) and screened flat/slightly negative directly against accepted Crab. EXP-0036 tests the opposite, equally sized local perturbation: `r -= moveCount * 73` to `r -= moveCount * 81`. The hypothesis is that slightly stronger reduction pressure on later moves may improve search efficiency/selection in Crab's current tuned search without broad structural changes.

This is not a continuation of EXP-0035 code and does not stack EXP-0035. It is a new isolated parameter candidate from accepted `main`.

## Applicability
The exact target expression `r -= moveCount * 73` is present once in accepted `engine/src/search.cpp` in the post-`do_move()` reduction assembly. The candidate changes only that coefficient. GPLv3 and inherited Stockfish copyright/upstream attribution notices are untouched.

## Required gates
1. Apply only `experiments/EXP-0036-lmr-movecount-81.patch` to a fresh candidate tree from accepted `main`.
2. Verify clean build, Crab Chess UCI identity, deterministic/reproducible bench, and ASan/UBSan smoke.
3. Record NNUE/opening checksums, compiler/CPU, patch/diff/tree/binary identities, and immutable SF18 validation at commit `cb3d4ee9b47d0c5aae855b12379378ea1439675c` with bench `2050811`.
4. Run matched 512-game triage against accepted Crab and immutable SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency 2, sequential paired 8-ply openings, repeated colors, no adjudication.
5. Classify from direct accepted-Crab evidence first. Positive but unresolved direct evidence should be replicated; flat/no-complement signal stays out of the stack; clear negative is rejected. SF18 remains mandatory context and is not parity/superiority proof.
