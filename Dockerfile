# syntax=docker/dockerfile:1.4
FROM golang:1.21-alpine AS builder

# Установка корневых сертификатов, если понадобятся внешние вызовы 
RUN apk add --no-cache ca-certificates

WORKDIR /app

# Оптимизация кэширования загрузки модулей (слой не будет пересобираться, если go.mod не изменен)
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

# Копирование остального кода
COPY . .

# Максимально оптимизированная сборка (убрана отладочная информация, статический бинарник)
# Использование mount-кэшей позволяет ускорять повторные сборки кода
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o main ./cmd/api/main.go

# Финальный легковесный "пустой" образ
FROM scratch
WORKDIR /app

# Копируем сертификаты из builder-а для корректной работы HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Копируем собранный бинарник
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
