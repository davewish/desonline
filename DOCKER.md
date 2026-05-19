# Docker Setup for DesOnline

This guide helps you run DesOnline with Docker.

## Prerequisites

- Docker ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose

## Setup

### 1. Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: desonline_user
      POSTGRES_PASSWORD: desonline_password
      POSTGRES_DB: desonline
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://desonline_user:desonline_password@postgres:5432/desonline
      JWT_SECRET: your_secret_key
      NODE_ENV: development
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    volumes:
      - ./backend/src:/app/src
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src

volumes:
  postgres_data:
```

### 2. Create Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

### 3. Create Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 4. Run with Docker Compose

```bash
docker-compose up
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

### 5. Initialize Database

```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run seed
```

## Useful Commands

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Rebuild images
docker-compose build --no-cache

# Run migrations
docker-compose exec backend npm run prisma:migrate

# Access database
docker-compose exec postgres psql -U desonline_user -d desonline
```

## Production Deployment

For production, use managed services:
- PostgreSQL: AWS RDS, Azure Database, or Railway
- Backend: Railway, Render, or AWS ECS
- Frontend: Vercel, Netlify, or AWS S3 + CloudFront
