# Experiment NNNN: <single focused hypothesis>

## Hypothesis

<One mechanism only. State why it may improve strength or speed without changing correctness.>

## Revisions

| Role | SHA |
| --- | --- |
| Candidate | `<candidate-sha>` |
| Accepted Crab baseline | `<crab-baseline-sha>` |
| Immutable Stockfish 18 | `cb3d4ee9b47d0c5aae855b12379378ea1439675c` |

## Environment

| Field | Value |
| --- | --- |
| Compiler | `<name + exact version>` |
| CPU | `<model / architecture>` |
| Build target / flags | `<value>` |
| Threads | `<value>` |
| Hash | `<MiB>` |
| NNUE file(s) | `<names>` |
| NNUE SHA-256 | `<checksums>` |
| Match runner | `<name + version>` |

## Correctness and deterministic checks

- Build: `<PASS/FAIL>`
- UCI handshake: `<PASS/FAIL>`
- Unit/perft: `<details + PASS/FAIL>`
- Sanitizers: `<details + PASS/FAIL/N/A>`
- Candidate bench run 1: `<nodes>`
- Candidate bench run 2: `<nodes>`
- Bench deterministic: `<YES/NO>`
- Immutable SF18 bench: `2050811` expected, `<observed>` observed

## Match settings

- Limit / time control: `<value>`
- Openings: `<suite + version>`
- Opening count: `<value>`
- Colors reversed / paired: `<yes/no>`
- RNG seed: `<value>`
- Adjudication: `<settings>`
- Concurrency: `<value>`

## Candidate vs accepted Crab

- Games: `<n>`
- W/D/L: `<w>/<d>/<l>`
- Score: `<percent>`
- Elo: `<estimate>`
- 95% CI or SPRT: `<result>`

## Candidate vs immutable SF18

- Games: `<n>`
- W/D/L: `<w>/<d>/<l>`
- Score: `<percent>`
- Elo: `<estimate>`
- 95% CI or SPRT: `<result>`

## Decision

`<ACCEPT | REJECT | INCONCLUSIVE>`

Rationale: <tie the decision to predeclared evidence; do not infer parity/superiority from an underpowered match.>

## Evidence

- CI run / artifacts: `<links or IDs>`
- Raw match output: `<path/link>`
- Notes: `<anything required to reproduce the experiment>`
