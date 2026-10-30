// content.js - Job page scraper & Quick Action button for PitchCraft AI

(() => {
  // Regex to detect emails anywhere in the document
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  function findEmailsOnPage() {
    const emails = new Set();
    
    // Check mailto links first
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      const href = a.getAttribute('href') || '';
      const email = href.replace(/^mailto:/i, '').split('?')[0].trim();
      if (email && email.includes('@')) emails.add(email);
    });

    // Scan text in body
    const bodyText = document.body ? document.body.innerText : '';
    const matches = bodyText.match(EMAIL_REGEX);
    if (matches) {
      matches.forEach(e => {
        const lower = e.toLowerCase();
        // Filter out obvious false positives like file extensions or placeholder examples
        if (!lower.endsWith('.png') && !lower.endsWith('.jpg') && !lower.includes('sentry') && !lower.includes('w3.org')) {
          emails.add(e);
        }
      });
    }

    return Array.from(emails);
  }

  function extractJobDetails() {
    const url = window.location.href;
    let jobTitle = '';
    let companyName = '';
    let jobDescription = '';
    let recruiterName = '';

    // 1. LinkedIn
    if (url.includes('linkedin.com')) {
      const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1.t-24, .top-card-layout__title');
      if (titleEl) jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .topcard__flavor--black-link');
      if (compEl) companyName = compEl.innerText.trim();

      const descEl = document.querySelector('#job-details, .jobs-description__content, .show-more-less-html__markup');
      if (descEl) jobDescription = descEl.innerText.trim();

      const posterEl = document.querySelector('.jobs-poster__name, .hirer-card__hirer-information');
      if (posterEl) recruiterName = posterEl.innerText.trim().split('\n')[0];
    }
    // 2. Indeed
    else if (url.includes('indeed.com')) {
      const titleEl = document.querySelector('h1.jobsearch-JobInfoHeader-title, .jobsearch-JobInfoHeader-title');
      if (titleEl) jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector('[data-company-name="true"], .jobsearch-InlineCompanyRating-companyHeader');
      if (compEl) companyName = compEl.innerText.trim();

      const descEl = document.querySelector('#jobDescriptionText');
      if (descEl) jobDescription = descEl.innerText.trim();
    }
    // 3. Greenhouse
    else if (url.includes('greenhouse.io')) {
      const titleEl = document.querySelector('.app-title, h1.heading');
      if (titleEl) jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector('.company-name');
      if (compEl) companyName = compEl.innerText.trim();

      const descEl = document.querySelector('#content, .body');
      if (descEl) jobDescription = descEl.innerText.trim();
    }
    // 4. Lever
    else if (url.includes('jobs.lever.co')) {
      const titleEl = document.querySelector('.posting-headline h2');
      if (titleEl) jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector('.main-header-logo img');
      if (compEl && compEl.alt) companyName = compEl.alt.replace('logo', '').trim();

      const descEl = document.querySelector('.section-wrapper, .posting-page');
      if (descEl) jobDescription = descEl.innerText.trim();
    }
    // 5. Wellfound / AngelList
    else if (url.includes('wellfound.com')) {
      const titleEl = document.querySelector('h1');
      if (titleEl) jobTitle = titleEl.innerText.trim();

      const descEl = document.querySelector('[data-test="JobDescription"]');
      if (descEl) jobDescription = descEl.innerText.trim();
    }

    // Generic Fallbacks
    if (!jobTitle) {
      const h1 = document.querySelector('h1');
      if (h1) jobTitle = h1.innerText.trim();
      else jobTitle = document.title.split('-')[0].split('|')[0].trim();
    }

    if (!jobDescription) {
      // Find main content container
      const candidates = [
        document.querySelector('article'),
        document.querySelector('[role="main"]'),
        document.querySelector('.job-description'),
        document.querySelector('.description'),
        document.querySelector('#job-description'),
        document.querySelector('main')
      ];

      for (const el of candidates) {
        if (el && el.innerText.length > 200) {
          jobDescription = el.innerText.trim();
          break;
        }
      }

      if (!jobDescription) {
        // Collect largest text blocks
        const paragraphs = Array.from(document.querySelectorAll('p, li, div'))
          .map(el => el.innerText.trim())
          .filter(t => t.length > 60);
        jobDescription = paragraphs.slice(0, 15).join('\n\n');
      }
    }

    const emails = findEmailsOnPage();
    const primaryEmail = emails.length > 0 ? emails[0] : '';

    return {
      jobTitle: jobTitle || 'Software Engineer',
      companyName: companyName || document.title.split(/[-|]/)[1]?.trim() || '',
      recruiterName: recruiterName || '',
      recruiterEmail: primaryEmail,
      foundEmails: emails,
      jobDescription: jobDescription || document.body.innerText.substring(0, 4000),
      pageUrl: url,
      pageTitle: document.title,
      timestamp: Date.now()
    };
  }

  // Listen for message from popup or background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SCRAPE_JOB_DETAILS') {
      const details = extractJobDetails();
      sendResponse({ success: true, data: details });
    } else if (request.action === 'GET_PAGE_EMAILS') {
      const emails = findEmailsOnPage();
      sendResponse({ success: true, emails });
    }
    return true;
  });

  // Inject a small floating helper button on job sites
  function injectFloatingHelper() {
    if (document.getElementById('pitchcraft-floating-btn')) return;

    // Only show if likely a job posting page
    const isJobPage = window.location.href.match(/job|careers|greenhouse|lever|indeed|linkedin\.com\/jobs|workday/i) ||
                      document.title.match(/job|career|hiring|engineer|developer|designer|manager/i);

    if (!isJobPage) return;

    const btn = document.createElement('div');
    btn.id = 'pitchcraft-floating-btn';
    btn.innerHTML = `
      <div class="pitchcraft-float-inner" title="Extract Job & Draft Email with PitchCraft AI">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
        </svg>
        <span class="pitchcraft-float-text">Draft Cold Email</span>
      </div>
    `;

    btn.addEventListener('click', () => {
      const details = extractJobDetails();
      chrome.storage.local.set({ extractedJob: details }, () => {
        // Open side panel if available
        chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' }, () => {
          // Provide visual feedback
          const textSpan = btn.querySelector('.pitchcraft-float-text');
          if (textSpan) {
            const old = textSpan.innerText;
            textSpan.innerText = 'Extracted! Open Extension';
            setTimeout(() => { textSpan.innerText = old; }, 3000);
          }
        });
      });
    });

    document.body.appendChild(btn);
  }

  // Inject once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingHelper);
  } else {
    injectFloatingHelper();
  }
})();
