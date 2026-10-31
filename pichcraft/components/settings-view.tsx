"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Sliders,
  Check,
  Zap,
  Globe,
  Code2,
  Link2,
  Key,
} from "lucide-react";
import { EmailTone, EmailLength } from "../app/types";

interface SettingsViewProps {
  userProfile: {
    name: string;
    email: string;
    role: string;
    bio: string;
    plan: string;
    creditsUsed: number;
    creditsTotal: number;
  };
  onSaveProfile: (profile: {
    name?: string;
    email?: string;
    role?: string;
    bio?: string;
    plan?: string;
    creditsUsed?: number;
    creditsTotal?: number;
  }) => void;
  showToast: (msg: string) => void;
}

export function SettingsView({
  userProfile,
  onSaveProfile,
  showToast,
}: SettingsViewProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [bio, setBio] = useState(userProfile.bio);
  const [githubUrl, setGithubUrl] = useState("https://github.com/monushah108");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/monushah");
  const [portfolioUrl, setPortfolioUrl] = useState("https://monushah.dev");
  const [defaultTone, setDefaultTone] = useState<EmailTone>("Confident");
  const [defaultLength, setDefaultLength] = useState<EmailLength>("Medium");
  const [smtpConnected, setSmtpConnected] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...userProfile,
      name,
      email,
      role,
      bio,
    });
    showToast("Settings updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900">
          Preferences & Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure your personal sender profile, default AI prompts, and email integration
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Profile Information */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500">
              This information is used by PitchCraft AI to personalize your email pitches.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Sender Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Professional Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Core Background & Experience (AI Context)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-slate-400" />
                Portfolio URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Code2 className="h-3 w-3 text-slate-400" />
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Link2 className="h-3 w-3 text-slate-400" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 2. Email Delivery Connection */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Email Sending Integration
            </h3>
            <p className="text-xs text-slate-500">
              Connect your email client to send outreach directly with zero spam-folder risk
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-emerald-200/60 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    Google Workspace (Gmail OAuth)
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Connected
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Sending as {email} with SPF/DKIM verification active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast("OAuth tokens re-verified!")}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* 3. Subscription & Usage */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Subscription Plan
              </h3>
              <p className="text-xs text-slate-500">
                Manage your billing and monthly AI pitch credits
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
              {userProfile.plan}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500">Monthly Usage:</span>
              <div className="text-lg font-bold text-slate-900">
                {userProfile.creditsUsed} / {userProfile.creditsTotal} pitches used
              </div>
              <span className="text-[11px] text-slate-400">
                Renews on November 24, 2026
              </span>
            </div>

            <button
              type="button"
              onClick={() => showToast("Refill credits requested!")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Upgrade to Unlimited
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
