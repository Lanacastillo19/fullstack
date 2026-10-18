// ===== ENUM-STYLE CONSTANTS =====
export const Role = {
  Student: "student",
  Admin: "admin",
  Instructor: "instructor",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const ClaimStatus = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
} as const;
export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

// ===== INTERFACES =====
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Item {
  id: string;
  title: string;
  name?: string;
  category?: string;
  description: string;
  location: string;
  reportedBy?: string | number;
  status?: "Unclaimed" | "Claimed";
}

export interface Claim {
  id: string;
  itemId: string;
  claimedBy: string | number;
  notes: string;
  submittedAt: string | Date;
  status?: ClaimStatus;
}

// ===== TYPE ALIASES =====
export type ID = string | number;

export type Coordinate = {
  x: number;
  y: number;
};

export type Formatter = (value: number) => string;

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY & DTO TYPES =====
export type UserUpdate = Partial<User>;
export type UserPreview = Pick<User, "id" | "name" | "role">;
export type PublicUser = Omit<User, "email" | "isActive">;
export type RoleCount = Partial<Record<Role, number>>;

// Required for Frontend Forms & Backend Models
export type ItemDoc = Omit<Item, "id">;
export type ClaimDoc = Omit<Claim, "id">;
export type CreateItemDTO = Pick<Item, "title" | "description" | "location"> & {
  category?: string;
};