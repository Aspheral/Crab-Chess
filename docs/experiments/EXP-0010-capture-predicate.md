# EXP-0010: Simplify Position::capture() predicate

## Status

**REJECTED.** Correctness passed, but the first paired throughput screen was negative. No reproduction or strength testing was started, and no EXP-0010 engine source is promoted.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `7b35f4213f2e03edb73cad541ecfa4a380391427`
- Accepted engine semantics: EXP-0004
- Candidate branch: `exp/0010-capture-predicate`
- Engine-change endpoint: `68450e96df017bf5e6d7b86d4ccac43a8643a386`
- First-screen candidate head: `95f0e7e83d28fb86852c911fcf645632e791c100`
- Workflow checkout SHA: `b20dcee107f27cbf314465fae11159e6c3543592`

## Focused hypothesis

`Position::capture()` is an inline predicate used throughout move ordering and search. The accepted implementation calls `m.type_of()` twice and routes destination occupancy through `empty()` / `piece_on()`.

EXP-0010 cached the move type once and read the destination board slot directly while preserving the exact logical treatment of normal captures, en passant, castling, promotions, and quiet moves.

Hypothesis: reducing repeated move-type extraction and shortening the occupancy expression could improve generated code in callers where `capture()` is inlined.

Counter-risk: Clang/GCC may already common-subexpression-eliminate the repeated operations, or the reordered predicate may produce worse branch layout.

## Candidate change

Only `engine/src/position.h` engine semantics changed:

```cpp
inline bool Position::capture(Move m) const {
    assert(m.is_ok());
    const MoveType mt = m.type_of();
    return mt == EN_PASSANT || (mt != CASTLING && board[m.to_sq()] != NO_PIECE);
}
```

The accepted semantics were preserved:

- en passant is always classified as a capture even though the destination square is empty;
- castling is never classified as a capture even though the king destination may initially contain the rook in Chess960;
- ordinary moves are captures exactly when their destination square is occupied.

No move-generation rules, search constants, evaluation constants, TT format, NNUE data, UCI identity, branding, GPLv3 notice, or Stockfish attribution changed.

Patch artifact: `experiments/EXP-0010-capture-predicate.patch`.

Recorded patch SHA-256 from the tested artifact: `5dc2b5b87f1e984639ab1529652c888c3a17272138f523bbb78ae817257a0604`.

Recorded source-diff SHA-256: `7f2b1084c58c7fed2ec1a5c35666d73e2f0605f9bb4685d79fd3c73f4a6791a7`.

## Correctness evidence

Crab CI run `33832519381` completed successfully. Required correctness gates passed:

- native GCC build;
- native Clang build;
- Crab Chess UCI identity and handshake;
- exact deterministic `2050811`-node bench;
- ASan/UBSan build and UCI smoke;
- playable website smoke.

The throughput workflow independently built accepted Crab and EXP-0010, verified exact `2050811`-node benches for both, and verified matching NNUE checksums.

## Throughput evidence

Workflow run: `33832519309`

Job: `100898308996`

Artifact ID: `9922221697`

Artifact digest: `sha256:d1477d5e863dce92ec3429e25678a06abc298e88aece23805a8b14656294911f`

Environment and settings:

- Ubuntu GitHub-hosted runner
- Clang `18.1.3`
- CPU: Intel Xeon Platinum 8573C
- 4 visible logical CPUs under Microsoft hypervisor
- architecture: `x86-64-avx2`
- Threads: `1`
- Hash: `16 MiB`
- alternating pairs: `20`
- warmups: `2`
- every timed sample: exactly `2050811` nodes

NNUE SHA-256:

- large: `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- small: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d`

Binary SHA-256:

- accepted Crab control: `e259e93ea442f63a3c70021112633a11572e8960b1974503b1b820fd1bbb56eb`
- EXP-0010 candidate: `7e67691516a7b4fe89114b6d2ebd71e5ae4a12dddb4a1785ee921772376a72ac`

Results:

- accepted Crab median: `1105862` NPS
- EXP-0010 median: `1101994` NPS
- accepted mean: `1107638.45` NPS
- EXP-0010 mean: `1100762.15` NPS
- accepted range: `1088540` to `1130546` NPS
- EXP-0010 range: `1087386` to `1109746` NPS
- accepted stdev: `11344.42` NPS
- EXP-0010 stdev: `6817.04` NPS
- raw median change: `-0.3498%`
- paired median change: `-0.5860%`

## Strength evidence

**Not started.** The first throughput screen failed, so no matched games were run against accepted Crab or untouched SF18. No W/D/L, Elo confidence interval, or SPRT result exists for EXP-0010.

## Final decision

**REJECT.** Keep the accepted Crab `Position::capture()` implementation unchanged. Do not promote EXP-0010.

This experiment provides no evidence of an Elo gain and no evidence for Stockfish 18 parity or superiority.