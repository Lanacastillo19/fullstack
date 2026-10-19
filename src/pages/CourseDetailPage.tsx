import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseByCode } from "../api/client";
import type { Course } from "../types";

export const CourseDetailPage: React.FC<{ code?: string }> = ({ code = "" }) => {
  const { data: course, isLoading, isError } = useQuery<Course>({
    queryKey: ["course", code],
    queryFn: () => fetchCourseByCode(code),
    enabled: !!code,
  });

  if (isLoading) return <div className="p-6">Loading course details...</div>;
  if (isError || !course) return <div className="p-6 text-red-500">Course not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">Course Code: {course.code}</p>
      {course.description && (
        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{course.description}</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;