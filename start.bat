@echo off
echo ========================================
echo    Assembly Transpiler - Starting...
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

:: Build CSS
echo Building CSS...
start "CSS Builder" cmd /c "npm run build:css"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start server
echo Starting server...
echo.
echo Open http://localhost:3000 in your browser
echo.
node server.js

pause
