@echo off
echo ========================================
echo   HR Management System - Quick Start
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Application...
start "Frontend App" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo   Email: admin@hrms.com
echo   Password: password123
echo   MFA Code: 123456
echo.
echo Press any key to exit this window...
pause > nul
