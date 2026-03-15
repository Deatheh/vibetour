package service

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"vibetour/internal/core/domains"
)

type TourRepository interface {
	Create(ctx context.Context, t domains.Tour) error
	GetByID(ctx context.Context, id string) (domains.Tour, error)
	GetAll(ctx context.Context, limit, offset int) ([]domains.Tour, error)
	Delete(ctx context.Context, id string) error
	UpdateEvents(ctx context.Context, id, eventsJSON string) error
}

type TourService struct {
	repo TourRepository
}

func NewTourService(repo TourRepository) *TourService {
	return &TourService{repo: repo}
}

func (s *TourService) GetTours(ctx context.Context, limit, offset int) ([]domains.Tour, error) {
	if limit == 0 {
		limit = 10
	}
	return s.repo.GetAll(ctx, limit, offset)
}

func (s *TourService) GetTourByID(ctx context.Context, id string) (domains.Tour, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *TourService) CreateTour(ctx context.Context, t domains.Tour) (domains.Tour, error) {
	if t.ID == "" {
		t.ID = "evt_" + strings.ReplaceAll(t.Title, " ", "_")
	}
	err := s.repo.Create(ctx, t)
	return t, err
}

func (s *TourService) DeleteTour(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *TourService) GenerateAIDescription(ctx context.Context, id string) (string, error) {
	tour, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return "", err
	}

	aiEvents := []domains.AIEvent{
		{
			Title:       fmt.Sprintf("Специальное событие в %s", tour.City),
			Description: "Уникальная выставка/экскурсия с дешевыми билетами.",
			Date:        tour.ArrivalTime.AddDate(0, 0, 1).Format("2006-01-02"),
		},
		{
			Title:       "Концерт/Театр для вечернего отдыха",
			Description: "Доступные билеты на вечернее шоу в центре города.",
			Date:        tour.ArrivalTime.AddDate(0, 0, 2).Format("2006-01-02"),
		},
	}

	eventsJSON, _ := json.MarshalIndent(aiEvents, "", "  ")
	eventsStr := string(eventsJSON)

	err = s.repo.UpdateEvents(ctx, id, eventsStr)
	if err != nil {
		return "", err
	}

	return eventsStr, nil
}
