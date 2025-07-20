/**
 * Puter.js SDK Integration for PostGen Web
 * Handles direct Puter AI interactions using the JavaScript SDK
 */

class PuterIntegration {
    constructor() {
        this.isInitialized = false;
        this.isAvailable = false;
        this.defaultModel = 'gpt-4o';
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
        try {
            // Check if Puter SDK is loaded
            if (typeof puter === 'undefined') {
                console.error('Puter SDK not loaded');
                this.isAvailable = false;
                return false;
            }

            // Test Puter availability with a simple query
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
     * Test Puter connection
     */
    async testConnection() {
        try {
            if (typeof puter === 'undefined') {
                return {
                    success: false,
                    message: 'Puter SDK not loaded'
                };
            }

            // Simple test query to check if Puter is working
            const response = await puter.ai.chat("Hello, are you available?", {
                model: this.defaultModel,
                max_tokens: 50
            });

            if (response && response.message) {
                return {
                    success: true,
                    message: 'Puter AI is available',
                    response: response.message
                };
            } else {
                return {
                    success: false,
                    message: 'Puter AI test failed - no response'
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
     * Generate content using Puter AI
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

            const response = await puter.ai.chat(prompt, {
                model: useModel,
                max_tokens: 500,
                temperature: 0.7
            });

            console.log('Puter AI raw response:', response);

            // Handle different response formats with robust type checking
            let content = '';
            if (typeof response === 'string') {
                content = response;
            } else if (response && typeof response.message === 'string') {
                content = response.message;
            } else if (response && typeof response.content === 'string') {
                content = response.content;
            } else if (response && typeof response.text === 'string') {
                content = response.text;
            } else if (response && response.choices && response.choices[0] && typeof response.choices[0].message === 'string') {
                content = response.choices[0].message;
            } else if (response && response.choices && response.choices[0] && response.choices[0].message && typeof response.choices[0].message.content === 'string') {
                content = response.choices[0].message.content;
            } else {
                console.error('Unexpected Puter response format:', response);
                return {
                    success: false,
                    message: 'Unexpected response format from Puter AI'
                };
            }

            // Ensure content is a string before calling trim
            const finalContent = typeof content === 'string' ? content.trim() : String(content || '').trim();
            
            if (finalContent) {
                return {
                    success: true,
                    content: finalContent,
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
                message: 'Puter AI is ready via JavaScript SDK'
            };
        } else {
            return {
                status: 'unavailable',
                message: 'Puter AI is not available - check SDK loading'
            };
        }
    }
}

// Create global instance
window.puterIntegration = new PuterIntegration();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Puter SDK after a short delay to ensure everything is loaded
    setTimeout(() => {
        window.puterIntegration.initialize();
    }, 1000);
});
