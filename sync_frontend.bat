@echo off
REM Sync Frontend - Build and Copy to Public
REM SERDOS DIGITAL NUSANTARA v2.1

echo ========================================
echo  SYNCING FRONTEND BUILD
echo ========================================
echo.

cd frontend-web
echo [1/2] Building React frontend...
call npm run build

echo [2/2] Copying build to backend-api/public...
if exist ..\backend-api\public\*.* del /s /q ..\backend-api\public\*.*
xcopy /E /I dist ..\backend-api\public

echo.
echo ========================================
echo  FRONTEND SYNC COMPLETED
echo ========================================
pause
