package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"vibetour/internal/core/config"
	"vibetour/internal/core/logger"
	auth_repo "vibetour/internal/features/auth/repository"
	auth_service "vibetour/internal/features/auth/service"
	auth_http "vibetour/internal/features/auth/transport/http"
	tour_repo "vibetour/internal/features/tours/repository"
	tour_service "vibetour/internal/features/tours/service"
	tour_http "vibetour/internal/features/tours/transport/http"
)

func main() {
	cfg := config.NewConfig()

	log, closeLogFile, err := logger.NewLogger(cfg.LogLevel)
	if err != nil {
		panic("failed to initialize logger: " + err.Error())
	}
	defer func() {
		log.Sync()
		if err := closeLogFile(); err != nil {
			log.Error("failed to close log file", zap.Error(err))
		}
	}()

	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	pool, err := tour_repo.NewPostgresConnection(mainCtx, cfg)
	if err != nil {
		log.Fatal("Unable to connect to database", zap.Error(err))
	}
	defer func() {
		pool.Close()
	}()

	authRepo := auth_repo.NewAuthRepository(pool, log)
	authSvc := auth_service.NewAuthService(authRepo, cfg, log)
	authHandler := auth_http.NewAuthHandler(authSvc, cfg)

	tourRepo := tour_repo.NewTourPostgres(pool, log)
	tourService := tour_service.NewTourService(tourRepo)
	tourHandler := tour_http.NewTourHandler(tourService, log, cfg)

	router := gin.Default()

	authHandler.RegisterRoutes(router)
	tourHandler.RegisterRoutes(router)

	if err := tourHandler.RunServer(mainCtx, router); err != nil {
		log.Info("Server exit reason", zap.Error(err))
	}
}
