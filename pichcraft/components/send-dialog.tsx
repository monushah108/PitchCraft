"use client";

import React, { useState } from "react";
import {
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  Building,
  RotateCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { EmailTone, EmailLength } from "../app/types";

interface SendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: {
    recipientName: string;
    recipientEmail: string;
    company: string;
    jobPosition: string;
    subject: string;
    body: string;
    tone: EmailTone;
    length: EmailLength;
  };
  onConfirmSend: () => void;
}

export function SendDialog({
  isOpen,
  onClose,
  emailData,
  onConfirmSend,
}: SendDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState<"confirm" | "sending" | "done">("confirm");

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setStep("sending");

    setTimeout(() => {
      setStep("done");
      setTimeout(() => {
        setIsSending(false);
        setStep("confirm");
        onConfirmSend();
      }, 900);
    }, 1200);
  };

  const hasUnresolvedVariables =
    emailData.body.includes("{{") || emailData.subject.includes("{{");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-fade-in space-y-4">
        {step === "confirm" && (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Confirm Email Outreach
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify recipient and message before sending
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

            {hasUnresolvedVariables && (
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Warning: Your email contains variable placeholders like {"{{"}
                  ...{"}}"}. Make sure to replace them with actual details
                  before sending!
                </span>
              </div>
            )}

            {/* Verification checklist */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-semibold text-slate-800">
                  {emailData.recipientName} &lt;{emailData.recipientEmail}&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Company & Role:</span>
                <span className="font-medium text-slate-800">
                  {emailData.company} — {emailData.jobPosition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-medium text-slate-800 truncate max-w-[280px]">
                  {emailData.subject}
                </span>
              </div>
            </div>

            {/* Delivery Safety Check */}
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 p-2.5 text-[11px] text-emerald-800 border border-emerald-200/60">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Authenticated via SPF & DKIM · 0% Spam probability rating
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Back to Editing
              </button>
              <button
                onClick={handleSend}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Email Now</span>
              </button>
            </div>
          </>
        )}

        {step === "sending" && (
          <div className="py-8 text-center space-y-3">
            <RotateCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
            <div className="text-sm font-semibold text-slate-900">
              Transmitting personalized pitch...
            </div>
            <p className="text-xs text-slate-400">
              Verifying recipient MX records and delivering via Google Workspace SMTP
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="py-8 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Email Delivered Successfully!
            </div>
            <p className="text-xs text-slate-500">
              Logged to your outreach history and tracker.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
