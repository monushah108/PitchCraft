"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  ArrowRight,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  Tag,
  X,
} from "lucide-react";
import { Template } from "../app/types";

interface TemplatesViewProps {
  templates: Template[];
  onUseTemplate: (template: Template) => void;
  onCopyTemplate: (body: string) => void;
}

export function TemplatesView({
  templates,
  onUseTemplate,
  onCopyTemplate,
}: TemplatesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "All",
    "Job Application",
    "Cold Outreach",
    "Follow-up",
    "Referral",
    "Executive",
  ];

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  const handleCopy = (t: Template) => {
    const text = `Subject: ${t.subject}\n\n${t.body}`;
    navigator.clipboard?.writeText(text);
    onCopyTemplate(text);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Outreach Templates Library
          </h2>
          <p className="text-xs text-slate-500">
            Battle-tested templates crafted for high conversion and recruiter engagement
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 transition-all group"
          >
            <div className="space-y-3">
              {/* Category & Response Rate */}
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {template.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {template.responseRate} reply rate
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {template.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Subject Line Snippet */}
              <div className="rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100 font-mono text-slate-600 truncate">
                <span className="text-slate-400 select-none">Subject: </span>
                {template.subject}
              </div>

              {/* Recommended badges */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Tone: <strong className="text-slate-600">{template.recommendedTone}</strong></span>
                <span>•</span>
                <span>Length: <strong className="text-slate-600">{template.recommendedLength}</strong></span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  title="Preview Template"
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(template)}
                  title="Copy Template"
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  {copiedId === template.id ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                onClick={() => onUseTemplate(template)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {previewTemplate.category}
                </span>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {previewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Subject:</span>
                <div className="mt-1 rounded-lg bg-slate-50 p-2.5 font-mono text-slate-800 border border-slate-200">
                  {previewTemplate.subject}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Body Template:</span>
                <div className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-3.5 text-slate-800 border border-slate-200 font-sans leading-relaxed text-xs">
                  {previewTemplate.body}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleCopy(previewTemplate)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy to Clipboard</span>
              </button>

              <button
                onClick={() => {
                  onUseTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <span>Load into Composer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
