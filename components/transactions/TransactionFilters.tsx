"use client";

import { useApp } from "@/context/AppContext";
import {
  BUSINESSES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  USERS,
  TransactionFilters as TFilters,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const defaultFilters: TFilters = {
  business_id: "all",
  type: "all",
  category: "all",
  added_by: "all",
  date_from: "",
  date_to: "",
};

export default function TransactionFilters() {
  const { filters, setFilters } = useApp();
  const [open, setOpen] = useState(false);

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const uniqueCategories = Array.from(new Set(allCategories));

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v !== "all" && v !== "" && k !== "type"
  ).length + (filters.type !== "all" ? 1 : 0);

  const handleReset = () => setFilters(defaultFilters);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Type quick filter */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilters({ ...filters, type: t })}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors capitalize cursor-pointer",
                filters.type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white"
                    : t === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        {/* Business quick filter */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          <button
            onClick={() => setFilters({ ...filters, business_id: "all" })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              filters.business_id === "all"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            All
          </button>
          {BUSINESSES.map((b) => (
            <button
              key={b.id}
              onClick={() => setFilters({ ...filters, business_id: b.id })}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                filters.business_id === b.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
            open || activeCount > 2
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="bg-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value as TFilters["category"] })
              }
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Added by</label>
            <select
              value={filters.added_by}
              onChange={(e) =>
                setFilters({ ...filters, added_by: e.target.value as TFilters["added_by"] })
              }
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Anyone</option>
              {USERS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
