CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    astromoney_balance DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO profiles (user_id, username, avatar_url, bio, astromoney_balance)
VALUES
    (1, 'spacecadet', 'https://example.com/avatar1.png', 'Exploring the cosmos', 100.00),
    (2, 'starchaser', 'https://example.com/avatar2.png', 'Chasing stars', 250.50);

CREATE TABLE blog_posts (
    Id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO blog_posts (user_id, title, content)
VALUES
    (1, 'Exploring the Stars', 'Space is vast and full of mysteries.'),
    (2, 'Cosmic Thoughts', 'I often wonder what lies beyond the visible universe.');

ALTER TABLE blog_posts
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
