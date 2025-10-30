@echo off
echo ========================================
echo   HR Management System - Startup
echo ========================================
echo.

REM Stop any existing Node.js processes
echo [1/5] Stopping existing Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo     Stopped existing processes
    timeout /t 2 /nobreak >nul
) else (
    echo     No existing processes found
)

REM Check if MongoDB is running
echo.
echo [2/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo     MongoDB is running
) else (
    echo     WARNING: MongoDB is not running!
    echo     Attempting to start MongoDB...
    net start MongoDB >nul 2>&1
    if "%ERRORLEVEL%"=="0" (
        echo     MongoDB started successfully
    ) else (
        echo     Could not start MongoDB automatically
        echo     Please start MongoDB manually: net start MongoDB
        pause
        exit /b 1
    )
)

echo.
echo [3/5] Starting Backend Server...
start "HR Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [4/5] Starting Frontend Server...
start "HR Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [5/5] System Started!
echo.
echo ========================================
echo   System URLs:
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo            (or http://localhost:3001 if 3000 is busy)
echo.
echo   Login Credentials:
echo   Email:    admin@hrms.com
echo   Password: password123
echo   Code:     123456
echo ========================================
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo System is running!
echo Close this window to keep servers running.
echo.
pause
