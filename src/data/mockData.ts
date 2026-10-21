import type { User, Claim } from "../types/index";

export const mockUser: User = {
  id: "1",
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

// Export student so DashboardPage can access it
export const student = mockUser;

export const mockClaims: Claim[] = [
  {
    id: "1",
    itemId: "1",
    status: "pending",
    createdAt: "2026-03-01",
  },
];