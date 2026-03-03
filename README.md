# AppTracker

Full-stack expense & income tracker for **China Mastery** and **RUYA Services**.

Built with Next.js 16, Supabase, Tailwind CSS, and Recharts.

---

## Setup

### 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the **SQL Editor**, run the contents of `supabase/schema.sql` to create the `transactions` table.
3. Copy your **Project URL** and **anon public key** from **Settings → API**.

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
APP_PASSWORD=your-shared-password
```

`APP_PASSWORD` is the single shared password shown on the login screen. It is stored server-side only and never exposed to the browser. The session is saved in an `httpOnly` cookie valid for 30 days.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

- **Two businesses**: China Mastery & RUYA Services
- **Two users**: Maroine & Partner (simple name-based login)
- **Dashboard**: Summary cards (income, expenses, net profit), per-business breakdown, expense category bar chart
- **Transactions**: Full CRUD with filters by business, type, category, user, and date range
- **Multi-currency**: CNY, MAD, USD, EUR
- **Expense categories**: Travel, Accommodation, Marketing, Software, Office, Shipping, Samples, Food & Entertainment, Translation, Legal, Other
- **Income categories**: Client Payment, Consulting Fee, Commission, Service Fee, Other

## Project Structure

```
app/
  page.tsx              # Login (user selection)
  dashboard/page.tsx    # Dashboard
  transactions/page.tsx # Transaction list
components/
  layout/               # Sidebar, AppShell
  dashboard/            # SummaryCards, BusinessBreakdown, ExpenseChart
  transactions/         # TransactionList, TransactionFilters, TransactionModal
context/AppContext.tsx   # Global state + Supabase calls
lib/
  types.ts              # TypeScript types & constants
  supabase.ts           # Supabase client (lazy)
  utils.ts              # Helpers (formatCurrency, etc.)
supabase/schema.sql     # Database schema
```
