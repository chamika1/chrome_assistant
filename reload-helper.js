// Reload Helper for Chrome AI Assistant Extension
// This script helps handle extension context invalidation

class ExtensionReloadHelper {
  constructor() {
    this.checkInterval = null;
    this.isExtensionValid = true;
    this.init();
  }

  init() {
    // Check extension context every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkExtensionContext();
    }, 30000);

    // Listen for extension updates
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onConnect.addListener(() => {
        this.isExtensionValid = true;
      });
    }
  }

  checkExtensionContext() {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
      if (this.isExtensionValid) {
        this.isExtensionValid = false;
        this.showReloadNotification();
      }
    } else {
      this.isExtensionValid = true;
    }
  }

  showReloadNotification() {
    // Create reload notification
    const notification = document.createElement('div');
    notification.id = 'extension-reload-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
        z-index: 10003;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        border: 2px solid rgba(255, 255, 255, 0.2);
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">⚠️</span>
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">Extension Needs Reload</div>
            <div style="font-size: 12px; opacity: 0.9;">The AI Assistant extension context was invalidated. Please reload the page to continue using the extension.</div>
          </div>
        </div>
        <button onclick="window.location.reload()" style="
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 12px;
          width: 100%;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
          🔄 Reload Page
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background='none'">
          ×
        </button>
      </div>
    `;

    // Remove existing notification if any
    const existing = document.getElementById('extension-reload-notification');
    if (existing) {
      existing.remove();
    }

    document.body.appendChild(notification);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 30000);
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Initialize reload helper
const reloadHelper = new ExtensionReloadHelper();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.ExtensionReloadHelper = ExtensionReloadHelper;
}