import React, { useState } from "react";
import ItemCard from "./components/ItemCard";
import ClaimBadge from "./components/ClaimBadge";
import UserCard from "./components/UserCard";
import type { User, Item } from "./types/index";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Mock data matching types/index.ts
  const mockUser: User = {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
  };

  const mockItem: Item = {
    id: 101,
    title: "Black Backpack",
    description: "Contains a notebook and water bottle.",
    category: "Personal Items",
    location: "Library Second Floor",
    reportedBy: 1,
  };

  // Typed React.ChangeEvent<HTMLSelectElement> handler required by professor
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedCategory(e.target.value);
    console.log("Selected Category:", e.target.value);
  };

  const handleUserSelect = (user: User): void => {
    console.log("Selected user:", user.name);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <h1 className="text-2xl font-bold border-b border-gray-700 pb-4">
        Lost & Found Management (GT2 Part 1)
      </h1>

      {/* Select Element with Typed Event Handler */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 max-w-md">
        <label className="block mb-2 text-sm font-medium">
          Filter Category (Typed Event Handler):
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Personal Items">Personal Items</option>
          <option value="Documents">Documents</option>
        </select>
        <p className="mt-2 text-xs text-gray-400">
          Current Filter: <span className="text-blue-400">{selectedCategory}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Component 1: UserCard */}
        <div>
          <h2 className="text-lg font-semibold mb-2">User Card</h2>
          <UserCard user={mockUser} onSelect={handleUserSelect} />
        </div>

        {/* Component 2: ItemCard */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Item Card</h2>
          <ItemCard item={mockItem} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Component 3: ClaimBadge */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Claim Badges</h2>
          <div className="flex flex-col gap-2 items-start bg-gray-800 p-5 rounded-xl border border-gray-700">
            <ClaimBadge status="Pending" />
            <ClaimBadge status="Approved" />
            <ClaimBadge status="Rejected" />
          </div>
        </div>
      </div>
    </div>
  );
}