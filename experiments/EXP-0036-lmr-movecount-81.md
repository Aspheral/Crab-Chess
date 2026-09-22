# EXP-0036: increase LMR move-count penalty from 73 to 81

## Status
**FLAT / NOT STACK-ELIGIBLE.** Archived after the complete matched 512-game triage. No engine code is promoted to accepted `main`.

## Baseline and immutable control
- Accepted Crab `main`: `215afc5e736236bdb6c269a1310882780d56dfa4`
- PR wrapper/head SHA used to launch the validated workflow: `31e14c671d3d310a8b95f1040060c8a494c9f8db`
- Workflow candidate-tree identity recorded by the evidence bundle: `99c051a6b278c90e57f0566e0947854c6ae8f5cf`
- Immutable Stockfish 18: `sf_18` / `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`

## Hypothesis
EXP-0035 tested less aggressive late-move reduction pressure (`73 -> 65`) and screened flat/slightly negative directly against accepted Crab. EXP-0036 tested the opposite, equally sized local perturbation: `r -= moveCount * 73` to `r -= moveCount * 81`, asking whether slightly stronger reduction pressure on later moves improves search efficiency/selection in Crab's current tuned search.

This candidate did not stack EXP-0035. It was isolated from accepted `main`.

## Applicability and candidate identity
The exact target expression `r -= moveCount * 73` was present once in accepted `engine/src/search.cpp`. The candidate changed only that coefficient. GPLv3 and inherited Stockfish copyright/upstream attribution notices were untouched.

Evidence bundle identities:
- candidate patch SHA-256: `80a88f4792d8942cb59c8e2b7641625641c8278c2c2dae2737c7e22fb643e4e5`
- applied engine-diff SHA-256: `918ccba803341f4a18b2f1768836327e591143d8a3fa65257545701b41de3a90`
- accepted Crab binary SHA-256: `dfb28585806efa385d044611b129b7d8a2bbb40b1b956dfb317033be73efb0b9`
- candidate binary SHA-256: `0fb98025da67a53054445dcd56658ce7c97c73cf84b7b1a141aeaecb9f09fb57`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`

## Validation
Workflow run: `35708720895` (`EXP-0036 Strength Screen`), completed successfully.

- accepted Crab deterministic bench: `2146293`
- candidate deterministic bench: `2028667`
- immutable SF18 deterministic bench: `2050811` (exact official value)
- UCI identity: `Crab Chess 0.1.0` / `Crab Chess contributors`
- sanitizer smoke: passed
- compiler: Ubuntu Clang 18.1.3; sanitizer gate used the repository's validated GCC ASan/UBSan recipe
- host: GitHub-hosted Linux x86-64, AMD EPYC 7763, 4 logical CPUs exposed
- NNUE SHA-256: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7` and `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`; Crab and SF18 copies matched
- opening book SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- match resources: Threads=1, Hash=64 MiB, `3+0.03`, concurrency 2, sequential paired 8-ply openings with repeated colors, no adjudication
- evidence artifact: `exp0036-strength-evidence`, artifact id `10689495371`, artifact digest `sha256:7ecb8f46a515b297c49b745a9618ba97a29332ee7ea651e536c1871e4b3e8a53`

## Strength screen
### Candidate vs accepted Crab
512 games: **54 wins / 403 draws / 55 losses**. Score `49.9023%`. Screening Elo estimate **-0.68**, draw-aware normal 95% CI **[-14.59, +13.23]**. This is screening evidence, not SPRT.

### Candidate vs immutable SF18
512 games: **58 wins / 401 draws / 53 losses**. Score `50.4883%`. Screening Elo estimate **+3.39**, draw-aware normal 95% CI **[-10.63, +17.43]**. This is context only and is not evidence of Stockfish 18 parity or superiority.

## Classification
The direct accepted-Crab result is essentially centered on zero, with 54 wins and 55 losses and no persistent positive point signal. The SF18 context is also unresolved. Together with EXP-0035's flat/slightly negative result in the opposite local direction, there is no evidence-based complementary reason to bank this isolated coefficient perturbation.

**Final classification: FLAT / NOT STACK-ELIGIBLE.** Preserve the patch, workflow, PGNs, JSON summaries, checksums, and this record; close the draft PR unmerged. Accepted Crab `main` remains the last promoted engine.