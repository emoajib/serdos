#!/bin/bash

# SERDOS Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/serdos"
BACKUP_DIR="/var/backups/serdos"

echo "🚀 Starting SERDOS deployment to $ENVIRONMENT environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
   exit 1
fi

# Create backup
log "Creating backup..."
mkdir -p "$BACKUP_DIR"
mysqldump -u root serdos_digital > "$BACKUP_DIR/database_$(date +%Y%m%d_%H%M%S).sql"
tar -czf "$BACKUP_DIR/files_$(date +%Y%m%d_%H%M%S).tar.gz" -C "$PROJECT_DIR" .

# Pull latest changes
log "Pulling latest changes..."
cd "$PROJECT_DIR"
git pull origin main

# Install/update dependencies
log "Installing PHP dependencies..."
cd backend-api
composer install --no-dev --optimize-autoloader

log "Installing Node.js dependencies..."
cd ../frontend-web
npm ci

log "Installing Python dependencies..."
cd ../ai-similarity-engine
pip install -r requirements.txt

# Build frontend
log "Building frontend..."
cd ../frontend-web
npm run build
cp -r dist/* ../backend-api/public/

# Database operations
log "Running database migrations..."
cd ../backend-api
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
log "Restarting services..."
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
sudo systemctl restart mysql

# Restart application services
log "Restarting application services..."
pkill -f "php artisan serve" || true
pkill -f "python app.py" || true

cd backend-api
nohup php artisan serve --host=127.0.0.1 --port=1111 > storage/logs/artisan.log 2>&1 &

cd ../ai-similarity-engine
nohup python app.py > ../backend-api/storage/logs/ai.log 2>&1 &

# Health check
log "Performing health check..."
sleep 5
if curl -f http://127.0.0.1:1111/api/v1/health > /dev/null 2>&1; then
    log "✅ Health check passed!"
else
    error "❌ Health check failed!"
    exit 1
fi

log "🎉 Deployment completed successfully!"
log "Application available at: http://127.0.0.1:1111"