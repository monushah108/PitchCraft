import { EmailRecord, Contact, Template } from "../types";

export const INITIAL_USER_PROFILE = {
  name: "Monu Shah",
  email: "monushah.dev@gmail.com",
  role: "Senior Full-Stack Engineer",
  avatarUrl: "",
  initials: "MS",
  plan: "Pro Tier",
  creditsUsed: 84,
  creditsTotal: 100,
  bio: "5+ years experienced Full-Stack Engineer specializing in React, Next.js, TypeScript, Node.js, and high-performance cloud architecture. Open-source contributor passionate about building developer tools and delighting SaaS users.",
};

export const INITIAL_EMAILS: EmailRecord[] = [
  {
    id: "em-101",
    recipientName: "Sarah Jenkins",
    recipientEmail: "sjenkins@stripe.com",
    recipientRole: "Senior Technical Recruiter",
    company: "Stripe",
    companyDomain: "stripe.com",
    jobPosition: "Senior Frontend Engineer — Payments UI",
    subject: "Application: Senior Frontend Engineer — Monu Shah (5+ yrs React/TypeScript)",
    body: `Hi Sarah,

I have been following Stripe's developer experience initiatives and recent updates to the Payment Element with great admiration. 

With over 5 years architecting high-scale Next.js and TypeScript applications, I am writing to express my strong interest in the Senior Frontend Engineer role on the Payments UI team. In my previous role, I reduced checkout latency by 38% and spearheaded our shared component library used across 12 micro-frontends.

Given Stripe's obsessive focus on developer ergonomics and reliability, I would love the chance to discuss how my background in modern web performance aligns with your team's H2 goals.

Would you have 10 minutes next Tuesday or Wednesday for a brief introductory conversation?

Best regards,
Monu Shah
monushah.dev@gmail.com | github.com/monushah108 | linkedin.com/in/monushah`,
    status: "Replied",
    date: "Today, 10:24 AM",
    timestamp: Date.now() - 1000 * 60 * 120,
    tone: "Confident",
    length: "Medium",
    openCount: 4,
    repliedAt: "Today, 11:15 AM",
  },
  {
    id: "em-102",
    recipientName: "Alex Rivera",
    recipientEmail: "alex@linear.app",
    recipientRole: "Head of Talent & Engineering Ops",
    company: "Linear",
    companyDomain: "linear.app",
    jobPosition: "Full Stack Engineer — Workflows",
    subject: "Fast-moving Full Stack Engineer excited about Linear's Workflows roadmap",
    body: `Hi Alex,

Linear's product philosophy on speed, keyboard-first navigation, and minimalist design sets the gold standard for developer tooling.

I'm reaching out because I noticed the opening for a Full Stack Engineer on the Workflows team. Over the past 4 years, I built real-time collaborative state engines using WebSockets and optimistic UI patterns that serve 80k+ daily active users with sub-50ms sync.

I believe my passion for craft and low-friction UX aligns seamlessly with Linear's ethos. I've attached my GitHub and a live demo showcasing a desktop-grade SaaS interface I created.

Could we schedule a quick 15-minute chat sometime this week?

Warmly,
Monu Shah
monushah.dev@gmail.com | linear-craft-demo.vercel.app`,
    status: "Opened",
    date: "Yesterday, 3:45 PM",
    timestamp: Date.now() - 1000 * 60 * 60 * 22,
    tone: "Professional",
    length: "Medium",
    openCount: 2,
  },
  {
    id: "em-103",
    recipientName: "Priya Patel",
    recipientEmail: "ppatel@figma.com",
    recipientRole: "Staff Recruiter, Core Product",
    company: "Figma",
    companyDomain: "figma.com",
    jobPosition: "Design Systems Engineer",
    subject: "Figma Design Systems Role — Monu Shah (TypeScript & Canvas tooling)",
    body: `Hi Priya,

Hope your week is going well. I'm reaching out regarding Figma's Design Systems Engineering position.

Having spent the last 3 years maintaining our company-wide design tokens and WebAssembly-backed rendering helpers, I have deep appreciation for Figma's multi-player architecture and pixel precision.

I'd welcome the opportunity to connect and share how my experience building accessible, tokenized component libraries can contribute to Figma's design tooling ecosystem.

Are you free for a brief call on Thursday afternoon?

Thanks for your time,
Monu Shah`,
    status: "Sent",
    date: "Oct 28, 2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    tone: "Professional",
    length: "Short",
    openCount: 1,
  },
  {
    id: "em-104",
    recipientName: "David Chen",
    recipientEmail: "dchen@openai.com",
    recipientRole: "Technical Talent Partner",
    company: "OpenAI",
    companyDomain: "openai.com",
    jobPosition: "Frontend Platform Engineer",
    subject: "Frontend Platform Engineer — Building intuitive AI interfaces",
    body: `Hi David,

As an avid builder on top of OpenAI APIs and agent frameworks, I am continuously inspired by how OpenAI balances rapid research innovation with clean user interfaces.

I am writing to express my enthusiasm for the Frontend Platform Engineer position. My core expertise is in building responsive, streaming-first interfaces, state orchestration, and sub-second web experiences.

I would love to learn more about the team's upcoming frontend priorities and see if my technical profile is a fit.

Looking forward to hearing from you.

Best,
Monu Shah`,
    status: "Replied",
    date: "Oct 26, 2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    tone: "Confident",
    length: "Medium",
    openCount: 5,
    repliedAt: "Oct 27, 2026",
  },
  {
    id: "em-105",
    recipientName: "Elena Rostova",
    recipientEmail: "elena.r@airbnb.com",
    recipientRole: "Lead Recruiting Partner",
    company: "Airbnb",
    companyDomain: "airbnb.com",
    jobPosition: "Software Engineer — Guest Experience",
    subject: "Application: Software Engineer (Guest Experience) — Monu Shah",
    body: `Hi Elena,

Airbnb's relentless focus on craft, typography, and internationalization has always set an aspirational bar for engineering teams.

I have submitted my application for the Software Engineer (Guest Experience) role and wanted to reach out directly. Over the last 5 years, I've built localized web experiences across 14 languages with automated accessibility CI pipelines.

I'd be thrilled to contribute to Airbnb's next generation of host and guest journeys.

Thank you for your consideration,
Monu Shah`,
    status: "Sent",
    date: "Oct 24, 2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 144,
    tone: "Formal",
    length: "Short",
    openCount: 1,
  },
  {
    id: "em-106",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus@vercel.com",
    recipientRole: "Engineering Hiring Manager",
    company: "Vercel",
    companyDomain: "vercel.com",
    jobPosition: "Solutions Engineer / DX",
    subject: "Developer Experience & Next.js Enthusiast — Pitch for Vercel",
    body: `Hi Marcus,

I've been deploying to Vercel since the Now 1.0 days, and I've loved seeing Vercel reshape modern frontend deployment.

I'm reaching out about the Solutions Engineer role. Over the last 3 years, I've mentored 50+ developers on App Router architecture, caching best practices, and edge function optimization.

Would you be open to a 10-minute coffee chat about DX and developer tooling?

Cheers,
Monu Shah`,
    status: "Draft",
    date: "Oct 22, 2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 190,
    tone: "Friendly",
    length: "Medium",
  },
  {
    id: "em-107",
    recipientName: "Rachel Scott",
    recipientEmail: "rscott@datadoghq.com",
    recipientRole: "Senior Recruiter",
    company: "Datadog",
    companyDomain: "datadoghq.com",
    jobPosition: "Frontend Engineer — Cloud Dashboards",
    subject: "Frontend Engineer (Cloud Dashboards) — Monu Shah Introduction",
    body: `Hi Rachel,

I came across the Frontend Engineer opening for Cloud Dashboards at Datadog and wanted to reach out.

With extensive experience building telemetry visualizations, custom Canvas charts, and low-latency frontend dashboards, I would love to contribute to Datadog's industry-leading observability platform.

I'd be glad to discuss my background whenever convenient.

Kind regards,
Monu Shah`,
    status: "Failed",
    date: "Oct 19, 2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 250,
    tone: "Professional",
    length: "Short",
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "cnt-1",
    name: "Sarah Jenkins",
    email: "sjenkins@stripe.com",
    company: "Stripe",
    position: "Senior Technical Recruiter",
    linkedin: "https://linkedin.com/in/sarahjenkins-stripe",
    status: "Replied",
    outreachCount: 2,
    lastContactedDate: "Today, 10:24 AM",
    notes: "Very receptive to frontend infrastructure metrics. Replied within 1 hour.",
    avatarBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "cnt-2",
    name: "Alex Rivera",
    email: "alex@linear.app",
    company: "Linear",
    position: "Head of Talent & Engineering Ops",
    linkedin: "https://linkedin.com/in/alexrivera-tech",
    status: "Contacted",
    outreachCount: 1,
    lastContactedDate: "Yesterday",
    notes: "Looking for engineers with deep product intuition and speed.",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "cnt-3",
    name: "Priya Patel",
    email: "ppatel@figma.com",
    company: "Figma",
    position: "Staff Recruiter, Core Product",
    linkedin: "https://linkedin.com/in/priyapatel-recruiting",
    status: "Contacted",
    outreachCount: 1,
    lastContactedDate: "Oct 28, 2026",
    notes: "Specializes in design systems, WebAssembly, and collaborative editor roles.",
    avatarBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "cnt-4",
    name: "David Chen",
    email: "dchen@openai.com",
    company: "OpenAI",
    position: "Technical Talent Partner",
    linkedin: "https://linkedin.com/in/davidchen-openai",
    status: "Interviewing",
    outreachCount: 3,
    lastContactedDate: "Oct 26, 2026",
    notes: "Passed recruiter screen. Technical loop scheduled for Nov 4.",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "cnt-5",
    name: "Marcus Vance",
    email: "marcus@vercel.com",
    company: "Vercel",
    position: "Engineering Hiring Manager",
    linkedin: "https://linkedin.com/in/marcusvance-vercel",
    status: "Active",
    outreachCount: 0,
    lastContactedDate: "Not contacted",
    notes: "Active on Twitter/X discussing App Router edge runtime.",
    avatarBg: "bg-slate-100 text-slate-700",
  },
  {
    id: "cnt-6",
    name: "Elena Rostova",
    email: "elena.r@airbnb.com",
    company: "Airbnb",
    position: "Lead Recruiting Partner",
    linkedin: "https://linkedin.com/in/elenarostova",
    status: "Contacted",
    outreachCount: 1,
    lastContactedDate: "Oct 24, 2026",
    notes: "Recruits for Guest Experience and design token infrastructure.",
    avatarBg: "bg-rose-100 text-rose-700",
  },
  {
    id: "cnt-7",
    name: "Jessica Wu",
    email: "jessica@supabase.com",
    company: "Supabase",
    position: "Head of People",
    linkedin: "https://linkedin.com/in/jessicawu-talent",
    status: "Active",
    outreachCount: 0,
    lastContactedDate: "Not contacted",
    notes: "High priority contact for full-stack and Postgres tooling roles.",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: "tmpl-1",
    title: "High-Conversion Job Application",
    category: "Job Application",
    description: "Concise, metric-driven outreach highlighting your direct experience and impact for an open role.",
    subject: "Application: {{JobPosition}} — {{SenderName}} ({{YearsExperience}}+ yrs experience)",
    body: `Hi {{RecruiterName}},

I noticed the {{JobPosition}} opening at {{Company}} and wanted to reach out directly.

With over {{YearsExperience}} years of experience building high-scale web products, I have specialized in {{CoreSkills}}. In my recent work, I {{KeyAchievement}} and led technical initiatives that increased user engagement.

Given {{Company}}'s commitment to high quality, I would love to bring this same dedication to your team.

Would you be open to a 10-minute introductory call next week?

Best regards,
{{SenderName}}
{{SenderEmail}} | {{PortfolioUrl}}`,
    recommendedTone: "Confident",
    recommendedLength: "Medium",
    usesCount: 42,
    responseRate: "41.5%",
  },
  {
    id: "tmpl-2",
    title: "Cold Email to Head of Talent / HR",
    category: "Cold Outreach",
    description: "Direct pitch to senior talent partners focused on immediate cultural and technical value add.",
    subject: "Quick question regarding {{Company}}'s engineering roadmap",
    body: `Hi {{RecruiterName}},

I know you are exceptionally busy scaling the talent at {{Company}}, so I will keep this brief.

I have followed {{Company}}'s growth closely, especially {{RecentCompanyEventOrFeature}}. As an engineer who loves solving {{RelevantProblem}}, I wanted to inquire if your team has room for a proactive builder who can hit the ground running.

Here is a 30-second snapshot of what I bring:
• {{CoreAchievement1}}
• {{CoreAchievement2}}

I'd be honored to connect for 5-10 minutes if there is potential alignment.

Warm regards,
{{SenderName}}`,
    recommendedTone: "Professional",
    recommendedLength: "Short",
    usesCount: 38,
    responseRate: "36.8%",
  },
  {
    id: "tmpl-3",
    title: "Post-Application Follow-up (Day 5)",
    category: "Follow-up",
    description: "Gentle, high-signal follow-up message to bump your existing application to the top of the inbox.",
    subject: "Following up: {{JobPosition}} application — {{SenderName}}",
    body: `Hi {{RecruiterName}},

I hope you've had a great week.

I wanted to quickly follow up on my application for the {{JobPosition}} role submitted last week. 

Since applying, I recently completed a project relevant to {{Company}}'s stack ({{BriefHighlight}}). I am very excited about the mission at {{Company}} and remain eager to discuss how I can help your team execute faster.

Thanks again for your time and consideration.

Best,
{{SenderName}}`,
    recommendedTone: "Friendly",
    recommendedLength: "Short",
    usesCount: 29,
    responseRate: "52.0%",
  },
  {
    id: "tmpl-4",
    title: "Internship & New Grad Outreach",
    category: "Job Application",
    description: "Polished cold outreach specifically tailored for internship or junior to mid-level engineering positions.",
    subject: "Inquiry: {{TargetRole}} at {{Company}} — {{SenderName}}",
    body: `Dear {{RecruiterName}},

I hope this email finds you well.

I am reaching out to express my strong enthusiasm for {{TargetRole}} opportunities at {{Company}}. Having built projects using {{RelevantTechnologies}}, I have closely followed {{Company}}'s engineering work and would love to contribute my problem-solving skills to your team.

I have included links to my interactive portfolio and GitHub repositories below for your review.

Would you be open to sharing advice or discussing open opportunities on your radar?

Sincerely,
{{SenderName}}
{{SenderEmail}}`,
    recommendedTone: "Formal",
    recommendedLength: "Medium",
    usesCount: 19,
    responseRate: "33.2%",
  },
  {
    id: "tmpl-5",
    title: "Alumni & Warm Referral Request",
    category: "Referral",
    description: "Friendly, respectful note asking an existing employee or connection for an internal introduction.",
    subject: "{{AlumniAffiliation}} fellow reaching out — quick question about {{Company}}",
    body: `Hi {{ContactName}},

Hope you're doing well! I saw through our shared connection with {{MutualAffiliation}} that you're working at {{Company}} on the {{TeamName}} team.

I am currently applying for the {{JobPosition}} opening at {{Company}}. Seeing how much you've accomplished there, I wanted to reach out and ask if you'd be comfortable sharing a bit of insight into the engineering culture, or potentially referring my resume if you feel there is good alignment.

Either way, appreciate all the inspiring work you do!

Best regards,
{{SenderName}}`,
    recommendedTone: "Friendly",
    recommendedLength: "Medium",
    usesCount: 24,
    responseRate: "58.4%",
  },
  {
    id: "tmpl-6",
    title: "Executive Pitch to Engineering Director / Founder",
    category: "Executive",
    description: "Direct, punchy message designed for founders, VPs, and engineering directors who value brevity and raw output.",
    subject: "{{Company}} + {{SenderName}} — Ideas on {{TopicOrProduct}}",
    body: `Hi {{ExecutiveName}},

Huge fan of what you're building at {{Company}}. I noticed your recent tweet/post regarding {{StrategicFocus}}.

I built a lightweight prototype exploring {{SpecificImprovement}} which reduced render times by 40% and improved conversion.

I would love to send over the 1-minute Loom video and code repository if you're interested. No pitch or sales, just wanted to share an idea that might help {{Company}} move even faster.

Let me know if you'd like a link!

Best,
{{SenderName}}`,
    recommendedTone: "Confident",
    recommendedLength: "Short",
    usesCount: 16,
    responseRate: "46.2%",
  },
];

export const OUTREACH_STATS = {
  totalSent: 142,
  emailsGenerated: 284,
  emailsOpened: 98,
  responseRate: "34.2%",
  interviewsScheduled: 18,
  offersReceived: 3,
  weeklyActivity: [
    { day: "Mon", sent: 8, opened: 6 },
    { day: "Tue", sent: 14, opened: 11 },
    { day: "Wed", sent: 12, opened: 9 },
    { day: "Thu", sent: 16, opened: 13 },
    { day: "Fri", sent: 9, opened: 5 },
    { day: "Sat", sent: 3, opened: 2 },
    { day: "Sun", sent: 4, opened: 3 },
  ],
  companyBreakdown: [
    { company: "Stripe", sent: 6, opened: 5, replied: 3, status: "Active Lead" },
    { company: "Linear", sent: 4, opened: 3, replied: 2, status: "Reviewing" },
    { company: "OpenAI", sent: 5, opened: 5, replied: 3, status: "Interviewing" },
    { company: "Figma", sent: 4, opened: 3, replied: 1, status: "Contacted" },
    { company: "Vercel", sent: 3, opened: 2, replied: 1, status: "Active Lead" },
    { company: "Airbnb", sent: 3, opened: 2, replied: 0, status: "Pending" },
    { company: "Supabase", sent: 2, opened: 2, replied: 1, status: "Connected" },
  ],
};
