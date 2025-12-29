// The scripts converts decimal numbers and text to binary and vice versa

// Function to convert from decimal to binary

export function decimalToBinary(number) {
    if (!Number.isInteger(number) || number < 0) {
        return "Please enter a valid, whole, non-negative number!";
    }
    let binary = number.toString(2);
    // Only pad if not already a multiple of 8
    if (binary.length % 8 !== 0) {
        binary = binary.padStart(Math.ceil(binary.length / 8) * 8, '0');
    }
    return binary.match(/.{1,8}/g).join(" ");
}


// Function to convert from text to binary
export function textToBinary(text) {
    if (typeof text !== 'string') {
        return "Input must be a string";
    }

    return text.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
}

// Logic to convert from binary to decimal

// Helper function to check if string contains only 1's and 0's
function isBinaryString(str) {
    return /^[01]+$/.test(str);
}

// Function to convert from binary to decimal
export function binaryToDecimal(binary) {
    binary = binary.trim().split(' ').join(''); // Remove spaces
    if (!isBinaryString(binary)) {
        return "Please enter a valid binary string";
    }
    return parseInt(binary, 2).toString();
}

// Function to convert from binary to text

export function binaryToText(binary) {
    if (!isBinaryString(binary.trim().split(' ').join(''))) {
        return "Please enter a valid binary string";
    }
    const binaryArray = binary.split(' ');
    let text = '';
    for (let i = 0; i < binaryArray.length; i++) {
        const charCode = parseInt(binaryArray[i], 2);
        if (!isNaN(charCode)) {
            text += String.fromCharCode(charCode);
        }
    }
    return text;
}
