# 🚀 PitchCraft AI - Smart Resume Cold Emailer (Chrome & Edge Extension)

> **Craft hyper-personalized, high-converting cold emails and job application pitches in seconds by comparing your resume with any job description, and send them directly via Gmail.**

---

## ✨ Key Features

1. **📄 Client-Side Resume Reader & Profile**
   - Drag & drop your **PDF resume** directly into the extension. The text is parsed 100% client-side in the browser—no third-party servers ever touch your resume.
   - Structured profile for Full Name, Role, Portfolio/GitHub links, Core Skills, and Key Achievements with metrics.

2. **✨ Active Tab Auto-Scraper for Job Posts**
   - One-click **"Auto-Grab JD"** automatically extracts Job Title, Company Name, Recruiter/Hiring Manager Email, and full Job Description from:
     - LinkedIn (`linkedin.com/jobs/*`)
     - Indeed (`indeed.com/*`)
     - Greenhouse (`greenhouse.io/*`)
     - Lever (`jobs.lever.co/*`)
     - Wellfound / AngelList (`wellfound.com/jobs/*`)
     - Any generic careers page or company website.
   - Also injects a subtle floating **"Draft Cold Email"** widget right on job posting pages!

3. **🤖 Powerful AI Pitch Generation**
   - **Google Gemini API** (Gemini 1.5 Flash / Pro, 2.0 Flash) with free tier support.
   - **OpenAI API** (GPT-4o, GPT-4o-mini).
   - **Smart Built-in Offline Engine**: Works 100% locally with zero API key configuration needed!
   - Calculates **Resume Match Score (0–100%)** and highlights top matching synergy points.
   - Tailors cold pitch by goal:
     - 🎯 Cold Pitch to Recruiter / Founder
     - 📝 Cover Letter / Application Pitch
     - 🤝 Referral Request to Team Member
     - ⏰ Application Follow-Up / Nudge
     - 💡 Proactive Value / Project Pitch
   - Multiple tones: *Confident & Results-Driven*, *Direct & Punchy (<120 words)*, *Professional*, or *Conversational*.
   - Cycles through high open-rate alternative subject lines.

4. **✉️ Multi-Channel Sending Options**
   - 🚀 **1-Click Open in Gmail Compose**: Opens a fresh Gmail tab with recipient email, optimized subject line, and body pre-filled ready to send!
   - ✉️ **Default Mail Client (`mailto:`)**: One-click to open in Apple Mail, Outlook, or Thunderbird.
   - ⚡ **Direct Automated Send**: Support for EmailJS or Webhooks (Zapier, Make, n8n) for automated background sending.
   - 📋 **1-Click Copy**: Copy full email with subject to clipboard.

5. **📜 Pitch History & Tracking**
   - Automatically saves all generated pitches with Company, Target Role, Recruiter Email, and status (Draft / Sent).
   - Re-open, re-edit, or re-send any previous pitch anytime.

---

## 🛠️ How to Install in Chrome / Edge / Brave

1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
2. Enable **"Developer mode"** (toggle in the top-right corner).
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select this directory:
   ```text
   c:\Users\Sonu\Desktop\emailer
   ```
5. PitchCraft AI will appear in your extensions toolbar! Click the puzzle icon and pin **PitchCraft AI** to your bar.

---

## 🔑 Getting a Free Google Gemini API Key (Optional)

PitchCraft AI includes a built-in offline generator that works out of the box with no API key. If you want maximum AI personalization with Gemini:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **"Create API Key"** (free tier gives you 15 requests per minute at zero cost).
3. In the extension, go to the **Settings** tab, paste your key into **Gemini API Key**, and click **Save Settings**.
4. Click **"Test AI Connection"** to verify.

---

## 🧪 Testing the Extension

We have included a complete interactive test suite:

- **`test-sandbox.html`**: Open this file in your browser to test and preview the extension UI and simulator directly in a tab:
  ```text
  file:///c:/Users/Sonu/Desktop/emailer/test-sandbox.html
  ```
- **`sample-job.html`**: Realistic mock job posting for *Senior Full-Stack Engineer at CloudScale AI* with recruiter email `sarah.chen@cloudscale.ai`. Open this page, click the extension icon or the floating "Draft Cold Email" button, and watch it auto-populate and generate a cold pitch!

---

## 📁 Project Structure

```text
emailer/
├── manifest.json         # Manifest V3 extension configuration
├── background.js         # Service worker, context menus, side panel setup
├── content.js            # Job posting scraper & floating trigger button
├── content.css           # Styling for in-page floating widget
├── popup.html            # Primary extension popup interface
├── popup.css             # Sleek dark-mode glassmorphic styling
├── popup.js              # State manager, event listeners, UI logic
├── sidepanel.html        # Side panel responsive studio view
├── ai-engine.js          # Gemini, OpenAI, offline generator, and email delivery
├── pdf-parser.js         # Client-side native PDF & document text parser
├── sample-job.html       # Realistic mock job post for testing
├── test-sandbox.html     # Interactive preview sandbox
├── generate-icons.js     # Script that created PNG extension icons
└── icons/                # Extension icons (16px, 48px, 128px)
```
