// src/api/client.ts
import type { Course, Submission, AiReview } from "../types/index";

// Always fall back to the production Vercel backend
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app/api";
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

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      `API error: ${response.status} ${response.statusText}`;
      
    throw new Error(errorMessage);
  }

  return response.json();
}

// Exported API Methods required by your components
export const fetchCourses = () => request<Course[]>("/courses");
export const fetchCourseByCode = (code: string) => request<Course>(`/courses/${code}`);
export const fetchSubmissions = () => request<Submission[]>("/submissions");
export const createSubmission = (data: Partial<Submission>) =>
  request<Submission>("/submissions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}