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

export type CourseFormData = {
  title: string;
  description: string;
  topics: number;
  includeVideo: boolean;
  category: (typeof COURSE_CATEGORY_OPTIONS)[number];
};
