# Quiz & Exam System Documentation

## Overview
The Quiz & Exam system enhances the DesOnline learning experience by allowing students to test their knowledge and admins to create assessments.

## Features

### Lesson Quizzes
- **Purpose:** Reinforce learning after each lesson
- **Timing:** Available after completing a lesson
- **Type:** Optional assessment
- **Questions:** Multiple-choice format
- **Scoring:** Instant feedback with score percentage
- **Retakes:** Unlimited
- **Pass Threshold:** N/A (for learning reinforcement)

### Course Exams
- **Purpose:** Final assessment for course completion
- **Timing:** Available after completing all lessons in a course
- **Type:** Required for certification
- **Questions:** Multiple-choice format
- **Scoring:** Calculated and displayed immediately
- **Retakes:** Unlimited
- **Pass Threshold:** 70%
- **Certificate:** Generated upon passing

## Components

### 1. QuizModal Component
Located: `frontend/src/components/QuizModal.jsx`

**Features:**
- Full-screen quiz interface
- Progress bar showing completion
- Navigation between questions
- Visual indicators for answered questions
- Instant submission and scoring
- Question review via indicator dots
- Retake option

**Props:**
```javascript
{
  quiz: {
    id: string,
    title: string,
    questions: Question[]
  },
  onClose: () => void,
  onSubmit: (result) => void
}
```

**Usage:**
```jsx
import QuizModal from './components/QuizModal';

<QuizModal 
  quiz={quizData}
  onClose={() => setShowQuiz(false)}
  onSubmit={(result) => handleQuizSubmit(result)}
/>
```

### 2. ExamModal Component
Located: `frontend/src/components/ExamModal.jsx`

**Features:**
- Full-screen exam interface
- Passing score indicator (70%)
- Progress tracking
- Navigation between questions
- Pass/Fail result screen
- Certificate download option (mock)
- Retake option

**Props:**
```javascript
{
  exam: {
    id: string,
    title: string,
    passingScore: number,
    questions: Question[]
  },
  onClose: () => void,
  onSubmit: (result) => void
}
```

**Usage:**
```jsx
import ExamModal from './components/ExamModal';

<ExamModal 
  exam={examData}
  onClose={() => setShowExam(false)}
  onSubmit={(result) => handleExamSubmit(result)}
/>
```

### 3. Mock Data Service
Located: `frontend/src/services/mockQuizData.js`

**Includes:**
- Sample quizzes for lessons 1-3
- Sample exams for courses 1-2
- Helper functions to retrieve quizzes/exams

**Example Data Structure:**
```javascript
{
  id: "quiz-1",
  title: "React Basics Quiz",
  lessonId: "lesson-1",
  questions: [
    {
      id: "q1",
      question: "What is React?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0  // Index of correct option
    }
  ]
}
```

**Helper Functions:**
```javascript
import { getQuizByLessonId, getExamByCourseId } from './services/mockQuizData';

const quiz = getQuizByLessonId('lesson-1');
const exam = getExamByCourseId('course-1');
```

## Integration Guide

### Step 1: Show Quiz After Lesson Completion
In `LessonViewerPage.jsx`:

```jsx
import QuizModal from '../components/QuizModal';
import { getQuizByLessonId } from '../services/mockQuizData';

// Inside component
const [showQuiz, setShowQuiz] = useState(false);
const [userQuizResults, setUserQuizResults] = useState({});

const handleLessonComplete = () => {
  const quiz = getQuizByLessonId(currentLessonId);
  if (quiz) {
    setShowQuiz(true);
  }
};

const handleQuizSubmit = (result) => {
  setUserQuizResults(prev => ({
    ...prev,
    [result.quizId]: result
  }));
  setShowQuiz(false);
  // TODO: Send to backend API
};

// In JSX
{showQuiz && (
  <QuizModal 
    quiz={getQuizByLessonId(currentLessonId)}
    onClose={() => setShowQuiz(false)}
    onSubmit={handleQuizSubmit}
  />
)}
```

### Step 2: Show Exam When Course Complete
In `CourseDetailsPage.jsx`:

```jsx
import ExamModal from '../components/ExamModal';
import { getExamByCourseId } from '../services/mockQuizData';

// Inside component
const [showExam, setShowExam] = useState(false);
const allLessonsCompleted = lessons.every(l => l.completed);

const handleExamSubmit = (result) => {
  // Store exam result
  console.log('Exam result:', result);
  // TODO: Send to backend API
};

// In JSX
{allLessonsCompleted && (
  <button 
    onClick={() => setShowExam(true)}
    className="btn-primary"
  >
    Take Final Exam
  </button>
)}

{showExam && (
  <ExamModal 
    exam={getExamByCourseId(courseId)}
    onClose={() => setShowExam(false)}
    onSubmit={handleExamSubmit}
  />
)}
```

### Step 3: Display Quiz/Exam History
In `UserDashboardPage.jsx`:

```jsx
import { useState } from 'react';

// Inside component
const [userQuizScores, setUserQuizScores] = useState({});
const [userExamScores, setUserExamScores] = useState({});

// Display in profile or new tab
<div className="space-y-4">
  <h3 className="font-bold text-lg">Quiz History</h3>
  {Object.entries(userQuizScores).map(([quizId, score]) => (
    <div key={quizId} className="p-4 bg-white rounded-lg">
      <p className="font-semibold">{quizId}: {score}%</p>
    </div>
  ))}
</div>
```

## Question Structure

Each question has the following structure:

```javascript
{
  id: string,              // Unique identifier
  question: string,        // Question text
  options: string[],       // Array of answer options
  correctAnswer: number,   // Index of correct answer (0-based)
  order?: number,         // Position in quiz/exam
  explanation?: string    // Future: Explanation after completion
}
```

## Submit Result Structure

When a quiz/exam is submitted, the callback receives:

```javascript
{
  quizId: string,          // or examId for exams
  score: number,           // Percentage (0-100)
  correctAnswers: number,  // Count of correct answers
  totalQuestions: number,  // Total questions
  passed: boolean,         // (exam only) Whether passed 70%
  answers: {               // User's selected answers
    "0": 1,                // Question index: selected option index
    "1": 2,
    // ...
  }
}
```

## Styling

Both components use Tailwind CSS and follow the existing design system:

- **Quiz Colors:** Blue gradient (primary)
- **Exam Colors:** Purple gradient (secondary)
- **Progress Indicators:** Visual feedback via color changes
- **Responsive:** Fully mobile-friendly

## Future Enhancements

1. **Question Types**
   - True/False questions
   - Short answer questions
   - Multiple selection questions

2. **Question Randomization**
   - Shuffle questions each attempt
   - Random from larger question bank

3. **Analytics**
   - Student performance dashboard
   - Question difficulty analysis
   - Common mistakes tracking

4. **Certificates**
   - PDF generation
   - Digital verification
   - Certificate repository

5. **Admin Features**
   - Quiz/Exam creation UI
   - Question bank management
   - Import questions from CSV
   - Set custom passing scores

## Mock Data for Testing

The system includes comprehensive mock data:
- 3 sample quizzes (for lessons 1-3)
- 2 sample exams (for courses 1-2)
- 5 questions per quiz
- 20 questions per exam

To test, simply use `getQuizByLessonId()` or `getExamByCourseId()` functions.

## Backend Integration Roadmap

### Phase 1: Data Storage
- Create database schema (see QUIZ-EXAM-SCHEMA.md)
- Implement quiz and exam CRUD APIs
- Add user quiz/exam result tracking

### Phase 2: Connectivity
- Replace mock data with API calls
- Implement result persistence
- Add error handling

### Phase 3: Advanced Features
- Certificate generation
- Admin panel for quiz/exam management
- Advanced analytics
- Question randomization
