import type { Types } from "mongoose";

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
  reportedBy: string | number | Types.ObjectId;
  category?: string;
  status?: "Unclaimed" | "Claimed" | string;
}

export interface ItemDoc {
  _id?: string | Types.ObjectId;
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  reportedBy: Types.ObjectId | string | number; // <--- ADD THIS LINE
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