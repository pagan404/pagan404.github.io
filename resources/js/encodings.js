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
        this.currentConversionType = 'number'; // Default for binary/hex
        this.encodingConfigs = {
            morse: {
                title: 'Morse Code Converter',
                description: 'Convert text to Morse code and back. Type in either field for real-time conversion.',
                inputLabel: 'Text Input',
                outputLabel: 'Morse Code Output',
                encodeBtn: 'Text → Morse',
                decodeBtn: 'Morse → Text',
                helpText: 'Enter text in the left box to see Morse code, or enter Morse code in the right box to see text. Use dots (.) and dashes (-) separated by spaces for Morse code input.',
                showConversionType: false
            },
            binary: {
                title: 'Binary Converter',
                description: 'Convert numbers or text to binary and back. Choose your conversion type above.',
                inputLabel: 'Input',
                outputLabel: 'Binary Output',
                encodeBtn: 'Convert → Binary',
                decodeBtn: 'Binary → Convert',
                helpText: 'Choose between Numbers or Text mode above. For numbers: enter decimal values. For text: enter any text to convert to binary.',
                showConversionType: true
            },
            braille: {
                title: 'Braille Converter',
                description: 'Convert text to Braille patterns and back.',
                inputLabel: 'Text Input',
                outputLabel: 'Braille Output',
                encodeBtn: 'Text → Braille',
                decodeBtn: 'Braille → Text',
                helpText: 'Enter text to convert to Braille patterns, or Braille to convert back to text.',
                showConversionType: false
            },
            hex: {
                title: 'Hexadecimal Converter',
                description: 'Convert numbers or text to hexadecimal and back. Choose your conversion type above.',
                inputLabel: 'Input',
                outputLabel: 'Hexadecimal Output',
                encodeBtn: 'Convert → Hex',
                decodeBtn: 'Hex → Convert',
                helpText: 'Choose between Numbers or Text mode above. For numbers: enter decimal values. For text: enter any text to convert to hexadecimal.',
                showConversionType: true
            }
        };
    }

    // Initialize the converter
    init() {
        this.setupEventListeners();
        this.updateInterface(); // Set initial interface
    }

    // Set up all event listeners
    setupEventListeners() {
        // Encoding type selector
        const encodingSelector = document.getElementById('encoding-selector');
        if (encodingSelector) {
            encodingSelector.addEventListener('change', (e) => {
                this.currentEncoding = e.target.value;
                this.updateInterface();
                this.clearFields();
            });
        }

        // Conversion type selector (for binary/hex)
        const conversionTypeSelector = document.getElementById('conversion-type-selector');
        if (conversionTypeSelector) {
            conversionTypeSelector.addEventListener('change', (e) => {
                this.currentConversionType = e.target.value;
                this.updateLabelsForConversionType();
                this.clearFields();
            });
        }

        // Input field listeners
        const textInput = document.getElementById('text-input');
        const encodedOutput = document.getElementById('encoded-output');

        if (textInput) {
            textInput.addEventListener('input', () => this.handleTextInput());
        }

        if (encodedOutput) {
            encodedOutput.addEventListener('input', () => this.handleEncodedInput());
        }

        // Button listeners
        const textToEncodedBtn = document.getElementById('text-to-encoded');
        const encodedToTextBtn = document.getElementById('encoded-to-text');
        const clearBtn = document.getElementById('clear-all');
        const copyBtn = document.getElementById('copy-result');

        if (textToEncodedBtn) {
            textToEncodedBtn.addEventListener('click', () => this.convertTextToEncoded());
        }

        if (encodedToTextBtn) {
            encodedToTextBtn.addEventListener('click', () => this.convertEncodedToText());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFields());
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyResult());
        }
    }

    // Update the interface based on selected encoding
    updateInterface() {
        const config = this.encodingConfigs[this.currentEncoding];
        if (!config) return;

        // Update title and description
        this.updateElement('converter-title', config.title);
        this.updateElement('converter-description', config.description);
        this.updateElement('help-text', config.helpText);

        // Update labels and buttons
        this.updateElement('input-label', config.inputLabel);
        this.updateElement('output-label', config.outputLabel);
        this.updateElement('encode-btn-text', config.encodeBtn);
        this.updateElement('decode-btn-text', config.decodeBtn);

        // Show/hide conversion type selector
        const conversionTypeContainer = document.getElementById('conversion-type-container');
        if (conversionTypeContainer) {
            if (config.showConversionType) {
                conversionTypeContainer.style.display = 'block';
                this.updateLabelsForConversionType();
            } else {
                conversionTypeContainer.style.display = 'none';
            }
        }

        // Update placeholders
        this.updatePlaceholders();
    }

    // Update labels based on conversion type for binary/hex
    updateLabelsForConversionType() {
        const config = this.encodingConfigs[this.currentEncoding];
        if (!config || !config.showConversionType) return;

        const isNumber = this.currentConversionType === 'number';
        
        if (this.currentEncoding === 'binary') {
            this.updateElement('input-label', isNumber ? 'Decimal Number' : 'Text Input');
            this.updateElement('encode-btn-text', isNumber ? 'Decimal → Binary' : 'Text → Binary');
            this.updateElement('decode-btn-text', isNumber ? 'Binary → Decimal' : 'Binary → Text');
        } else if (this.currentEncoding === 'hex') {
            this.updateElement('input-label', isNumber ? 'Decimal Number' : 'Text Input');
            this.updateElement('encode-btn-text', isNumber ? 'Decimal → Hex' : 'Text → Hex');
            this.updateElement('decode-btn-text', isNumber ? 'Hex → Decimal' : 'Hex → Text');
        }

        this.updatePlaceholders();
    }

    // Update placeholders based on current mode
    updatePlaceholders() {
        const textInput = document.getElementById('text-input');
        const encodedOutput = document.getElementById('encoded-output');

        if (!textInput || !encodedOutput) return;

        switch (this.currentEncoding) {
            case 'morse':
                textInput.placeholder = 'Enter your text here...';
                encodedOutput.placeholder = 'Morse code will appear here...';
                break;
            case 'binary':
                if (this.currentConversionType === 'number') {
                    textInput.placeholder = 'Enter decimal number (e.g., 42)...';
                    encodedOutput.placeholder = 'Binary will appear here...';
                } else {
                    textInput.placeholder = 'Enter text to convert...';
                    encodedOutput.placeholder = 'Binary will appear here...';
                }
                break;
            case 'hex':
                if (this.currentConversionType === 'number') {
                    textInput.placeholder = 'Enter decimal number (e.g., 255)...';
                    encodedOutput.placeholder = 'Hexadecimal will appear here...';
                } else {
                    textInput.placeholder = 'Enter text to convert...';
                    encodedOutput.placeholder = 'Hexadecimal will appear here...';
                }
                break;
            case 'braille':
                textInput.placeholder = 'Enter your text here...';
                encodedOutput.placeholder = 'Braille patterns will appear here...';
                break;
        }
    }

    // Handle text input conversion
    handleTextInput() {
        const textInput = document.getElementById('text-input');
        const encodedOutput = document.getElementById('encoded-output');
        
        if (!textInput || !encodedOutput) return;

        const inputText = textInput.value;
        if (!inputText.trim()) {
            encodedOutput.value = '';
            return;
        }

        try {
            let result = '';
            
            switch (this.currentEncoding) {
                case 'morse':
                    if (typeof window.textToMorse !== 'undefined') {
                        result = window.textToMorse(inputText);
                    }
                    break;
                case 'binary':
                    if (this.currentConversionType === 'number') {
                        const num = parseInt(inputText);
                        if (!isNaN(num)) {
                            result = window.binaryToDecimal(num);
                        }
                    } else {
                        result = window.binaryToText(inputText);
                    }
                    break;
                case 'hex':
                    if (this.currentConversionType === 'number') {
                        const num = parseInt(inputText);
                        if (!isNaN(num)) {
                            result = window.hexToDecimal(num);
                        }
                    } else {
                        result = window.hexToText(inputText);
                    }
                    break;
            }
            
            encodedOutput.value = result;
        } catch (error) {
            console.error('Encoding error:', error);
            encodedOutput.value = 'Error: ' + error.message;
        }
    }

    // Handle encoded input conversion
    handleEncodedInput() {
        const textInput = document.getElementById('text-input');
        const encodedOutput = document.getElementById('encoded-output');
        
        if (!textInput || !encodedOutput) return;

        const encodedText = encodedOutput.value;
        if (!encodedText.trim()) {
            textInput.value = '';
            return;
        }

        try {
            let result = '';
            
            switch (this.currentEncoding) {
                case 'morse':
                    if (typeof window.morseToText !== 'undefined') {
                        result = window.morseToText(encodedText);
                    }
                    break;
                case 'binary':
                    if (this.currentConversionType === 'number') {
                        result = window.binaryToDecimal(encodedText).toString();
                    } else {
                        result = window.binaryToText(encodedText);
                    }
                    break;
                case 'hex':
                    if (this.currentConversionType === 'number') {
                        result = window.hexToDecimal(encodedText).toString();
                    } else {
                        result = window.hexToText(encodedText);
                    }
                    break;
            }
            
            textInput.value = result;
        } catch (error) {
            console.error('Decoding error:', error);
            textInput.value = 'Error: ' + error.message;
        }
    }

    // Convert text to encoded format
    convertTextToEncoded() {
        this.handleTextInput();
    }

    // Convert encoded format to text
    convertEncodedToText() {
        this.handleEncodedInput();
    }

    // Clear all input fields
    clearFields() {
        const textInput = document.getElementById('text-input');
        const encodedOutput = document.getElementById('encoded-output');
        
        if (textInput) textInput.value = '';
        if (encodedOutput) encodedOutput.value = '';
    }

    // Copy result to clipboard
    copyResult() {
        const encodedOutput = document.getElementById('encoded-output');
        if (encodedOutput && encodedOutput.value) {
            navigator.clipboard.writeText(encodedOutput.value).then(() => {
                // Visual feedback
                const copyBtn = document.getElementById('copy-result');
                if (copyBtn) {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }

    // Utility method to update element content
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
}

// Initialize the interface when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const encodingsInterface = new EncodingsInterface();
    encodingsInterface.init();
});
