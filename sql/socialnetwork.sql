-- I called my database "caper-socialmedia" not "caper-socialnetwork"

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first !=''),
    last VARCHAR(255) NOT NULL CHECK (last !=''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email !=''),
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(500),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);