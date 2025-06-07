-- Database schema for Insurance Search Project
-- Separate tables for USA and India insurance data

-- USA Insurance Table
CREATE TABLE IF NOT EXISTS insurance_usa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policy_name VARCHAR(255) NOT NULL,
    insurance_type VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium_usd DECIMAL(10,2) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- India Insurance Table
CREATE TABLE IF NOT EXISTS insurance_india (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policy_name VARCHAR(255) NOT NULL,
    insurance_type VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium_usd DECIMAL(10,2) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usa_type ON insurance_usa(insurance_type);
CREATE INDEX IF NOT EXISTS idx_india_type ON insurance_india(insurance_type);