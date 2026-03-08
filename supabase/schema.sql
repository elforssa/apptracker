-- AppTracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Transactions table
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  business_id text not null check (business_id in ('china-mastery', 'ruya-services')),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null check (currency in ('CNY', 'MAD', 'USD', 'EUR')),
  category text not null,
  description text not null,
  date date not null,
  added_by text not null check (added_by in ('Maroine', 'Partner')),
  created_at timestamptz not null default now()
);

-- Index for common query patterns
create index if not exists idx_transactions_business_id on transactions (business_id);
create index if not exists idx_transactions_date on transactions (date desc);
create index if not exists idx_transactions_type on transactions (type);
create index if not exists idx_transactions_added_by on transactions (added_by);

-- Add invoice_url column (run this if upgrading an existing database)
-- alter table transactions add column if not exists invoice_url text;

-- Row Level Security (RLS) - enable and allow all for now (no auth)
alter table transactions enable row level security;

-- Policy: allow all operations (since we're using simple name-based auth)
create policy "Allow all operations" on transactions
  for all
  using (true)
  with check (true);

-- Seed businesses reference data (optional, handled in app)
-- China Mastery ID: 'china-mastery'
-- RUYA Services ID: 'ruya-services'

-- Sample seed data (optional - remove if you want a clean start)
-- insert into transactions (business_id, type, amount, currency, category, description, date, added_by) values
--   ('china-mastery', 'income', 5000.00, 'USD', 'Client Payment', 'Business trip package - April', '2025-04-01', 'Maroine'),
--   ('china-mastery', 'expense', 1200.00, 'CNY', 'Travel', 'Flight Beijing-Shanghai', '2025-04-02', 'Maroine'),
--   ('ruya-services', 'income', 3000.00, 'USD', 'Commission', 'Sourcing commission - electronics batch', '2025-04-05', 'Partner'),
--   ('ruya-services', 'expense', 450.00, 'USD', 'Samples', 'Product samples from Guangzhou supplier', '2025-04-06', 'Partner');
