"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Save,
  RotateCw,
  Bold,
  Italic,
  List,
  Link2,
  Check,
  ChevronDown,
  Info,
  User,
  Building2,
  Briefcase,
  Mail,
  SlidersHorizontal,
  Wand2,
  AlertCircle,
  FileText,
  CornerDownLeft,
} from "lucide-react";
import {
  EmailTone,
  EmailLength,
  EmailRecord,
  Contact,
  ComposeFormState,
} from "../app/types";

interface ComposeViewProps {
  initialData?: Partial<ComposeFormState>;
  contacts: Contact[];
  onSendEmail: (emailData: {
    recipientName: string;
    recipientEmail: string;
    company: string;
    jobPosition: string;
    subject: string;
    body: string;
    tone: EmailTone;
    length: EmailLength;
  }) => void;
  onSaveDraft: (draft: Partial<EmailRecord>) => void;
  onCopyText: (text: string) => void;
  senderProfile: {
    name: string;
    email: string;
    bio: string;
  };
}

export function ComposeView({
  initialData,
  contacts,
  onSendEmail,
  onSaveDraft,
  onCopyText,
  senderProfile,
}: ComposeViewProps) {
  // Form state
  const [recipientEmail, setRecipientEmail] = useState(
    initialData?.recipientEmail || "sjenkins@stripe.com"
  );
  const [recipientName, setRecipientName] = useState(
    initialData?.recipientName || "Sarah Jenkins"
  );
  const [companyName, setCompanyName] = useState(
    initialData?.companyName || "Stripe"
  );
  const [jobPosition, setJobPosition] = useState(
    initialData?.jobPosition || "Senior Frontend Engineer — Payments UI"
  );
  const [jobDescription, setJobDescription] = useState(
    initialData?.jobDescription ||
      "Seeking a Senior Frontend Engineer to build robust checkout and billing experiences. Requires deep expertise in React, TypeScript, web performance, and mission-critical UI reliability."
  );
  const [senderIntro, setSenderIntro] = useState(
    initialData?.senderProfile || senderProfile.bio
  );
  const [additionalInstructions, setAdditionalInstructions] = useState(
    initialData?.additionalInstructions ||
      "Highlight 38% checkout latency reduction and passion for developer experience."
  );

  // Tone & Length
  const [tone, setTone] = useState<EmailTone>(
    initialData?.tone || "Confident"
  );
  const [length, setLength] = useState<EmailLength>(
    initialData?.length || "Medium"
  );

  // Email Preview state
  const [subject, setSubject] = useState(
    initialData?.subject ||
      "Application: Senior Frontend Engineer — Monu Shah (5+ yrs React/TypeScript)"
  );
  const [body, setBody] = useState(
    initialData?.body ||
      `Hi Sarah,

I have been following Stripe's developer experience initiatives and recent updates to the Payment Element with great admiration.

With over 5 years architecting high-scale Next.js and TypeScript applications, I am writing to express my strong interest in the Senior Frontend Engineer role on the Payments UI team. In my previous role, I reduced checkout latency by 38% and spearheaded our shared component library used across 12 micro-frontends.

Given Stripe's obsessive focus on developer ergonomics and reliability, I would love the chance to discuss how my background in modern web performance aligns with your team's H2 goals.

Would you have 10 minutes next Tuesday or Wednesday for a brief introductory conversation?

Best regards,
${senderProfile.name}
${senderProfile.email} | github.com/monushah108 | linkedin.com/in/monushah`
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(100);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Synchronize when initialData changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialData?.recipientEmail) setRecipientEmail(initialData.recipientEmail);
    if (initialData?.recipientName) setRecipientName(initialData.recipientName);
    if (initialData?.companyName) setCompanyName(initialData.companyName);
    if (initialData?.jobPosition) setJobPosition(initialData.jobPosition);
    if (initialData?.subject) setSubject(initialData.subject);
    if (initialData?.body) setBody(initialData.body);
    if (initialData?.tone) setTone(initialData.tone);
    if (initialData?.length) setLength(initialData.length);
  }, [initialData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handle Contact Quick-Select
  const handleSelectContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setRecipientName(contact.name);
      setRecipientEmail(contact.email);
      setCompanyName(contact.company);
      if (contact.position.toLowerCase().includes("recruiter")) {
        // keep job position if already set
      }
    }
  };

  // AI Generation Simulation with Realistic Content Tailored to Inputs
  const handleGenerateEmail = () => {
    setIsGenerating(true);
    setGenerationProgress(20);

    setTimeout(() => {
      setGenerationProgress(65);
    }, 350);

    setTimeout(() => {
      let generatedSubject = "";
      let generatedBody = "";

      const cleanName = recipientName.split(" ")[0] || "there";
      const cleanCompany = companyName || "your team";
      const cleanPosition = jobPosition || "the engineering role";

      if (tone === "Confident") {
        generatedSubject = `Application: ${cleanPosition} — ${senderProfile.name} (High-scale specialist)`;
        generatedBody = `Hi ${cleanName},

I noticed ${cleanCompany}'s recent engineering announcements and wanted to reach out directly regarding the ${cleanPosition} role.

Having engineered web platforms over the past 5 years using React, TypeScript, and modern distributed systems, I specialize in shipping low-latency, resilient interfaces. ${
          additionalInstructions
            ? `Specifically, ${additionalInstructions.toLowerCase()}`
            : "In my recent role, I led our core frontend performance initiative, cutting load times by over 35%."
        }

Given ${cleanCompany}'s bar for craft and performance, I am confident I can make an immediate high-velocity impact on your roadmap.

Would you be open to a 10-minute introductory call next Tuesday or Wednesday?

Best regards,
${senderProfile.name}
${senderProfile.email} | github.com/monushah108`;
      } else if (tone === "Friendly") {
        generatedSubject = `Quick note from an engineer who loves ${cleanCompany} (${cleanPosition})`;
        generatedBody = `Hey ${cleanName},

Hope you're having a wonderful week!

I've been a huge fan of ${cleanCompany}'s product and design philosophy for a long time. When I saw the opening for ${cleanPosition}, I couldn't resist reaching out directly.

A quick bit about me: I'm a full-stack engineer who loves building clean, joyful user experiences. ${
          additionalInstructions
            ? `In fact, ${additionalInstructions}`
            : "I spend most of my time in React, TypeScript, and developer tooling."
        }

I'd love to chat briefly and learn more about what the team is tackling next.

Are you free for a quick virtual coffee sometime soon?

Cheers,
${senderProfile.name}
${senderProfile.email}`;
      } else if (tone === "Formal") {
        generatedSubject = `Candidate Inquiry: ${cleanPosition} — ${senderProfile.name}`;
        generatedBody = `Dear ${recipientName || "Hiring Manager"},

I am writing to express my formal candidacy for the ${cleanPosition} position at ${cleanCompany}.

With extensive experience in software development and frontend systems architecture, I have consistently delivered robust web solutions that balance rigorous engineering standards with high operational reliability.

I have attached my portfolio and professional history for your consideration. I would welcome the opportunity to discuss how my qualifications align with ${cleanCompany}'s strategic objectives.

Thank you for your time and consideration.

Sincerely,
${senderProfile.name}
${senderProfile.email}`;
      } else {
        // Professional (Default)
        generatedSubject = `${cleanPosition} — ${senderProfile.name} Introduction`;
        generatedBody = `Hi ${cleanName},

I hope this email finds you well.

I am reaching out regarding the ${cleanPosition} position at ${cleanCompany}. With over 5 years of experience building modern web applications with React, Next.js, and TypeScript, I was drawn to this opportunity given your team's emphasis on engineering excellence.

${
  additionalInstructions
    ? `${additionalInstructions}`
    : "In my previous role, I led key architecture modernizations that improved system throughput and developer productivity across our team."
}

I would welcome the opportunity to connect for a 15-minute conversation to discuss how my background matches your current requirements.

Thank you for your time.

Best regards,
${senderProfile.name}
${senderProfile.email}`;
      }

      // Adjust for length
      if (length === "Short") {
        generatedBody = `Hi ${cleanName},

I am writing to express my strong interest in the ${cleanPosition} role at ${cleanCompany}.

With 5+ years of engineering experience with React & TypeScript, I have focused on building fast, production-grade applications with high reliability.

I would love to connect for 10 minutes to discuss how my skills align with ${cleanCompany}'s current engineering priorities.

Best regards,
${senderProfile.name}
${senderProfile.email}`;
      }

      setSubject(generatedSubject);
      setBody(generatedBody);
      setGenerationProgress(100);
      setIsGenerating(false);
    }, 700);
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard?.writeText(fullText);
    onCopyText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendClick = () => {
    onSendEmail({
      recipientName,
      recipientEmail,
      company: companyName,
      jobPosition,
      subject,
      body,
      tone,
      length,
    });
  };

  const handleSaveDraftClick = () => {
    onSaveDraft({
      recipientName,
      recipientEmail,
      company: companyName,
      jobPosition,
      subject,
      body,
      status: "Draft",
      tone,
      length,
    });
  };

  // Word count & read time
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readTimeSeconds = Math.max(10, Math.round((wordCount / 200) * 60));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with Quick Presets */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Wand2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              AI Outreach Composer
            </h2>
            <p className="text-xs text-slate-500">
              Personalized pitches built for high response rates
            </p>
          </div>
        </div>

        {/* Quick Pick from Saved Contacts */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Autofill Contact:
          </span>
          <select
            onChange={(e) => handleSelectContact(e.target.value)}
            defaultValue=""
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select recruiter...
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.company} ({c.position})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================= LEFT COLUMN: Email Details & AI Controls (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Email Details Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                1. Recipient & Role Details
              </span>
              <span className="text-[11px] text-slate-400">Required fields</span>
            </div>

            {/* Recipient Email & Name */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  Recruiter Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. sjenkins@stripe.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" />
                  Recruiter Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Company & Job Position */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400" />
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Linear"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-slate-400" />
                  Job Position *
                </label>
                <input
                  type="text"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Job Description (Optional) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Job Description / Requirements (Optional)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setJobDescription(
                      "Seeking a Senior Frontend Engineer to build robust checkout and billing experiences. Requires deep expertise in React, TypeScript, web performance, and mission-critical UI reliability."
                    )
                  }
                  className="text-[10px] font-medium text-indigo-600 hover:underline"
                >
                  Insert Sample Req
                </button>
              </div>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key bullet points or summary from job posting..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
              />
            </div>

            {/* Sender Introduction */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                <span>Sender Profile / Bio</span>
                <span className="text-[10px] text-slate-400">
                  Pre-filled from Settings
                </span>
              </label>
              <textarea
                rows={2}
                value={senderIntro}
                onChange={(e) => setSenderIntro(e.target.value)}
                placeholder="Brief summary of your background, years of experience, core stack..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
              />
            </div>

            {/* Additional Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Additional Instructions / Custom Angle
              </label>
              <input
                type="text"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g. Mention 38% latency reduction, request 15-min chat"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Settings & Generation Controls */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
                2. AI Generation Parameters
              </span>
              <span className="text-[11px] font-mono text-indigo-600 font-medium">
                Claude 3.7 / GPT-4o
              </span>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Tone of Voice
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    "Confident",
                    "Professional",
                    "Friendly",
                    "Formal",
                  ] as EmailTone[]
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg py-2 px-2 text-center text-xs font-medium transition-all ${
                      tone === t
                        ? "bg-indigo-600 text-white shadow-xs font-semibold ring-2 ring-indigo-500/20"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Length Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Email Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "Short", label: "Short (~75w)" },
                    { id: "Medium", label: "Medium (~150w)" },
                    { id: "Detailed", label: "Detailed (~250w)" },
                  ] as { id: EmailLength; label: string }[]
                ).map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLength(l.id)}
                    className={`rounded-lg py-1.5 px-2 text-center text-xs font-medium transition-all ${
                      length === l.id
                        ? "bg-slate-900 text-white font-semibold"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Generate Button */}
            <button
              type="button"
              onClick={handleGenerateEmail}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin text-white" />
                  <span>Synthesizing Personalized Pitch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span>Generate Personalized Email with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Email Preview (Realistic Email Client) (7 cols) ================= */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 rounded-xl border border-slate-200/80 bg-white shadow-xs flex flex-col overflow-hidden">
            {/* Email Client Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 text-xs font-semibold text-slate-700">
                  Email Preview
                </span>
              </div>

              {/* AI Quality Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 border border-indigo-200/50">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  AI Generated · 95% Match Score
                </span>
              </div>
            </div>

            {/* Email Meta Header (To, From, Subject) */}
            <div className="border-b border-slate-100 p-5 space-y-3 bg-white">
              {/* Recipient Line */}
              <div className="flex items-center text-xs">
                <span className="w-16 font-medium text-slate-400">To:</span>
                <span className="font-semibold text-slate-800">
                  {recipientName || "Recipient"}
                </span>
                <span className="ml-1.5 text-slate-400 font-mono text-[11px]">
                  &lt;{recipientEmail || "email@company.com"}&gt;
                </span>
              </div>

              {/* Sender Line */}
              <div className="flex items-center text-xs">
                <span className="w-16 font-medium text-slate-400">From:</span>
                <span className="font-semibold text-slate-800">
                  {senderProfile.name}
                </span>
                <span className="ml-1.5 text-slate-400 font-mono text-[11px]">
                  &lt;{senderProfile.email}&gt;
                </span>
              </div>

              {/* Subject Line Input */}
              <div className="flex items-center text-xs pt-1 border-t border-slate-100">
                <span className="w-16 font-medium text-slate-400">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 rounded border border-transparent px-2 py-1 font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-500 focus:bg-slate-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Clean Formatting Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-2 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => {
                    setBody((prev) => prev + " **bold**");
                  }}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200/70"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => {
                    setBody((prev) => prev + " *italic*");
                  }}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200/70"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => {
                    setBody((prev) => prev + "\n• Key achievement");
                  }}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200/70"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <span className="mx-1 h-3.5 w-px bg-slate-200" />
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Variables:
                </span>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ` ${companyName}`)}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 hover:bg-slate-200"
                >
                  + Company
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ` ${jobPosition}`)}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 hover:bg-slate-200"
                >
                  + Role
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                {wordCount} words · ~{readTimeSeconds}s read
              </div>
            </div>

            {/* Editable Rich Email Body */}
            <div className="relative flex-1 p-5 min-h-[340px] flex flex-col">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Email content will appear here..."
                className="w-full flex-1 rounded-none border-0 p-0 font-sans text-sm leading-relaxed text-slate-800 placeholder-slate-300 focus:outline-none resize-none"
              />
            </div>

            {/* Email Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 p-4">
              {/* Left Actions: Regenerate & Copy */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  title="Regenerate with different hook"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                >
                  <RotateCw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy formatted email to clipboard"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Actions: Save Draft & Send Email */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraftClick}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  <span>Save as Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendClick}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
