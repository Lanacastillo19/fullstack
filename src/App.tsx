import React, { useState, useEffect } from "react";
import type { User, Item } from "./types/index";

export type CreateItemDTO = {
  title: string;
  description: string;
  location: string;
  category: string;
};

// API Helper adhering to GT4 Part 2 guidelines
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<CreateItemDTO>({
    title: "",
    description: "",
    location: "",
    category: "General",
  });

  // Active Session User Profile (id updated to string)
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
      
      // Fetch public GET endpoint from backend
      const res = await request<{ success: boolean; data: Item[] }>("/api/items");

      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server. Displaying local state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description || !newItem.location) return;

    const payload = {
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

      if (result.success) {
        setNewItem({ title: "", description: "", location: "", category: "General" });
        fetchItems();
      }
    } catch (err) {
      console.error("Error creating item:", err);
      // Fallback: update local UI state if backend is offline
      const localItem: Item = {
        id: String(Date.now()),
        ...payload,
        reportedBy: mockUser.id,
        status: "Unclaimed",
      };
      setItems((prev) => [localItem, ...prev]);
      setNewItem({ title: "", description: "", location: "", category: "General" });
    }
  };

  const filteredItems = items.filter((item) =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <h1 className="text-2xl font-bold border-b border-gray-700 pb-4">
        Lost & Found Management (GT4 Integration)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Active Session</h2>
          <p className="font-bold">{mockUser.name}</p>
          <p className="text-sm text-gray-400">{mockUser.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded">
            {mockUser.role}
          </span>
        </div>

        {/* Report Lost Item Form */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Report Lost Item</h2>
          <form onSubmit={handleCreateItem} className="space-y-3">
            <input
              type="text"
              placeholder="Item Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Location Found/Lost"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                required
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none text-white"
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
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
              rows={2}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded font-medium hover:bg-blue-500 transition-colors"
            >
              Report Item
            </button>
          </form>
        </div>
      </div>

      {/* Reported Items List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold">Reported Items</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1 rounded bg-gray-800 text-sm border border-gray-700"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Electronics">Electronics</option>
            <option value="Personal Items">Personal Items</option>
            <option value="Documents">Documents</option>
          </select>
        </div>

        {loading && <p className="text-gray-400">Loading items...</p>}
        {error && <p className="text-amber-400 text-sm">{error}</p>}

        {!loading && filteredItems.length === 0 && (
          <p className="text-gray-400">No reported items found in the database.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                  {item.category || "General"}
                </span>
              </div>
              <p className="text-sm text-gray-300">{item.description}</p>
              <p className="text-xs text-blue-400">📍 {item.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}