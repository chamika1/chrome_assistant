// Configuration file for Chrome AI Assistant Extension
// This file contains default settings and API configuration

const CONFIG = {
  // Default Gemini API Key
  DEFAULT_API_KEY: 'AIzaSyCTSoutDAGHhBzljAHF5PJ-uwYNIowRJdc',
  
  // API Configuration
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  
  // Extension Settings
  EXTENSION_NAME: 'Chrome AI Assistant & Coding Extension',
  VERSION: '1.0.0',
  
  // Default Prompts
  DEFAULT_PROMPTS: {
    EXPLAIN: 'Please explain this text in simple terms:',
    SUMMARIZE: 'Please provide a concise summary of:',
    TRANSLATE: 'Please translate this text to English and Sinhala:',
    IMPROVE: 'Please improve the grammar and clarity of this text:',
    CODE_EXPLAIN: 'Please explain this code step by step:',
    FIND_BUGS: 'Please analyze this code for potential bugs and issues:',
    OPTIMIZE: 'Please suggest optimizations for this code:',
    GENERATE_TESTS: 'Please generate unit tests for this code:'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}