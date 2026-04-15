# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **OpenTelemetry Astronomy Shop Demo**, a polyglot
microservice-based e-commerce app with 15+ services in 11
languages. All services run via Docker Compose. See `README.md`
and `CONTRIBUTING.md` for general docs.

### Running the Application

- **Start (full):** `make start`
- **Start (minimal):** `make start-minimal`
- **Stop:** `make stop`
- **Restart one service:** `make restart service=<name>`
- **Rebuild + restart:** `make redeploy service=<name>`
- Web UI at <http://localhost:8080> after starting.

### Cgroup v2 Workaround (Cloud Agent VMs)

Docker must use the `cgroupfs` driver due to cgroup v2
threading constraints in Cloud Agent VMs:

```json
{"storage-driver": "fuse-overlayfs", "exec-opts": ["native.cgroupdriver=cgroupfs"]}
```

The `deploy.resources.limits.memory` directives in the
docker-compose files trigger cgroup errors. Strip memory
limits before starting:

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

Then use the generated `.no-limits.yml` file instead.

### Network Restrictions

- `quay.io` is blocked. Prometheus cannot be pulled.
  Workaround: pull from Docker Hub and re-tag, e.g.
  `docker tag prom/prometheus:v3.0.0 quay.io/...`
- `grafana.com` is blocked, so Grafana cannot install
  plugins and will keep restarting.
- Both Prometheus and Grafana are optional observability
  services. The core shop works without them.

### Pre-built Images vs Source

Pre-built images on `ghcr.io/open-telemetry/demo:latest-*`
may not match the repo source. If Envoy (frontend-proxy)
fails with validation errors about empty addresses,
rebuild from source:

```bash
docker compose --env-file .env --env-file .env.override \
  -f <compose-file> build frontend-proxy
```

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
