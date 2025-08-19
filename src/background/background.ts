// Background service worker for Context Bridge
chrome.runtime.onInstalled.addListener(() => {
    console.log('Context Bridge installed');

    // Create context menu
    chrome.contextMenus.create({
        id: 'summarize-selection',
        title: 'Context Bridge → Summarize Selection',
        contexts: ['selection']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'summarize-selection' && tab?.id) {
        // Send message to content script to handle selection
        chrome.tabs.sendMessage(tab.id, {
            action: 'summarize-selection',
            text: info.selectionText
        });
    }
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('Background received message:', message);

    if (message.action === 'get-selection') {
        // Get selection from active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => window.getSelection()?.toString() || ''
                }, (results) => {
                    const selection = results?.[0]?.result || '';
                    sendResponse({ selection });
                });
            }
        });
        return true; // Keep message channel open for async response
    }
});
