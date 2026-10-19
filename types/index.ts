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

// ===== TYPE ALIASES =====
export type ID = number | string;
export type Coordinate = {
  x: number;
  y: number;
};
export type Formatter = (value: number) => string;

// Using them + added console.log to fix unused variable warning
const studentId: ID = "S2026-001";
const position: Coordinate = { x: 10, y: 20 };
const formatScore: Formatter = (value) => `${value}%`;
console.log(studentId); 
console.log(formatScore(95.5));
console.log(position); 

// ===== UNION TYPES =====
export type StringOrNumber = string | number;
export type Status = "pending" | "active" | "inactive"; 

export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}
printId(101);
printId("S2026-001");

// ===== INTERSECTION TYPES =====
export type StudentWithCourse = User & {
  enrolledCourse: Course;
  gpa: number;
};

const topStudent: StudentWithCourse = {
  id: 1,
  name: "Maria Santos",
  email: "m@example.com",
  role: "student",
  isActive: true,
  enrolledCourse: {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st",
  },
  gpa: 1.25,
};
console.log(topStudent); 

// ==========================================
// ===== SESSION 2 ADDITIONS (GT1 PART 2) =====
// ==========================================

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type NewSubmissionPayload = Omit<Submission, "id">;

// ===== ENUMS (Fixed for erasableSyntaxOnly compatibility) =====
export const SubmissionStatus = {
  Pending: 0,
  Graded: 1,
  Late: 2,
} as const;
export type SubmissionStatus = typeof SubmissionStatus[keyof typeof SubmissionStatus];

export const Role = {
  Student: "student",
  Admin: "admin",
  Instructor: "instructor",
} as const;
export type Role = typeof Role[keyof typeof Role];

export const UserRole = Role;
export type UserRole = Role;