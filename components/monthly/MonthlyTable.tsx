"use client";

import { MonthlySummaryRow } from "@/lib/utils";
import { Currency, BUSINESSES } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  rows: MonthlySummaryRow[];
  displayCurrency: Currency;
}

export default function MonthlyTable({ rows, displayCurrency }: Props) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm font-medium">No transactions yet</p>
        <p className="text-slate-400 text-xs mt-1">Monthly summaries will appear here once you add transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 w-32">Month</th>
              {BUSINESSES.map((b) => (
                <th
                  key={b.id}
                  colSpan={3}
                  className={cn(
                    "text-center text-xs font-semibold px-2 py-3 border-l border-slate-200",
                    b.id === "china-mastery" ? "text-blue-600" : "text-violet-600"
                  )}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      b.id === "china-mastery" ? "bg-blue-500" : "bg-violet-500"
                    )} />
                    {b.name}
                  </span>
                </th>
              ))}
              <th colSpan={3} className="text-center text-xs font-semibold text-slate-600 px-2 py-3 border-l border-slate-200">
                Combined Total
              </th>
            </tr>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-5 py-2" />
              {[...BUSINESSES, { id: "total", name: "total" }].map((b) => (
                <>
                  <th key={`${b.id}-inc`} className="text-center text-[10px] font-medium text-emerald-600 px-3 py-2 border-l border-slate-100">
                    Income
                  </th>
                  <th key={`${b.id}-exp`} className="text-center text-[10px] font-medium text-red-500 px-3 py-2">
                    Expenses
                  </th>
                  <th key={`${b.id}-pro`} className="text-center text-[10px] font-medium text-slate-500 px-3 py-2">
                    Profit
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.monthKey} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <span className="font-medium text-slate-700 text-sm">{row.monthLabel}</span>
                </td>
                {BUSINESSES.map((b) => {
                  const d = row.businesses[b.id] ?? { income: 0, expenses: 0, profit: 0 };
                  return (
                    <>
                      <td key={`${b.id}-inc`} className="text-center px-3 py-3 border-l border-slate-100">
                        <span className="text-emerald-600 font-medium text-xs">
                          {d.income > 0 ? formatCurrency(d.income, displayCurrency) : "—"}
                        </span>
                      </td>
                      <td key={`${b.id}-exp`} className="text-center px-3 py-3">
                        <span className="text-red-500 font-medium text-xs">
                          {d.expenses > 0 ? formatCurrency(d.expenses, displayCurrency) : "—"}
                        </span>
                      </td>
                      <td key={`${b.id}-pro`} className="text-center px-3 py-3">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          d.profit > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : d.profit < 0
                            ? "bg-red-50 text-red-600"
                            : "text-slate-400"
                        )}>
                          {d.income === 0 && d.expenses === 0
                            ? "—"
                            : `${d.profit >= 0 ? "+" : ""}${formatCurrency(d.profit, displayCurrency)}`}
                        </span>
                      </td>
                    </>
                  );
                })}
                {/* Combined totals */}
                <td className="text-center px-3 py-3 border-l border-slate-200">
                  <span className="text-emerald-600 font-medium text-xs">
                    {row.totals.income > 0 ? formatCurrency(row.totals.income, displayCurrency) : "—"}
                  </span>
                </td>
                <td className="text-center px-3 py-3">
                  <span className="text-red-500 font-medium text-xs">
                    {row.totals.expenses > 0 ? formatCurrency(row.totals.expenses, displayCurrency) : "—"}
                  </span>
                </td>
                <td className="text-center px-3 py-3">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    row.totals.profit > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : row.totals.profit < 0
                      ? "bg-red-50 text-red-600"
                      : "text-slate-400"
                  )}>
                    {row.totals.income === 0 && row.totals.expenses === 0
                      ? "—"
                      : `${row.totals.profit >= 0 ? "+" : ""}${formatCurrency(row.totals.profit, displayCurrency)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Grand totals footer */}
          {rows.length > 1 && (() => {
            const grand = rows.reduce(
              (acc, r) => ({
                income: acc.income + r.totals.income,
                expenses: acc.expenses + r.totals.expenses,
                profit: acc.profit + r.totals.profit,
              }),
              { income: 0, expenses: 0, profit: 0 }
            );
            const bizGrand = BUSINESSES.map((b) => ({
              id: b.id,
              ...rows.reduce(
                (acc, r) => ({
                  income: acc.income + (r.businesses[b.id]?.income ?? 0),
                  expenses: acc.expenses + (r.businesses[b.id]?.expenses ?? 0),
                  profit: acc.profit + (r.businesses[b.id]?.profit ?? 0),
                }),
                { income: 0, expenses: 0, profit: 0 }
              ),
            }));
            return (
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-semibold">
                  <td className="px-5 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Total</td>
                  {bizGrand.map((b) => (
                    <>
                      <td key={`${b.id}-inc`} className="text-center px-3 py-3 border-l border-slate-200">
                        <span className="text-emerald-700 text-xs font-bold">{formatCurrency(b.income, displayCurrency)}</span>
                      </td>
                      <td key={`${b.id}-exp`} className="text-center px-3 py-3">
                        <span className="text-red-600 text-xs font-bold">{formatCurrency(b.expenses, displayCurrency)}</span>
                      </td>
                      <td key={`${b.id}-pro`} className="text-center px-3 py-3">
                        <span className={cn("text-xs font-bold", b.profit >= 0 ? "text-emerald-700" : "text-red-600")}>
                          {b.profit >= 0 ? "+" : ""}{formatCurrency(b.profit, displayCurrency)}
                        </span>
                      </td>
                    </>
                  ))}
                  <td className="text-center px-3 py-3 border-l border-slate-200">
                    <span className="text-emerald-700 text-xs font-bold">{formatCurrency(grand.income, displayCurrency)}</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className="text-red-600 text-xs font-bold">{formatCurrency(grand.expenses, displayCurrency)}</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={cn("text-xs font-bold", grand.profit >= 0 ? "text-emerald-700" : "text-red-600")}>
                      {grand.profit >= 0 ? "+" : ""}{formatCurrency(grand.profit, displayCurrency)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            );
          })()}
        </table>
      </div>
    </div>
  );
}
