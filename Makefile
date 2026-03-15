# Удобный Makefile для запуска и сборки проекта

.PHONY: all build run test lint up down clean

all: build

# Запуск приложения локально
run:
	go run ./cmd/api/main.go

# Сборка бинарника
build:
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/api ./cmd/api/main.go

# Запуск тестов
test:
	go test -v -race ./...

# Запуск инфраструктуры (БД, S3, API) через Docker Compose
up:
	docker-compose up -d --build

# Остановка инфраструктуры Docker
down:
	docker-compose down

# Быстрая очистка сгенерированных файлов
clean:
	rm -rf bin/
