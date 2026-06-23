@echo off
REM Setup Antigravity - Installation Script
REM SERDOS DIGITAL NUSANTARA v2.1

echo ========================================
echo  SETUP ANTIGRAVITY - SERDOS SIMULATION
echo ========================================
echo.

REM Backend API setup
echo [1/4] Installing Laravel dependencies...
cd backend-api
call composer install
call cp .env.example .env
call php artisan key:generate
call php artisan migrate --seed
cd ..

REM Frontend setup
echo [2/4] Installing Frontend dependencies...
cd frontend-web
call npm install
cd ..

REM AI Engine setup
echo [3/4] Setting up AI Similarity Engine...
cd ai-similarity-engine
call pip install -r requirements.txt
cd ..

echo [4/4] All dependencies installed!
echo.
echo ========================================
echo  SETUP COMPLETED
echo  Run: call run_antigravity_single_port.bat
echo ========================================
pause
