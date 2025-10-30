@echo off
echo ========================================
echo   HR Management System - Shutdown
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /F /IM node.exe /T 2>nul

echo.
echo System stopped successfully!
echo.
pause
