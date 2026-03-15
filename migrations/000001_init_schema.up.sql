CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    transport_type VARCHAR(50),
    hotel_name VARCHAR(255),
    hotel_stars INTEGER,
    hotel_address VARCHAR(255),
    hotel_check_in_time TIMESTAMP WITH TIME ZONE,
    hotel_check_out_time TIMESTAMP WITH TIME ZONE,
    return_departure_time TIMESTAMP WITH TIME ZONE,
    return_arrival_time TIMESTAMP WITH TIME ZONE,
    image_url VARCHAR(255),
    events TEXT,
    price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'RUB',
    rating NUMERIC(3, 2),
    reviews_count INTEGER
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
