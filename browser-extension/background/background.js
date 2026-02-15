// Background service worker

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('公众号写作助手已安装');
    
    // Initialize storage with default values
    chrome.storage.local.set({
        currentArticle: null,
        articles: [],
        settings: {
            autoSave: true,
            checkAIStyle: true,
            theme: 'light'
        }
    });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-assistant') {
        chrome.action.openPopup();
    }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveArticle') {
        saveArticle(request.article).then(result => {
            sendResponse({success: true, result: result});
        });
        return true;
    } else if (request.action === 'loadArticles') {
        loadArticles().then(articles => {
            sendResponse({articles: articles});
        });
        return true;
    }
});

// Auto-save functionality
let autoSaveTimer = null;

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.currentArticle) {
        // Clear existing timer
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        
        // Set new timer for auto-save
        autoSaveTimer = setTimeout(() => {
            chrome.storage.local.get(['settings', 'currentArticle'], (result) => {
                if (result.settings?.autoSave && result.currentArticle) {
                    saveArticleToHistory(result.currentArticle);
                }
            });
        }, 30000); // Auto-save after 30 seconds of inactivity
    }
});

// Save article to history
function saveArticle(article) {
    return new Promise((resolve) => {
        chrome.storage.local.get(['articles'], (result) => {
            const articles = result.articles || [];
            article.id = Date.now();
            article.lastUpdate = new Date().toISOString();
            articles.push(article);
            
            chrome.storage.local.set({articles: articles}, () => {
                resolve(article);
            });
        });
    });
}

// Load all articles
function loadArticles() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['articles'], (result) => {
            resolve(result.articles || []);
        });
    });
}

// Save current article to history (auto-save)
function saveArticleToHistory(article) {
    chrome.storage.local.get(['articles'], (result) => {
        const articles = result.articles || [];
        const existingIndex = articles.findIndex(a => a.id === article.id);
        
        if (existingIndex >= 0) {
            articles[existingIndex] = article;
        } else {
            article.id = Date.now();
            articles.push(article);
        }
        
        article.lastUpdate = new Date().toISOString();
        chrome.storage.local.set({articles: articles});
    });
}

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'import-selection',
        title: '导入选中内容到写作助手',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'import-selection') {
        chrome.storage.local.get(['currentArticle'], (result) => {
            const article = result.currentArticle || {content: '', title: '新文章'};
            article.content += '\n\n' + info.selectionText;
            
            chrome.storage.local.set({currentArticle: article}, () => {
                chrome.action.openPopup();
            });
        });
    }
});
