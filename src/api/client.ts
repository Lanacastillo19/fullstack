import type { ClaimStatus } from "../types/index";

export interface Item {
  id: string;
  name: string;
  category: string;
  status: string;
  description?: string;
  locationFound?: string;
  dateFound?: string;
}

export type NewItem = Omit<Item, "id">;

export interface ClaimRecord {
  id: string;
  itemId: string;
  userId: string;
  status: ClaimStatus;
  notes: string;
  submittedAt: string;
}

export type NewClaim = Omit<ClaimRecord, "id">;

const BASE_URL = "http://127.0.0.1:3002";

export const api = {
  // Items API Methods
  getItems: async (): Promise<Item[]> => {
    const res = await fetch(`${BASE_URL}/items`);
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  },

  getItemById: async (id: string): Promise<Item> => {
    const res = await fetch(`${BASE_URL}/items/${id}`);
    if (!res.ok) throw new Error("Failed to fetch item");
    return res.json();
  },

  getItem: async (id: string): Promise<Item> => {
    const res = await fetch(`${BASE_URL}/items/${id}`);
    if (!res.ok) throw new Error("Failed to fetch item");
    return res.json();
  },

  createItem: async (item: NewItem): Promise<Item> => {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to create item");
    return res.json();
  },

  updateItemStatus: async (id: string, status: string): Promise<Item> => {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update item status");
    return res.json();
  },

  // Claims API Methods
  createClaim: async (claim: NewClaim): Promise<ClaimRecord> => {
    const res = await fetch(`${BASE_URL}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(claim),
    });
    if (!res.ok) throw new Error("Failed to create claim");
    return res.json();
  },

  getClaims: async (): Promise<ClaimRecord[]> => {
    const res = await fetch(`${BASE_URL}/claims`);
    if (!res.ok) throw new Error("Failed to fetch claims");
    const data: Array<ClaimRecord & { createdAt?: string }> = await res.json();

    return data.map((claim) => ({
      ...claim,
      submittedAt: claim.submittedAt || claim.createdAt || new Date().toISOString(),
    }));
  },
};