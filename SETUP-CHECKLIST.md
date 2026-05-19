# Setup & Configuration Checklist

Use this checklist to track your setup progress.

## ✅ Prerequisites Check

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Git installed

## 📦 Backend Setup

### Installation
- [ ] Clone/download project
- [ ] Navigate to `backend` directory
- [ ] Run `npm install`
- [ ] Verify no errors

### Database Configuration
- [ ] Create PostgreSQL database: `createdb desonline`
- [ ] Update `.env` file with DATABASE_URL
- [ ] Verify .env file exists
- [ ] Check DATABASE_URL format is correct

### Prisma Setup
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:migrate`
- [ ] Check migration completed successfully
- [ ] (Optional) Run `npm run seed` for sample data

### Backend Server
- [ ] Run `npm run dev`
- [ ] Check server starts without errors
- [ ] Verify message: "✅ Server is running"
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Note: Server runs on http://localhost:5000

## 🎨 Frontend Setup

### Installation
- [ ] Open new terminal
- [ ] Navigate to `frontend` directory
- [ ] Run `npm install`
- [ ] Verify no errors

### Environment Configuration
- [ ] Check `.env.local` file exists
- [ ] Verify `VITE_API_URL=http://localhost:5000/api`
- [ ] Update if needed

### Start Development Server
- [ ] Run `npm run dev`
- [ ] Check build completes
- [ ] Verify message: "Local: http://localhost:3000"
- [ ] Frontend is ready to access

## 🌐 Access the Platform

- [ ] Open browser
- [ ] Go to http://localhost:3000
- [ ] Verify home page loads
- [ ] Check navbar appears

## 🔐 Test Authentication

### Register New User
- [ ] Click "Register" or go to /register
- [ ] Fill form with test data
- [ ] Verify email not already registered
- [ ] Click "Create Account"
- [ ] Check success message
- [ ] Verify redirected to login

### Login
- [ ] Go to /login
- [ ] Enter registered email
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Verify token stored in localStorage
- [ ] Verify redirected to /courses

### Test Seeded Credentials (if available)
- [ ] Login as admin@desonline.com / admin123
- [ ] Verify Admin Dashboard accessible
- [ ] Logout
- [ ] Login as user@desonline.com / user123
- [ ] Verify regular user access

## 📚 Test Core Features

### Browse Courses
- [ ] Click "Browse Courses" or go to /courses
- [ ] Verify courses display
- [ ] Test search functionality
- [ ] Test pagination

### If No Courses Exist
- [ ] Login as admin
- [ ] Go to Admin Dashboard
- [ ] Create a test course
- [ ] Fill title, description
- [ ] (Optional) Upload thumbnail
- [ ] Click "Create Course"
- [ ] Verify success message

### If Course Exists
- [ ] Click on a course
- [ ] Verify course details page loads
- [ ] Click "Enroll Now"
- [ ] Verify enrollment successful
- [ ] Note: Course should move to "Enrolled"

### View Lessons
- [ ] Click on course again
- [ ] Scroll to "Course Curriculum"
- [ ] Verify lesson list shows
- [ ] Click on first lesson
- [ ] Verify lesson page loads

### Lesson Player
- [ ] Verify video player loads
- [ ] Check "Download PDF Materials" button
- [ ] Test next/previous navigation
- [ ] Test lesson list sidebar

## 👨‍💼 Admin Features (if admin user exists)

### Access Admin Dashboard
- [ ] Login as admin
- [ ] Click "Admin Dashboard"
- [ ] Verify admin dashboard loads
- [ ] Check two tabs: "Manage Courses" and "Manage Lessons"

### Create Course
- [ ] Click "Create Course" button
- [ ] Fill course form:
  - [ ] Title: "Test Course"
  - [ ] Description: "Test Description"
  - [ ] (Optional) Upload thumbnail
- [ ] Click "Create Course"
- [ ] Verify success message
- [ ] Refresh courses page
- [ ] Verify course appears

### Create Lesson
- [ ] Go back to Admin Dashboard
- [ ] Click "Manage Lessons" tab
- [ ] Click "Create Lesson" button
- [ ] Fill lesson form:
  - [ ] Course ID: (from created course)
  - [ ] Title: "Lesson 1"
  - [ ] Position: 1
  - [ ] (Required) Upload video file
  - [ ] (Optional) Upload PDF
- [ ] Click "Create Lesson"
- [ ] Verify success message

## 🐛 Troubleshooting

### Backend Won't Start
- [ ] Check Node.js version: `node --version` (should be 16+)
- [ ] Check npm install completed: `ls node_modules`
- [ ] Check .env file exists
- [ ] Check DATABASE_URL is correct
- [ ] Check PostgreSQL is running: `pg_isready`
- [ ] Try: `npm install` again
- [ ] Delete `node_modules` and run `npm install`

### Frontend Won't Start
- [ ] Check Node.js version
- [ ] Check npm install completed
- [ ] Check .env.local exists
- [ ] Check VITE_API_URL is set
- [ ] Try: `npm install` again
- [ ] Delete `node_modules` and run `npm install`

### Database Connection Error
- [ ] Verify DATABASE_URL format
- [ ] Format: `postgresql://user:password@localhost:5432/desonline`
- [ ] Check PostgreSQL is running
- [ ] Check database exists: `psql -l | grep desonline`
- [ ] Check credentials are correct

### Port Already in Use
- [ ] Port 3000 (frontend): `lsof -i :3000` then `kill -9 <PID>`
- [ ] Port 5000 (backend): `lsof -i :5000` then `kill -9 <PID>`
- [ ] Restart servers

### Token Issues
- [ ] Verify token in localStorage (DevTools → Application → Storage)
- [ ] Check token format starts with "eyJ"
- [ ] Try logging out and logging back in
- [ ] Check browser console for errors

### File Upload Failures
- [ ] Check file size doesn't exceed limits
- [ ] Check file format is supported
- [ ] Check uploads directory exists
- [ ] Check directory permissions

## 📊 Database Verification

### Access Prisma Studio
- [ ] In backend directory
- [ ] Run `npm run prisma:studio`
- [ ] Browser opens to http://localhost:5555
- [ ] View all tables and data
- [ ] Verify data integrity

### Direct Database Access
- [ ] Open terminal
- [ ] Run `psql -U postgres -d desonline`
- [ ] View tables: `\dt`
- [ ] View users: `SELECT * FROM "User";`
- [ ] View courses: `SELECT * FROM "Course";`
- [ ] Exit: `\q`

## 🔍 API Testing

### Test with cURL

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```
- [ ] Verify success response

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```
- [ ] Verify token in response

#### Get Courses
```bash
curl http://localhost:5000/api/courses
```
- [ ] Verify courses list returns

#### Protected Endpoint
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/profile
```
- [ ] Verify user profile returns

## 📁 File Structure Verification

- [ ] Backend src/controllers/ has 4 files
- [ ] Backend src/routes/ has 4 files
- [ ] Frontend src/pages/ has 7 files
- [ ] Frontend src/components/ has 3 files
- [ ] Prisma schema exists
- [ ] Environment files exist

## 🚀 Build for Production

### Frontend Build
- [ ] Navigate to `frontend`
- [ ] Run `npm run build`
- [ ] Check `dist` folder created
- [ ] Verify no build errors

### Backend Preparation
- [ ] Update .env for production
- [ ] Test with production database
- [ ] Verify all migrations run cleanly

## 🌐 Local Network Testing (Optional)

- [ ] Get your machine IP: `ipconfig getifaddrs | grep inet`
- [ ] Update VITE_API_URL to use IP address
- [ ] Test from another machine on same network
- [ ] Verify responsive design on mobile device

## 📝 Notes & Customization

- [ ] Update site title in index.html
- [ ] Update Tailwind colors in tailwind.config.js
- [ ] Add your logo to navbar
- [ ] Customize course categories (if adding)
- [ ] Configure email notifications (future feature)

## 📚 Documentation Review

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Read ARCHITECTURE.md
- [ ] Read API-CONFIG.md
- [ ] Understand project structure

## ✨ Final Verification

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can browse courses
- [ ] Can see lessons (if admin created courses)
- [ ] Can enroll in courses (as student)
- [ ] Admin dashboard works (as admin)
- [ ] No console errors in browser
- [ ] Database has sample data (if seeded)

## 🎉 You're All Set!

When all checkboxes above are checked, your DesOnline platform is ready!

### Next Steps:
1. Start building your courses
2. Invite other users
3. Gather feedback
4. Plan deployment
5. Scale with more features

---

**Date Started**: _______________
**Date Completed**: _______________
**Notes**: _______________________________________________

---

For detailed instructions, refer to:
- QUICKSTART.md for quick setup
- README.md for full documentation
- DEPLOYMENT.md for going live
