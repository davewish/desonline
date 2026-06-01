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

# Create uploads directory
RUN mkdir -p uploads/videos uploads/pdfs uploads/thumbnails

# Expose port
EXPOSE 5000

# Create a startup script that runs migrations and then starts the app
RUN echo '#!/bin/sh\nset -e\necho "🔄 Syncing Prisma schema..."\nnpx prisma db push --skip-generate --accept-data-loss\necho "✅ Schema synced!"\necho "🌱 Starting dev server..."\nnpm run dev' > /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Run with entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
