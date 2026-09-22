# EXP-0035: reduce LMR move-count penalty from 73 to 65

## Status
**ARCHIVED — FLAT / NOT STACK-ELIGIBLE.** The isolated candidate completed the required correctness gates and matched 512-game triage. Its direct result against the latest accepted Crab baseline was essentially flat with a slightly negative point estimate. The positive but unresolved SF18 context result does not override the direct accepted-Crab control. No promotion, replication, stack inclusion, Stockfish 18 parity, or superiority claim is made.

## Baselines and identities
- Accepted Crab `main`: `215afc5e736236bdb6c269a1310882780d56dfa4`
- EXP-0035 PR head used to trigger the completed run: `bab2da5b9fe1e138031ed2b56ac79a26f71ef85a`
- GitHub Actions PR checkout/wrapper SHA recorded by the artifact: `7c851a4910c16641505bdcced42a710dad3e8be6`
- Immutable Stockfish 18: `sf_18` / `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Completed workflow run: `35698164468`
- Evidence artifact: `exp0035-strength-evidence`

## Hypothesis
Reduce the late-move reduction move-count penalty from `r -= moveCount * 73` to `r -= moveCount * 65`, making reductions slightly less aggressive for later moves. This is a single focused search change; no other Stockfish 19 changes are imported.

## Applicability and scope
The target expression was present in accepted Crab `engine/src/search.cpp` post-`do_move()` reduction assembly. No duplicate target was found. The applied engine diff changes only that coefficient in `engine/src/search.cpp`; GPLv3 and upstream Stockfish notices remain intact.

## Reproducibility / provenance
- Patch SHA-256: `efcb009c1e54a9ca7d06d9370470b409dcad22348aebe629f457d70a8dfd69ac`
- Applied engine-diff SHA-256: `067889572ee868fb7c623145ab7ab44029f14ae59500b8740db483f004c2e2b2`
- Accepted Crab binary SHA-256: `dfb28585806efa385d044611b129b7d8a2bbb40b1b956dfb317033be73efb0b9`
- Candidate binary SHA-256: `9d403357a77aa74a3010828bc8dac007996d89a8685602b2bf979b08705351c8`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- Opening book SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`; identical files/checksums were recorded for Crab and immutable SF18.
- Compiler: Ubuntu clang 18.1.3 for matched release binaries; established Crab GCC ASan/UBSan debug recipe for sanitizer smoke.
- Runner CPU: AMD EPYC 7763, 4 logical CPUs exposed (2 cores / 2 threads per core).
- Match runner: cutechess-cli v1.3.1 source checkout, runner commit `a740b75b1d601f2372d97f7a2a91bc476716ef4e`.

## Correctness gates
- Accepted Crab clean build: PASS.
- Candidate patch application and clean build: PASS.
- Crab UCI identity (`id name Crab Chess`): PASS.
- Sanitizer smoke (ASan + UBSan): PASS.
- Immutable SF18 checkout/build: PASS.
- Network/opening checksum recording: PASS.
- Deterministic benches: accepted Crab `2146293`; candidate `2152611`; immutable SF18 `2050811` (official value matched).

## Match configuration
Both screens used the same resources and policy: 512 games, `Threads=1`, `Hash=64` MiB, `tc=3+0.03`, concurrency 2, sequential `tools/strength/openings.pgn`, 8-ply opening positions, paired games with repeated colors, and no adjudication options.

## Results
### Candidate vs accepted Crab
- W/D/L: **43 / 424 / 45**
- Score: **49.80%** (255.0 / 512)
- Elo estimate: **-1.36**
- Approx. 95% CI: **[-23.64, +20.92]**
- Classification signal: flat/slightly negative and unresolved.

### Candidate vs immutable SF18
- W/D/L: **55 / 418 / 39**
- Score: **51.56%** (264.0 / 512)
- Elo estimate: **+10.86**
- Approx. 95% CI: **[-10.75, +32.47]**
- Classification signal: positive point estimate but unresolved; context only, not evidence of SF18 parity or superiority.

## Final classification
**FLAT / NOT STACK-ELIGIBLE.** Under the bank-stack-ablate policy, direct evidence versus accepted Crab is the promotion/stack gate. EXP-0035 produced no positive direct signal in its 512-game triage, and this isolated coefficient change has no demonstrated complementary interaction that justifies consuming replication/stack budget. The experiment is therefore archived with its standalone evidence rather than merged or erased. The positive SF18 screen is retained as context only.

No engine source from EXP-0035 is merged into accepted `main`. Accepted Crab remains `215afc5e736236bdb6c269a1310882780d56dfa4`.