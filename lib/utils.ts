import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, CURRENCY_SYMBOLS, Transaction, BusinessSummary, BusinessName } from "./types";
import { toMAD } from "./rates";

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

export interface MonthlyBusinessData {
  income: number;
  expenses: number;
  profit: number;
}

export interface MonthlySummaryRow {
  monthKey: string;
  monthLabel: string;
  businesses: Record<string, MonthlyBusinessData>;
  totals: MonthlyBusinessData;
}

export function getMonthlySummaries(
  transactions: Transaction[],
  businesses: { id: string; name: BusinessName }[]
): MonthlySummaryRow[] {
  const map: Record<string, MonthlySummaryRow> = {};

  transactions.forEach((t) => {
    const [year, month] = t.date.split("-");
    const key = `${year}-${month}`;
    if (!map[key]) {
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      map[key] = {
        monthKey: key,
        monthLabel: label,
        businesses: Object.fromEntries(
          businesses.map((b) => [b.id, { income: 0, expenses: 0, profit: 0 }])
        ),
        totals: { income: 0, expenses: 0, profit: 0 },
      };
    }
    const biz = map[key].businesses[t.business_id];
    if (!biz) return;
    if (t.type === "income") {
      biz.income += t.amount;
      map[key].totals.income += t.amount;
    } else {
      biz.expenses += t.amount;
      map[key].totals.expenses += t.amount;
    }
    biz.profit = biz.income - biz.expenses;
    map[key].totals.profit = map[key].totals.income - map[key].totals.expenses;
  });

  return Object.values(map).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
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

export function exportTransactionsCSV(transactions: Transaction[]): void {
  const headers = [
    "Date",
    "Business",
    "Type",
    "Category",
    "Description",
    "Amount",
    "Currency",
    "MAD Equivalent",
    "Added By",
    "Paid From",
    "Reimbursed",
  ];

  const rows = transactions.map((t) => [
    t.date,
    t.business_name ?? t.business_id,
    t.type,
    t.category,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.currency,
    toMAD(t.amount, t.currency).toFixed(2),
    t.added_by,
    t.paid_from ?? "company",
    t.paid_from === "personal" ? (t.reimbursed ? "Yes" : "No") : "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
