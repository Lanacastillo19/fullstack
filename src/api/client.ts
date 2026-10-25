// src/api/client.ts
import type { Course, Submission, User } from "../types/index";

export interface AiReview {
  review?: string;
  feedback?: string;
  suggestion?: string;
  [key: string]: any;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with a single slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Use relative route through Vercel rewrites (/api)
  const url = `/api${cleanEndpoint}`;

  try {
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
  } catch (err: any) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      throw new Error("Unable to reach backend server. Please check your network connection.");
    }
    throw err;
  }
}

// Authentication API methods
export async function login(email: string): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Course API methods
export const fetchCourses = () => request<Course[]>("/courses");
export const fetchCourseByCode = (code: string) => request<Course>(`/courses/${code}`);

// Submission API methods
export const fetchSubmissions = () => request<Submission[]>("/submissions");
export const createSubmission = (data: Partial<Submission>) =>
  request<Submission>("/submissions", {
    method: "POST",
    body: JSON.stringify(data),
  });

// AI Review API method
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}