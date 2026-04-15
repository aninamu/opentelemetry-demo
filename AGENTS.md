# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **OpenTelemetry Astronomy Shop Demo** — a polyglot microservice-based e-commerce application with 15+ services in 11 languages. All services are orchestrated via Docker Compose. See `README.md` and `CONTRIBUTING.md` for general docs.

### Running the Application

- **Start (full):** `make start` → http://localhost:8080
- **Start (minimal):** `make start-minimal` → fewer services, lower resource usage
- **Stop:** `make stop`
- **Restart a single service:** `make restart service=<name>`
- **Rebuild + restart a service:** `make redeploy service=<name>`

### Cgroup v2 Workaround (Cloud Agent VMs)

Docker must be started with `cgroupfs` driver instead of systemd due to cgroup v2 threading constraints in the Cloud Agent VM:

```json
// /etc/docker/daemon.json
{"storage-driver": "fuse-overlayfs", "exec-opts": ["native.cgroupdriver=cgroupfs"]}
```

Because `deploy.resources.limits.memory` in docker-compose files triggers cgroup errors, you must strip memory limits before starting. Use:

```bash
python3 -c "
import yaml
for f in ['docker-compose.yml', 'docker-compose.minimal.yml']:
    with open(f) as fh: data = yaml.safe_load(fh)
    for svc in data.get('services', {}).values():
        limits = svc.get('deploy', {}).get('resources', {}).get('limits', {})
        limits.pop('memory', None)
    with open(f.replace('.yml', '.no-limits.yml'), 'w') as fh:
        yaml.dump(data, fh, default_flow_style=False)
"
```

Then use `-f docker-compose.minimal.no-limits.yml` instead of `-f docker-compose.minimal.yml`.

### Network Restrictions

- `quay.io` is blocked in Cloud Agent VMs. Prometheus (hosted on quay.io) cannot be pulled. As a workaround, pull from Docker Hub (`prom/prometheus:<version>`) and re-tag: `docker tag prom/prometheus:v3.0.0 quay.io/prometheus/prometheus:v3.9.1`
- `grafana.com` is blocked, so Grafana fails to install the `grafana-opensearch-datasource` plugin and will keep restarting. Both Prometheus and Grafana are optional observability services — the core shop works without them.

### Pre-built Images vs Source

The pre-built images on `ghcr.io/open-telemetry/demo:latest-*` may not match the current repo source code. If Envoy (frontend-proxy) fails with validation errors about empty addresses, rebuild it from source:

```bash
docker compose --env-file .env --env-file .env.override -f <compose-file> build frontend-proxy
```

### Lint and Checks

- `make misspell` — spell check all markdown docs
- `make markdownlint` — lint all markdown docs
- `make checklicense` — verify Apache 2.0 license headers
- `make check` — runs all of the above plus link checking
- These require `npm install` and Go tooling (`make install-tools`).

### Tests

- `make run-tests` — runs Cypress frontend tests and Tracetest trace-based tests via Docker Compose (requires all services running)
