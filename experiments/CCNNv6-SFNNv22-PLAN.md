# CCNNv6 / experimental SFNNv22 research program

Status: RESEARCH / BASELINE-FIRST / NO PROMOTION

CCNNv6 is Crab Chess's experimental NNUE research line. "SFNNv22" is an internal architecture target name only and MUST NOT be presented as an official Stockfish architecture or release.

## Immutable references

- Accepted Crab baseline: `215afc5e736236bdb6c269a1310882780d56dfa4`, deterministic bench `2146293`.
- Historical upstream control: official Stockfish 18 `sf_18` at `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench `2050811`.
- Research donor/reference: official Stockfish 19 `sf_19`. SF19 introduces SFNNv16, pawn-pair features, removes redundant threat features and the secondary small network, and uses QAT in its training pipeline.

## Isolation rule

STACK-0003 remains the active playing-strength experiment. CCNNv6 work on this branch is architecture/training research only until that chain reaches an evidence-based conclusion. No CCNNv6 engine delta may enter accepted main implicitly.

## Baseline ladder

### CCNNv6-A0: inference/training harness
Reproduce current Crab NNUE behavior bit-for-bit where practical. Establish dataset manifests, deterministic feature extraction, network checksums, quantized inference checks, and eval/search regression suites before changing features.

### CCNNv6-A1: SFNNv16 compatibility study
Port/reproduce the SF19 SFNNv16 feature semantics in an isolated experimental implementation, preserving attribution and GPLv3 requirements. This is a donor-compatibility baseline, not a strength claim.

### Feature micro-candidates
Test independently before stacking:
- P: pawn-pair interaction features.
- T: threat-input compression/removal of redundant threat channels.
- K: king-zone attacker/defender interaction features.
- I: sparse piece-pair interactions selected for tactical relevance.
- C: constrained/pinned/trapped-piece signals where incrementally maintainable.
- R: passed-pawn/blocker/king-distance relations.

### Training micro-candidates
- Q: quantization-aware training from the start of the relevant stage.
- D: Crab disagreement mining against deeper search/strong teacher labels.
- H: hard-position replay with tactical, fortress, quiet and endgame strata.
- S: search-aware reweighting using positions where static eval causes large search correction.

## Bank-stack-ablate for networks

Each architecture or training candidate gets a frozen network artifact, recipe/config, data manifest/checksums, seed(s), trainer commit, feature/inference commit, quantization parameters, validation losses, inference throughput, binary/network size, deterministic eval corpus output, and matched-resource engine games when ready.

Do not add Elo estimates arithmetically. Compatible positive/non-harmful candidates may become CCNN stack-eligible. Combined networks are retrained as combinations, then replicated and ablated.

## Gates before strength games

1. Clean native build and Crab UCI identity.
2. Deterministic repeated bench/eval behavior.
3. ASan/UBSan smoke.
4. Feature-index bounds and accumulator refresh/incremental equivalence tests.
5. Quantized inference equivalence/tolerance suite.
6. Network checksum and exact architecture metadata.
7. Fixed evaluation corpus with per-position output digest.
8. NPS/inference-throughput measurement against accepted Crab.
9. Only then matched-resource games against accepted Crab, with SF18 and SF19 as contextual controls where appropriate.

## First implementation target

Start with A0, not speculative new features. The first code-bearing CCNNv6 change should add a reproducible NNUE regression/architecture manifest harness while leaving playing behavior unchanged. Once A0 proves deterministic, build A1 and then test P/T/K/I/C/R one at a time.

## Licensing and identity

Preserve GPLv3, inherited Stockfish copyright, modification notices, and upstream attribution. Crab/Crab Chess remains the executable/UCI/build/documentation identity. New Crab-owned architecture names use CCNN. Any imported or adapted SF19 code must retain legally required attribution.
