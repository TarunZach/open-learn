import { ReactNode } from "react";
export interface ProviderProps {
  children: ReactNode;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
}

export interface UserDetailContextType {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}

export const COURSE_CATEGORY_OPTIONS = [
  "programming",
  "ai",
  "business",
  "health",
  "science",
  "productivity",
  "language",
] as const;

export const COURSE_LEVEL_OPTIONS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type CourseFormData = {
  title: string;
  description: string;
  topics: number;
  category: (typeof COURSE_CATEGORY_OPTIONS)[number];
  level: (typeof COURSE_LEVEL_OPTIONS)[number];
  transcript?: string;
};

export interface Course {
  id: number;
  title: string;
  description: string;
  category: (typeof COURSE_CATEGORY_OPTIONS)[number];
  level: (typeof COURSE_LEVEL_OPTIONS)[number];
  topics: number;
  transcript?: string;
  createdAt?: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  language: string;
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
}

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
}

export interface FullCourseResponse {
  course: Course;
  lessons: Lesson[];
  quizzes: Quiz[];
  questions: Question[];
}
