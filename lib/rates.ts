import { Currency } from "./types";

export const MAD_RATES: Record<Currency, number> = {
  MAD: 1,
  USD: 10.05,
  EUR: 10.9,
  CNY: 1.38,
};

export function toMAD(amount: number, currency: Currency): number {
  return amount * MAD_RATES[currency];
}

export function formatMAD(amount: number): string {
  return `MAD ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))}`;
}
