# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                        │  │
│  │  - Homepage                                               │  │
│  │  - Authentication (Register/Login)                       │  │
│  │  - Courses Browsing & Search                             │  │
│  │  - Course Details & Enrollment                           │  │
│  │  - Lesson Viewer with Video Player                       │  │
│  │  - Admin Dashboard (Create/Update Content)               │  │
│  │  - Responsive Design (Mobile/Tablet/Desktop)             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓ HTTPS                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK LAYER                              │
│            Axios HTTP Client with Interceptors                  │
│    - Automatic Token Injection                                  │
│    - Error Handling & Auth Redirect                             │
│    - Request/Response Transformation                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ REST API
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Server)                            │
│            Express.js API with Authentication                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Authentication Module                         │   │
│  │  - User Registration (Password Hashing)                │   │
│  │  - User Login (JWT Generation)                         │   │
│  │  - Token Verification Middleware                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            API Route Handlers                           │   │
│  │  - Courses CRUD                                        │   │
│  │  - Lessons CRUD                                        │   │
│  │  - Enrollments Management                              │   │
│  │  - Admin Functions (Authorization)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          File Upload Handler (Multer)                  │   │
│  │  - Video Upload (uploads/videos)                       │   │
│  │  - PDF Upload (uploads/pdfs)                           │   │
│  │  - Thumbnail Upload (uploads/thumbnails)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Business Logic Layer                         │   │
│  │  - Course Service                                      │   │
│  │  - Lesson Service                                      │   │
│  │  - User Service                                        │   │
│  │  - Enrollment Service                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
└─────────────────────────────────────────────────────────────────┘
                 ↓ Prisma ORM + SQL Queries
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                               │
│                  PostgreSQL Database                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Users      │  │   Courses    │  │   Lessons    │           │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤           │
│  │ id           │  │ id           │  │ id           │           │
│  │ name         │  │ title        │  │ courseId (FK)│           │
│  │ email        │  │ description  │  │ title        │           │
│  │ password     │  │ thumbnail    │  │ videoUrl     │           │
│  │ role         │  │ creatorId(FK)│  │ pdfUrl       │           │
│  │ createdAt    │  │ createdAt    │  │ position     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  ┌──────────────┐                                               │
│  │ Enrollments  │                                               │
│  ├──────────────┤                                               │
│  │ id           │                                               │
│  │ userId (FK)  │─────────► Many-to-Many Relationship          │
│  │ courseId(FK) │                                               │
│  │ createdAt    │                                               │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
User Input Form
     ↓
Form Validation (Frontend)
     ↓
POST /api/auth/register
     ↓
Backend Validation
     ↓
Password Hashing (bcrypt)
     ↓
Save to Database (Prisma)
     ↓
Return Success Message
     ↓
Redirect to Login
```

### Login & JWT Flow
```
User Email & Password
     ↓
POST /api/auth/login
     ↓
Find User in Database
     ↓
Verify Password (bcrypt)
     ↓
Generate JWT Token (24h expiry)
     ↓
Send Token to Frontend
     ↓
Store in localStorage
     ↓
Redirect to Courses
```

### Course Creation Flow (Admin)
```
Admin fills Course Form
     ├─ Title
     ├─ Description
     └─ Thumbnail Image
            ↓
Frontend Validation
            ↓
POST /api/courses (with multipart/form-data)
 + Authorization Header (JWT Token)
            ↓
Backend Auth Middleware
 - Extract & Verify Token
 - Check if Admin Role
            ↓
File Upload Middleware (Multer)
 - Validate File
 - Save to uploads/thumbnails/
            ↓
Course Service
 - Save to Database
 - Link to Admin User
            ↓
Return Course Data
            ↓
Frontend: Show Success Message
```

### Lesson Viewer Flow
```
User click on Lesson
     ↓
GET /api/lessons/:id
     ↓
Database Query (Prisma)
     ↓
Check Authorization (User enrolled?)
     ↓
Return Lesson (video, PDF URLs)
     ↓
Frontend Renders Video Player
 - HTML5 Video Element
 - Display PDF Download Link
 - Show Lesson Navigation
     ↓
User Can:
 - Play Video
 - Download PDF
 - Go to Previous/Next Lesson
```

## Authentication & Authorization

### JWT Token Structure
```
Header    : {alg: "HS256", typ: "JWT"}
Payload   : {userId: 123, role: "ADMIN", iat: ..., exp: ...}
Signature : HMACSHA256(header.payload, JWT_SECRET)
```

### Request with Token
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Backend:
  ↓
Extract token from header
  ↓
Verify signature with JWT_SECRET
  ↓
Check expiry
  ↓
Extract userId & role
  ↓
Attach to req.user
  ↓
Proceed to route handler
```

### Role-Based Access Control
```
Admin Routes (require ADMIN role):
  ✓ POST /api/courses (create)
  ✓ PUT /api/courses/:id (update)
  ✓ DELETE /api/courses/:id (delete)
  ✓ POST /api/lessons (create)
  ✓ PUT /api/lessons/:id (update)
  ✓ DELETE /api/lessons/:id (delete)

User Routes (any authenticated user):
  ✓ GET /api/courses (browse)
  ✓ GET /api/enrollments (view enrollments)
  ✓ POST /api/enrollments (enroll)

Public Routes (no authentication):
  ✓ GET /api/courses (list and search)
  ✓ GET /api/courses/:id (view)
  ✓ GET /api/lessons/:id (view)
  ✓ POST /api/auth/register (register)
  ✓ POST /api/auth/login (login)
```

## File Upload Architecture

```
Frontend
  ↓
Multipart Form Data
  {
    "title": "Course Title",
    "description": "...",
    "thumbnail": <File Object>
  }
  ↓
POST /api/courses
  ↓
Multer Middleware
  ├─ File Validation
  │  - Check MIME type
  │  - Check file extension
  │  - Check file size (<5MB for images)
  │
  ├─ File Storage
  │  - Generate unique filename
  │  - Save to uploads/thumbnails/
  │  - Return filename
  │
  └─ Attach to req.file
      ↓
Backend Handler
  ├─ Create file path
  │  /uploads/thumbnails/thumbnail-123456.jpg
  │
  ├─ Save to Database
  │  thumbnail field = /uploads/thumbnails/thumbnail-123456.jpg
  │
  └─ Return to Frontend
      ↓
Express Static Middleware
  /uploads served at http://localhost:5000/uploads
  ↓
Frontend can access: http://localhost:5000/uploads/thumbnails/...
```

## Error Handling Flow

```
API Request
  ↓
Try to Process
  ├─ Validation Error
  │  → 400 Bad Request
  │  → Return validation log
  │
  ├─ Token Expired
  │  → 401 Unauthorized
  │  → Frontend clears token & redirects to login
  │
  ├─ Insufficient Permission
  │  → 403 Forbidden
  │  → Return permission error
  │
  ├─ Resource Not Found
  │  → 404 Not Found
  │  → Return not found error
  │
  └─ Server Error
     → 500 Internal Server Error
     → Log error
     → Return generic error message
  ↓
Error Response Sent to Frontend
  ↓
Frontend Displays Error Message (Toast/Alert)
```

## Scalability Considerations

### Current (MVP)
- Single Express server instance
- Local file storage
- Direct database queries
- No caching

### Future (Scale Up)
- Load balanced multiple instances
- CDN for file delivery (CloudFront, S3)
- Redis caching layer
- Database read replicas
- Message queue for video encoding
- Microservices architecture

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization
- Minification & compression

### Backend
- Database query optimization
- Indexes on foreign keys
- Connection pooling
- Response compression
- Caching common queries

### Database
- Indexed search queries
- Pagination to limit results
- Archive old enrollments
- Regular VACUUM cleanups

## Security Layers

```
Request
  ↓
HTTPS/TLS Encryption
  ↓
CORS Validation
  ↓
JWT Token Verification
  ↓
Role-Based Authorization
  ↓
Input Validation & Sanitization
  ↓
File Type Validation
  ↓
Query Parameterization (Prisma prevents SQL injection)
  ↓
Response with proper headers
```

---

This architecture provides a solid foundation for the e-learning platform with clear separation of concerns, scalability options, and security considerations.
