/**
 * Puter.js SDK Integration for PostGen Web
 * Direct implementation based on user example
 */

class PuterIntegration {
    constructor() {
        this.isInitialized = false;
        this.isAvailable = false;
        this.defaultModel = 'gpt-4.1-nano';
        this.initializationPromise = null;
    }

    /**
     * Initialize Puter SDK
     */
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._doInitialize();
        return this.initializationPromise;
    }

    async _doInitialize() {
        console.log('Initializing Puter SDK...');
        
        try {
            // Wait for DOM and scripts to load
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });

            // Additional wait for external scripts
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if Puter SDK is loaded
            if (typeof puter === 'undefined') {
                console.error('Puter SDK not loaded - window.puter is undefined');
                this.isAvailable = false;
                this.isInitialized = true;
                return false;
            }

            console.log('Puter SDK found, testing connection...');

            // Test connection using the exact pattern from user example
            const testResult = await this.testConnection();
            this.isAvailable = testResult.success;
            this.isInitialized = true;

            console.log('Puter SDK initialized:', this.isAvailable ? 'Available' : 'Unavailable');
            return this.isAvailable;

        } catch (error) {
            console.error('Puter SDK initialization error:', error);
            this.isAvailable = false;
            this.isInitialized = true;
            return false;
        }
    }

    /**
     * Test Puter connection using the exact pattern from user example
     */
    async testConnection() {
        try {
            console.log('Testing Puter connection with user example pattern...');
            
            // Check if puter.ai.chat exists
            if (!puter || !puter.ai || typeof puter.ai.chat !== 'function') {
                console.error('puter.ai.chat is not available');
                return {
                    success: false,
                    message: 'puter.ai.chat is not available'
                };
            }

            // Test using exact pattern from user example
            const response = await puter.ai.chat("Hi", { model: this.defaultModel });
            
            console.log('Puter connection test response:', response);

            // Check if we got a valid response
            if (response && (typeof response === 'string' || response.length > 0)) {
                return {
                    success: true,
                    message: 'Puter AI connection successful'
                };
            } else {
                return {
                    success: false,
                    message: 'Puter AI connection test failed - no valid response'
                };
            }

        } catch (error) {
            console.error('Puter connection test error:', error);
            return {
                success: false,
                message: `Puter AI connection error: ${error.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Generate content using Puter AI with user example pattern
     */
    async generateContent(prompt, model = null) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (!this.isAvailable) {
                return {
                    success: false,
                    message: 'Puter AI is not available'
                };
            }

            const useModel = model || this.defaultModel;
            console.log(`Generating content with Puter AI (${useModel}):`, prompt.substring(0, 100) + '...');

            // Use exact pattern from user example
            const response = await puter.ai.chat(prompt, { model: useModel });

            console.log('Puter AI raw response:', response);

            // Handle response - it should be a string based on user example
            let content = '';
            if (typeof response === 'string') {
                content = response.trim();
            } else if (Array.isArray(response) && response.length > 0) {
                content = response.join(' ').trim();
            } else if (response && response.toString) {
                content = response.toString().trim();
            } else {
                console.error('Unexpected Puter response format:', response);
                return {
                    success: false,
                    message: 'Unexpected response format from Puter AI'
                };
            }

            if (content) {
                return {
                    success: true,
                    content: content,
                    model: useModel
                };
            } else {
                return {
                    success: false,
                    message: 'Empty response from Puter AI'
                };
            }

        } catch (error) {
            console.error('Puter content generation error:', error);
            return {
                success: false,
                message: `Puter AI error: ${error.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Check if Puter is available
     */
    async checkAvailability() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.isAvailable;
    }

    /**
     * Get status information
     */
    async getStatus() {
        const isAvailable = await this.checkAvailability();
        
        if (isAvailable) {
            return {
                status: 'connected',
                message: 'Puter Writer is ready for your prompt'
            };
        } else {
            return {
                status: 'unavailable',
                message: 'Puter Writer is not available - check SDK loading'
            };
        }
    }

    /**
     * Force re-initialization
     */
    async reinitialize() {
        this.isInitialized = false;
        this.isAvailable = false;
        this.initializationPromise = null;
        return await this.initialize();
    }
}

// Create global instance
window.puterIntegration = new PuterIntegration();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Puter SDK...');
    setTimeout(() => {
        window.puterIntegration.initialize();
    }, 1500);
});

// Also try on window load as backup
window.addEventListener('load', function() {
    console.log('Window loaded, checking Puter SDK...');
    setTimeout(() => {
        if (!window.puterIntegration.isInitialized) {
            window.puterIntegration.initialize();
        }
    }, 2000);
});

// Expose debugging function
window.debugPuter = function() {
    console.log('=== Puter SDK Debug Info ===');
    console.log('typeof puter:', typeof puter);
    console.log('puter object:', puter);
    console.log('puter.ai available:', puter && puter.ai ? 'YES' : 'NO');
    console.log('puter.ai.chat available:', puter && puter.ai && puter.ai.chat ? 'YES' : 'NO');
    console.log('puterIntegration:', window.puterIntegration);
    console.log('isInitialized:', window.puterIntegration.isInitialized);
    console.log('isAvailable:', window.puterIntegration.isAvailable);
    
    // Test the exact user example
    if (typeof puter !== 'undefined' && puter.ai && puter.ai.chat) {
        console.log('Testing user example pattern...');
        puter.ai.chat("What are the benefits of exercise?", { model: "gpt-4.1-nano" })
            .then(response => {
                console.log('User example test response:', response);
            })
            .catch(error => {
                console.error('User example test error:', error);
            });
    }
};

// Test user example pattern on load
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('Testing user example pattern...');
        if (typeof puter !== 'undefined' && puter.ai && puter.ai.chat) {
            puter.ai.chat("Hello from PostGen Web", { model: "gpt-4.1-nano" })
                .then(response => {
                    console.log('✅ Puter SDK working! Response:', response);
                })
                .catch(error => {
                    console.error('❌ Puter SDK test failed:', error);
                });
        } else {
            console.error('❌ Puter SDK not available for testing');
        }
    }, 3000);
});
