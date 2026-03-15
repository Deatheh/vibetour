package http

import (
	"context"
	"net"
	"net/http"
	"strconv"
	"time"

	appErrors "vibetour/internal/core/errors"

	"vibetour/internal/core/domains"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
)

type TourService interface {
	GetTours(ctx context.Context, limit, offset int) ([]domains.Tour, error)
	GetTourByID(ctx context.Context, id string) (domains.Tour, error)
	CreateTour(ctx context.Context, t domains.Tour) (domains.Tour, error)
	DeleteTour(ctx context.Context, id string) error
	GenerateAIDescription(ctx context.Context, id string) (string, error)
}

type EventCardDTO struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreateTourRequestDTO struct {
	Title               string            `json:"title"`
	City                string            `json:"city"`
	Country             string            `json:"country,omitempty"`
	Description         string            `json:"description,omitempty"`
	DepartureTime       time.Time         `json:"departure_time"`
	ArrivalTime         time.Time         `json:"arrival_time"`
	HotelName           string            `json:"hotel_name"`
	HotelStars          int               `json:"hotel_stars,omitempty"`
	HotelAddress        string            `json:"hotel_address,omitempty"`
	HotelCheckInTime    time.Time         `json:"hotel_check_in_time"`
	HotelCheckOutTime   time.Time         `json:"hotel_check_out_time"`
	ReturnDepartureTime time.Time         `json:"return_departure_time"`
	ReturnArrivalTime   time.Time         `json:"return_arrival_time"`
	TransportType       string            `json:"transport_type"`
	Price               float64           `json:"price"`
	Currency            string            `json:"currency,omitempty"`
	ImageURL            string            `json:"image_url,omitempty"`
	IncludedInTour      *domains.Included `json:"included_in_tour,omitempty"`
}

type TourHandler struct {
	service TourService
	log     *zap.Logger
}

func NewTourHandler(service TourService, log *zap.Logger) *TourHandler {
	return &TourHandler{
		service: service,
		log:     log,
	}
}

func (h *TourHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/events", h.GetEvents)
	r.GET("/events/:id", h.GetEventDetails)

	admin := r.Group("/admin")
	{
		admin.POST("/tours", h.CreateTour)
		admin.DELETE("/tours/:id", h.DeleteTour)
		admin.POST("/tours/:id/generate-description", h.GenerateDescription)
	}
}

func (h *TourHandler) RunServer(mainCtx context.Context, r *gin.Engine) error {
	httpServer := &http.Server{
		Addr:    ":8080",
		Handler: r,
		BaseContext: func(_ net.Listener) context.Context {
			return mainCtx
		},
	}

	g, gCtx := errgroup.WithContext(mainCtx)

	g.Go(func() error {
		h.log.Info("Starting server on " + httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			h.log.Error("ListenAndServe error", zap.Error(err))
			return err
		}
		return nil
	})

	g.Go(func() error {
		<-gCtx.Done()
		h.log.Info("Shutting down server gracefully...")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := httpServer.Shutdown(shutdownCtx); err != nil {
			h.log.Error("Server forced to shutdown", zap.Error(err))
			return err
		}

		h.log.Info("Server stopped executing")
		return nil
	})

	return g.Wait()
}

func (h *TourHandler) GetEvents(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	tours, err := h.service.GetTours(c.Request.Context(), limit, offset)
	if err != nil {
		h.handleError(c, err)
		return
	}

	var items []EventCardDTO
	for _, t := range tours {
		items = append(items, EventCardDTO{
			ID:          t.ID,
			Title:       t.Title,
			Description: t.Description,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
		"total": len(items),
	})
}

func (h *TourHandler) GetEventDetails(c *gin.Context) {
	id := c.Param("id")
	tour, err := h.service.GetTourByID(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, tour)
}

func (h *TourHandler) CreateTour(c *gin.Context) {
	var req CreateTourRequestDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		h.handleError(c, appErrors.ErrInvalidRequest)
		return
	}

	domainTour := domains.Tour{
		Title:               req.Title,
		City:                req.City,
		Country:             req.Country,
		Description:         req.Description,
		DepartureTime:       req.DepartureTime,
		ArrivalTime:         req.ArrivalTime,
		HotelName:           req.HotelName,
		HotelStars:          req.HotelStars,
		HotelAddress:        req.HotelAddress,
		HotelCheckInTime:    req.HotelCheckInTime,
		HotelCheckOutTime:   req.HotelCheckOutTime,
		ReturnDepartureTime: req.ReturnDepartureTime,
		ReturnArrivalTime:   req.ReturnArrivalTime,
		TransportType:       req.TransportType,
		Price:               req.Price,
		Currency:            req.Currency,
		ImageURL:            req.ImageURL,
		IncludedInTour:      req.IncludedInTour,
	}

	createdTour, err := h.service.CreateTour(c.Request.Context(), domainTour)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, createdTour)
}

func (h *TourHandler) DeleteTour(c *gin.Context) {
	id := c.Param("id")
	err := h.service.DeleteTour(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TourHandler) GenerateDescription(c *gin.Context) {
	id := c.Param("id")
	eventsJSON, err := h.service.GenerateAIDescription(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"events": eventsJSON,
	})
}

func (h *TourHandler) handleError(c *gin.Context, err error) {
	if err == appErrors.ErrNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}
	if err == appErrors.ErrInvalidRequest {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	h.log.Error("internal server error", zap.Error(err))
	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
}
