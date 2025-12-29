// The script converts decimal numbers and text to hex and vice versa

// helper functions

function isHexString(str) {
    return /^[\dA-F]+$/.test(str);
}

function isNumericString(str) {
    return /^\d+$/.test(str);
}

// function to convert decimal to hex

export function decimalToHex(decimal) {
    if (!isNumericString(decimal) || decimal < 0 || !Number.isInteger(Number(decimal))) {
        return "Please enter a valid, whole, non-negative number!";
    }
    let hex = decimal.toString(16).toUpperCase();
    return hex;
}

// function to convert text to hex

export function textToHex(text) {
    if (typeof text !== 'string') {
        return 'Input must be a string';
    }
    let encodedText = text.split('').map(char => 
        char.charCodeAt(0).toString(16).toUpperCase()
    ).join(' ');
    return encodedText;
}

// function to convert hex to decimal

export function hexToDecimal (hex) {
    if (!isHexString(hex)) {
        return "Please enter a valid hex string";
    }
    let decimal = parseInt(hex.split(' ').join(''), 16);
    return decimal;
}

// function to convert hex to text
export function hexToText(hex) {
    if (!isHexString(hex)) {
        return "Please enter a valid hex string";
    }
    let decodedText = hex.split(' ').map(hex => 
        String.fromCharCode(parseInt(hex, 16))
    ).join('');
    return decodedText;
}
