# EXP-0029 promotion evidence

## Decision

Promotion candidate. EXP-0029 corrects `go movetime` semantics when Crab runs with `nodestime`: elapsed search work is node-valued in that mode, so the movetime limit must be converted from milliseconds to nodes before the no-clock early return.

This promotion branch starts from accepted Crab `dff78780c450443a3719a49419524ac04c0044c7` and contains only the validated engine diff plus this evidence record. Inherited GPLv3 and Stockfish copyright/upstream attribution notices remain unchanged. Crab/Crab Chess remains the public executable, UCI, build, documentation, website and new-code identity.

## Immutable controls

- Accepted Crab baseline: `dff78780c450443a3719a49419524ac04c0044c7`
- Accepted Crab deterministic bench: `2146293`
- Immutable Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`
- Upstream correctness reference: `ceb059eb48fb8e556df8feff6f8a24e45d03fa11`
- EXP-0029 candidate engine commit: `81bbb1810c64cd7a3d873674b6e0245d0e80e2e2`
- Validated experimental wrapper: `fc87bb1d04120258bd363a922f2d41224be5c134`

## Engine diff

The promoted engine diff is exactly:

```cpp
if (useNodesTime)
    limits.movetime *= npmsec;
```

in `engine/src/timeman.cpp`, immediately after `useNodesTime` is established and before the `limits.time[us] == 0` early return.

## Validation

Crab CI run 151 (`34261384406`) completed successfully on the validated experimental wrapper.

Verified gates:

- Native GCC build: PASS.
- Crab UCI identity and handshake under GCC: PASS.
- Deterministic Crab bench under GCC: PASS, expected `2146293`.
- Native Clang build: PASS.
- Crab UCI identity and handshake under Clang: PASS.
- Deterministic Crab bench under Clang: PASS, expected `2146293`.
- ASan + UBSan build: PASS.
- UCI sanitizer smoke: PASS.
- Website required-asset smoke: PASS.
- Generic strength workflow skipped as intended because this is a correctness/UCI-unit fix, not an Elo hypothesis.

The repository has no dedicated deterministic `nodestime + go movetime` behavioral harness. Applicability is direct: in nodestime mode `elapsed()` is node-valued and `limits.movetime` is consumed by the timeout comparison, so multiplying movetime by `npmsec` restores matching units. This is the same semantic correction introduced upstream after Stockfish 18. No benchmark, match, Elo, or time-forfeit result is inferred beyond the verified CI evidence above.

## Promotion gate

Do not merge until this fresh promotion branch passes full Crab CI again, including native GCC/Clang builds, Crab UCI identity, deterministic/reproducible bench `2146293`, sanitizer/correctness checks, and website smoke. The immutable SF18 control remains `cb3d4ee9b47d0c5aae855b12379378ea1439675c` / `2050811`. No experimental workflow or unrelated engine code is carried into this branch.
