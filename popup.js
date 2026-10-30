// popup.js - Controller for PitchCraft AI Extension

document.addEventListener('DOMContentLoaded', async () => {
  // State
  let currentPitchData = null;
  let alternativeSubjects = [];
  let currentSubjectIndex = 0;

  // DOM Elements - Navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const btnOpenTab = document.getElementById('btn-open-tab');

  // DOM Elements - Generator Form
  const btnAutoScrape = document.getElementById('btn-auto-scrape');
  const scrapeStatus = document.getElementById('scrape-status');
  const inputRecipientEmail = document.getElementById('input-recipient-email');
  const inputRecruiterName = document.getElementById('input-recruiter-name');
  const inputCompanyName = document.getElementById('input-company-name');
  const inputJobTitle = document.getElementById('input-job-title');
  const inputJobDesc = document.getElementById('input-job-desc');
  const jdCharCount = document.getElementById('jd-char-count');
  const selectGoal = document.getElementById('select-goal');
  const selectTone = document.getElementById('select-tone');
  const btnGeneratePitch = document.getElementById('btn-generate-pitch');
  const generationLoader = document.getElementById('generation-loader');
  const loaderStatusText = document.getElementById('loader-status-text');

  // DOM Elements - Output
  const outputSection = document.getElementById('output-section');
  const matchScoreVal = document.getElementById('match-score-val');
  const matchStrengthsContainer = document.getElementById('match-strengths-container');
  const strategyTipBox = document.getElementById('strategy-tip-box');
  const strategyTipText = document.getElementById('strategy-tip-text');
  const outputSubject = document.getElementById('output-subject');
  const btnCycleSubject = document.getElementById('btn-cycle-subject');
  const altSubjectCount = document.getElementById('alt-subject-count');
  const outputBody = document.getElementById('output-body');
  const outputWordCount = document.getElementById('output-word-count');
  const btnSendGmail = document.getElementById('btn-send-gmail');
  const btnSendMailto = document.getElementById('btn-send-mailto');
  const btnDirectSend = document.getElementById('btn-direct-send');
  const btnCopyEmail = document.getElementById('btn-copy-email');

  // DOM Elements - Resume
  const resumeDropzone = document.getElementById('resume-dropzone');
  const resumeFileInput = document.getElementById('resume-file-input');
  const fileParsedAlert = document.getElementById('file-parsed-alert');
  const fileNameDisplay = document.getElementById('file-name-display');
  const profFullName = document.getElementById('prof-fullname');
  const profTitle = document.getElementById('prof-title');
  const profEmail = document.getElementById('prof-email');
  const profPhone = document.getElementById('prof-phone');
  const profLinkedin = document.getElementById('prof-linkedin');
  const profPortfolio = document.getElementById('prof-portfolio');
  const profSkills = document.getElementById('prof-skills');
  const profExperience = document.getElementById('prof-experience');
  const profFullText = document.getElementById('prof-fulltext');
  const resumeCharCount = document.getElementById('resume-char-count');
  const btnSaveResume = document.getElementById('btn-save-resume');

  // DOM Elements - History
  const historyList = document.getElementById('history-list');
  const historyEmptyState = document.getElementById('history-empty-state');
  const historyBadge = document.getElementById('history-badge');
  const historyTotalCount = document.getElementById('history-total-count');
  const btnClearHistory = document.getElementById('btn-clear-history');

  // DOM Elements - Settings
  const settingAiProvider = document.getElementById('setting-ai-provider');
  const wrapGeminiSettings = document.getElementById('wrap-gemini-settings');
  const settingGeminiKey = document.getElementById('setting-gemini-key');
  const settingGeminiModel = document.getElementById('setting-gemini-model');
  const wrapOpenAiSettings = document.getElementById('wrap-openai-settings');
  const settingOpenAiKey = document.getElementById('setting-openai-key');
  const settingOpenAiModel = document.getElementById('setting-openai-model');
  const settingCustomPrompt = document.getElementById('setting-custom-prompt');
  const settingEmailJsService = document.getElementById('setting-emailjs-service');
  const settingEmailJsTemplate = document.getElementById('setting-emailjs-template');
  const settingEmailJsPublicKey = document.getElementById('setting-emailjs-publickey');
  const settingWebhookUrl = document.getElementById('setting-webhook-url');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const btnTestAi = document.getElementById('btn-test-ai');

  // ================= TAB SWITCHING =================
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });

  // Open Full Tab / Side Panel
  if (btnOpenTab) {
    btnOpenTab.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
      } else {
        window.open('sidepanel.html', '_blank');
      }
    });
  }

  // ================= STORAGE INITIALIZATION =================
  async function loadData() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['resumeProfile', 'settings', 'history', 'extractedJob'], (data) => {
        if (data.resumeProfile) populateResumeProfile(data.resumeProfile);
        if (data.settings) populateSettings(data.settings);
        if (data.history) renderHistory(data.history);
        if (data.extractedJob) checkExtractedJob(data.extractedJob);
      });
    } else {
      // Local testing fallback
      const savedProf = localStorage.getItem('pitchcraft_resume');
      if (savedProf) populateResumeProfile(JSON.parse(savedProf));
      const savedSett = localStorage.getItem('pitchcraft_settings');
      if (savedSett) populateSettings(JSON.parse(savedSett));
      const savedHist = localStorage.getItem('pitchcraft_history');
      if (savedHist) renderHistory(JSON.parse(savedHist));
    }
  }

  function populateResumeProfile(profile) {
    profFullName.value = profile.fullName || '';
    profTitle.value = profile.currentTitle || '';
    profEmail.value = profile.email || '';
    profPhone.value = profile.phone || '';
    profLinkedin.value = profile.linkedin || '';
    profPortfolio.value = profile.portfolio || '';
    profSkills.value = profile.skills || '';
    profExperience.value = profile.experience || '';
    profFullText.value = profile.fullResumeText || '';
    updateCharCount(profFullText, resumeCharCount);
  }

  function populateSettings(settings) {
    settingAiProvider.value = settings.aiProvider || 'gemini';
    settingGeminiKey.value = settings.geminiApiKey || '';
    settingGeminiModel.value = settings.geminiModel || 'gemini-1.5-flash';
    settingOpenAiKey.value = settings.openaiApiKey || '';
    settingOpenAiModel.value = settings.openaiModel || 'gpt-4o-mini';
    settingCustomPrompt.value = settings.customPrompt || '';
    settingEmailJsService.value = settings.emailJsServiceId || '';
    settingEmailJsTemplate.value = settings.emailJsTemplateId || '';
    settingEmailJsPublicKey.value = settings.emailJsPublicKey || '';
    settingWebhookUrl.value = settings.webhookUrl || '';
    toggleProviderSections(settingAiProvider.value);
  }

  function toggleProviderSections(provider) {
    wrapGeminiSettings.classList.toggle('hidden', provider !== 'gemini');
    wrapOpenAiSettings.classList.toggle('hidden', provider !== 'openai');
  }

  settingAiProvider.addEventListener('change', () => {
    toggleProviderSections(settingAiProvider.value);
  });

  // Toggle Password Visibility
  document.querySelectorAll('.btn-toggle-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  // Character Counts
  function updateCharCount(el, countEl) {
    const len = el.value.length;
    countEl.textContent = `${len.toLocaleString()} chars`;
  }
  inputJobDesc.addEventListener('input', () => updateCharCount(inputJobDesc, jdCharCount));
  profFullText.addEventListener('input', () => updateCharCount(profFullText, resumeCharCount));

  // ================= AUTO-SCRAPE FROM ACTIVE TAB =================
  btnAutoScrape.addEventListener('click', async () => {
    btnAutoScrape.disabled = true;
    btnAutoScrape.innerHTML = '<span>Scanning tab...</span>';

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) throw new Error('No active browser tab found.');

        chrome.tabs.sendMessage(tab.id, { action: 'SCRAPE_JOB_DETAILS' }, (response) => {
          btnAutoScrape.disabled = false;
          btnAutoScrape.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21h5v-5"></path>
            </svg> Auto-Grab JD`;

          if (chrome.runtime.lastError || !response || !response.success) {
            showToast('Unable to auto-extract. Ensure you are on a job posting page.', 'error');
            return;
          }

          applyJobData(response.data);
          showToast(`Successfully extracted job details from ${response.data.companyName || 'page'}!`, 'success');
        });
      } catch (err) {
        btnAutoScrape.disabled = false;
        showToast(err.message, 'error');
      }
    } else {
      btnAutoScrape.disabled = false;
      showToast('Chrome Tabs API is only available inside browser extension.', 'error');
    }
  });

  function checkExtractedJob(jobData) {
    if (jobData && Date.now() - (jobData.timestamp || 0) < 600000) { // within last 10 mins
      applyJobData(jobData);
    }
  }

  function applyJobData(data) {
    if (data.companyName) inputCompanyName.value = data.companyName;
    if (data.jobTitle) inputJobTitle.value = data.jobTitle;
    if (data.recruiterName) inputRecruiterName.value = data.recruiterName;
    if (data.recruiterEmail) inputRecipientEmail.value = data.recruiterEmail;
    if (data.jobDescription) {
      inputJobDesc.value = data.jobDescription;
      updateCharCount(inputJobDesc, jdCharCount);
    }

    scrapeStatus.className = 'status-pill success';
    scrapeStatus.innerHTML = `✓ Captured: <strong>${data.jobTitle || 'Role'}</strong> at <strong>${data.companyName || 'Company'}</strong>`;
    scrapeStatus.classList.remove('hidden');
  }

  // ================= RESUME DROPZONE & PARSING =================
  resumeDropzone.addEventListener('click', () => resumeFileInput.click());

  resumeDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    resumeDropzone.classList.add('dragover');
  });

  resumeDropzone.addEventListener('dragleave', () => {
    resumeDropzone.classList.remove('dragover');
  });

  resumeDropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    resumeDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleResumeFile(e.dataTransfer.files[0]);
    }
  });

  resumeFileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleResumeFile(e.target.files[0]);
    }
  });

  async function handleResumeFile(file) {
    fileNameDisplay.textContent = file.name;
    fileParsedAlert.classList.remove('hidden');
    showToast(`Parsing ${file.name}...`, 'info');

    try {
      let extractedText = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file);
      } else {
        extractedText = await file.text();
      }

      profFullText.value = extractedText;
      updateCharCount(profFullText, resumeCharCount);

      // Auto-extract candidate info heuristically from resume text
      autoExtractProfileFields(extractedText);
      showToast('Resume extracted! Review & save your profile.', 'success');
    } catch (err) {
      showToast(`Extraction warning: ${err.message}. You can paste text directly.`, 'error');
    }
  }

  function autoExtractProfileFields(text) {
    // Email regex
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !profEmail.value) profEmail.value = emailMatch[0];

    // Phone regex
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch && !profPhone.value) profPhone.value = phoneMatch[0];

    // LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (linkedinMatch && !profLinkedin.value) profLinkedin.value = `https://${linkedinMatch[0]}`;

    // GitHub / Portfolio
    const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    if (githubMatch && !profPortfolio.value) profPortfolio.value = `https://${githubMatch[0]}`;

    // Guess candidate name from first non-empty line
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2 && l.length < 40);
    if (lines.length > 0 && !profFullName.value) {
      const candidateName = lines[0].replace(/resume|curriculum vitae|cv/i, '').trim();
      if (candidateName) profFullName.value = candidateName;
    }
  }

  // Save Resume Profile
  btnSaveResume.addEventListener('click', () => {
    const profile = {
      fullName: profFullName.value.trim(),
      currentTitle: profTitle.value.trim(),
      email: profEmail.value.trim(),
      phone: profPhone.value.trim(),
      linkedin: profLinkedin.value.trim(),
      portfolio: profPortfolio.value.trim(),
      skills: profSkills.value.trim(),
      experience: profExperience.value.trim(),
      fullResumeText: profFullText.value.trim()
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ resumeProfile: profile }, () => {
        showToast('Resume profile saved successfully!', 'success');
      });
    } else {
      localStorage.setItem('pitchcraft_resume', JSON.stringify(profile));
      showToast('Resume profile saved successfully!', 'success');
    }
  });

  // ================= SAVE SETTINGS =================
  btnSaveSettings.addEventListener('click', () => {
    const settings = {
      aiProvider: settingAiProvider.value,
      geminiApiKey: settingGeminiKey.value.trim(),
      geminiModel: settingGeminiModel.value,
      openaiApiKey: settingOpenAiKey.value.trim(),
      openaiModel: settingOpenAiModel.value,
      customPrompt: settingCustomPrompt.value.trim(),
      emailJsServiceId: settingEmailJsService.value.trim(),
      emailJsTemplateId: settingEmailJsTemplate.value.trim(),
      emailJsPublicKey: settingEmailJsPublicKey.value.trim(),
      webhookUrl: settingWebhookUrl.value.trim()
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ settings }, () => {
        showToast('Settings saved successfully!', 'success');
      });
    } else {
      localStorage.setItem('pitchcraft_settings', JSON.stringify(settings));
      showToast('Settings saved successfully!', 'success');
    }
  });

  // Test AI Connection
  btnTestAi.addEventListener('click', async () => {
    const provider = settingAiProvider.value;
    btnTestAi.disabled = true;
    btnTestAi.textContent = 'Testing connection...';

    try {
      if (provider === 'gemini') {
        const key = settingGeminiKey.value.trim();
        if (!key) throw new Error('Please enter a Gemini API Key first.');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!res.ok) throw new Error(`Invalid Gemini API Key (${res.status})`);
        showToast('Gemini API Connection Verified! ✓', 'success');
      } else if (provider === 'openai') {
        const key = settingOpenAiKey.value.trim();
        if (!key) throw new Error('Please enter an OpenAI API Key first.');
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        if (!res.ok) throw new Error(`Invalid OpenAI API Key (${res.status})`);
        showToast('OpenAI API Connection Verified! ✓', 'success');
      } else {
        showToast('Built-in offline engine is active and ready with zero setup! ✓', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btnTestAi.disabled = false;
      btnTestAi.textContent = 'Test AI Connection';
    }
  });

  // ================= GENERATE PITCH =================
  btnGeneratePitch.addEventListener('click', async () => {
    const recipientEmail = inputRecipientEmail.value.trim();
    const companyName = inputCompanyName.value.trim();
    const jobTitle = inputJobTitle.value.trim();
    const jobDescription = inputJobDesc.value.trim();

    if (!recipientEmail || !recipientEmail.includes('@')) {
      showToast('Please enter a valid Recruiter / Recipient Email address.', 'error');
      inputRecipientEmail.focus();
      return;
    }
    if (!companyName) {
      showToast('Please enter the Company Name.', 'error');
      inputCompanyName.focus();
      return;
    }
    if (!jobTitle) {
      showToast('Please enter the Target Role / Title.', 'error');
      inputJobTitle.focus();
      return;
    }
    if (!jobDescription || jobDescription.length < 20) {
      showToast('Please enter the Job Description (at least a brief summary).', 'error');
      inputJobDesc.focus();
      return;
    }

    // Prepare Payload
    const jobData = {
      recruiterEmail,
      recruiterName: inputRecruiterName.value.trim(),
      companyName,
      jobTitle,
      jobDescription
    };

    const options = {
      goal: selectGoal.value,
      tone: selectTone.value
    };

    const resumeProfile = {
      fullName: profFullName.value.trim() || 'Candidate',
      currentTitle: profTitle.value.trim() || 'Software Engineer',
      email: profEmail.value.trim() || 'alex.morgan@example.com',
      phone: profPhone.value.trim(),
      linkedin: profLinkedin.value.trim(),
      portfolio: profPortfolio.value.trim(),
      skills: profSkills.value.trim(),
      experience: profExperience.value.trim(),
      fullResumeText: profFullText.value.trim()
    };

    const settings = {
      aiProvider: settingAiProvider.value,
      geminiApiKey: settingGeminiKey.value.trim(),
      geminiModel: settingGeminiModel.value,
      openaiApiKey: settingOpenAiKey.value.trim(),
      openaiModel: settingOpenAiModel.value,
      customPrompt: settingCustomPrompt.value.trim(),
      emailJsServiceId: settingEmailJsService.value.trim(),
      emailJsTemplateId: settingEmailJsTemplate.value.trim(),
      emailJsPublicKey: settingEmailJsPublicKey.value.trim(),
      webhookUrl: settingWebhookUrl.value.trim()
    };

    // UI Feedback: Loading
    btnGeneratePitch.disabled = true;
    generationLoader.classList.remove('hidden');
    outputSection.classList.add('hidden');

    const loaderMessages = [
      'Reading resume profile & matching competencies...',
      'Analyzing job requirements and target keywords...',
      'Crafting high-converting hook and tailored pitch...',
      'Optimizing subject line for maximum open rate...'
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loaderMessages.length;
      loaderStatusText.textContent = loaderMessages[msgIdx];
    }, 1200);

    try {
      const result = await AiEngine.generatePitch({ resumeProfile, jobData, options, settings });
      clearInterval(interval);

      currentPitchData = {
        ...result,
        jobData,
        options,
        timestamp: Date.now()
      };

      displayResult(result);
      saveToHistory(currentPitchData);
      showToast('AI Cold Email generated successfully!', 'success');
    } catch (err) {
      clearInterval(interval);
      showToast(`Generation Error: ${err.message}`, 'error');
      console.error(err);
    } finally {
      btnGeneratePitch.disabled = false;
      generationLoader.classList.add('hidden');
    }
  });

  function displayResult(result) {
    // Match score
    const score = result.matchScore || 85;
    matchScoreVal.textContent = `${score}%`;

    // Strengths
    matchStrengthsContainer.innerHTML = '';
    const strengths = result.matchingStrengths || [];
    strengths.slice(0, 3).forEach(s => {
      const chip = document.createElement('div');
      chip.className = 'strength-chip';
      chip.textContent = s;
      matchStrengthsContainer.appendChild(chip);
    });

    // Strategy tip
    if (result.strategyTip) {
      strategyTipText.textContent = result.strategyTip;
      strategyTipBox.classList.remove('hidden');
    } else {
      strategyTipBox.classList.add('hidden');
    }

    // Subjects
    outputSubject.value = result.subjectLine || '';
    alternativeSubjects = [result.subjectLine, ...(result.alternativeSubjects || [])].filter(Boolean);
    currentSubjectIndex = 0;
    altSubjectCount.textContent = Math.max(0, alternativeSubjects.length - 1);

    // Body
    outputBody.value = result.emailBody || '';
    updateOutputWordCount();

    outputSection.classList.remove('hidden');
    outputSection.scrollIntoView({ behavior: 'smooth' });
  }

  function updateOutputWordCount() {
    const text = outputBody.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    outputWordCount.textContent = `${words} words`;
  }
  outputBody.addEventListener('input', updateOutputWordCount);

  // Cycle alternative subjects
  btnCycleSubject.addEventListener('click', () => {
    if (alternativeSubjects.length <= 1) {
      showToast('No additional alternate subject lines for this generation.', 'info');
      return;
    }
    currentSubjectIndex = (currentSubjectIndex + 1) % alternativeSubjects.length;
    outputSubject.value = alternativeSubjects[currentSubjectIndex];
    showToast(`Switched to subject variation ${currentSubjectIndex + 1} of ${alternativeSubjects.length}`, 'info');
  });

  // ================= SENDING ACTIONS =================
  // 1. Open in Gmail
  btnSendGmail.addEventListener('click', () => {
    const to = inputRecipientEmail.value.trim();
    const subject = outputSubject.value.trim();
    const body = outputBody.value.trim();

    if (!to) {
      showToast('Recipient email is missing.', 'error');
      return;
    }

    AiEngine.sendViaGmail({ to, subject, body });
    markHistoryItemSent(to, subject);
    showToast('Opening Gmail compose tab...', 'success');
  });

  // 2. Open in Mail Client (mailto)
  btnSendMailto.addEventListener('click', () => {
    const to = inputRecipientEmail.value.trim();
    const subject = outputSubject.value.trim();
    const body = outputBody.value.trim();

    AiEngine.sendViaMailto({ to, subject, body });
    markHistoryItemSent(to, subject);
  });

  // 3. Direct Send (EmailJS / Webhook)
  btnDirectSend.addEventListener('click', async () => {
    const to = inputRecipientEmail.value.trim();
    const subject = outputSubject.value.trim();
    const body = outputBody.value.trim();

    const settings = {
      emailJsServiceId: settingEmailJsService.value.trim(),
      emailJsTemplateId: settingEmailJsTemplate.value.trim(),
      emailJsPublicKey: settingEmailJsPublicKey.value.trim(),
      webhookUrl: settingWebhookUrl.value.trim()
    };

    if (!settings.webhookUrl && (!settings.emailJsServiceId || !settings.emailJsTemplateId || !settings.emailJsPublicKey)) {
      showToast('Configure EmailJS or Webhook in Settings tab first for direct sending.', 'error');
      return;
    }

    btnDirectSend.disabled = true;
    btnDirectSend.textContent = 'Sending...';

    try {
      if (settings.webhookUrl) {
        await AiEngine.sendViaWebhook({ to, subject, body, webhookUrl: settings.webhookUrl });
        showToast('Email dispatched to Webhook successfully!', 'success');
      } else {
        await AiEngine.sendViaEmailJs({
          to,
          subject,
          body,
          settings,
          candidateName: profFullName.value.trim(),
          replyTo: profEmail.value.trim()
        });
        showToast('Email sent directly via EmailJS! ✓', 'success');
      }
      markHistoryItemSent(to, subject);
    } catch (err) {
      showToast(`Direct send failed: ${err.message}`, 'error');
    } finally {
      btnDirectSend.disabled = false;
      btnDirectSend.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg> Direct Send`;
    }
  });

  // 4. Copy Email Body
  btnCopyEmail.addEventListener('click', async () => {
    const subject = outputSubject.value.trim();
    const body = outputBody.value.trim();
    const fullText = `Subject: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(fullText);
      showToast('Copied full email to clipboard! 📋', 'success');
    } catch {
      showToast('Clipboard access denied. Please select and copy manually.', 'error');
    }
  });

  // ================= HISTORY MANAGEMENT =================
  function saveToHistory(pitch) {
    const item = {
      id: 'pitch_' + Date.now(),
      company: pitch.jobData.companyName,
      role: pitch.jobData.jobTitle,
      recipient: pitch.jobData.recruiterEmail,
      subject: pitch.subjectLine,
      body: pitch.emailBody,
      timestamp: pitch.timestamp || Date.now(),
      status: 'draft'
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['history'], (data) => {
        const hist = data.history || [];
        hist.unshift(item);
        if (hist.length > 50) hist.pop(); // keep last 50
        chrome.storage.local.set({ history: hist });
        renderHistory(hist);
      });
    } else {
      const hist = JSON.parse(localStorage.getItem('pitchcraft_history') || '[]');
      hist.unshift(item);
      if (hist.length > 50) hist.pop();
      localStorage.setItem('pitchcraft_history', JSON.stringify(hist));
      renderHistory(hist);
    }
  }

  function markHistoryItemSent(to, subject) {
    const updater = (hist) => {
      const item = hist.find(h => h.recipient === to && (h.subject === subject || !subject));
      if (item) item.status = 'sent';
      return hist;
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['history'], (data) => {
        const updated = updater(data.history || []);
        chrome.storage.local.set({ history: updated });
        renderHistory(updated);
      });
    } else {
      const hist = JSON.parse(localStorage.getItem('pitchcraft_history') || '[]');
      const updated = updater(hist);
      localStorage.setItem('pitchcraft_history', JSON.stringify(updated));
      renderHistory(updated);
    }
  }

  function renderHistory(hist) {
    historyList.innerHTML = '';
    const count = hist ? hist.length : 0;
    historyBadge.textContent = count;
    historyTotalCount.textContent = `${count} pitch${count === 1 ? '' : 'es'} saved`;

    if (count === 0) {
      historyEmptyState.classList.remove('hidden');
      return;
    }

    historyEmptyState.classList.add('hidden');

    hist.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-item';

      const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      card.innerHTML = `
        <div class="history-top">
          <span class="history-company">${escapeHtml(item.company || 'Unknown')} - <span style="font-weight:normal;color:#94a3b8;">${escapeHtml(item.role || 'Role')}</span></span>
          <span class="history-date">${dateStr}</span>
        </div>
        <div class="history-subject">To: <strong>${escapeHtml(item.recipient || '')}</strong> | ${escapeHtml(item.subject || '')}</div>
        <div class="history-actions">
          <button class="mini-btn btn-hist-open" title="Open and re-edit in Generator">Load in Editor</button>
          <button class="mini-btn btn-hist-gmail" style="color:#f87171;">Send Gmail</button>
          <button class="mini-btn btn-hist-copy">Copy</button>
          <button class="mini-btn text-btn danger btn-hist-del">Delete</button>
        </div>
      `;

      // Event Listeners for item
      card.querySelector('.btn-hist-open').addEventListener('click', () => {
        inputRecipientEmail.value = item.recipient || '';
        inputCompanyName.value = item.company || '';
        inputJobTitle.value = item.role || '';
        outputSubject.value = item.subject || '';
        outputBody.value = item.body || '';
        outputSection.classList.remove('hidden');
        document.querySelector('[data-tab="tab-generator"]').click();
        outputSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Pitch loaded into editor.', 'info');
      });

      card.querySelector('.btn-hist-gmail').addEventListener('click', () => {
        AiEngine.sendViaGmail({ to: item.recipient, subject: item.subject, body: item.body });
        item.status = 'sent';
      });

      card.querySelector('.btn-hist-copy').addEventListener('click', async () => {
        await navigator.clipboard.writeText(`Subject: ${item.subject}\n\n${item.body}`);
        showToast('Pitch copied to clipboard!', 'success');
      });

      card.querySelector('.btn-hist-del').addEventListener('click', () => {
        deleteHistoryItem(item.id);
      });

      historyList.appendChild(card);
    });
  }

  function deleteHistoryItem(id) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['history'], (data) => {
        const filtered = (data.history || []).filter(h => h.id !== id);
        chrome.storage.local.set({ history: filtered });
        renderHistory(filtered);
      });
    } else {
      const hist = JSON.parse(localStorage.getItem('pitchcraft_history') || '[]');
      const filtered = hist.filter(h => h.id !== id);
      localStorage.setItem('pitchcraft_history', JSON.stringify(filtered));
      renderHistory(filtered);
    }
    showToast('Pitch removed from history.', 'info');
  }

  btnClearHistory.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ history: [] });
      } else {
        localStorage.setItem('pitchcraft_history', '[]');
      }
      renderHistory([]);
      showToast('History cleared.', 'info');
    }
  });

  // ================= TOAST NOTIFICATION UTILITY =================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 3000);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Load saved state
  await loadData();
});
