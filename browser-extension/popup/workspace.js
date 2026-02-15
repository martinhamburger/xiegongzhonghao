// Workspace JavaScript
let currentStep = 1;
let articleData = {
    title: '',
    subtitle: '',
    coreIdea: '',
    motivation: '',
    readerValue: '',
    outline: '',
    sections: {},
    content: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadArticleData();
    loadCurrentStep();
    setupEventListeners();
    updateGuidance();
});

// Load article data from storage
function loadArticleData() {
    chrome.storage.local.get(['currentArticle'], (result) => {
        if (result.currentArticle) {
            articleData = {...articleData, ...result.currentArticle};
            populateFields();
        }
    });
}

// Load current step from storage
function loadCurrentStep() {
    chrome.storage.local.get(['currentStep'], (result) => {
        if (result.currentStep) {
            currentStep = parseInt(result.currentStep);
        }
        showStep(currentStep);
    });
}

// Populate fields with saved data
function populateFields() {
    document.getElementById('article-title').value = articleData.title || '';
    document.getElementById('article-subtitle').value = articleData.subtitle || '';
    
    if (articleData.coreIdea) {
        document.getElementById('core-idea').value = articleData.coreIdea;
    }
    if (articleData.motivation) {
        document.getElementById('motivation').value = articleData.motivation;
    }
    if (articleData.readerValue) {
        document.getElementById('reader-value').value = articleData.readerValue;
    }
    if (articleData.outline) {
        document.getElementById('outline-text').value = articleData.outline;
        updateOutlinePreview();
    }
    if (articleData.content) {
        document.getElementById('full-content').value = articleData.content;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Header buttons
    document.getElementById('save-btn').addEventListener('click', saveArticle);
    document.getElementById('back-btn').addEventListener('click', () => window.close());
    
    // Article meta
    document.getElementById('article-title').addEventListener('input', updatePreview);
    document.getElementById('article-subtitle').addEventListener('input', updatePreview);
    
    // Step 1
    document.getElementById('step1-next').addEventListener('click', () => {
        saveStep1();
        goToStep(2);
    });
    
    // Step 2
    document.getElementById('step2-prev').addEventListener('click', () => goToStep(1));
    document.getElementById('step2-next').addEventListener('click', () => {
        saveStep2();
        goToStep(3);
    });
    document.getElementById('outline-text').addEventListener('input', updateOutlinePreview);
    
    // Step 3
    document.getElementById('step3-prev').addEventListener('click', () => goToStep(2));
    document.getElementById('save-section').addEventListener('click', saveCurrentSection);
    document.getElementById('step3-next').addEventListener('click', () => {
        saveStep3();
        goToStep(4);
    });
    document.getElementById('section-select').addEventListener('change', loadSection);
    document.getElementById('section-content').addEventListener('input', updatePreview);
    
    // Step 4
    document.getElementById('step4-prev').addEventListener('click', () => goToStep(3));
    document.getElementById('check-logic').addEventListener('click', checkLogic);
    document.getElementById('check-style').addEventListener('click', checkStyle);
    document.getElementById('remove-ai-style').addEventListener('click', removeAIStyle);
    document.getElementById('finish-article').addEventListener('click', finishArticle);
    document.getElementById('full-content').addEventListener('input', updatePreview);
    
    // Auto-save
    setInterval(autoSave, 30000); // Auto-save every 30 seconds
}

// Show specific step
function showStep(step) {
    currentStep = step;
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`step-${step}`).style.display = 'block';
    
    // Update step indicator
    document.getElementById('step-indicator').textContent = `步骤 ${step}/4`;
    
    // Update progress
    updateProgress();
    
    // Update guidance
    updateGuidance();
    
    // Special handling for step 3
    if (step === 3) {
        populateSectionSelector();
    }
    
    // Special handling for step 4
    if (step === 4) {
        compileFullArticle();
    }
}

// Go to specific step
function goToStep(step) {
    showStep(step);
    chrome.storage.local.set({currentStep: step});
}

// Update guidance based on current step
function updateGuidance() {
    const guidance = {
        1: {
            title: '确定核心观点',
            text: '这是最重要的一步。请思考：这篇文章最想表达什么？为什么要写？读者能获得什么？'
        },
        2: {
            title: '设计大纲',
            text: '基于核心观点，设计文章结构。建议使用"引言 → 核心概念 → 应用 → 总结"的模式。'
        },
        3: {
            title: '逐章撰写',
            text: '选择一个章节开始。保持"定义 → 图解/直觉 → 个人思考"的节奏。用自己的话解释概念。'
        },
        4: {
            title: '整体润色',
            text: '检查文章的逻辑连贯性和风格统一性。应用去AI味技巧，让文章更自然、更有个性。'
        }
    };
    
    const current = guidance[currentStep];
    document.getElementById('guidance-content').innerHTML = `
        <h4>${current.title}</h4>
        <p>${current.text}</p>
    `;
}

// Update progress bar
function updateProgress() {
    const progress = (currentStep / 4) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${Math.round(progress)}% 完成`;
}

// Save Step 1
function saveStep1() {
    articleData.coreIdea = document.getElementById('core-idea').value;
    articleData.motivation = document.getElementById('motivation').value;
    articleData.readerValue = document.getElementById('reader-value').value;
}

// Save Step 2
function saveStep2() {
    articleData.outline = document.getElementById('outline-text').value;
    parseSections();
}

// Update outline preview
function updateOutlinePreview() {
    const outline = document.getElementById('outline-text').value;
    const lines = outline.split('\n');
    const html = lines.map(line => {
        if (line.startsWith('## ')) {
            return `<h3>${line.substring(3)}</h3>`;
        } else if (line.startsWith('### ')) {
            return `<p style="margin-left: 20px;">${line.substring(4)}</p>`;
        } else if (line.startsWith('- ')) {
            return `<p style="margin-left: 40px; color: #666;">• ${line.substring(2)}</p>`;
        }
        return '';
    }).join('');
    
    document.getElementById('outline-preview').innerHTML = html || '<p>大纲预览将显示在此</p>';
}

// Parse sections from outline
function parseSections() {
    const outline = document.getElementById('outline-text').value;
    const lines = outline.split('\n');
    const sections = [];
    
    lines.forEach(line => {
        if (line.startsWith('## ')) {
            sections.push(line.substring(3).trim());
        }
    });
    
    articleData.sectionList = sections;
}

// Populate section selector
function populateSectionSelector() {
    const select = document.getElementById('section-select');
    select.innerHTML = '<option value="">选择章节...</option>';
    
    if (articleData.sectionList && articleData.sectionList.length > 0) {
        articleData.sectionList.forEach((section, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = section;
            select.appendChild(option);
        });
    }
}

// Load section content
function loadSection() {
    const select = document.getElementById('section-select');
    const index = select.value;
    
    if (index === '') {
        document.getElementById('section-guidance').innerHTML = '<p>选择一个章节开始撰写</p>';
        document.getElementById('section-content').value = '';
        return;
    }
    
    const sectionName = articleData.sectionList[index];
    document.getElementById('section-guidance').innerHTML = `
        <p><strong>正在撰写：</strong>${sectionName}</p>
        <p>💡 提示：保持"定义 → 图解 → 个人思考"的节奏</p>
    `;
    
    // Load saved content if exists
    if (articleData.sections[index]) {
        document.getElementById('section-content').value = articleData.sections[index];
    } else {
        document.getElementById('section-content').value = '';
    }
}

// Save current section
function saveCurrentSection() {
    const select = document.getElementById('section-select');
    const index = select.value;
    
    if (index === '') {
        alert('请先选择一个章节');
        return;
    }
    
    const content = document.getElementById('section-content').value;
    articleData.sections[index] = content;
    
    updateStatusMessage('章节已保存', 'success');
}

// Save Step 3
function saveStep3() {
    saveCurrentSection();
}

// Compile full article
function compileFullArticle() {
    let fullContent = '';
    
    // Add title
    if (articleData.title) {
        fullContent += `# ${articleData.title}\n\n`;
    }
    if (articleData.subtitle) {
        fullContent += `${articleData.subtitle}\n\n`;
    }
    
    // Add introduction from step 1
    if (articleData.coreIdea || articleData.motivation) {
        fullContent += `## 00 引言\n\n`;
        if (articleData.motivation) {
            fullContent += `${articleData.motivation}\n\n`;
        }
        if (articleData.coreIdea) {
            fullContent += `**核心观点：** ${articleData.coreIdea}\n\n`;
        }
    }
    
    // Add sections
    if (articleData.sectionList && articleData.sections) {
        articleData.sectionList.forEach((section, index) => {
            fullContent += `## ${section}\n\n`;
            if (articleData.sections[index]) {
                fullContent += `${articleData.sections[index]}\n\n`;
            }
        });
    }
    
    articleData.content = fullContent;
    document.getElementById('full-content').value = fullContent;
    updatePreview();
}

// Check logic
function checkLogic() {
    const suggestions = [];
    const content = document.getElementById('full-content').value;
    
    // Simple checks
    if (!content.includes('## 00 引言')) {
        suggestions.push('建议添加引言部分');
    }
    
    if (!content.includes('## ') || content.split('## ').length < 3) {
        suggestions.push('文章章节较少，建议补充内容');
    }
    
    if (content.length < 500) {
        suggestions.push('文章内容较短，建议扩充');
    }
    
    showPolishResults(suggestions);
}

// Check style
function checkStyle() {
    const suggestions = [];
    const content = document.getElementById('full-content').value;
    
    // Check for consistent structure
    const sections = content.split('## ').filter(s => s.trim());
    sections.forEach((section, index) => {
        if (!section.includes('###')) {
            suggestions.push(`第${index + 1}个章节缺少子章节，建议添加结构`);
        }
    });
    
    showPolishResults(suggestions);
}

// Remove AI style
function removeAIStyle() {
    let content = document.getElementById('full-content').value;
    
    // Remove excessive transition words
    const transitions = ['首先，', '其次，', '再次，', '最后，', '综上所述，', '总之，'];
    transitions.forEach(word => {
        const regex = new RegExp(word, 'g');
        content = content.replace(regex, '');
    });
    
    // Remove clichés
    const cliches = ['随着时代的发展，', '在当今社会，', '显而易见的是，'];
    cliches.forEach(phrase => {
        content = content.replace(new RegExp(phrase, 'g'), '');
    });
    
    document.getElementById('full-content').value = content;
    articleData.content = content;
    updatePreview();
    updateStatusMessage('已应用去AI味优化', 'success');
}

// Show polish results
function showPolishResults(suggestions) {
    const resultsDiv = document.getElementById('polish-results');
    const suggestionsDiv = document.getElementById('polish-suggestions');
    
    if (suggestions.length === 0) {
        suggestionsDiv.innerHTML = '<p style="color: #28a745;">✅ 未发现明显问题，文章质量良好！</p>';
    } else {
        suggestionsDiv.innerHTML = '<ul>' + suggestions.map(s => `<li>${s}</li>`).join('') + '</ul>';
    }
    
    resultsDiv.style.display = 'block';
}

// Finish article
function finishArticle() {
    articleData.content = document.getElementById('full-content').value;
    articleData.title = document.getElementById('article-title').value;
    articleData.subtitle = document.getElementById('article-subtitle').value;
    articleData.step = 4;
    articleData.lastUpdate = new Date().toLocaleString('zh-CN');
    
    saveArticle();
    
    if (confirm('文章已完成！是否返回主界面？')) {
        window.close();
    }
}

// Save article
function saveArticle() {
    articleData.title = document.getElementById('article-title').value;
    articleData.subtitle = document.getElementById('article-subtitle').value;
    articleData.step = currentStep;
    articleData.lastUpdate = new Date().toLocaleString('zh-CN');
    
    chrome.storage.local.set({currentArticle: articleData}, () => {
        updateStatusMessage('已保存', 'success');
        updateLastSaved();
    });
}

// Auto-save
function autoSave() {
    if (document.getElementById('article-title').value) {
        saveArticle();
    }
}

// Update preview
function updatePreview() {
    const preview = document.getElementById('live-preview');
    let content = '';
    
    const title = document.getElementById('article-title').value;
    const subtitle = document.getElementById('article-subtitle').value;
    
    if (title) {
        content += `<h1>${title}</h1>`;
    }
    if (subtitle) {
        content += `<p style="color: #666; font-size: 16px;">${subtitle}</p>`;
    }
    
    if (currentStep === 1) {
        const coreIdea = document.getElementById('core-idea').value;
        if (coreIdea) {
            content += `<h3>核心观点</h3><p>${coreIdea}</p>`;
        }
    } else if (currentStep === 3) {
        const sectionContent = document.getElementById('section-content').value;
        if (sectionContent) {
            content += convertMarkdownToHTML(sectionContent);
        }
    } else if (currentStep === 4) {
        const fullContent = document.getElementById('full-content').value;
        if (fullContent) {
            content += convertMarkdownToHTML(fullContent);
        }
    }
    
    preview.innerHTML = content || '<p class="placeholder">开始写作后，预览将显示在此</p>';
    
    // Update word count
    updateWordCount();
}

// Simple markdown to HTML converter
function convertMarkdownToHTML(markdown) {
    return markdown
        .split('\n')
        .map(line => {
            if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
            if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
            if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
            if (line.startsWith('> ')) return `<blockquote>${line.substring(2)}</blockquote>`;
            if (line.trim() === '') return '<br>';
            return `<p>${line}</p>`;
        })
        .join('');
}

// Update word count
function updateWordCount() {
    let content = '';
    if (currentStep === 1) {
        content = document.getElementById('core-idea').value +
                 document.getElementById('motivation').value +
                 document.getElementById('reader-value').value;
    } else if (currentStep === 3) {
        content = document.getElementById('section-content').value;
    } else if (currentStep === 4) {
        content = document.getElementById('full-content').value;
    }
    
    const count = content.replace(/\s/g, '').length;
    document.getElementById('word-count').textContent = `字数: ${count}`;
}

// Update status message
function updateStatusMessage(message, type = 'info') {
    const statusMsg = document.getElementById('status-message');
    statusMsg.textContent = message;
    statusMsg.style.color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#666';
    
    setTimeout(() => {
        statusMsg.textContent = '就绪';
        statusMsg.style.color = '#28a745';
    }, 3000);
}

// Update last saved time
function updateLastSaved() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('last-saved').textContent = `最后保存: ${timeStr}`;
}
