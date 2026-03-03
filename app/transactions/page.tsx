"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionModal from "@/components/transactions/TransactionModal";
import { useApp } from "@/context/AppContext";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, loading } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Transactions</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? "Loading…" : `${transactions.length} record${transactions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 text-xs font-medium">
              {transactions.filter((t) => t.type === "income").length} income entries
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-600 text-xs font-medium">
              {transactions.filter((t) => t.type === "expense").length} expense entries
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <TransactionFilters />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
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
