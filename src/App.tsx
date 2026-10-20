import React, { useState, useEffect } from "react";
import type { User, Item } from "./types/index";

export type CreateItemDTO = {
  title: string;
  description: string;
  location: string;
  category: string;
};

type ClaimRecord = {
  id: string;
  itemId: string;
  itemTitle?: string;
  claimedBy: string;
  claimDate: string;
  status?: string;
};

const rawApiUrl = import.meta.env.VITE_API_URL || "https://gt-4-fullstack.vercel.app";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return response.json();
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<CreateItemDTO>({
    title: "",
    description: "",
    location: "",
    category: "General",
  });

  const mockUser: User = {
    id: "1",
    name: "Lorenz Allen Biscocho",
    email: "lorenz_allen_biscocho@dlsl.edu.ph",
    role: "student",
    isActive: true,
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await request<any>("/api/items");
      const rawData = Array.isArray(res) ? res : res?.data || res?.items || [];

      if (Array.isArray(rawData)) {
        const normalizedItems: Item[] = rawData.map((item: any) => ({
          ...item,
          id: item.id || item._id,
          title: item.title || item.name || "Untitled Item",
          location: item.location || "Campus Ground",
          category: item.category || "General",
        }));
        setItems(normalizedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to backend server. Displaying local state.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await request<any>("/api/claims");
      const rawClaims = Array.isArray(res) ? res : res?.data || res?.claims || [];
      setClaims(rawClaims);
    } catch (err) {
      console.error("Error fetching claims:", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchClaims();
  }, []);

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description || !newItem.location) return;

    const payload = {
      name: newItem.title,
      title: newItem.title,
      description: newItem.description,
      location: newItem.location,
      category: newItem.category,
    };

    try {
      const result = await request<{ success: boolean; data: Item }>("/api/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (result) {
        setNewItem({ title: "", description: "", location: "", category: "General" });
        fetchItems();
      }
    } catch (err) {
      console.error("Error creating item:", err);
      const localItem: Item = {
        id: String(Date.now()),
        title: newItem.title,
        description: newItem.description,
        location: newItem.location,
        category: newItem.category,
        reportedBy: mockUser.id,
        status: "Unclaimed",
      };
      setItems((prev) => [localItem, ...prev]);
      setNewItem({ title: "", description: "", location: "", category: "General" });
    }
  };

  const handleClaimItem = async (itemId: string, itemTitle: string) => {
    try {
      await request<{ success: boolean }>("/api/claims", {
        method: "POST",
        body: JSON.stringify({
          itemId,
          claimedBy: mockUser.id,
          claimDate: new Date().toISOString(),
        }),
      });

      alert(`Claim request registered for "${itemTitle}"!`);
      fetchClaims();
    } catch (err) {
      console.error("Error claiming item:", err);
      const newClaim: ClaimRecord = {
        id: String(Date.now()),
        itemId,
        itemTitle,
        claimedBy: mockUser.id,
        claimDate: new Date().toISOString(),
        status: "Pending",
      };
      setClaims((prev) => [newClaim, ...prev]);
      alert(`Claim request registered for "${itemTitle}"!`);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "Claimed") {
      return claims.some((c) => c.itemId === (item.id || item._id));
    }

    return true;
  });

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Top Header Navigation Bar */}
      <header
        className={`border-b px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl tracking-tight">Lost and Found</span>
          <nav className="flex gap-2 text-sm font-medium">
            {["Dashboard", "Claimed", "Submissions", "Login"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "Claimed" ? `Claimed Items (${claims.length})` : tab}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              : "bg-gray-900 border-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{activeTab}</h1>
          <p className="text-gray-500 text-sm">
            Total Items: {filteredItems.length}
          </p>
        </div>

        {/* Search Input Bar */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Item Cards Stacked Layout */}
        <div className="space-y-3">
          {loading && <p className="text-gray-400 text-sm">Loading items...</p>}
          {error && <p className="text-amber-500 text-sm">{error}</p>}

          {!loading && filteredItems.length === 0 && (
            <div
              className={`p-6 rounded-lg border text-center text-gray-400 text-sm ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              No items found.
            </div>
          )}

          {filteredItems.map((item) => {
            const isClaimed = claims.some((c) => c.itemId === (item.id || item._id));
            return (
              <div
                key={item.id || item._id}
                className={`p-5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-sm ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-base">{item.title}</h2>
                    {isClaimed && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                        Claimed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {item.category || "IT4B"} • 📍 {item.location}
                  </p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>

                <button
                  onClick={() =>
                    handleClaimItem(item.id || item._id || "", item.title || "Item")
                  }
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isClaimed
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isClaimed ? "Claimed ✓" : "Claim Item"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Report New Item Form */}
        <div
          className={`p-6 rounded-lg border space-y-4 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-lg font-bold">Report Lost / Found Item</h2>
          <form onSubmit={handleCreateItem} className="space-y-3">
            <input
              type="text"
              placeholder="Item Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className={`w-full p-2.5 rounded border text-sm focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Location Found/Lost"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className={`w-full p-2.5 rounded border text-sm focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
                required
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className={`w-full p-2.5 rounded border text-sm focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                <option value="General">General</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Documents">Documents</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className={`w-full p-2.5 rounded border text-sm focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              rows={2}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Report Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}