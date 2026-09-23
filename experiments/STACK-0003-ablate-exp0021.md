# STACK-0003 ablation — remove EXP-0021

Status: RUNNING / COMPONENT ABLATION / NOT PROMOTED

Accepted Crab baseline: `215afc5e736236bdb6c269a1310882780d56dfa4` (bench `2146293`).
Immutable historical upstream comparison remains Stockfish 18 `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official bench `2050811`.

## Question

Does EXP-0021 materially contribute to the replicated STACK-0003 combination, or is the stack as strong or stronger when EXP-0021 is removed?

This is a direct component ablation. It compares the exact full STACK-0003 engine against an otherwise identical engine containing EXP-0039 but not EXP-0021. It does not add standalone Elo estimates.

## Prior stack evidence

Initial STACK-0003 vs accepted Crab: 55 W / 410 D / 47 L.
Exact replication vs accepted Crab: 51 W / 424 D / 37 L.
Combined descriptive W/D/L: 106 / 834 / 84 over 1,024 games. Both independent direct-Crab screens had positive point estimates.

The SF18 context screens are preserved in STACK-0003. No SF18 parity or superiority claim is made.

## Ablation protocol

Build both sides from the same accepted Crab SHA. Apply `STACK-0003-full.patch` to one side and `STACK-0003-minus-exp0021.patch` to the other. Require Crab UCI identity, deterministic repeated bench behavior, sanitizer smoke, patch/diff/tree/binary checksums, NNUE/opening checksums, and a matched 512-game screen at Threads=1, Hash=64 MiB, TC 3+0.03, concurrency=2, sequential 8-ply openings, repeated colors, no adjudication.

Interpretation: a positive FullStack result supports EXP-0021 contribution in combination. A negative result supports removing EXP-0021. A small unresolved result is replicated before a component decision.

GPLv3 and inherited Stockfish copyright/upstream attribution remain preserved. Crab Chess remains the public engine identity.
