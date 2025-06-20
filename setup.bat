@echo off
echo ========================================
echo Chrome AI Assistant Extension Setup
echo ========================================
echo.

echo 1. Opening Chrome Extensions page...
start chrome://extensions/
timeout /t 3 /nobreak >nul

echo.
echo 2. Opening test pages...
start test.html
start test-api.html
start debug.html
timeout /t 2 /nobreak >nul

echo.
echo 3. Opening Google AI Studio for API key...
start https://makersuite.google.com/app/apikey
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo SETUP INSTRUCTIONS:
echo ========================================
echo.
echo 1. In the Chrome Extensions page:
echo    - Enable "Developer mode" (top right toggle)
echo    - Click "Load unpacked"
echo    - Select this folder: %~dp0
echo.
echo 2. API Key Status:
echo    - Gemini 2.0 Flash API key is PRE-CONFIGURED
echo    - Model: gemini-2.0-flash-exp
echo    - You can change it in extension settings if needed
echo.
echo 3. Test the API:
echo    - Use the API test page to verify connection
echo    - Extension should work immediately after loading
echo.
echo 4. Test the extension:
echo    - Use the test page that opened
echo    - Try right-clicking on selected text
echo    - Test keyboard shortcut: Ctrl+Shift+A
echo.
echo ========================================
echo Extension files in: %~dp0
echo ========================================
echo.
pause