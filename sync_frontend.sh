#!/bin/bash

# Sync Frontend - Build and Copy to Public (macOS/Linux)
# SERDOS DIGITAL NUSANTARA v2.1

echo "========================================"
echo "  SYNCING FRONTEND BUILD"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

cd frontend-web || exit 1

echo "[1/2] Building React frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "[2/2] Copying build to backend-api/public..."

# Create public directory if it doesn't exist
mkdir -p ../backend-api/public

# Copy build files (preserve existing files except index.html)
if [ -d "dist" ]; then
    cp -r dist/* ../backend-api/public/
    echo -e "${GREEN}✅ Frontend synced successfully${NC}"
else
    echo -e "${RED}❌ dist/ folder not found${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo "  FRONTEND SYNC COMPLETED ✅"
echo "========================================"
