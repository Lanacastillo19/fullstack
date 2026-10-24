import type { User, Course, Submission } from "../types/index";

export const mockUser: User = {
  id: 1,
  name: "Lana Lee",
  email: "student@dlsl.edu.ph",
  isActive: true,
};

export const mockCourses: Course[] = [
  {
    id: 1,
    code: "IT4B",
    title: "Web Development",
    description: "Fullstack web development course",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    id: 2,
    code: "IT4A",
    title: "Database Systems",
    description: "Database management systems",
    units: 3,
    semester: "2nd Semester 2025-2026",
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 1,
    courseCode: "IT4B",
    title: "MERN Project",
    submittedAt: new Date().toISOString(),
  },
];
