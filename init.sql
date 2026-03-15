CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    description TEXT,
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    hotel_name VARCHAR(255),
    hotel_stars INT,
    hotel_address VARCHAR(255),
    hotel_check_in_time TIMESTAMP,
    hotel_check_out_time TIMESTAMP,
    return_departure_time TIMESTAMP,
    return_arrival_time TIMESTAMP,
    transport_type VARCHAR(50),
    price DECIMAL(10, 2),
    currency VARCHAR(10),
    image_url TEXT,
    included_in_tour JSONB,
    events JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS included_items (
    id SERIAL PRIMARY KEY,
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    items JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
