# ⚡ PitchCraft — Chrome Extension (Manifest V3)

> **AI-Powered Cold Outreach & Email Pitch Assistant**  
> Generate personalized job applications, recruiter pitches, and cold emails in seconds — directly on LinkedIn, Gmail, and anywhere across the web.

---

## 🌟 Key Features

1. **LinkedIn 1-Click Auto-Fill**:
   - Automatically scrapes **Job Title**, **Company Name**, **Hiring Manager / Recruiter Name**, and **Job Description** from LinkedIn job postings and profile pages.
   - Floating action pill on LinkedIn: *"Draft Pitch with PitchCraft"*.

2. **Gmail 1-Click Injection**:
   - Hit **"Insert in Gmail Tab"** and PitchCraft communicates with your active Gmail tab, automatically filling the **Subject Line** and **Email Body** into your open compose box!
   - Quick Compose button embedded directly in Gmail's toolbar.

3. **Resume Reader & Career Intelligence**:
   - Upload your resume (**PDF**, **TXT**, or **Markdown**) or paste your resume text.
   - Automatically detects your **Name**, **Title**, **Contact Details**, **Skills Cloud**, and **Measurable Metric Achievements**.
   - Intelligently matches your resume's real bullet points against any target job posting on LinkedIn or job boards so outreach emails use your *real, proven accomplishments*!
   - 1-click **"Sync to Profile"** to update your sender settings.

4. **Multi-Tone & Multi-Length Engine**:
   - **Tones**: Confident, Friendly, Professional, Formal.
   - **Lengths**: Short (punchy 3-sentence hook), Medium (standard 3-paragraph), Detailed (full case with bulleted impact).
   - Zero-latency client-side AI generator built in, plus optional **OpenAI** or **Google Gemini** API integration in Settings.

5. **Chrome Side Panel & Popup**:
   - Use as a lightweight **Popup** (click the toolbar icon) or dock it permanently in **Chrome's Side Panel** while you browse candidates and jobs!

6. **Templates, History & Contacts**:
   - 5 battle-tested outreach templates (Cold Application, Product Pitch, Executive Inquiry, 3-Sentence Intro, Follow-up).
   - Auto-saves all generated pitches to local history with 1-click re-copying.
   - Recruiter and lead contact manager.

---

## 🚀 How to Install in Google Chrome (Takes 30 Seconds)

### Step 1: Open Chrome Extensions
1. Open Google Chrome.
2. In the URL address bar, enter:
   ```
   chrome://extensions
   ```
   and press **Enter**.

### Step 2: Enable Developer Mode
In the top-right corner of the Extensions page, toggle the **Developer mode** switch **ON**.

### Step 3: Load the Unpacked Extension
1. In the top-left corner, click the **"Load unpacked"** button.
2. In the file picker dialog, navigate to and select this directory:
   ```
   c:\Users\Sonu\Desktop\emailer\pitchcraft-extension
   ```
3. Click **"Select Folder"**.

### Step 4: Pin to Chrome Toolbar
1. Click the **Puzzle Piece (Extensions)** icon in your Chrome toolbar.
2. Find **PitchCraft - AI Email Outreach & Pitch Assistant** and click the **Pin** icon 📌.

---

## 💡 How to Use It

### Scenario A: Drafting a Pitch for a LinkedIn Job
1. Open any job post on [LinkedIn Jobs](https://www.linkedin.com/jobs/).
2. Click the PitchCraft extension icon (or click the floating *"Draft Pitch with PitchCraft"* button on the job page).
3. Click **"Auto-fill from active tab"**. PitchCraft automatically fills the Company, Role, and Recruiter info!
4. Choose your desired Tone (e.g., **Confident**) and Length (e.g., **Medium**).
5. Add any custom achievement (e.g., *"Reduced checkout latency by 38%"*).
6. Click **"Craft Personalized Pitch"**.
7. Click **"Copy"** or **"Insert in Gmail Tab"**!

### Scenario B: Injecting into Gmail
1. Open [Gmail](https://mail.google.com/) in a tab and click **Compose**.
2. Open PitchCraft in the popup or Side Panel.
3. Click **"Insert in Gmail Tab"**.
4. PitchCraft will immediately populate the Subject line and the message body directly into Gmail!

### Scenario C: Context Menu (Highlight & Draft)
1. Highlight any job description snippet or text on any website.
2. Right-click and choose **"Draft Pitch with PitchCraft"**.
3. PitchCraft opens with your selected text ready in the custom notes!

### Scenario D: Managing & Clearing Email History
1. **Auto-Save & Manual Save**:
   - Whenever you click **"Craft Personalized Pitch"**, it is **automatically saved** into your local history so you never lose an outreach email.
   - You can also click the prominent green **"💾 Save to History"** button in Compose at any time.
2. **Where is History saved?**
   - It is securely stored inside Chrome's local storage sandbox (`chrome.storage.local`) on your computer under the `"history"` key. It stays saved across restarts, browser closures, and tab changes.
3. **Viewing & Re-using**:
   - Click the **History** tab (which shows a live count badge, e.g., `History (4)`).
   - Click **"Load in Compose"** to load any past pitch back into the editor, or click **"Copy"** to grab it immediately.
4. **Clearing History**:
   - Click the red **"Clear History"** button at the top-right of the History view to delete all saved outreach with confirmation.
   - Or click the **"Delete"** button on any individual card to remove just that email.

---

## 📁 Extension Architecture

```
pitchcraft-extension/
├── manifest.json            # Chrome MV3 manifest configuration
├── icons/                   # 16px, 32px, 48px, 128px PNG & SVG icons
├── popup/
│   ├── popup.html           # Main UI workstation
│   ├── popup.css            # Dark mode styles (matching PitchCraft app)
│   └── popup.js             # View controller & actions
├── sidepanel/
│   ├── sidepanel.html       # Side panel viewport
│   └── sidepanel.css        # Responsive side panel styles
├── shared/
│   ├── ai-engine.js         # Built-in generator + LLM connector
│   └── storage.js           # chrome.storage.local persistence & defaults
├── content/
│   ├── content.js           # LinkedIn & Gmail page scraper & injector
│   └── content.css          # Injected UI elements
└── background/
    └── background.js        # Service worker (context menus, sidepanel routing)
```

---

## ⚙️ Customizing Your Profile
1. Open the PitchCraft extension.
2. Click the **Settings** tab.
3. Update your **Name**, **Email**, **Role**, **Portfolio / GitHub / LinkedIn**, and **Bio**.
4. All future pitches will automatically sign off with your information!

