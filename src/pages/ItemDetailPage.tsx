import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api, type Item } from "../api/client";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading, error } = useQuery<Item, Error>({
    queryKey: ["items", id],
    queryFn: () => api.getItemById(id || ""),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 text-center">
        Loading item details...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-6 text-center">
        Item not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto border border-gray-800 rounded bg-gray-900 p-8 mt-6 shadow-md flex flex-col items-center">
        <Link to="/items" className="text-blue-400 hover:underline mb-6 inline-block">
          &larr; Back to Items
        </Link>
        
        {/* Title - Forced White */}
        <h1 
          className="text-4xl font-bold mb-6 text-white" 
          style={{ color: "#ffffff" }}
        >
          {item.name}
        </h1>
        
        {/* Category - Forced White */}
        <p className="mt-2 text-lg text-white" style={{ color: "#ffffff" }}>
          Category: <span className="font-bold">{item.category}</span>
        </p>
        
        {/* Status - Forced White */}
        <p className="mt-1 text-lg text-white" style={{ color: "#ffffff" }}>
          Status: <span className="font-bold">{item.status}</span>
        </p>
        
        {/* ID - Forced White */}
        <p className="mt-6 text-sm text-white" style={{ color: "#ffffff" }}>
          ID: {item.id}
        </p>
      </div>
    </div>
  );
}