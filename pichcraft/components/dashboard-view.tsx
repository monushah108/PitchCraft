"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  MailCheck,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  Clock,
  MoreVertical,
  CheckCircle2,
  FileEdit,
  Copy,
  AlertCircle,
  Building,
} from "lucide-react";
import { EmailRecord, NavigationTab } from "../app/types";
import { OUTREACH_STATS } from "../app/data/sample-data";

interface DashboardViewProps {
  onNavigateToCompose: () => void;
  onNavigateToHistory: () => void;
  onPreviewEmail: (email: EmailRecord) => void;
  emails: EmailRecord[];
  onCopyEmail: (body: string) => void;
}

export function DashboardView({
  onNavigateToCompose,
  onNavigateToHistory,
  onPreviewEmail,
  emails,
  onCopyEmail,
}: DashboardViewProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const recentEmails = emails
    .filter((e) => {
      const matchesSearch =
        e.recipientName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        e.company.toLowerCase().includes(filterQuery.toLowerCase()) ||
        e.subject.toLowerCase().includes(filterQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || e.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .slice(0, 5);

  const stats = [
    {
      title: "Total Emails Sent",
      value: OUTREACH_STATS.totalSent,
      change: "+18% this month",
      trend: "up",
      icon: Send,
      description: "Direct pitches to recruiters",
    },
    {
      title: "Emails Generated",
      value: OUTREACH_STATS.emailsGenerated,
      change: "2.0x drafts created",
      trend: "up",
      icon: Sparkles,
      description: "AI tailored variations",
    },
    {
      title: "Emails Opened",
      value: OUTREACH_STATS.emailsOpened,
      change: "69.0% open rate",
      trend: "up",
      icon: Eye,
      description: "Industry average: 38%",
    },
    {
      title: "Response Rate",
      value: OUTREACH_STATS.responseRate,
      change: "+5.4% vs industry",
      trend: "up",
      icon: TrendingUp,
      description: "18 recruiter screens booked",
    },
  ];

  const getStatusBadge = (status: EmailRecord["status"]) => {
    switch (status) {
      case "Replied":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 border border-indigo-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Replied
          </span>
        );
      case "Opened":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Opened
          </span>
        );
      case "Sent":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Sent
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Draft
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Greeting Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Good morning, Monu
            </h2>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/50">
              Active Job Search
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Let&apos;s make your next career opportunity happen. You have{" "}
            <span className="font-medium text-slate-800">16 credits remaining</span>{" "}
            this billing cycle.
          </p>
        </div>

        <button
          onClick={onNavigateToCompose}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="h-4 w-4 text-indigo-200" />
          <span>Create New Email</span>
        </button>
      </div>

      {/* 2. Compact Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {stat.title}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Outreach Activity Chart + Quick Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Activity Visualization */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Outreach Activity
              </h3>
              <p className="text-xs text-slate-500">
                Emails sent vs opened across the past 7 days
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                Sent
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Opened
              </span>
            </div>
          </div>

          {/* Clean SVG Bar Visualization */}
          <div className="mt-6 flex h-48 items-end gap-3 sm:gap-6 px-2">
            {OUTREACH_STATS.weeklyActivity.map((item, index) => {
              const maxSent = 18;
              const sentHeight = (item.sent / maxSent) * 100;
              const openHeight = (item.opened / maxSent) * 100;

              return (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {item.sent}s / {item.opened}o
                  </div>
                  <div className="flex w-full max-w-[28px] items-end justify-center gap-1">
                    <div
                      style={{ height: `${sentHeight}%` }}
                      className="w-1/2 rounded-t-sm bg-indigo-600 group-hover:bg-indigo-700 transition-all duration-300"
                      title={`${item.day}: ${item.sent} Sent`}
                    />
                    <div
                      style={{ height: `${openHeight}%` }}
                      className="w-1/2 rounded-t-sm bg-blue-300 group-hover:bg-blue-400 transition-all duration-300"
                      title={`${item.day}: ${item.opened} Opened`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50/80 p-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Peak engagement window:{" "}
              <strong className="text-slate-800">Tuesday 9:00 AM - 11:30 AM</strong>
            </span>
            <span className="text-emerald-600 font-medium">
              82% open likelihood
            </span>
          </div>
        </div>

        {/* Quick Pitch Starter Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                PRO TIP
              </span>
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              Personalize with recent engineering blogs
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Emails that cite a specific technical challenge or open-source repo
              achieve a <strong className="text-slate-700">2.4x higher reply rate</strong> from engineering recruiters.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Trending Targets Today
              </div>
              <div className="space-y-1.5">
                {[
                  { name: "Stripe", role: "Frontend Platform", domain: "stripe.com" },
                  { name: "Linear", role: "Workflows UI", domain: "linear.app" },
                  { name: "OpenAI", role: "Platform Eng", domain: "openai.com" },
                ].map((target, idx) => (
                  <button
                    key={idx}
                    onClick={onNavigateToCompose}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-xs hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                        {target.name[0]}
                      </span>
                      <span className="font-medium text-slate-800">
                        {target.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      {target.role}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToCompose}
            className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Launch Outreach Composer
          </button>
        </div>
      </div>

      {/* 4. Recent Email Activity Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Email Activity
            </h3>
            <p className="text-xs text-slate-500">
              Track delivery, opens, and recruiter responses in real-time
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter recent..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-36 sm:w-48 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Replied">Replied</option>
              <option value="Opened">Opened</option>
              <option value="Sent">Sent</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-5">Recipient</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No emails match the selected filter.
                  </td>
                </tr>
              ) : (
                recentEmails.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Recipient */}
                    <td className="py-3 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {email.recipientName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {email.recipientEmail}
                        </span>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 max-w-xs">
                      <span className="truncate block font-normal text-slate-700">
                        {email.subject}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(email.status)}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {email.date}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onPreviewEmail(email)}
                          title="View Email Preview"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onCopyEmail(email.body)}
                          title="Copy Body"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={onNavigateToCompose}
                          title="Reuse in Composer"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Footer Link */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-5 py-3 text-xs text-slate-500">
          <span>Showing 5 of {emails.length} recent outreach records</span>
          <button
            onClick={onNavigateToHistory}
            className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            <span>View Full Outreach History</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
