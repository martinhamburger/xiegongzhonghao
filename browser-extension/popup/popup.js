// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding content
        const tabName = tab.dataset.tab;
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Writing workflow
document.getElementById('start-new-article').addEventListener('click', () => {
    document.getElementById('workflow-section').style.display = 'block';
    loadArticleState();
});

// Workflow step buttons
document.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', function() {
        const step = this.dataset.step;
        startWorkflowStep(step);
    });
});

// AI Style Check
document.getElementById('check-ai-style').addEventListener('click', () => {
    const text = document.getElementById('deai-input').value;
    if (!text.trim()) {
        alert('请输入要检测的文本');
        return;
    }
    checkAIStyle(text);
});

// Auto fix
document.getElementById('auto-fix').addEventListener('click', () => {
    const text = document.getElementById('deai-input').value;
    autoFixAIStyle(text);
});

// Import buttons
document.getElementById('import-webpage').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'extractContent'}, (response) => {
            if (response && response.content) {
                showImportPreview(response.content);
            }
        });
    });
});

document.getElementById('import-conversation').addEventListener('click', () => {
    const content = prompt('请粘贴AI对话内容：');
    if (content) {
        showImportPreview(content);
    }
});

document.getElementById('import-selection').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getSelection'}, (response) => {
            if (response && response.selection) {
                showImportPreview(response.selection);
            } else {
                alert('未检测到选中的内容');
            }
        });
    });
});

document.getElementById('confirm-import').addEventListener('click', () => {
    const content = document.getElementById('import-content').textContent;
    importContent(content);
});

// Preview buttons
document.getElementById('copy-markdown').addEventListener('click', () => {
    copyToClipboard(getCurrentArticle());
});

document.getElementById('open-markdownnice').addEventListener('click', () => {
    chrome.tabs.create({url: 'https://editor.mdnice.com/'});
    copyToClipboard(getCurrentArticle());
});

document.getElementById('export-article').addEventListener('click', () => {
    exportArticle();
});

// Functions

function loadArticleState() {
    chrome.storage.local.get(['currentArticle'], (result) => {
        if (result.currentArticle) {
            updateWritingStatus(result.currentArticle);
        } else {
            updateWritingStatus({
                status: 'new',
                step: 0,
                title: '新文章',
                content: ''
            });
        }
    });
}

function updateWritingStatus(article) {
    const statusBox = document.getElementById('writing-status');
    const stepNames = ['未开始', '确定核心观点', '设计大纲', '逐章撰写', '整体润色', '已完成'];
    
    statusBox.innerHTML = `
        <p><strong>文章标题：</strong>${article.title || '未设置'}</p>
        <p><strong>当前步骤：</strong>${stepNames[article.step] || '未开始'}</p>
        <p><strong>最后更新：</strong>${article.lastUpdate || '刚刚'}</p>
    `;
}

function startWorkflowStep(step) {
    // Store step and open workspace
    chrome.storage.local.set({currentStep: step}, () => {
        chrome.tabs.create({url: chrome.runtime.getURL('popup/workspace.html')});
    });
}

function checkAIStyle(text) {
    const issues = detectAIPatterns(text);
    const score = calculateAIScore(issues);
    
    document.getElementById('deai-results').style.display = 'block';
    document.getElementById('deai-score').innerHTML = `
        <div>AI味指数: ${score}/100</div>
        <div style="font-size: 12px; margin-top: 8px; color: #666;">
            ${score < 30 ? '✅ 优秀' : score < 60 ? '⚠️ 一般' : '❌ 需要优化'}
        </div>
    `;
    
    displaySuggestions(issues);
}

function detectAIPatterns(text) {
    const issues = [];
    
    // Check for excessive transition words
    const transitionWords = ['首先', '其次', '再次', '最后', '因此', '所以', '综上所述', '总之'];
    transitionWords.forEach(word => {
        const count = (text.match(new RegExp(word, 'g')) || []).length;
        if (count > 2) {
            issues.push({
                type: 'transition',
                word: word,
                count: count,
                suggestion: `过度使用衔接词"${word}"（${count}次），建议删减`
            });
        }
    });
    
    // Check for clichés
    const cliches = ['随着时代的发展', '在当今社会', '显而易见的是', '我们需要认识到'];
    cliches.forEach(phrase => {
        if (text.includes(phrase)) {
            issues.push({
                type: 'cliche',
                phrase: phrase,
                suggestion: `建议删除套话"${phrase}"，直接进入主题`
            });
        }
    });
    
    // Check for overly formal structures
    if (text.match(/既.*又.*/g) && text.match(/既.*又.*/g).length > 2) {
        issues.push({
            type: 'structure',
            suggestion: '过度使用"既...又..."结构，建议改用口语化表达'
        });
    }
    
    return issues;
}

function calculateAIScore(issues) {
    // Base score is 0 (best)
    let score = 0;
    issues.forEach(issue => {
        if (issue.type === 'transition') {
            score += issue.count * 5;
        } else if (issue.type === 'cliche') {
            score += 15;
        } else if (issue.type === 'structure') {
            score += 10;
        }
    });
    return Math.min(100, score);
}

function displaySuggestions(issues) {
    const container = document.getElementById('deai-suggestions');
    container.innerHTML = '<h4>优化建议：</h4>';
    
    if (issues.length === 0) {
        container.innerHTML += '<p style="color: #28a745;">未检测到明显的AI写作特征！</p>';
        return;
    }
    
    issues.forEach(issue => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `<strong>${issue.suggestion}</strong>`;
        container.appendChild(div);
    });
}

function autoFixAIStyle(text) {
    let fixed = text;
    
    // Remove excessive transition words
    const transitions = ['首先，', '其次，', '再次，', '综上所述，', '总之，'];
    transitions.forEach(word => {
        // Keep only one occurrence
        const regex = new RegExp(word, 'g');
        const matches = fixed.match(regex);
        if (matches && matches.length > 1) {
            fixed = fixed.replace(regex, (match, offset) => {
                return matches.indexOf(match) === 0 ? match : '';
            });
        }
    });
    
    // Remove clichés
    const cliches = ['随着时代的发展，', '在当今社会，', '显而易见的是，'];
    cliches.forEach(phrase => {
        fixed = fixed.replace(new RegExp(phrase, 'g'), '');
    });
    
    document.getElementById('deai-input').value = fixed;
    alert('已自动优化！请查看结果并手动调整。');
}

function showImportPreview(content) {
    document.getElementById('import-preview').style.display = 'block';
    document.getElementById('import-content').textContent = content.substring(0, 500) + '...';
}

function importContent(content) {
    chrome.storage.local.get(['currentArticle'], (result) => {
        const article = result.currentArticle || {content: ''};
        article.content += '\n\n' + content;
        
        chrome.storage.local.set({currentArticle: article}, () => {
            alert('内容已导入！');
            document.getElementById('import-preview').style.display = 'none';
            loadArticleState();
        });
    });
}

function getCurrentArticle() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['currentArticle'], (result) => {
            resolve(result.currentArticle?.content || '暂无内容');
        });
    });
}

function copyToClipboard(text) {
    if (typeof text === 'string') {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！');
        });
    } else {
        text.then(content => {
            navigator.clipboard.writeText(content).then(() => {
                alert('已复制到剪贴板！');
            });
        });
    }
}

function exportArticle() {
    chrome.storage.local.get(['currentArticle'], (result) => {
        if (!result.currentArticle || !result.currentArticle.content) {
            alert('暂无内容可导出');
            return;
        }
        
        const blob = new Blob([result.currentArticle.content], {type: 'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.currentArticle.title || 'article'}.md`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Load current article preview on tab switch
document.querySelector('[data-tab="preview"]').addEventListener('click', () => {
    chrome.storage.local.get(['currentArticle'], (result) => {
        const preview = document.getElementById('article-preview');
        if (result.currentArticle && result.currentArticle.content) {
            // Convert markdown to HTML for preview (simple version)
            const html = result.currentArticle.content
                .split('\n')
                .map(line => {
                    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
                    return `<p>${line}</p>`;
                })
                .join('');
            preview.innerHTML = html;
        } else {
            preview.innerHTML = '<p>暂无内容</p>';
        }
    });
});

// Initialize on load
loadArticleState();
