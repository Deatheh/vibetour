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
	"vibetour/internal/features/tours/repository"
	"vibetour/internal/features/tours/service"
	httptransport "vibetour/internal/features/tours/transport/http"
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

	pool, err := repository.NewPostgresConnection(mainCtx, cfg)
	if err != nil {
		log.Fatal("Unable to connect to database", zap.Error(err))
	}
	defer func() {
		pool.Close()
	}()

	tourRepo := repository.NewTourPostgres(pool, log)
	tourService := service.NewTourService(tourRepo)
	tourHandler := httptransport.NewTourHandler(tourService, log)

	router := gin.Default()
	tourHandler.RegisterRoutes(router)

	if err := tourHandler.RunServer(mainCtx, router); err != nil {
		log.Info("Server exit reason", zap.Error(err))
	}
}
