"use client";

import React, { useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { DashboardView } from "../components/dashboard-view";
import { ComposeView } from "../components/compose-view";
import { HistoryView } from "../components/history-view";
import { ContactsView } from "../components/contacts-view";
import { TemplatesView } from "../components/templates-view";
import { AnalyticsView } from "../components/analytics-view";
import { SettingsView } from "../components/settings-view";
import { SendDialog } from "../components/send-dialog";
import { EmailPreviewModal } from "../components/email-preview-modal";
import { ToastContainer, ToastMessage } from "../components/toast";

import {
  NavigationTab,
  EmailRecord,
  Contact,
  Template,
  ComposeFormState,
  EmailTone,
  EmailLength,
} from "./types";
import {
  INITIAL_USER_PROFILE,
  INITIAL_EMAILS,
  INITIAL_CONTACTS,
  INITIAL_TEMPLATES,
} from "./data/sample-data";

export default function PitchCraftApp() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core App Data
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [emails, setEmails] = useState<EmailRecord[]>(INITIAL_EMAILS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [templates] = useState<Template[]>(INITIAL_TEMPLATES);

  // Compose Form Transfer State
  const [composeInitialData, setComposeInitialData] = useState<
    Partial<ComposeFormState> | undefined
  >(undefined);

  // Modals & Dialogs
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [pendingEmailData, setPendingEmailData] = useState<{
    recipientName: string;
    recipientEmail: string;
    company: string;
    jobPosition: string;
    subject: string;
    body: string;
    tone: EmailTone;
    length: EmailLength;
  } | null>(null);

  const [previewEmail, setPreviewEmail] = useState<EmailRecord | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const handleNavigateToCompose = (data?: Partial<ComposeFormState>) => {
    if (data) {
      setComposeInitialData(data);
    }
    setCurrentTab("compose");
  };

  const handleTriggerSendEmail = (emailData: {
    recipientName: string;
    recipientEmail: string;
    company: string;
    jobPosition: string;
    subject: string;
    body: string;
    tone: EmailTone;
    length: EmailLength;
  }) => {
    setPendingEmailData(emailData);
    setSendDialogOpen(true);
  };

  const handleConfirmSend = () => {
    if (!pendingEmailData) return;

    const newEmail: EmailRecord = {
      id: `em-${Date.now()}`,
      recipientName: pendingEmailData.recipientName || "Recruiter",
      recipientEmail: pendingEmailData.recipientEmail,
      company: pendingEmailData.company || "Company",
      jobPosition: pendingEmailData.jobPosition || "Engineer",
      subject: pendingEmailData.subject,
      body: pendingEmailData.body,
      status: "Sent",
      date: "Just now",
      timestamp: Date.now(),
      tone: pendingEmailData.tone,
      length: pendingEmailData.length,
      openCount: 0,
    };

    setEmails((prev) => [newEmail, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      creditsUsed: Math.min(prev.creditsTotal, prev.creditsUsed + 1),
    }));

    setSendDialogOpen(false);
    setPendingEmailData(null);
    showToast(`Pitch successfully delivered to ${newEmail.recipientName}!`);
  };

  const handleSaveDraft = (draft: Partial<EmailRecord>) => {
    const newDraft: EmailRecord = {
      id: `em-draft-${Date.now()}`,
      recipientName: draft.recipientName || "Draft Recipient",
      recipientEmail: draft.recipientEmail || "email@company.com",
      company: draft.company || "Target Company",
      jobPosition: draft.jobPosition || "Position",
      subject: draft.subject || "Draft Subject",
      body: draft.body || "",
      status: "Draft",
      date: "Just now",
      timestamp: Date.now(),
      tone: draft.tone || "Confident",
      length: draft.length || "Medium",
    };

    setEmails((prev) => [newDraft, ...prev]);
    showToast("Email draft saved successfully!");
  };

  const handleAddContact = (newContactData: Omit<Contact, "id">) => {
    const newContact: Contact = {
      ...newContactData,
      id: `cnt-${Date.now()}`,
    };
    setContacts((prev) => [newContact, ...prev]);
    showToast(`Added ${newContact.name} (${newContact.company}) to contacts!`);
  };

  const handlePitchContact = (contact: Contact) => {
    setComposeInitialData({
      recipientEmail: contact.email,
      recipientName: contact.name,
      companyName: contact.company,
      jobPosition: contact.position.includes("Recruiter")
        ? "Senior Frontend Engineer"
        : contact.position,
      subject: `Senior Frontend Engineer Application — Monu Shah`,
    });
    setCurrentTab("compose");
    showToast(`Loaded ${contact.name}'s details into Composer!`);
  };

  const handleUseTemplate = (template: Template) => {
    setComposeInitialData({
      subject: template.subject,
      body: template.body,
      tone: template.recommendedTone,
      length: template.recommendedLength,
    });
    setCurrentTab("compose");
    showToast(`Applied "${template.title}" template!`);
  };

  const handleReuseEmail = (email: EmailRecord) => {
    setComposeInitialData({
      recipientEmail: email.recipientEmail,
      recipientName: email.recipientName,
      companyName: email.company,
      jobPosition: email.jobPosition,
      subject: email.subject,
      body: email.body,
      tone: email.tone,
      length: email.length,
    });
    setCurrentTab("compose");
    showToast(`Loaded ${email.company} email into Composer!`);
  };

  const handleDeleteEmail = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    showToast("Email deleted from history.", "info");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 flex">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userProfile={userProfile}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateToCompose={() => handleNavigateToCompose()}
          onSearchClick={() => setCurrentTab("history")}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === "dashboard" && (
            <DashboardView
              emails={emails}
              onNavigateToCompose={() => handleNavigateToCompose()}
              onNavigateToHistory={() => setCurrentTab("history")}
              onPreviewEmail={setPreviewEmail}
              onCopyEmail={(body) => showToast("Email body copied to clipboard!")}
            />
          )}

          {currentTab === "compose" && (
            <ComposeView
              initialData={composeInitialData}
              contacts={contacts}
              onSendEmail={handleTriggerSendEmail}
              onSaveDraft={handleSaveDraft}
              onCopyText={(text) => showToast("Copied to clipboard!")}
              senderProfile={{
                name: userProfile.name,
                email: userProfile.email,
                bio: userProfile.bio,
              }}
            />
          )}

          {currentTab === "history" && (
            <HistoryView
              emails={emails}
              onPreviewEmail={setPreviewEmail}
              onReuseEmail={handleReuseEmail}
              onCopyEmail={() => showToast("Email copied to clipboard!")}
              onDeleteEmail={handleDeleteEmail}
            />
          )}

          {currentTab === "contacts" && (
            <ContactsView
              contacts={contacts}
              onAddContact={handleAddContact}
              onPitchContact={handlePitchContact}
            />
          )}

          {currentTab === "templates" && (
            <TemplatesView
              templates={templates}
              onUseTemplate={handleUseTemplate}
              onCopyTemplate={() => showToast("Template copied to clipboard!")}
            />
          )}

          {currentTab === "analytics" && <AnalyticsView />}

          {currentTab === "settings" && (
            <SettingsView
              userProfile={userProfile}
              onSaveProfile={setUserProfile}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Confirmation Send Dialog */}
      {pendingEmailData && (
        <SendDialog
          isOpen={sendDialogOpen}
          onClose={() => setSendDialogOpen(false)}
          emailData={pendingEmailData}
          onConfirmSend={handleConfirmSend}
        />
      )}

      {/* Email Preview Modal */}
      <EmailPreviewModal
        email={previewEmail}
        onClose={() => setPreviewEmail(null)}
        onReuse={handleReuseEmail}
        onCopy={() => showToast("Email copied to clipboard!")}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
