# EXP-0010: Simplify Position::capture() predicate

## Status

**UNDER TEST.** No performance or strength claim is made until the required gates complete.

## Immutable references

- Official Stockfish 18 comparison baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811` nodes
- Accepted Crab baseline: `7b35f4213f2e03edb73cad541ecfa4a380391427`
- Accepted engine semantics: EXP-0004
- Candidate branch: `exp/0010-capture-predicate`
- Engine-change endpoint: `68450e96df017bf5e6d7b86d4ccac43a8643a386`

## Focused hypothesis

`Position::capture()` is an inline predicate used throughout move ordering and search. The accepted implementation calls `m.type_of()` twice and routes destination occupancy through `empty()` / `piece_on()`.

EXP-0010 caches the move type once and reads the destination board slot directly while preserving the exact logical treatment of normal captures, en passant, castling, promotions, and quiet moves.

Hypothesis: reducing repeated move-type extraction and shortening the occupancy expression may improve generated code in callers where `capture()` is inlined.

Counter-risk: Clang/GCC may already common-subexpression-eliminate the repeated operations, or the reordered predicate may produce equal or worse branch layout.

## Candidate change

Only `engine/src/position.h` engine semantics are changed:

```cpp
inline bool Position::capture(Move m) const {
    assert(m.is_ok());
    const MoveType mt = m.type_of();
    return mt == EN_PASSANT || (mt != CASTLING && board[m.to_sq()] != NO_PIECE);
}
```

The accepted semantics are preserved:

- en passant is always classified as a capture even though the destination square is empty;
- castling is never classified as a capture even though the king destination may initially contain the rook in Chess960;
- ordinary moves are captures exactly when their destination square is occupied.

No move-generation rules, search constants, evaluation constants, TT format, NNUE data, UCI identity, branding, GPLv3 notice, or Stockfish attribution is changed.

Patch artifact: `experiments/EXP-0010-capture-predicate.patch`.

Patch SHA-256: `edbba2c13d07ef14fba549e6d01d928683b125b3f4bda4412ded82b8a0e4476a`.

## Required gates

1. Native GCC build.
2. Native Clang build.
3. Address/undefined sanitizer smoke.
4. UCI identity remains Crab Chess.
5. Playable website smoke remains functional.
6. Candidate deterministic bench is exactly `2050811` nodes.
7. Accepted Crab control deterministic bench is exactly `2050811` nodes.
8. Large and small NNUE SHA-256 checksums match between control and candidate.
9. Paired Clang AVX2 throughput screen: Threads=1, Hash=16 MiB, 20 alternating pairs, 2 warmups, exact `2050811` nodes per timed sample.
10. A positive throughput screen must reproduce on a fresh runner before any matched-resource strength testing begins.

## Strength testing policy

Strength testing is **not started** until a positive performance result reproduces independently. If EXP-0010 reaches that gate, it must be tested with matched resources against both accepted Crab and untouched SF18, with W/D/L, Elo estimate/confidence interval or SPRT result, CPU/compiler, Threads/Hash, time control, opening checksum, NNUE checksums, and binary hashes recorded.

## Current decision

Pending correctness and throughput evidence. No Elo gain, SF18 parity, or SF18 superiority claim exists for EXP-0010.
