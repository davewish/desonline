# Quick Start Guide

## 🚀 Start Here

This guide will help you get the DesOnline e-learning platform up and running in minutes.

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download))
- npm (comes with Node.js)

### Step 1: Database Setup (5 minutes)

**macOS/Linux:**
```bash
# Install PostgreSQL if not already installed
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb desonline
```

**Windows:**
- Download and install from [postgresql.org](https://www.postgresql.org/download/windows)
- During installation, remember the password for `postgres` user

### Step 2: Backend Setup (5 minutes)

```bash
cd /Users/dave/Documents/desOline/backend

# Install dependencies
npm install

# Update .env file with your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/desonline

# Setup Prisma
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed with sample data
npm run seed

# Start server
npm run dev
```

**Expected output:**
```
✅ Server is running on http://localhost:5000
📚 E-learning platform backend started
```

### Step 3: Frontend Setup (5 minutes)

**In a new terminal:**

```bash
cd /Users/dave/Documents/desOline/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

### Step 4: Access the Platform

1. **Homepage**: http://localhost:3000
2. **Login**: Click "Sign In" or go to http://localhost:3000/login

### Test Accounts (if seeded)

**Admin Account:**
- Email: `admin@desonline.com`
- Password: `admin123`

**User Account:**
- Email: `user@desonline.com`
- Password: `user123`

## 🎯 What You Can Do

### As a Student:
- ✅ Register and login
- ✅ Browse all available courses
- ✅ Enroll in courses
- ✅ Watch video lessons
- ✅ Download PDF materials

### As an Admin:
- ✅ Create new courses
- ✅ Upload course thumbnails
- ✅ Create lessons
- ✅ Upload videos
- ✅ Upload PDF materials

## 🛠️ Common Tasks

### Reset Database
```bash
cd backend
npm run prisma:migrate reset
npm run seed
```

### View Database with Prisma Studio
```bash
cd backend
npm run prisma:studio
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Output in: frontend/dist/
```

### Stop Servers
- Backend: Press `Ctrl+C` in backend terminal
- Frontend: Press `Ctrl+C` in frontend terminal

## 🔍 File Structure Overview

**Frontend** - User Interface
- `/frontend/src/pages/` - Page components
- `/frontend/src/components/` - Reusable components
- `/frontend/src/services/` - API calls

**Backend** - API Server
- `/backend/src/controllers/` - Request handlers
- `/backend/src/routes/` - API routes
- `/backend/src/prisma/` - Database schema

**Database** - Data Storage
- PostgreSQL running on localhost:5432

## 🆘 Common Issues

### "Port 3000 already in use"
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### "Database connection error"
```bash
# Verify PostgreSQL is running
pg_isready

# Check DATABASE_URL in .env is correct
# Format should be: postgresql://user:password@localhost:5432/desonline
```

### "npm ERR! code ENOENT, syscall open"
```bash
# Same directory as package.json
cd /Users/dave/Documents/desOline/backend
npm install
```

## 📚 Next Steps

1. **Create a Course** (as Admin)
   - Go to Admin Dashboard
   - Click "Create Course"
   - Fill in title and description
   - Upload a thumbnail image

2. **Create a Lesson** (as Admin)
   - Go to Admin Dashboard
   - Select a course
   - Click "Create Lesson"
   - Upload a video and PDF

3. **Enroll in Course** (as Student)
   - Go to Courses page
   - Click on a course
   - Click "Enroll Now"
   - Start watching lessons!

## 📖 Documentation

- Full documentation: See `README.md` in the main folder
- API endpoints: Check `README.md` for full API docs
- Database schema: View in `backend/src/prisma/schema.prisma`

## 🚀 Deployment

When ready to go live:
- **Frontend**: Deploy to Vercel (recommended)
- **Backend**: Deploy to Render or Railway
- **Database**: Use managed PostgreSQL service

See `README.md` for detailed deployment instructions.

---

**Everything is set! Start creating amazing courses! 🎓**
