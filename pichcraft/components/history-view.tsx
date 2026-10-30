"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Copy,
  FileEdit,
  Trash2,
  Calendar,
  Building,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { EmailRecord, EmailStatus } from "../app/types";

interface HistoryViewProps {
  emails: EmailRecord[];
  onPreviewEmail: (email: EmailRecord) => void;
  onReuseEmail: (email: EmailRecord) => void;
  onCopyEmail: (body: string) => void;
  onDeleteEmail: (id: string) => void;
}

export function HistoryView({
  emails,
  onPreviewEmail,
  onReuseEmail,
  onCopyEmail,
  onDeleteEmail,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filteredEmails = emails.filter((item) => {
    const matchesSearch =
      item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage) || 1;
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case "Replied":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 border border-indigo-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Replied
          </span>
        );
      case "Opened":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Opened
          </span>
        );
      case "Sent":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Sent
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Draft
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Search and Status Filter Pills */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Outreach History
            </h2>
            <p className="text-xs text-slate-500">
              Manage your sent pitches, follow-ups, and recruiter engagement
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Total records: {emails.length}
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recruiter, company, or subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Replied", "Opened", "Sent", "Draft", "Failed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-5">Recipient</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sent Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No outreach records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmails.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Recipient */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {email.recipientName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {email.recipientEmail}
                        </span>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                          {email.company[0]}
                        </span>
                        <span className="font-medium text-slate-800">
                          {email.company}
                        </span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex flex-col">
                        <span className="truncate font-medium text-slate-800">
                          {email.subject}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {email.jobPosition}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(email.status)}
                    </td>

                    {/* Sent Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {email.date}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onPreviewEmail(email)}
                          title="View Email Full Preview"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onCopyEmail(email.body)}
                          title="Copy Email Content"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onReuseEmail(email)}
                          title="Edit & Reuse in Composer"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEmail(email.id)}
                          title="Delete Email"
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredEmails.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * itemsPerPage, filteredEmails.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {filteredEmails.length}
            </span>{" "}
            results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
