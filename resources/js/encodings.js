// Frontend interface for encoding functionality
// Loads the UMD morse module and handles user interactions

// Import the morse module (works with UMD pattern)
let morse;
if (typeof require !== 'undefined') {
    // Node.js environment
    morse = require('../../scripts/morse.js');
} else {
    // Browser environment - morse is loaded via script tag
    // The morse module will be available globally
}

class EncodingsInterface {
    constructor() {
        this.initializeMorseInterface();
    }

    initializeMorseInterface() {
        // Get DOM elements
        this.textInput = document.getElementById('text-input');
        this.morseOutput = document.getElementById('morse-output');
        this.textToMorseBtn = document.getElementById('text-to-morse');
        this.morseToTextBtn = document.getElementById('morse-to-text');
        this.clearBtn = document.getElementById('clear-all');
        this.copyBtn = document.getElementById('copy-result');

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        if (this.textToMorseBtn) {
            this.textToMorseBtn.addEventListener('click', () => this.convertTextToMorse());
        }

        if (this.morseToTextBtn) {
            this.morseToTextBtn.addEventListener('click', () => this.convertMorseToText());
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyResult());
        }

        // Real-time conversion as user types
        if (this.textInput) {
            this.textInput.addEventListener('input', () => this.handleRealTimeConversion());
        }
    }

    convertTextToMorse() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to convert');
            return;
        }

        try {
            // Use the global morse functions loaded from UMD module
            const morseCode = window.textToMorse ? window.textToMorse(text) : morse.textToMorse(text);
            this.morseOutput.value = morseCode;
            this.showMessage('Text converted to Morse code!', 'success');
        } catch (error) {
            this.showMessage('Error converting text: ' + error.message, 'error');
        }
    }

    convertMorseToText() {
        const morseCode = this.morseOutput.value.trim();
        if (!morseCode) {
            this.showMessage('Please enter Morse code to convert');
            return;
        }

        try {
            // Use the global morse functions loaded from UMD module
            const text = window.morseToText ? window.morseToText(morseCode) : morse.morseToText(morseCode);
            this.textInput.value = text;
            this.showMessage('Morse code converted to text!', 'success');
        } catch (error) {
            this.showMessage('Error converting Morse code: ' + error.message, 'error');
        }
    }

    handleRealTimeConversion() {
        // Optional: Convert as user types (with debouncing)
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const text = this.textInput.value.trim();
            if (text && text.length > 0) {
                try {
                    const morseCode = window.textToMorse ? window.textToMorse(text) : morse.textToMorse(text);
                    this.morseOutput.value = morseCode;
                } catch (error) {
                    // Silently fail for real-time conversion
                }
            }
        }, 500); // 500ms debounce
    }

    clearAll() {
        this.textInput.value = '';
        this.morseOutput.value = '';
        this.showMessage('All fields cleared', 'info');
    }

    async copyResult() {
        const result = this.morseOutput.value.trim();
        if (!result) {
            this.showMessage('Nothing to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(result);
            this.showMessage('Result copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopy(result);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('Result copied to clipboard!', 'success');
        } catch (error) {
            this.showMessage('Could not copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageElement = document.getElementById('encoding-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'encoding-message';
            messageElement.className = 'encoding-message';
            
            // Insert after the header or at the top of the converter
            const container = document.querySelector('.morse-converter') || document.querySelector('main');
            if (container) {
                container.insertBefore(messageElement, container.firstChild);
            }
        }

        messageElement.textContent = message;
        messageElement.className = `encoding-message ${type}`;
        
        // Auto-hide after 3 seconds
        clearTimeout(this.messageTimer);
        this.messageTimer = setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EncodingsInterface();
});

// Export for Node.js testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EncodingsInterface;
}
