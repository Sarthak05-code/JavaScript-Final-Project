CREATE DATABASE IF NOT EXISTS subshare;

USE subshare;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Subscription listings
CREATE TABLE subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    duration_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seller_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- Purchases
CREATE TABLE purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    subscription_id INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired') DEFAULT 'active',

    FOREIGN KEY (buyer_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subscription_id)
        REFERENCES subscriptions(subscription_id)
        ON DELETE CASCADE
);
