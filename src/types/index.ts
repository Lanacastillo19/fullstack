declare module '*.css';

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  isActive: boolean;
}

export interface Item {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  location: string;
  reportedBy: string | number;
  category?: string;
  status?: "Unclaimed" | "Claimed" | string;
}

export interface ItemDoc {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  reportedBy: string | number;
  dateReported?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ClaimStatus = "pending" | "approved" | "rejected" | "Pending" | "Approved" | "Rejected";
export type Role = "student" | "admin" | "user" | "staff";

export interface Claim {
  id: string;
  itemId: string;
  status: ClaimStatus;
  createdAt: string;
}