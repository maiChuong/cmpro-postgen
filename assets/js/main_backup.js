// PostGen Web - Main JavaScript Functions

// Default prompt content
const defaultPromptContent = {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "engage audience with insights",
    format: "short-form post",
    hashtags: ["#leadership", "#innovation"]
};

// Theme management
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('preferred-theme') || 'light';
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
        changeTheme(savedTheme);
    }
    
    // Initialize connection checks
    checkStudioConnection();
    checkPuterAvailability();
    
    // Update post count limits based on API key
    updatePostCountLimits();
});

// API Key validation and post count limits
function updatePostCountLimits() {
    const apiKey = document.getElementById('apiKey');
    const postCountInput = document.getElementById('postCount');
    const helpText = document.getElementById('postCountHelp');
    
    if (!apiKey || !postCountInput || !helpText) return;
    
    if (!apiKey.value.trim()) {
        postCountInput.max = 5;
        postCountInput.value = Math.min(postCountInput.value, 5);
        helpText.textContent = 'Default: 5, Max: 5 (API key required for more)';
    } else {
        postCountInput.max = 30;
        helpText.textContent = 'Default: 5, Max: 30 (API key provided)';
    }
}

// LinkedIn content request
async function requestContent() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const postCount = document.getElementById('postCount').value;
    const apiKey = document.getElementById('apiKey').value;
    
    if (!username || !password) {
        alert('Username and password are required');
        return;
    }
    
    if (postCount == 0) {
        document.getElementById('requestContentBtn').disabled = true;
        return;
    }
    
    const display = document.getElementById('postContentDisplay');
    display.innerHTML = 'Fetching LinkedIn content...';
    display.classList.remove('empty');
    
    try {
        // Simulate API call - replace with actual LinkedIn API integration
        const response = await fetch('/api/linkedin/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey ? `Bearer ${apiKey}` : ''
            },
            body: JSON.stringify({
                username,
                password,
                count: postCount
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            display.innerHTML = data.posts ? data.posts.join('\n\n---\n\n') : 'Content not found';
            document.getElementById('userStatus').textContent = 'Active';
            document.getElementById('userStatus').className = 'status active';
        } else {
            display.innerHTML = 'Content not found';
        }
    } catch (error) {
        display.innerHTML = 'Error fetching content. Please check your connection.';
        console.error('Error:', error);
    }
}

// Connection status checks
async function checkStudioConnection() {
    const urlInput = document.getElementById('studioUrl');
    const toggle = document.getElementById('studioToggle');
    const status = document.getElementById('studioStatus');
    
    if (!urlInput || !toggle || !status) return;
    
    const url = urlInput.value;
    
    try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
            toggle.classList.add('active');
            status.textContent = 'Service is on - Success connection';
        } else {
            toggle.classList.remove('active');
            status.textContent = 'Service is off';
        }
    } catch (error) {
        toggle.classList.remove('active');
        status.textContent = 'Connection failed';
    }
}

async function checkWriterStatus() {
    const url = document.getElementById('writerUrl').value;
    const toggle = document.getElementById('writerToggle');
    const status = document.getElementById('writerStatus');
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama3:latest', prompt: 'test' })
        });
        
        if (response.ok) {
            toggle.classList.add('active');
            status.textContent = 'Success connection';
        } else {
            toggle.classList.remove('active');
            status.textContent = 'Connection failed';
        }
    } catch (error) {
        toggle.classList.remove('active');
        status.textContent = 'Service unavailable';
    }
}

async function checkPuterAvailability() {
    const toggle = document.getElementById('puterToggle');
    const status = document.getElementById('puterStatus');
    
    if (!toggle || !status) return;
    
    try {
        // Check if Puter is available
        if (typeof puter !== 'undefined') {
            toggle.classList.add('active');
            status.textContent = 'Success connection';
        } else {
            toggle.classList.remove('active');
            status.textContent = 'Unavailable service, please input your valid endpoint for manual check status';
        }
    } catch (error) {
        toggle.classList.remove('active');
        status.textContent = 'Service unavailable';
    }
}

async function checkPuterStatus() {
    const url = document.getElementById('puterUrl').value;
    const toggle = document.getElementById('puterToggle');
    const status = document.getElementById('puterStatus');
    
    try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
            toggle.classList.add('active');
            status.textContent = 'Success connection';
        } else {
            toggle.classList.remove('active');
            status.textContent = 'Connection failed';
        }
    } catch (error) {
        toggle.classList.remove('active');
        status.textContent = 'Service unavailable';
    }
}

// Content generation
async function generateContent() {
    const prompt = document.getElementById('userPrompt').value;
    const model = document.getElementById('aiModel').value;
    const finalPrompt = prompt.trim() || generateDefaultPrompt();
    
    // Determine which service to use based on active connections
    const writerActive = document.getElementById('writerToggle').classList.contains('active');
    const puterActive = document.getElementById('puterToggle').classList.contains('active');
    
    let targetDisplay, apiUrl;
    
    if (writerActive) {
        targetDisplay = document.getElementById('writerContentDisplay');
        apiUrl = document.getElementById('writerUrl').value;
        await generateWithOllama(finalPrompt, targetDisplay, apiUrl);
    } else if (puterActive) {
        targetDisplay = document.getElementById('puterContentDisplay');
        await generateWithPuter(finalPrompt, targetDisplay, model);
    } else {
        alert('No AI service is available. Please check your connections.');
    }
}

async function generateWithOllama(prompt, display, url) {
    display.innerHTML = 'Generating content...';
    display.classList.remove('empty');
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3:latest',
                prompt: prompt,
                stream: false
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            display.innerHTML = data.response || 'No content generated';
        } else {
            display.innerHTML = 'Error generating content';
        }
    } catch (error) {
        display.innerHTML = 'Connection error';
        console.error('Error:', error);
    }
}

async function generateWithPuter(prompt, display, model) {
    display.innerHTML = 'Generating content...';
    display.classList.remove('empty');
    
    try {
        // Use Puter AI API
        const result = await puter.ai.chat(prompt, { model: model });
        display.innerHTML = result || 'No content generated';
    } catch (error) {
        display.innerHTML = 'Error generating content';
        console.error('Error:', error);
    }
}

function generateDefaultPrompt() {
    return `Generate a professional LinkedIn post with the following parameters:
Tone: ${defaultPromptContent.tone}
Audience: ${defaultPromptContent.audience}
Style: ${defaultPromptContent.styleReference}
Goal: ${defaultPromptContent.goal}
Format: ${defaultPromptContent.format}
Hashtags: ${defaultPromptContent.hashtags.join(', ')}`;
}

// Content management functions
function editContent(contentType) {
    const display = document.getElementById(`${contentType}Display`);
    if (!display) return;
    
    const currentContent = display.innerHTML;
    
    const textarea = document.createElement('textarea');
    textarea.value = currentContent;
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn btn-primary mt-2';
    saveBtn.onclick = () => {
        display.innerHTML = textarea.value;
        display.removeChild(textarea);
        display.removeChild(saveBtn);
    };
    
    display.innerHTML = '';
    display.appendChild(textarea);
    display.appendChild(saveBtn);
}

function copyContent(contentType) {
    const display = document.getElementById(`${contentType}Display`);
    if (!display) return;
    
    const content = display.textContent;
    
    navigator.clipboard.writeText(content).then(() => {
        alert('Content copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function exportContent(contentType, format) {
    const display = document.getElementById(`${contentType}Display`);
    if (!display) return;
    
    const content = display.textContent;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}_export.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility functions
function handlePromptEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateContent();
    }
}

function toggleConnection(service) {
    if (service === 'studio') {
        checkStudioConnection();
    }
}

function searchPosts() {
    const query = document.getElementById('searchInput').value;
    // Implement search functionality
    console.log('Searching for:', query);
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const postCountInput = document.getElementById('postCount');
    const requestBtn = document.getElementById('requestContentBtn');
    
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', updatePostCountLimits);
    }
    
    if (postCountInput && requestBtn) {
        postCountInput.addEventListener('change', function() {
            if (this.value == 0) {
                requestBtn.disabled = true;
            } else {
                requestBtn.disabled = false;
            }
        });
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}
