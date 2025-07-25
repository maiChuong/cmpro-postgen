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
            const sdkLoaded = await this._waitForPuterSDK(5000); // Wait up to 5 seconds

            if (!sdkLoaded) {
                console.error('Puter SDK not loaded - window.puter is undefined after timeout');
                this.isAvailable = false;
                this.isInitialized = true;
                return false;
            }

            console.log('Puter SDK found, testing connection...');

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
     * Waits for the Puter SDK to be available on the window object.
     * @param {number} timeout - The maximum time to wait in milliseconds.
     * @returns {Promise<boolean>} - True if the SDK is found, false otherwise.
     */
    _waitForPuterSDK(timeout = 5000) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (typeof window.puter !== 'undefined') {
                    clearInterval(interval);
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    resolve(false);
                }
            }, 100); // Poll every 100ms
        });
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

            // If the API call to puter.ai.chat completes without throwing an error,
            // we can consider the connection successful. The actual response to "Hi"
            // can vary and isn't a reliable indicator of service health.
            return {
                success: true,
                message: 'Puter AI connection successful'
            };

        } catch (error) {
            console.error('Puter connection test error:', error);
            if (error && error.code === 'forbidden') {
                return {
                    success: false,
                    message: 'Permission denied. Please ensure you are logged into your Puter account.'
                };
            }
            return {
                success: false,
                message: `Connection error: ${error.message || 'Unknown error'}`
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

            // An empty string is a valid response from the AI.
            return {
                success: true,
                content: content.trim(),
                model: useModel
            };

        } catch (error) {
            console.error('Puter content generation error:', error);
            if (error && error.code === 'forbidden') {
                return {
                    success: false,
                    message: 'Permission denied. Please ensure you are logged into your Puter account and have granted the app necessary permissions.'
                };
            }
            return {
                success: false,
                message: `${error.message || 'Unknown error'}`
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
