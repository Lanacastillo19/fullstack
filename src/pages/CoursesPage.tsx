import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/client";
import type { Course } from "../types";

export const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses = [], isLoading, isError } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const visibleCourses = courses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-6">Loading courses...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading courses.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleCourses.map((course: Course) => (
          <div key={course._id || course.code} className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-sm text-gray-600">{course.code}</p>
            {course.description && <p className="mt-2 text-sm">{course.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;