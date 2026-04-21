# Astronomy Shop Architecture Diagram

This diagram is derived from the service topology in `docker-compose.yml`.

```mermaid
flowchart LR
  user[User Browser]
  lg[Load Generator]
  fp[frontend-proxy (Envoy)]
  fe[frontend (Next.js)]

  subgraph Core Business Services
    ad[ad]
    cart[cart]
    checkout[checkout]
    currency[currency]
    email[email]
    payment[payment]
    catalog[product-catalog]
    reviews[product-reviews]
    recs[recommendation]
    shipping[shipping]
    quote[quote]
    accounting[accounting]
    fraud[fraud-detection]
    imagep[image-provider]
    llm[llm]
  end

  subgraph Data and Messaging
    db[(astronomy-db / PostgreSQL)]
    cache[(valkey-cart)]
    kafka[(kafka)]
  end

  subgraph Feature Flags
    flagd[flagd]
    flagdui[flagd-ui]
  end

  subgraph Observability
    otel[otel-collector]
    jaeger[jaeger]
    prom[prometheus]
    grafana[grafana]
    os[(opensearch)]
    tdocs[telemetry-docs]
  end

  %% Entry path
  user --> fp
  lg --> fp
  fp --> fe

  %% Frontend fanout
  fe --> ad
  fe --> cart
  fe --> checkout
  fe --> currency
  fe --> catalog
  fe --> reviews
  fe --> recs
  fe --> shipping
  fe --> quote
  fe --> imagep

  %% Checkout orchestration path
  checkout --> cart
  checkout --> currency
  checkout --> email
  checkout --> payment
  checkout --> catalog
  checkout --> shipping

  %% Service-to-service dependencies
  shipping --> quote
  recs --> catalog
  reviews --> catalog
  reviews --> llm

  %% Persistence and messaging
  cart --> cache
  catalog --> db
  reviews --> db
  checkout --> kafka
  accounting --> kafka
  fraud --> kafka

  %% Feature flags
  fe -.-> flagd
  ad -.-> flagd
  cart -.-> flagd
  checkout -.-> flagd
  email -.-> flagd
  payment -.-> flagd
  catalog -.-> flagd
  recs -.-> flagd
  llm -.-> flagd
  flagdui --> flagd

  %% Telemetry flow
  ad --> otel
  cart --> otel
  checkout --> otel
  currency --> otel
  email --> otel
  payment --> otel
  catalog --> otel
  reviews --> otel
  recs --> otel
  shipping --> otel
  quote --> otel
  accounting --> otel
  fraud --> otel
  fe --> otel
  fp --> otel
  imagep --> otel
  kafka --> otel
  flagd --> otel
  flagdui --> otel
  tdocs --> otel

  otel --> jaeger
  otel --> prom
  otel --> os
  jaeger --> fp
  grafana --> fp
  flagdui --> fp
  tdocs --> fp
```



## Notes

- `frontend-proxy` is the primary ingress and routes UI traffic to `frontend` plus observability/docs endpoints.
- `checkout` is the main order orchestrator and is tightly coupled to cart, payment, shipping, and product catalog.
- `kafka` carries async events used by `checkout`, `accounting`, and `fraud-detection`.
- `otel-collector` is the telemetry hub forwarding to Jaeger, Prometheus, and OpenSearch.

