# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0


FROM golang:1.25-bookworm AS builder

WORKDIR /usr/src/app/

COPY ./src/ad-go/go.mod go.mod
COPY ./src/ad-go/go.sum go.sum

RUN go mod download

COPY ./src/ad-go/genproto/oteldemo/ genproto/oteldemo/
COPY ./src/ad-go/main.go main.go

RUN CGO_ENABLED=0 GOOS=linux GO111MODULE=on go build -ldflags "-s -w" -o ad main.go

FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /usr/src/app/

COPY --from=builder /usr/src/app/ad/ ./

EXPOSE ${AD_PORT}
ENTRYPOINT [ "./ad" ]
