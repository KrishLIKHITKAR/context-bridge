(function(){console.log("Context Bridge content script loaded");chrome.runtime.onMessage.addListener((e,t,o)=>{console.log("Content script received message:",e),e.action==="summarize-selection"&&a(e.text)});function a(e){e&&(i(`Selection captured: ${e.length} characters`),chrome.runtime.sendMessage({action:"process-selection",text:e}))}function i(e){const t=document.createElement("div");t.style.cssText=`
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
  `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}function d(){var o,n;const e=document.getElementById("context-bridge-overlay");e&&e.remove();const t=document.createElement("div");t.id="context-bridge-overlay",t.style.cssText=`
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
  `,t.innerHTML=`
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
  `,document.body.appendChild(t),(o=document.getElementById("paste-capsule"))==null||o.addEventListener("click",()=>{s()}),(n=document.getElementById("dismiss-overlay"))==null||n.addEventListener("click",()=>{t.remove()})}function s(){const e=window.location.hostname;let t="";e.includes("openai.com")?t='textarea[placeholder*="Message"], textarea[data-id="root"]':e.includes("claude.ai")?t='textarea[placeholder*="Message"], textarea[data-testid="composer"]':e.includes("gemini.google.com")&&(t='textarea[placeholder*="Message"], textarea[aria-label*="input"]');const o=document.querySelector(t);o?navigator.clipboard.readText().then(n=>{n&&(o.value=n,o.dispatchEvent(new Event("input",{bubbles:!0})),i("Capsule pasted! Press Enter to send."))}).catch(()=>{i("Please copy the capsule first, then click Paste Capsule")}):i("Could not find input field. Please paste manually.")}window.contextBridge={insertOverlay:d,pasteCapsule:s};
})()
