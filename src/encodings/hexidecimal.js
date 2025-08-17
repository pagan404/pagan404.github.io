// The script converts decimal numbers and text to hex and vice versa

// function to convert decimal to hex

function decimalToHex(decimal) {
    if (!isNumericString(decimal) || decimal < 0 || !Number.isInteger(Number(decimal))) {
        return "Please enter a valid, whole, non-negative number!";
    }
    let hex = decimal.toString(16).toUpperCase();
    return hex;
}

// function to convert text to hex

function textToHex(text) {
    if (typeof text !== 'string') {
        throw new Error('Input must be a string');
    }
    let encodedText = text.split('').map(char => 
        char.charCodeAt(0).toString(16).toUpperCase()
    ).join(' ');
    return encodedText;
}

// function to convert hex to decimal

function hexToDecimal (hex) {
    if (!isHexString(hex)) {
        return "Please enter a valid hex string";
    }
    let decimal = parseInt(hex.split(' ').join(''), 16);
    return decimal;
}

// function to convert hex to text
function hexToText(hex) {
    if (!isHexString(hex)) {
        return "Please enter a valid hex string";
    }
    let decodedText = hex.split(' ').map(hex => 
        String.fromCharCode(parseInt(hex, 16))
    ).join('');
    return decodedText;
}

// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (for tests)
    module.exports = {
        decimalToHex,
        textToHex,
        hexToDecimal,
        hexToText
    };
} else {
    // Browser environment (for website)
    // Functions are already globally available
    // No action needed - they're declared with 'function' keyword
}
