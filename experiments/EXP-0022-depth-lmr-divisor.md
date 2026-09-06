# EXP-0022 — Depth-shaped LMR history divisor

## Status

DRAFT / running. Do not merge into accepted Crab without matched-resource evidence.

## Accepted baseline

- Accepted Crab: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Accepted Crab deterministic bench: `2673975`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`

## Hypothesis

Crab currently scales quiet-move LMR history with one constant divisor, `3208`, at every depth. Test whether a depth-shaped divisor can improve how history influences reductions without changing Crab's overall average divisor scale.

The candidate uses a 16-entry depth table derived from official post-SF18 Stockfish commit `95f3680080799d1a9e1b39ceec78a1eff789c6c2` ("Replace constant LMR history divisor with depth-based array"). Upstream passed STC and LTC strength tests plus a VLTC non-regression test. Those results are prior evidence only.

To isolate the *depth-shaping* hypothesis from a global LMR scaling shift, the upstream table is normalized so its arithmetic mean is Crab's current `3208` divisor (candidate mean `3208.0625`). This intentionally does not blindly copy upstream's lower absolute scale.

Candidate table:

`{3452, 3059, 3000, 2942, 3356, 3367, 3366, 2904, 2984, 3047, 3224, 3419, 3320, 2994, 3138, 3757}`

Only `engine/src/search.cpp` may change when the patch is applied. GPLv3 and inherited Stockfish notices must remain intact. Crab Chess remains the executable/UCI/public identity.

## Applicability

Accepted Crab still contains the exact constant quiet-history LMR term `lmrDepth += history / 3208;` and has no existing depth-indexed LMR-history divisor. The hypothesis is therefore applicable and not a duplicate of EXP-0021.

## Required gates

1. Patch applies cleanly to accepted Crab and changes only `engine/src/search.cpp`.
2. GCC and Clang AVX2 builds succeed and identify as Crab Chess.
3. Candidate deterministic bench is reproducible across GCC/Clang and repeated Clang runs.
4. ASan/UBSan smoke passes.
5. Accepted Crab control reproduces `2673975` nodes.
6. Immutable SF18 reproduces `2050811` nodes.
7. NNUE and opening checksums are recorded and matched as appropriate.
8. Compiler, CPU, Threads/Hash, TC, concurrency, opening policy, binary hashes, patch hash, engine-diff hash, and post-patch tree are recorded.
9. If correctness passes, run 512 matched games vs accepted Crab and 512 vs immutable SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, sequential fixed 8-ply repeated-color openings, no adjudication.

## Classification policy

- clear direct-Crab negative: REJECT
- positive/non-harmful but unresolved: STACK-ELIGIBLE and replicate when warranted
- flat with no plausible complementary value: leave out of stack
- statistically meaningful direct-Crab positive evidence: replicate exact candidate before any promotion decision

A 512-game screen is triage, not proof. No Stockfish 18 parity/superiority claim may be made from this experiment.