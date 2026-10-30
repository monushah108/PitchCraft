"use client";

import React from "react";
import {
  TrendingUp,
  Send,
  Eye,
  MessageSquare,
  Award,
  Building,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { OUTREACH_STATS } from "../app/data/sample-data";

export function AnalyticsView() {
  const metrics = [
    {
      label: "Total Emails Sent",
      value: "142",
      delta: "+24% vs last month",
      subtext: "100% deliverability rate",
      icon: Send,
    },
    {
      label: "Average Open Rate",
      value: "69.0%",
      delta: "+12.4% vs industry average",
      subtext: "Top 5% among job outreach",
      icon: Eye,
    },
    {
      label: "Recruiter Reply Rate",
      value: "34.2%",
      delta: "+5.1% increase",
      subtext: "48 recruiter conversations",
      icon: MessageSquare,
    },
    {
      label: "Interviews Booked",
      value: "18",
      delta: "12.6% pipeline conversion",
      subtext: "3 active final rounds",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900">
          Outreach Performance Analytics
        </h2>
        <p className="text-xs text-slate-500">
          Real-time metrics on open rates, reply rates, and interview conversion
        </p>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">{m.label}</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {m.value}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  {m.delta}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{m.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Outreach Volume Over Time & Tone Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Trend Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Weekly Outreach & Engagement
              </h3>
              <p className="text-xs text-slate-500">
                Tracking daily volume and recruiter interactions
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                Sent
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-blue-300" />
                Opened
              </span>
            </div>
          </div>

          {/* Clean Visual Bar Chart */}
          <div className="mt-6 flex h-52 items-end gap-4 sm:gap-8 px-4">
            {OUTREACH_STATS.weeklyActivity.map((day, idx) => {
              const maxSent = 20;
              const sentHeight = (day.sent / maxSent) * 100;
              const openHeight = (day.opened / maxSent) * 100;

              return (
                <div
                  key={idx}
                  className="flex flex-1 flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {day.sent} sent
                  </div>
                  <div className="flex w-full max-w-[32px] items-end justify-center gap-1.5">
                    <div
                      style={{ height: `${sentHeight}%` }}
                      className="w-1/2 rounded-t-sm bg-indigo-600 transition-all duration-300 group-hover:bg-indigo-700"
                    />
                    <div
                      style={{ height: `${openHeight}%` }}
                      className="w-1/2 rounded-t-sm bg-blue-300 transition-all duration-300 group-hover:bg-blue-400"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tone Conversion Insights */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Tone Performance
            </h3>
            <p className="text-xs text-slate-500">
              Which tone gets the most recruiter replies
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Confident",
                replyRate: "42.5%",
                volume: "58 sent",
                width: "90%",
                badge: "Best Performer",
              },
              {
                name: "Professional",
                replyRate: "34.0%",
                volume: "45 sent",
                width: "75%",
                badge: "Solid",
              },
              {
                name: "Friendly",
                replyRate: "28.5%",
                volume: "24 sent",
                width: "60%",
                badge: "Good for startups",
              },
              {
                name: "Formal",
                replyRate: "21.0%",
                volume: "15 sent",
                width: "45%",
                badge: "Enterprise",
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-emerald-600 font-semibold">
                    {item.replyRate}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: item.width }}
                    className="h-full rounded-full bg-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.volume}</span>
                  <span>{item.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company-Wise Outreach Breakdown Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Company-Wise Outreach Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Performance metrics categorized by target organization
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-5">Target Company</th>
                <th className="py-3 px-4">Emails Sent</th>
                <th className="py-3 px-4">Opened</th>
                <th className="py-3 px-4">Replies</th>
                <th className="py-3 px-4">Conversion Rate</th>
                <th className="py-3 px-5 text-right">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {OUTREACH_STATS.companyBreakdown.map((item, index) => {
                const convRate = Math.round((item.replied / item.sent) * 100);
                return (
                  <tr key={index} className="hover:bg-slate-50/60">
                    <td className="py-3 px-5 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                          {item.company[0]}
                        </span>
                        <span>{item.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">{item.sent}</td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-medium">
                      {item.opened}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-600 font-semibold">
                      {item.replied}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${convRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-slate-600">
                          {convRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
