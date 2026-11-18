chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "UPDATE_BADGE" && sender.tab?.id) {
    const count = message.count;
    chrome.action.setBadgeText({
      text: count > 0 ? String(count) : "",
      tabId: sender.tab.id,
    });
    chrome.action.setBadgeBackgroundColor({ color: "#1d9bf0" });
  }
});
const X_URL_PATTERNS = ['https://x.com/*', 'https://twitter.com/*'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    // 1. Right-click anywhere on an X page/post
    chrome.contextMenus.create({
      id: 'copy-page-urls',
      title: 'Copy all clean URLs from this X page',
      contexts: ['page'],
      documentUrlPatterns: X_URL_PATTERNS,
    });

    // 2. Right-click only when text is selected on X
    chrome.contextMenus.create({
      id: 'copy-selection-urls',
      title: 'Copy clean URLs from selection',
      contexts: ['selection'],
      documentUrlPatterns: X_URL_PATTERNS,
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'copy-page-urls') {
    chrome.tabs.sendMessage(tab.id, { action: 'COPY_PAGE_URLS' });
  } else if (info.menuItemId === 'copy-selection-urls') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'COPY_SELECTION_URLS',
      selectionText: info.selectionText || '',
    });
  }
});