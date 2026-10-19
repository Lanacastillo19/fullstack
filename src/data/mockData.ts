import type { User, Course, Submission } from "../types/index";

export const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

export const courses: Course[] = [
  {
    id: 1,
    code: "ITELECT4",
    title: "IT Elective 4 - Web Architecture & Development",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    id: 2,
    code: "ITELECT3",
    title: "IT Elective 3 - Enterprise Systems",
    units: 3,
    semester: "2nd Semester 2025-2026",
  },
  {
    id: 3,
    code: "CSSWENG",
    title: "Software Engineering Principles",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
];

export const allSubmissions: Submission[] = [
  {
    id: 1,
    studentId: 1,
    courseCode: "ITELECT4",
    repoUrl: "github.com/juan/itelect4-project-part2",
    submittedAt: new Date(),
    score: 95,
  },
  {
    id: 2,
    studentId: 1,
    courseCode: "ITELECT3",
    repoUrl: "github.com/juan/itelect3-final-exam",
    submittedAt: new Date(),
  },
  {
    id: 3,
    studentId: 1,
    courseCode: "CSSWENG",
    repoUrl: "github.com/juan/cssweng-sprint1-docs",
    submittedAt: new Date(),
    score: 90,
  },
];

export const allCourses = courses;