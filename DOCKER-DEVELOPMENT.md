# DesOnline - Local Development with Docker

## 🐳 Docker Setup for Local Development

This guide helps you run DesOnline locally using Docker for PostgreSQL and the backend API.

---

## Prerequisites

Make sure you have installed:
- ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker & Docker Compose)

Check versions:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Docker Services

```bash
# Navigate to project root
cd /Users/dave/Documents/desOline

# Start PostgreSQL and Backend API in Docker
docker-compose up -d

# Check status
docker-compose ps
```

Expected output:
```
NAME                  STATUS              PORTS
desonline-db          Up (healthy)        0.0.0.0:5432->5432/tcp
desonline-api         Up                  0.0.0.0:5000->5000/tcp
desonline-pgadmin     Up                  0.0.0.0:5050->80/tcp
```

### Step 2: Verify Backend is Running

```bash
# Check backend logs (shows database migration & seeding)
docker-compose logs backend

# Health check endpoint
curl http://localhost:5000/health
```

### Step 3: Frontend Development (in a NEW terminal)

```bash
cd /Users/dave/Documents/desOline/frontend
npm install    # First time only
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## 📍 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React app |
| **Backend API** | http://localhost:5000 | Express server |
| **pgAdmin** | http://localhost:5050 | Database management |
| **Database** | localhost:5432 | PostgreSQL (for external tools) |

---

## 🔐 Test Credentials

Use these to login:

```
Admin Account:
- Email: admin@desonline.com
- Password: admin123

User Account:
- Email: user@desonline.com
- Password: user123
```

---

## 📊 Database Management with pgAdmin

1. Open http://localhost:5050
2. Login with:
   - Email: `admin@desonline.com`
   - Password: `admin123`
3. Add PostgreSQL server:
   - Hostname: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres123`

---

## 🔄 Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f pgadmin

# Last 100 lines
docker-compose logs --tail=100
```

### Stop Services

```bash
# Stop all services (keeps data)
docker-compose stop

# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove everything including volumes (⚠️ deletes database)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### View Database

```bash
# Shell into PostgreSQL container
docker-compose exec postgres psql -U postgres -d desonline

# Useful psql commands:
# \dt - list tables
# \d tablename - describe table
# SELECT * FROM "User"; - query users
# \q - quit
```

### Rebuild Backend Image

If you change Dockerfile or package.json:

```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

## 🔧 Development Workflow

### Adding New Backend Dependencies

```bash
# Stop backend
docker-compose stop backend

# Add package locally
cd backend
npm install package-name

# Rebuild and restart
docker-compose up -d --build backend
```

### Making Backend Changes

Your backend code changes update **automatically** because:
- `/backend/src` is mounted as a volume
- Node --watch detects file changes
- Server restarts automatically

No rebuild needed!

### Database Schema Changes

```bash
# Create migration (runs inside container)
docker-compose exec backend npm run prisma:migrate

# View/manage database
docker-compose exec postgres psql -U postgres -d desonline
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5432
lsof -ti:5432 | xargs kill -9

# Kill process on port 5050
lsof -ti:5050 | xargs kill -9
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - "Port 5000 in use" → Kill process above
# - "Database connection error" → Wait for postgres (check with: docker-compose ps)
# - "Module not found" → docker-compose exec backend npm install
```

### Database Connection Issues

```bash
# Check if postgres is healthy
docker-compose ps postgres

# Restart postgres
docker-compose restart postgres

# Check database exists
docker-compose exec postgres psql -U postgres -l
```

### Clear Everything & Start Fresh

```bash
# Remove containers, volumes, and networks
docker-compose down -v

# Remove images
docker rmi desonline-backend postgres:15-alpine dpage/pgadmin4

# Start fresh
docker-compose up -d
```

---

## 📁 Volume Mounts Explained

```yaml
volumes:
  - ./backend/src:/app/src          # Code changes sync in real-time
  - ./backend/uploads:/app/uploads  # Uploaded files persist
  - /app/node_modules               # Use container's node_modules (faster)
```

---

## 🌍 Frontend Configuration

Make sure frontend .env.local has:

```env
VITE_API_URL=http://localhost:5000
```

This allows frontend to call your Docker backend API.

---

## 📝 Environment Variables

The `.env.docker` file contains:

```env
# Database
DATABASE_NAME=desonline
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123

# Backend
NODE_ENV=development
JWT_SECRET=dev-secret-key-12345
PORT=5000

# File Upload Limits (bytes)
VIDEO_UPLOAD_LIMIT=52428800    # 50MB
PDF_UPLOAD_LIMIT=10485760      # 10MB
THUMBNAIL_UPLOAD_LIMIT=5242880 # 5MB
```

To change these, edit `.env.docker` and run:
```bash
docker-compose down
docker-compose up -d
```

---

## 🎯 Next Steps

1. ✅ [Start Docker services](#-quick-start-3-steps) (Step 1)
2. ✅ [Start frontend locally](#step-3-frontend-development-in-a-new-terminal) (Step 3)
3. ✅ [Login with test credentials](#-test-credentials)
4. ✅ [Create a course from Admin Dashboard](#common-commands)
5. ✅ [Upload videos and PDFs](#database-management-with-pgadmin)

---

## 📚 Additional Resources

- [Docker Desktop Getting Started](https://docs.docker.com/get-started/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin 4 Documentation](https://www.pgadmin.org/docs/)

---

## ✨ Pro Tips

💡 **Rebuild only when needed:**
```bash
# Usually: just restart (faster)
docker-compose restart backend

# Only rebuild if: you changed Dockerfile or package.json
docker-compose up -d --build backend
```

💡 **Monitor live:**
```bash
# In one terminal, watch logs:
docker-compose logs -f backend postgres

# In another terminal, use your app normally
```

💡 **Database backup:**
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres desonline > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres desonline < backup.sql
```

---

## 🎓 Learn More

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For full API documentation, see [README.md](./README.md)

---

**Happy coding! 🚀**
