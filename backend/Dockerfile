# Development Dockerfile with hot-reload support
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for development)
RUN npm ci

# Copy Prisma schema
COPY ./src/prisma ./src/prisma

# Generate Prisma client
RUN npm run prisma:generate

# Copy application code
COPY ./src ./src
COPY ./.env.docker ./.env

# Create uploads directory
RUN mkdir -p uploads/videos uploads/pdfs uploads/thumbnails

# Expose port
EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Run with npm dev (which uses node --watch for hot reload)
CMD ["npm", "run", "dev"]
