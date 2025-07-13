#!/usr/bin/env bash
set -e

# Where bench.js lives
SCRIPT="./test/bench.js"

if command -v hyperfine >/dev/null 2>&1; then
  echo "Using hyperfine for benchmarking!"
  echo
  echo "📝 Encode comparison (Node.js vs. Bun):"
  echo
  hyperfine \
    --warmup 1 \
    --runs 100 \
    'node '"$SCRIPT"' msid' \
    'bun '"$SCRIPT"' msid'
  echo
  echo "📝 Decode comparison (Node.js vs. Bun):"
  echo
  hyperfine \
    --warmup 1 \
    --runs 100 \
    'node '"$SCRIPT"' decode' \
    'bun '"$SCRIPT"' decode'
  echo
  echo "📝 MSID vs ULID encode time comparison:"
  echo
  hyperfine \
    --warmup 1 \
    --runs 100 \
    'node '"$SCRIPT"' msid' \
    'node '"$SCRIPT"' ulid'
  echo
else
  echo "⚠️  hyperfine not found, falling back to manual runs:"
  echo
fi
