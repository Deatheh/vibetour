# syntax=docker/dockerfile:1.4
FROM golang:1.25-alpine AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -ldflags="-s -w" -o /app/exe ./cmd/main.go

FROM alpine:latest

WORKDIR /

COPY --from=builder /app/exe .

COPY --from=builder /build/templates ./templates

COPY --from=builder /build/.env .

EXPOSE 8080

CMD ["/exe"]

