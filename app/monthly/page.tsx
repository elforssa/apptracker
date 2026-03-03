"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import MonthlyTable from "@/components/monthly/MonthlyTable";
import MonthlyTrendChart from "@/components/monthly/MonthlyTrendChart";
import { useApp } from "@/context/AppContext";
import { Currency, CURRENCIES } from "@/lib/types";
import { getMonthlySummaries } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

export default function MonthlyPage() {
  const { transactions, loading, fetchTransactions } = useApp();
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");
  const [view, setView] = useState<"table" | "chart">("table");

  const rows = getMonthlySummaries(transactions, [
    { id: "china-mastery", name: "China Mastery" },
    { id: "ruya-services", name: "RUYA Services" },
  ]);

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Monthly Summary</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {rows.length > 0
                ? `${rows.length} month${rows.length !== 1 ? "s" : ""} of data`
                : "No data yet"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
              {(["table", "chart"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                    view === v ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Quick stat pills */}
        {rows.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {(() => {
              const grand = rows.reduce(
                (acc, r) => ({
                  income: acc.income + r.totals.income,
                  expenses: acc.expenses + r.totals.expenses,
                  profit: acc.profit + r.totals.profit,
                }),
                { income: 0, expenses: 0, profit: 0 }
              );
              return (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700 text-xs font-medium">
                      All-time income: {grand.income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-red-600 text-xs font-medium">
                      All-time expenses: {grand.expenses.toLocaleString()}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full ${
                    grand.profit >= 0 ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${grand.profit >= 0 ? "bg-blue-500" : "bg-red-500"}`} />
                    <span className={`text-xs font-medium ${grand.profit >= 0 ? "text-blue-700" : "text-red-600"}`}>
                      Net profit: {grand.profit >= 0 ? "+" : ""}{grand.profit.toLocaleString()}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Content */}
        {view === "table" ? (
          <MonthlyTable rows={rows} displayCurrency={displayCurrency} />
        ) : (
          <MonthlyTrendChart rows={rows} displayCurrency={displayCurrency} />
        )}
      </div>
    </AppShell>
  );
}
