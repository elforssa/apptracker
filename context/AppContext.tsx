"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Transaction,
  TransactionFilters,
  UserName,
  BUSINESSES,
} from "@/lib/types";

interface AppContextType {
  currentUser: UserName | null;
  setCurrentUser: (user: UserName | null) => void;
  transactions: Transaction[];
  loading: boolean;
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "id" | "created_at" | "business_name">) => Promise<string>;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, "id" | "created_at" | "business_name">>) => Promise<string>;
  deleteTransaction: (id: string) => Promise<string>;
}

const defaultFilters: TransactionFilters = {
  business_id: "all",
  type: "all",
  category: "all",
  added_by: "all",
  paid_from: "all",
  reimbursed: "all",
  date_from: "",
  date_to: "",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserName | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);

  const setCurrentUser = (user: UserName | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("apptracker_user", user);
    } else {
      localStorage.removeItem("apptracker_user");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("apptracker_user") as UserName | null;
    if (saved === "Maroine" || saved === "Partner") {
      setCurrentUserState(saved);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (filters.business_id !== "all") {
        query = query.eq("business_id", filters.business_id);
      }
      if (filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.added_by !== "all") {
        query = query.eq("added_by", filters.added_by);
      }
      if (filters.paid_from !== "all") {
        query = query.eq("paid_from", filters.paid_from);
      }
      if (filters.reimbursed === "pending") {
        query = query.eq("paid_from", "personal").eq("reimbursed", false);
      } else if (filters.reimbursed === "reimbursed") {
        query = query.eq("reimbursed", true);
      }
      if (filters.date_from) {
        query = query.gte("date", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("date", filters.date_to);
      }

      const { data, error } = await query;
      if (error) throw error;

      const enriched = (data || []).map((t: Transaction) => ({
        ...t,
        business_name: BUSINESSES.find((b) => b.id === t.business_id)?.name,
      }));
      setTransactions(enriched);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (
    data: Omit<Transaction, "id" | "created_at" | "business_name">
  ) => {
    const { error } = await supabase.from("transactions").insert([data]);
    if (error) throw error;
    await fetchTransactions();
    return "added";
  };

  const updateTransaction = async (
    id: string,
    data: Partial<Omit<Transaction, "id" | "created_at" | "business_name">>
  ) => {
    const { error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id);
    if (error) throw error;
    await fetchTransactions();
    return "updated";
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await fetchTransactions();
    return "deleted";
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        transactions,
        loading,
        filters,
        setFilters,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
