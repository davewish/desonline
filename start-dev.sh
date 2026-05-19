#!/bin/bash

# DesOnline Development Server Startup Script
# This script starts both the frontend and backend servers

echo "🚀 Starting DesOnline Development Servers..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

# Start Backend
echo -e "${BLUE}📦 Starting Backend Server...${NC}"
cd backend
npm install --silent 2>/dev/null
npm run dev &
BACKEND_PID=$!
sleep 2

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
cd ../frontend
npm install --silent 2>/dev/null
npm run dev &
FRONTEND_PID=$!
sleep 2

echo ""
echo -e "${GREEN}✅ All servers started successfully!${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:5000"
echo "📍 API: http://localhost:5000/api"
echo ""
echo "📚 Documentation: Check README.md for more info"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for all background jobs
wait
