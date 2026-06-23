#!/bin/bash

# Run Antigravity - All Services on Single Port (macOS/Linux)
# SERDOS DIGITAL NUSANTARA v2.1
# Port 1111 - Laravel Gateway
# Port 8080 - Reverb WebSocket
# Port 5000 - AI Engine

echo "========================================"
echo "  RUNNING ANTIGRAVITY SERVICES"
echo "========================================"
echo ""
echo "Services will run on:"
echo "  - HTTP:     http://127.0.0.1:1111"
echo "  - WebSocket: ws://127.0.0.1:8080"
echo "  - AI Engine: http://127.0.0.1:5000"
echo ""

# Setup Path for Herd PHP and Node.js
export PATH="/Users/salsabil/.config/herd-lite/bin:/usr/local/bin:$PATH"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running setup first
if [ ! -d "backend-api/vendor" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Run setup first:${NC}"
    echo "  ./setup_antigravity.sh"
    exit 1
fi

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $LARAVEL_PID $REVERB_PID $AI_PID 2>/dev/null
    echo "Services stopped."
}

trap cleanup EXIT

# Start Laravel on Port 1111
echo ""
echo "[1/3] Starting Laravel Server (Port 1111)..."
cd backend-api || exit 1

# Auto-sync database on start (migrate & seed)
echo "  - Auto-syncing database..."
/Users/salsabil/.config/herd-lite/bin/php artisan migrate --force
/Users/salsabil/.config/herd-lite/bin/php artisan db:seed --force

/Users/salsabil/.config/herd-lite/bin/php artisan serve --host=127.0.0.1 --port=1111 > /tmp/laravel.log 2>&1 &
LARAVEL_PID=$!
echo -e "${GREEN}✅ Laravel started (PID: $LARAVEL_PID)${NC}"
sleep 2
cd ..

# Start Reverb WebSocket
echo "[2/3] Starting Reverb WebSocket (Port 8080)..."
cd backend-api || exit 1
/Users/salsabil/.config/herd-lite/bin/php artisan reverb:start --host=127.0.0.1 --port=8080 > /tmp/reverb.log 2>&1 &
REVERB_PID=$!
echo -e "${GREEN}✅ Reverb started (PID: $REVERB_PID)${NC}"
sleep 2
cd ..

# Start Python AI Engine
echo "[3/3] Starting AI Similarity Engine (Port 5000)..."
cd ai-similarity-engine || exit 1
python3 app.py > /tmp/ai_engine.log 2>&1 &
AI_PID=$!
echo -e "${GREEN}✅ AI Engine started (PID: $AI_PID)${NC}"
cd ..

echo ""
echo "========================================"
echo "  ALL SERVICES RUNNING ✅"
echo "========================================"
echo ""
echo "Access the application:"
echo -e "  ${GREEN}http://127.0.0.1:1111${NC}"
echo ""
echo "View logs:"
echo "  tail -f /tmp/laravel.log      # Laravel"
echo "  tail -f /tmp/reverb.log       # Reverb"
echo "  tail -f /tmp/ai_engine.log    # AI Engine"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt
wait
