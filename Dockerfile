# Multi-stage build untuk SERDOS Simulation

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend-web
COPY frontend-web/package*.json ./
RUN npm install
COPY frontend-web .
RUN npm run build

# Stage 2: Build Backend
FROM php:8.2-fpm-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    curl \
    git \
    mysql-client \
    openssl \
    zip \
    unzip

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy backend code
COPY backend-api .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy frontend build
COPY --from=frontend-builder /app/frontend-web/dist ./public

# Set permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose ports
EXPOSE 1111 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:1111/health || exit 1

CMD ["php-fpm"]
