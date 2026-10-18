export interface User {
  id: string; // Line 20: Must be string
  name: string;
  email: string;
  role: "student" | "admin";
  isActive: boolean;
}

export interface Item {
  id: string; // Line 28: Must be string
  title: string;
  description: string;
  location: string;
  reportedBy: string | number;
  category?: string;
  status?: "Unclaimed" | "Claimed";
}