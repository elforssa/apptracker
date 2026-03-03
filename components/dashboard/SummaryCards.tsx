"use client";

import { Transaction, BUSINESSES, Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  displayCurrency: Currency;
}

export default function SummaryCards({ transactions, displayCurrency }: Props) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(totalIncome, displayCurrency),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses, displayCurrency),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      label: "Net Profit",
      value: formatCurrency(Math.abs(netProfit), displayCurrency),
      prefix: netProfit < 0 ? "-" : "",
      icon: DollarSign,
      color: netProfit >= 0 ? "text-blue-600" : "text-red-500",
      bg: netProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      border: netProfit >= 0 ? "border-blue-100" : "border-red-100",
    },
    {
      label: "Transactions",
      value: transactions.length.toString(),
      icon: BarChart3,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "bg-white rounded-xl p-5 border shadow-sm",
              card.border
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">{card.label}</p>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.bg)}>
                <Icon className={cn("w-4 h-4", card.color)} />
              </div>
            </div>
            <p className={cn("text-xl font-bold", card.color)}>
              {card.prefix}{card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
