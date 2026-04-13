"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const icon = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
  }[toast.type];

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-4 py-3 bg-white border rounded-xl shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        toast.type === "success" && "border-emerald-200",
        toast.type === "error" && "border-red-200",
        toast.type === "info" && "border-blue-200"
      )}
    >
      {icon}
      <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
