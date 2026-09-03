# Crab Chess upstream provenance

Crab Chess is a modified GPLv3 derivative of Stockfish 18.

Immutable upstream comparison baseline:

- Upstream project: official-stockfish/Stockfish
- Release tag: `sf_18`
- Commit: `cb3d4ee9b47d0c5aae855b12379378ea1439675c`
- Official deterministic bench: `2050811`
- License: GNU GPL version 3 or later, as retained in `Copying.txt`
- Upstream authors/copyright: retained in `AUTHORS` and source-file notices

Crab-specific changes must be conspicuously marked as modifications and remain GPL-compatible. Public binaries, UCI identity, build aliases, documentation, website branding, and newly written project code use Crab / Crab Chess naming. Internal Stockfish namespaces and implementation names may remain where renaming would add risk without user-facing value.

The upstream commit above is immutable for comparison. It is not advanced when Crab advances. Strength claims require matched-resource testing against an untouched build of that exact commit, plus the latest accepted Crab baseline.

## Experiment gate

One focused hypothesis per candidate. Every candidate record must capture candidate SHA, accepted-Crab baseline SHA, SF18 baseline SHA, compiler and CPU, threads/hash, NNUE checksum(s), time control or node limit, opening suite and seed, deterministic bench, W/D/L, and Elo confidence interval or SPRT result. Candidates without evidence are rejected or reverted.
