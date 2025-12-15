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

# Set NODE_ENV and DOCKERFILE based on mode and run docker-compose
if [ "$DEV_MODE" = true ]; then
  # In dev mode, use override to exclude client and use dev Dockerfiles
  NODE_ENV=development DOCKERFILE=Dockerfile.dev docker-compose -f docker-compose.yml -f docker-compose.dev.yml "${ARGS[@]}"
else
  docker-compose "${ARGS[@]}"
fi
