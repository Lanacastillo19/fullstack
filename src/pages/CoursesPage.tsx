import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/client";
import type { Course } from "../types";

export const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses = [], isLoading, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // Safe filtering that prevents errors if title or code is missing
  const visibleCourses = courses.filter((course: Course) => {
    const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const codeMatch = course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    return titleMatch || codeMatch;
  });

  if (isLoading) return <div className="p-6">Loading courses...</div>;

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading courses: {(error as Error)?.message || "Failed to fetch data."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-6 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />

      {visibleCourses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleCourses.map((course: Course) => (
            <div 
              key={course._id || course.code} 
              className="border p-4 rounded shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
              {course.description && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{course.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;