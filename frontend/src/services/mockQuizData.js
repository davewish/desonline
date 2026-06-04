// Mock Quiz and Exam Data

export const mockQuizzes = {
  // Lesson 1: Introduction to React
  "lesson-1": {
    id: "quiz-1",
    title: "React Basics Quiz",
    lessonId: "lesson-1",
    description: "Test your knowledge on React fundamentals",
    questions: [
      {
        id: "q1",
        question: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database management system",
          "A web server",
        ],
        correctAnswer: 0,
      },
      {
        id: "q2",
        question: "What is JSX?",
        options: [
          "A database language",
          "A syntax extension to JavaScript that looks like HTML",
          "A CSS framework",
          "A backend framework",
        ],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What is a React component?",
        options: [
          "A database query",
          "A reusable piece of UI with optional logic",
          "A type of server",
          "A CSS file",
        ],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "What is state in React?",
        options: [
          "A government entity",
          "Data that changes over time and affects the component's output",
          "A permanent variable",
          "A type of array",
        ],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "What is props in React?",
        options: [
          "A type of CSS property",
          "Arguments passed to a component to customize its behavior",
          "A React-specific data type",
          "A method for styling",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // Lesson 2: Components and Props
  "lesson-2": {
    id: "quiz-2",
    title: "Components & Props Quiz",
    lessonId: "lesson-2",
    description: "Test your understanding of React components and props",
    questions: [
      {
        id: "q1",
        question: "Can props be modified inside a component?",
        options: [
          "Yes, always",
          "No, props are read-only",
          "Yes, but only for objects",
          "It depends on the component type",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "How do you pass data to a child component?",
        options: [
          "Using global variables",
          "Using props",
          "Using local storage",
          "Using cookies",
        ],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What is the difference between functional and class components?",
        options: [
          "Functional components use JSX, class components don't",
          "Class components are faster",
          "Functional components are simpler and use hooks, class components use state and lifecycle methods",
          "There is no difference",
        ],
        correctAnswer: 2,
      },
      {
        id: "q4",
        question: "What is prop drilling?",
        options: [
          "A performance optimization technique",
          "Passing props through multiple levels of components",
          "A method of caching",
          "A type of React hook",
        ],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "Can you have a component without props?",
        options: [
          "No, all components need props",
          "Yes, props are optional",
          "Only functional components can have no props",
          "No, state replaces props",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // Lesson 3: State Management
  "lesson-3": {
    id: "quiz-3",
    title: "State Management Quiz",
    lessonId: "lesson-3",
    questions: [
      {
        id: "q1",
        question: "What hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Can you use useState multiple times in one component?",
        options: [
          "No, only once per component",
          "Yes, you can use it as many times as needed",
          "Only in class components",
          "Only with useReducer",
        ],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What does setState do in a class component?",
        options: [
          "Sets a variable permanently",
          "Updates the component's state and triggers a re-render",
          "Deletes the state",
          "Returns the current state value",
        ],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "What is the purpose of useEffect?",
        options: [
          "To style components",
          "To handle side effects like API calls, subscriptions, or DOM manipulations",
          "To manage props",
          "To optimize component rendering",
        ],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "What happens if you modify state directly without setState?",
        options: [
          "The component updates immediately",
          "React won't re-render the component",
          "It throws an error",
          "The state is locked",
        ],
        correctAnswer: 1,
      },
    ],
  },
};

export const mockExams = {
  // Course 1: React Fundamentals Final Exam
  "course-1": {
    id: "exam-1",
    title: "React Fundamentals - Final Exam",
    courseId: "course-1",
    description: "Comprehensive exam covering React basics, components, state, props, and hooks",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is React primarily used for?",
        options: [
          "Server-side rendering",
          "Building user interfaces",
          "Database management",
          "Managing servers",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Which of the following is NOT a React hook?",
        options: ["useState", "useEffect", "useClass", "useContext"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question: "What is the Virtual DOM?",
        options: [
          "A virtual copy of the real DOM that React uses to optimize updates",
          "A type of database",
          "A CSS framework",
          "A JavaScript library",
        ],
        correctAnswer: 0,
      },
      {
        id: "q4",
        question: "How do you pass a value from child to parent component?",
        options: [
          "Using props",
          "Using state",
          "Using a callback function passed as props",
          "Using global variables",
        ],
        correctAnswer: 2,
      },
      {
        id: "q5",
        question: "What is React.StrictMode used for?",
        options: [
          "To enforce strict component names",
          "To highlight potential problems in the application",
          "To improve performance",
          "To manage state",
        ],
        correctAnswer: 1,
      },
      {
        id: "q6",
        question: "Which method is called when a component is first rendered?",
        options: [
          "componentDidUpdate",
          "componentWillUnmount",
          "componentDidMount",
          "componentWillMount",
        ],
        correctAnswer: 2,
      },
      {
        id: "q7",
        question: "What is the purpose of keys in React lists?",
        options: [
          "To style list items",
          "To help React identify which items have changed, been added, or removed",
          "To sort the list",
          "To store data",
        ],
        correctAnswer: 1,
      },
      {
        id: "q8",
        question: "Can you render multiple elements without a wrapper div?",
        options: [
          "No, always need a wrapper",
          "Yes, using Fragments (<> </>)",
          "Only with arrays",
          "Never, it causes errors",
        ],
        correctAnswer: 1,
      },
      {
        id: "q9",
        question: "What is the difference between controlled and uncontrolled components?",
        options: [
          "Controlled components are faster",
          "Controlled components have their state managed by React, uncontrolled components manage their own state",
          "There is no difference",
          "Uncontrolled components use props",
        ],
        correctAnswer: 1,
      },
      {
        id: "q10",
        question:
          "How do you prevent a component from rendering if props haven't changed?",
        options: [
          "Using shouldComponentUpdate or React.memo",
          "Using state",
          "Using useEffect",
          "It's automatic",
        ],
        correctAnswer: 0,
      },
      {
        id: "q11",
        question: "What does the dependency array in useEffect do?",
        options: [
          "Depends on the component name",
          "Controls when the effect runs based on which dependencies change",
          "Stores data",
          "It's required for all effects",
        ],
        correctAnswer: 1,
      },
      {
        id: "q12",
        question: "What happens if you don't return a cleanup function from useEffect?",
        options: [
          "Memory leaks can occur",
          "Nothing, cleanup is optional",
          "The component won't render",
          "React throws an error",
        ],
        correctAnswer: 0,
      },
      {
        id: "q13",
        question: "Can you conditionally call hooks like useState?",
        options: [
          "Yes, anywhere in the component",
          "No, hooks must be called at the top level",
          "Only in event handlers",
          "Only in useEffect",
        ],
        correctAnswer: 1,
      },
      {
        id: "q14",
        question: "What is prop validation in React?",
        options: [
          "Checking if props are strings",
          "Using PropTypes or TypeScript to validate prop types and catch errors",
          "Storing props safely",
          "Encrypting props",
        ],
        correctAnswer: 1,
      },
      {
        id: "q15",
        question: "How do you import a default export in React?",
        options: [
          "import { Component } from './file'",
          "import Component from './file'",
          "import default Component from './file'",
          "const Component = require('./file')",
        ],
        correctAnswer: 1,
      },
      {
        id: "q16",
        question: "What is Context API used for?",
        options: [
          "Styling components",
          "Avoiding prop drilling by sharing data across components",
          "Managing database connections",
          "Making HTTP requests",
        ],
        correctAnswer: 1,
      },
      {
        id: "q17",
        question: "What does useCallback do?",
        options: [
          "Makes components render faster",
          "Memoizes a callback function so its identity doesn't change",
          "Stores data",
          "Manages side effects",
        ],
        correctAnswer: 1,
      },
      {
        id: "q18",
        question: "What is useMemo used for?",
        options: [
          "Memoizing callbacks",
          "Memoizing expensive computations to avoid recalculating them",
          "Managing state",
          "Handling DOM events",
        ],
        correctAnswer: 1,
      },
      {
        id: "q19",
        question: "Can you use async/await directly in useEffect?",
        options: [
          "Yes, always",
          "No, but you can create an async function inside and call it",
          "Only in class components",
          "Only with useCallback",
        ],
        correctAnswer: 1,
      },
      {
        id: "q20",
        question: "What is the correct way to handle forms in React?",
        options: [
          "Use traditional HTML forms",
          "Handle form submission and input changes with React state",
          "Use jQuery plugins",
          "Always use uncontrolled components",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // Course 2: Advanced React Patterns
  "course-2": {
    id: "exam-2",
    title: "Advanced React - Final Exam",
    courseId: "course-2",
    description: "Test your advanced React knowledge",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is a higher-order component (HOC)?",
        options: [
          "A component that renders other components",
          "A pattern that wraps a component to enhance its functionality",
          "A component with many props",
          "A type of hook",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "What is render props pattern?",
        options: [
          "Props that are numbers",
          "A technique to share code between components using a function prop",
          "Props that render HTML",
          "A way to style components",
        ],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What is lazy loading in React?",
        options: [
          "Loading components slowly",
          "Code splitting and loading components only when needed",
          "Delaying state updates",
          "Caching components",
        ],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "What is React.lazy used with?",
        options: [
          "useState",
          "useEffect",
          "Suspense",
          "Context",
        ],
        correctAnswer: 2,
      },
      {
        id: "q5",
        question: "What is error boundary in React?",
        options: [
          "A way to style error messages",
          "A component that catches errors in its child components",
          "A validation function",
          "A type of middleware",
        ],
        correctAnswer: 1,
      },
    ],
  },
};

// Helper function to get quiz by lesson ID
export const getQuizByLessonId = (lessonId) => {
  return mockQuizzes[lessonId] || null;
};

// Helper function to get exam by course ID
export const getExamByCourseId = (courseId) => {
  return mockExams[courseId] || null;
};
