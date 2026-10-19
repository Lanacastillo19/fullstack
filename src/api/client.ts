// src/api/client.ts
import type { Course, Submission } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app/api";

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Exported helper functions required by pages
export const fetchCourses = () => request<Course[]>("/courses");
export const fetchCourseByCode = (code: string) => request<Course>(`/courses/${code}`);
export const fetchSubmissions = () => request<Submission[]>("/submissions");
export const createSubmission = (data: Partial<Submission>) =>
  request<Submission>("/submissions", {
    method: "POST",
    body: JSON.stringify(data),
  });