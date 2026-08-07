#!/bin/bash

echo "========================================"
echo "   Assembly Transpiler - Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 24+ from https://nodejs.org"
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "[1/4] Installing Node dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    exit 1
fi
echo "[OK] Dependencies installed"
echo ""

# Build CSS
echo "[2/4] Building CSS..."
npx postcss public/css/input.css -o public/css/output.css
if [ $? -ne 0 ]; then
    echo "ERROR: CSS build failed"
    exit 1
fi
echo "[OK] CSS built"
echo ""

# Setup database
echo "[3/4] Setting up MySQL database..."
echo ""
echo "Please enter your MySQL root password when prompted."
echo ""

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS transpiler;" 2>/dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: Could not connect to MySQL."
    echo "Make sure MySQL is running."
    echo ""
    echo "You can manually run: mysql -u root -p transpiler < database/schema.sql"
else
    mysql -u root -p transpiler < database/schema.sql
    echo "[OK] Database ready"
fi
echo ""

# Seed examples
echo "[4/4] Seeding example programs..."
node scripts/seed.js
echo ""

echo "========================================"
echo "   Setup complete!"
echo ""
echo "   To start: ./start.sh"
echo "========================================"
