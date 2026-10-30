"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "error";
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = "text-emerald-500";
        let borderColor = "border-slate-200";

        if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-rose-500";
        } else if (toast.type === "info") {
          Icon = Info;
          iconColor = "text-indigo-500";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border ${borderColor} bg-white px-4 py-3 shadow-lg animate-fade-in text-xs text-slate-800`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
              <span className="font-medium">{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
