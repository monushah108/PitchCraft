// background.js - PitchCraft AI Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('PitchCraft AI Extension installed');

  // Initialize default storage values if not present
  chrome.storage.local.get(['settings', 'resumeProfile'], (data) => {
    if (!data.settings) {
      chrome.storage.local.set({
        settings: {
          aiProvider: 'gemini', // 'gemini' | 'openai' | 'offline'
          geminiApiKey: '',
          geminiModel: 'gemini-1.5-flash',
          openaiApiKey: '',
          openaiModel: 'gpt-4o-mini',
          customPrompt: '',
          defaultTone: 'confident',
          defaultGoal: 'cold_outreach',
          sendMethod: 'gmail', // 'gmail' | 'mailto' | 'emailjs'
          emailJsServiceId: '',
          emailJsTemplateId: '',
          emailJsPublicKey: '',
          webhookUrl: ''
        }
      });
    }

    if (!data.resumeProfile) {
      chrome.storage.local.set({
        resumeProfile: {
          fullName: 'Alex Morgan',
          currentTitle: 'Senior Full-Stack Engineer',
          email: 'alex.morgan@example.com',
          phone: '+1 (555) 234-5678',
          linkedin: 'https://linkedin.com/in/alexmorgan',
          portfolio: 'https://alexmorgan.dev',
          skills: 'React, Node.js, TypeScript, Next.js, Python, PostgreSQL, AWS, Docker, GraphQL, System Design',
          experience: '5+ years building scalable web applications. Led frontend architecture at TechCorp improving load times by 42%. Built microservices handling 2M+ daily requests.',
          fullResumeText: `ALEX MORGAN
San Francisco, CA | alex.morgan@example.com | alexmorgan.dev | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Engineer with 5+ years of experience specializing in high-performance web applications, cloud architecture, and modern JavaScript/TypeScript ecosystems. Proven track record of boosting user engagement and scaling backend infrastructure.

CORE SKILLS
- Frontend: React, Next.js, TypeScript, TailwindCSS, Redux Toolkit, Vue.js
- Backend: Node.js, Express, Python (FastAPI/Django), RESTful APIs, GraphQL
- Database & Cloud: PostgreSQL, MongoDB, Redis, AWS (Lambda, S3, ECS), Docker, CI/CD

SELECTED EXPERIENCE
Senior Software Engineer | TechCorp (2022 - Present)
- Architected modular frontend platform serving 500k+ active users; reduced latency by 35%.
- Spearheaded adoption of Next.js and TypeScript, increasing engineering velocity by 25%.
- Mentored junior engineers and conducted code reviews across a 12-person distributed team.

Full-Stack Developer | StartupLab (2020 - 2022)
- Built automated reporting engine processing 50M data points using Node.js and PostgreSQL.
- Designed responsive interfaces and integrated Stripe billing system generating $1.2M ARR.

EDUCATION
B.S. in Computer Science | University of California, Berkeley`
        }
      });
    }
  });

  // Create context menus for quick job extraction
  try {
    chrome.contextMenus.create({
      id: 'extract-job-description',
      title: '✨ Extract to PitchCraft AI',
      contexts: ['selection', 'page']
    });

    chrome.contextMenus.create({
      id: 'open-side-panel',
      title: '📑 Open PitchCraft Side Panel',
      contexts: ['all']
    });
  } catch (err) {
    console.warn('Context menu creation warning:', err);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-side-panel') {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  } else if (info.menuItemId === 'extract-job-description') {
    // If text was selected, save as current job description
    const selectedText = info.selectionText || '';
    if (selectedText) {
      chrome.storage.local.set({
        extractedJob: {
          jobDescription: selectedText,
          pageTitle: tab.title || '',
          url: tab.url || '',
          timestamp: Date.now()
        }
      }, () => {
        // Try opening side panel or notify user
        if (chrome.sidePanel && chrome.sidePanel.open) {
          chrome.sidePanel.open({ windowId: tab.windowId });
        }
      });
    } else {
      // Ask content script to scrape the page
      chrome.tabs.sendMessage(tab.id, { action: 'SCRAPE_JOB_DETAILS' }, (response) => {
        if (response && response.success) {
          chrome.storage.local.set({ extractedJob: response.data });
          if (chrome.sidePanel && chrome.sidePanel.open) {
            chrome.sidePanel.open({ windowId: tab.windowId });
          }
        }
      });
    }
  }
});

// Message listener for communications across components
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_SIDE_PANEL') {
    if (chrome.sidePanel && chrome.sidePanel.open && sender.tab) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Side panel not available' });
    }
  }
  return true;
});
