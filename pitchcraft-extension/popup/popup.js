// PitchCraft Popup & Sidepanel Controller

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const tabs = document.querySelectorAll(".nav-tab");
  const tabViews = document.querySelectorAll(".tab-view");
  const btnOpenSidepanel = document.getElementById("btn-open-sidepanel");

  // Compose elements
  const btnGrabPage = document.getElementById("btn-grab-page");
  const composeForm = document.getElementById("compose-form");
  const inputRecipientName = document.getElementById("recipient-name");
  const inputRecipientEmail = document.getElementById("recipient-email");
  const inputCompanyName = document.getElementById("company-name");
  const inputJobPosition = document.getElementById("job-position");
  const inputHighlights = document.getElementById("key-highlights");
  const tonePills = document.querySelectorAll("#tone-group .pill");
  const lengthPills = document.querySelectorAll("#length-group .pill");
  const btnGenerate = document.getElementById("btn-generate");

  // Output elements
  const outputSubject = document.getElementById("output-subject");
  const outputBody = document.getElementById("output-body");
  const btnCopyPitch = document.getElementById("btn-copy-pitch");
  const btnSaveDraft = document.getElementById("btn-save-draft");
  const btnSaveToHistoryMain = document.getElementById("btn-save-to-history-main");
  const historyBadge = document.getElementById("history-badge");
  const btnInsertGmail = document.getElementById("btn-insert-gmail");
  const btnOpenGmailCompose = document.getElementById("btn-open-gmail-compose");

  // Other views
  const templatesList = document.getElementById("templates-list");
  const historyList = document.getElementById("history-list");
  const contactsList = document.getElementById("contacts-list");
  const btnClearHistory = document.getElementById("btn-clear-history");
  const btnClearContacts = document.getElementById("btn-clear-contacts");
  const btnAddContactModal = document.getElementById("btn-add-contact-modal");
  const historySearchInput = document.getElementById("history-search-input");
  const contactSearchInput = document.getElementById("contact-search-input");
  const contactsBadge = document.getElementById("contacts-badge");

  // Settings
  const settingsForm = document.getElementById("settings-form");
  const settingName = document.getElementById("setting-name");
  const settingEmail = document.getElementById("setting-email");
  const settingRole = document.getElementById("setting-role");
  const settingPortfolio = document.getElementById("setting-portfolio");
  const settingBio = document.getElementById("setting-bio");
  const settingAiProvider = document.getElementById("setting-ai-provider");
  const apiKeyGroup = document.getElementById("api-key-group");
  const settingApiKey = document.getElementById("setting-api-key");

  // Resume elements
  const resumeStatusDot = document.getElementById("resume-status-dot");
  const resumeComposeBar = document.getElementById("resume-compose-bar");
  const resumeBarTitle = document.getElementById("resume-bar-title");
  const resumeBarDesc = document.getElementById("resume-bar-desc");
  const btnComposeResumeAction = document.getElementById("btn-compose-resume-action");
  const resumeDropzone = document.getElementById("resume-dropzone");
  const resumeFileInput = document.getElementById("resume-file-input");
  const btnTogglePasteResume = document.getElementById("btn-toggle-paste-resume");
  const resumePasteBox = document.getElementById("resume-paste-box");
  const resumePasteInput = document.getElementById("resume-paste-input");
  const btnParsePastedResume = document.getElementById("btn-parse-pasted-resume");
  const btnCancelPasteResume = document.getElementById("btn-cancel-paste-resume");
  const resumeParsedCard = document.getElementById("resume-parsed-card");
  const parsedCandidateName = document.getElementById("parsed-candidate-name");
  const parsedCandidateRole = document.getElementById("parsed-candidate-role");
  const parsedEmail = document.getElementById("parsed-email");
  const parsedPhone = document.getElementById("parsed-phone");
  const parsedSkillsCount = document.getElementById("parsed-skills-count");
  const parsedSkillsCloud = document.getElementById("parsed-skills-cloud");
  const parsedHighlightsList = document.getElementById("parsed-highlights-list");
  const btnSyncProfile = document.getElementById("btn-sync-profile");
  const btnClearResume = document.getElementById("btn-clear-resume");

  // State
  let selectedTone = "Confident";
  let selectedLength = "Medium";
  let userProfile = await PitchCraftStorage.getProfile();
  let userResume = await PitchCraftStorage.getResume();

  // Toast Helper
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // 1. Tab Navigation
  function switchTab(targetTab) {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === targetTab);
    });
    tabViews.forEach((view) => {
      view.classList.toggle("active", view.id === `view-${targetTab}`);
    });

    if (targetTab === "resume") renderResumeView();
    if (targetTab === "templates") renderTemplates();
    if (targetTab === "history") renderHistory();
    if (targetTab === "contacts") renderContacts();
    if (targetTab === "settings") loadSettings();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Dock to Side Panel
  if (btnOpenSidepanel) {
    btnOpenSidepanel.addEventListener("click", async () => {
      if (typeof chrome !== "undefined" && chrome.sidePanel && chrome.tabs) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && activeTab.id) {
          chrome.sidePanel.open({ tabId: activeTab.id });
          window.close(); // Close popup once side panel opens
        }
      } else {
        showToast("Side panel can be opened from Chrome toolbar", "info");
      }
    });
  }

  // 2. Tone & Length Pill Toggles
  tonePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      tonePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      selectedTone = pill.dataset.value;
    });
  });

  lengthPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      lengthPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      selectedLength = pill.dataset.value;
    });
  });

  // 3. Auto-fill from Active Tab
  async function grabPageData() {
    if (typeof chrome === "undefined" || !chrome.tabs) {
      showToast("Cannot access browser tabs in this mode", "error");
      return;
    }

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab || !activeTab.id) {
      showToast("No active web page detected", "error");
      return;
    }

    try {
      chrome.tabs.sendMessage(activeTab.id, { action: "SCRAPE_PAGE" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.data) {
          showToast("Open a LinkedIn job or candidate profile to auto-fill", "info");
          return;
        }

        const data = response.data;
        let filledCount = 0;

        if (data.recipientName && !inputRecipientName.value) {
          inputRecipientName.value = data.recipientName;
          filledCount++;
        }
        if (data.companyName && !inputCompanyName.value) {
          inputCompanyName.value = data.companyName;
          filledCount++;
        }
        if (data.jobTitle && !inputJobPosition.value) {
          inputJobPosition.value = data.jobTitle;
          filledCount++;
        }
        if (data.jobDescription && !inputHighlights.value) {
          inputHighlights.value = data.jobDescription.slice(0, 250) + "...";
          filledCount++;
        }

        if (filledCount > 0) {
          showToast(`Captured ${filledCount} fields from ${data.platform || "page"}!`, "success");
        } else {
          showToast("Form already filled or no new data detected on page", "info");
        }
      });
    } catch (e) {
      console.warn("Auto-fill error:", e);
      showToast("Could not communicate with page script", "error");
    }
  }

  btnGrabPage.addEventListener("click", grabPageData);

  // Check storage on open for context menu selections or scraped jobs
  async function checkInitialContext() {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const data = await chrome.storage.local.get(["quickContextText", "scrapedJobData"]);
      if (data.scrapedJobData) {
        if (data.scrapedJobData.recipientName) inputRecipientName.value = data.scrapedJobData.recipientName;
        if (data.scrapedJobData.companyName) inputCompanyName.value = data.scrapedJobData.companyName;
        if (data.scrapedJobData.jobTitle) inputJobPosition.value = data.scrapedJobData.jobTitle;
        if (data.scrapedJobData.jobDescription) inputHighlights.value = data.scrapedJobData.jobDescription.slice(0, 250);
        await chrome.storage.local.remove("scrapedJobData");
        showToast("Auto-filled from captured LinkedIn details!", "success");
      }
      if (data.quickContextText) {
        inputHighlights.value = data.quickContextText;
        await chrome.storage.local.remove("quickContextText");
        showToast("Auto-filled from highlighted text selection!", "success");
      }
    }
  }
  checkInitialContext();

  // 4. Generate Pitch
  composeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recipientName = inputRecipientName.value.trim();
    const recipientEmail = inputRecipientEmail.value.trim();
    const companyName = inputCompanyName.value.trim();
    const jobPosition = inputJobPosition.value.trim();
    const keyHighlight = inputHighlights.value.trim();

    if (!jobPosition && !companyName) {
      showToast("Please enter at least a Target Role or Company Name", "error");
      return;
    }

    btnGenerate.disabled = true;
    btnGenerate.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      </svg>
      <span>Generating tailored pitch...</span>
    `;

    try {
      userProfile = await PitchCraftStorage.getProfile();
      userResume = await PitchCraftStorage.getResume();
      const result = await PitchCraftAI.generate({
        recipientName,
        recipientEmail,
        companyName,
        jobPosition,
        keyHighlight,
        tone: selectedTone,
        length: selectedLength,
        senderProfile: userProfile,
        resumeProfile: userResume
      });

      outputSubject.value = result.subject;
      outputBody.value = result.body;

      // Automatically save draft to local storage
      await PitchCraftStorage.saveDraft({
        recipientName,
        recipientEmail,
        companyName,
        jobPosition,
        keyHighlight,
        tone: selectedTone,
        length: selectedLength,
        subject: result.subject,
        body: result.body
      });

      // Automatically record to History so user never loses generated outreach
      await saveCurrentPitchToHistory(true);

      showToast("Pitch crafted & saved to history!", "success");

      // Smooth scroll to output
      outputSubject.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      showToast("Generation failed: " + err.message, "error");
    } finally {
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
        <span>Craft Personalized Pitch</span>
      `;
    }
  });

  // 5. Update History Badge Counter
  async function updateHistoryBadge() {
    if (!historyBadge) return;
    const history = await PitchCraftStorage.getHistory();
    const count = Array.isArray(history) ? history.length : 0;
    historyBadge.textContent = count;
    historyBadge.style.display = count > 0 ? "inline-flex" : "none";
  }

  // 6. Save Pitch to History
  async function saveCurrentPitchToHistory(silent = false) {
    if (!outputBody.value) {
      if (!silent) showToast("No pitch generated yet to save", "error");
      return false;
    }

    const item = {
      id: "hist-" + Date.now(),
      recipientName: inputRecipientName.value.trim() || "Prospect",
      recipientEmail: inputRecipientEmail.value.trim() || "",
      company: inputCompanyName.value.trim() || "Company",
      jobPosition: inputJobPosition.value.trim() || "Role",
      subject: outputSubject.value.trim(),
      body: outputBody.value.trim(),
      tone: selectedTone,
      length: selectedLength,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: Date.now(),
      status: "Saved"
    };

    await PitchCraftStorage.addHistory(item);
    await updateHistoryBadge();

    if (!silent) {
      showToast("Saved to Outreach History!", "success");
      if (btnSaveToHistoryMain) {
        const origHtml = btnSaveToHistoryMain.innerHTML;
        btnSaveToHistoryMain.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Saved!</span>
        `;
        setTimeout(() => {
          btnSaveToHistoryMain.innerHTML = origHtml;
        }, 2000);
      }
    }
    return true;
  }

  if (btnSaveToHistoryMain) {
    btnSaveToHistoryMain.addEventListener("click", () => saveCurrentPitchToHistory(false));
  }
  btnSaveDraft.addEventListener("click", () => saveCurrentPitchToHistory(false));

  // 7. Copy Pitch
  btnCopyPitch.addEventListener("click", async () => {
    const textToCopy = `${outputSubject.value}\n\n${outputBody.value}`;
    if (!outputBody.value) {
      showToast("No pitch generated yet", "error");
      return;
    }
    await navigator.clipboard.writeText(textToCopy);
    showToast("Pitch copied to clipboard!", "success");
  });

  // 7. Insert into Gmail
  btnInsertGmail.addEventListener("click", async () => {
    if (!outputBody.value) {
      showToast("Generate a pitch first", "error");
      return;
    }

    if (typeof chrome === "undefined" || !chrome.tabs) {
      showToast("Cannot communicate with tabs in this environment", "error");
      return;
    }

    // Find active tab or any open Gmail tab
    const tabs = await chrome.tabs.query({ url: "*://mail.google.com/*" });
    if (!tabs || tabs.length === 0) {
      showToast("No open Gmail tab found. Opening Gmail...", "info");
      openInGmailUrl();
      return;
    }

    const gmailTab = tabs.find((t) => t.active) || tabs[0];

    chrome.tabs.sendMessage(
      gmailTab.id,
      {
        action: "INSERT_INTO_GMAIL",
        subject: outputSubject.value,
        body: outputBody.value
      },
      (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          showToast(
            response && response.error
              ? response.error
              : "Click 'Compose' in Gmail tab first, then try again!",
            "error"
          );
        } else {
          showToast("Pitch inserted directly into Gmail compose box!", "success");
          // Focus the Gmail tab
          chrome.tabs.update(gmailTab.id, { active: true });
        }
      }
    );
  });

  // 8. Open in Gmail Compose via URL
  function openInGmailUrl() {
    const to = encodeURIComponent(inputRecipientEmail.value.trim());
    const su = encodeURIComponent(outputSubject.value.trim());
    const body = encodeURIComponent(outputBody.value.trim());
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;

    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: gmailUrl });
    } else {
      window.open(gmailUrl, "_blank");
    }
  }
  btnOpenGmailCompose.addEventListener("click", openInGmailUrl);

  // 9. Templates Rendering
  async function renderTemplates() {
    const templates = await PitchCraftStorage.getTemplates();
    templatesList.innerHTML = "";

    templates.forEach((tpl) => {
      const card = document.createElement("div");
      card.className = "template-card";
      card.innerHTML = `
        <div class="tpl-header">
          <span class="tpl-title">${tpl.title}</span>
          <span class="tpl-tag">${tpl.category}</span>
        </div>
        <div class="tpl-preview">${tpl.subject}\n${tpl.body.slice(0, 120)}...</div>
        <button class="btn-use-tpl" data-id="${tpl.id}">Use Template</button>
      `;

      card.querySelector(".btn-use-tpl").addEventListener("click", () => {
        applyTemplate(tpl);
      });

      templatesList.appendChild(card);
    });
  }

  function applyTemplate(tpl) {
    userProfile = userProfile || {};
    const recipient = inputRecipientName.value.trim() || "there";
    const company = inputCompanyName.value.trim() || "your team";
    const position = inputJobPosition.value.trim() || "Engineering Role";
    const highlight = inputHighlights.value.trim() || "In my recent experience, I led frontend architectural scaling.";

    let renderedSubject = tpl.subject
      .replace(/{{jobPosition}}/g, position)
      .replace(/{{companyName}}/g, company)
      .replace(/{{senderName}}/g, userProfile.name || "Monu Shah");

    let renderedBody = tpl.body
      .replace(/{{recipientName}}/g, recipient)
      .replace(/{{companyName}}/g, company)
      .replace(/{{jobPosition}}/g, position)
      .replace(/{{keyHighlight}}/g, highlight)
      .replace(/{{senderName}}/g, userProfile.name || "Monu Shah")
      .replace(/{{senderEmail}}/g, userProfile.email || "monushah.dev@gmail.com")
      .replace(/{{senderPortfolio}}/g, userProfile.portfolio || "github.com/monushah108");

    outputSubject.value = renderedSubject;
    outputBody.value = renderedBody;

    // Set tone pill if matches
    if (tpl.tone) {
      selectedTone = tpl.tone;
      tonePills.forEach((p) => p.classList.toggle("active", p.dataset.value === tpl.tone));
    }
    if (tpl.length) {
      selectedLength = tpl.length;
      lengthPills.forEach((p) => p.classList.toggle("active", p.dataset.value === tpl.length));
    }

    switchTab("compose");
    showToast(`Template "${tpl.title}" loaded!`, "success");
    outputSubject.scrollIntoView({ behavior: "smooth" });
  }

  // 10. History Rendering
  async function renderHistory(searchFilter = "") {
    const history = await PitchCraftStorage.getHistory();
    historyList.innerHTML = "";
    await updateHistoryBadge();

    if (!Array.isArray(history) || history.length === 0) {
      historyList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-title">No Email History Found</div>
          <div class="empty-desc">Pitches you generate or click "Save to History" will be stored here.</div>
          <button type="button" class="btn-use-tpl" id="btn-empty-go-compose">Draft New Pitch</button>
        </div>
      `;
      const btnGoCompose = document.getElementById("btn-empty-go-compose");
      if (btnGoCompose) {
        btnGoCompose.addEventListener("click", () => switchTab("compose"));
      }
      return;
    }

    let itemsToDisplay = history;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      itemsToDisplay = history.filter(
        (item) =>
          (item.recipientName && item.recipientName.toLowerCase().includes(q)) ||
          (item.company && item.company.toLowerCase().includes(q)) ||
          (item.jobPosition && item.jobPosition.toLowerCase().includes(q)) ||
          (item.subject && item.subject.toLowerCase().includes(q))
      );
    }

    if (itemsToDisplay.length === 0) {
      historyList.innerHTML = `<div style="text-align:center; padding: 32px 16px; color: var(--text-muted); font-size: 12px;">No saved emails matching "${searchFilter}"</div>`;
      return;
    }

    itemsToDisplay.forEach((item) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="hist-top">
          <span class="hist-name">${item.recipientName || "Contact"} (${item.company || "Company"})</span>
          <span class="hist-date">${item.date || "Recent"}</span>
        </div>
        <div class="hist-role">${item.jobPosition || "Outreach Pitch"}</div>
        <div class="hist-body">${item.subject || item.body.slice(0, 80) + "..."}</div>
        <div class="hist-actions">
          <button class="hist-btn btn-load-hist" data-id="${item.id}">Load in Compose</button>
          <button class="hist-btn btn-copy-hist" data-id="${item.id}">Copy</button>
          <button class="hist-btn btn-del-hist" data-id="${item.id}" style="color: #f87171;">Delete</button>
        </div>
      `;

      card.querySelector(".btn-load-hist").addEventListener("click", () => {
        inputRecipientName.value = item.recipientName || "";
        inputRecipientEmail.value = item.recipientEmail || "";
        inputCompanyName.value = item.company || "";
        inputJobPosition.value = item.jobPosition || "";
        outputSubject.value = item.subject || "";
        outputBody.value = item.body || "";
        switchTab("compose");
        showToast("Pitch loaded into Compose!", "info");
      });

      card.querySelector(".btn-copy-hist").addEventListener("click", async () => {
        await navigator.clipboard.writeText(`${item.subject}\n\n${item.body}`);
        showToast("Copied to clipboard!", "success");
      });

      card.querySelector(".btn-del-hist").addEventListener("click", async () => {
        await PitchCraftStorage.deleteHistory(item.id);
        await renderHistory(historySearchInput ? historySearchInput.value.trim() : "");
        await updateHistoryBadge();
        showToast("Email deleted from history", "info");
      });

      historyList.appendChild(card);
    });
  }

  // Clear All History Handler
  btnClearHistory.addEventListener("click", async () => {
    const history = await PitchCraftStorage.getHistory();
    const count = Array.isArray(history) ? history.length : 0;

    if (count === 0) {
      showToast("Email history is already empty", "info");
      return;
    }

    if (confirm(`Are you sure you want to clear all ${count} saved emails from history? This action cannot be undone.`)) {
      await PitchCraftStorage.saveHistory([]);
      await renderHistory();
      await updateHistoryBadge();
      showToast("All email history cleared successfully!", "success");
    }
  });

  // History Search Filter
  if (historySearchInput) {
    historySearchInput.addEventListener("input", (e) => {
      renderHistory(e.target.value.trim());
    });
  }

  // Contacts Badge
  async function updateContactsBadge() {
    if (!contactsBadge) return;
    const contacts = await PitchCraftStorage.getContacts();
    const count = Array.isArray(contacts) ? contacts.length : 0;
    contactsBadge.textContent = count;
    contactsBadge.style.display = count > 0 ? "inline-flex" : "none";
  }

  // 11. Contacts Rendering
  async function renderContacts(searchFilter = "") {
    const contacts = await PitchCraftStorage.getContacts();
    contactsList.innerHTML = "";
    await updateContactsBadge();

    if (!Array.isArray(contacts) || contacts.length === 0) {
      contactsList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">👥</div>
          <div class="empty-title">No Contacts Saved</div>
          <div class="empty-desc">Save recruiters and hiring managers to quickly pitch them anytime.</div>
          <button type="button" class="btn-use-tpl" id="btn-empty-add-contact">+ Add First Contact</button>
        </div>
      `;
      const btnEmptyAdd = document.getElementById("btn-empty-add-contact");
      if (btnEmptyAdd) {
        btnEmptyAdd.addEventListener("click", () => btnAddContactModal.click());
      }
      return;
    }

    let itemsToDisplay = contacts;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      itemsToDisplay = contacts.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          (c.position && c.position.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (itemsToDisplay.length === 0) {
      contactsList.innerHTML = `<div style="text-align:center; padding: 32px 16px; color: var(--text-muted); font-size: 12px;">No contacts matching "${searchFilter}"</div>`;
      return;
    }

    itemsToDisplay.forEach((contact) => {
      const card = document.createElement("div");
      card.className = "contact-card";
      const initials = (contact.name || "C")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      card.innerHTML = `
        <div class="contact-avatar">${initials}</div>
        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-role">${contact.position} • ${contact.company}</div>
        </div>
        <div class="contact-actions">
          <button class="btn-use-tpl btn-pitch-contact" data-id="${contact.id}">Pitch</button>
          <button class="hist-btn btn-del-contact" data-id="${contact.id}" style="color: #f87171;" title="Delete contact">✕</button>
        </div>
      `;

      card.querySelector(".btn-pitch-contact").addEventListener("click", () => {
        inputRecipientName.value = contact.name;
        inputRecipientEmail.value = contact.email;
        inputCompanyName.value = contact.company;
        inputJobPosition.value = contact.position;
        switchTab("compose");
        showToast(`Drafting pitch for ${contact.name}`, "info");
      });

      card.querySelector(".btn-del-contact").addEventListener("click", async () => {
        await PitchCraftStorage.deleteContact(contact.id);
        await renderContacts(contactSearchInput ? contactSearchInput.value.trim() : "");
        await updateContactsBadge();
        showToast(`Contact ${contact.name} removed`, "info");
      });

      contactsList.appendChild(card);
    });
  }

  // Clear All Contacts Handler
  if (btnClearContacts) {
    btnClearContacts.addEventListener("click", async () => {
      const contacts = await PitchCraftStorage.getContacts();
      const count = Array.isArray(contacts) ? contacts.length : 0;

      if (count === 0) {
        showToast("Contacts list is already empty", "info");
        return;
      }

      if (confirm(`Are you sure you want to clear all ${count} contacts? This action cannot be undone.`)) {
        await PitchCraftStorage.clearContacts();
        await renderContacts();
        await updateContactsBadge();
        showToast("All contacts cleared successfully!", "success");
      }
    });
  }

  // Contact Search Filter
  if (contactSearchInput) {
    contactSearchInput.addEventListener("input", (e) => {
      renderContacts(e.target.value.trim());
    });
  }

  btnAddContactModal.addEventListener("click", async () => {
    const name = prompt("Contact Full Name:");
    if (!name) return;
    const email = prompt("Email Address:") || "";
    const company = prompt("Company Name:") || "";
    const position = prompt("Job Title / Role:") || "";

    const newContact = {
      id: "cnt-" + Date.now(),
      name,
      email,
      company,
      position,
      notes: ""
    };

    await PitchCraftStorage.addContact(newContact);
    renderContacts();
    await updateContactsBadge();
    showToast(`Added ${name} to contacts!`, "success");
  });

  // 12. Settings
  async function loadSettings() {
    userProfile = await PitchCraftStorage.getProfile();
    settingName.value = userProfile.name || "";
    settingEmail.value = userProfile.email || "";
    settingRole.value = userProfile.role || "";
    settingPortfolio.value = userProfile.portfolio || "";
    settingBio.value = userProfile.bio || "";
    settingAiProvider.value = userProfile.aiProvider || "builtin";
    settingApiKey.value = userProfile.apiKey || "";

    apiKeyGroup.style.display = settingAiProvider.value !== "builtin" ? "block" : "none";
  }

  settingAiProvider.addEventListener("change", () => {
    apiKeyGroup.style.display = settingAiProvider.value !== "builtin" ? "block" : "none";
  });

  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    userProfile = {
      name: settingName.value.trim(),
      email: settingEmail.value.trim(),
      role: settingRole.value.trim(),
      portfolio: settingPortfolio.value.trim(),
      bio: settingBio.value.trim(),
      aiProvider: settingAiProvider.value,
      apiKey: settingApiKey.value.trim()
    };

    await PitchCraftStorage.saveProfile(userProfile);
    showToast("Preferences and Profile saved!", "success");
  });

  // 13. Resume Intelligence Controller
  function updateResumeMatchHint() {
    if (!userResume || !resumeBarDesc) return;
    const pos = inputJobPosition.value.trim();
    if (pos && typeof ResumeParser !== "undefined") {
      const match = ResumeParser.findBestMatchForJob(userResume, pos, inputHighlights.value);
      if (match.matchingSkills && match.matchingSkills.length > 0) {
        resumeBarDesc.textContent = `⚡ Role matches: ${match.matchingSkills.join(", ")}`;
        return;
      }
    }
    if (userResume.skills && userResume.skills.length > 0) {
      resumeBarDesc.textContent = `${userResume.skills.slice(0, 4).join(", ")} • ${userResume.highlights.length} achievements`;
    }
  }

  inputJobPosition.addEventListener("input", updateResumeMatchHint);

  async function renderResumeView() {
    userResume = await PitchCraftStorage.getResume();

    if (userResume) {
      if (resumeStatusDot) resumeStatusDot.classList.add("active");
      if (resumeComposeBar) {
        resumeComposeBar.classList.add("has-resume");
        resumeBarTitle.textContent = `📄 Using ${userResume.name || "Your"}'s Resume`;
        updateResumeMatchHint();
        btnComposeResumeAction.textContent = "View Resume";
      }

      if (resumeDropzone) resumeDropzone.style.display = "none";
      if (resumePasteBox) resumePasteBox.style.display = "none";
      if (btnTogglePasteResume) btnTogglePasteResume.style.display = "none";
      if (resumeParsedCard) {
        resumeParsedCard.style.display = "block";
        parsedCandidateName.textContent = userResume.name || "Candidate Profile";
        parsedCandidateRole.textContent = userResume.role || "Professional Track Record";
        parsedEmail.textContent = userResume.email ? `📧 ${userResume.email}` : "📧 No email detected";
        parsedPhone.textContent = userResume.phone ? `📱 ${userResume.phone}` : (userResume.portfolio ? `🔗 ${userResume.portfolio}` : "");

        parsedSkillsCount.textContent = (userResume.skills || []).length;
        parsedSkillsCloud.innerHTML = "";
        (userResume.skills || []).forEach(skill => {
          const tag = document.createElement("span");
          tag.className = "skill-tag";
          tag.textContent = skill;
          parsedSkillsCloud.appendChild(tag);
        });

        parsedHighlightsList.innerHTML = "";
        (userResume.highlights || []).forEach((hl, idx) => {
          const item = document.createElement("div");
          item.className = "highlight-item";
          item.textContent = `${idx + 1}. ${hl}`;
          parsedHighlightsList.appendChild(item);
        });
      }
    } else {
      if (resumeStatusDot) resumeStatusDot.classList.remove("active");
      if (resumeComposeBar) {
        resumeComposeBar.classList.remove("has-resume");
        resumeBarTitle.textContent = "No Resume Uploaded";
        resumeBarDesc.textContent = "Upload your resume to tailor pitches with your real metrics";
        btnComposeResumeAction.textContent = "Upload Resume";
      }

      if (resumeDropzone) resumeDropzone.style.display = "block";
      if (btnTogglePasteResume) btnTogglePasteResume.style.display = "block";
      if (resumeParsedCard) resumeParsedCard.style.display = "none";
      if (resumePasteBox) resumePasteBox.style.display = "none";
    }
  }

  // Handle File Upload (PDF or Text)
  async function handleResumeFile(file) {
    if (!file) return;

    showToast(`Reading ${file.name}...`, "info");
    try {
      const rawText = await ResumeParser.extractTextFromFile(file);
      if (!rawText || rawText.trim().length < 40) {
        throw new Error("Resume content is too short or unreadable.");
      }

      const parsed = ResumeParser.parse(rawText);
      await PitchCraftStorage.saveResume(parsed);
      userResume = parsed;
      await renderResumeView();
      showToast(`Resume for ${parsed.name} parsed successfully! (${parsed.skills.length} skills found)`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Could not read resume: ${err.message}`, "error");
    }
  }

  // Dropzone events
  if (resumeDropzone && resumeFileInput) {
    resumeDropzone.addEventListener("click", () => resumeFileInput.click());

    resumeFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleResumeFile(file);
    });

    resumeDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      resumeDropzone.classList.add("dragover");
    });

    resumeDropzone.addEventListener("dragleave", () => {
      resumeDropzone.classList.remove("dragover");
    });

    resumeDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      resumeDropzone.classList.remove("dragover");
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleResumeFile(file);
    });
  }

  // Toggle Paste Option
  if (btnTogglePasteResume && resumePasteBox) {
    btnTogglePasteResume.addEventListener("click", () => {
      resumePasteBox.style.display = resumePasteBox.style.display === "none" ? "block" : "none";
    });
  }

  if (btnCancelPasteResume && resumePasteBox) {
    btnCancelPasteResume.addEventListener("click", () => {
      resumePasteBox.style.display = "none";
    });
  }

  if (btnParsePastedResume && resumePasteInput) {
    btnParsePastedResume.addEventListener("click", async () => {
      const text = resumePasteInput.value.trim();
      if (!text || text.length < 50) {
        showToast("Please paste your full resume text", "error");
        return;
      }

      try {
        const parsed = ResumeParser.parse(text);
        await PitchCraftStorage.saveResume(parsed);
        userResume = parsed;
        resumePasteInput.value = "";
        await renderResumeView();
        showToast(`Resume parsed! Found ${parsed.skills.length} skills and ${parsed.highlights.length} achievements.`, "success");
      } catch (err) {
        showToast("Failed to parse resume: " + err.message, "error");
      }
    });
  }

  // Sync Resume Details to Settings Profile
  if (btnSyncProfile) {
    btnSyncProfile.addEventListener("click", async () => {
      if (!userResume) return;
      const profile = await PitchCraftStorage.getProfile();
      if (userResume.name && userResume.name !== "Candidate") profile.name = userResume.name;
      if (userResume.email) profile.email = userResume.email;
      if (userResume.role) profile.role = userResume.role;
      if (userResume.portfolio) profile.portfolio = userResume.portfolio;
      if (userResume.highlights && userResume.highlights.length > 0) {
        profile.bio = userResume.highlights.slice(0, 2).join(" ");
      }
      await PitchCraftStorage.saveProfile(profile);
      await loadSettings();
      showToast("Synced resume name, email & achievements into Profile!", "success");
    });
  }

  // Clear Resume
  if (btnClearResume) {
    btnClearResume.addEventListener("click", async () => {
      if (confirm("Are you sure you want to remove your uploaded resume?")) {
        await PitchCraftStorage.clearResume();
        userResume = null;
        await renderResumeView();
        showToast("Resume removed", "info");
      }
    });
  }

  // Jump from Compose bar to Resume tab
  if (btnComposeResumeAction) {
    btnComposeResumeAction.addEventListener("click", () => {
      switchTab("resume");
    });
  }

  // Initialize initial profile data, history badge, contacts badge & resume view
  loadSettings();
  updateHistoryBadge();
  updateContactsBadge();
  renderResumeView();
});

