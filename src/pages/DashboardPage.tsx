import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/client";
import useAuthStore from "../store/authStore";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const userName = useAuthStore((state) => state.userName);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          ITELECT4 Dashboard - GT2 Part 2
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {userName || "Guest"}
          </span>
          !
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {isLoading ? (
        <p className="py-4 text-sm text-slate-500">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.code}
              to={`/courses/${course.code}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <h3 className="font-bold text-slate-900 dark:text-white">
                {course.code}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {course.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}