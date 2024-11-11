-- init.sql

-- Create a simple "Users" table
CREATE TABLE IF NOT EXISTS Users (
    Id SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default admin user
INSERT INTO Users (Email, FirstName, LastName) 
VALUES ('admin@example.com', 'Admin', 'User')
ON CONFLICT (Email) DO NOTHING;
