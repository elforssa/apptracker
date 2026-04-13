export type BusinessName = "China Mastery" | "RUYA Services";
export type UserName = "Maroine" | "Partner";
export type Currency = "CNY" | "MAD" | "USD" | "EUR";
export type TransactionType = "expense" | "income";
export type PaidFrom = "company" | "personal";

export type ExpenseCategory =
  | "Travel"
  | "Accommodation"
  | "Marketing"
  | "Software"
  | "Office"
  | "Shipping"
  | "Samples"
  | "Food & Entertainment"
  | "Translation"
  | "Legal"
  | "Client Goods"
  | "Other";

export type IncomeCategory =
  | "Client Payment"
  | "Consulting Fee"
  | "Commission"
  | "Service Fee"
  | "Other";

export type Category = ExpenseCategory | IncomeCategory;

export interface Business {
  id: string;
  name: BusinessName;
  created_at: string;
}

export interface Transaction {
  id: string;
  business_id: string;
  business_name?: BusinessName;
  type: TransactionType;
  amount: number;
  currency: Currency;
  category: Category;
  description: string;
  date: string;
  added_by: UserName;
  paid_from: PaidFrom;
  reimbursed: boolean;
  invoice_url?: string | null;
  created_at: string;
}

export interface TransactionFilters {
  business_id: string;
  type: TransactionType | "all";
  category: Category | "all";
  added_by: UserName | "all";
  paid_from: PaidFrom | "all";
  reimbursed: "all" | "pending" | "reimbursed";
  date_from: string;
  date_to: string;
}

export interface BusinessSummary {
  business_id: string;
  business_name: BusinessName;
  total_income: number;
  total_expenses: number;
  net_profit: number;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Travel",
  "Accommodation",
  "Marketing",
  "Software",
  "Office",
  "Shipping",
  "Samples",
  "Food & Entertainment",
  "Translation",
  "Legal",
  "Client Goods",
  "Other",
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  "Client Payment",
  "Consulting Fee",
  "Commission",
  "Service Fee",
  "Other",
];

export const PAID_FROM_OPTIONS: { value: PaidFrom; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "personal", label: "Personal" },
];

export const CURRENCIES: Currency[] = ["CNY", "MAD", "USD", "EUR"];

export const USERS: UserName[] = ["Maroine", "Partner"];

export const BUSINESSES: { id: string; name: BusinessName }[] = [
  { id: "china-mastery", name: "China Mastery" },
  { id: "ruya-services", name: "RUYA Services" },
];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: "¥",
  MAD: "MAD",
  USD: "$",
  EUR: "€",
};
