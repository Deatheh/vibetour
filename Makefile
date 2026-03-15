DB_URL:=postgres://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable

.PHONY: all build run test lint up down clean migrate-up migrate-down

all: build

run:
	go run ./cmd/api/main.go

build:
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/api ./cmd/api/main.go

test:
	go test -v -race ./...

up:
	docker-compose up -d --build

down:
	docker-compose down

clean:
	rm -rf bin/

migrate-up:
	migrate -path migrations -database $(DB_URL) up

migrate-down:
	migrate -path migrations -database $(DB_URL) down
