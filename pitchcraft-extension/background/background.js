// PitchCraft Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu for highlighted text
  chrome.contextMenus.create({
    id: "pitchcraft-draft-selection",
    title: "Draft Pitch with PitchCraft",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "pitchcraft-open-sidepanel",
    title: "Open PitchCraft Side Panel",
    contexts: ["page"]
  });

  console.log("PitchCraft Extension installed successfully.");
});

// Context Menu Click Handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "pitchcraft-draft-selection" && info.selectionText) {
    await chrome.storage.local.set({
      quickContextText: info.selectionText,
      quickContextUrl: tab ? tab.url : ""
    });

    // If Side Panel API is available, open it for this tab
    if (chrome.sidePanel && tab && tab.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  } else if (info.menuItemId === "pitchcraft-open-sidepanel") {
    if (chrome.sidePanel && tab && tab.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

// Message listener for communication between Content Scripts and Extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_ACTIVE_TAB_INFO") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        sendResponse({ tab: tabs[0] });
      } else {
        sendResponse({ tab: null });
      }
    });
    return true; // async response
  }

  if (request.action === "OPEN_SIDEPANEL" && sender.tab) {
    if (chrome.sidePanel && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id });
      sendResponse({ success: true });
    }
    return true;
  }
});

