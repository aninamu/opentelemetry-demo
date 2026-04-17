#!/usr/bin/env bash
# Pull Prometheus from Docker Hub and re-tag for quay.io
set -euo pipefail

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$WORKSPACE_DIR/.env" ]]; then
    PROMETHEUS_IMAGE=$(grep "^PROMETHEUS_IMAGE=" "$WORKSPACE_DIR/.env" | cut -d= -f2)
    if [[ -n "$PROMETHEUS_IMAGE" ]] && [[ "$PROMETHEUS_IMAGE" == quay.io/* ]]; then
        version=$(echo "$PROMETHEUS_IMAGE" | sed 's/.*:\(.*\)/\1/')
        DOCKERHUB_IMAGE="prom/prometheus:${version}"
        
        echo "Pulling: $DOCKERHUB_IMAGE"
        docker pull "$DOCKERHUB_IMAGE"
        
        echo "Tagging as: $PROMETHEUS_IMAGE"
        docker tag "$DOCKERHUB_IMAGE" "$PROMETHEUS_IMAGE"
        
        echo "Done!"
    fi
fi
