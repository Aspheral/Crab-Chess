#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_URL="https://github.com/official-stockfish/Stockfish.git"
UPSTREAM_TAG="sf_18"
UPSTREAM_SHA="cb3d4ee9b47d0c5aae855b12379378ea1439675c"
EXPECTED_BENCH="2050811"
WORKDIR="${1:-.crab/upstream/sf18}"
ARCH="${CRAB_SF18_ARCH:-x86-64}"
JOBS="${CRAB_BUILD_JOBS:-2}"

rm -rf "$WORKDIR"
mkdir -p "$(dirname "$WORKDIR")"

git clone --quiet --filter=blob:none --no-checkout "$UPSTREAM_URL" "$WORKDIR"
git -C "$WORKDIR" fetch --quiet --depth=1 origin "refs/tags/${UPSTREAM_TAG}:refs/tags/${UPSTREAM_TAG}"
git -C "$WORKDIR" checkout --quiet --detach "$UPSTREAM_TAG"

actual_sha="$(git -C "$WORKDIR" rev-parse HEAD)"
if [[ "$actual_sha" != "$UPSTREAM_SHA" ]]; then
  echo "ERROR: sf_18 resolved to $actual_sha, expected $UPSTREAM_SHA" >&2
  exit 1
fi

echo "Verified immutable upstream: ${UPSTREAM_TAG} @ ${actual_sha}"

make -C "$WORKDIR/src" -j"$JOBS" build ARCH="$ARCH"

bench_output="$(mktemp)"
trap 'rm -f "$bench_output"' EXIT
"$WORKDIR/src/stockfish" bench 2>&1 | tee "$bench_output"

actual_bench="$(awk '/Nodes searched/ {print $3}' "$bench_output" | tail -n1)"
if [[ "$actual_bench" != "$EXPECTED_BENCH" ]]; then
  echo "ERROR: Stockfish 18 deterministic bench was ${actual_bench:-missing}; expected $EXPECTED_BENCH" >&2
  exit 1
fi

echo "Verified official Stockfish 18 bench: $actual_bench"

compiler="$(${CXX:-g++} --version 2>/dev/null | head -n1 || true)"
cpu="$(grep -m1 'model name' /proc/cpuinfo 2>/dev/null | cut -d: -f2- | sed 's/^ *//' || true)"

{
  echo "upstream_tag=$UPSTREAM_TAG"
  echo "upstream_sha=$actual_sha"
  echo "bench=$actual_bench"
  echo "arch=$ARCH"
  echo "compiler=${compiler:-unknown}"
  echo "cpu=${cpu:-unknown}"
  echo "threads=1"
  echo "hash_mb=16"
} > "$WORKDIR/CRAB_BASELINE_VERIFICATION.txt"

# Record checksums for the NNUE files actually present after the build. Modern
# Stockfish builds fetch the default networks as needed; checksumming them here
# makes later Crab-vs-SF experiments reproducible.
find "$WORKDIR/src" -maxdepth 1 -type f -name 'nn-*.nnue' -print0 \
  | sort -z \
  | xargs -0 -r sha256sum \
  > "$WORKDIR/CRAB_NETWORK_SHA256.txt"

cat "$WORKDIR/CRAB_BASELINE_VERIFICATION.txt"
if [[ -s "$WORKDIR/CRAB_NETWORK_SHA256.txt" ]]; then
  echo "NNUE checksums:"
  cat "$WORKDIR/CRAB_NETWORK_SHA256.txt"
else
  echo "WARNING: no NNUE file checksum was recorded" >&2
fi
