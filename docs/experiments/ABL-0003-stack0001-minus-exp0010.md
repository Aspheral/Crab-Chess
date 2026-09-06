# ABL-0003: STACK-0001 minus EXP-0010

## Status

**RUNNING / DRAFT.** This ablation removes only EXP-0010 continuation-correction-history prefetch from STACK-0001.

## Rationale

STACK-0001 scored 104/846/74 versus accepted Crab over 1,024 games (~+10.18 Elo). ABL-0001 showed EXP-0017 should remain, and ABL-0002 showed EXP-0012 should remain. EXP-0010 has no standalone strength evidence; its only valid standalone measurement was a small +0.1728% paired-median throughput signal that did not pass its original throughput gate. It is therefore the next weakest-evidence component to ablate.

## Removed component

- EXP-0010 continuation-correction prefetch

## Remaining components

- EXP-0012 optimism arithmetic
- EXP-0015 IIR guard removal
- EXP-0016 negative-extension simplification
- EXP-0017 multi-cut correction history
- EXP-0018 dynamic root-score EMA

## Test plan

Use the same matched-resource harness as prior STACK-0001 ablations: full GCC/Clang correctness and deterministic bench checks, sanitizer smoke, Crab UCI identity, accepted Crab and immutable Stockfish 18 controls, NNUE/opening checksum verification, then 512 games at 3+0.03 versus accepted Crab and 512 versus immutable SF18, Threads=1, Hash=64 MiB, repeated-color sequential openings, concurrency 2, no adjudication.

No promotion or Stockfish 18 parity/superiority claim is authorized from this screen alone.
