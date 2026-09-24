# EXP-0040: null-move eval-surplus reduction

Status: **DRAFT / SCREEN PENDING**

## Hypothesis

When a null-move node's static evaluation is substantially above beta, the null-move search can be reduced a little more aggressively. This isolates one Stockfish 19 search concept without rebasing Crab or importing unrelated SF19 search changes.

Candidate change:

```cpp
Depth R = 7 + depth / 3 + std::max((ss->staticEval - beta) / 256, 0);
```

Accepted Crab currently uses only `7 + depth / 3`.

## Applicability

Checked against accepted Crab `215afc5e736236bdb6c269a1310882780d56dfa4`: the null-move block is present and does not already include an eval-surplus term.

Reference donor: official Stockfish 19 `src/search.cpp`. This is a small isolated transplant candidate, not an SF19 rebase and not a claim that Crab uses the SF19 architecture.

## Controls

- Accepted Crab: `215afc5e736236bdb6c269a1310882780d56dfa4`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official SF18 deterministic bench: `2050811`
- Threads: 1
- Hash: 64 MiB
- TC: 3+0.03
- Concurrency: 2
- Openings: `tools/strength/openings.pgn`, sequential, 8 plies, repeated colors
- Adjudication: none
- Initial screen: 512 games vs accepted Crab and 512 vs immutable SF18

## Classification policy

This 512-game run is triage only. Clear negative => reject/archive. Positive or non-harmful unresolved signal => replicate or mark STACK-ELIGIBLE as evidence warrants. No promotion from this screen alone.
