"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BusinessBreakdown from "@/components/dashboard/BusinessBreakdown";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { useApp } from "@/context/AppContext";
import { Currency, CURRENCIES } from "@/lib/types";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { transactions, loading, fetchTransactions } = useApp();
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Overview across all businesses
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Summary Cards */}
        <div className="mb-6">
          <SummaryCards transactions={transactions} displayCurrency={displayCurrency} />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <ExpenseChart transactions={transactions} displayCurrency={displayCurrency} />
          </div>
          <div>
            <BusinessBreakdown transactions={transactions} displayCurrency={displayCurrency} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
