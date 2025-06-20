# API Key Setup කරන්නේ කොහොමද - Chrome AI Assistant Extension

## ගැටලුව
API key එක save කරන්න බැහැ නම්, මේ steps follow කරන්න:

## 1. Extension Load කරන්න
1. Chrome browser එකේ `chrome://extensions/` යන්න
2. "Developer mode" enable කරන්න (top right corner එකේ toggle එක)
3. "Load unpacked" click කරන්න
4. Extension folder එක select කරන්න: `chrome_ai_assistant_extention`

## 2. API Key Test කරන්න
1. Extension folder එකේ `api-key-test.html` file එක open කරන්න
2. "Check Extension Status" button එක click කරන්න
3. Extension properly load වෙලා තියෙනවද බලන්න

## 3. API Key Save කරන්න - Method 1 (Test Page)
1. `api-key-test.html` page එකේ API key input කරන්න
2. "Save API Key" button එක click කරන්න
3. Success message එකක් පෙන්වන්න ඕනේ

## 4. API Key Save කරන්න - Method 2 (Extension Sidebar)
1. කොයි webpage එකක හරි right-click කරන්න
2. Extension icon එක click කරන්න හෝ Ctrl+Shift+A press කරන්න
3. Sidebar එක open වෙනකොට "Settings" tab එකට යන්න
4. API key input කරලා "Save" button එක click කරන්න

## 5. API Key Test කරන්න
1. `api-key-test.html` page එකේ "Test API Key" button එක click කරන්න
2. API working නම් response එකක් පෙන්වන්න ඕනේ

## Common Issues & Solutions

### Issue: Extension load වෙන්නේ නැහැ
**Solution:** 
- Chrome version එක update කරන්න
- All files properly folder එකේ තියෙනවද check කරන්න
- Console errors check කරන්න (F12 press කරලා)

### Issue: API key save වෙන්නේ නැහැ
**Solution:**
1. `api-key-test.html` open කරලා "Check Storage Permissions" click කරන්න
2. Extension permissions properly set වෙලා තියෙනවද check කරන්න
3. Browser console එකේ errors check කරන්න

### Issue: API calls fail වෙනවා
**Solution:**
1. API key එක valid ද check කරන්න
2. Internet connection check කරන්න
3. Gemini API quota exceed වෙලා නැද්ද check කරන්න

## Gemini API Key ගන්නේ කොහොමද
1. https://makersuite.google.com/app/apikey යන්න
2. Google account එකෙන් login වෙන්න
3. "Create API Key" click කරන්න
4. API key එක copy කරන්න

## Files for Testing
- `api-key-test.html` - API key save/load test කරන්න
- `extension-test.html` - Extension basic functionality test කරන්න
- `test-api.html` - Full API integration test කරන්න

## Debug කරන්න
Browser console එකේ (F12) මේ messages බලන්න:
- "Background script received message" - Background script working
- "API key saved successfully" - Save operation working
- "API key retrieved" - Load operation working

## Help
ගැටලු තියෙනවා නම්:
1. Browser console එකේ error messages check කරන්න
2. Extension reload කරන්න
3. Browser restart කරන්න
4. `TROUBLESHOOTING.md` file එක read කරන්න