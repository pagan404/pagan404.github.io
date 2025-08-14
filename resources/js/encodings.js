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
        this.currentEncoding = 'morse';
        this.initializeInterface();
    }

    initializeInterface() {
        // Get DOM elements
        this.textInput = document.getElementById('text-input');
        this.encodedOutput = document.getElementById('encoded-output');
        this.textToEncodedBtn = document.getElementById('text-to-encoded');
        this.encodedToTextBtn = document.getElementById('encoded-to-text');
        this.clearBtn = document.getElementById('clear-all');
        this.copyBtn = document.getElementById('copy-result');
        this.encodingSelector = document.getElementById('encoding-selector');

        // Dynamic text elements
        this.converterTitle = document.getElementById('converter-title');
        this.converterDescription = document.getElementById('converter-description');
        this.outputLabel = document.getElementById('output-label');
        this.helpText = document.getElementById('help-text');
        this.encodeBtnText = document.getElementById('encode-btn-text');
        this.decodeBtnText = document.getElementById('decode-btn-text');

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        if (this.textToEncodedBtn) {
            this.textToEncodedBtn.addEventListener('click', () => this.convertTextToEncoded());
        }

        if (this.encodedToTextBtn) {
            this.encodedToTextBtn.addEventListener('click', () => this.convertEncodedToText());
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

        // Encoding selector change (for future functionality)
        if (this.encodingSelector) {
            this.encodingSelector.addEventListener('change', () => this.handleEncodingChange());
        }
    }

    handleEncodingChange() {
        // For now, just update the UI text - functionality will be added later
        const selectedValue = this.encodingSelector.value;
        this.currentEncoding = selectedValue;
        this.updateUIForEncoding(selectedValue);
        this.clearAll(); // Clear inputs when switching encoding types
    }

    updateUIForEncoding(encodingType) {
        const encodingConfigs = {
            morse: {
                title: 'Morse Code Converter',
                description: 'Convert text to Morse code and back. Type in either field for real-time conversion.',
                outputLabel: 'Morse Code Output',
                helpText: 'Enter text in the left box to see Morse code, or enter Morse code in the right box to see text. Use dots (.) and dashes (-) separated by spaces for Morse code input.',
                encodeBtnText: 'Text → Morse',
                decodeBtnText: 'Morse → Text',
                placeholder: 'Morse code will appear here...'
            },
            binary: {
                title: 'Binary Converter',
                description: 'Convert text to binary and back. Each character becomes its binary representation.',
                outputLabel: 'Binary Output',
                helpText: 'Enter text in the left box to see binary code, or enter binary code in the right box to see text. Use 8-bit binary groups separated by spaces.',
                encodeBtnText: 'Text → Binary',
                decodeBtnText: 'Binary → Text',
                placeholder: 'Binary code will appear here...'
            },
            braille: {
                title: 'Braille Converter',
                description: 'Convert text to Braille and back. Uses Grade 1 Braille character mapping.',
                outputLabel: 'Braille Output',
                helpText: 'Enter text in the left box to see Braille characters, or enter Braille in the right box to see text. Uses standard 6-dot Braille patterns.',
                encodeBtnText: 'Text → Braille',
                decodeBtnText: 'Braille → Text',
                placeholder: 'Braille characters will appear here...'
            },
            hex: {
                title: 'Hexadecimal Converter',
                description: 'Convert text to hexadecimal and back. Each character becomes its hex representation.',
                outputLabel: 'Hexadecimal Output',
                helpText: 'Enter text in the left box to see hexadecimal code, or enter hex code in the right box to see text. Uses standard ASCII hex encoding.',
                encodeBtnText: 'Text → Hex',
                decodeBtnText: 'Hex → Text',
                placeholder: 'Hexadecimal code will appear here...'
            }
        };

        const config = encodingConfigs[encodingType];
        if (config) {
            this.converterTitle.textContent = config.title;
            this.converterDescription.textContent = config.description;
            this.outputLabel.textContent = config.outputLabel;
            this.helpText.textContent = config.helpText;
            this.encodeBtnText.textContent = config.encodeBtnText;
            this.decodeBtnText.textContent = config.decodeBtnText;
            this.encodedOutput.placeholder = config.placeholder;
        }
    }

    convertTextToEncoded() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to convert');
            return;
        }

        try {
            let encodedText;
            
            // For now, only Morse code works - others will show placeholder
            switch (this.currentEncoding) {
                case 'morse':
                    encodedText = window.textToMorse ? window.textToMorse(text) : morse.textToMorse(text);
                    break;
                case 'binary':
                    // Standard 8-bit binary conversion
                    encodedText = text.split('').map(char => 
                        char.charCodeAt(0).toString(2).padStart(8, '0')
                    ).join(' ');
                    break;
                case 'braille':
                    // Placeholder for braille conversion
                    encodedText = '⠞⠓⠊⠎ ⠊⠎ ⠁ ⠏⠇⠁⠉⠑⠓⠕⠇⠙⠑⠗';
                    break;
                case 'hex':
                    // Standard ASCII/Unicode hex conversion
                    encodedText = text.split('').map(char => 
                        char.charCodeAt(0).toString(16).toUpperCase()
                    ).join(' ');
                    break;
                default:
                    throw new Error('Unknown encoding type');
            }
            
            this.encodedOutput.value = encodedText;
            this.showMessage(`Text converted to ${this.currentEncoding}!`, 'success');
        } catch (error) {
            this.showMessage('Error converting text: ' + error.message, 'error');
        }
    }

    convertEncodedToText() {
        const encodedText = this.encodedOutput.value.trim();
        if (!encodedText) {
            this.showMessage(`Please enter ${this.currentEncoding} code to convert`);
            return;
        }

        try {
            let decodedText;
            
            // For now, only Morse code works - others will show placeholder
            switch (this.currentEncoding) {
                case 'morse':
                    decodedText = window.morseToText ? window.morseToText(encodedText) : morse.morseToText(encodedText);
                    break;
                case 'binary':
                    // Placeholder for binary decoding
                    decodedText = encodedText.split(' ').map(binary => 
                        String.fromCharCode(parseInt(binary, 2))
                    ).join('');
                    break;
                case 'braille':
                    // Placeholder for braille decoding
                    decodedText = 'this is a placeholder';
                    break;
                case 'hex':
                    // Placeholder for hex decoding
                    decodedText = encodedText.split(' ').map(hex => 
                        String.fromCharCode(parseInt(hex, 16))
                    ).join('');
                    break;
                default:
                    throw new Error('Unknown encoding type');
            }
            
            this.textInput.value = decodedText;
            this.showMessage(`${this.currentEncoding} code converted to text!`, 'success');
        } catch (error) {
            this.showMessage(`Error converting ${this.currentEncoding} code: ` + error.message, 'error');
        }
    }

    handleRealTimeConversion() {
        // Only enable real-time for morse code for now
        if (this.currentEncoding !== 'morse') return;
        
        // Optional: Convert as user types (with debouncing)
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const text = this.textInput.value.trim();
            if (text && text.length > 0) {
                try {
                    const morseCode = window.textToMorse ? window.textToMorse(text) : morse.textToMorse(text);
                    this.encodedOutput.value = morseCode;
                } catch (error) {
                    // Silently fail for real-time conversion
                }
            }
        }, 500); // 500ms debounce
    }

    clearAll() {
        this.textInput.value = '';
        this.encodedOutput.value = '';
        this.showMessage('All fields cleared', 'info');
    }

    async copyResult() {
        const result = this.encodedOutput.value.trim();
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
            const container = document.querySelector('.converter-container') || document.querySelector('main');
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
