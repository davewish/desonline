# Development Dockerfile with hot-reload support
FROM node:18-slim

WORKDIR /app

# Install required system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for development)
RUN npm ci

# Copy Prisma schema
COPY ./prisma ./prisma

# Generate Prisma client
RUN npm run prisma:generate

# Copy application code
COPY ./src ./src

# Copy environment file
COPY .env.docker ./.env

# Create uploads directory
RUN mkdir -p uploads/videos uploads/pdfs uploads/thumbnails

# Expose port
EXPOSE 5000

# Run with npm dev (which uses node --watch for hot reload)
CMD ["npm", "run", "dev"]
