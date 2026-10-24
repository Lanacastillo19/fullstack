// src/api/client.ts
import type { Course, Submission, AiReview } from "../types";

// Fallback points to local backend running on port 4000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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
    // Reads backend error message if available, otherwise defaults to statusText
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API error: ${response.statusText}`);
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

// Session 11: Ask AI for project review
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}