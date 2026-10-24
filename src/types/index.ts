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

export interface AiReview {
  readiness?: "ready" | "needs_work" | "not_ready" | "almost";
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  [key: string]: any;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}