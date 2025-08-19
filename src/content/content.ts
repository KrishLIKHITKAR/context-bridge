// Content script for Context Bridge
console.log('Context Bridge content script loaded');

// Handle messages from background/popup
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    console.log('Content script received message:', message);

    if (message.action === 'summarize-selection') {
        // Handle context menu selection
        handleSelection(message.text);
    }
});

// Handle selection from context menu
function handleSelection(text: string) {
    if (text) {
        // Create a temporary notification
        showNotification(`Selection captured: ${text.length} characters`);

        // Send to popup for processing
        chrome.runtime.sendMessage({
            action: 'process-selection',
            text: text
        });
    }
}

// Show temporary notification
function showNotification(message: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Insert overlay when needed (will be called from popup)
function insertOverlay() {
    // Remove existing overlay if any
    const existing = document.getElementById('context-bridge-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'context-bridge-overlay';
    overlay.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 16px;
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
  `;

    overlay.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">Context Bridge</div>
    <button id="paste-capsule" style="
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    ">Paste Capsule</button>
    <button id="dismiss-overlay" style="
      background: #6b7280;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    ">Dismiss</button>
  `;

    document.body.appendChild(overlay);

    // Handle paste capsule
    document.getElementById('paste-capsule')?.addEventListener('click', () => {
        pasteCapsule();
    });

    // Handle dismiss
    document.getElementById('dismiss-overlay')?.addEventListener('click', () => {
        overlay.remove();
    });
}

// Paste capsule into input field
function pasteCapsule() {
    // Try to find input field based on current site
    const hostname = window.location.hostname;
    let inputSelector = '';

    if (hostname.includes('openai.com')) {
        inputSelector = 'textarea[placeholder*="Message"], textarea[data-id="root"]';
    } else if (hostname.includes('claude.ai')) {
        inputSelector = 'textarea[placeholder*="Message"], textarea[data-testid="composer"]';
    } else if (hostname.includes('gemini.google.com')) {
        inputSelector = 'textarea[placeholder*="Message"], textarea[aria-label*="input"]';
    }

    const input = document.querySelector(inputSelector) as HTMLTextAreaElement;
    if (input) {
        // Get capsule from clipboard (this will be set by popup)
        navigator.clipboard.readText().then(text => {
            if (text) {
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                showNotification('Capsule pasted! Press Enter to send.');
            }
        }).catch(() => {
            showNotification('Please copy the capsule first, then click Paste Capsule');
        });
    } else {
        showNotification('Could not find input field. Please paste manually.');
    }
}

// Expose functions to popup
(window as any).contextBridge = {
    insertOverlay,
    pasteCapsule
};
