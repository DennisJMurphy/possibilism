-- I called my database "caper-socialmedia" not "caper-socialnetwork"
-- I'm still using the old tables for user info

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
CREATE TABLE friendships( 
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
 );

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL CHECK (message <> ''),
    sender_id INT NOT NULL REFERENCES users(id),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects(
  id SERIAL PRIMARY KEY,
    owner INTEGER,
    name VARCHAR(255) NOT NULL CHECK (name !=''),
    banner VARCHAR(255),
    banner_credit VARCHAR(255),
    category VARCHAR(255),
    summary VARCHAR (600),
    primary_metric INTEGER,
    primary_metric_desc VARCHAR(255),
    ts TIMESTAMP default CURRENT_TIMESTAMP
);
