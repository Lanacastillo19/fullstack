import type { ClaimStatus, AiListing } from "../types/index";

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

// GT5: the AI route lives on the real backend, not on json-server.
const AI_BASE_URL = "https://gt-4-fullstack.vercel.app";

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

// GT5: ask Gemini (through the backend) to turn a rough description
// into a listing. The token is the one the login popup saved in
// localStorage, the same place App.tsx reads it from. Every failure becomes an Error carrying the
// backend's own message (400, 401, 429 and 502 all send one).
export async function askAi(prompt: string): Promise<AiListing> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${AI_BASE_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return (await res.json()) as AiListing;
}