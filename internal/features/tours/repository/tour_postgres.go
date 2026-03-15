package repository

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"vibetour/internal/core/domains"
	"vibetour/internal/core/errors"
)

type tourModel struct {
	ID                  string
	Title               string
	City                string
	Country             string
	Description         string
	DepartureTime       string
	ArrivalTime         string
	HotelName           string
	HotelStars          int
	HotelAddress        string
	HotelCheckInTime    string
	HotelCheckOutTime   string
	ReturnDepartureTime string
	ReturnArrivalTime   string
	TransportType       string
	Price               float64
	Currency            string
	ImageURL            string
	IncludedInTour      []byte
	Events              string
	Rating              float64
	ReviewsCount        int
}

type TourPostgres struct {
	db  *pgxpool.Pool
	log *zap.Logger
}

func NewTourPostgres(db *pgxpool.Pool, log *zap.Logger) *TourPostgres {
	return &TourPostgres{
		db:  db,
		log: log,
	}
}

func (r *TourPostgres) Create(ctx context.Context, t domains.Tour) error {
	query := `
		INSERT INTO tours (
			id, title, city, country, description, departure_time, arrival_time, 
			hotel_name, hotel_stars, hotel_address, hotel_check_in_time, 
			hotel_check_out_time, return_departure_time, return_arrival_time, 
			transport_type, price, currency, image_url, included_in_tour, events, rating, reviews_count
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
		)
	`

	inclJSON, _ := json.Marshal(t.IncludedInTour)

	_, err := r.db.Exec(ctx, query,
		t.ID, t.Title, t.City, t.Country, t.Description, t.DepartureTime, t.ArrivalTime,
		t.HotelName, t.HotelStars, t.HotelAddress, t.HotelCheckInTime,
		t.HotelCheckOutTime, t.ReturnDepartureTime, t.ReturnArrivalTime,
		t.TransportType, t.Price, t.Currency, t.ImageURL, inclJSON, t.Events, t.Rating, t.ReviewsCount)

	if err != nil {
		r.log.Error("error executing create tour query", zap.Error(err))
	}

	return err
}

func (r *TourPostgres) GetByID(ctx context.Context, id string) (domains.Tour, error) {
	query := `SELECT id, title, city, country, description, departure_time, arrival_time, 
			hotel_name, hotel_stars, hotel_address, hotel_check_in_time, hotel_check_out_time, 
			return_departure_time, return_arrival_time, transport_type, price, currency, 
			image_url, included_in_tour, events, rating, reviews_count 
			FROM tours WHERE id = $1`

	row := r.db.QueryRow(ctx, query, id)

	var m tourModel
	err := row.Scan(&m.ID, &m.Title, &m.City, &m.Country, &m.Description, &m.DepartureTime, &m.ArrivalTime,
		&m.HotelName, &m.HotelStars, &m.HotelAddress, &m.HotelCheckInTime, &m.HotelCheckOutTime,
		&m.ReturnDepartureTime, &m.ReturnArrivalTime, &m.TransportType, &m.Price, &m.Currency,
		&m.ImageURL, &m.IncludedInTour, &m.Events, &m.Rating, &m.ReviewsCount)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return domains.Tour{}, errors.ErrNotFound
		}
		r.log.Error("error getting tour by id", zap.Error(err))
		return domains.Tour{}, err
	}

	t := domains.Tour{
		ID:            m.ID,
		Title:         m.Title,
		City:          m.City,
		Country:       m.Country,
		Description:   m.Description,
		HotelName:     m.HotelName,
		HotelStars:    m.HotelStars,
		HotelAddress:  m.HotelAddress,
		TransportType: m.TransportType,
		Price:         m.Price,
		Currency:      m.Currency,
		ImageURL:      m.ImageURL,
		Events:        m.Events,
		Rating:        m.Rating,
		ReviewsCount:  m.ReviewsCount,
	}

	json.Unmarshal(m.IncludedInTour, &t.IncludedInTour)

	return t, nil
}

func (r *TourPostgres) GetAll(ctx context.Context, limit, offset int) ([]domains.Tour, error) {
	query := `SELECT id, title, description FROM tours LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		r.log.Error("error executing get all tours query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()

	var res []domains.Tour
	for rows.Next() {
		var t domains.Tour
		if err := rows.Scan(&t.ID, &t.Title, &t.Description); err != nil {
			r.log.Error("error scanning tours", zap.Error(err))
			return nil, err
		}
		res = append(res, t)
	}
	return res, nil
}

func (r *TourPostgres) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM tours WHERE id = $1`
	res, err := r.db.Exec(ctx, query, id)
	if err != nil {
		r.log.Error("error deleting tour", zap.Error(err))
		return err
	}
	if res.RowsAffected() == 0 {
		return errors.ErrNotFound
	}
	return nil
}

func (r *TourPostgres) UpdateEvents(ctx context.Context, id, eventsJSON string) error {
	query := `UPDATE tours SET events = $1 WHERE id = $2`
	res, err := r.db.Exec(ctx, query, eventsJSON, id)
	if err != nil {
		r.log.Error("error updating tour events", zap.Error(err))
		return err
	}
	if res.RowsAffected() == 0 {
		return errors.ErrNotFound
	}
	return nil
}
