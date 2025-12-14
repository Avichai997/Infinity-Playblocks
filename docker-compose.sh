#!/bin/bash
# Simple wrapper that handles --dev flag

# Check if --dev flag is present
DEV_MODE=false
ARGS=()

for arg in "$@"; do
  if [ "$arg" = "--dev" ]; then
    DEV_MODE=true
  else
    ARGS+=("$arg")
  fi
done

# Set NODE_ENV based on mode and run docker-compose
if [ "$DEV_MODE" = true ]; then
  NODE_ENV=development docker-compose "${ARGS[@]}"
else
  docker-compose "${ARGS[@]}"
fi
