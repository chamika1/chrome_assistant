# Chrome AI Assistant Extension - Troubleshooting Guide

## Service Worker Registration Failed (Status Code 15)

### Problem
The error "Service worker registration failed. Status code: 15" and "Uncaught ReferenceError: process is not defined" occurs because the extension was trying to use Node.js environment variables (`process.env`) which are not available in Chrome extension service workers.

### Solution Applied
✅ **Fixed**: Removed all `process.env.API_KEY` references from the codebase and replaced them with proper Chrome extension storage API usage.

### Changes Made

1. **background.js**:
   - Removed `process.env.API_KEY` references
   - Updated API key initialization to use Chrome storage API only
   - Set default API key to `null` instead of undefined environment variable

2. **test-api.html**:
   - Removed `process.env.API_KEY` reference
   - Added proper API key configuration interface
   - Added localStorage-based API key storage for testing

### How to Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the extension folder: `chrome_ai_assistant_extention`
5. The extension should load without service worker errors

### Testing the Extension

1. **Basic Load Test**: Open `extension-test.html` in Chrome to verify the extension loads properly
2. **API Test**: Open `test-api.html` to test the Gemini API integration
3. **Context Menu Test**: Right-click on any webpage to see the AI Assistant context menu

### API Key Configuration

The extension requires a Gemini API key to function. You can configure it in two ways:

1. **Through the extension popup**: Click the extension icon and configure the API key
2. **Through the test page**: Use `test-api.html` to set and test your API key

### Common Issues and Solutions

#### Issue: Extension icon not showing
- **Solution**: Check if all icon files exist in the `icons/` folder
- **Files needed**: icon16.png, icon32.png, icon48.png, icon128.png

#### Issue: Context menu not appearing
- **Solution**: Ensure the extension has proper permissions in manifest.json
- **Required permissions**: "contextMenus", "activeTab", "scripting"

#### Issue: API calls failing
- **Solution**: 
  1. Verify your Gemini API key is valid
  2. Check network connectivity
  3. Ensure the API key has proper permissions for the Gemini API

### Manifest.json Validation

The manifest.json file has been validated and includes:
- ✅ Proper manifest version 3 format
- ✅ All required permissions
- ✅ Correct service worker configuration
- ✅ Valid content script configuration
- ✅ Proper icon references

### Next Steps

1. Load the extension using the instructions above
2. Test basic functionality with `extension-test.html`
3. Configure your API key and test API functionality
4. Use the extension on any webpage by right-clicking for context menu options

The service worker registration error should now be resolved, and the extension should load and function properly in Chrome.