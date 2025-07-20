/**
 * LinkedIn API Integration for PostGen Web
 * Client-side LinkedIn integration with fallback to simulation
 */

class LinkedInIntegration {
    constructor() {
        this.accessToken = null;
        this.isAuthenticated = false;
        this.userProfile = null;
        this.isGitHubPages = window.location.hostname.includes('github.io');
    }

    /**
     * Enhanced request content with LinkedIn API awareness
     */
    async requestContentWithRealAPI(username, password, postCount, apiKey) {
        const display = document.getElementById('postContentDisplay');
        
        try {
            // For PostGen Web (static site), we'll show LinkedIn API information
            // and provide guidance for real integration
            display.innerHTML = `
                <div class="linkedin-info-container">
                    <h4>🔗 LinkedIn API Integration</h4>
                    <p><strong>PostGen Web</strong> is a static site and cannot directly handle LinkedIn OAuth.</p>
                    
                    <div class="integration-options">
                        <h5>📋 For Real LinkedIn Posts:</h5>
                        <ol>
                            <li><strong>Use PostGen Studio:</strong> Run the FastAPI backend for full OAuth support</li>
                            <li><strong>Manual Token:</strong> Get your LinkedIn access token and paste it below</li>
                            <li><strong>Browser Extension:</strong> Use a LinkedIn data export extension</li>
                        </ol>
                        
                        <div class="manual-token-section">
                            <h6>�� Manual Access Token (Advanced Users):</h6>
                            <input type="text" id="manualAccessToken" placeholder="Paste LinkedIn access token here" class="form-control">
                            <button id="useManualTokenBtn" class="btn btn-primary mt-2">Use Access Token</button>
                        </div>
                        
                        <hr>
                        <p><strong>For now, using simulated posts:</strong></p>
                        <button id="useSimulationBtn" class="btn btn-secondary">
                            📝 Continue with Simulated Posts
                        </button>
                    </div>
                    
                    <div class="api-setup-info mt-3">
                        <h6>⚙️ LinkedIn API Setup Guide:</h6>
                        <ul>
                            <li>Go to <a href="https://www.linkedin.com/developers/" target="_blank">LinkedIn Developers</a></li>
                            <li>Create a LinkedIn app with these scopes: r_liteprofile, w_member_social</li>
                            <li>Use PostGen Studio for full OAuth integration</li>
                        </ul>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const useSimulationBtn = document.getElementById('useSimulationBtn');
            const useManualTokenBtn = document.getElementById('useManualTokenBtn');
            
            if (useSimulationBtn) {
                useSimulationBtn.onclick = () => {
                    this.requestSimulatedContent(username, password, postCount, apiKey);
                };
            }
            
            if (useManualTokenBtn) {
                useManualTokenBtn.onclick = async () => {
                    const token = document.getElementById('manualAccessToken').value.trim();
                    if (token) {
                        display.innerHTML = 'Fetching real LinkedIn posts...';
                        try {
                            // In a real implementation, you would call LinkedIn API directly
                            // For now, we'll simulate the process
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            display.innerHTML = `
                                <div class="token-notice">🔑 <strong>Access Token Provided</strong></div>
                                <p><em>Real LinkedIn API integration would fetch posts here.</em></p>
                                <p>For full functionality, use PostGen Studio with proper OAuth flow.</p>
                                <hr>
                                <p>Falling back to simulated posts:</p>
                            `;
                            setTimeout(() => {
                                this.requestSimulatedContent(username, password, postCount, apiKey);
                            }, 1000);
                        } catch (error) {
                            display.innerHTML = `Token validation failed: ${error.message}`;
                        }
                    } else {
                        alert('Please enter a valid access token');
                    }
                };
            }
            
        } catch (error) {
            console.error('LinkedIn API integration error:', error);
            // Fall back to simulation
            this.requestSimulatedContent(username, password, postCount, apiKey);
        }
    }

    /**
     * Request simulated content (enhanced for PostGen Web)
     */
    async requestSimulatedContent(username, password, postCount, apiKey) {
        const display = document.getElementById('postContentDisplay');
        display.innerHTML = 'Fetching LinkedIn content...';
        
        try {
            // Enhanced mock posts for PostGen Web
            const mockPosts = [
                "🚀 Exciting developments in AI and automation are reshaping how we work. As professionals, staying ahead means embracing continuous learning and adaptation. What skills are you developing to future-proof your career? #AI #ProfessionalDevelopment #Innovation",
                "💡 Leadership isn't about having all the answers—it's about asking the right questions and empowering your team to find solutions. Today's challenge: How can we create more inclusive decision-making processes? #Leadership #Teamwork #Inclusion",
                "🌟 Networking isn't just about collecting contacts; it's about building meaningful relationships that create mutual value. Quality over quantity always wins. What's your approach to authentic professional networking? #Networking #Relationships #CareerGrowth",
                "📈 Data-driven decision making is crucial, but don't forget the human element. The best strategies combine analytical insights with emotional intelligence and cultural awareness. #DataScience #Leadership #Strategy",
                "🎯 Setting clear goals is important, but building systems that support those goals is what creates lasting success. Focus on the process, and the results will follow. #GoalSetting #Productivity #Success",
                "🌱 Continuous learning isn't just a buzzword—it's a survival skill in today's economy. The professionals who thrive are those who stay curious and adaptable. What's the most valuable skill you've learned recently? #ContinuousLearning #Growth #Adaptation",
                "🤝 Collaboration beats competition every time. The best innovations come from diverse teams working together toward a common goal. How do you foster collaboration in your workplace? #Collaboration #Teamwork #Innovation",
                "📊 In a world of endless data, the real skill is knowing which metrics matter. Focus on the numbers that drive meaningful outcomes, not just vanity metrics. #Analytics #Strategy #DataDriven"
            ];
            
            const maxPosts = apiKey ? 30 : 5;
            const actualCount = Math.min(postCount, maxPosts, mockPosts.length);
            const selectedPosts = mockPosts.slice(0, actualCount);
            
            let content = selectedPosts.join('\n\n---\n\n');
            content = `<div class="simulation-notice">📝 <strong>Simulated LinkedIn Posts</strong> (Use PostGen Studio for real LinkedIn API integration)</div>\n\n${content}`;
            
            display.innerHTML = content;
            display.classList.remove('empty');
            
            // Update profile section
            updateLinkedInProfile(username);
            
        } catch (error) {
            console.error('LinkedIn request error:', error);
            display.innerHTML = 'LinkedIn connection error';
        }
    }

    /**
     * Check if running on GitHub Pages
     */
    isRunningOnGitHubPages() {
        return this.isGitHubPages;
    }

    /**
     * Get integration recommendations
     */
    getIntegrationRecommendations() {
        return {
            static_site: "PostGen Web is a static site - use PostGen Studio for full LinkedIn OAuth",
            manual_token: "Advanced users can manually provide LinkedIn access tokens",
            browser_extension: "Consider using LinkedIn data export browser extensions",
            postgen_studio: "Use PostGen Studio (FastAPI backend) for complete LinkedIn integration"
        };
    }
}

// Create global instance
window.linkedInIntegration = new LinkedInIntegration();

// Expose debugging function
window.debugLinkedIn = function() {
    console.log('=== LinkedIn Integration Debug Info (PostGen Web) ===');
    console.log('linkedInIntegration:', window.linkedInIntegration);
    console.log('isGitHubPages:', window.linkedInIntegration.isRunningOnGitHubPages());
    console.log('recommendations:', window.linkedInIntegration.getIntegrationRecommendations());
};
