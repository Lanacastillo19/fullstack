// src/types/index.ts

export interface User {
  _id?: string;
  id?: number | string;
  name: string;
  email: string;
  role?: "student" | "admin" | "instructor";
  isActive?: boolean;
  score?: number;
}

export interface Course {
  _id?: string;
  id?: number | string;
  code: string;
  title: string;
  units?: number;
  semester?: string;
  description?: string;
}

export interface Submission {
  _id?: string;
  id?: number | string;
  studentId?: number | string;
  title?: string;
  courseCode?: string;
  repoUrl?: string;
  content?: string;
  status?: string;
  score?: number;
  submittedAt?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface LostItem {
  _id?: string;
  id?: number | string;
  name: string;
  location: string;
}

// ===== TYPE ALIASES =====
export type ID = string | number;
export type Coordinate = {
  x: number;
  y: number;
};
export type Formatter = (value: number) => string;
export type StringOrNumber = string | number;
export type Status = "pending" | "active" | "inactive";

export type StudentWithCourse = User & {
  enrolledCourse?: Course;
  gpa?: number;
};

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type NewSubmissionPayload = Omit<Submission, "_id" | "id">;

// ===== ENUMS & CONSTANTS =====
export const SubmissionStatus = {
  Pending: "pending",
  Graded: "graded",
  Late: "late",
} as const;
export type SubmissionStatus =
  (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const Role = {
  Student: "student",
  Admin: "admin",
  Instructor: "instructor",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const UserRole = Role;
export type UserRole = Role;

export type ApiSubmission = Submission;
export type NewSubmission = Omit<Submission, "_id" | "id">;