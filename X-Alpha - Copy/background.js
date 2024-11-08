chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ insightsPanelOpen: false });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isRelevantSite = tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com") || tab.url.includes("dexscreener.com"));
  
  if (isRelevantSite) {
    chrome.action.setIcon({path: "icon.png", tabId: tabId});
    chrome.action.enable(tabId);
  } else {
    chrome.action.setIcon({path: "icon-inactive.png", tabId: tabId});
    chrome.action.enable(tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const isRelevantSite = tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com") || tab.url.includes("dexscreener.com"));
    
    if (isRelevantSite) {
      chrome.action.setIcon({path: "icon.png", tabId: tab.id});
    } else {
      chrome.action.setIcon({path: "icon-inactive.png", tabId: tab.id});
    }
  });
});