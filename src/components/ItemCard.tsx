import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  variant?: "default" | "compact";
  onCategoryChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function ItemCard({ item, variant = "default", onCategoryChange }: ItemCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`rounded-xl border border-gray-700 bg-gray-800 shadow-sm ${
        isCompact ? "p-3" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`flex items-center gap-1 font-semibold text-white ${
            isCompact ? "mb-1 text-sm" : "mb-3 text-base"
          }`}
        >
          🧳 {item.title}
        </h3>
      </div>

      {!isCompact && item.description && (
        <p className="my-1 text-sm text-gray-200">
          {item.description}
        </p>
      )}

      {item.category && (
        <p
          className={`my-1 text-gray-300 ${
            isCompact ? "text-xs" : "text-sm"
          }`}
        >
          Category: <span className="text-white">{item.category}</span>
        </p>
      )}

      {item.location && (
        <p
          className={`my-1 text-gray-300 ${
            isCompact ? "text-xs" : "text-sm"
          }`}
        >
          Location: <span className="text-white">{item.location}</span>
        </p>
      )}

      {!isCompact && item.reportedBy && (
        <p className="my-1 text-sm text-gray-400">
          Reported by User #{item.reportedBy}
        </p>
      )}

      {onCategoryChange && (
        <div className="mt-3">
          <label className="block mb-1 text-xs text-gray-400">Filter Category:</label>
          <select 
            onChange={onCategoryChange}
            className="w-full bg-gray-700 text-white text-xs rounded p-1.5 border border-gray-600"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Personal Items">Personal Items</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ItemCard;