# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **OpenTelemetry Astronomy Shop Demo** — a polyglot microservice e-commerce application orchestrated entirely via Docker Compose. There is no workspace-level package manager; each service under `src/` is independent with its own language and build system. The root `package.json` only contains dev tools for markdown linting/link checking.

### Running the demo

The demo runs via Docker Compose using pre-built images from `ghcr.io/open-telemetry/demo`. See `Makefile` targets `start` (full) and `start-minimal` (reduced set). The minimal compose (`docker-compose.minimal.yml`) excludes Kafka, accounting, fraud-detection, and flagd-ui.

**cgroupv2 limitation in Cloud Agent VMs:** The VM's root cgroup only exposes `cpuset`, `cpu`, and `pids` controllers — the `memory` controller is unavailable. All `deploy.resources.limits.memory` settings in docker-compose must be stripped via a compose override file, otherwise containers fail with `unable to apply cgroup configuration`. Use an override like:

```yaml
services:
  <service-name>:
    deploy:
      resources:
        limits:
          memory: !reset null
```

Apply this for every service in the compose file.

**product-catalog crash:** The `product-catalog` service sets `OTEL_EXPERIMENTAL_CONFIG_FILE=/otel-config.yml` and mounts `./otel-config.yml`. The `latest` image tag's Go OTel SDK does not successfully parse this config file, causing a silent exit code 1 with no log output. **Workaround:** run `product-catalog` as a standalone container without `OTEL_EXPERIMENTAL_CONFIG_FILE` set and without the volume mount. Also increase `GOMEMLIMIT` from `16MiB` to `256MiB` since Docker memory limits are stripped.

### Starting Docker in the Cloud Agent VM

Docker must be installed and configured for docker-in-docker:

1. Install `docker-ce`, `containerd.io`, `docker-buildx-plugin`, `docker-compose-plugin`
2. Install `fuse-overlayfs` and configure `/etc/docker/daemon.json` with `"storage-driver": "fuse-overlayfs"`
3. Set `iptables-legacy` via `update-alternatives`
4. Start `dockerd` with `sudo dockerd &>/tmp/dockerd.log &`
5. Add user to docker group: `sudo usermod -aG docker ubuntu`
6. Use `sg docker -c "<command>"` to run docker commands in the current shell session

### Lint checks

- `make misspell` — spell-checking across all markdown docs
- `make markdownlint` — markdown lint (requires `npm install` first)
- `make checklicense` — Apache-2.0 license header check
- `make install-tools` — builds Go tools (misspell, addlicense) and runs `npm install`

### Web endpoints (when running)

- **Webstore:** http://localhost:8080/
- **Jaeger UI:** http://localhost:8080/jaeger/ui/
- **Grafana:** http://localhost:8080/grafana/
- **Load Generator:** http://localhost:8080/loadgen/
- **Feature Flags UI:** http://localhost:8080/feature/ (full compose only)
