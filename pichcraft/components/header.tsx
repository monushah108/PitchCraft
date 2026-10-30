"use client";

import React from "react";
import {
  Menu,
  Sparkles,
  Search,
  Bell,
  HelpCircle,
  ExternalLink,
  Command,
} from "lucide-react";
import { NavigationTab } from "../app/types";

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileMenu: () => void;
  onNavigateToCompose: () => void;
  onSearchClick?: () => void;
}

export function Header({
  currentTab,
  onOpenMobileMenu,
  onNavigateToCompose,
  onSearchClick,
}: HeaderProps) {
  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard";
      case "compose":
        return "Compose AI Pitch";
      case "history":
        return "Outreach History";
      case "contacts":
        return "Recruiter CRM & Contacts";
      case "templates":
        return "Email Templates";
      case "analytics":
        return "Performance Analytics";
      case "settings":
        return "Preferences & Settings";
      default:
        return "PitchCraft";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            PitchCraft AI
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900">
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search, Compose, and Status */}
      <div className="flex items-center gap-2.5">
        {/* Global Search bar mock / trigger */}
        <div
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100/70 transition-colors cursor-pointer w-48 lg:w-64"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="flex-1 truncate">Search emails, companies...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Live System Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/60 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Engine Ready</span>
        </div>

        {/* Quick New Pitch Button (if not on compose) */}
        {currentTab !== "compose" && (
          <button
            onClick={onNavigateToCompose}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Pitch</span>
          </button>
        )}
      </div>
    </header>
  );
}
