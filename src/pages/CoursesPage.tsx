import { useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/client";
import useUiStore from "../store/uiStore";

function CoursesPage() {
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const visibleCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [courses, searchTerm]
  );

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading courses...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-200">
        {error instanceof Error ? error.message : "Error loading courses"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
        Courses
      </h2>

      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search courses by code or title..."
        className="w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      />

      {visibleCourses.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No courses match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
            <Link
              key={course.code}
              to={`/courses/${course.code}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {course.code}: {course.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Units: {course.units}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Semester: {course.semester}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;