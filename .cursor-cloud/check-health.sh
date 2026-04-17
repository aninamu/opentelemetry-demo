#!/usr/bin/env bash
# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0
#
# Health check script for OpenTelemetry Demo services
# Checks if core services are running and responsive

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service check timeout
TIMEOUT=${TIMEOUT:-5}

log_ok() {
    echo -e "${GREEN}[OK]${NC} $*"
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_info() {
    echo "[INFO] $*"
}

# Check if Docker is running
check_docker() {
    echo "=== Docker Status ==="
    if docker info &>/dev/null; then
        log_ok "Docker daemon is running"
        
        # Check Docker config
        local daemon_json="/etc/docker/daemon.json"
        if [[ -f "$daemon_json" ]]; then
            if grep -q "cgroupfs" "$daemon_json" && grep -q "fuse-overlayfs" "$daemon_json"; then
                log_ok "Docker configured for cgroupfs + fuse-overlayfs"
            else
                log_warn "Docker daemon.json may not be properly configured"
            fi
        fi
        return 0
    else
        log_fail "Docker daemon is not running"
        return 1
    fi
}

# Check if containers are running
check_containers() {
    echo ""
    echo "=== Container Status ==="
    
    local running_count
    running_count=$(docker ps --filter "network=opentelemetry-demo" --format "{{.Names}}" 2>/dev/null | wc -l)
    
    if [[ $running_count -eq 0 ]]; then
        log_info "No OpenTelemetry Demo containers running"
        return 0
    fi
    
    log_info "Found $running_count running container(s)"
    echo ""
    
    # List all containers with their status
    docker ps --filter "network=opentelemetry-demo" \
        --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true
}

# Check HTTP endpoint
check_http() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout "$TIMEOUT" "$url" 2>/dev/null || echo "000")
    
    if [[ "$status_code" == "$expected_status" ]]; then
        log_ok "$name ($url) - HTTP $status_code"
        return 0
    elif [[ "$status_code" == "000" ]]; then
        log_fail "$name ($url) - Connection failed"
        return 1
    else
        log_warn "$name ($url) - HTTP $status_code (expected $expected_status)"
        return 1
    fi
}

# Check TCP port
check_tcp() {
    local name="$1"
    local host="$2"
    local port="$3"
    
    if timeout "$TIMEOUT" bash -c ">/dev/tcp/$host/$port" 2>/dev/null; then
        log_ok "$name ($host:$port) - Port open"
        return 0
    else
        log_fail "$name ($host:$port) - Port closed/unreachable"
        return 1
    fi
}

# Check core services
check_services() {
    echo ""
    echo "=== Service Health Checks ==="
    
    local failed=0
    
    # Frontend Proxy (main entry point)
    check_http "Frontend Proxy" "http://localhost:8080" || ((failed++))
    
    # Jaeger UI
    check_http "Jaeger UI" "http://localhost:8080/jaeger/ui/" || ((failed++))
    
    # Load Generator
    check_http "Load Generator" "http://localhost:8080/loadgen/" || ((failed++))
    
    # Grafana (may fail due to plugin issues)
    check_http "Grafana" "http://localhost:8080/grafana/" || log_warn "Grafana may be unavailable (plugin install blocked)"
    
    # OTEL Collector health (internal port)
    if docker ps --format "{{.Names}}" | grep -q "otel-collector"; then
        log_ok "OTEL Collector container running"
    fi
    
    return $failed
}

# Check for common issues
check_issues() {
    echo ""
    echo "=== Common Issues Check ==="
    
    # Check for Prometheus image issue
    if ! docker image inspect "quay.io/prometheus/prometheus:v3.9.1" &>/dev/null 2>&1; then
        if docker ps -a --format "{{.Names}}" | grep -q "prometheus"; then
            log_warn "Prometheus image from quay.io may be missing"
            log_info "  Run: .cursor-cloud/prometheus-fallback.sh"
        fi
    else
        log_ok "Prometheus image available"
    fi
    
    # Check for Grafana restart loop (plugin install blocked)
    local grafana_restarts
    grafana_restarts=$(docker inspect grafana --format='{{.RestartCount}}' 2>/dev/null || echo "0")
    if [[ "$grafana_restarts" -gt 3 ]]; then
        log_warn "Grafana has restarted $grafana_restarts times (plugin install may be blocked)"
        log_info "  Grafana is optional - the demo works without it"
    fi
    
    # Check for no-limits compose files
    if [[ ! -f "$WORKSPACE_DIR/docker-compose.minimal.no-limits.yml" ]]; then
        log_warn "docker-compose.minimal.no-limits.yml not found"
        log_info "  Run: .cursor-cloud/startup.sh"
    else
        log_ok "No-limits compose files available"
    fi
}

# Summary
print_summary() {
    echo ""
    echo "=== Quick Reference ==="
    echo "Web UI:        http://localhost:8080"
    echo "Jaeger UI:     http://localhost:8080/jaeger/ui"
    echo "Load Gen:      http://localhost:8080/loadgen/"
    echo "Grafana:       http://localhost:8080/grafana/"
    echo "Feature Flags: http://localhost:8080/feature/"
    echo ""
    echo "Commands:"
    echo "  Start minimal:  docker compose --env-file .env --env-file .env.override -f docker-compose.minimal.no-limits.yml up -d"
    echo "  Start full:     docker compose --env-file .env --env-file .env.override -f docker-compose.no-limits.yml up -d"
    echo "  Stop:           make stop"
    echo "  Logs:           docker compose logs -f [service-name]"
}

# Main
main() {
    echo "OpenTelemetry Demo - Health Check"
    echo "=================================="
    echo ""
    
    local exit_code=0
    
    if ! check_docker; then
        echo ""
        log_fail "Docker is not running. Start Docker first."
        exit 1
    fi
    
    check_containers
    
    # Only check services if containers are running
    local running_count
    running_count=$(docker ps --filter "network=opentelemetry-demo" --format "{{.Names}}" 2>/dev/null | wc -l)
    
    if [[ $running_count -gt 0 ]]; then
        check_services || exit_code=1
    fi
    
    check_issues
    print_summary
    
    exit $exit_code
}

main "$@"
