// Popup script for Chrome AI Assistant Extension

class PopupController {
  constructor() {
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.checkApiStatus();
  }

  setupEventListeners() {
    // Quick action buttons
    document.getElementById('summarize-page').addEventListener('click', () => {
      this.executeAction('summarize');
    });

    document.getElementById('translate-text').addEventListener('click', () => {
      this.executeAction('translate');
    });

    document.getElementById('explain-content').addEventListener('click', () => {
      this.executeAction('explain');
    });

    document.getElementById('code-help').addEventListener('click', () => {
      this.executeAction('code-help');
    });

    // Main action buttons
    document.getElementById('open-sidebar').addEventListener('click', () => {
      this.openSidebar();
    });

    document.getElementById('analyze-page').addEventListener('click', () => {
      this.analyzePage();
    });

    // Settings link
    document.getElementById('configure-api').addEventListener('click', () => {
      this.openApiSettings();
    });
  }

  async executeAction(action) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      let message = {};
      
      switch (action) {
        case 'summarize':
          message = {
            action: 'executeTool',
            tool: 'summarize'
          };
          break;
        case 'translate':
          message = {
            action: 'executeTool',
            tool: 'translate'
          };
          break;
        case 'explain':
          message = {
            action: 'executeTool',
            tool: 'explain'
          };
          break;
        case 'code-help':
          message = {
            action: 'executeTool',
            tool: 'code-review'
          };
          break;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, message);
      
      // Close popup and open sidebar
      window.close();
      chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
      
    } catch (error) {
      console.error('Error executing action:', error);
      this.showError('Failed to execute action. Please try again.');
    }
  }

  async openSidebar() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
      window.close();
    } catch (error) {
      console.error('Error opening sidebar:', error);
    }
  }

  async analyzePage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute page analysis
      chrome.tabs.sendMessage(tab.id, {
        action: 'executeTool',
        tool: 'summarize'
      });
      
      // Close popup and open sidebar
      window.close();
      chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
      
    } catch (error) {
      console.error('Error analyzing page:', error);
      this.showError('Failed to analyze page. Please try again.');
    }
  }

  async openApiSettings() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Open sidebar and switch to settings tab
      chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
      
      // Wait a bit for sidebar to open, then switch to settings
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'switchTab', 
          tab: 'settings' 
        });
      }, 300);
      
      window.close();
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }

  async checkApiStatus() {
    try {
      let response;
      try {
        response = await chrome.runtime.sendMessage({ action: 'getApiKey' });
      } catch (e) {
        console.error("Failed to get API key:", e);
        statusIndicator.className = 'status-indicator status-disconnected';
        statusText.textContent = 'API Key Required';
        this.disableActions();
        return;
      }
      const statusIndicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      
      if (response.apiKey && response.apiKey.trim() !== '') {
        statusIndicator.className = 'status-indicator status-connected';
        statusText.textContent = 'API Connected';
        this.enableActions();
      } else {
        statusIndicator.className = 'status-indicator status-disconnected';
        statusText.textContent = 'API Key Required';
        this.disableActions();
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      const statusIndicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      statusIndicator.className = 'status-indicator status-disconnected';
      statusText.textContent = 'Connection Error';
      this.disableActions();
    }
  }

  enableActions() {
    const actionButtons = document.querySelectorAll('.action-btn, .main-btn');
    actionButtons.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    });
  }

  disableActions() {
    const actionButtons = document.querySelectorAll('.action-btn, .main-btn');
    actionButtons.forEach(btn => {
      if (btn.id !== 'open-sidebar') { // Keep sidebar button enabled
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      }
    });
  }

  showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: #dc3545;
      color: white;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1000;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  showSuccess(message) {
    // Create a simple success notification
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: #28a745;
      color: white;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1000;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup script loaded');
  new PopupController();
});

// Handle keyboard shortcuts in popup
document.addEventListener('keydown', (e) => {
  // Escape key to close popup
  if (e.key === 'Escape') {
    window.close();
  }
  
  // Number keys for quick actions
  if (e.key >= '1' && e.key <= '4') {
    const actionButtons = document.querySelectorAll('.action-btn');
    const index = parseInt(e.key) - 1;
    if (actionButtons[index] && !actionButtons[index].disabled) {
      actionButtons[index].click();
    }
  }
  
  // Enter key to open sidebar
  if (e.key === 'Enter') {
    document.getElementById('open-sidebar').click();
  }
});
