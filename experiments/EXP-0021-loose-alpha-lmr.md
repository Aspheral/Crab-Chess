# EXP-0021 — loose-alpha quiet-move LMR adjustment

## Baselines

- Accepted Crab: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Immutable Stockfish 18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official SF18 deterministic bench: `2050811`
- Accepted Crab deterministic bench: `2673975`

## Hypothesis

At non-capture moves, make late-move reduction respond to the distance between alpha and the node's current evaluation:

```cpp
if (!capture && !is_decisive(alpha))
    r += 3 * std::clamp(alpha - eval, -64, 96);
```

When alpha is loose below eval, this decreases the reduction; when alpha is well above eval, it increases it within a bounded range. The candidate is deliberately limited to this one LMR term.

## Applicability

Current accepted Crab still computes `ss->statScore`, applies `r -= ss->statScore * 850 / 8192`, and then immediately scales reductions for ALL nodes. It has no equivalent alpha-vs-eval adjustment, so the hypothesis is applicable without duplicating an accepted Crab component.

## Upstream prior

Adapted from official Stockfish commit `5f7348f03f820038f5d246b82de544cbc1d8ffd2`, authored by Adarsh Das (Saphereye), "Reduce LMR less aggressively in loose alpha windows".

Upstream prior evidence, treated as context only:

- STC: 90,784 games, W 23,707 / D 43,758 / L 23,319, passed `<0.00,2.00>`
- LTC: 209,640 games, W 54,841 / D 100,620 / L 54,179, passed `<0.50,2.50>`

Crab does not inherit those Elo claims. Crab's matched tests decide classification.

## Run 1 evidence

All required correctness and provenance gates passed.

- Candidate/wrapper SHA used by the workflow: `4706d477d3f5b68f2d5e18d0aff76f1f88789231`
- PR evidence head: `ed29f11ceb1a6f0fde5b131eaac886aafdef47e3`
- Accepted Crab baseline: `b93ab2b0f635adffb9129c57e6f1cc2e8700720a`
- Immutable SF18: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Patch SHA-256: `d8bfc46f8ff289661759087ceac8f8b44c55332650c55901f2cf8fe9b6dfc90b`
- Applied engine-diff SHA-256: `9d043837fd7cbffd275552ebadf20fccaf407c6267952a98460c2be971e7947e`
- Canonical post-patch tree: `6330491c100c9fb334c25bdd67c6d6901eee3350`
- Candidate deterministic bench: `2380991`
- Candidate binary SHA-256: `9cf48668af7950f8c432a3f722fa46dbda93bc5f19ddcb70ee21095e26f839e2`
- Candidate GCC binary SHA-256: `33dbc2b28ea4a21e017d5e13f12fba715118fb5fc3efda6604a21561a1fe2db4`
- Accepted binary SHA-256: `14fcae95098a3e137c465d6e0e1d25f7ffb2788d133cb133e5aeb36c88944ef5`
- SF18 binary SHA-256: `e279ec570470e0e71b2394ac27131802341836191d1b623c70b4c82ad1c3f9d7`
- Compiler: GCC 13.3.0; Clang 18.1.3
- CPU: Intel Xeon 6973P-C, 4 vCPU runner
- Threads/Hash: 1 / 64 MiB
- TC/concurrency: `3+0.03` / 2
- Openings: sequential fixed 8 plies, repeated colors; no adjudication
- Opening SHA-256: `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`
- NNUE SHA-256: `37f18f62d772f3107e1d6aaca3898c130c3c86f2ab63e6555fbbca20635a899d` and `c288c895ea924429ea9092e3f36b2b3c1f00f2a3a4c759ff7e57e79e3b43e4a7`
- Cute Chess 1.3.1 source: `1071d84cf272bd7deca0964336bf02e367e2b22b`
- vs accepted Crab: **42/435/35**, score **50.6836%**, Elo **+4.75**, draw-aware 95% CI **[-6.93,+16.44]**
- vs immutable SF18: **33/458/21**, score **51.1719%**, Elo **+8.14**, draw-aware 95% CI **[-1.61,+17.92]**

## Current classification

**STACK-ELIGIBLE / replication required.** Run 1 is directionally positive against both controls, but the direct-Crab interval remains unresolved. Per Crab's bank-stack-ablate policy, this is not evidence for promotion and is not a rejection merely because zero lies inside the interval. An independent exact-candidate replication is required before deciding whether EXP-0021 should remain banked, be rejected, or become a component of the next cumulative stack.

Do not add the two Elo estimates together and do not claim SF18 parity/superiority from this screen.

## Required gates

Before any strength classification: exact patch/scope check, GCC and Clang AVX2 builds, Crab Chess UCI identity, deterministic/reproducible candidate bench, ASan/UBSan smoke, accepted Crab control at `2673975`, untouched SF18 control at `2050811`, matching NNUE and opening checksums, compiler/CPU/resource provenance, patch/diff/tree/binary hashes, and pinned Cute Chess.

Matched games use 512 games vs accepted Crab and 512 vs immutable SF18 at Threads=1, Hash=64 MiB, `3+0.03`, concurrency=2, sequential fixed 8-ply openings with repeated colors, no adjudication.

512 games are triage. A positive but unresolved direct-Crab signal should normally be replicated or banked as STACK-ELIGIBLE rather than treated as disproven merely because its CI crosses zero. Clear negative evidence is rejected and archived. No Stockfish 18 parity or superiority claim is made.

The inherited Stockfish GPLv3/copyright notices remain untouched. Crab Chess remains the executable, UCI, build, documentation, and public identity; this experiment record preserves the post-SF18 source attribution for the adapted idea.
