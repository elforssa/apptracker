import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, CURRENCY_SYMBOLS, Transaction, BusinessSummary, BusinessName } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${symbol} ${formatted}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getBusinessSummaries(
  transactions: Transaction[],
  businesses: { id: string; name: BusinessName }[]
): BusinessSummary[] {
  return businesses.map((business) => {
    const bizTransactions = transactions.filter(
      (t) => t.business_id === business.id
    );
    const total_income = bizTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const total_expenses = bizTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      business_id: business.id,
      business_name: business.name,
      total_income,
      total_expenses,
      net_profit: total_income - total_expenses,
    };
  });
}

export function getCategoryTotals(
  transactions: Transaction[]
): { category: string; amount: number }[] {
  const totals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
