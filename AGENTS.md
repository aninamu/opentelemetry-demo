# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **OpenTelemetry Astronomy Shop Demo**, a polyglot
microservice-based e-commerce app with 15+ services in 11
languages. All services run via Docker Compose. See `README.md`
and `CONTRIBUTING.md` for general docs.

### Quick Start (Cloud Agents)

The `.cursor-cloud/` directory contains automated setup scripts:

```bash
# One-command startup (handles all setup automatically)
./.cursor-cloud/quick-start.sh minimal   # Minimal stack (faster)
./.cursor-cloud/quick-start.sh full      # Full stack (all services)

# Or run setup manually first
./.cursor-cloud/startup.sh               # Configure environment
./.cursor-cloud/check-health.sh          # Verify services
```

The startup script automatically:
- Verifies Docker cgroupfs + fuse-overlayfs configuration
- Pulls Prometheus from Docker Hub (quay.io workaround)
- Generates no-limits compose files (cgroup workaround)
- Validates the environment

### Running the Application

**Recommended for Cloud Agents** (uses no-limits compose files):

```bash
# Minimal stack (core services only, faster startup)
docker compose --env-file .env --env-file .env.override \
  -f docker-compose.minimal.no-limits.yml up -d

# Full stack (all services including Kafka, fraud detection)
docker compose --env-file .env --env-file .env.override \
  -f docker-compose.no-limits.yml up -d
```

**Standard commands** (may fail in Cloud Agent VMs):

- **Start (full):** `make start`
- **Start (minimal):** `make start-minimal`
- **Stop:** `make stop`
- **Restart one service:** `make restart service=<name>`
- **Rebuild + restart:** `make redeploy service=<name>`

**Access points** (after starting):

- Web UI: <http://localhost:8080>
- Jaeger UI: <http://localhost:8080/jaeger/ui>
- Load Generator: <http://localhost:8080/loadgen/>
- Feature Flags: <http://localhost:8080/feature/>
- Grafana: <http://localhost:8080/grafana/> (may be unavailable)

### Cloud Agent Environment Details

#### Docker Configuration

Docker must use `cgroupfs` driver due to cgroup v2 constraints:

```json
{"storage-driver": "fuse-overlayfs", "exec-opts": ["native.cgroupdriver=cgroupfs"]}
```

This is pre-configured in `/etc/docker/daemon.json`. The startup
script verifies this configuration.

#### Memory Limits Workaround

The `deploy.resources.limits.memory` directives trigger cgroup
errors. The startup script generates `*.no-limits.yml` files
automatically. To regenerate manually:

```bash
./.cursor-cloud/startup.sh
```

Or use the Python snippet in the startup script.

### Network Restrictions

| Registry | Status | Workaround |
|----------|--------|------------|
| `quay.io` | Blocked | Pull from Docker Hub, re-tag (automated by startup.sh) |
| `grafana.com` | Blocked | Grafana plugins unavailable; service may restart |
| `ghcr.io` | Available | Pre-built images work |

**Prometheus fallback** (if not auto-handled):

```bash
./.cursor-cloud/prometheus-fallback.sh
```

**Note:** Prometheus and Grafana are optional observability
services. The core shop works without them.

### Pre-built Images vs Source

Pre-built images on `ghcr.io/open-telemetry/demo:latest-*`
may not match the repo source. If Envoy (frontend-proxy)
fails with validation errors about empty addresses,
rebuild from source:

```bash
docker compose --env-file .env --env-file .env.override \
  -f docker-compose.minimal.no-limits.yml build frontend-proxy
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Containers fail with cgroup errors | Use `*.no-limits.yml` files |
| Prometheus image pull fails | Run `.cursor-cloud/prometheus-fallback.sh` |
| Grafana keeps restarting | Ignore (plugin install blocked); optional service |
| Frontend-proxy validation errors | Rebuild: `docker compose ... build frontend-proxy` |
| Services slow to start | Wait 1-2 min; check with `.cursor-cloud/check-health.sh` |

### Lint and Checks

- `make misspell` -- spell check all markdown docs
- `make markdownlint` -- lint all markdown docs
- `make checklicense` -- verify Apache 2.0 license headers
- `make check` -- runs all of the above plus link checking
- Requires `npm install` and `make install-tools`.

### Tests

- `make run-tests` -- Cypress frontend tests and Tracetest
  trace-based tests via Docker Compose (requires all
  services running)
