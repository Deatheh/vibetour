package service

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"vibetour/internal/core/domains"

	openai "github.com/sashabaranov/go-openai"
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

func (s *TourService) GenerateAIDescription(ctx context.Context, id string) ([]byte, error) {
	tour, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	cfg := openai.DefaultConfig(os.Getenv("ZVENOAI_API_KEY"))
	cfg.BaseURL = "https://api.zveno.ai/v1"

	client := openai.NewClientWithConfig(cfg)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "qwen/qwen3-next-80b-a3b-instruct:free",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: fmt.Sprintf(`Напиши события, которые проходят в городе: %s с %s по %s. Ответ должен быть в виде JSON объекта, состоящего из массива объектов с полями: 
					event_date
					start_time
					end_time
					description (на русском)
					(Название полей должны быть на английском языке).
					Пример:
					{
						"event_date": "2026-03-16",
						"start_time": "12:00",
						"end_time": "18:00",
						"description": "Фестиваль весенней книги на ВДНХ — встречи с авторами, презентации новых изданий и мастер-классы для читателей всех возрастов."
					}
					`, tour.City, tour.ArrivalTime.String(), tour.ReturnDepartureTime.String()),
				},
			},
		},
	)
	if err != nil {
		return nil, err
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("Пустой ответ")
	}
	fmt.Println(resp.Choices[0].Message.Content)

	eventsJSON, err := json.MarshalIndent(resp.Choices[0].Message.Content, "", "  ")
	if err != nil {
		return nil, err
	}

	return eventsJSON, nil
}
