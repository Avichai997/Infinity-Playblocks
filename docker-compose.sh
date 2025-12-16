#!/bin/bash
# Simple wrapper that handles --dev flag

DEV_MODE=false
ARGS=()

for arg in "$@"; do
  if [ "$arg" = "--dev" ]; then
    DEV_MODE=true
  else
    ARGS+=("$arg")
  fi
done

if [ "$DEV_MODE" = true ]; then
  NODE_ENV=development DOCKERFILE=Dockerfile.dev docker-compose -f docker-compose.yml -f docker-compose.dev.yml "${ARGS[@]}"
else
  docker-compose "${ARGS[@]}"
fi
