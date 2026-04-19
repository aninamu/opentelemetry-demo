# Ad Service

The Ad service provides advertisement based on context keys. If no context keys
are provided then it returns random ads.

## Building Locally

The Ad service requires Go 1.25+ to build. To build the Ad Service, run:

```sh
go build -o ad .
```

To run the Ad Service:

```sh
export AD_PORT=9555
export FLAGD_HOST=localhost
export FLAGD_PORT=8013
./ad
```

### Regenerating Protobuf Code

If you need to regenerate the protobuf code:

```sh
go generate ./...
```

## Building Docker

From the root of `opentelemetry-demo`, run:

```sh
docker build --file ./src/ad-go/Dockerfile ./
```

## Environment Variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `AD_PORT` | Port the gRPC server listens on | Required |
| `FLAGD_HOST` | Host for the flagd feature flag service | `flagd` |
| `FLAGD_PORT` | Port for the flagd feature flag service | `8013` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry collector endpoint | - |
| `OTEL_SERVICE_NAME` | Service name for telemetry | `ad` |

## Feature Flags

The service supports the following feature flags via flagd:

- `adFailure` - When enabled, returns UNAVAILABLE error 10% of the time
- `adManualGc` - When enabled, triggers manual garbage collection
- `adHighCpu` - When enabled, spawns goroutines to simulate high CPU load

## OpenTelemetry

The service is instrumented with OpenTelemetry for:

- **Tracing**: gRPC server spans, custom spans for `getRandomAds` and `getAdsByCategory`
- **Metrics**: `app.ads.ad_requests` counter with `ad_request_type` and
  `ad_response_type` attributes
- **Logging**: Structured logging via `otelslog`

Span attributes include:

- `app.ads.contextKeys` - The context keys from the request
- `app.ads.count` - Number of ads returned
- `app.ads.ad_request_type` - TARGETED or NOT_TARGETED
- `app.ads.ad_response_type` - TARGETED or RANDOM
- `session.id` - Session ID from baggage (if present)
