#!/bin/bash

# Setup Antigravity - Installation Script (macOS/Linux)
# SERDOS DIGITAL NUSANTARA v2.1

echo "========================================"
echo "  SETUP ANTIGRAVITY - SERDOS SIMULATION"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Platform: macOS detected ✅"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Platform: Linux detected ✅"
else
    echo -e "${RED}Unsupported platform${NC}"
    exit 1
fi

echo ""
echo "[1/4] Installing Laravel dependencies..."
cd backend-api || exit 1

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo -e "${YELLOW}⚠️  Composer not found. Please install Composer first.${NC}"
    echo "Visit: https://getcomposer.org/download/"
    exit 1
fi

composer install
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || echo "Note: .env.example not found, using template .env"
fi

php artisan key:generate 2>/dev/null || echo "Note: php artisan might need additional setup"
cd ..

echo ""
echo "[2/4] Installing Frontend dependencies..."
cd frontend-web || exit 1

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm not found. Please install Node.js & npm first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

npm install
cd ..

echo ""
echo "[3/4] Setting up AI Similarity Engine..."
cd ai-similarity-engine || exit 1

# Check if pip is installed
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo -e "${YELLOW}⚠️  pip not found. Please install Python first.${NC}"
    echo "Visit: https://www.python.org/"
    exit 1
fi

pip install -r requirements.txt 2>/dev/null || pip3 install -r requirements.txt
cd ..

echo ""
echo "[4/4] All dependencies installed!"
echo ""
echo "========================================"
echo "  SETUP COMPLETED ✅"
echo "  Next: ./run_antigravity_single_port.sh"
echo "========================================"
