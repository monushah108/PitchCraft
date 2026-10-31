// PitchCraft Content Script
// Active on LinkedIn, Gmail, Indeed, Wellfound, Glassdoor, and other supported pages

(function () {
  console.log("PitchCraft Content Script initialized.");

  // Scraper logic for different platforms
  function scrapePageDetails() {
    const url = window.location.href;
    let data = {
      platform: "generic",
      jobTitle: "",
      companyName: "",
      recipientName: "",
      jobDescription: "",
      url: url
    };

    // 1. LinkedIn
    if (url.includes("linkedin.com")) {
      data.platform = "linkedin";

      // Check if Job Details page
      if (url.includes("/jobs/")) {
        const titleEl = document.querySelector(
          ".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1.t-24, .topcard__title, h1"
        );
        if (titleEl) data.jobTitle = titleEl.innerText.trim();

        const compEl = document.querySelector(
          ".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, a.topcard__org-name-link, .jobs-unified-top-card__subtitle-primary-grouping a"
        );
        if (compEl) data.companyName = compEl.innerText.trim();

        // Hirer / Recruiter
        const hirerEl = document.querySelector(
          ".hirer-card__hirer-information .jobs-poster__name, .message-the-recruiter, .hirer-card__hirer-information strong, .jobs-poster a"
        );
        if (hirerEl) {
          data.recipientName = hirerEl.innerText.trim();
        }

        // Job description snippet
        const descEl = document.querySelector("#job-details, .jobs-box__html-content, .jobs-description__content");
        if (descEl) {
          data.jobDescription = descEl.innerText.slice(0, 1000).trim();
        }
      } 
      // Check if Profile page
      else if (url.includes("/in/")) {
        const nameEl = document.querySelector("h1.text-heading-xlarge, h1");
        if (nameEl) data.recipientName = nameEl.innerText.trim();

        const headlineEl = document.querySelector(".text-body-medium.break-words");
        if (headlineEl) {
          const headline = headlineEl.innerText.trim();
          data.jobTitle = headline;
          if (headline.includes(" at ")) {
            data.companyName = headline.split(" at ")[1].split("|")[0].trim();
          } else if (headline.includes("@")) {
            data.companyName = headline.split("@")[1].split("|")[0].trim();
          }
        }
      }
    }

    // 2. Indeed
    else if (url.includes("indeed.com")) {
      data.platform = "indeed";
      const titleEl = document.querySelector("h1.jobsearch-JobInfoHeader-title, [data-testid='simpler-jobTitle']");
      if (titleEl) data.jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector("[data-testid='inlineHeader-companyName'], .jobsearch-CompanyInfoWithoutHeaderImage");
      if (compEl) data.companyName = compEl.innerText.trim();

      const descEl = document.querySelector("#jobDescriptionText");
      if (descEl) data.jobDescription = descEl.innerText.slice(0, 1000).trim();
    }

    // 3. Wellfound / AngelList
    else if (url.includes("wellfound.com")) {
      data.platform = "wellfound";
      const titleEl = document.querySelector("h1");
      if (titleEl) data.jobTitle = titleEl.innerText.trim();

      const compEl = document.querySelector("a[href*='/company/']");
      if (compEl) data.companyName = compEl.innerText.trim();
    }

    // Generic fallback
    if (!data.jobTitle) {
      const h1 = document.querySelector("h1");
      if (h1) data.jobTitle = h1.innerText.trim();
    }

    return data;
  }

  // Gmail insertion helper
  function insertIntoGmail(subject, body) {
    // 1. Locate Subject box
    const subjectInput = document.querySelector('input[name="subjectbox"]');
    if (subjectInput && subject) {
      subjectInput.value = subject;
      subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
      subjectInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // 2. Locate Body (contenteditable div)
    const bodyBox = document.querySelector(
      'div[role="textbox"][aria-label*="Message Body"], div[aria-label*="Message Body"], .Am.Al.editable'
    );

    if (bodyBox) {
      bodyBox.focus();
      // Convert linebreaks to paragraphs/br tags for HTML contenteditable
      const formattedHtml = body
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");

      document.execCommand("insertHTML", false, formattedHtml);
      bodyBox.dispatchEvent(new Event("input", { bubbles: true }));
      return { success: true };
    }

    return {
      success: false,
      error: "No active Gmail compose window detected. Please click 'Compose' in Gmail first."
    };
  }

  // Inject PitchCraft floating trigger button on LinkedIn Job pages
  function injectLinkedInAction() {
    if (!window.location.href.includes("linkedin.com/jobs")) return;
    if (document.getElementById("pitchcraft-linkedin-pill")) return;

    const targetContainer = document.querySelector(
      ".job-details-jobs-unified-top-card__container--two-pane, .jobs-unified-top-card"
    );

    if (targetContainer) {
      const btn = document.createElement("button");
      btn.id = "pitchcraft-linkedin-pill";
      btn.className = "pitchcraft-btn-pill";
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span>Draft Pitch with PitchCraft</span>
      `;

      btn.addEventListener("click", () => {
        const details = scrapePageDetails();
        chrome.storage.local.set({ scrapedJobData: details }, () => {
          // Open side panel if available
          chrome.runtime.sendMessage({ action: "OPEN_SIDEPANEL" });
          btn.innerHTML = `<span>✓ Job details captured! Open PitchCraft</span>`;
          setTimeout(() => {
            btn.innerHTML = `<span>⚡ Draft Pitch with PitchCraft</span>`;
          }, 3000);
        });
      });

      targetContainer.appendChild(btn);
    }
  }

  // Inject PitchCraft Button in Gmail Compose Toolbar
  function injectGmailComposeButton() {
    if (!window.location.href.includes("mail.google.com")) return;

    const composeToolbars = document.querySelectorAll(
      'tr.btC, td.gU.Up, div[aria-label*="Send"]'
    );

    composeToolbars.forEach((toolbar) => {
      if (toolbar.querySelector(".pitchcraft-gmail-btn")) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pitchcraft-gmail-btn";
      btn.title = "Draft or insert pitch with PitchCraft";
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#4F46E5" />
          <path d="M7 16L25 8L17 25L14 19L7 16Z" fill="#FFF"/>
          <path d="M25 4C25 5.5 26.5 7 28 7C26.5 7 25 8.5 25 10C25 8.5 23.5 7 22 7C23.5 7 25 5.5 25 4Z" fill="#FCD34D"/>
        </svg>
        <span>PitchCraft</span>
      `;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chrome.runtime.sendMessage({ action: "OPEN_SIDEPANEL" });
      });

      toolbar.appendChild(btn);
    });
  }

  // Periodic check for dynamic DOM mutations in SPAs like LinkedIn & Gmail
  setInterval(() => {
    if (window.location.href.includes("linkedin.com")) {
      injectLinkedInAction();
    } else if (window.location.href.includes("mail.google.com")) {
      injectGmailComposeButton();
    }
  }, 2000);

  // Message Listener for Popup and Sidepanel requests
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCRAPE_PAGE") {
      const details = scrapePageDetails();
      sendResponse({ data: details });
      return true;
    }

    if (request.action === "INSERT_INTO_GMAIL") {
      const result = insertIntoGmail(request.subject, request.body);
      sendResponse(result);
      return true;
    }
  });
})();

