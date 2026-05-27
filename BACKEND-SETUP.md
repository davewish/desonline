# Backend API Setup Guide

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   └── lessonController.js
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── lessonRoutes.js
│   ├── middlewares/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   ├── utils/                # Utility functions
│   │   ├── db.js             # Prisma client
│   │   └── jwt.js            # JWT functions
│   ├── seed.js               # Database seeding
│   └── index.js              # Express app entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── uploads/
│   ├── videos/
│   ├── pdfs/
│   └── thumbnails/
├── .env                      # Environment variables
├── .env.example              # Example environment variables
└── package.json
```

## Prerequisites

- Node.js >= 16
- PostgreSQL >= 12
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend directory (already provided):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/desonline
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAX_FILE_SIZE=52428800
```

Update the `DATABASE_URL` with your PostgreSQL connection string.

### 3. Setup Database

#### Option A: Using Docker (Recommended)

If you have Docker running, the database should be automatically created via docker-compose:

```bash
# From project root
docker-compose up -d
```

#### Option B: Manual PostgreSQL Setup

1. Install PostgreSQL locally
2. Create a new database:

```sql
CREATE DATABASE desonline;
```

3. Update `.env` with your database URL

### 4. Run Prisma Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate Prisma client
- Create all database tables
- Run migrations

### 5. Seed Database (Optional but Recommended)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- **Admin user**: admin@desonline.com / admin123
- **Demo user**: user@desonline.com / user123
- **3 sample courses** with lessons
- **Sample enrollment**

### 6. Start Development Server

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires token)

### Courses (`/api/courses`)

- `GET /api/courses` - Get all courses (public, paginated)
- `GET /api/courses/:id` - Get course details (public)
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Lessons (`/api/lessons`)

- `GET /api/lessons/:id` - Get lesson details (public)
- `POST /api/lessons` - Create lesson (admin only)
- `PUT /api/lessons/:id` - Update lesson (admin only)
- `DELETE /api/lessons/:id` - Delete lesson (admin only)

### Enrollments (`/api/enrollments`)

- `GET /api/enrollments` - Get user's enrollments (authenticated)
- `POST /api/enrollments` - Enroll in course (authenticated)
- `DELETE /api/enrollments/:enrollmentId` - Unenroll from course (authenticated)

## Database Schema

### Users Table
```
id: Integer (PK)
email: String (Unique)
name: String
password: String (hashed)
role: String (USER | ADMIN)
createdAt: DateTime
updatedAt: DateTime
```

### Courses Table
```
id: Integer (PK)
title: String
description: String
thumbnail: String (optional)
creatorId: Integer (FK to Users)
createdAt: DateTime
updatedAt: DateTime
```

### Lessons Table
```
id: Integer (PK)
title: String
courseId: Integer (FK to Courses)
position: Integer
videoUrl: String (optional)
pdfUrl: String (optional)
createdAt: DateTime
updatedAt: DateTime
```

### Enrollments Table
```
id: Integer (PK)
userId: Integer (FK to Users)
courseId: Integer (FK to Courses)
progress: Integer (default: 0)
createdAt: DateTime
updatedAt: DateTime
Unique: (userId, courseId)
```

## Authentication

All authenticated endpoints require a Bearer token:

```
Authorization: Bearer <token>
```

Token is obtained from login endpoint and expires in 24 hours.

## File Uploads

Uploaded files are stored in `/uploads` directory:
- **Videos**: `/uploads/videos/` (max 50MB)
- **PDFs**: `/uploads/pdfs/` (max 10MB)
- **Thumbnails**: `/uploads/thumbnails/` (max 5MB)

Files are served statically at: `http://localhost:5000/uploads/<type>/<filename>`

## Useful Commands

```bash
# Start dev server with auto-reload
npm run dev

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (visual database manager)
npm run prisma:studio

# Seed database
npm run seed
```

## Testing Credentials

After seeding:

**Admin Account:**
- Email: `admin@desonline.com`
- Password: `admin123`

**User Account:**
- Email: `user@desonline.com`
- Password: `user123`

## Error Handling

All endpoints return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Common Issues

### Database Connection Error

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

### Prisma Client Error

Run: `npm run prisma:generate`

### Port Already in Use

Change `PORT` in `.env` or kill process using that port

### Migration Error

```bash
# Reset database (careful - deletes all data)
npx prisma migrate reset

# Or regenerate and re-migrate
npm run prisma:generate
npm run prisma:migrate
```

## Next Steps

1. ✅ Database schema created
2. ✅ API endpoints implemented
3. ✅ Authentication setup
4. ✅ File upload handling
5. Ready for frontend integration
