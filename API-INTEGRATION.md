# API Integration & Deployment Guide

## Backend API Summary

The backend has been fully set up with all necessary API endpoints, database schema, and middleware. Here's what has been implemented:

### ✅ Completed Backend Components

#### 1. **Database Schema** (`prisma/schema.prisma`)
- User model with role-based access (USER/ADMIN)
- Course model with creator relationship
- Lesson model with course relationships and file URLs
- Enrollment model with unique constraint on (userId, courseId)
- Automatic timestamps for audit trail

#### 2. **Authentication API** (`/api/auth`)
- User registration with email validation
- User login with password hashing (bcrypt)
- JWT token generation (24hr expiry)
- Profile retrieval with token validation

#### 3. **Course Management API** (`/api/courses`)
- Public course listing with pagination and search
- Course detail retrieval
- Admin-only course creation, update, delete
- Thumbnail upload handling

#### 4. **Lesson Management API** (`/api/lessons`)
- Lesson detail retrieval
- Admin-only lesson creation, update, delete
- Video and PDF file upload handling
- Lesson ordering by position

#### 5. **Enrollment Management API** (`/api/enrollments`)
- User enrollment listing with course details
- Enrollment creation with duplicate prevention
- Enrollment deletion (unenroll)

#### 6. **Middleware & Security**
- JWT authentication middleware
- Role-based access control (Admin/User)
- File upload validation (videos, PDFs, images)
- Global error handling
- CORS enabled for frontend

#### 7. **Database Tools**
- Prisma ORM for type-safe database access
- Seed script with sample data
- Database migrations ready to run

---

## Integration Checklist

### Frontend (`/frontend`)
- ✅ All page components created
- ✅ API service layer configured (`services/api.js`)
- ✅ Authentication context setup
- ✅ Protected routes implemented
- ✅ Role-based route protection (Admin)
- ✅ Navigation fixed to allow home page access

### Backend (`/backend`)
- ✅ Express server setup
- ✅ All route handlers configured
- ✅ Database schema with Prisma
- ✅ Authentication & authorization
- ✅ File upload middleware
- ✅ Error handling

---

## Running the Full Stack

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12 (or Docker)
- npm or yarn

### Step 1: Start PostgreSQL (if using Docker)

```bash
# From project root
docker-compose up -d

# Verify database is running
docker-compose ps
```

### Step 2: Setup & Run Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will be running at: `http://localhost:5000`

### Step 3: Setup & Run Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Frontend will be running at: `http://localhost:3000`

---

## API Request Examples

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@desonline.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@desonline.com",
      "role": "ADMIN"
    }
  }
}
```

### 3. Get All Courses

```bash
curl http://localhost:5000/api/courses?page=1&limit=10&search=react
```

### 4. Get User Enrollments

```bash
curl http://localhost:5000/api/enrollments \
  -H "Authorization: Bearer <token>"
```

### 5. Enroll in Course

```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "courseId": 1
  }'
```

### 6. Create Course (Admin Only)

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <admin_token>" \
  -F "title=New Course" \
  -F "description=Course description" \
  -F "thumbnail=@/path/to/image.jpg"
```

---

## Environment Configuration

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/desonline
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAX_FILE_SIZE=52428800
```

---

## Test Credentials

After seeding the database:

| Email | Password | Role |
|-------|----------|------|
| admin@desonline.com | admin123 | ADMIN |
| user@desonline.com | user123 | USER |

---

## File Upload Paths

All uploaded files are accessible via:

- **Videos**: `http://localhost:5000/uploads/videos/<filename>`
- **PDFs**: `http://localhost:5000/uploads/pdfs/<filename>`
- **Thumbnails**: `http://localhost:5000/uploads/thumbnails/<filename>`

---

## Frontend API Service Layer

The frontend API service (`src/services/api.js`) automatically handles:

- ✅ JWT token injection in Authorization header
- ✅ Token refresh on 401 unauthorized
- ✅ Consistent error handling
- ✅ FormData for multipart file uploads

**Usage in components:**
```javascript
import { authService, courseService, enrollmentService } from '../services/api'

// Login
const response = await authService.login({ email, password })

// Get courses
const courses = await courseService.getCourses({ page: 1, limit: 10 })

// Enroll in course
await enrollmentService.enrollCourse(courseId)
```

---

## Common Development Workflows

### Adding a New Course (as Admin)

1. Login as admin@desonline.com
2. Go to Admin Dashboard
3. Click "Manage Courses"
4. Fill in title, description, upload thumbnail
5. Submit form

Backend handles:
- ✅ Admin role verification
- ✅ File upload to `/uploads/thumbnails/`
- ✅ Database record creation
- ✅ Response with course data

### Enrolling in a Course (as User)

1. Login as user@desonline.com
2. Go to Courses page
3. Click "Enroll" on any course
4. Backend handles:
   - ✅ User identification from JWT token
   - ✅ Duplicate enrollment check
   - ✅ Database record creation
   - ✅ Confirmation response

### Viewing Lesson (as User)

1. Go to Dashboard > My Courses
2. Click on an enrolled course
3. Click "Continue" or select lesson
4. Backend retrieves:
   - ✅ Lesson details with video/PDF URLs
   - ✅ Course information
   - ✅ Ordered lesson list

---

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check `.env` has correct `VITE_API_URL`
- Check CORS errors in browser console

### Database migrations fail
```bash
# Reset Prisma state
rm -rf node_modules/.prisma

# Regenerate and remigrate
npm run prisma:generate
npm run prisma:migrate
```

### JWT token not working
- Token expires after 24 hours
- Verify token format in localStorage
- Check JWT_SECRET matches between login and API calls

### File uploads not working
- Ensure `/uploads` directories exist and have write permissions
- Check file size doesn't exceed limits (50MB videos, 10MB PDFs)
- Verify multipart/form-data content type in requests

---

## Next Phase: Production Deployment

When ready to deploy:

1. Update environment variables for production
2. Use PostgreSQL hosting (AWS RDS, Heroku, etc.)
3. Deploy backend to platform (Vercel, Railway, Render, AWS, etc.)
4. Update frontend `VITE_API_URL` to production backend URL
5. Deploy frontend to hosting (Vercel, Netlify, etc.)
6. Set up CORS for production domain
7. Update JWT_SECRET in production

---

## Summary

The backend API is complete with:
- ✅ Full CRUD operations for courses and lessons
- ✅ User authentication and role-based access
- ✅ Enrollment management
- ✅ File uploads (videos, PDFs, thumbnails)
- ✅ Error handling and validation
- ✅ Database schema with relationships
- ✅ Seed data for testing

The frontend is ready to connect and use all these APIs. You can start the full stack development immediately!
