@echo off
echo ========================================
echo   Restarting HR Management System
echo ========================================
echo.

echo Step 1: Stopping any running processes...
echo Please close any running terminals manually (Ctrl+C)
echo.
pause

echo.
echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

timeout /t 5 /nobreak > nul

echo.
echo Step 3: Starting Frontend Application...
start "Frontend App" cmd /k "npm run dev"

echo.
echo ========================================
echo   System Restarted!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Login Credentials:
echo   Email: admin@hrms.com
echo   Password: password123
echo   MFA Code: 123456
echo.
echo What to expect:
echo   - Dashboard updates every 10 seconds
echo   - CRUD operations work immediately
echo   - Attendance syncs across all users
echo   - All changes visible in real-time
echo.
echo Check browser console (F12) for:
echo   "Auto-refreshing data..." every 10 seconds
echo.
pause
