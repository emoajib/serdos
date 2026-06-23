#!/bin/bash

echo "========================================"
echo "  STARTING SERDOS SERVICES"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if dependencies installed
if [ ! -d "backend-api/vendor" ]; then
    echo -e "${RED}❌ Dependencies not installed. Run:${NC}"
    echo "  ./setup_antigravity.sh"
    exit 1
fi

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $LARAVEL_PID $AI_PID 2>/dev/null
    wait
}

trap cleanup EXIT

# Start Laravel Server
echo "[1/2] Starting Laravel (Port 1111)..."
cd backend-api
# Use artisan serve with XAMPP PHP to correctly handle routing and the public directory
/Applications/XAMPP/xamppfiles/bin/php artisan serve --host=127.0.0.1 --port=1111 > /tmp/laravel.log 2>&1 &
LARAVEL_PID=$!
echo -e "${GREEN}✅ Laravel started (PID: $LARAVEL_PID)${NC}"
sleep 2
cd ..

# Start AI Engine
echo "[2/2] Starting AI Engine (Port 5000)..."
cd ai-similarity-engine
python3 app.py > /tmp/ai_engine.log 2>&1 &
AI_PID=$!
echo -e "${GREEN}✅ AI Engine started (PID: $AI_PID)${NC}"
cd ..

echo ""
echo "========================================"
echo "  ALL SERVICES RUNNING ✅"
echo "========================================"
echo ""
echo "Access: http://127.0.0.1:1111"
echo ""
echo "Logs:"
echo "  tail -f /tmp/laravel.log"
echo "  tail -f /tmp/ai_engine.log"
echo ""
echo "Press Ctrl+C to stop"
echo ""

wait
