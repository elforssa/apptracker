"use client";

import { useEffect } from "react";
import { X, ExternalLink, FileText } from "lucide-react";

interface Props {
  url: string;
  onClose: () => void;
}

export default function InvoiceViewerModal({ url, onClose }: Props) {
  const isPDF = url.toLowerCase().includes(".pdf") || url.includes("/raw/");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Invoice / Receipt
          </span>
          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center min-h-[300px]">
          {isPDF ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-slate-700 font-medium text-sm">PDF Document</p>
                <p className="text-slate-400 text-xs mt-1">PDFs can't be previewed inline</p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open PDF
              </a>
            </div>
          ) : (
            <img
              src={url}
              alt="Invoice"
              className="max-w-full max-h-[75vh] object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
