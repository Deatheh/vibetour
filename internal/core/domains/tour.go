package domains

import "time"

type Tour struct {
	ID                  string
	Title               string
	City                string
	Country             string
	Description         string
	DepartureTime       time.Time
	ArrivalTime         time.Time
	HotelName           string
	HotelStars          int
	HotelAddress        string
	HotelCheckInTime    time.Time
	HotelCheckOutTime   time.Time
	ReturnDepartureTime time.Time
	ReturnArrivalTime   time.Time
	TransportType       string
	Price               float64
	Currency            string
	ImageURL            string
	IncludedInTour      *Included
	Events              string
	Rating              float64
	ReviewsCount        int
}

type Included struct {
	Flight        bool
	Transfer      bool
	Meals         []string
	GuideServices bool
	Insurance     bool
}

type AIEvent struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
}
