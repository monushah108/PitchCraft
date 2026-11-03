// Storage helper for PitchCraft Extension
// Supports chrome.storage.local with automatic fallback to localStorage

const DEFAULT_PROFILE = {
  name: "Monu Shah",
  email: "monushah.dev@gmail.com",
  role: "Senior Full-Stack Engineer",
  bio: "5+ years experience building high-scale React, TypeScript, and cloud applications. Passionate about developer tooling, performance optimization, and delighting users.",
  portfolio: "github.com/monushah108 | linkedin.com/in/monushah",
  apiKey: "",
  aiProvider: "builtin" // "builtin" | "openai" | "gemini"
};

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-1",
    title: "High-Impact Engineering Application",
    category: "Job Application",
    tone: "Confident",
    length: "Medium",
    subject: "Application: {{jobPosition}} — {{senderName}} (High-Scale Specialist)",
    body: `Hi {{recipientName}},

I noticed {{companyName}}'s recent engineering milestones and wanted to reach out directly regarding the {{jobPosition}} position.

With over 5 years architecting web platforms with React, TypeScript, and distributed cloud services, I specialize in shipping low-latency, resilient interfaces. {{keyHighlight}}

Given {{companyName}}'s reputation for engineering craft and performance, I am confident I can make an immediate high-velocity impact on your roadmap.

Would you be open to a 10-minute introductory call next Tuesday or Wednesday?

Best regards,
{{senderName}}
{{senderEmail}} | {{senderPortfolio}}`
  },
  {
    id: "tpl-2",
    title: "Warm & Friendly Product Pitch",
    category: "Cold Outreach",
    tone: "Friendly",
    length: "Medium",
    subject: "Quick note from an engineer who loves {{companyName}} ({{jobPosition}})",
    body: `Hey {{recipientName}},

Hope you're having a wonderful week!

I've been a huge fan of {{companyName}}'s product design philosophy for a long time. When I saw the opening for {{jobPosition}}, I couldn't resist reaching out directly.

A quick bit about me: I'm a builder who loves clean, joyful user experiences. {{keyHighlight}}

I'd love to chat briefly and learn more about what the team is tackling next. Are you free for a quick virtual coffee sometime soon?

Cheers,
{{senderName}}
{{senderEmail}}`
  },
  {
    id: "tpl-3",
    title: "Executive & Formal Inquiry",
    category: "Executive",
    tone: "Formal",
    length: "Detailed",
    subject: "Candidate Inquiry: {{jobPosition}} — {{senderName}}",
    body: `Dear {{recipientName}},

I am writing to express my formal candidacy for the {{jobPosition}} position at {{companyName}}.

With extensive background in software architecture and modern web engineering, I have consistently delivered robust platforms that balance rigorous technical standards with high operational velocity. {{keyHighlight}}

I would welcome the opportunity to discuss how my qualifications align with {{companyName}}'s strategic objectives for the upcoming quarter.

Thank you for your consideration.

Sincerely,
{{senderName}}
{{senderEmail}}
{{senderPortfolio}}`
  },
  {
    id: "tpl-4",
    title: "Short & Punchy 3-Sentence Intro",
    category: "Job Application",
    tone: "Professional",
    length: "Short",
    subject: "{{jobPosition}} — Quick intro from {{senderName}}",
    body: `Hi {{recipientName}},

I am writing to express my keen interest in the {{jobPosition}} role at {{companyName}}.

Over the last 5 years, I have built and scaled high-performance web applications using React, TypeScript, and modern API architectures. {{keyHighlight}}

Would you have 5 minutes this week for a brief introductory conversation?

Best,
{{senderName}}
{{senderEmail}}`
  },
  {
    id: "tpl-5",
    title: "Thoughtful Follow-up Note",
    category: "Follow-up",
    tone: "Professional",
    length: "Short",
    subject: "Following up: {{jobPosition}} role at {{companyName}}",
    body: `Hi {{recipientName}},

I hope your week is off to a great start!

I wanted to quickly follow up on my previous note regarding the {{jobPosition}} opportunity at {{companyName}}. I remain very enthusiastic about your team's mission and would welcome the chance to share how my experience can contribute to your goals.

Whenever you have a moment, I'd appreciate any update on the process.

Warmly,
{{senderName}}
{{senderEmail}}`
  }
];

const DEFAULT_CONTACTS = [
  {
    id: "cnt-1",
    name: "Sarah Jenkins",
    email: "sjenkins@stripe.com",
    company: "Stripe",
    position: "Senior Technical Recruiter",
    notes: "Hiring for Payments UI & Core Infrastructure"
  },
  {
    id: "cnt-2",
    name: "Alex Rivera",
    email: "alex@linear.app",
    company: "Linear",
    position: "Head of Talent & Engineering Ops",
    notes: "Active on LinkedIn; prefers concise emails with demo links"
  },
  {
    id: "cnt-3",
    name: "David Chen",
    email: "david.chen@figma.com",
    company: "Figma",
    position: "Engineering Director — Core Editor",
    notes: "Values performance benchmarks and WebGL experience"
  }
];

const DEFAULT_HISTORY = [
  {
    id: "hist-101",
    recipientName: "Sarah Jenkins",
    recipientEmail: "sjenkins@stripe.com",
    company: "Stripe",
    jobPosition: "Senior Frontend Engineer — Payments UI",
    subject: "Application: Senior Frontend Engineer — Monu Shah (5+ yrs React/TypeScript)",
    body: `Hi Sarah,\n\nI have been following Stripe's developer experience initiatives and recent updates to the Payment Element with great admiration.\n\nWith over 5 years architecting high-scale Next.js and TypeScript applications, I am writing to express my strong interest in the Senior Frontend Engineer role on the Payments UI team. In my previous role, I reduced checkout latency by 38% and spearheaded our shared component library used across 12 micro-frontends.\n\nWould you have 10 minutes next Tuesday or Wednesday for a brief introductory conversation?\n\nBest regards,\nMonu Shah\nmonushah.dev@gmail.com`,
    tone: "Confident",
    length: "Medium",
    date: "Today, 10:24 AM",
    timestamp: Date.now() - 3600000 * 2,
    status: "Sent"
  }
];

const Storage = {
  isChromeStorageAvailable() {
    return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
  },

  async get(key, defaultValue) {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError || result[key] === undefined) {
            resolve(defaultValue);
          } else {
            resolve(result[key]);
          }
        });
      });
    }
    const val = localStorage.getItem(`pitchcraft_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  },

  async set(key, value) {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    }
    localStorage.setItem(`pitchcraft_${key}`, JSON.stringify(value));
  },

  // App domain methods
  async getProfile() {
    return await this.get("profile", DEFAULT_PROFILE);
  },

  async saveProfile(profile) {
    return await this.set("profile", profile);
  },

  async getTemplates() {
    return await this.get("templates", DEFAULT_TEMPLATES);
  },

  async saveTemplates(templates) {
    return await this.set("templates", templates);
  },

  async getContacts() {
    return await this.get("contacts", DEFAULT_CONTACTS);
  },

  async saveContacts(contacts) {
    return await this.set("contacts", contacts);
  },

  async addContact(contact) {
    const contacts = await this.getContacts();
    const updated = [contact, ...contacts.filter((c) => c.email !== contact.email)];
    await this.saveContacts(updated);
    return updated;
  },

  async deleteContact(id) {
    const contacts = await this.getContacts();
    const updated = contacts.filter((c) => c.id !== id);
    await this.saveContacts(updated);
    return updated;
  },

  async clearContacts() {
    await this.saveContacts([]);
    return [];
  },

  async getHistory() {
    return await this.get("history", DEFAULT_HISTORY);
  },

  async saveHistory(history) {
    return await this.set("history", history);
  },

  async addHistory(item) {
    const history = await this.getHistory();
    const updated = [item, ...history];
    await this.saveHistory(updated);
    return updated;
  },

  async deleteHistory(id) {
    const history = await this.getHistory();
    const updated = history.filter((h) => h.id !== id);
    await this.saveHistory(updated);
    return updated;
  },

  async getDraft() {
    return await this.get("draft", null);
  },

  async saveDraft(draft) {
    return await this.set("draft", draft);
  },

  async getResume() {
    return await this.get("userResume", null);
  },

  async saveResume(resumeData) {
    return await this.set("userResume", resumeData);
  },

  async clearResume() {
    return await this.set("userResume", null);
  }
};

if (typeof window !== "undefined") {
  window.PitchCraftStorage = Storage;
}

