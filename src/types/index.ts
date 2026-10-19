// ===== INTERFACES =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
  score?: number;
}

export interface Course {
  id?: number;
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface Submission {
  id: number;
  studentId: number;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

export interface LostItem {
  id: number;
  name: string;
  location: string;
}

// ===== TYPE ALIASES =====
export type ID = number | string;
export type Coordinate = {
  x: number;
  y: number;
};
export type Formatter = (value: number) => string;
export type StringOrNumber = string | number;
export type Status = "pending" | "active" | "inactive";

export type StudentWithCourse = User & {
  enrolledCourse: Course;
  gpa: number;
};

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type NewSubmissionPayload = Omit<Submission, "id">;

// ===== ENUMS & CONSTANTS =====
export const SubmissionStatus = {
  Pending: 0,
  Graded: 1,
  Late: 2,
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

export type ApiSubmission = Omit<Submission, "id" | "submittedAt"> & {
  id: string;
  submittedAt: string;
};

export type NewSubmission = Omit<ApiSubmission, "id">;