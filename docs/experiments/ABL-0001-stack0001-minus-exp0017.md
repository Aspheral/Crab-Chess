# ABL-0001 — STACK-0001 minus EXP-0017

Status: TESTING, NOT ACCEPTED.

Purpose: determine whether EXP-0017 (multi-cut correction history) is contributing positively to STACK-0001 or acting as a weak/interfering component.

Parent STACK-0001 evidence before ablation:

- vs accepted Crab, run 1: 51/425/36, +10.18 Elo, 95% CI [-2.21, +22.60]
- vs accepted Crab, run 2: 53/421/38, +10.18 Elo, 95% CI [-2.49, +22.88]
- combined vs accepted Crab: 104/846/74 over 1024 games, score 0.514648, about +10.18 Elo; simple draw-aware combined 95% CI about [+1.32, +19.05]
- vs immutable SF18, run 1: 54/418/40, +9.50 Elo, 95% CI [-3.38, +22.41]
- vs immutable SF18, run 2: 42/433/37, +3.39 Elo, 95% CI [-8.44, +15.23]
- combined vs immutable SF18: 96/851/77 over 1024 games, score 0.509277, about +6.45 Elo; simple draw-aware combined 95% CI about [-2.30, +15.20]

These results justify ablation but not promotion. The Crab result is encouraging; the SF18 comparison remains statistically unresolved and is context only, not a parity/superiority claim.

ABL-0001 removes only EXP-0017 and retains:

- EXP-0010 continuation-correction prefetch
- EXP-0012 optimism arithmetic
- EXP-0015 IIR guard removal
- EXP-0016 negative-extension simplification
- EXP-0018 dynamic root-score EMA

Rationale: EXP-0017 was the weakest STACK-0001 component before stacking. Its standalone 512-game screen was 46/421/45 (+0.68 Elo) versus accepted Crab and 41/421/50 (-6.11 Elo) versus immutable SF18. Because STACK-0001 is positive as a whole, removing EXP-0017 is the highest-information first ablation.

Decision rule: compare the ablated stack to the parent STACK-0001 evidence, while still running matched-resource games against accepted Crab and immutable SF18. If removing EXP-0017 materially improves or preserves the stack signal across replication, EXP-0017 becomes a removal candidate. If the ablated stack clearly weakens, EXP-0017 is evidence-supported as a contributing component. One 512-game screen is triage, not final proof.

Immutable SF18 reference: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`, official deterministic bench 2050811.
