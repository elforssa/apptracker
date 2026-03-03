"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlySummaryRow } from "@/lib/utils";
import { Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  rows: MonthlySummaryRow[];
  displayCurrency: Currency;
}

export default function MonthlyTrendChart({ rows, displayCurrency }: Props) {
  const chartData = [...rows].reverse().map((r) => ({
    month: r.monthLabel,
    "China Mastery Income": r.businesses["china-mastery"]?.income ?? 0,
    "China Mastery Expenses": r.businesses["china-mastery"]?.expenses ?? 0,
    "RUYA Income": r.businesses["ruya-services"]?.income ?? 0,
    "RUYA Expenses": r.businesses["ruya-services"]?.expenses ?? 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-center min-h-[260px]">
        <p className="text-slate-400 text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-5">Monthly Trend</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={(v) => formatCurrency(v, displayCurrency)}
            width={80}
          />
          <Tooltip
            formatter={(value: number | undefined) => [formatCurrency(value ?? 0, displayCurrency)]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Line type="monotone" dataKey="China Mastery Income" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="China Mastery Expenses" stroke="#93c5fd" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="RUYA Income" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="RUYA Expenses" stroke="#c4b5fd" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
