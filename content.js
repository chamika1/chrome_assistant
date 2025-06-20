// Content script for Chrome AI Assistant Extension

class AIAssistantUI {
  constructor() {
    this.sidebar = null;
    this.floatingWidget = null;
    this.responsePopup = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    try {
      console.log('AI Assistant: Initializing content script');
      this.createFloatingWidget();
      this.setupEventListeners();
      this.loadSettings();
      console.log('AI Assistant: Content script initialized successfully');
    } catch (error) {
      console.error('AI Assistant: Initialization error:', error);
    }
  }

  createFloatingWidget() {
    try {
      // Check if widget already exists
      if (document.getElementById('ai-assistant-widget')) {
        console.log('AI Assistant: Widget already exists');
        return;
      }

      // Create floating AI assistant widget
      this.floatingWidget = document.createElement('div');
      this.floatingWidget.id = 'ai-assistant-widget';
      this.floatingWidget.innerHTML = `
        <div class="ai-widget-button" title="AI Assistant">
          🤖
        </div>
      `;
      
      // Wait for body to be available
      if (document.body) {
        document.body.appendChild(this.floatingWidget);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(this.floatingWidget);
        });
      }
      
      // Make widget draggable
      this.makeWidgetDraggable();
      
      // Widget click handler
      this.floatingWidget.addEventListener('click', () => {
        this.toggleSidebar();
      });
      
      console.log('AI Assistant: Floating widget created');
    } catch (error) {
      console.error('AI Assistant: Error creating floating widget:', error);
    }
  }

  makeWidgetDraggable() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const widget = this.floatingWidget.querySelector('.ai-widget-button');

    widget.addEventListener('mousedown', (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      
      if (e.target === widget) {
        isDragging = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        xOffset = currentX;
        yOffset = currentY;
        
        this.floatingWidget.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  createSidebar() {
    if (this.sidebar) return;

    this.sidebar = document.createElement('div');
    this.sidebar.id = 'ai-assistant-sidebar';
    this.sidebar.innerHTML = `
      <div class="ai-sidebar-header">
        <h3>🤖 AI Assistant</h3>
        <button class="ai-close-btn" title="Close">×</button>
      </div>
      
      <div class="ai-sidebar-tabs">
        <button class="ai-tab active" data-tab="chat">Chat</button>
        <button class="ai-tab" data-tab="tools">Tools</button>
        <button class="ai-tab" data-tab="settings">Settings</button>
      </div>
      
      <div class="ai-sidebar-content">
        <!-- Chat Tab -->
        <div class="ai-tab-content active" id="chat-tab">
          <div class="ai-chat-container">
            <div class="ai-chat-messages" id="chat-messages"></div>
            <div class="ai-chat-input-container">
              <textarea id="chat-input" placeholder="Ask me anything..."></textarea>
              <button id="send-btn">Send</button>
            </div>
          </div>
        </div>
        
        <!-- Tools Tab -->
        <div class="ai-tab-content" id="tools-tab">
          <div class="ai-tools-grid">
            <button class="ai-tool-btn" data-tool="summarize">📄 Summarize Page</button>
            <button class="ai-tool-btn" data-tool="translate">🌐 Translate</button>
            <button class="ai-tool-btn" data-tool="explain">💡 Explain</button>
            <button class="ai-tool-btn" data-tool="code-review">🔍 Code Review</button>
            <button class="ai-tool-btn" data-tool="generate-code">⚡ Generate Code</button>
            <button class="ai-tool-btn" data-tool="fix-grammar">✏️ Fix Grammar</button>
          </div>
        </div>
        
        <!-- Settings Tab -->
        <div class="ai-tab-content" id="settings-tab">
          <div class="ai-settings">
            <div class="setting-group">
              <label for="api-key-input">Gemini API Key:</label>
              <input type="password" id="api-key-input" placeholder="Enter your Gemini API key">
              <button id="save-api-key">Save</button>
            </div>
            
            <div class="setting-group">
              <label for="language-select">Language:</label>
              <select id="language-select">
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
            
            <div class="setting-group">
              <label for="theme-select">Theme:</label>
              <select id="theme-select">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.sidebar);
    this.setupSidebarEventListeners();
  }

  setupSidebarEventListeners() {
    // Close button
    this.sidebar.querySelector('.ai-close-btn').addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Tab switching
    this.sidebar.querySelectorAll('.ai-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Chat functionality
    const chatInput = this.sidebar.querySelector('#chat-input');
    const sendBtn = this.sidebar.querySelector('#send-btn');
    
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message) {
        this.sendChatMessage(message);
        chatInput.value = '';
      }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Tool buttons
    this.sidebar.querySelectorAll('.ai-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        this.executeTool(tool);
      });
    });

    // Settings
    this.sidebar.querySelector('#save-api-key').addEventListener('click', () => {
      const apiKey = this.sidebar.querySelector('#api-key-input').value;
      this.saveApiKey(apiKey);
    });

    this.sidebar.querySelector('#theme-select').addEventListener('change', (e) => {
      this.changeTheme(e.target.value);
    });
  }

  setupEventListeners() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'showAIResponse':
          this.showResponsePopup(request.response, request.originalText, request.requestType);
          break;
        case 'showError':
          this.showErrorPopup(request.error);
          break;
        case 'toggleSidebar':
          this.toggleSidebar();
          break;
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+A to toggle sidebar
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }

  toggleSidebar() {
    if (!this.sidebar) {
      this.createSidebar();
    }
    
    this.sidebar.classList.toggle('active');
    document.body.classList.toggle('ai-sidebar-open');
  }

  switchTab(tabName) {
    // Update tab buttons
    this.sidebar.querySelectorAll('.ai-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    this.sidebar.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    this.sidebar.querySelectorAll('.ai-tab-content').forEach(content => {
      content.classList.remove('active');
    });
    this.sidebar.querySelector(`#${tabName}-tab`).classList.add('active');
  }

  async sendChatMessage(message) {
    const chatMessages = this.sidebar.querySelector('#chat-messages');
    
    // Add user message
    this.addChatMessage(message, 'user');
    
    // Add loading message
    const loadingId = this.addChatMessage('Thinking...', 'assistant', true);
    
    try {
      const response = await this.callGeminiAPI(message);
      this.updateChatMessage(loadingId, response);
    } catch (error) {
      this.updateChatMessage(loadingId, `Error: ${error}`);
    }
  }

  addChatMessage(message, sender, isLoading = false) {
    const chatMessages = this.sidebar.querySelector('#chat-messages');
    const messageId = 'msg-' + Date.now();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.id = messageId;
    messageDiv.innerHTML = `
      <div class="message-content">${this.formatMessage(message)}</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    if (isLoading) {
      messageDiv.classList.add('loading');
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageId;
  }

  updateChatMessage(messageId, newContent) {
    const messageElement = this.sidebar.querySelector(`#${messageId}`);
    if (messageElement) {
      messageElement.classList.remove('loading');
      messageElement.querySelector('.message-content').innerHTML = this.formatMessage(newContent);
    }
  }

  formatMessage(message) {
    // Basic markdown-like formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  async executeTool(toolName) {
    let prompt = '';
    let context = '';

    switch (toolName) {
      case 'summarize':
        context = this.getPageContent();
        prompt = 'Please provide a comprehensive summary of this webpage, highlighting the main points and key information.';
        break;
      case 'translate':
        const selectedText = window.getSelection().toString();
        if (selectedText) {
          prompt = `Please translate this text to Sinhala and Tamil: "${selectedText}"`;
        } else {
          prompt = 'Please select some text first to translate.';
        }
        break;
      case 'explain':
        const textToExplain = window.getSelection().toString();
        if (textToExplain) {
          prompt = `Please explain this in simple terms: "${textToExplain}"`;
        } else {
          prompt = 'Please select some text first to explain.';
        }
        break;
      case 'code-review':
        const codeToReview = window.getSelection().toString();
        if (codeToReview) {
          prompt = `Please review this code for best practices, potential bugs, and improvements:\n\n${codeToReview}`;
        } else {
          prompt = 'Please select some code first to review.';
        }
        break;
      case 'generate-code':
        prompt = 'What kind of code would you like me to generate? Please describe the functionality you need.';
        break;
      case 'fix-grammar':
        const textToFix = window.getSelection().toString();
        if (textToFix) {
          prompt = `Please fix the grammar and improve the clarity of this text: "${textToFix}"`;
        } else {
          prompt = 'Please select some text first to fix grammar.';
        }
        break;
    }

    // Switch to chat tab and send the tool request
    this.switchTab('chat');
    this.sendChatMessage(prompt);
  }

  getPageContent() {
    return {
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.substring(0, 3000) // Limit content
    };
  }

  async callGeminiAPI(prompt, context = '') {
    return new Promise((resolve, reject) => {
      try {
        if (!chrome.runtime) {
          reject('Extension runtime not available');
          return;
        }

        chrome.runtime.sendMessage({
          action: 'generateContent',
          prompt: prompt,
          context: context
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(`Extension error: ${chrome.runtime.lastError.message}`);
            return;
          }
          
          if (!response) {
            reject('No response from background script');
            return;
          }
          
          if (response.success) {
            resolve(response.response);
          } else {
            reject(response.error || 'Unknown API error');
          }
        });
      } catch (error) {
        reject(`Extension communication error: ${error.message}`);
      }
    });
  }

  showResponsePopup(response, originalText, requestType) {
    // Remove existing popup
    if (this.responsePopup) {
      this.responsePopup.remove();
    }

    this.responsePopup = document.createElement('div');
    this.responsePopup.className = 'ai-response-popup';
    this.responsePopup.innerHTML = `
      <div class="popup-header">
        <h4>AI Response</h4>
        <button class="popup-close">×</button>
      </div>
      <div class="popup-content">
        <div class="original-text">
          <strong>Original:</strong> ${originalText.substring(0, 100)}${originalText.length > 100 ? '...' : ''}
        </div>
        <div class="ai-response">
          ${this.formatMessage(response)}
        </div>
      </div>
      <div class="popup-actions">
        <button class="copy-btn">Copy</button>
        <button class="close-btn">Close</button>
      </div>
    `;

    document.body.appendChild(this.responsePopup);

    // Event listeners
    this.responsePopup.querySelector('.popup-close').addEventListener('click', () => {
      this.responsePopup.remove();
    });

    this.responsePopup.querySelector('.close-btn').addEventListener('click', () => {
      this.responsePopup.remove();
    });

    this.responsePopup.querySelector('.copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(response);
      this.showNotification('Response copied to clipboard!');
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      if (this.responsePopup) {
        this.responsePopup.remove();
      }
    }, 10000);
  }

  showErrorPopup(error) {
    this.showNotification(`Error: ${error}`, 'error');
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `ai-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async saveApiKey(apiKey) {
    chrome.runtime.sendMessage({
      action: 'saveApiKey',
      apiKey: apiKey
    }, (response) => {
      if (response.success) {
        this.showNotification('API key saved successfully!');
      } else {
        this.showNotification('Failed to save API key', 'error');
      }
    });
  }

  async loadSettings() {
    chrome.runtime.sendMessage({ action: 'getApiKey' }, (response) => {
      if (response.apiKey && this.sidebar) {
        this.sidebar.querySelector('#api-key-input').value = response.apiKey;
      }
    });
  }

  changeTheme(theme) {
    document.body.setAttribute('data-ai-theme', theme);
    chrome.storage.sync.set({ aiTheme: theme });
  }
}

// Initialize the AI Assistant UI
const aiAssistant = new AIAssistantUI();