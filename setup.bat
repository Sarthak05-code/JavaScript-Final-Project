@echo off
echo Setting up Assembly Transpiler...

:: Only install if node_modules missing
if not exist "node_modules\" (
    echo Installing Node dependencies...
    call npm install
) else (
    echo Dependencies already installed, skipping...
)

:: Only build CSS if output.css missing or input.css is newer
if not exist "public\css\output.css" (
    echo Building CSS...
    call npx postcss public/css/input.css -o public/css/output.css
) else (
    echo CSS already built, skipping...
)

:: Only create DB if it doesn't exist
echo Checking database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS transpiler;" 2>nul
if %errorlevel% neq 0 (
    echo Could not connect to MySQL. Make sure MySQL is running.
    pause
    exit /b 1
)

mysql -u root -p transpiler < database/schema.sql 2>nul

echo Setup complete!
pause
