chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "Reload") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    });
  }
});
