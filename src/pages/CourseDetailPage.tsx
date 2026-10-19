import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseByCode } from "../api/client";

function CourseDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course", code],
    queryFn: () => fetchCourseByCode(code!),
    enabled: Boolean(code),
  });

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading course details...
      </p>
    );
  }

  if (isError || !course) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-200">
          {error instanceof Error
            ? error.message
            : `No course found with code "${code}".`}
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {course.title}
      </h2>
      <div className="max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          {course.code}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Units: {course.units}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Semester: {course.semester}
        </p>
      </div>
      <button
        onClick={() => navigate("/courses")}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Back to Courses
      </button>
    </div>
  );
}

export default CourseDetailPage;