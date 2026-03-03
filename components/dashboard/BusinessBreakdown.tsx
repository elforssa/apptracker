"use client";

import { Transaction, BUSINESSES, Currency } from "@/lib/types";
import { formatCurrency, getBusinessSummaries } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  displayCurrency: Currency;
}

export default function BusinessBreakdown({ transactions, displayCurrency }: Props) {
  const summaries = getBusinessSummaries(transactions, BUSINESSES);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Per-Business Breakdown</h2>
      <div className="space-y-4">
        {summaries.map((s) => (
          <div key={s.business_id} className="border border-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  s.business_id === "china-mastery" ? "bg-blue-500" : "bg-violet-500"
                )} />
                <span className="font-semibold text-slate-800 text-sm">{s.business_name}</span>
              </div>
              <span className={cn(
                "text-sm font-bold",
                s.net_profit >= 0 ? "text-emerald-600" : "text-red-500"
              )}>
                {s.net_profit < 0 ? "-" : "+"}{formatCurrency(Math.abs(s.net_profit), displayCurrency)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg px-3 py-2">
                <p className="text-emerald-600 text-xs font-medium mb-0.5">Income</p>
                <p className="text-emerald-700 font-semibold text-sm">
                  {formatCurrency(s.total_income, displayCurrency)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg px-3 py-2">
                <p className="text-red-500 text-xs font-medium mb-0.5">Expenses</p>
                <p className="text-red-600 font-semibold text-sm">
                  {formatCurrency(s.total_expenses, displayCurrency)}
                </p>
              </div>
            </div>
            {(s.total_income + s.total_expenses) > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Expense ratio</span>
                  <span>
                    {s.total_income > 0
                      ? Math.round((s.total_expenses / s.total_income) * 100)
                      : 100}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        s.total_income > 0
                          ? Math.round((s.total_income / (s.total_income + s.total_expenses)) * 100)
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
