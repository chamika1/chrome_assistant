// Background service worker for Chrome AI Assistant Extension

// Default API Key
const DEFAULT_API_KEY = 'your-key';

class GeminiAPI {
  constructor() {
    this.apiKey = DEFAULT_API_KEY; // Use default API key
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  async initialize() {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    // Use stored API key if available, otherwise use default
    this.apiKey = result.geminiApiKey || DEFAULT_API_KEY;
    console.log('API initialized with key:', this.apiKey ? 'Key available' : 'No key');
  }

  async generateContent(prompt, context = '') {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const fullPrompt = context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt;

    try {
      console.log('Making API request to:', this.baseURL);
      
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response format');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Gemini API. Check your internet connection.');
      }
      throw error;
    }
  }
}

const geminiAPI = new GeminiAPI();

// Initialize when extension starts
chrome.runtime.onStartup.addListener(() => {
  geminiAPI.initialize();
});

chrome.runtime.onInstalled.addListener(() => {
  geminiAPI.initialize();
  createContextMenus();
});

// Create context menus
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    // Main AI Assistant menu
    chrome.contextMenus.create({
      id: 'ai-assistant',
      title: '🤖 AI Assistant',
      contexts: ['selection', 'page']
    });

    // Sub-menus for AI Assistant
    chrome.contextMenus.create({
      id: 'explain-text',
      parentId: 'ai-assistant',
      title: 'Explain Selected Text',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'summarize-text',
      parentId: 'ai-assistant',
      title: 'Summarize',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'translate-text',
      parentId: 'ai-assistant',
      title: 'Translate',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'improve-text',
      parentId: 'ai-assistant',
      title: 'Improve Writing',
      contexts: ['selection']
    });

    // Coding Assistant menu
    chrome.contextMenus.create({
      id: 'coding-assistant',
      title: '💻 Coding Assistant',
      contexts: ['selection', 'page']
    });

    chrome.contextMenus.create({
      id: 'explain-code',
      parentId: 'coding-assistant',
      title: 'Explain Code',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'find-bugs',
      parentId: 'coding-assistant',
      title: 'Find Bugs',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'optimize-code',
      parentId: 'coding-assistant',
      title: 'Optimize Code',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'generate-tests',
      parentId: 'coding-assistant',
      title: 'Generate Tests',
      contexts: ['selection']
    });

    // Page Analysis
    chrome.contextMenus.create({
      id: 'analyze-page',
      title: '📄 Analyze Page',
      contexts: ['page']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText || '';
  
  try {
    let prompt = '';
    let response = '';

    switch (info.menuItemId) {
      case 'explain-text':
        prompt = `Please explain this text in simple terms: "${selectedText}"`;
        break;
      
      case 'summarize-text':
        prompt = `Please provide a concise summary of: "${selectedText}"`;
        break;
      
      case 'translate-text':
        prompt = `Please translate this text to English and Sinhala: "${selectedText}"`;
        break;
      
      case 'improve-text':
        prompt = `Please improve the grammar and clarity of this text: "${selectedText}"`;
        break;
      
      case 'explain-code':
        prompt = `Please explain this code step by step:\n\n${selectedText}`;
        break;
      
      case 'find-bugs':
        prompt = `Please analyze this code for potential bugs and issues:\n\n${selectedText}`;
        break;
      
      case 'optimize-code':
        prompt = `Please suggest optimizations for this code:\n\n${selectedText}`;
        break;
      
      case 'generate-tests':
        prompt = `Please generate unit tests for this code:\n\n${selectedText}`;
        break;
      
      case 'analyze-page':
        // Get page content
        const [pageResult] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return {
              title: document.title,
              url: window.location.href,
              content: document.body.innerText.substring(0, 2000) // Limit content
            };
          }
        });
        
        prompt = `Please analyze this webpage and provide key insights:\n\nTitle: ${pageResult.result.title}\nURL: ${pageResult.result.url}\n\nContent: ${pageResult.result.content}`;
        break;
    }

    if (prompt) {
      response = await geminiAPI.generateContent(prompt);
      
      // Send response to content script to display
      chrome.tabs.sendMessage(tab.id, {
        action: 'showAIResponse',
        response: response,
        originalText: selectedText,
        requestType: info.menuItemId
      });
    }
  } catch (error) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showError',
      error: error.message
    });
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === 'ping') {
    sendResponse({ success: true, message: 'Background script is running' });
    return true;
  }
  
  if (request.action === 'generateContent') {
    geminiAPI.generateContent(request.prompt, request.context)
      .then(response => sendResponse({ success: true, response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'saveApiKey') {
    console.log('Saving API key:', request.apiKey ? 'Key provided' : 'No key');
    chrome.storage.sync.set({ geminiApiKey: request.apiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving API key:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('API key saved successfully');
        geminiAPI.apiKey = request.apiKey || DEFAULT_API_KEY;
        sendResponse({ success: true });
      }
    });
    return true;
  }
  
  if (request.action === 'getApiKey') {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting API key:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        const apiKey = result.geminiApiKey || DEFAULT_API_KEY;
        console.log('API key retrieved:', apiKey ? 'Key found' : 'No key');
        sendResponse({ apiKey: apiKey });
      }
    });
    return true;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
});
