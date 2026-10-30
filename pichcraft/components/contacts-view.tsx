"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Building,
  MoreVertical,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  Send,
  X,
} from "lucide-react";
import { Contact } from "../app/types";

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, "id">) => void;
  onPitchContact: (contact: Contact) => void;
}

export function ContactsView({
  contacts,
  onAddContact,
  onPitchContact,
}: ContactsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Contact form fields
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newLinkedin, setNewLinkedin] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newCompany) return;

    onAddContact({
      name: newName,
      email: newEmail,
      company: newCompany,
      position: newPosition || "Recruiter",
      linkedin: newLinkedin,
      status: "Active",
      outreachCount: 0,
      lastContactedDate: "Just added",
      notes: newNotes,
      avatarBg: "bg-indigo-100 text-indigo-700",
    });

    setNewName("");
    setNewEmail("");
    setNewCompany("");
    setNewPosition("");
    setNewLinkedin("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Action */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recruiter CRM & Contacts
          </h2>
          <p className="text-xs text-slate-500">
            Keep track of hiring managers, tech recruiters, and past outreach
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name, company, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          {["All", "Replied", "Contacted", "Interviewing", "Active"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 transition-all group"
          >
            <div className="space-y-3">
              {/* Header: Avatar, Name, Company */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      contact.avatarBg || "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {contact.name}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {contact.position}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                  {contact.status}
                </span>
              </div>

              {/* Company & Email Details */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {contact.company}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono text-[11px] text-slate-500 truncate">
                    {contact.email}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {contact.notes && (
                <div className="rounded-md bg-slate-50 p-2 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
                  <strong className="text-slate-700">Note:</strong> {contact.notes}
                </div>
              )}
            </div>

            {/* Bottom Actions: Outreach count & Pitch button */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {contact.outreachCount > 0
                  ? `${contact.outreachCount} pitches sent`
                  : "No emails yet"}
              </span>

              <button
                onClick={() => onPitchContact(contact)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200/50 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                <span>Pitch Recruiter</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Add New Recruiter Contact
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Wu"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jessica@supabase.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supabase"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700">Role / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Talent"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={newLinkedin}
                  onChange={(e) => setNewLinkedin(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700">Notes / Focus Area</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Looking for engineers with PostgreSQL or open source background"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
