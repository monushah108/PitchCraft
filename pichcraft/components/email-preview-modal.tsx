"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  FileEdit,
  Mail,
  Building,
  Calendar,
  Sparkles,
  Send,
} from "lucide-react";
import { EmailRecord } from "../app/types";

interface EmailPreviewModalProps {
  email: EmailRecord | null;
  onClose: () => void;
  onReuse: (email: EmailRecord) => void;
  onCopy: (body: string) => void;
}

export function EmailPreviewModal({
  email,
  onClose,
  onReuse,
  onCopy,
}: EmailPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!email) return null;

  const handleCopy = () => {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard?.writeText(text);
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Email Details
              </h3>
              <p className="text-xs text-slate-500">
                {email.company} • {email.jobPosition}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Recipient:</span>
              <span className="font-semibold text-slate-800">
                {email.recipientName} &lt;{email.recipientEmail}&gt;
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="text-slate-600">{email.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-medium text-indigo-700">{email.status}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-start gap-2">
              <span className="text-slate-400 font-semibold shrink-0">
                Subject:
              </span>
              <span className="font-semibold text-slate-900">
                {email.subject}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Message Content
            </div>
            <div className="whitespace-pre-line rounded-lg border border-slate-200 bg-white p-4 font-sans text-xs leading-relaxed text-slate-800">
              {email.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onReuse(email);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span>Open & Edit in Composer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
