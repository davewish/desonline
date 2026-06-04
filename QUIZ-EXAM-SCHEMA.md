# Quiz & Exam System - Database Schema

## Overview
This document outlines the database schema needed for the Quiz & Exam system in DesOnline.

## Tables

### 1. `Quiz` Table
Lesson-level quizzes that appear after completing a lesson.

```prisma
model Quiz {
  id            String      @id @default(cuid())
  title         String
  description   String?
  lessonId      String
  lesson        Lesson      @relation(fields: [lessonId], references: [id])
  questions     Question[]
  userQuizzes   UserQuiz[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([lessonId])
}
```

### 2. `Exam` Table
Course-level final exams available after completing all lessons.

```prisma
model Exam {
  id            String      @id @default(cuid())
  title         String
  description   String?
  courseId      String
  course        Course      @relation(fields: [courseId], references: [id])
  passingScore  Int         @default(70)
  questions     Question[]
  userExams     UserExam[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([courseId])
}
```

### 3. `Question` Table
Questions belonging to either a Quiz or Exam.

```prisma
model Question {
  id            String      @id @default(cuid())
  text          String
  options       String[]    // Array of answer options
  correctAnswer Int         // Index of correct option (0-based)
  quizId        String?
  quiz          Quiz?       @relation(fields: [quizId], references: [id], onDelete: Cascade)
  examId        String?
  exam          Exam?       @relation(fields: [examId], references: [id], onDelete: Cascade)
  order         Int         // Question order in quiz/exam
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([quizId])
  @@index([examId])
}
```

### 4. `UserQuiz` Table
Tracks user quiz attempts and scores.

```prisma
model UserQuiz {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizId        String
  quiz          Quiz        @relation(fields: [quizId], references: [id], onDelete: Cascade)
  score         Int         // Percentage (0-100)
  answers       Json        // { "0": 2, "1": 1, ... } (question index: selected answer index)
  completed     Boolean     @default(true)
  startedAt     DateTime    @default(now())
  completedAt   DateTime    @default(now())
  attempts      Int         @default(1)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@unique([userId, quizId])
  @@index([userId])
  @@index([quizId])
}
```

### 5. `UserExam` Table
Tracks user exam attempts, scores, and certificates.

```prisma
model UserExam {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  examId          String
  exam            Exam        @relation(fields: [examId], references: [id], onDelete: Cascade)
  score           Int         // Percentage (0-100)
  answers         Json        // { "0": 2, "1": 1, ... } (question index: selected answer index)
  passed          Boolean     @default(false)
  certificateUrl  String?     // Path to generated certificate PDF
  completed       Boolean     @default(true)
  startedAt       DateTime    @default(now())
  completedAt     DateTime    @default(now())
  attempts        Int         @default(1)
  certificateDate DateTime?   // When certificate was issued
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([examId])
  @@index([passed])
}
```

### 6. Update `User` Model
Add relations to quiz/exam tables:

```prisma
model User {
  // ... existing fields ...
  userQuizzes   UserQuiz[]
  userExams     UserExam[]
}
```

### 7. Update `Course` Model
Add exam relation:

```prisma
model Course {
  // ... existing fields ...
  exam          Exam?
}
```

### 8. Update `Lesson` Model
Add quiz relation:

```prisma
model Lesson {
  // ... existing fields ...
  quiz          Quiz?
}
```

## API Endpoints (Backend)

### Quiz Endpoints
- `GET /api/quizzes/:lessonId` - Get quiz for a lesson
- `POST /api/quizzes/:quizId/submit` - Submit quiz answers
- `GET /api/user/quizzes` - Get user's quiz history
- `POST /api/admin/quizzes` - Create quiz (admin only)
- `PUT /api/admin/quizzes/:quizId` - Update quiz (admin only)
- `DELETE /api/admin/quizzes/:quizId` - Delete quiz (admin only)

### Exam Endpoints
- `GET /api/exams/:courseId` - Get exam for a course
- `POST /api/exams/:examId/submit` - Submit exam answers
- `GET /api/user/exams` - Get user's exam history
- `GET /api/user/certificates` - Get user's certificates
- `POST /api/exams/:examId/certificate` - Download certificate
- `POST /api/admin/exams` - Create exam (admin only)
- `PUT /api/admin/exams/:examId` - Update exam (admin only)
- `DELETE /api/admin/exams/:examId` - Delete exam (admin only)

## Frontend Components

### Implemented
✅ `QuizModal.jsx` - Quiz taking interface
✅ `ExamModal.jsx` - Exam taking interface
✅ Mock quiz and exam data in `mockQuizData.js`

### To be Integrated
- Quiz trigger in `LessonViewerPage.jsx` - Show quiz after lesson completion
- Exam access in `CourseDetailsPage.jsx` - Show exam button when all lessons done
- Quiz/Exam history in `UserDashboardPage.jsx` - Display user's quiz scores
- Admin Quiz Manager (future) - CRUD interface for admins

## Implementation Phases

### Phase 1 (Current - MVP+)
- ✅ Frontend UI components (QuizModal, ExamModal)
- ✅ Mock data structure
- Mock quiz/exam integration

### Phase 2 (Post-MVP)
- Database schema implementation
- Backend API endpoints
- Frontend API integration (replace mock data)

### Phase 3 (Future)
- Certificate generation (PDF)
- Admin quiz/exam management panel
- Analytics and reporting
- Question randomization
