"use client";

import React from "react";
import {
  LayoutDashboard,
  PenSquare,
  History,
  Users,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
  LogOut,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { NavigationTab } from "../app/types";

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userProfile: {
    name: string;
    email: string;
    role: string;
    plan: string;
    creditsUsed: number;
    creditsTotal: number;
    initials: string;
  };
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  userProfile,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as NavigationTab,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "compose" as NavigationTab,
      label: "Compose Email",
      icon: PenSquare,
      badge: "AI",
      highlight: true,
    },
    {
      id: "history" as NavigationTab,
      label: "Email History",
      icon: History,
      count: "142",
    },
    {
      id: "contacts" as NavigationTab,
      label: "Contacts",
      icon: Users,
      count: "7",
    },
    {
      id: "templates" as NavigationTab,
      label: "Templates",
      icon: FileText,
      count: "6",
    },
    {
      id: "analytics" as NavigationTab,
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "settings" as NavigationTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  const percentageUsed = Math.round(
    (userProfile.creditsUsed / userProfile.creditsTotal) * 100
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-slate-900">
                  PitchCraft
                </span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 border border-indigo-200/50">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Outreach Platform
              </span>
            </div>
          </div>
        </div>

        {/* Quick Compose Action Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              onSelectTab("compose");
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-semibold text-white shadow-xs transition-all ${
              currentTab === "compose"
                ? "bg-indigo-700 ring-2 ring-indigo-500/30"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            <span>Generate Pitch</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 border border-indigo-100">
                    {item.badge}
                  </span>
                )}
                {item.count && !isActive && (
                  <span className="text-[11px] text-slate-400 font-normal group-hover:text-slate-600">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Plan & Credits */}
        <div className="p-3 border-t border-slate-100 space-y-3">
          {/* Credits Box */}
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Zap className="h-3.5 w-3.5 text-indigo-600" />
                {userProfile.plan}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {userProfile.creditsUsed}/{userProfile.creditsTotal}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{userProfile.creditsTotal - userProfile.creditsUsed} emails left</span>
              <button
                onClick={() => onSelectTab("settings")}
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Refill
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
                {userProfile.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-slate-800">
                  {userProfile.name}
                </span>
                <span className="truncate text-[11px] text-slate-400">
                  {userProfile.email}
                </span>
              </div>
            </div>
            <button
              title="Settings"
              onClick={() => onSelectTab("settings")}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
