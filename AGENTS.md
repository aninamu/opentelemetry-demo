<!-- Copyright The OpenTelemetry Authors -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# AGENTS.md

## Cursor Cloud specific instructions

This is the **OpenTelemetry Astronomy Shop Demo** — a polyglot
microservice-based e-commerce application. All ~24 services run via
Docker Compose using pre-built images from `ghcr.io/open-telemetry/demo`.

### Running the application

- **Start (minimal):** `make start-minimal`
- **Start (full):** `make start`
- **Stop:** `make stop`
- **Restart a single service:** `make restart service=<name>`
- **Rebuild + restart:** `make redeploy service=<name>`

Access the webstore at `http://localhost:8080`,
Jaeger at `http://localhost:8080/jaeger/ui`,
Grafana at `http://localhost:8080/grafana/`.

### Docker-in-Docker cgroup workaround

The Cloud VM runs inside a Firecracker container where the root
cgroupv2 is in "domain threaded" mode and the `memory`/`io`
controllers cannot be delegated. Standard `runc` fails with
"cannot enter cgroupv2 with domain controllers".

**Fix applied during setup:**

1. Install `crun` (v1.20+) as an alternative OCI runtime.
2. A wrapper at `/usr/local/bin/crun-no-cgroups` strips
   `memory` and `blockIO` limits from the OCI spec before
   invoking `crun`.
3. Docker daemon (`/etc/docker/daemon.json`) uses this
   wrapper as the default runtime via `io.containerd.runc.v2`.

If Docker fails to start containers after a VM restart, ensure:

- `dockerd` is running (`sudo dockerd &>/tmp/dockerd.log &`)
- Socket permissions are set (`sudo chmod 666 /var/run/docker.sock`)
- The crun wrapper exists at `/usr/local/bin/crun-no-cgroups`
- `/etc/docker/daemon.json` references `crun-nocg` runtime

### Linting and checks

- **Spell check:** `make misspell`
- **Markdown lint:** `make markdownlint`
- **License headers:** `make checklicense`
- **All checks:** `make check`
- **YAML lint:** `make yamllint` (requires `pip install yamllint`)

These require `npm install` (for markdownlint/linkspector) and
Go tools built via `make install-tools`.

### Testing

Integration tests run via Docker Compose: `make run-tests`.
Individual services have their own test suites inside
`src/<service>/`. See `CONTRIBUTING.md` for the full
development workflow.
