# Chrome AI Assistant & Coding Extension

A powerful Chrome extension that integrates Google's Gemini AI to provide intelligent assistance for browsing, coding, and productivity tasks.

## 🚀 Features

### 🤖 AI Assistant Features
- **Smart Context Menu**: Right-click on selected text to get AI assistance
- **Quick Summarize**: Summarize web pages, articles, and documents
- **Language Translation**: Translate text to 50+ languages including Sinhala and Tamil
- **Text Enhancement**: Grammar checking, tone adjustment, and professional rewriting
- **Email Assistant**: Generate email drafts and suggest replies
- **Research Helper**: Explain complex topics and fact-checking
- **Creative Writing**: Generate stories, poems, and creative content

### 💻 Coding Assistant Features
- **Code Explanation**: Line-by-line code explanations
- **Bug Detection**: Identify syntax errors and logical issues
- **Code Optimization**: Performance improvement suggestions
- **Code Completion**: Smart autocomplete suggestions
- **Refactoring Helper**: Code structure improvements
- **Multi-Language Support**: JavaScript, Python, Java, C++, PHP, Go, Rust, HTML, CSS, React, Vue, Angular, Node.js
- **Testing Assistant**: Generate unit tests and integration tests
- **Code Review**: Best practices analysis

### 🎯 Advanced Features
- **Custom Prompts**: Save frequently used prompts
- **Template Library**: Email templates, code snippets, documents
- **Voice Input**: Microphone support for commands
- **Keyboard Shortcuts**: Quick access hotkeys
- **Dark/Light Theme**: Customizable interface
- **Offline Mode**: Basic features without internet

## 📦 Installation

### Prerequisites
1. Google Chrome browser
2. ✅ Gemini API key is PRE-CONFIGURED

### Steps
1. **Download the Extension**
   - Clone or download this repository
   - Extract to a folder on your computer

2. **API Configuration**
   - ✅ Gemini 2.0 Flash API key is already configured
   - ✅ Model: `gemini-2.0-flash-exp`
   - You can change the API key in settings if needed

3. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder
   - The extension should now appear in your extensions list

4. **Ready to Use**
   - Extension works immediately after installation
   - Test using the provided test pages
   - Use `test-api.html` to verify API connection

## 🎮 Usage

### Quick Access
- **Extension Icon**: Click the 🤖 icon in the toolbar for quick actions
- **Floating Widget**: Use the draggable widget on web pages
- **Context Menu**: Right-click on selected text for AI options
- **Keyboard Shortcut**: Press `Ctrl+Shift+A` to toggle the sidebar

### Main Interface
The extension provides three main tabs:

1. **Chat Tab**: Direct conversation with AI
2. **Tools Tab**: Quick access to common functions
3. **Settings Tab**: Configuration and preferences

### Context Menu Options
Right-click on selected text to access:
- Explain Selected Text
- Summarize
- Translate
- Improve Writing
- Explain Code
- Find Bugs
- Optimize Code
- Generate Tests

## 🛠️ Development

### File Structure
```
chrome-ai-assistant/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script
├── popup.html            # Extension popup
├── popup.js              # Popup functionality
├── styles.css            # Extension styles
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Key Components

#### Background Script (`background.js`)
- Handles Gemini API communication
- Manages context menus
- Processes extension messages

#### Content Script (`content.js`)
- Manages UI elements on web pages
- Handles user interactions
- Communicates with background script

#### Popup (`popup.html` + `popup.js`)
- Extension toolbar popup interface
- Quick action buttons
- API status display

### API Integration
The extension uses Google's Gemini 2.0 Flash model via the REST API:
- Model: `gemini-2.0-flash-exp` (latest experimental version)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`
- Authentication: API key in query parameter
- Request format: JSON with content parts
- Pre-configured API Key: `AIzaSyCTSoutDAGHhBzljAHF5PJ-uwYNIowRJdc`

## 🔧 Configuration

### API Settings
- **API Key**: Required for all AI features
- **Model**: Currently uses Gemini Pro
- **Response Length**: Configurable (short, medium, detailed)

### UI Settings
- **Theme**: Light or Dark mode
- **Language**: English, Sinhala, Tamil support
- **Shortcuts**: Customizable keyboard shortcuts

### Privacy Settings
- **Local Processing**: Sensitive data processed locally when possible
- **Data Storage**: Encrypted storage for user preferences
- **No Logging**: Personal information not tracked

## 🔒 Security & Privacy

- **Encrypted Storage**: User data encrypted locally
- **Secure API Calls**: All communications SSL encrypted
- **No Data Logging**: Personal information not stored or tracked
- **Permission Management**: Granular website access control
- **Optional Analytics**: Usage statistics are optional

## 🚨 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct
   - Check if the API key has proper permissions
   - Ensure you have API quota remaining

2. **Extension Not Loading**
   - Check if Developer mode is enabled
   - Verify all files are present
   - Check browser console for errors

3. **Context Menu Not Appearing**
   - Refresh the page after installing
   - Check if the extension has proper permissions
   - Try selecting text before right-clicking

4. **Sidebar Not Opening**
   - Try the keyboard shortcut `Ctrl+Shift+A`
   - Check if the extension is enabled
   - Refresh the page and try again

### Error Messages
- **"Gemini API key not configured"**: Add your API key in settings
- **"API request failed"**: Check internet connection and API key
- **"Permission denied"**: Grant necessary permissions to the extension

## 📝 Changelog

### Version 1.0.0
- Initial release
- Basic AI assistant functionality
- Coding assistance features
- Context menu integration
- Sidebar interface
- Gemini API integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Chrome Extensions API documentation
- Material Design guidelines
- Open source community for inspiration

## 📞 Support

For support, feature requests, or bug reports:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Note**: This extension requires a valid Gemini API key to function. The API key is stored locally and never shared with third parties.