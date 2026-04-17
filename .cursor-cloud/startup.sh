#!/usr/bin/env bash
# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0
#
# Cursor Cloud Agent Startup Script for OpenTelemetry Demo
# This script configures the environment for running the demo in Cloud Agent VMs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
LOG_PREFIX="[otel-demo-startup]"

log() {
    echo "$LOG_PREFIX $*"
}

error() {
    echo "$LOG_PREFIX ERROR: $*" >&2
}

# -----------------------------------------------------------------------------
# 1. Docker Configuration for cgroupfs + fuse-overlayfs
# -----------------------------------------------------------------------------
configure_docker() {
    log "Checking Docker daemon configuration..."
    
    local DOCKER_CONFIG_DIR="/etc/docker"
    local DAEMON_JSON="$DOCKER_CONFIG_DIR/daemon.json"
    local REQUIRED_CONFIG='{"storage-driver":"fuse-overlayfs","exec-opts":["native.cgroupdriver=cgroupfs"]}'
    
    if [[ -f "$DAEMON_JSON" ]]; then
        local current_config
        current_config=$(cat "$DAEMON_JSON" 2>/dev/null || echo "{}")
        
        # Check if config already has the required settings
        if echo "$current_config" | grep -q "fuse-overlayfs" && \
           echo "$current_config" | grep -q "cgroupfs"; then
            log "Docker daemon already configured for cgroupfs + fuse-overlayfs"
            return 0
        fi
    fi
    
    log "Configuring Docker daemon for cgroupfs + fuse-overlayfs..."
    
    if [[ -w "$DOCKER_CONFIG_DIR" ]] || [[ $EUID -eq 0 ]]; then
        sudo mkdir -p "$DOCKER_CONFIG_DIR"
        echo "$REQUIRED_CONFIG" | sudo tee "$DAEMON_JSON" > /dev/null
        log "Docker daemon.json updated"
        
        # Restart Docker if it's running
        if systemctl is-active --quiet docker 2>/dev/null; then
            log "Restarting Docker daemon..."
            sudo systemctl restart docker
            # Wait for Docker to be ready
            local max_wait=30
            local waited=0
            while ! docker info &>/dev/null && [[ $waited -lt $max_wait ]]; do
                sleep 1
                ((waited++))
            done
            if docker info &>/dev/null; then
                log "Docker daemon restarted successfully"
            else
                error "Docker daemon failed to start within ${max_wait}s"
                return 1
            fi
        fi
    else
        log "Cannot write to $DOCKER_CONFIG_DIR (not root). Docker config may need manual setup."
    fi
}

# -----------------------------------------------------------------------------
# 2. Prometheus quay.io Fallback - Pull from Docker Hub and re-tag
# -----------------------------------------------------------------------------
setup_prometheus_fallback() {
    log "Setting up Prometheus fallback (quay.io is blocked)..."
    
    # Read the expected Prometheus image from .env
    if [[ -f "$WORKSPACE_DIR/.env" ]]; then
        local PROMETHEUS_IMAGE
        PROMETHEUS_IMAGE=$(grep "^PROMETHEUS_IMAGE=" "$WORKSPACE_DIR/.env" | cut -d= -f2)
        
        if [[ -n "$PROMETHEUS_IMAGE" ]] && [[ "$PROMETHEUS_IMAGE" == quay.io/* ]]; then
            # Extract version from quay.io/prometheus/prometheus:v3.x.x
            local version
            version=$(echo "$PROMETHEUS_IMAGE" | sed 's/.*:\(.*\)/\1/')
            local DOCKERHUB_IMAGE="prom/prometheus:${version}"
            
            log "Prometheus image: $PROMETHEUS_IMAGE"
            log "Will use Docker Hub fallback: $DOCKERHUB_IMAGE"
            
            # Only pull and tag if Docker is running
            if docker info &>/dev/null; then
                # Check if quay.io image already exists
                if docker image inspect "$PROMETHEUS_IMAGE" &>/dev/null; then
                    log "Prometheus image already available locally"
                    return 0
                fi
                
                log "Pulling Prometheus from Docker Hub: $DOCKERHUB_IMAGE"
                if docker pull "$DOCKERHUB_IMAGE" 2>/dev/null; then
                    log "Re-tagging as: $PROMETHEUS_IMAGE"
                    docker tag "$DOCKERHUB_IMAGE" "$PROMETHEUS_IMAGE"
                    log "Prometheus fallback setup complete"
                else
                    log "Could not pull Prometheus from Docker Hub (may be offline or rate-limited)"
                    log "Prometheus will be pulled when Docker Compose runs"
                fi
            else
                log "Docker not running - Prometheus fallback will be handled at runtime"
            fi
        else
            log "Prometheus image is not from quay.io, no fallback needed"
        fi
    else
        log "No .env file found, skipping Prometheus setup"
    fi
}

# -----------------------------------------------------------------------------
# 3. Generate Docker Compose files without memory limits
# -----------------------------------------------------------------------------
generate_no_limits_compose() {
    log "Generating Docker Compose files without memory limits..."
    
    cd "$WORKSPACE_DIR"
    
    # Install PyYAML if needed
    if ! python3 -c "import yaml" &>/dev/null; then
        log "Installing PyYAML..."
        pip3 install --quiet pyyaml 2>/dev/null || pip install --quiet pyyaml 2>/dev/null || true
    fi
    
    python3 << 'PYTHON_SCRIPT'
import yaml
import os
import sys

workspace = os.environ.get('WORKSPACE_DIR', os.getcwd())
compose_files = ['docker-compose.yml', 'docker-compose.minimal.yml']

for f in compose_files:
    input_path = os.path.join(workspace, f)
    output_path = os.path.join(workspace, f.replace('.yml', '.no-limits.yml'))
    
    if not os.path.exists(input_path):
        print(f"Skipping {f} (not found)")
        continue
    
    try:
        with open(input_path) as fh:
            data = yaml.safe_load(fh)
        
        if not data or 'services' not in data:
            print(f"Skipping {f} (no services found)")
            continue
        
        modified = False
        for svc_name, svc in data.get('services', {}).items():
            limits = svc.get('deploy', {}).get('resources', {}).get('limits', {})
            if 'memory' in limits:
                del limits['memory']
                modified = True
                # Clean up empty nested dicts
                if not limits:
                    del svc['deploy']['resources']['limits']
                if not svc['deploy']['resources']:
                    del svc['deploy']['resources']
                if not svc['deploy']:
                    del svc['deploy']
        
        if modified:
            with open(output_path, 'w') as fh:
                yaml.dump(data, fh, default_flow_style=False, sort_keys=False)
            print(f"Generated: {os.path.basename(output_path)}")
        else:
            print(f"No memory limits found in {f}")
            
    except Exception as e:
        print(f"Error processing {f}: {e}", file=sys.stderr)

print("Done generating no-limits compose files")
PYTHON_SCRIPT

    log "No-limits compose files generated"
}

# -----------------------------------------------------------------------------
# 4. Create helper scripts for health checks
# -----------------------------------------------------------------------------
create_helper_scripts() {
    log "Creating helper scripts..."
    
    # Create prometheus-fallback.sh for on-demand use
    cat > "$SCRIPT_DIR/prometheus-fallback.sh" << 'EOF'
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
EOF
    chmod +x "$SCRIPT_DIR/prometheus-fallback.sh"
    
    log "Helper scripts created"
}

# -----------------------------------------------------------------------------
# 5. Validate environment
# -----------------------------------------------------------------------------
validate_environment() {
    log "Validating environment..."
    
    local issues=0
    
    # Check Docker
    if command -v docker &>/dev/null; then
        log "  [OK] Docker CLI installed"
    else
        error "  [MISSING] Docker CLI not found"
        ((issues++))
    fi
    
    # Check Docker Compose
    if docker compose version &>/dev/null; then
        log "  [OK] Docker Compose available"
    else
        error "  [MISSING] Docker Compose not found"
        ((issues++))
    fi
    
    # Check required files
    for f in ".env" ".env.override" "docker-compose.yml" "docker-compose.minimal.yml"; do
        if [[ -f "$WORKSPACE_DIR/$f" ]]; then
            log "  [OK] $f exists"
        else
            if [[ "$f" == ".env.override" ]]; then
                log "  [WARN] $f not found (optional)"
            else
                error "  [MISSING] $f"
                ((issues++))
            fi
        fi
    done
    
    # Check no-limits files
    for f in "docker-compose.no-limits.yml" "docker-compose.minimal.no-limits.yml"; do
        if [[ -f "$WORKSPACE_DIR/$f" ]]; then
            log "  [OK] $f generated"
        else
            log "  [INFO] $f not yet generated"
        fi
    done
    
    if [[ $issues -eq 0 ]]; then
        log "Environment validation passed"
    else
        error "Environment validation found $issues issue(s)"
    fi
    
    return $issues
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    log "Starting Cursor Cloud environment setup for OpenTelemetry Demo..."
    log "Workspace: $WORKSPACE_DIR"
    
    configure_docker
    setup_prometheus_fallback
    generate_no_limits_compose
    create_helper_scripts
    validate_environment || true
    
    log "Setup complete!"
    log ""
    log "Quick start commands:"
    log "  Start minimal stack:  docker compose --env-file .env --env-file .env.override -f docker-compose.minimal.no-limits.yml up -d"
    log "  Start full stack:     docker compose --env-file .env --env-file .env.override -f docker-compose.no-limits.yml up -d"
    log "  Check health:         ./.cursor-cloud/check-health.sh"
    log "  Stop:                 make stop"
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
