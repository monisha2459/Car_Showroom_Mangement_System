-- ============================================
-- Car Showroom Management System - Database
-- ============================================

CREATE DATABASE IF NOT EXISTS car_showroom_db;
USE car_showroom_db;

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL
);

-- Car Table
CREATE TABLE IF NOT EXISTS car (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(30) NOT NULL,
    price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    fuel_type VARCHAR(30),
    transmission VARCHAR(30),
    mileage INT DEFAULT 0
);

-- Customer Table
CREATE TABLE IF NOT EXISTS customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(200)
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    sale_price DOUBLE NOT NULL,
    sale_date DATE NOT NULL,
    payment_method VARCHAR(50),
    FOREIGN KEY (car_id) REFERENCES car(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- Sample Data (Spring Boot DataInitializer also inserts this on first run)
INSERT IGNORE INTO admin (username, password, full_name) VALUES ('admin', 'admin123', 'System Administrator');
