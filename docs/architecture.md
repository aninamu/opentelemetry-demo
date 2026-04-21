<!-- markdownlint-disable MD013 MD033 -->
# OpenTelemetry Demo — Architecture Diagram

The OpenTelemetry Demo ("Astronomy Shop") is a polyglot microservice
application used to exercise and showcase OpenTelemetry instrumentation. The
diagram below shows the runtime topology as defined in
[`docker-compose.yml`](../docker-compose.yml): user traffic enters through the
Envoy-based `frontend-proxy`, fans out across the service mesh, and every
service exports traces / metrics / logs to the OpenTelemetry Collector, which
then forwards signals to the observability back-ends (Jaeger, Prometheus,
OpenSearch, Grafana).

Each service node is annotated with its implementation language. Solid edges
represent service-to-service request traffic (gRPC / HTTP / Kafka). Dashed
edges represent telemetry (OTLP) emitted to the Collector. Dotted edges
represent Collector exports to observability back-ends.

## Rendered diagrams

The Mermaid source below is the canonical description of the architecture.
Pre-rendered copies live alongside it:

- [`architecture.svg`](./architecture.svg)
- [`architecture.png`](./architecture.png)

## Mermaid source

```mermaid
%%{init: {'flowchart': {'curve': 'basis'}, 'themeVariables': {'fontSize': '14px'}}}%%
flowchart LR
    %% ---------- Actors ----------
    user(["User<br/>Browser"]):::actor
    loadgen["load-generator<br/><i>Python / Locust</i>"]:::loadgen
    rnapp(["react-native-app<br/><i>TypeScript</i>"]):::actor

    %% ---------- Edge ----------
    subgraph EDGE["Edge"]
        proxy["frontend-proxy<br/><i>Envoy</i>"]:::edge
    end

    %% ---------- Front-end ----------
    subgraph UI["User Interface"]
        frontend["frontend<br/><i>TypeScript / Next.js</i>"]:::app
        imageprovider["image-provider<br/><i>nginx</i>"]:::app
    end

    %% ---------- Core services ----------
    subgraph CORE["Core Microservices"]
        ad["ad<br/><i>Java</i>"]:::app
        cart["cart<br/><i>.NET / C#</i>"]:::app
        checkout["checkout<br/><i>Go</i>"]:::app
        currency["currency<br/><i>C++</i>"]:::app
        email["email<br/><i>Ruby</i>"]:::app
        fraud["fraud-detection<br/><i>Kotlin</i>"]:::app
        payment["payment<br/><i>Node.js</i>"]:::app
        productcatalog["product-catalog<br/><i>Go</i>"]:::app
        productreviews["product-reviews<br/><i>Python</i>"]:::app
        quote["quote<br/><i>PHP</i>"]:::app
        recommendation["recommendation<br/><i>Python</i>"]:::app
        shipping["shipping<br/><i>Rust</i>"]:::app
        accounting["accounting<br/><i>.NET / C#</i>"]:::app
        llm["llm<br/><i>Python</i>"]:::app
    end

    %% ---------- Data stores / infra ----------
    subgraph DATA["Data & Platform"]
        valkey[("valkey-cart<br/><i>Valkey</i>")]:::store
        astrodb[("astronomy-db<br/><i>PostgreSQL</i>")]:::store
        kafka[["kafka<br/><i>Kafka</i>"]]:::queue
        flagd["flagd<br/><i>Feature flags</i>"]:::infra
        flagdui["flagd-ui<br/><i>Elixir / Phoenix</i>"]:::infra
        telemetrydocs["telemetry-docs<br/><i>nginx / MkDocs</i>"]:::infra
    end

    %% ---------- Observability ----------
    subgraph OBS["Observability"]
        collector[["otel-collector<br/><i>OTel Collector</i>"]]:::otel
        jaeger["jaeger<br/><i>Traces</i>"]:::back
        prometheus["prometheus<br/><i>Metrics</i>"]:::back
        opensearch["opensearch<br/><i>Logs</i>"]:::back
        grafana["grafana<br/><i>Dashboards</i>"]:::back
    end

    %% ---------- User / edge traffic ----------
    user -->|HTTP| proxy
    rnapp -->|HTTP/gRPC| proxy
    loadgen -->|synthetic HTTP| proxy
    proxy -->|HTTP| frontend
    proxy -->|HTTP| imageprovider
    proxy -->|HTTP| flagdui
    proxy -->|HTTP| grafana
    proxy -->|HTTP| jaeger
    proxy -->|HTTP| telemetrydocs
    proxy -->|OTLP browser telemetry| collector

    %% ---------- Frontend fan-out (gRPC unless noted) ----------
    frontend -->|gRPC| ad
    frontend -->|gRPC| cart
    frontend -->|gRPC| checkout
    frontend -->|gRPC| currency
    frontend -->|gRPC| productcatalog
    frontend -->|gRPC| productreviews
    frontend -->|gRPC| recommendation
    frontend -->|HTTP| shipping
    frontend -->|HTTP| quote

    %% ---------- Checkout orchestration ----------
    checkout -->|gRPC| cart
    checkout -->|gRPC| currency
    checkout -->|gRPC| productcatalog
    checkout -->|gRPC| payment
    checkout -->|HTTP| shipping
    checkout -->|HTTP| email
    checkout -->|Kafka produce<br/>orders| kafka

    %% ---------- Downstream service calls ----------
    recommendation -->|gRPC| productcatalog
    shipping -->|HTTP| quote
    productreviews -->|gRPC| productcatalog
    productreviews -->|HTTP| llm

    %% ---------- Data stores ----------
    cart -->|Valkey protocol| valkey
    productcatalog --> astrodb
    productreviews --> astrodb
    accounting --> astrodb

    %% ---------- Kafka consumers ----------
    kafka -->|consume orders| accounting
    kafka -->|consume orders| fraud

    %% ---------- Feature flags ----------
    ad -.->|OpenFeature| flagd
    cart -.->|OpenFeature| flagd
    checkout -.->|OpenFeature| flagd
    payment -.->|OpenFeature| flagd
    productcatalog -.->|OpenFeature| flagd
    recommendation -.->|OpenFeature| flagd
    frontend -.->|OpenFeature| flagd
    loadgen -.->|OpenFeature| flagd
    llm -.->|OpenFeature| flagd
    flagdui -.->|manage flags| flagd

    %% ---------- Telemetry (OTLP) ----------
    frontend -.->|OTLP| collector
    ad -.->|OTLP| collector
    cart -.->|OTLP| collector
    checkout -.->|OTLP| collector
    currency -.->|OTLP| collector
    email -.->|OTLP| collector
    fraud -.->|OTLP| collector
    payment -.->|OTLP| collector
    productcatalog -.->|OTLP| collector
    productreviews -.->|OTLP| collector
    quote -.->|OTLP| collector
    recommendation -.->|OTLP| collector
    shipping -.->|OTLP| collector
    accounting -.->|OTLP| collector
    imageprovider -.->|OTLP| collector
    flagd -.->|OTLP| collector
    flagdui -.->|OTLP| collector
    proxy -.->|OTLP| collector

    %% ---------- Collector exports ----------
    collector ==>|traces| jaeger
    collector ==>|metrics| prometheus
    collector ==>|logs| opensearch
    grafana -. query .-> prometheus
    grafana -. query .-> jaeger
    grafana -. query .-> opensearch

    %% ---------- Styles ----------
    classDef actor fill:#26251e,stroke:#14120b,color:#f7f7f4
    classDef loadgen fill:#f2f1ed,stroke:#26251e,color:#26251e
    classDef edge fill:#f54e00,stroke:#a83400,color:#ffffff
    classDef app fill:#f2f1ed,stroke:#26251e,color:#26251e
    classDef store fill:#e6e5e0,stroke:#26251e,color:#26251e
    classDef queue fill:#e1e0db,stroke:#26251e,color:#26251e
    classDef infra fill:#ebeae5,stroke:#26251e,color:#26251e
    classDef otel fill:#425cc7,stroke:#1f2a5a,color:#ffffff
    classDef back fill:#14120b,stroke:#14120b,color:#f7f7f4
```

## Legend

- **Solid edges** — in-band request traffic (gRPC, HTTP, Kafka).
- **Dashed edges (`-.->`)** — OpenTelemetry (OTLP) telemetry export or
  OpenFeature flag evaluations.
- **Thick edges (`==>`)** — Collector exporting signals to a back-end.
- **Orange node** — Envoy edge proxy (`frontend-proxy`).
- **Blue node** — OpenTelemetry Collector (telemetry hub).
- **Dark nodes** — end-user actors and observability back-ends.

## Service inventory

| Service             | Language / runtime     | Role                                            |
|---------------------|------------------------|-------------------------------------------------|
| `frontend-proxy`    | Envoy                  | Edge router; terminates public traffic          |
| `frontend`          | TypeScript / Next.js   | Astronomy Shop web UI + BFF                     |
| `react-native-app`  | TypeScript             | Mobile client (not started by compose)          |
| `image-provider`    | nginx                  | Serves product images                           |
| `ad`                | Java                   | Ad recommendations (gRPC)                       |
| `cart`              | .NET / C#              | Shopping cart (gRPC), backed by Valkey          |
| `checkout`          | Go                     | Checkout orchestration (gRPC)                   |
| `currency`          | C++                    | FX conversion (gRPC)                            |
| `email`             | Ruby                   | Order confirmation emails (HTTP)                |
| `fraud-detection`   | Kotlin                 | Kafka consumer scoring orders                   |
| `payment`           | Node.js                | Payment processing (gRPC)                       |
| `product-catalog`   | Go                     | Product data (gRPC), backed by PostgreSQL       |
| `product-reviews`   | Python                 | Reviews (gRPC), backed by PostgreSQL + LLM      |
| `quote`             | PHP                    | Shipping quotes (HTTP)                          |
| `recommendation`    | Python                 | Recommendation engine (gRPC)                    |
| `shipping`          | Rust                   | Shipping (HTTP + gRPC)                          |
| `accounting`        | .NET / C#              | Kafka consumer recording orders                 |
| `llm`               | Python                 | LLM-backed review summarization                 |
| `flagd`             | OpenFeature flagd      | Feature-flag evaluation                         |
| `flagd-ui`          | Elixir / Phoenix       | UI for flagd flag management                    |
| `kafka`             | Apache Kafka           | Event bus between checkout / accounting / fraud |
| `valkey-cart`       | Valkey                 | Cache for cart contents                         |
| `astronomy-db`      | PostgreSQL             | Shared OLTP database                            |
| `otel-collector`    | OpenTelemetry Collector| Receives OTLP; fans out to back-ends            |
| `jaeger`            | Jaeger                 | Trace storage / UI                              |
| `prometheus`        | Prometheus             | Metric storage                                  |
| `opensearch`        | OpenSearch             | Log storage                                     |
| `grafana`           | Grafana                | Unified dashboarding over the three back-ends   |
| `load-generator`    | Python / Locust        | Drives synthetic traffic                        |
| `telemetry-docs`    | nginx / MkDocs         | Hosts demo's telemetry docs                     |

## Source of truth

This diagram is derived from:

- Top-level [`docker-compose.yml`](../docker-compose.yml) service graph and
  `depends_on` relationships.
- Per-service `*_ADDR` / `*_HOST` wiring in [`.env`](../.env).
- Service README files under [`src/`](../src) describing language, protocol
  and collaborators.
