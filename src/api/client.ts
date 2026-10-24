// src/api/client.ts
import type { Course, Submission, AiReview } from "../types";

// Always fall back to the live production backend URL
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app/api";

// Ensure the base URL does not have a trailing slash
const API_URL = RAW_API_URL.replace(/\/$/, "");

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensures endpoint starts with a leading slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
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