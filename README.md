# DesOnline - E-Learning Platform MVP

A full-stack online learning platform built with modern web technologies.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Course Management**: Browse, search, and enroll in courses
- **Video Lessons**: Watch HD video lessons with HTML5 player
- **PDF Materials**: Download lesson materials
- **Admin Dashboard**: Create courses, upload videos, and manage content
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-Based Access**: Different features for students and instructors

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer

### Database
- PostgreSQL with Prisma Schema

## 📦 Project Structure

```
desOline/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML entry point
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind configuration
│
└── backend/                 # Express backend API
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── routes/          # API routes
    │   ├── middlewares/     # Custom middlewares
    │   ├── services/        # Business logic
    │   ├── utils/           # Utility functions
    │   ├── prisma/          # Prisma schema
    │   ├── index.js         # Server entry point
    │   └── seed.js          # Database seeding
    ├── uploads/             # Static file uploads
    │   ├── videos/
    │   ├── pdfs/
    │   └── thumbnails/
    ├── package.json         # Dependencies
    ├── .env                 # Environment variables
    └── .env.example         # Environment template
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd /Users/dave/Documents/desOline
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Database

1. Create a PostgreSQL database:
```bash
createdb desonline
```

2. Update `.env` file with your database URL:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/desonline
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PORT=5000
```

#### Generate Prisma Client
```bash
npm run prisma:generate
```

#### Run Database Migrations
```bash
npm run prisma:migrate
```

#### Seed the Database (Optional)
```bash
npm run seed
```

This will create:
- Admin user: `admin@desonline.com` / `admin123`
- Demo user: `user@desonline.com` / `user123`
- 3 sample courses with lessons

#### Start Backend Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create or update `.env.local`:
```bash
VITE_API_URL=http://localhost:5000/api
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses
```
GET /api/courses?search=&page=1&limit=10
```

#### Get Course by ID
```
GET /api/courses/:id
```

#### Create Course (Admin)
```
POST /api/courses
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Course Title",
  "description": "Course Description",
  "thumbnail": <file>
}
```

#### Update Course (Admin)
```
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "description": "Updated Description",
  "thumbnail": <file> (optional)
}
```

#### Delete Course (Admin)
```
DELETE /api/courses/:id
Authorization: Bearer <token>
```

### Lesson Endpoints

#### Get Lesson by ID
```
GET /api/lessons/:id
```

#### Create Lesson (Admin)
```
POST /api/lessons
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "courseId": 1,
  "title": "Lesson Title",
  "position": 1,
  "video": <file>,
  "pdf": <file> (optional)
}
```

#### Update Lesson (Admin)
```
PUT /api/lessons/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "position": 1,
  "video": <file> (optional),
  "pdf": <file> (optional)
}
```

#### Delete Lesson (Admin)
```
DELETE /api/lessons/:id
Authorization: Bearer <token>
```

### Enrollment Endpoints

#### Get User Enrollments
```
GET /api/enrollments
Authorization: Bearer <token>
```

#### Enroll in Course
```
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1
}
```

#### Unenroll from Course
```
DELETE /api/enrollments/:enrollmentId
Authorization: Bearer <token>
```

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Token is stored in localStorage on the frontend
4. Token is sent in `Authorization: Bearer <token>` header for protected requests
5. Token expires after 24 hours

### User Roles

- **USER**: Regular student who can view courses and lessons
- **ADMIN**: Instructor who can create courses and lessons

## 📁 File Upload

### Upload Limits
- **Videos**: 50MB
- **PDFs**: 10MB
- **Thumbnails**: 5MB

### Supported Formats
- **Videos**: MP4, WebM, AVI
- **PDFs**: PDF only
- **Thumbnails**: JPEG, JPG, PNG, GIF

Files are stored locally in the `uploads/` directory and served via the `/uploads` endpoint.

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

3. Set environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-api-domain.com/api
```

### Backend Deployment (Render or Railway)

#### Option 1: Render

1. Push code to GitHub
2. Sign up at https://render.com
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
NODE_ENV=production
```
6. Deploy

#### Option 2: Railway

1. Push code to GitHub
2. Sign up at https://railway.app
3. Create a new project
4. Connect your GitHub repository
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

### Database Setup for Production

For production, use a managed PostgreSQL service:
- Render PostgreSQL
- Railway PostgreSQL
- Amazon RDS
- DigitalOcean Database

Update `DATABASE_URL` in production environment variables.

## 🧪 Testing Credentials

**Admin Account:**
- Email: `admin@desonline.com`
- Password: `admin123`

**User Account:**
- Email: `user@desonline.com`
- Password: `user123`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (3000)
lsof -i :3000
kill -9 <PID>

# Backend (5000)
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# Check database URL format
# Format: postgresql://username:password@localhost:5432/desonline
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Token expires after 24 hours, user needs to login again
- Check Authorization header format: `Bearer <token>`

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/desonline
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
MAX_FILE_SIZE=52428800
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 💡 Future Enhancements

- [ ] User dashboard with progress tracking
- [ ] Quiz and assessment system
- [ ] Certificate generation
- [ ] Video streaming optimization
- [ ] Payment integration
- [ ] Email notifications
- [ ] Discussion forums
- [ ] Real-time notifications with WebSockets

## 🆘 Support

For issues and questions:
1. Check GitHub issues
2. Read documentation
3. Contact support at support@desonline.com

---

**Happy Learning! 🚀**
