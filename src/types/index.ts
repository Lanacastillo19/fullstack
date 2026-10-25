// src/types/index.ts

export type StringOrNumber = string | number;

export enum Role {
  STUDENT = "STUDENT",
  Student = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  Instructor = "INSTRUCTOR",
  ADMIN = "ADMIN",
  Admin = "ADMIN",
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  Pending = "PENDING",
  GRADED = "GRADED",
  Graded = "GRADED",
  REJECTED = "REJECTED",
  Rejected = "REJECTED",
}

export interface User {
  id?: string | number;
  _id?: string;
  name: string;
  email: string;
  role?: Role | string;
  isActive?: boolean;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  role?: Role | string;
  isActive?: boolean;
}

export interface Course {
  _id?: string;
  id?: string | number;
  code: string;
  title: string;
  description?: string;
  units?: number;
  semester?: string;
}

export interface Submission {
  _id?: string;
  id?: string | number;
  studentId?: string | number;
  courseCode: string;
  title?: string;
  content?: string;
  repoUrl?: string;
  score?: number;
  submittedAt?: string | Date;
  createdAt?: string | Date;
  status?: SubmissionStatus | string;
}

// What POST /api/ai sends back: a short plan for one task.
// These four fields match the backend's reviewSchema exactly.
export type TaskCategory = "work" | "personal" | "urgent";

export interface TaskPlan {
  summary: string;
  steps: string[];
  category: TaskCategory;
  priority: number; // whole number, 1 (can wait) to 5 (do it first)
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}