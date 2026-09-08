# EXP-0027 promotion evidence

## Decision

Promotion candidate. EXP-0027 preserves an explicit `movestogo` horizon in cyclic time controls when less than one second remains by restricting Crab's sub-second centi-MTG reduction to sudden-death/increment controls (`limits.movestogo == 0`).

This promotion branch starts from accepted Crab `b0e726762387a2e3d26aa68ad7fb68ebda84cbfe` and contains only the validated engine diff plus this evidence record. Inherited GPLv3 and Stockfish copyright/upstream attribution notices remain unchanged. Crab/Crab Chess remains the public executable/UCI/build/documentation identity.

## Immutable controls

- Accepted Crab baseline: `b0e726762387a2e3d26aa68ad7fb68ebda84cbfe`
- Accepted Crab deterministic bench: `2146293`
- Immutable Stockfish 18 baseline: `cb3d4ee9b47d0c5aae855b12379378ea1439675c` (`sf_18`)
- Official Stockfish 18 deterministic bench: `2050811`
- EXP-0027 experiment branch head: `caf020da1d1813728a677f1d6bb7c8ec63cbb7ca`
- Experimental candidate tree: `22ec079562af56485605eb85d3a377064ec63302`
- Applied engine-diff SHA-256: `8d080d5b6ca13613341590a11213b016f3c7d7eb7fbfcf25e99292135500bce7`

## Validation

Normal Crab CI passed on the experimental candidate under GCC and Clang, preserving Crab UCI identity and deterministic bench `2146293`; sanitizer and website smoke jobs also passed. The normal `3+0.03` strength screen was intentionally skipped because it never supplies explicit `movestogo` and therefore cannot exercise this hypothesis.

Targeted evidence used Cute Chess v1.3.1, Threads=1, Hash=64 MiB, concurrency=2, `40/1` cyclic time control, sequential paired openings from `tools/strength/openings.pgn` repeated with colors reversed, 8 opening plies, and no adjudication. Opening SHA-256 was `cabd8807594be4a14abcaebb54f2457ad5c291f76bb2d1f6e34e2b795c8d96a6`. NNUE checksums matched accepted Crab and immutable SF18 (`37f18f62...` and `c288c895...`).

### Targeted run 1, 512 games per opponent

- vs accepted Crab: **119 W / 336 D / 57 L**, score 56.05%, Elo estimate +42.28, draw-aware 95% CI [+24.83, +59.94]
- vs immutable SF18: **122 W / 324 D / 66 L**, score 55.47%, Elo estimate +38.15, draw-aware 95% CI [+20.07, +56.45]
- candidate time forfeits: 0 in both legs
- artifact digest: `sha256:6afc73164f6e7336f6f6ffb7f3e1d57ca0db88951ce935486ef7b8a3a70dd24a`

### Exact replication, 512 games per opponent

- vs accepted Crab: **109 W / 325 D / 78 L**, score 53.03%, Elo estimate +21.06, draw-aware 95% CI [+2.92, +39.32]
- vs immutable SF18: **135 W / 320 D / 57 L**, score 57.62%, Elo estimate +53.34, draw-aware 95% CI [+35.18, +71.80]
- candidate time forfeits: 0 in both legs
- artifact digest: `sha256:4f0727dc3c833770d3e907b1d00f75037f963352139e85dceca1b58f9c23a148`

### Combined direct record

The two exact-method runs are combined by W/D/L rather than by arithmetically adding Elo estimates.

- vs accepted Crab: **228 W / 661 D / 135 L over 1,024 games**, score 54.54%, Elo estimate about **+31.64**, draw-aware 95% CI about **[+19.05, +44.31]**
- vs immutable SF18: **257 W / 644 D / 123 L over 1,024 games**, score 56.54%, Elo estimate about **+45.73**, draw-aware 95% CI about **[+32.90, +58.68]**

The direct accepted-Crab evidence is replicated and statistically meaningful at this targeted cyclic control. SF18 results are context only and are not a claim of general Stockfish 18 parity or superiority.

## Audit correction

An earlier conversational summary stated incorrect run-1 W/D/L values. The archived GitHub Actions artifact is authoritative; this record uses the verified artifact values above.

## Promotion gate

Do not merge until the fresh promotion branch passes full Crab CI, including native GCC/Clang builds, Crab UCI identity, deterministic/reproducible bench, sanitizer/correctness checks, integrity checks, and website smoke. No experimental workflow file is carried into the promotion branch.
