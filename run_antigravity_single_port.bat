@echo off
REM Run Antigravity - All Services on Single Port
REM SERDOS DIGITAL NUSANTARA v2.1
REM Port 1111 - Laravel Gateway
REM Port 8080 - Reverb WebSocket
REM Port 5000 - AI Engine

echo ========================================
echo  RUNNING ANTIGRAVITY SERVICES
echo ========================================
echo.
echo Services will run on:
echo  - HTTP:     http://127.0.0.1:1111
echo  - WebSocket: ws://127.0.0.1:8080
echo  - AI Engine: http://127.0.0.1:5000
echo.

REM Start Laravel on Port 1111
echo [1/3] Starting Laravel Server...
cd backend-api
start cmd /k php artisan serve --host=127.0.0.1 --port=1111
timeout /t 2

REM Start Reverb WebSocket
echo [2/3] Starting Reverb WebSocket...
start cmd /k php artisan reverb:start --host=127.0.0.1 --port=8080
timeout /t 2

REM Start Python AI Engine
echo [3/3] Starting AI Similarity Engine...
cd ../ai-similarity-engine
start cmd /k python app.py

echo.
echo ========================================
echo  ALL SERVICES RUNNING
echo  Access: http://127.0.0.1:1111
echo ========================================
pause
