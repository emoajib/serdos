#!/bin/bash

# Initialize SERDOS Database - Create necessary tables
# This script creates database tables for SERDOS Digital Nusantara v2.1

echo "========================================"
echo "  SERDOS DATABASE INITIALIZATION"
echo "========================================"
echo ""

MYSQL_USER="root"
MYSQL_SOCKET="/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock"
DB_NAME="serdos_digital"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Creating database tables..."
echo ""

# Create tables
mysql -u $MYSQL_USER --socket=$MYSQL_SOCKET --skip-ssl $DB_NAME << 'EOF'

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('dosen', 'penilai', 'admin') DEFAULT 'dosen',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nkajf DECIMAL(5,2) NOT NULL,
    npd DECIMAL(5,2) NOT NULL,
    npdd DECIMAL(5,2) NOT NULL,
    nap DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    file_path VARCHAR(255),
    document_hash VARCHAR(255),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    midtrans_response LONGTEXT,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Analysis Results table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT UNSIGNED NOT NULL,
    similarity_score DECIMAL(5,2),
    analysis_result LONGTEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    INDEX idx_portfolio_id (portfolio_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database tables created successfully!${NC}"
    echo ""
    echo "Tables created:"
    echo "  • users"
    echo "  • simulations"
    echo "  • portfolios"
    echo "  • payments"
    echo "  • ai_analysis_results"
    echo "  • subscriptions"
    echo ""
    echo "========================================"
    echo "  DATABASE INITIALIZATION COMPLETE ✅"
    echo "========================================"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi
