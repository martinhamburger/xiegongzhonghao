// Content script for extracting content from web pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContent') {
        const content = extractArticleContent();
        sendResponse({content: content});
    } else if (request.action === 'getSelection') {
        const selection = window.getSelection().toString();
        sendResponse({selection: selection});
    }
    return true;
});

// Extract main article content from the page
function extractArticleContent() {
    // Try to find main content area
    const selectors = [
        'article',
        '[role="main"]',
        '.article-content',
        '.post-content',
        '.entry-content',
        '#content',
        'main'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return cleanText(element.innerText);
        }
    }
    
    // Fallback: get body text
    return cleanText(document.body.innerText);
}

// Clean extracted text
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/\n\s*\n/g, '\n\n')  // Clean up multiple newlines
        .trim()
        .substring(0, 5000);  // Limit to 5000 chars
}

// Add visual indicator when extension is active
function addIndicator() {
    if (document.getElementById('writing-assistant-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'writing-assistant-indicator';
    indicator.innerHTML = '📝';
    indicator.title = '公众号写作助手已激活';
    document.body.appendChild(indicator);
}

// Initialize
addIndicator();
