# Crab Chess upstream provenance

Crab Chess is a modified GPLv3 chess engine derived from the official Stockfish 18 release.

## Frozen upstream anchor

- Upstream project: Stockfish
- Upstream repository: `official-stockfish/Stockfish`
- Release tag: `sf_18`
- Commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Upstream tree: `a416dabd4bd16caf1908d520ea45971fb509dc5f`
- Official release bench: `2050811`
- Release date: 2026-01-31
- License: GNU General Public License v3

This commit is the immutable reference used by Crab Chess for direct regression and strength comparisons.

## Branding policy

The distributed engine and all project-owned user-facing surfaces identify themselves as **Crab Chess**, not as the upstream project.

Examples:

- binary: `crab`
- UCI name: `Crab Chess`
- website: Crab Chess
- WASM module: Crab
- packages/releases: Crab Chess
- new tools, namespaces, telemetry and experiment names: Crab

Upstream names remain only where required for truthful provenance, copyright, licensing, compatibility notes, or experimental baseline identification. Legal notices are not branding and must not be stripped.

## Modification policy

The imported source is intentionally treated as a modified work from day one.

1. Preserve upstream copyright and GPL notices.
2. Add clear Crab modification/provenance notices where appropriate.
3. Rename project identity, executable identity and project-owned documentation to Crab.
4. Keep the upstream release SHA and bench immutable.
5. Do not silently pull later upstream changes into the SF18 reference.
6. Port later ideas only as explicit Crab experiments with their own evidence and provenance.
7. Keep optimization patches focused enough to benchmark and strength-test independently.

## Baseline policy

Crab maintains two references:

### SF18 reference

The untouched official `sf_18` release is the scientific control. It is never altered to make Crab results look better.

### Accepted Crab

The current accepted Crab baseline contains only experiments that passed required correctness and performance/strength gates.

A new candidate is tested against accepted Crab. Important changes are also compared directly against the frozen SF18 reference.

## License obligations

Because the native engine is derived from GPLv3 software, Crab Chess remains GPLv3 when distributed as a covered work. The repository must ship the complete GPLv3 license and preserve applicable upstream copyright/license notices. Modified versions must be identified as modified.

Crab-specific branding does not erase upstream authorship. Conversely, upstream authors are not presented as responsible for Crab-specific modifications, bugs, claims, releases, or website behavior.
