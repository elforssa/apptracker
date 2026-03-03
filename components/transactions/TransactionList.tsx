"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Transaction, BUSINESSES } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionModal from "./TransactionModal";

export default function TransactionList() {
  const { transactions, loading, deleteTransaction } = useApp();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm font-medium">No transactions found</p>
        <p className="text-slate-400 text-xs mt-1">Add your first transaction or adjust filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Date</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Description</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Business</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Category</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">By</th>
              <th className="text-right text-xs font-medium text-slate-400 pb-3 pr-4">Amount</th>
              <th className="text-right text-xs font-medium text-slate-400 pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="py-3 pr-4 text-slate-700 font-medium max-w-[180px] truncate">
                  {t.description}
                </td>
                <td className="py-3 pr-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                    t.business_id === "china-mastery"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-violet-50 text-violet-600"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      t.business_id === "china-mastery" ? "bg-blue-500" : "bg-violet-500"
                    )} />
                    {t.business_name ?? BUSINESSES.find((b) => b.id === t.business_id)?.name}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {t.category}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {t.added_by[0]}
                    </div>
                    <span className="text-xs text-slate-500">{t.added_by}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right whitespace-nowrap">
                  <span className={cn(
                    "font-semibold",
                    t.type === "income" ? "text-emerald-600" : "text-red-500"
                  )}>
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount, t.currency)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{t.currency}</span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(t)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {confirmDelete === t.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={deletingId === t.id}
                          className="text-[10px] font-medium px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          {deletingId === t.id ? "…" : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-[10px] font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(t.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionModal
        open={!!editing}
        onClose={() => setEditing(null)}
        editingTransaction={editing}
      />
    </>
  );
}
