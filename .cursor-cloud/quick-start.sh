#!/usr/bin/env bash
# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0
#
# Quick start script for OpenTelemetry Demo in Cursor Cloud
# Usage: ./quick-start.sh [minimal|full]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
MODE="${1:-minimal}"

log() {
    echo "[quick-start] $*"
}

error() {
    echo "[quick-start] ERROR: $*" >&2
    exit 1
}

cd "$WORKSPACE_DIR"

# Ensure startup has been run
if [[ ! -f "docker-compose.minimal.no-limits.yml" ]] || [[ ! -f "docker-compose.no-limits.yml" ]]; then
    log "Running initial setup..."
    "$SCRIPT_DIR/startup.sh"
fi

# Wait for Docker
log "Checking Docker..."
max_wait=60
waited=0
while ! docker info &>/dev/null && [[ $waited -lt $max_wait ]]; do
    if [[ $waited -eq 0 ]]; then
        log "Waiting for Docker daemon..."
    fi
    sleep 2
    ((waited+=2))
done

if ! docker info &>/dev/null; then
    error "Docker daemon not available after ${max_wait}s"
fi

log "Docker is ready"

# Setup Prometheus fallback if needed
PROMETHEUS_IMAGE=$(grep "^PROMETHEUS_IMAGE=" .env | cut -d= -f2)
if [[ "$PROMETHEUS_IMAGE" == quay.io/* ]] && ! docker image inspect "$PROMETHEUS_IMAGE" &>/dev/null 2>&1; then
    log "Setting up Prometheus fallback from Docker Hub..."
    "$SCRIPT_DIR/prometheus-fallback.sh" 2>/dev/null || log "Prometheus fallback will be attempted during compose up"
fi

# Select compose file based on mode
case "$MODE" in
    minimal|min)
        COMPOSE_FILE="docker-compose.minimal.no-limits.yml"
        log "Starting minimal stack..."
        ;;
    full|all)
        COMPOSE_FILE="docker-compose.no-limits.yml"
        log "Starting full stack..."
        ;;
    *)
        error "Unknown mode: $MODE (use 'minimal' or 'full')"
        ;;
esac

# Start services
log "Using compose file: $COMPOSE_FILE"
docker compose --env-file .env --env-file .env.override -f "$COMPOSE_FILE" up --force-recreate --remove-orphans --detach

log ""
log "Stack starting! Services may take 1-2 minutes to become fully ready."
log ""
log "Access points:"
log "  Web UI:        http://localhost:8080"
log "  Jaeger UI:     http://localhost:8080/jaeger/ui"
log "  Load Gen:      http://localhost:8080/loadgen/"
log ""
log "Check health:    ./.cursor-cloud/check-health.sh"
log "View logs:       docker compose -f $COMPOSE_FILE logs -f"
log "Stop:            make stop"
