#!/bin/bash

echo "========================================"
echo "   Assembly Transpiler - Starting..."
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[1/3] Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: npm install failed${NC}"
        exit 1
    fi
    echo ""
else
    echo -e "${GREEN}[1/3] Dependencies already installed${NC}"
fi

# Check if output.css exists
if [ ! -f "public/css/output.css" ]; then
    echo -e "${YELLOW}[2/3] Building CSS...${NC}"
    npx postcss public/css/input.css -o public/css/output.css
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: CSS build failed${NC}"
        exit 1
    fi
    echo ""
else
    echo -e "${GREEN}[2/3] CSS already built${NC}"
fi

# Start CSS watcher in background
echo -e "${YELLOW}[3/3] Starting CSS watcher...${NC}"
npm run build:css &
CSS_PID=$!

# Wait for CSS builder
sleep 2

# Start server
echo ""
echo "========================================"
echo "   Server starting..."
echo "   Open http://localhost:3000"
echo "========================================"
echo ""
node server.js

# Kill CSS watcher when server stops
kill $CSS_PID 2>/dev/null
