import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/client";
import type { Course } from "../types";

export const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses = [], isLoading, isError } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const filteredCourses = courses.filter((c: Course) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading dashboard data.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Total Courses: {courses.length}</p>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />
      <div className="space-y-3">
        {filteredCourses.map((course: Course) => (
          <div key={course._id || course.code} className="border p-3 rounded">
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-xs text-gray-500">{course.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;