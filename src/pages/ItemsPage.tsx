import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // ✅ Fixed import
import { api, type Item, type NewItem } from "../api/client";

export default function ItemsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");

  const { data: items, isLoading, error } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: () => api.getItems(),
  });

  const createMutation = useMutation<Item, Error, NewItem>({
    mutationFn: (newItem: NewItem) => api.createItem(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setName("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, category, status: "Unclaimed" });
  };

  if (isLoading) return <div className="p-6 text-gray-900 dark:text-gray-100">Loading items...</div>;
  if (error) return <div className="p-6 text-red-500 dark:text-red-400">Error loading items.</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Items Collection
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <input
          type="text"
          placeholder="New Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="Electronics">Electronics</option>
          <option value="Personal Accessories">Personal Accessories</option>
          <option value="Documents">Documents</option>
        </select>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {createMutation.isPending ? "Adding..." : "Add Item"}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items?.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm transition-colors hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Category: {item.category}
            </p>
            <div className="mt-3">
              <span
                className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
                  item.status?.toLowerCase() === "claimed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {item.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}