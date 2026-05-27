# Backend API Quick Reference

## Base URL
`http://localhost:5000/api`

## Authentication Endpoints

### Register User
- **Method**: POST
- **URL**: `/auth/register`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with id, name, email, role

### Login
- **Method**: POST
- **URL**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: { token, user }
- **Token Format**: `Authorization: Bearer <token>`

### Get Profile
- **Method**: GET
- **URL**: `/auth/profile`
- **Auth**: Required
- **Response**: Current user profile

---

## Course Endpoints

### Get All Courses (Public)
- **Method**: GET
- **URL**: `/courses?page=1&limit=10&search=query`
- **Auth**: Not required
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search in title/description
- **Response**: Array of courses with pagination

### Get Course Details (Public)
- **Method**: GET
- **URL**: `/courses/:id`
- **Auth**: Not required
- **Response**: Course object with lessons and enrollments

### Create Course (Admin Only)
- **Method**: POST
- **URL**: `/courses`
- **Auth**: Required (ADMIN)
- **Body**: FormData
  - `title`: string
  - `description`: string
  - `thumbnail`: file (optional)
- **Response**: Created course object

### Update Course (Admin Only)
- **Method**: PUT
- **URL**: `/courses/:id`
- **Auth**: Required (ADMIN)
- **Body**: FormData (same as create)
- **Response**: Updated course object

### Delete Course (Admin Only)
- **Method**: DELETE
- **URL**: `/courses/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

---

## Lesson Endpoints

### Get Lesson (Public)
- **Method**: GET
- **URL**: `/lessons/:id`
- **Auth**: Not required
- **Response**: Lesson object with course info

### Create Lesson (Admin Only)
- **Method**: POST
- **URL**: `/lessons`
- **Auth**: Required (ADMIN)
- **Body**: FormData
  - `courseId`: integer (required)
  - `title`: string (required)
  - `position`: integer (optional, default: 0)
  - `video`: file (optional)
  - `pdf`: file (optional)
- **Response**: Created lesson object

### Update Lesson (Admin Only)
- **Method**: PUT
- **URL**: `/lessons/:id`
- **Auth**: Required (ADMIN)
- **Body**: FormData (same as create, courseId not needed)
- **Response**: Updated lesson object

### Delete Lesson (Admin Only)
- **Method**: DELETE
- **URL**: `/lessons/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

---

## Enrollment Endpoints

### Get User Enrollments
- **Method**: GET
- **URL**: `/enrollments`
- **Auth**: Required
- **Response**: Array of enrollments with course details

### Enroll in Course
- **Method**: POST
- **URL**: `/enrollments`
- **Auth**: Required
- **Body**:
  ```json
  {
    "courseId": integer
  }
  ```
- **Response**: Enrollment object with course

### Unenroll from Course
- **Method**: DELETE
- **URL**: `/enrollments/:enrollmentId`
- **Auth**: Required
- **Response**: Success message

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## File Uploads

### Allowed File Types
- **Videos**: mp4, webm, avi (max 50MB)
- **PDFs**: pdf (max 10MB)
- **Thumbnails**: jpeg, jpg, png, gif (max 5MB)

### Upload Response
Files are stored and accessible at:
- `/uploads/videos/<filename>`
- `/uploads/pdfs/<filename>`
- `/uploads/thumbnails/<filename>`

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@desonline.com","password":"admin123"}'
```

### Get Courses
```bash
curl http://localhost:5000/api/courses?page=1&limit=10
```

### Create Course (as Admin)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=New Course" \
  -F "description=Description" \
  -F "thumbnail=@image.jpg"
```

### Enroll
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"courseId":1}'
```

---

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Client stores token in localStorage
4. Client includes token in `Authorization` header for protected routes
5. Backend verifies token on protected endpoints
6. If token invalid/expired, client gets 401 and should redirect to login

---

## Database Schema Summary

**Users**: id, email, name, password, role, createdAt, updatedAt
**Courses**: id, title, description, thumbnail, creatorId, createdAt, updatedAt
**Lessons**: id, title, courseId, position, videoUrl, pdfUrl, createdAt, updatedAt
**Enrollments**: id, userId, courseId, progress, createdAt, updatedAt (unique userId+courseId)

---

## Test Data

After running `npm run seed`:

- Admin: admin@desonline.com / admin123
- User: user@desonline.com / user123
- 3 sample courses with lessons
- Sample enrollment for user
