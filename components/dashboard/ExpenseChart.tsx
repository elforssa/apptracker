"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Transaction, Currency } from "@/lib/types";
import { getCategoryTotals, formatCurrency } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  displayCurrency: Currency;
}

const COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
  "#f97316", "#6366f1", "#14b8a6",
];

export default function ExpenseChart({ transactions, displayCurrency }: Props) {
  const data = getCategoryTotals(transactions);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-center min-h-[280px]">
        <p className="text-slate-400 text-sm">No expense data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-5">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={(v) => `${formatCurrency(v, displayCurrency)}`}
            width={80}
          />
          <Tooltip
            formatter={(value: number | undefined) => [formatCurrency(value ?? 0, displayCurrency), "Amount"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
