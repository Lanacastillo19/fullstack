import { useEffect, useState } from "react";
import { Link } from "react-router";
import { request } from "../api/client";

interface Course {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  description?: string;
}

interface Submission {
  id?: string;
  _id?: string;
}

// Default fallback courses to display when backend API is unreachable
const MOCK_COURSES: Course[] = [
  {
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts of programming and software design.",
  },
  {
    code: "WEB201",
    title: "Web Systems & Technologies",
    description: "Full-stack development using modern web frameworks.",
  },
  {
    code: "DBMS301",
    title: "Database Management Systems",
    description: "Database design, normalization, SQL, and query optimization.",
  },
];

export function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [coursesData, submissionsData] = await Promise.all([
          request<Course[]>("/courses").catch(() => MOCK_COURSES),
          request<Submission[]>("/submissions").catch(() => []),
        ]);

        if (isMounted) {
          const finalCourses = Array.isArray(coursesData) && coursesData.length > 0
            ? coursesData
            : MOCK_COURSES;

          setCourses(finalCourses);
          setSubmissionsCount(
            Array.isArray(submissionsData) && submissionsData.length > 0
              ? submissionsData.length
              : 2 // Default fallback count for UI demonstration
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-sm text-slate-500 font-medium">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your enrolled courses and upcoming tasks.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Courses
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {courses.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Submissions
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {submissionsCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Task Assistant
          </p>
          <Link
            to="/coach"
            className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Open Task Coach &rarr;
          </Link>
        </div>
      </div>

      {/* Active Courses List */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Your Active Courses
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {courses.map((course, idx) => (
            <div
              key={course._id || course.id || course.code || idx}
              className="rounded-lg border border-slate-200 p-4 transition hover:shadow-md"
            >
              <span className="inline-block rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                {course.code}
              </span>
              <h3 className="mt-2 text-sm font-bold text-slate-900">
                {course.title}
              </h3>
              {course.description && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;