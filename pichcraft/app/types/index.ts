export type NavigationTab =
  | "dashboard"
  | "compose"
  | "history"
  | "contacts"
  | "templates"
  | "analytics"
  | "settings";

export type EmailTone = "Professional" | "Friendly" | "Confident" | "Formal";
export type EmailLength = "Short" | "Medium" | "Detailed";
export type EmailStatus = "Sent" | "Draft" | "Opened" | "Replied" | "Failed";

export interface EmailRecord {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole?: string;
  company: string;
  companyDomain?: string;
  subject: string;
  body: string;
  status: EmailStatus;
  date: string;
  timestamp: number;
  tone: EmailTone;
  length: EmailLength;
  jobPosition: string;
  openCount?: number;
  repliedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  linkedin?: string;
  status: "Active" | "Contacted" | "Replied" | "Interviewing";
  outreachCount: number;
  lastContactedDate: string;
  notes?: string;
  avatarBg?: string;
}

export interface Template {
  id: string;
  title: string;
  category: "Job Application" | "Cold Outreach" | "Follow-up" | "Referral" | "Executive";
  description: string;
  subject: string;
  body: string;
  recommendedTone: EmailTone;
  recommendedLength: EmailLength;
  usesCount: number;
  responseRate: string;
}

export interface ComposeFormState {
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  jobPosition: string;
  jobDescription: string;
  senderProfile: string;
  additionalInstructions: string;
  tone: EmailTone;
  length: EmailLength;
  subject: string;
  body: string;
}
