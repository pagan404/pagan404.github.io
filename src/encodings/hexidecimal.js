// The script converts decimal numbers to hex and vice vera

// object that maps number values to the hex values

const decimalHex = {
    0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 
    10:'A', 11:'B', 12:'C', 13:'D', 14:'E', 15:'F' 
}

// Reverse decimal hex dictionary
const hexDecimal = Object.entries(decimalHex).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {}
);

// helper function to check if all passed values are valid hex characters
function isHexString(str) {
    return /^[\dA-F]+$/.test(str);
}

// helper function to check if all passed values are valid numerical characters
function isNumericString(str) {
    return /^\d+$/.test(str);
}

// function to convert decimal to hex

function decimalToHex(decimal) {
    if (!isNumericString(decimal) || decimal < 0 || !Number.isInteger(Number(decimal))) {
        return "Please enter a valid, whole, non-negative number!";
    }
    if (decimal < 16) {
        return decimalHex[decimal];
    }
    let hex = '';
    do {
        let remainder = decimal % 16;
        hex = decimalHex[remainder] + hex;
        decimal = Math.floor(decimal / 16);
    } while (decimal >= 16)
    hex = decimalHex[decimal] + hex;
    return hex;
}

// function to convert hex to decimal

function hexToDecimal (hex) {
    if (!isHexString(hex)) {
        return "Please enter a valid hex string";
    }
    hex = hex.split('').reverse()
    let exponent = 0;
    let decimal = 0;
    for (let digit of hex) {
        digit = hexDecimal[digit];
        let decimalDigit = digit * (16**exponent);
        decimal = decimal + decimalDigit;
        exponent += 1;
    }
    return decimal;
}


// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (for tests)
    module.exports = {
        decimalToHex,
        hexToDecimal
    };
} else {
    // Browser environment (for website)
    // Functions are already globally available
    // No action needed - they're declared with 'function' keyword
}
