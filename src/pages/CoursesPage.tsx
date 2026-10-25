import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Course {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  description?: string;
}

const MOCK_COURSES: Course[] = [
  {
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts of programming, logic, and software design.",
  },
  {
    code: "WEB201",
    title: "Web Systems & Technologies",
    description: "Full-stack web application development using React and backend APIs.",
  },
  {
    code: "DBMS301",
    title: "Database Management Systems",
    description: "Database modeling, relational architecture, SQL queries, and normalization.",
  },
];

const API_BACKEND_URL = "https://backend-mnio-git-gt5-ai-lana-lee.vercel.app/api/courses";

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      try {
        const res = await fetch(API_BACKEND_URL);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        if (isMounted) {
          setCourses(Array.isArray(data) && data.length > 0 ? data : MOCK_COURSES);
        }
      } catch (error) {
        console.error("Failed to fetch courses, falling back to mock data:", error);
        if (isMounted) setCourses(MOCK_COURSES);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-sm font-medium text-slate-500">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enrolled Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a course to view details, syllabus modules, and study progress.
        </p>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {courses.map((course, idx) => (
          <Link
            key={course._id || course.id || course.code || idx}
            to={`/courses/${course.code}`}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-md"
          >
            <div>
              <span className="inline-block rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                {course.code}
              </span>
              <h2 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-blue-600">
                {course.title}
              </h2>
              {course.description && (
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 group-hover:underline">
              View Course Details &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;