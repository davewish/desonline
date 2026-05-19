#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 DesOnline - Docker Development Startup${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}\n"

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Starting services...${NC}\n"

# Stop any running containers first
docker-compose down --remove-orphans 2>/dev/null

# Start services in detached mode
docker-compose up -d

# Wait for database to be healthy
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be healthy...${NC}"
sleep 5

# Check if all services are running
if docker-compose ps | grep -q "desonline-db.*Up.*healthy"; then
    echo -e "${GREEN}✅ PostgreSQL is healthy${NC}"
else
    echo -e "${YELLOW}⏳ PostgreSQL is starting, please wait...${NC}"
    sleep 10
fi

# Check backend status
if docker-compose ps | grep -q "desonline-api.*Up"; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
else
    echo -e "${RED}❌ Backend API is not running${NC}"
fi

# Check pgAdmin status
if docker-compose ps | grep -q "desonline-pgadmin.*Up"; then
    echo -e "${GREEN}✅ pgAdmin is running${NC}"
else
    echo -e "${RED}⚠️  pgAdmin is not running${NC}"
fi

echo -e "\n${GREEN}🚀 Services are starting!${NC}\n"

echo -e "${YELLOW}📊 Access Points:${NC}"
echo "  🌐 Frontend:    http://localhost:3000 (run 'npm run dev' in frontend folder)"
echo "  📡 Backend:     http://localhost:5000"
echo "  🗄️  pgAdmin:     http://localhost:5050"
echo "  🐘 PostgreSQL:  localhost:5432\n"

echo -e "${YELLOW}🔐 Test Credentials:${NC}"
echo "  Email:     admin@desonline.com"
echo "  Password:  admin123\n"

echo -e "${YELLOW}📝 View Logs:${NC}"
echo "  All:        docker-compose logs -f"
echo "  Backend:    docker-compose logs -f backend"
echo "  Database:   docker-compose logs -f postgres\n"

echo -e "${YELLOW}🛑 Stop Services:${NC}"
echo "  docker-compose stop\n"

echo -e "${GREEN}✨ Setup complete! Happy coding! 🚀${NC}"
