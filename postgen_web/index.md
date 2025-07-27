---
layout: default
title: PostGen Web - LinkedIn Content Generator
---

<div class="container">
    <!-- Header -->
    <header class="header">
        <div class="header-top">
            <h1>Post Gen</h1>
            <img src="{{ '/assets/img/Logo.png' | relative_url }}" alt="PostGen Logo" class="logo">
        </div>
        
        <!-- Profile Section -->
        <div class="profile-section">
            <img src="{{ '/assets/img/avatar.png' | relative_url }}" alt="Profile Avatar" class="profile-avatar">
            <div class="profile-info">
                <h2>LinkedIn Login Credentials</h2>
                <div class="profile-details">
                    <p><strong>Postgen Fox</strong></p>
                    <p>Professional writer</p>
                    <p>Status: <span id="userStatus" class="status inactive">Inactive</span></p>
                </div>
            </div>
        </div>

        <!-- Login Form -->
        <div class="section">
            <div class="form-group">
                <label for="apiKey">API Access Key (required)</label>
                <input type="password" id="apiKey" placeholder="Your API key for unlimited requests">
                <small>Your data request is limited without key</small>
            </div>
            <div class="form-group">
                <label for="username" placeholder="example@mail.com">Username (required)</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password (required)</label>
                <input type="password" id="password" required>
            </div>
            <div class="form-group">
                <label for="postCount">Number of post content requests</label>
                <input type="number" id="postCount" value="5" min="1" max="30">
                <small id="postCountHelp">Default: 5, Max: 30 (requires API key for more than 5)</small>
            </div>
            <button class="btn btn-primary" id="requestContentBtn" onclick="requestContent()">Request Content</button>
            <div id="toast">Username and password are required</div>
        </div>
    </header>

    <!-- Post Content Retrieved Section -->
    <section class="section">
        <h2>Post Content Retrieved</h2>
        <div id="postContentDisplay" class="content-display empty">
            Please type number of posts and click the button "Request Content"
        </div>
        <div class="action-buttons">
            <button class="btn btn-secondary" onclick="editContent('postContent')">Edit</button>
            <button class="btn btn-secondary" onclick="copyContent('postContent')">Copy</button>
            <button class="btn btn-secondary" onclick="exportContent('postContent', 'markdown')">Export</button>
        </div>
    </section>

    <!-- Benchmarking AI Models Section -->
    <section class="section">
        <h2>Benchmarking AI Models</h2>
        
        <!-- PostGen Studio Connection -->
        <div class="subsection">
            <h3>PostGen Studio Connection Status</h3>
            <div class="form-group">
                <label for="studioUrl">Studio URL</label>
                <input type="url" id="studioUrl" value="http://localhost:8000" placeholder="Postgen:port">
            </div>
            <div class="status-indicator">
                <div id="studioToggle" class="status-toggle" onclick="toggleConnection('studio')"></div>
                <span id="studioStatus">Checking connection...</span>
                <button class="btn btn-secondary" onclick="retryStudioConnection()" style="margin-left: 10px;">Retry</button>
            </div>
        </div>

        <!-- PostGen Writer -->
        <div class="subsection">
            <h3>PostGen Writer</h3>
            <p>Please check your API endpoint connection status</p>
            <!-- <div class="form-group">
                <label for="writerUrl">Writer API Endpoint</label>
                <input type="url" id="writerUrl" value="http://localhost:11434/api/generate" placeholder="https://example.com/api">
            </div> -->
            <div class="status-indicator">
                <div id="writerToggle" class="status-toggle"></div>
                <span id="writerStatus">Ready to check</span>
                <button class="btn btn-secondary" onclick="checkWriterStatus()" style="margin-left: 10px;">Retry</button>
            </div>
            <div id="writerContentDisplay" class="content-display empty">
                Please input your prompt and hit enter or you can leave the prompt blank
            </div>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="editContent('writerContent')">Edit</button>
                <button class="btn btn-secondary" onclick="copyContent('writerContent')">Copy</button>
                <button class="btn btn-secondary" onclick="exportContent('writerContent', 'markdown')">Export</button>
            </div>
        </div>

        <!-- Puter Writer -->
        <div class="subsection" style="margin-top: 50px;">
            <h3>Puter Writer</h3>
            <p>Please check your API endpoint connection status</p>
            <div class="status-indicator">
                <div id="puterToggle" class="status-toggle"></div>
                <span id="puterStatus">Checking service availability...</span>
                <button class="btn btn-secondary" onclick="checkPuterStatus()" style="margin-left: 10px;">Retry</button>
            </div>
            <div id="puterContentDisplay" class="content-display empty">
                Please input your prompt and hit enter or you can leave the prompt blank
            </div>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="editContent('puterContent')">Edit</button>
                <button class="btn btn-secondary" onclick="copyContent('puterContent')">Copy</button>
                <button class="btn btn-secondary" onclick="exportContent('puterContent', 'markdown')">Export</button>
            </div>
        </div>
    </section>
</div>

<!-- Load Puter.js SDK -->
<script src="https://js.puter.com/v2/"></script>

<!-- Floating Prompt Container -->
<div class="prompt-container">
    <div class="prompt-input">
        <textarea id="userPrompt" placeholder="Enter your prompt here..." onkeypress="handlePromptEnter(event)"></textarea>
        <button class="btn btn-primary" onclick="generateContent()">Generate</button>
    </div>
    <div class="prompt-controls">
        <div class="model-selector">
            <label for="aiModel">AI Model:</label>
            <select id="aiModel">
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-3-5-sonnet">Claude</option>
            </select>
        </div>
    </div>
</div>
<style>
  #toast {
    visibility: hidden;
    min-width: 250px;
    background-color: #e74c3c;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 14px;
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    font-family: sans-serif;
  }

  #toast.show {
    visibility: visible;
    animation: fadein 0.5s, fadeout 0.5s 3s;
  }

  @keyframes fadein {
    from { bottom: 0; opacity: 0; }
    to { bottom: 30px; opacity: 1; }
  }

  @keyframes fadeout {
    from { bottom: 30px; opacity: 1; }
    to { bottom: 0; opacity: 0; }
  }
</style>

