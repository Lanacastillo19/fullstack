import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Item } from "../api/client";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch Item
  const { data: item, isLoading, isError } = useQuery<Item, Error>({
    queryKey: ["item", id],
    queryFn: () => api.getItemById(id!),
    enabled: !!id,
  });

  // Mutation to update status
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => api.updateItemStatus(id!, newStatus),
    onSuccess: () => {
      // Invalidate queries so ItemListPage and ItemDetailPage re-render instantly
      queryClient.invalidateQueries({ queryKey: ["item", id] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center text-slate-100">Loading item details...</div>;
  }

  if (isError || !item) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-500 font-medium">Item not found.</p>
        <Link to="/items" className="inline-block rounded bg-blue-600 px-4 py-2 text-white">
          Back to Items
        </Link>
      </div>
    );
  }

  const isClaimed = item.status?.toLowerCase() === "claimed";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/items" className="mb-6 inline-block text-sm text-blue-400 hover:underline">
        &larr; Back to Items
      </Link>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-md text-white space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-slate-300 mt-1">Category: {item.category}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-700 pt-4">
          <div>
            <span className="text-sm text-slate-400 block mb-1">Status</span>
            <span
              className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
                isClaimed
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "bg-slate-700 text-slate-200"
              }`}
            >
              {item.status}
            </span>
          </div>

          <button
            onClick={() => updateStatusMutation.mutate(isClaimed ? "Unclaimed" : "Claimed")}
            disabled={updateStatusMutation.isPending}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isClaimed
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {updateStatusMutation.isPending
              ? "Updating..."
              : isClaimed
              ? "Mark as Unclaimed"
              : "Mark as Claimed"}
          </button>
        </div>
      </div>
    </div>
  );
}