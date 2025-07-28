// PostGen Web - Main JavaScript Functions with Puter.js SDK Integration

// Default prompt content
const defaultPromptContent = {
    default: {
        tone: "professional",
        audience: "LinkedIn network", 
        styleReference: "past successful posts",
        goal: "engage audience with insights",
        format: "short-form post",
        hashtags: ["#leadership", "#innovation"],
        constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
        ]
    },
    promotion: {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "share promotion news and reflect on career growth",
    format: "short-form post",
    hashtags: ["#leadership", "#careerjourney"],
    constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
    ]
    },
    launch: {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "announce new business and express enthusiasm",
    format: "short-form post",
    hashtags: ["#entrepreneurship", "#startuplife"],
    constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
    ]
    },
    education: {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "share education milestone and future ambitions",
    format: "short-form post",
    hashtags: ["#lifelonglearning", "#professionaldevelopment"],
    constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
    ]
    },
    pivot: {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "reflect on career shift and share aspirations",
    format: "short-form post",
    hashtags: ["#careerpivot", "#growthmindset"],
    constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
    ]
    },
    speaking: {
    tone: "professional",
    audience: "LinkedIn network",
    styleReference: "past successful posts",
    goal: "announce speaking opportunity and invite engagement",
    format: "short-form post",
    hashtags: ["#publicspeaking", "#thoughtleadership"],
    constraints: [
        "Do not include emojis, icons, dashes (–), or em dashes (—)",
        "Maintain clarity and professionalism in tone"
    ]
    }
};

// 👔 Friendly formatter to rewrite prompt data into human-readable description
function renderHumanReadablePrompt(prompt) {
  return `
This LinkedIn post will use a ${prompt.tone} tone targeting the ${prompt.audience}.  
Its purpose is to ${prompt.goal}, inspired by ${prompt.styleReference}.  
The content format is a ${prompt.format}, designed for professional readability.

• Relevant hashtags include:
${prompt.hashtags.map(tag => `- ${tag}`).join('\n')}

• Guidelines to follow:
${prompt.constraints.map(rule => `- ${rule}`).join('\n')}
  `;
}

const selector = document.getElementById("promptSelector");
const display = document.getElementById("displayArea");

selector.addEventListener("change", () => {
  const selected = selector.value;
  const promptData = defaultPromptContent[selected];
  display.textContent = selected
    ? renderHumanReadablePrompt(promptData)
    : "Select a scenario to view the prompt template...";
});

// Display default prompt on page load
window.addEventListener("DOMContentLoaded", () => {
  const promptData = defaultPromptContent["default"];
  display.textContent = renderHumanReadablePrompt(promptData);
});

// Theme management
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
}

// Load saved theme and initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('preferred-theme') || 'mono';
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
        changeTheme(savedTheme);
    }
    
    // Initialize connection checks
    checkStudioConnection();
    checkPuterService(); // Check Puter via SDK
    checkWriterStatus(); // Check writer status on load
    
    // Update post count limits based on API key
    updatePostCountLimits();

    // Load any saved content from previous sessions
    loadSavedContent();
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

// Load saved content from localStorage on page load
function loadSavedContent() {
    const contentIds = [
        'postContentDisplay', 
        'writerContentDisplay', 
        'puterContentDisplay'
    ];

    contentIds.forEach(id => {
        const savedContent = localStorage.getItem(id);
        if (savedContent) {
            const display = document.getElementById(id);
            if (display) {
                display.innerHTML = savedContent;
                display.classList.remove('empty');
            }
        }
    });
}

// LinkedIn content request with real API integration
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 4000);
}

async function requestContent() {
  if (window.linkedInIntegration) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const postCount = document.getElementById('postCount').value;
    const apiKey = document.getElementById('apiKey').value;

    if (!username || !password) {
      showToast('Username and password are required');
      return;
    }

    if (postCount == 0) {
      document.getElementById('requestContentBtn').disabled = true;
      return;
    }

    await window.linkedInIntegration.requestContentWithRealAPI(username, password, postCount, apiKey);
  }


    
    // Fallback to original implementation
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
    
    // Mock LinkedIn content for PostGen Web
    const mockPosts = [
        "🚀 Exciting developments in AI and automation are reshaping how we work. As professionals, staying ahead means embracing continuous learning and adaptation. What skills are you developing to future-proof your career? #AI #ProfessionalDevelopment #Innovation",
        "💡 Leadership isn't about having all the answers—it's about asking the right questions and empowering your team to find solutions. Today's challenge: How can we create more inclusive decision-making processes? #Leadership #Teamwork #Inclusion",
        "🌟 Networking isn't just about collecting contacts; it's about building meaningful relationships that create mutual value. Quality over quantity always wins. What's your approach to authentic professional networking? #Networking #Relationships #CareerGrowth",
        "📈 Data-driven decision making is crucial, but don't forget the human element. The best strategies combine analytical insights with emotional intelligence and cultural awareness. #DataScience #Leadership #Strategy",
        "🎯 Setting clear goals is important, but building systems that support those goals is what creates lasting success. Focus on the process, and the results will follow. #GoalSetting #Productivity #Success"
    ];
    
    const maxPosts = apiKey ? 30 : 5;
    const actualCount = Math.min(postCount, maxPosts, mockPosts.length);
    const selectedPosts = mockPosts.slice(0, actualCount);
    
    display.innerHTML = selectedPosts.join('\n\n---\n\n');
    localStorage.setItem('postContentDisplay', display.innerHTML);
    
    // Update profile section
    updateLinkedInProfile(username);
}

// Helper function to get the list of Studio URLs to try.
// It prioritizes the URL from the input field and includes default fallbacks.
function getStudioUrls() {
    const userUrl = document.getElementById('studioUrl')?.value.trim();
    const defaultUrls = [
        'http://127.0.0.1:8000',
        'http://localhost:8000'
    ];
    // Use a Set to ensure unique URLs, with the user-provided one first.
    return [...new Set([userUrl, ...defaultUrls].filter(Boolean))];
}



// Connection status checks with multiple URL attempts
async function checkStudioConnection() {
    const toggle = document.getElementById('studioToggle');
    const status = document.getElementById('studioStatus');
    
    if (!toggle || !status) return;

    const urls = getStudioUrls();
    let connected = false;
    
    for (const url of urls) {
        try {
            const response = await fetch(`${url}/health`, { timeout: 3000 });
            if (response.ok) {
                toggle.classList.add('active');
                status.textContent = `Connected to PostGen Studio (${url})`;
                connected = true;
                break;
            }
        } catch (error) {
            console.log(`Failed to connect to ${url}:`, error.message);
        }
    }
    
    if (!connected) {
        toggle.classList.remove('active');
        status.textContent = 'PostGen Studio not available - limited functionality';
    }
}

// Check PostGen Writer status via Studio connection
async function checkWriterStatus() {
    const toggle = document.getElementById('writerToggle');
    const status = document.getElementById('writerStatus');
    const display = document.getElementById('writerContentDisplay');
    
    if (!toggle || !status) return;
    
    const studioActive = document.getElementById('studioToggle').classList.contains('active');
    
    if (studioActive) {
        toggle.classList.add('active');
        status.textContent = 'PostGen Writer available via Studio';
        if (display) {
            display.innerHTML = '<strong>PostGen Writer is ready for your prompt</strong>';
            display.classList.remove('empty');
        }
    } else {
        toggle.classList.remove('active');
        status.textContent = 'PostGen Writer unavailable - Studio not connected';
        if (display) {
            display.innerHTML = '<em>PostGen Writer requires Studio connection</em>';
            display.classList.add('empty');
        }
    }
}

// Check Puter service status using Puter.js SDK
async function checkPuterService() {
    const toggle = document.getElementById('puterToggle');
    const status = document.getElementById('puterStatus');
    const display = document.getElementById('puterContentDisplay');
    
    if (!toggle || !status || !display) return;

    if (typeof puter === 'undefined' || !puter.ai || !puter.ai.chat) {
        toggle.classList.remove('active');
        status.textContent = 'Puter SDK not loaded';
        display.innerHTML = '<em>Puter SDK not available</em>';
        display.classList.add('empty');
        return;
    }

    status.textContent = 'Checking Puter connection...';
    try {
        // A simple, low-cost call to check connectivity and permissions.
        await puter.ai.chat("Hi", { model: "gpt-4.1-nano" });
        toggle.classList.add('active');
        status.textContent = 'Puter Writer ready (JS SDK)';
        display.innerHTML = '<strong>Puter Writer is ready for your prompt</strong>';
        display.classList.remove('empty');
    } catch (error) {
        console.error('Error checking Puter service:', error);
        toggle.classList.remove('active');
        display.innerHTML = '<em>Puter Writer is unavailable</em>';
        display.classList.add('empty');
        if (error && error.code === 'forbidden') {
            status.textContent = 'Permission denied. Please log in to Puter.';
        } else {
            status.textContent = `Puter Writer error: ${error.message}`;
        }
    }
}

async function checkPuterStatus() {
    await checkPuterService();
}

// Enhanced content generation with default prompt handling
async function generateContent() {
    console.log('=== generateContent() called ===');

    const prompt = document.getElementById('userPrompt').value.trim();
    const model = document.getElementById('aiModel').value;

    // Get Post Content Retrieved
    const postContent = getPostContentRetrieved();

    console.log('User prompt:', prompt || '(empty)');
    console.log('Selected model:', model);
    console.log('Post content available:', !!postContent);

    // Check service availability
    const writerActive = document.getElementById('writerToggle').classList.contains('active');
    const puterActive = document.getElementById('puterToggle').classList.contains('active');

    console.log('Service status - PostGen Writer:', writerActive, 'Puter Writer:', puterActive);

    if (!writerActive && !puterActive) {
        showToggleMessage('No AI services are available. Please check your connections.');
        return;
    }

    // Build the final prompt using sophisticated logic
    const finalPrompt = buildFinalPrompt(prompt, postContent);

    // Collect all active service promises
    const tasks = [];

    if (writerActive) {
        console.log('Using PostGen Writer via Studio');
        tasks.push(generateWithWriter(finalPrompt, 'writerContentDisplay', model));
    }

    if (puterActive) {
        console.log('Using Puter Writer via JS SDK');
        tasks.push(generateWithPuterSDK(finalPrompt, 'puterContentDisplay', model));
    }

    // Run all services concurrently
    await Promise.all(tasks);
}



// Generate content using Puter.js SDK directly
async function generateWithPuterSDK(prompt, displayId, model) {
    console.log(`=== generateWithPuterSDK(prompt_length: ${prompt.length}, ${displayId}, ${model}) ===`);
    
    const display = document.getElementById(displayId);
    if (!display) {
        console.error('Display element not found:', displayId);
        return;
    }
    
    display.innerHTML = 'Generating content with Puter AI...';
    display.classList.remove('empty');
    
    try {
        if (typeof puter === 'undefined' || !puter.ai || !puter.ai.chat) {
            throw new Error('Puter SDK is not available. Please check the connection.');
        }
        
        console.log(`Generating content with Puter.js SDK (model: ${model})...`);
        
        const response = await puter.ai.chat(prompt, { model });
        
        // The response from puter.ai.chat() can be a string or a stream-like object.
        // We need to handle both cases to be robust.
        let content = '';
        if (typeof response === 'string') {
            // The response is a simple string.
            content = response;
        } else if (response && typeof response.text === 'function') {
            // The response is a stream-like object.
            content = await response.text();
        } else {
            // Fallback for other unexpected types.
            console.warn('Unexpected Puter response format, converting to string:', response);
            content = response ? response.toString() : '';
        }

        display.innerHTML = content.trim();
        localStorage.setItem(displayId, content.trim());
        console.log('Content generated successfully with Puter.js SDK');
        
    } catch (error) {
        console.error('Puter SDK error:', error);
        if (error && error.code === 'forbidden') {
            display.innerHTML = 'Puter AI error: Permission denied. Please ensure you are logged into your Puter account and have granted the app necessary permissions.';
        } else if (error.message.includes('Puter SDK is not available')) {
            display.innerHTML = `Puter AI error: ${error.message}`;
        } else {
            display.innerHTML = `Puter AI connection error: ${error.message}`;
        }
    }
}

// Generate content using PostGen Writer via Studio
async function generateWithWriter(prompt, displayId, model) {
    console.log(`=== generateWithWriter(prompt_length: ${prompt.length}, ${displayId}, ${model}) ===`);
    
    const display = document.getElementById(displayId);
    if (!display) {
        console.error('Display element not found:', displayId);
        return;
    }
    
    display.innerHTML = 'Generating content...';
    display.classList.remove('empty');
    let cloudflared_tunnel_url = document.getElementById("studioUrl").value;
    
    const urls = getStudioUrls();
    
    for (const baseUrl of urls) {
        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('model', model);
            formData.append('service', 'ollama');
            
            const response = await fetch(`${baseUrl}/api/generate`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.response && !data.error) {
                    display.innerHTML = data.response;
                    localStorage.setItem(displayId, data.response);
                    console.log('Content generated successfully via Studio');
                    return;
                } else {
                    display.innerHTML = data.error || 'PostGen Writer error';
                    console.error('Studio API error:', data.error);
                    return;
                }
            }
        } catch (error) {
            console.log(`Failed to generate with ${baseUrl}:`, error.message);
        }
    }
    
    display.innerHTML = 'PostGen Writer unavailable - please check Studio connection';
}

// Build final prompt using sophisticated combination logic
function buildFinalPrompt(userPrompt, postContent) {
    const templatePrompt = generateTemplatePrompt();
    
    const hasUserPrompt = !!userPrompt;
    const hasPostContent = !!postContent;
    
    if (!hasUserPrompt && !hasPostContent) {
        // Case 1: Use default prompt only
        return templatePrompt;
    }
    
    if (!hasUserPrompt && hasPostContent) {
        // Case 2: Default + post content + summarize instruction
        return `${templatePrompt}

REFERENCE POSTS TO ANALYZE:
${postContent}

Please summarize the posts and mimic the style to generate writing a new post.`;
    }
    
    if (hasUserPrompt && hasPostContent) {
        // Case 3: Combine all three elements
        return `${templatePrompt}

USER REQUEST:
${userPrompt}

REFERENCE POSTS TO CONSIDER:
${postContent}

Please create content that addresses the user's request while considering the reference posts for style and context.`;
    }
    
    // Case 4: Has user prompt, no post content
    return `${templatePrompt}

USER REQUEST:
${userPrompt}

Please create content that addresses the user's request.`;
}

function generateTemplatePrompt() {
    const selector = document.getElementById("promptSelector");
    const selectedKey = selector ? selector.value : 'default';
    const promptData = defaultPromptContent[selectedKey] || defaultPromptContent.default;

    return `Generate a professional LinkedIn post with the following parameters:
Tone: ${promptData.tone}
Audience: ${promptData.audience}
Style: ${promptData.styleReference}
Goal: ${promptData.goal}
Format: ${promptData.format}
Hashtags: ${promptData.hashtags.join(', ')}`;
}

// Get Post Content Retrieved from the display
function getPostContentRetrieved() {
    const postContentDisplay = document.getElementById('postContentDisplay');
    if (!postContentDisplay || postContentDisplay.classList.contains('empty')) {
        return '';
    }
    
    const content = postContentDisplay.textContent || postContentDisplay.innerText || '';
    // Filter out placeholder text
    if (content.includes('Please type number of posts') || content.includes('Fetching LinkedIn content')) {
        return '';
    }
    
    return content.trim();
}

// Show toggle message above the prompt
function showToggleMessage(message) {
    // Remove existing toggle message
    const existingMessage = document.getElementById('toggleMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new toggle message
    const promptContainer = document.querySelector('.prompt-container');
    if (!promptContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'toggleMessage';
    messageDiv.style.cssText = `
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        text-align: center;
        font-weight: bold;
    `;
    messageDiv.textContent = message;
    
    promptContainer.insertBefore(messageDiv, promptContainer.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/**
 * Takes content from a display area, stores it in localStorage,
 * and opens the long-form editor page in a new tab.
 * @param {string} contentType - The identifier for the content area (e.g., 'writerContent').
 * @param {string} editorUrl - The URL of the editor page.
 */
function editorContent(contentType, editorUrl) {
    const display = document.getElementById(`${contentType}Display`);
    if (!display) {
        console.error(`Display element for ${contentType}Display not found.`);
        alert(`Could not find content for ${contentType}.`);
        return;
    }
 
    const content = display.innerText;
 
    if (!content || !content.trim() || content.includes('Please input your prompt') || content.includes('is ready for your prompt')) {
        alert('There is no content to edit. Please generate some content first.');
        return;
    }
 
    if (!editorUrl) {
        console.error('Editor URL was not provided to the editorContent function. Check the onclick attribute in your HTML.');
        alert('Cannot navigate to the editor due to a configuration error.');
        return;
    }
 
    try {
        const contentKey = 'postgenEditorContent';
        // Use localStorage which is synchronous and broadly supported.
        localStorage.setItem(contentKey, content);
        // Open the editor in a new tab.
        window.open(editorUrl, '_blank');
    } catch (error) {
        console.error('Failed to save content to localStorage:', error);
        alert('Could not open the editor due to a storage error. This can happen if your browser is in private mode or has strict storage restrictions. Please try again or copy the content manually.');
    }
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

/**
 * Clears the content of a display area and resets it to its initial placeholder text.
 * @param {string} contentType - The identifier for the content area (e.g., 'writerContent' or 'puterContent').
 */
function clearContent(contentType) {
    // Also remove the content from localStorage
    localStorage.removeItem(`${contentType}Display`);

    if (contentType === 'writerContent') {
        // This function already contains the logic to reset the display with the correct placeholder.
        checkWriterStatus();
    } else if (contentType === 'puterContent') {
        // This function also resets the display based on the Puter SDK status.
        checkPuterService();
    } else {
        // Generic fallback for any other content areas.
        const display = document.getElementById(`${contentType}Display`);
        if (display) {
            display.innerHTML = '';
            display.classList.add('empty');
        }
    }
}

// Update LinkedIn profile section after successful login
function updateLinkedInProfile(username) {
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const userStatus = document.getElementById('userStatus');
    const profileAvatar = document.querySelector('.profile-avatar');
    
    // Simulate profile info
    const simulatedProfile = {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        title: "LinkedIn Professional",
        status: "Active"
    };
    
    if (profileName) profileName.textContent = simulatedProfile.name;
    if (profileTitle) profileTitle.textContent = simulatedProfile.title;
    if (userStatus) {
        userStatus.textContent = simulatedProfile.status;
        userStatus.className = 'status active';
    }

    if (profileAvatar) {
        profileAvatar.src = '/cmpro-postgen/assets/img/avatar-b.png'; // NEW AVATAR

    }    
    
    // Update header to show logged in state
    const profileInfo = document.querySelector('.profile-info h2');
    if (profileInfo) {
        profileInfo.textContent = 'LinkedIn Profile';
    }
}

// Retry connection functions
async function retryStudioConnection() {
    const status = document.getElementById('studioStatus');
    if (status) status.textContent = 'Retrying Studio connection...';
    await checkStudioConnection();
    await checkWriterStatus(); // Update writer status after studio check
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


// notes.js: Handles form markdown generation, layout toggle, and search UI for cmpro-note

document.addEventListener('DOMContentLoaded', function () {
  // --- Context-specific Search Bars ---

   // News page
  const newsContextSearch = document.getElementById('news-context-search');
  if (newsContextSearch) {
    newsContextSearch.addEventListener('input', function() {
      const query = (this.value || '').toLowerCase().trim();
      const newsGrid = document.getElementById('news-list');
      if (newsGrid) {
        const posts = newsGrid.querySelectorAll('.news-card');
        posts.forEach(post => {
          const title = (post.getAttribute('data-post-title') || '').toLowerCase();
          const excerpt = (post.getAttribute('data-post-excerpt') || '').toLowerCase();
          const body = (post.getAttribute('data-post-body') || '').toLowerCase();
          if (!query || title.includes(query) || excerpt.includes(query) || body.includes(query)) {
            post.style.display = '';
          } else {
            post.style.display = 'none';
          }
        });
      }
    });
  }
});
