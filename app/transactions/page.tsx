"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionModal from "@/components/transactions/TransactionModal";
import { useApp } from "@/context/AppContext";
import { exportTransactionsCSV } from "@/lib/utils";
import { MAD_RATES } from "@/lib/rates";
import { Plus, Download, Info } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, loading } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Transactions</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? "Loading…" : `${transactions.length} record${transactions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {transactions.length > 0 && (
              <button
                onClick={() => exportTransactionsCSV(transactions)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white text-slate-600 text-sm font-medium rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Currency rates banner */}
        <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setRatesOpen((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-amber-800 text-xs font-medium">
                MAD conversion rates (static — update in <code className="bg-amber-100 px-1 rounded">lib/rates.ts</code>)
              </p>
            </div>
            <span className="text-amber-500 text-xs ml-2">{ratesOpen ? "▲" : "▼"}</span>
          </div>
          {ratesOpen && (
            <div className="mt-2 flex flex-wrap gap-3">
              {(Object.entries(MAD_RATES) as [string, number][])
                .filter(([c]) => c !== "MAD")
                .map(([currency, rate]) => (
                  <span key={currency} className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-lg font-mono">
                    1 {currency} = {rate} MAD
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 text-xs font-medium">
              {transactions.filter((t) => t.type === "income").length} income
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-600 text-xs font-medium">
              {transactions.filter((t) => t.type === "expense").length} expenses
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <TransactionFilters />
        </div>

        {/* Table / card list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
          <TransactionList />
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  );
}
