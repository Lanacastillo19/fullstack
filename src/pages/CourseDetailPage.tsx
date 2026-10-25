import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { request } from "../api/client";

interface CourseDetail {
  code: string;
  title: string;
  description: string;
  instructor?: string;
  modules?: string[];
}

const MOCK_COURSE_DETAILS: Record<string, CourseDetail> = {
  CS101: {
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts of programming, algorithms, and software design.",
    instructor: "Dr. Alex Mercer",
    modules: [
      "Module 1: Logic & Algorithms",
      "Module 2: Python Syntax & Data Types",
      "Module 3: Control Flow & Functions",
      "Module 4: Final Project Overview",
    ],
  },
  WEB201: {
    code: "WEB201",
    title: "Web Systems & Technologies",
    description: "Full-stack development using modern web frameworks like React and Node.js.",
    instructor: "Prof. Sarah Jenkins",
    modules: [
      "Module 1: HTML5 & Tailwind CSS",
      "Module 2: React State & React Router",
      "Module 3: Node.js & REST API Design",
      "Module 4: MongoDB & Authentication",
    ],
  },
  DBMS301: {
    code: "DBMS301",
    title: "Database Management Systems",
    description: "Database design, normalization, SQL queries, and performance optimization.",
    instructor: "Dr. Robert Vance",
    modules: [
      "Module 1: Relational Data Models",
      "Module 2: SQL & Advanced Queries",
      "Module 3: Normalization (1NF to 3NF)",
      "Module 4: Indexing & Security",
    ],
  },
};

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseCode = id?.toUpperCase() || "CS101";

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCourseDetails() {
      try {
        const data = await request<CourseDetail>(`/courses/${id}`);
        if (isMounted && data && data.title) {
          setCourse(data);
        } else {
          setCourse(MOCK_COURSE_DETAILS[courseCode] || MOCK_COURSE_DETAILS["CS101"]);
        }
      } catch {
        if (isMounted) {
          setCourse(MOCK_COURSE_DETAILS[courseCode] || MOCK_COURSE_DETAILS["CS101"]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourseDetails();

    return () => {
      isMounted = false;
    };
  }, [id, courseCode]);

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-sm font-medium text-slate-500">
        Loading course details...
      </div>
    );
  }

  const activeCourse = course || MOCK_COURSE_DETAILS["CS101"];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-2">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/courses" className="hover:text-blue-600 hover:underline">
          Courses
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{activeCourse.code}</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            {activeCourse.code}
          </span>
          {activeCourse.instructor && (
            <span className="text-xs font-medium text-slate-500">
              Instructor: {activeCourse.instructor}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-900">{activeCourse.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">{activeCourse.description}</p>
      </div>

      {activeCourse.modules && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Course Syllabus</h2>
          <ul className="space-y-3">
            {activeCourse.modules.map((mod, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm font-medium text-slate-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {mod}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;